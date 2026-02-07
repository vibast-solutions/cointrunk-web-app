import {getRestClient} from "@/query/client";

export async function getAccountBalance(address: string, denom: string): Promise<string> {
    try {
        const client = await getRestClient();
        const response = await client.cosmos.bank.v1beta1.balance({address, denom});

        return response?.balance?.amount || '0';
    } catch (e) {
        console.error('failed to get account balance:', e);
        return '0';
    }
}
