import {useContext} from 'react';
import { AssetsContext, AssetsContextType } from '@/contexts/assets_context';

export function useAssetsContext(): AssetsContextType {
    const context = useContext(AssetsContext);
    if (context === undefined) {
        throw new Error('useAssets must be used within an AssetsProvider');
    }
    return context;
}
