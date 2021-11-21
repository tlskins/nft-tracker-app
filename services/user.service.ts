import { toast } from 'react-toastify'

import http, { setAuthHeader } from '../http-common'
import { ICreateTransactionReq, ICreateTransactionResp } from '../types/transaction'
import { IUser, ICreateUserReq, IUserResp, ILanding, ILandingResp } from '../types/user'

class UserService {
  getLanding = async (): Promise<ILanding | undefined> => {
    try {
      const landingResp: ILandingResp = await http.get( 'landing' )

      return landingResp?.data
    } catch( err ) {
      toast.error( `Error getting landing data: ${err.response?.data || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

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
      toast.error( `Error creating user: ${err.response?.data || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }

  createTransaction = async ( req: ICreateTransactionReq ): Promise<IUser | undefined> => {
    try {
      const resp: ICreateTransactionResp = await http.post( '/users/transactions', req )

      return resp.user
    } catch( err ) {
      toast.error( `Error extending subscription: ${err.response?.data || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }
}

export default new UserService()
