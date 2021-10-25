
import Moment from 'moment'

export interface ICollectionResponse {
    data: ICollectionData;
}

export interface ICollectionData{
    tracker: ICollectionTracker;
    sales: [IListingSale];
    listings: [IMarketListing];
    floors: [IFloorPrice];
    rarityCalculator: IRarityCalculator | undefined;
}
export interface ICollectionTracker {
    id: string;
    collection: string;
    floorPrice: IFloorPrice;
    lastDayFloor: IFloorPrice;
    lastWeekFloor: IFloorPrice;
    lastUpdated: string;
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

      attributes: [ITokenAttribute] | undefined;
      topAttributes: [ITokenAttribute] | undefined;
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

export interface IRarityCalculator {
    id: string;
    collection: string;
    createdAt: Moment.Moment;
    lookup: any;
}

export interface IRarityValuation {
    value: string;
    suggestedPrice: number;
    rarity: string;

    totalDailySales: number;
    totalDailyVolume: number;
    avgSalePrice: number;
    avgListPrice: number;
    salesHistory: [IListingSale];
    currentListings: [IListing];
}

export interface IListing {
    name: string;
    price: number;
    lastSoldPrice: number;
    tokenAddress: string;
    attributes: [ITokenAttribute];
}

export interface IListingSale {
    id: string;
    name: string;
    date: Moment.Moment;
    price: number;
    lastSoldPrice: number | undefined;
    marketplace: string;
    tokenAddress: string;
    buyerAddress: string;
    attributes: [ITokenAttribute];
}

// type RarityValuation struct {
// 	Value          float64 `bson:"val" json:"value"`
// 	SuggestedPrice float64 `bson:"suggPrice" json:"suggestedPrice"`
// 	Rarity         string  `bson:"rarity" json:"rarity"`

// 	TotalDailySales  int            `bson:"ttlDailySales" json:"totalDailySales"`
// 	TotalDailyVolume float64        `bson:"ttlDailyVol" json:"totalDailyVolume"`
// 	AvgSalePrice     float64        `bson:"avgSalePrice" json:"avgSalePrice"`
// 	AvgListPrice     float64        `bson:"avgListPrice" json:"avgListPrice"`
// 	SalesHistory     []*ListingSale `bson:"salesHist" json:"salesHistory"`
// 	CurrentListings  []*Listing     `bson:"currLists" json:"currentListings"`
// }

// type Listing struct {
// 	Name          string            `bson:"nm" json:"name"`
// 	Price         float64           `bson:"price" json:"price"`
// 	LastSoldPrice float64           `bson:"lastSoldPrice,omitempty" json:"lastSoldPrice,omitempty"`
// 	TokenAddress  string            `bson:"tokenAddr" json:"tokenAddress"`
// 	Attributes    []*TokenAttribute `bson:"attrs" json:"attributes"`
// }

// type ListingSale struct {
// 	Id            string            `bson:"_id" json:"id"`
// 	Name          string            `bson:"nm" json:"name"`
// 	Date          time.Time         `bson:"dt" json:"date"`
// 	Price         float64           `bson:"price" json:"price"`
// 	LastSoldPrice float64           `bson:"lastSoldPrice,omitempty" json:"lastSoldPrice,omitempty"`
// 	Marketplace   e.Marketplace     `bson:"mp" json:"marketplace"`
// 	TokenAddress  string            `bson:"tokenAddr" json:"tokenAddress"`
// 	BuyerAddress  string            `bson:"buyerAddr" json:"buyerAddress"`
// 	Attributes    []*TokenAttribute `bson:"attrs" json:"attributes"`
// }
