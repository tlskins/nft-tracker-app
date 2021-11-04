
export interface ICollectionResponse {
    data: ICollectionData;
}


export interface ICollectionData{
    tracker: ICollectionTracker;
}
export interface ICollectionTracker {
    id: string;
    collection: string;
    marketSummary: IMarketSummary;
    lastUpdated: string;

    currentBest: IMarketListing;
    lastDayBest: IMarketListing;
    lastWeekBest: IMarketListing;
    currentListings: [IMarketListing];
  }

export interface IMarketListing {
    id: string;
    updatedAt: string;
    title: string;
    image: string;
    url: string;
    tokenAddress: string | undefined;
    tokenNumber: number | undefined;
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

export interface IMarketSummary {
    id: string;
    collection: string;
    time: string;
    timeStr: string;

    hourMarketSummary: IMarketWindowSummary;
    dayMarketSummary: IMarketWindowSummary;
    weekMarketSummary: IMarketWindowSummary;
  }

export interface IMarketWindowSummary {
    id: string;

    // listing summaries
    listingFloor: number;
    avgListPrice: number;
    totalListings: number;

    // sales summaries
    salesFloor: number;
    salesCeiling: number;
    avgSalePrice: number;
    totalSales: number;
    totalSalesVolume: number;

    // deltas
    listingFloorChange: number;
    avgListPriceChange: number;
    totalListingsChange: number;

    salesFloorChange: number;
    salesCeilingChange: number;
    avgSalePriceChange: number;
    totalSalesChange: number;
    totalSalesVolumeChange: number;
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
      saleDate: string;
      date: string;
      price: number;
      lastSoldPrice: number;
      marketplace: string;
      tokenAddress: string;
      buyerAddress: string;
      rarity: string;
      rank: number | undefined;

      attributes: [ITokenAttribute];
      topAttributes: [ITokenAttribute];
  }


// Rarity Calc

export interface IRarityResponse {
  data: IRarityData;
}

export interface IRarityData{
  rarityCalculator: IRarityCalculator | undefined;
}

export interface IRarityCalculator {
    id: string;
    updatedAt: string;
    collection: string;
    lookup: any;
}

export interface IRarityValuation {
    rarity: string;
    rarityScore: number;
    rarityValue: IRarityValue
}

export interface IRarityValue {
    value: string;
    suggestedPrice: number;

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
    date: string;
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
