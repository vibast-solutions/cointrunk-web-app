import {DenomTrace} from "@/types/ibc";

export interface CacheStore {
    get(key: string): string | null;
    set(key: string, value: string, ttlSeconds: number): void;
}

export type FetchFn = (url: string) => Promise<{status: number; json(): Promise<unknown>}>;

export interface HashTraceDeps {
    fetch: FetchFn;
    restEndpoint: () => string;
    cache: CacheStore;
}

const TRACES_CACHE_KEY = "ibc:traces";
const HASH_TRACE_CACHE_TTL = 0; //never expire

interface IbcHop {
    port_id: string;
    channel_id: string;
}

/**
 * Maps the ibc-go v10 `denom` ({base, trace: [{port_id, channel_id}]}) to the
 * legacy {path, base_denom} shape used across the app. The hop on this chain's side comes first.
 */
export const denomTraceFromV10 = (denom: {base: string; trace?: IbcHop[]}): DenomTrace => ({
    base_denom: denom.base,
    path: (denom.trace ?? []).map(h => `${h.port_id}/${h.channel_id}`).join("/"),
});

/**
 * Resolves an ibc/<hash> denom to its trace. The HTTP status picks the route:
 * the v10 `/denoms/{hash}` first (404 = unknown denom), the legacy `/denom_traces/{hash}`
 * for any other failure (older nodes answer 501). Nothing is cached on failure.
 */
export const createHashTraceResolver = (deps: HashTraceDeps) => {
    const fromV10 = async (hash: string): Promise<DenomTrace | undefined | null> => {
        try {
            const resp = await deps.fetch(`${deps.restEndpoint()}/ibc/apps/transfer/v1/denoms/${hash}`);
            if (resp.status === 200) {
                const json = await resp.json() as {denom?: {base: string; trace?: IbcHop[]}};
                return json?.denom?.base ? denomTraceFromV10(json.denom) : null;
            }
            if (resp.status === 404) {
                return undefined;
            }
        } catch (e) {
            console.error("[IBC] failed to fetch denom", e);
        }

        return null; // fall back to the legacy route
    };

    const fromLegacy = async (hash: string): Promise<DenomTrace | undefined> => {
        try {
            const resp = await deps.fetch(`${deps.restEndpoint()}/ibc/apps/transfer/v1/denom_traces/${hash}`);
            if (resp.status !== 200) {
                console.error("failed to fetch hash denom trace. status: ", resp.status);
                return undefined;
            }
            const json = await resp.json() as {denom_trace?: DenomTrace};
            return json?.denom_trace || undefined;
        } catch (e) {
            console.error("[IBC] failed to fetch denom traces", e);
            return undefined;
        }
    };

    return async (hash: string): Promise<DenomTrace | undefined> => {
        const cacheKey = `${TRACES_CACHE_KEY}:${hash}`;
        const cached = deps.cache.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const v10 = await fromV10(hash);
        const trace = v10 === null ? await fromLegacy(hash) : v10;
        if (trace) {
            deps.cache.set(cacheKey, JSON.stringify(trace), HASH_TRACE_CACHE_TTL);
        }

        return trace;
    };
};
