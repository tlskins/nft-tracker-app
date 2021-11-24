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
    data: ICreateTransactionData;
  }

export interface ICreateTransactionData {
  transaction: ITransaction;
  user: IUser;
}
