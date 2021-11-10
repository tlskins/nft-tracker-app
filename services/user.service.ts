import http from '../http-common'
import { ICreateTransactionReq, ICreateTransactionResp } from '../types/transaction'
import { IUser, ICreateUserReq, IUserResp } from '../types/user'

class UserService {
  get = async ( walletPublicKey: string ): Promise<IUser | undefined> => {
    try {
      const userResp: IUserResp = await http.get( `users/${walletPublicKey}` )

      return userResp?.data?.user
    } catch( err ) {
      console.log( 'err getting user ', err )

      return
    }
  }

  create = async ( req: ICreateUserReq ): Promise<IUser | undefined> => {
    try {
      const userResp: IUserResp = await http.post( '/users', req )

      return userResp?.data?.user
    } catch( err ) {
      console.log( 'err creating ', err )

      return
    }
  }

  createTransaction = async ( req: ICreateTransactionReq ): Promise<IUser | undefined> => {
    try {
      const resp: ICreateTransactionResp = await http.post( '/users/transactions', req )

      return resp.user
    } catch( err ) {
      console.log( 'err creating trx ', err )

      return
    }
  }
}

export default new UserService()
