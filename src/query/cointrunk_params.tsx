import {getRestClient} from "@/query/client";
import {getFromLocalStorage, setInLocalStorage} from "@/storage/storage";
import type {CointrunkParamsProps} from "@/types/article";

const PARAMS_CACHE_KEY = 'cointrunk:params';
const PARAMS_CACHE_TTL = 1800; // 30 minutes

export async function getCointrunkParams(): Promise<CointrunkParamsProps | null> {
    const cached = getFromLocalStorage(PARAMS_CACHE_KEY);
    if (cached) {
        try {
            return JSON.parse(cached) as CointrunkParamsProps;
        } catch {
            // ignore parse error
        }
    }

    try {
        const client = await getRestClient();
        const response = await client.bze.cointrunk.params();
        const p = response?.params;
        if (!p) return null;

        const mapped: CointrunkParamsProps = {
            anon_article_limit: Number(p.anon_article_limit ?? 0),
            anon_article_cost: {
                amount: p.anon_article_cost?.amount ?? '0',
                denom: p.anon_article_cost?.denom ?? 'ubze',
            },
            publisher_respect_params: {
                tax: p.publisher_respect_params?.tax ?? '0',
                denom: p.publisher_respect_params?.denom ?? 'ubze',
            },
        };

        setInLocalStorage(PARAMS_CACHE_KEY, JSON.stringify(mapped), PARAMS_CACHE_TTL);
        return mapped;
    } catch (e) {
        console.error('failed to get cointrunk params:', e);
        return null;
    }
}
