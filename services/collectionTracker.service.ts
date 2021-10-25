import http from '../http-common'
import { ICollectionResponse, ICollectionTracker } from '../types/collectionTracker'

class CollectionTrackerDataService {
  get = async ( collection: string ): Promise<ICollectionTracker | ICollectionResponse> => {
    try {
      const resp: ICollectionResponse = await http.get( `/${collection}` )

      return resp
    } catch( err ) {
      console.log( 'err getting collection tracker ', err )

      return
    }
  }
}

export default new CollectionTrackerDataService()
