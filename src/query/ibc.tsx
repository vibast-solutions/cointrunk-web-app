// "use client"

import {getSettings} from "@/storage/settings";
import {CounterpartyChainForChannel, DenomTrace} from "@/types/ibc";
import {createHashTraceResolver} from "@/utils/ibc_trace";
import {getFromLocalStorage, setInLocalStorage} from "@/storage/storage";

const IBC_COUNTERPARTY_CACHE_TTL = 0; //never expire

const hashTraceResolver = createHashTraceResolver({
    fetch: (url) => fetch(url),
    restEndpoint: () => getSettings().endpoints.restEndpoint,
    cache: {
        get: getFromLocalStorage,
        set: (key, value, ttl) => { setInLocalStorage(key, value, ttl); },
    },
});

export const getHashIBCTrace = (hash: string): Promise<DenomTrace|undefined> => hashTraceResolver(hash);

const getChannelIdUrl = (channelId: string, portId: string) => {
    const settings = getSettings()

    return `${settings.endpoints.restEndpoint}/ibc/core/channel/v1/channels/${channelId}/ports/${portId}`;
}

const getConnectionIdUrl = (connectionId: string) => {
    const settings = getSettings()

    return `${settings.endpoints.restEndpoint}/ibc/core/connection/v1/connections/${connectionId}`;
}

const getClientStateUrl = (clientId: string) => {
    const settings = getSettings()

    return `${settings.endpoints.restEndpoint}/ibc/core/client/v1/client_states/${clientId}`;
}

const getIbcCounterpartyChainIdCacheKey = (channelId: string, portId: string) => {
    return `ibc:counterparty:${channelId}:${portId}`;
}

/**
 * Find the counterparty chain_id for a channel on *your* chain.
 * - Uses REST API to fetch the channel, connection, and client state.
 * - Never throws; returns undefined on any issue.
 * - Logs errors for observability.
 */
export const counterpartyChainForChannel = async (channelId: string, portId: string = "transfer"): Promise<CounterpartyChainForChannel | undefined> => {
    const cacheKey = getIbcCounterpartyChainIdCacheKey(channelId, portId);
    const cached = getFromLocalStorage(cacheKey);
    if (cached) {
        return JSON.parse(cached) as CounterpartyChainForChannel;
    }

    const result: CounterpartyChainForChannel = {
        chainId: "",
        channelId: "",
    }

    try {
        // 1) channel -> connection
        const chRes = await fetch(getChannelIdUrl(channelId, portId));
        if (!chRes.ok) {
            console.error(`[counterpartyChainForChannel] channel fetch failed: ${chRes.status} ${chRes.statusText}`);
            return undefined;
        }

        const chJson = await chRes.json();
        const connectionId: string | undefined = chJson?.channel?.connection_hops?.[0];
        result.channelId = chJson?.channel?.counterparty?.channel_id;
        if (!connectionId || !result.channelId) {
            console.error(`[counterpartyChainForChannel] no connection_hops for ${channelId}/${portId}`);
            return undefined;
        }

        // 2) connection -> client
        const connRes = await fetch(getConnectionIdUrl(connectionId));
        if (!connRes.ok) {
            console.error(`[counterpartyChainForChannel] connection fetch failed: ${connRes.status} ${connRes.statusText}`);
            return undefined;
        }
        const connJson = await connRes.json();
        const clientId: string | undefined = connJson?.connection?.client_id;
        if (!clientId) {
            console.error(`[counterpartyChainForChannel] no client_id on ${connectionId}`);
            return undefined;
        }

        // 3) client state -> counterparty chain_id
        const csRes = await fetch(getClientStateUrl(clientId));
        if (!csRes.ok) {
            console.error(`[counterpartyChainForChannel] client_state fetch failed: ${csRes.status} ${csRes.statusText}`);
            return undefined;
        }
        const csJson = await csRes.json();
        const clientState = csJson?.client_state?.value ?? csJson?.client_state;
        const chainId: string | undefined = clientState?.chain_id ?? clientState?.chainId;

        if (!chainId) {
            console.error(`[counterpartyChainForChannel] chain_id missing in client_state for ${clientId}`);
            return undefined;
        }

        result.chainId = chainId;

        setInLocalStorage(cacheKey, JSON.stringify(result), IBC_COUNTERPARTY_CACHE_TTL);

        return result;
    } catch (err) {
        console.error("[counterpartyChainForChannel] unexpected error:", err);
        return undefined;
    }
}

