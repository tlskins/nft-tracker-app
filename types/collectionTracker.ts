
import Moment from "moment"

export interface ICollectionResponse {
    data: ICollectionData;
}

export interface ICollectionData{
    tracker: ICollectionTracker;
    sales: [IListingSale];
    listings: [IMarketListing];
    floors: [IFloorPrice];
    rarityCalculator: IRarityCalcultor | undefined;
}
export interface ICollectionTracker {
    id: string;
    collection: string;
    floorPrice: IFloorPrice;
    lastDayFloor: IFloorPrice;
    lastWeekFloor: IFloorPrice;
    lastUpdated: Moment.Moment;
    hourlySales: number | undefined;
    averageSalesPrice: number | undefined;

    currentBest: IMarketListing;
    lastDayBest: IMarketListing;
    lastWeekBest: IMarketListing;
    currentListings: [IMarketListing];
  }

  export interface IMarketListing {
      id: string;
      updatedAt: Moment.Moment;
      title: string;
      image: string;
      url: string;
      tokenAddress: string | undefined;
      collection: string;
      marketplace: string;
      rank: number | undefined;
      price: number;
      rarity: string | undefined;
      suggestedPrice: number | undefined;
      marketFloor: number | undefined;
      lastSoldPrice: number | undefined;
      score: number;
      scorePercentChange: number | undefined;
      dailyBestScoreRank: number | undefined;
      weeklyBestScoreRank: number | undefined;
      listedForSale: boolean;
      isNew: boolean;
      isBest: boolean;

      attributes: [ITokenAttribute];
  }

  export interface IFloorPrice {
    id: string;
    collection: string;
    floorPrice: number;
    time: Moment.Moment;
    timeStr: string;
    percentChange: number;
  }

  export interface ITokenAttribute {
    name: string;
    value: string;
    rarity: string;
    score: number;
  }

  export interface IListingSale {
      id: string;
      name: string;
      date: Moment.Moment;
      price: number;
      lastSoldPrice: number;
      marketplace: string;
      tokenAddress: string;
      buyerAddress: string;
      attributes: [ITokenAttribute];
  }

  export interface IRarityCalcultor {
      id: string;
      collection: string;
      createdAt: Moment.Moment;
      lookup: any;
  }