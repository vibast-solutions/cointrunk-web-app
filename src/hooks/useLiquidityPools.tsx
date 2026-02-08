import {useCallback, useMemo} from "react";
import {useAssetsContext} from "@/hooks/useAssets";
import {createPoolId, poolIdFromPoolDenom} from "@/utils/liquidity_pool";

export function useLiquidityPools() {
    const {poolsMap, poolsDataMap, isLoading} = useAssetsContext()

    const pools = useMemo(() => Array.from(poolsMap.values()), [poolsMap])

    const getDenomsPool = useCallback((denomA: string, denomB: string) => {
        const poolId = createPoolId(denomA, denomB)

        return poolsMap.get(poolId)
    }, [poolsMap])

    const getPoolByLpDenom = useCallback((lpDenom: string) => {
        const poolId = poolIdFromPoolDenom(lpDenom)

        return poolsMap.get(poolId)
    }, [poolsMap])

    return {
        pools,
        isLoading: isLoading,
        poolsData: poolsDataMap,
        getDenomsPool,
        getPoolByLpDenom,
    }
}