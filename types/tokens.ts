import { ITokenAttribute } from './collectionTracker'

// network types

export interface IGetWalletResp {
  data: IGetWalletData;
}

export interface IGetWalletData {
  tracked: [ITokenTracker];
  untracked: [Nft];
  tokenTrackingTypes: [string];
}

export interface ISyncWalletResp {
  data: ISyncWalletData;
}

export interface ISyncWalletData {
  tracked: [ITokenTracker];
  untracked: [Nft];
}

export interface IUpdateTokenTrackerResp {
  data: IUpdateTokenTrackerData;
}

export interface IUpdateTokenTrackerData {
  tracker: ITokenTracker;
}


export interface IPredictTokenTrackersReq {
  collection: string;
  ids: string[];
}

export interface ITokenTrackersResp {
  data: ITokenTrackersData
}

export interface ITokenTrackersData {
  trackers: [ITokenTracker]
}

// types

export interface IToken {
  id: string;
  updatedAt: string;
  title: string;
  image: string;
  tokenAddress: string;
  tokenNumber: number;
  collection: string;

  rank?: number;
  price?: number;
  rarity?: string;
  floorPrice?: number;
  suggestedPrice?: number;
  lastCalcAt?: string;

  attributes: [ITokenAttribute];
  topAttributes: [ITokenAttribute];
}

export interface ITokenTracker {
    id: string;
    lastSync: string;
    tokenAddress: string;
    walletAddress: string;
    userId: string;

    active: boolean;
    tokenTrackerType?: string;
    lastAlertAt?: string;
    above?: number;
    below?: number;

    token?: IToken;
  }

export interface IUpdateTokenTracker {
  id: string;
  active?: boolean;
  tokenTrackerType?: string;
  above?: number;
  below?: number;
}

export interface Nft {
  id: string;
  name: string;
  sellerFeeBasisPoints: number;
  symbol: string;
  tokenID: string;
  uri: string;
  walletAddress: string;
  userId: string;

  creators: [ICreator];
  network: IBlockchainNetwork;
  tokenData: ITokenData;
}

export interface IBlockchainNetwork {
  chainId: string;
  chainName: string;
}

export interface ITokenData {
  updateAuthority: string;
  primarySaleHappened: number;
  mint: string;
  isMutable: number;
  creators: [ICreator];
}

export interface ICreator {
  address: string;
  verified: number;
  share: number;
}
