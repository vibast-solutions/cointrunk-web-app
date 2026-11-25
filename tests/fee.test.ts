import BigNumber from "bignumber.js";
import {describe, expect, it} from "vitest";
import {calculateTokenFeeAmount} from "@/utils/fee";

// chain rule: required = ceil(gasValueInToken * (1 + surcharge)), the app pays converted * 1.5 margin
const required = (converted: number, surcharge: number) => Math.ceil(converted * (1 + surcharge));

describe("calculateTokenFeeAmount", () => {
    it("with surcharge 0 equals the previous output (floor of converted * 1.5)", () => {
        expect(calculateTokenFeeAmount(new BigNumber("1001.9"), "0.01", 0).toFixed(0)).toBe("1502");
        expect(calculateTokenFeeAmount(new BigNumber("1000"), "0.01").toFixed(0)).toBe("1500");
    });

    it.each([0, 0.5, 2])("covers the chain's required fee for surcharge %s", (s) => {
        const converted = 12345.6;
        const fee = calculateTokenFeeAmount(new BigNumber(converted), "0.01", new BigNumber(s));
        expect(fee.gte(required(converted, s))).toBe(true);
    });

    it("applies the surcharge multiplicatively and rounds up", () => {
        expect(calculateTokenFeeAmount(new BigNumber(1000), "0.01", "0.5").toFixed(0)).toBe("2250");
        expect(calculateTokenFeeAmount(new BigNumber(1000), "0.01", "2").toFixed(0)).toBe("4500");
        expect(calculateTokenFeeAmount(new BigNumber(1001), "0.01", "0.333").toFixed(0)).toBe("2002");
    });

    it("rounds up once so a small amount is not under-paid", () => {
        // 1.2 * 1.5 * 2 = 3.6 -> 4 (flooring 1.8 first would give 1 * 2 = 2... then 2, below the chain's ceil)
        expect(calculateTokenFeeAmount(new BigNumber("1.2"), "0.5", "1").toFixed(0)).toBe("4");
    });

    it("keeps the minimum that lets the chain capture the swap fee", () => {
        expect(calculateTokenFeeAmount(new BigNumber(3), "0.01", "0.5").toFixed(0)).toBe("100");
    });
});
