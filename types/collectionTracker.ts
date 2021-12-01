
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
    coefficients: [number];
    featureNames: [string];
    features: [number];
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
    suggestedPrice: number;
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
    title: string;
    price: number;
    url: string;
    lastSoldPrice: number;
    tokenAddress: string;
    rank: number | undefined;
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
