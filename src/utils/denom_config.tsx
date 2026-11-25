import {CacheStore, FetchFn} from "@/utils/ibc_trace";
import {isFactoryDenom} from "@/utils/denom";

export interface DenomConfig {
    gasSurcharge: string;
}

export interface DenomConfigDeps {
    fetch: FetchFn;
    restEndpoint: () => string;
    cache: CacheStore;
}

const DENOM_CONFIG_CACHE_KEY = "bze:denom_config";
const DENOM_CONFIG_CACHE_TTL = 5 * 60;
const ZERO_CONFIG: DenomConfig = {gasSurcharge: "0"};

/**
 * Reads the tokenfactory config of a factory denom. Non-factory denoms never hit the network;
 * a node without the route (501) or any error yields zeros, so fees stay as before.
 */
export const createDenomConfigQuery = (deps: DenomConfigDeps) => async (denom: string): Promise<DenomConfig> => {
    if (!isFactoryDenom(denom)) {
        return ZERO_CONFIG;
    }

    const cacheKey = `${DENOM_CONFIG_CACHE_KEY}:${denom}`;
    const cached = deps.cache.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    try {
        const resp = await deps.fetch(`${deps.restEndpoint()}/bze/tokenfactory/denom_config?denom=${encodeURIComponent(denom)}`);
        if (resp.status !== 200) {
            return ZERO_CONFIG;
        }
        const json = await resp.json();
        const surcharge = Number(json?.config?.gas_surcharge);
        const config: DenomConfig = {gasSurcharge: Number.isFinite(surcharge) && surcharge > 0 ? String(json.config.gas_surcharge) : "0"};
        deps.cache.set(cacheKey, JSON.stringify(config), DENOM_CONFIG_CACHE_TTL);

        return config;
    } catch (e) {
        console.error("[denom_config] failed to fetch", e);
        return ZERO_CONFIG;
    }
};
