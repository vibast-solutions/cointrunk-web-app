import {CacheStore, FetchFn} from "@/utils/ibc_trace";
import {isFactoryDenom} from "@/utils/denom";
import BigNumber from "bignumber.js";

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
const MAX_GAS_SURCHARGE = new BigNumber(2); // chain maximum
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

    let resp;
    try {
        resp = await deps.fetch(`${deps.restEndpoint()}/bze/tokenfactory/denom_config?denom=${encodeURIComponent(denom)}`);
    } catch (e) {
        // transient: not cached
        console.error("[denom_config] failed to fetch", e);
        return ZERO_CONFIG;
    }

    let config = ZERO_CONFIG;
    if (resp.status === 200) {
        try {
            const json = await resp.json() as {config?: {gas_surcharge?: unknown}};
            config = {gasSurcharge: parseGasSurcharge(json?.config?.gas_surcharge)};
        } catch (e) {
            console.error("[denom_config] invalid response", e);
            return ZERO_CONFIG;
        }
    }
    // a non-200 (e.g. 501 on v8.2.0 nodes) is cached too, so such nodes are not re-queried on every simulation
    deps.cache.set(cacheKey, JSON.stringify(config), DENOM_CONFIG_CACHE_TTL);

    return config;
};

const parseGasSurcharge = (raw: unknown): string => {
    if (typeof raw !== "string" || !/^\d+(\.\d+)?$/.test(raw)) {
        return "0";
    }
    const value = new BigNumber(raw);
    if (!value.isFinite()) {
        return "0";
    }

    return BigNumber.minimum(value, MAX_GAS_SURCHARGE).toFixed();
};
