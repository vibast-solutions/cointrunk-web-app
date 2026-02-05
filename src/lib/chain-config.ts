import { chains, assets } from 'chain-registry';

const TESTNET_COIN_DENOM = 'tbz';
const TESTNET_COIN_MIN_DENOM = 'utbz';

const BZE_TESTNET_CHAIN = {
  chain_id: 'bzetestnet-2',
  chain_name: 'BZE Testnet 2',
  pretty_name: 'BZE Testnet 2',
  network_type: 'mainnet' as const,
  bech32_prefix: 'testbz',
  status: 'live' as const,
  slip44: 118,
  logo_URIs: {
    svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/beezee/images/bze.svg',
  },
  fees: {
    fee_tokens: [{ denom: TESTNET_COIN_MIN_DENOM, fixed_min_gas_price: 0 }],
  },
  staking: {
    staking_tokens: [{ denom: TESTNET_COIN_MIN_DENOM }],
  },
  explorers: [
    {
      kind: 'ping.pub',
      url: 'https://testnet.explorer.thesilverfox.pro/beezee',
      tx_page: 'https://testnet.explorer.thesilverfox.pro/beezee/tx/${txHash}',
    },
  ],
  apis: {
    rpc: [{ address: 'https://testnet-rpc.getbze.com', provider: 'AlphaTeam' }],
    rest: [{ address: 'https://testnet.getbze.com', provider: 'AlphaTeam' }],
    grpc: [{ address: 'grpc.getbze.com:9999', provider: 'AlphaTeam' }],
  },
};

const BZE_TESTNET_ASSETS = {
  chain_name: BZE_TESTNET_CHAIN.chain_name,
  assets: [
    {
      description: 'BeeZee native blockchain',
      denom_units: [
        { denom: TESTNET_COIN_MIN_DENOM, exponent: 0 },
        { denom: TESTNET_COIN_DENOM, exponent: 6 },
      ],
      base: TESTNET_COIN_MIN_DENOM,
      name: 'BeeZee',
      display: TESTNET_COIN_DENOM,
      symbol: TESTNET_COIN_DENOM,
      logo_URIs: {
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/beezee/images/bze.svg',
      },
      coingecko_id: 'bzedge',
    },
  ],
};

const CURRENT_NETWORK: string = process.env.NEXT_PUBLIC_NETWORK ?? 'testnet';

const networks: Record<string, any> = {
  mainnet: {
    explorerBaseUrl: 'https://ping.pub/beezee',
    rpcUrl: 'https://rpc.getbze.com',
    restUrl: 'https://rest.getbze.com',
    chainName: 'beezee',
    minDenom: 'ubze',
    displayDenom: 'BZE',
    chain: chains,
    assets: assets,
  },
  testnet: {
    explorerBaseUrl: 'https://testnet.explorer.thesilverfox.pro/beezee',
    rpcUrl: 'https://testnet-rpc.getbze.com',
    restUrl: 'https://testnet.getbze.com',
    chainName: BZE_TESTNET_CHAIN.chain_name,
    minDenom: TESTNET_COIN_MIN_DENOM,
    displayDenom: TESTNET_COIN_DENOM.toUpperCase(),
    chain: [BZE_TESTNET_CHAIN],
    assets: [BZE_TESTNET_ASSETS],
  },
};

const config = networks[CURRENT_NETWORK] || networks.testnet;

export const getChainName = (): string => config.chainName;
export const getExplorerBaseUrl = (): string => config.explorerBaseUrl;
export const getRpcUrl = (): string => config.rpcUrl;
export const getRestUrl = (): string => config.restUrl;
export const getMinDenom = (): string => config.minDenom;
export const getDisplayDenom = (): string => config.displayDenom;
export const getChain = (): any[] => config.chain;
export const getAssets = (): any[] => config.assets;
export const getExplorerTxUrl = (txHash: string): string =>
  `${config.explorerBaseUrl}/tx/${txHash}`;
