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
  }

export const userTrialCutoff = ( user?: IUser ): Moment.Moment | undefined => {
  return user ? Moment( user.createdAt ).add({ hours: 12 }) : undefined
}

export const userSubsCutoff = ( user?: IUser ): Moment.Moment | undefined => {
  return user ? Moment( user.inactiveDate ).add({ hours: 12 }) : undefined
}

export const userInactiveDate = ( user?: IUser ): Moment.Moment | undefined => {
  if ( !user ) {
    return undefined
  }
  const subsEnds = userSubsCutoff( user )
  if ( subsEnds ) {
    return subsEnds
  }

  return userTrialCutoff( user )
}

export const userIsActive = ( user?: IUser ): boolean => {
  if ( user?.isOG ) {
    return true
  }
  const inactiveDate = userInactiveDate( user )
  if ( !inactiveDate ) {
    return false
  }

  return Moment().isBefore( inactiveDate )
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
