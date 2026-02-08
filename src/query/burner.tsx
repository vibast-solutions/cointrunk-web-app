import {ParamsSDKType as BurnerParams} from "@bze/bzejs/bze/burner/params";
import {getRestClient} from "@/query/client";

export const getBurnerParamsWithClient = async (client: Awaited<ReturnType<typeof getRestClient>>): Promise<BurnerParams|undefined>=> {
    try {
        const response = await client.bze.burner.params();

        return response.params;
    } catch (error) {
        console.error('failed to get burner params: ', error);
    }

    return undefined;
}
