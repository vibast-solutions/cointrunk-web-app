'use client';

import {createContext, useState, ReactNode, useEffect, useCallback} from 'react';
import {Asset, ChainAssets} from '@/types/asset';
import {getChainAssets} from "@/service/assets_factory";
import {LiquidityPoolSDKType} from "@bze/bzejs/bze/tradebin/store";
import {LiquidityPoolData} from "@/types/liquidity_pool";
import {getLiquidityPools} from "@/query/liquidity_pools";

export interface AssetsContextType {
    assetsMap: Map<string, Asset>;
    poolsMap: Map<string, LiquidityPoolSDKType>;
    poolsDataMap: Map<string, LiquidityPoolData>;
    isLoading: boolean;
    settingsVersion: number;
    setSettingsVersion: (version: number) => void;
}

export const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

interface AssetsProviderProps {
    children: ReactNode;
}

export function AssetsProvider({ children }: AssetsProviderProps) {
    const [assetsMap, setAssetsMap] = useState<Map<string, Asset>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [poolsMap, setPoolsMap] = useState<Map<string, LiquidityPoolSDKType>>(new Map())
    const [poolsDataMap] = useState<Map<string, LiquidityPoolData>>(new Map())
    const [settingsVersion, setSettingsVersion] = useState(0);

    const doUpdateAssets = useCallback((newAssets: ChainAssets) => {
        setAssetsMap(newAssets.assets);
        return newAssets.assets
    }, []);

    const doUpdateLiquidityPools = useCallback((newPools: LiquidityPoolSDKType[]) => {
        const newPoolsMap = new Map<string, LiquidityPoolSDKType>()
        newPools.forEach(pool => {
            newPoolsMap.set(pool.id, pool)
        })
        setPoolsMap(newPoolsMap)
    }, [])

    useEffect(() => {
        setIsLoading(true)
        const init = async () => {
            const [assets, pools] = await Promise.all([
                getChainAssets(),
                getLiquidityPools(),
            ])
            doUpdateAssets(assets)
            doUpdateLiquidityPools(pools)
            setIsLoading(false)
        }

        init();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AssetsContext.Provider value={{
            assetsMap,
            isLoading,
            poolsMap,
            poolsDataMap,
            settingsVersion,
            setSettingsVersion,
        }}>
            {children}
        </AssetsContext.Provider>
    );
}
