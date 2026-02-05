import { bze } from '@bze/bzejs';
import { getRestUrl } from '@/lib/chain-config';
import type { PublisherProps } from '@/lib/types';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'publisher:';

function mapPublisher(p: any): PublisherProps {
  return {
    name: p.name,
    address: p.address,
    active: p.active,
    articles_count: Number(p.articles_count),
    created_at: String(p.created_at),
    respect: String(p.respect),
  };
}

export async function getAllPublishers(): Promise<PublisherProps[]> {
  const client = await bze.ClientFactory.createLCDClient({
    restEndpoint: getRestUrl(),
  });

  const response = await client.bze.cointrunk.publishers({
    pagination: {
      key: new Uint8Array(),
      offset: BigInt(0),
      limit: BigInt(200),
      countTotal: true,
      reverse: true,
    },
  });

  return (response?.publisher || []).map(mapPublisher);
}

export async function getPublisherByAddress(
  address: string
): Promise<PublisherProps | null> {
  const client = await bze.ClientFactory.createLCDClient({
    restEndpoint: getRestUrl(),
  });

  const response = await client.bze.cointrunk.publisher({ address });
  if (response?.publisher) {
    return mapPublisher(response.publisher);
  }

  return null;
}

export async function getPublisherData(
  address: string
): Promise<PublisherProps | null> {
  // Check localStorage cache
  if (typeof window !== 'undefined') {
    const cacheKey = CACHE_PREFIX + address;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.expiry > Date.now()) {
          return parsed.data;
        }
        localStorage.removeItem(cacheKey);
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }
  }

  try {
    const publisher = await getPublisherByAddress(address);
    if (publisher && typeof window !== 'undefined') {
      const cacheKey = CACHE_PREFIX + address;
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: publisher, expiry: Date.now() + CACHE_TTL })
      );
    }
    return publisher;
  } catch (e) {
    console.error('Failed to fetch publisher:', e);
    return null;
  }
}

export async function isPublisher(address: string): Promise<boolean> {
  try {
    const publisher = await getPublisherData(address);
    return publisher?.active === true;
  } catch {
    return false;
  }
}
