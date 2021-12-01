import Moment from 'moment'

import { Nft } from './tokens'

export interface IUser {
    id: string;
    createdAt: string;
    updatedAt: string;
    walletPublicKey: string;
    discordId: string;
    discordName: string;
    inactiveDate: string;
    verified: boolean;
    isOG: boolean;
    trialEnd: string;

    trackedWallets: [string];
    untrackedNfts: [Nft];
    hasWalletTracker: boolean;
  }

export const userTrialCutoff = ( user?: IUser ): Moment.Moment | undefined => {
  if ( !user ) {
    return
  }

  return Moment( user.trialEnd )
}

export const userIsActive = ( user?: IUser ): boolean => {
  if ( user?.isOG ) {
    return true
  }

  return Moment().isBefore( Moment( user?.inactiveDate ))
}

export interface ILandingResp {
    data: ILanding;
  }
export interface ILanding {
    collections: Map<string, string>;
  }

export interface IPricingResp {
    data: IPricingData;
  }

export interface IPricingData {
    pricing: IPricing;
  }
export interface IPricing {
  timestamp: string;
  lamportsPerWeek: number;
  numActive: number;
  lamportsPerActive: number;
  baseLamportsPerWeek: number;
}

export interface ICreateUserReq {
    walletPublicKey: string;
    discordName: string;
    verifyCode: number;
  }

export interface IUserProfile {
  walletPublicKey: string;
  discordId: string;
}

export interface IUserResp {
    data: IUserData
  }

export interface IUserData {
    user: IUser | undefined
  }


export interface IUpdateUserProfile {
  trackedWallets?: [string];
  hasWalletTracker?: boolean;
}
