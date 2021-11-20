import http from '../http-common'
import { ICollectionResponse, ICollectionTracker, IRarityResponse, IRarityCalculator } from '../types/collectionTracker'

class CollectionTrackerDataService {
  get = async ( collection: string ): Promise<ICollectionTracker | undefined> => {
    try {
      const resp: ICollectionResponse = await http.get( `/${collection}` )

      return resp?.data?.tracker
    } catch( err ) {
      console.log( 'err getting collection tracker ', err.response?.data )

      return
    }
  }

  getRarity = async ( collection: string ): Promise<IRarityCalculator | undefined> => {
    try {
      const resp: IRarityResponse = await http.get( `/${collection}/rarity` )

      return resp?.data?.rarityCalculator
    } catch( err ) {
      console.log( 'err getting rarity ', err.response?.data )

      return
    }
  }
}

export default new CollectionTrackerDataService()
