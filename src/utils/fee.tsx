import BigNumber from "bignumber.js";

/**
 * Fee amount (in the fee token) for a non-native fee: the pool-converted amount with the
 * app's 1.5 safety margin, then the factory token's gas surcharge (1 + surcharge), rounded up.
 * A surcharge of 0 leaves today's amount unchanged. The result is never below 1/poolFee,
 * so the chain can capture the swap fee.
 */
export const calculateTokenFeeAmount = (convertedAmount: BigNumber, poolFee: BigNumber.Value, gasSurcharge: BigNumber.Value = 0): BigNumber => {
    let amount = convertedAmount.multipliedBy(1.5).integerValue(BigNumber.ROUND_FLOOR);
    amount = amount.multipliedBy(new BigNumber(1).plus(gasSurcharge)).integerValue(BigNumber.ROUND_CEIL);
    if (amount.multipliedBy(poolFee).lt(1)) {
        amount = new BigNumber(1).dividedBy(poolFee).integerValue(BigNumber.ROUND_CEIL);
    }

    return amount;
};
