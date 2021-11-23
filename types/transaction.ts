import { IPricing, IUser } from './user'

export interface ITransaction {
    id: string;
    userId: string;
    createdAt: string;
    fromPublicKey: string;
    toPublicKey: string;
    amountLamports: number;
    subsExtHours: number;
  }

export interface ICreateTransactionReq {
    walletPublicKey: string;
    toPublicKey: string;
    amountLamports: number;
    pricing: IPricing;
  }

export interface ICreateTransactionResp {
    transaction: ITransaction;
    user: IUser;
  }
