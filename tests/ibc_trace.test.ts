import {createHash} from "node:crypto";
import {describe, expect, it, vi} from "vitest";
import {createHashTraceResolver} from "@/utils/ibc_trace";

const REST = "https://rest.test";
// sha256 of "<path>/<base>", computed independently (printf ... | sha256sum, uppercase)
const SINGLE_HASH = "6490A7EAB61059BFC1CDDEB05917DD70BDF3A611654162A1A47DB930D40D8AF4"; // transfer/channel-3/uusdc
const MULTI_HASH = "0B4275D5E71D099CA1B6A9AFC3A78E13D5DDA34F12D0B2BA8859C7E7AAA462CC"; // transfer/channel-1/transfer/channel-9/uatom
const sha = (s: string) => createHash("sha256").update(s).digest("hex").toUpperCase();

const setup = (routes: Record<string, {status: number; body?: unknown} | "throw">) => {
    const store = new Map<string, string>();
    const calls: string[] = [];
    const resolve = createHashTraceResolver({
        restEndpoint: () => REST,
        cache: {get: k => store.get(k) ?? null, set: (k, v) => { store.set(k, v); }},
        fetch: async (url: string) => {
            calls.push(url.replace(REST + "/ibc/apps/transfer/v1", ""));
            const r = routes[url.replace(REST + "/ibc/apps/transfer/v1", "").replace(/\/[^/]*$/, "")] ?? {status: 500};
            if (r === "throw") throw new Error("network");
            return {status: r.status, json: async () => r.body};
        },
    });
    return {resolve, store, calls};
};

describe("createHashTraceResolver", () => {
    it("maps a single-hop v10 denom and matches the sha256 self-check", async () => {
        const {resolve, calls} = setup({"/denoms": {status: 200, body: {denom: {base: "uusdc", trace: [{port_id: "transfer", channel_id: "channel-3"}]}}}});
        const trace = await resolve(SINGLE_HASH);
        expect(trace).toEqual({base_denom: "uusdc", path: "transfer/channel-3"});
        expect(sha(`${trace!.path}/${trace!.base_denom}`)).toBe(SINGLE_HASH);
        expect(calls).toEqual([`/denoms/${SINGLE_HASH}`]);
    });

    it("maps a multi-hop v10 denom, BZE side first", async () => {
        const {resolve} = setup({"/denoms": {status: 200, body: {denom: {base: "uatom", trace: [
            {port_id: "transfer", channel_id: "channel-1"}, {port_id: "transfer", channel_id: "channel-9"}]}}}});
        const trace = await resolve(MULTI_HASH);
        expect(trace).toEqual({base_denom: "uatom", path: "transfer/channel-1/transfer/channel-9"});
        expect(sha(`${trace!.path}/${trace!.base_denom}`)).toBe(MULTI_HASH);
    });

    it("falls back to the legacy route when a 200 has no base", async () => {
        const {resolve, calls} = setup({
            "/denoms": {status: 200, body: {denom: {}}},
            "/denom_traces": {status: 200, body: {denom_trace: {path: "p", base_denom: "b"}}},
        });
        expect(await resolve("H")).toEqual({path: "p", base_denom: "b"});
        expect(calls).toEqual(["/denoms/H", "/denom_traces/H"]);
    });

    it("returns undefined on 404 without falling back", async () => {
        const {resolve, calls} = setup({"/denoms": {status: 404}});
        expect(await resolve("H")).toBeUndefined();
        expect(calls).toEqual(["/denoms/H"]);
    });

    it("falls back to the legacy route on 501 and caches the result", async () => {
        const {resolve, calls} = setup({
            "/denoms": {status: 501},
            "/denom_traces": {status: 200, body: {denom_trace: {path: "transfer/channel-3", base_denom: "uusdc"}}},
        });
        expect(await resolve("H")).toEqual({path: "transfer/channel-3", base_denom: "uusdc"});
        expect(await resolve("H")).toEqual({path: "transfer/channel-3", base_denom: "uusdc"});
        expect(calls).toEqual(["/denoms/H", "/denom_traces/H"]);
    });

    it("falls back when the first request throws", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        const {resolve} = setup({"/denoms": "throw", "/denom_traces": {status: 200, body: {denom_trace: {path: "p", base_denom: "b"}}}});
        expect(await resolve("H")).toEqual({path: "p", base_denom: "b"});
    });

    it("returns undefined and caches nothing when both routes fail", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        const {resolve, store} = setup({"/denoms": {status: 501}, "/denom_traces": "throw"});
        expect(await resolve("H")).toBeUndefined();
        expect(store.size).toBe(0);
    });
});
