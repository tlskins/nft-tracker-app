import Moment from 'moment'

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
    trialHours: number;
  }

export const userTrialCutoff = ( user?: IUser ): Moment.Moment | undefined => {
  if ( !user ) {
    return
  }

  return Moment( user.createdAt ).add({ hours: user.trialHours })
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
