import http, { setAuthHeader } from '../http-common'
import { ICreateTransactionReq, ICreateTransactionResp } from '../types/transaction'
import { IUser, ICreateUserReq, IUserResp, ILanding, ILandingResp } from '../types/user'

class UserService {
  getLanding = async (): Promise<ILanding | undefined> => {
    try {
      const landingResp: ILandingResp = await http.get( 'landing' )

      return landingResp?.data
    } catch( err ) {
      console.log( 'err getting landing ', err.response?.data )

      return
    }
  }

  setSessionAuth = ( auth: string ): void => {
    setAuthHeader( auth )
  }

  get = async (): Promise<IUser | undefined> => {
    try {
      const userResp: IUserResp = await http.get( 'users' )

      return userResp?.data?.user
    } catch( err ) {
      console.log( 'err getting user ', err.response?.data )

      return
    }
  }

  create = async ( req: ICreateUserReq ): Promise<IUser | undefined> => {
    try {
      const userResp: IUserResp = await http.post( '/users', req )

      return userResp?.data?.user
    } catch( err ) {
      console.log( 'err creating ', err.response?.data )

      return
    }
  }

  createTransaction = async ( req: ICreateTransactionReq ): Promise<IUser | undefined> => {
    try {
      const resp: ICreateTransactionResp = await http.post( '/users/transactions', req )

      return resp.user
    } catch( err ) {
      console.log( 'err creating trx ', err.response?.data )

      return
    }
  }
}

export default new UserService()
