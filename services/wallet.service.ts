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
} from '../types/tokens'

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

  syncWallet = async (): Promise<ISyncWalletData | undefined> => {
    try {
      const walletResp: ISyncWalletResp = await http.post( 'wallet/sync' )

      return walletResp?.data
    } catch( err ) {
      toast.error( `Error syncing wallet: ${err.response?.data?.message || 'Unknown'}`, {
        position: toast.POSITION.TOP_CENTER,
      })

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
}

export default new WalletService()
