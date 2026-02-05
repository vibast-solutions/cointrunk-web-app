import { bze } from '@bze/bzejs';
import { getRestUrl } from '@/lib/chain-config';
import type { AcceptedDomainProps } from '@/lib/types';

const CACHE_KEY = 'acceptedDomains:all';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function getAcceptedDomains(): Promise<AcceptedDomainProps[]> {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.expiry > Date.now()) {
          return parsed.data;
        }
      } catch {
        // ignore invalid cache
      }
    }
  }

  const client = await bze.ClientFactory.createLCDClient({
    restEndpoint: getRestUrl(),
  });

  const response = await client.bze.cointrunk.acceptedDomain();
  const domains: AcceptedDomainProps[] = response?.acceptedDomain || [];

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: domains, expiry: Date.now() + CACHE_TTL })
    );
  }

  return domains;
}

export function extractUrlHost(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.hostname;
    }
  } catch {
    // invalid URL
  }
  return null;
}

export function isAcceptedDomain(
  host: string,
  domains: AcceptedDomainProps[]
): boolean {
  return domains.some(
    (d) => d.active && (d.domain === host || host.endsWith('.' + d.domain))
  );
}
