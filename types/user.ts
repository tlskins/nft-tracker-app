export interface IUser {
    id: string;
    createdAt: string;
    updatedAt: string;
    walletPublicKey: string;
    discordId: string;
    inactiveDate: string;
  }

export interface ICreateUserReq {
    walletPublicKey: string;
    discordId: string;
  }

export interface IUserResp {
    data: IUserData
  }

export interface IUserData {
    user: IUser | undefined
  }
