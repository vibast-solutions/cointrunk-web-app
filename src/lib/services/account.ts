import { bze } from '@bze/bzejs';
import { getRestUrl } from '@/lib/chain-config';

export async function getAccountBalance(
  address: string,
  denom: string
): Promise<string> {
  const client = await bze.ClientFactory.createLCDClient({
    restEndpoint: getRestUrl(),
  });

  const response = await client.cosmos.bank.v1beta1.balance({
    address,
    denom,
  });

  return response?.balance?.amount || '0';
}
