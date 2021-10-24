import http from "../http-common";
import { ICollectionResponse, ICollectionTracker } from "../types/collectionTracker"

class CollectionTrackerDataService {
  get = async (collection: string): Promise<ICollectionTracker | undefined> => {
    try {
        const resp = await http.get(`/${collection}`) as ICollectionResponse;
        return resp.data.tracker
    } catch(err) {
        console.log('err getting collection tracker ', err)
        return
    }
  }
}

export default new CollectionTrackerDataService();