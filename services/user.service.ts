import { toast } from 'react-toastify'

import http, { setSession, clearSession } from '../http-common'
import { ICreateTransactionReq, ICreateTransactionResp } from '../types/transaction'
import {
  IUser,
  IUpdateUserProfile,
  ICreateUserReq,
  IUserResp,
  ICollectionMapping,
  ILandingResp,
  IPricingResp,
  IPricing,
} from '../types/user'

class UserService {
  getCollMappings = async (): Promise<ICollectionMapping[] | undefined> => {
    try {
      const landingResp: ILandingResp = await http.get( 'landing' )

      const colls = ( landingResp?.data?.collections || []).sort(( a, b ) => {
        return a.collection > b.collection ? 1 : -1
      })

      return colls
    } catch( err ) {
      toast.error( `Error getting collection mappings: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }

  setSession = ( auth: string ): void => {
    setSession( auth )
  }

  clearSession = ( ): void => {
    clearSession( )
  }

  get = async (): Promise<IUser | undefined> => {
    try {
      const userResp: IUserResp = await http.get( 'users' )

      return userResp?.data?.user
    } catch( err ) {
      console.log( 'err getting user ', err.response?.data?.message )

      return
    }
  }

  update = async ( update: IUpdateUserProfile ): Promise<IUser | undefined> => {
    try {
      const userResp: IUserResp = await http.put( 'users', update )

      return userResp?.data?.user
    } catch( err ) {
      console.log( 'err updating user ', err.response?.data?.message )

      return
    }
  }

  create = async ( req: ICreateUserReq ): Promise<IUser | undefined> => {
    try {
      const userResp: IUserResp = await http.post( '/users', req )

      return userResp?.data?.user
    } catch( err ) {
      toast.error( `Error creating user: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }

  getPricing = async (): Promise<IPricing | undefined> => {
    try {
      const pricingResp: IPricingResp = await http.get( 'subscriptions/pricing' )

      return pricingResp?.data?.pricing
    } catch( err ) {
      toast.error( `Error getting pricing data: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }

  createTransaction = async ( req: ICreateTransactionReq ): Promise<IUser | undefined> => {
    try {
      const resp: ICreateTransactionResp = await http.post( '/users/transactions', req )

      toast.success( 'Subscription extended. Please allow up to 5 mins for discord roles to be updated.', {
        position: toast.POSITION.TOP_CENTER,
      })

      return resp.data?.user
    } catch( err ) {
      toast.error( `Please contact discord server owner. Error extending subscription: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }
}

export default new UserService()
