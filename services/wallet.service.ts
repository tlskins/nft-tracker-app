import moment, { Moment } from 'moment'
import { toast } from 'react-toastify'

import http from '../http-common'
import {
  IGetWalletResp,
  IGetWalletData,
  ISyncWalletResp,
  ISyncWalletData,
  IUpdateTokenTracker,
  IUpdateTokenTrackerResp,
  ITokenTracker,
  ITokenTrackersResp,
  IPredictTokenTrackersReq,
} from '../types/tokens'
import { IUser, IUserResp } from '../types/user'

class WalletService {
  getWallet = async (): Promise<IGetWalletData | undefined> => {
    try {
      const walletResp: IGetWalletResp = await http.get( 'wallet' )

      return walletResp?.data
    } catch( err ) {
      toast.error( `Error getting wallet: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }

  deleteWallet = async ( walletAddr: string ): Promise<IUser | undefined> => {
    try {
      const userResp: IUserResp = await http.delete( `wallet/${walletAddr}` )

      return userResp?.data?.user
    } catch( err ) {
      toast.error( `Error deleting wallet: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }

  syncWallet = async (): Promise<ISyncWalletData | undefined> => {
    const startAt: moment.Moment = moment()
    try {
      const walletResp: ISyncWalletResp = await http.post( 'wallet/sync' )

      return walletResp?.data
    } catch( err ) {
      if ( moment().diff( startAt, 'seconds' ) > 10 ) {
        toast.error( 'Syncing timed out. Please try again in a few minutes.', {
          position: toast.POSITION.TOP_CENTER,
        })
      } else {
        toast.error( `Error syncing wallet: ${err.response?.data?.message || 'Unknown'}`, {
          position: toast.POSITION.TOP_CENTER,
        })

      }

      return
    }
  }

  saveTokenTracker = async (
    update: IUpdateTokenTracker,
  ): Promise<ITokenTracker | undefined> => {
    try {
      const trackerResp: IUpdateTokenTrackerResp = await http.put( 'wallet/token-tracker', update )

      return trackerResp?.data.tracker
    } catch( err ) {
      toast.error( `Error updating tracker settings: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }

  predictTokenTracker = async (
    req: IPredictTokenTrackersReq,
  ): Promise<[ITokenTracker] | undefined> => {
    try {
      const resp: ITokenTrackersResp = await http.post( 'alert-token-trackers/predict', req )

      return resp?.data.trackers
    } catch( err ) {
      toast.error( `Error predicting: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }
  }
}

export default new WalletService()
