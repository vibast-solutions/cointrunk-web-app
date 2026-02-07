import {getRestClient} from "@/query/client";
import {PageRequest} from "@bze/bzejs/cosmos/base/query/v1beta1/pagination";
import {getFromLocalStorage, setInLocalStorage} from "@/storage/storage";
import type {PublisherProps} from "@/types/article";

const PUBLISHER_CACHE_PREFIX = 'cointrunk:publisher:';
const PUBLISHER_CACHE_TTL = 300; // 5 minutes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPublisher(p: any): PublisherProps {
    return {
        name: p.name ?? '',
        address: p.address ?? '',
        active: !!p.active,
        articles_count: Number(p.articles_count ?? 0),
        created_at: String(p.created_at ?? '0'),
        respect: String(p.respect ?? '0'),
    };
}

export async function getAllPublishers(): Promise<PublisherProps[]> {
    try {
        const client = await getRestClient();
        const response = await client.bze.cointrunk.publishers({
            pagination: PageRequest.fromPartial({
                limit: BigInt(200),
                countTotal: false,
                reverse: false,
            }),
        });

        return (response?.publisher || []).map(mapPublisher);
    } catch (e) {
        console.error('failed to get publishers:', e);
        return [];
    }
}

export async function getPublisherByAddress(address: string): Promise<PublisherProps | null> {
    try {
        const client = await getRestClient();
        const response = await client.bze.cointrunk.publisher({address});
        if (!response?.publisher) return null;

        return mapPublisher(response.publisher);
    } catch (e) {
        console.error('failed to get publisher:', e);
        return null;
    }
}

export async function getPublisherData(address: string): Promise<PublisherProps | null> {
    const cacheKey = PUBLISHER_CACHE_PREFIX + address;
    const cached = getFromLocalStorage(cacheKey);
    if (cached) {
        try {
            return JSON.parse(cached) as PublisherProps;
        } catch {
            // ignore parse error
        }
    }

    const publisher = await getPublisherByAddress(address);
    if (publisher) {
        setInLocalStorage(cacheKey, JSON.stringify(publisher), PUBLISHER_CACHE_TTL);
    }

    return publisher;
}

export async function isPublisher(address: string): Promise<boolean> {
    const pub = await getPublisherData(address);
    return !!pub?.active;
}
