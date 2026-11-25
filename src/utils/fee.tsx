import BigNumber from "bignumber.js";

/**
 * Fee amount (in the fee token) for a non-native fee: the pool-converted amount with the

 * A surcharge of 0 leaves today's amount unchanged. The result is never below 1/poolFee,
 * so the chain can capture the swap fee.
 */
export const calculateTokenFeeAmount = (convertedAmount: BigNumber, poolFee: BigNumber.Value, gasSurcharge: BigNumber.Value = 0): BigNumber => {
    const surcharge = new BigNumber(gasSurcharge);
    let amount = surcharge.gt(0)
        ? convertedAmount.multipliedBy(1.5).multipliedBy(surcharge.plus(1)).integerValue(BigNumber.ROUND_CEIL)
        : convertedAmount.multipliedBy(1.5).integerValue(BigNumber.ROUND_FLOOR);
    if (amount.multipliedBy(poolFee).lt(1)) {
        amount = new BigNumber(1).dividedBy(poolFee).integerValue(BigNumber.ROUND_CEIL);
    }

    return amount;
};
