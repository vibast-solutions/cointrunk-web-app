import {describe, expect, it, vi} from "vitest";
import {createDenomConfigQuery} from "@/utils/denom_config";

const FACTORY = "factory/bze1abc/token";

const setup = (resp: {status: number; body?: unknown} | "throw") => {
    const store = new Map<string, string>();
    const fetch = vi.fn(async (_url: string) => {
        if (resp === "throw") throw new Error("network");
        return {status: resp.status, json: async () => resp.body};
    });
    const query = createDenomConfigQuery({
        fetch, restEndpoint: () => "https://rest.test",
        cache: {get: k => store.get(k) ?? null, set: (k, v) => { store.set(k, v); }},
    });
    return {query, fetch};
};

describe("createDenomConfigQuery", () => {
    it("reads gas_surcharge from a 200 and caches it", async () => {
        const {query, fetch} = setup({status: 200, body: {config: {community_pool: "", transfer_fee: "0.000000000000000000", gas_surcharge: "0.500000000000000000"}}});
        expect(await query(FACTORY)).toEqual({gasSurcharge: "0.500000000000000000"});
        await query(FACTORY);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][0]).toBe("https://rest.test/bze/tokenfactory/denom_config?denom=factory%2Fbze1abc%2Ftoken");
    });

    it("returns zero on 501", async () => {
        const {query} = setup({status: 501});
        expect(await query(FACTORY)).toEqual({gasSurcharge: "0"});
    });

    it("returns zero on network error", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        const {query} = setup("throw");
        expect(await query(FACTORY)).toEqual({gasSurcharge: "0"});
    });

    it("does not request for non-factory denoms", async () => {
        const {query, fetch} = setup({status: 200, body: {}});
        expect(await query("ubze")).toEqual({gasSurcharge: "0"});
        expect(await query("ibc/ABC")).toEqual({gasSurcharge: "0"});
        expect(fetch).not.toHaveBeenCalled();
    });
});
