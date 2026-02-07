import {getRestClient} from "@/query/client";
import {PageRequest} from "@bze/bzejs/cosmos/base/query/v1beta1/pagination";
import {getFromLocalStorage, setInLocalStorage} from "@/storage/storage";
import type {AcceptedDomainProps} from "@/types/article";

const DOMAINS_CACHE_KEY = 'cointrunk:accepted_domains';
const DOMAINS_CACHE_TTL = 1800; // 30 minutes

export async function getAcceptedDomains(): Promise<AcceptedDomainProps[]> {
    const cached = getFromLocalStorage(DOMAINS_CACHE_KEY);
    if (cached) {
        try {
            return JSON.parse(cached) as AcceptedDomainProps[];
        } catch {
            // ignore parse error
        }
    }

    try {
        const client = await getRestClient();
        const response = await client.bze.cointrunk.acceptedDomain({
            pagination: PageRequest.fromPartial({
                limit: BigInt(200),
                countTotal: false,
            }),
        });

        const domains: AcceptedDomainProps[] = (response?.acceptedDomain || []).map((d) => ({
            domain: d.domain ?? '',
            active: !!d.active,
        }));

        setInLocalStorage(DOMAINS_CACHE_KEY, JSON.stringify(domains), DOMAINS_CACHE_TTL);
        return domains;
    } catch (e) {
        console.error('failed to get accepted domains:', e);
        return [];
    }
}

export function extractUrlHost(url: string): string | null {
    try {
        const parsed = new URL(url);
        return parsed.hostname;
    } catch {
        return null;
    }
}

export function isAcceptedDomain(host: string, domains: AcceptedDomainProps[]): boolean {
    return domains.some((d) => d.active && (host === d.domain || host.endsWith('.' + d.domain)));
}
