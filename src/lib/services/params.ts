import { bze } from '@bze/bzejs';
import { getRestUrl } from '@/lib/chain-config';
import type { CointrunkParamsProps } from '@/lib/types';

const CACHE_KEY = 'cointrunk:params';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function getCointrunkParams(): Promise<CointrunkParamsProps | null> {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.expiry > Date.now()) {
          return parsed.data;
        }
      } catch {
        // ignore
      }
    }
  }

  const client = await bze.ClientFactory.createLCDClient({
    restEndpoint: getRestUrl(),
  });

  const response = await client.bze.cointrunk.params();
  const params = response?.params || null;

  if (params && typeof window !== 'undefined') {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: params, expiry: Date.now() + CACHE_TTL })
    );
  }

  return params as unknown as CointrunkParamsProps | null;
}
