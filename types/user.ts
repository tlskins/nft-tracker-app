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
