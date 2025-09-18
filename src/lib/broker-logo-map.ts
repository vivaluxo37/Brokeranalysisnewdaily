// Broker logo mapping utility
// Maps broker names to their corresponding local logo files

interface BrokerLogoMapping {
  [key: string]: string;
}

// Create a mapping of broker names to local logo paths
const brokerLogoMap: BrokerLogoMapping = {
  // SVG logos (clean naming)
  'Axi': '/broker-logos/axi.svg',
  'FXTM': '/broker-logos/fxtm.svg',
  'IC Markets': '/broker-logos/ic-markets.svg',
  'IG Group': '/broker-logos/ig-group.svg',
  'eToro': '/broker-logos/etoro.svg',

  // PNG logos with proper mapping
  'Admirals': '/broker-logos/imgi_9_admirals-admiral-markets-review.png',
  'Pepperstone': '/broker-logos/imgi_10_pepperstone-review.png',
  'Plus500': '/broker-logos/imgi_10_plus500-review.png',
  'Trading 212': '/broker-logos/imgi_10_trading-212-review.png',
  'XM Group': '/broker-logos/xm-logo.svg',
  'OANDA': '/broker-logos/imgi_12_oanda.png',
  'Swissquote': '/broker-logos/imgi_8_swissquote-review.png',
  'XTB': '/broker-logos/imgi_6_xtb-review.png',
  'Fusion Markets': '/broker-logos/imgi_15_fusion-markets-review.png',
  'Eightcap': '/broker-logos/imgi_23_eightcap-review.png',
  'MultiBank': '/broker-logos/imgi_22_multibank-review.png',
  'AxiTrader': '/broker-logos/imgi_20_axitrader-review.png',
  'Spreadex': '/broker-logos/imgi_17_spreadex-review.png',
  'Forex.com': '/broker-logos/imgi_16_forex.com-review.png',
  'Hantec Markets': '/broker-logos/imgi_47_hantec-markets-review.png',
  'Vantage Markets': '/broker-logos/imgi_25_vantage-markets-review.png',
  // 'FP Markets': '/broker-logos/fp-markets.svg', // Duplicate - removing
  'FXCM': '/broker-logos/imgi_21_fxcm-review.png',
  'TradeStation Global': '/broker-logos/imgi_19_tradestation-global-review.png',
  'Moneta Markets': '/broker-logos/imgi_37_moneta-markets-review.png',
  'FXPro': '/broker-logos/imgi_36_fxpro-review.png',
  'FXTrading.com': '/broker-logos/imgi_35_fxtradingcom-review.png',
  'TradeStation': '/broker-logos/imgi_31_tradestation-review.png',
  'HYCM': '/broker-logos/imgi_38_hycm-review.png',
  'Global Prime': '/broker-logos/imgi_33_global-prime-review.png',
  'Alpaca Trading': '/broker-logos/imgi_32_alpaca-trading-review.png',
  'AVAtrade': '/broker-logos/imgi_30_avatrade-review.png',
  'ActivTrades': '/broker-logos/imgi_29_activtrades-review.png',
  'Optimus Futures': '/broker-logos/imgi_28_optimus-futures-review.png',
  'XM': '/broker-logos/imgi_27_xm-review.png',
  'Amp Futures': '/broker-logos/imgi_26_amp-futures-review.png',
  'Tickmill': '/broker-logos/imgi_18_Tickmill-rounded.png',
  'FP Markets': '/broker-logos/fp-markets.jpg',
  'BDSwiss': '/broker-logos/bdswiss.jpg',
  'PU Prime': '/broker-logos/pu-prime.jpg',
  'IQ Option': '/broker-logos/iq-option.jpg',
  'Topstep': '/broker-logos/topstep.jpg',
  'Saxo Bank': '/broker-logos/saxo-bank.svg',
  'CMC Markets': '/broker-logos/cmc-markets.svg',
  'City Index': '/broker-logos/city-index.svg',
  'ADS Securities': '/broker-logos/ads-securities.svg',
  'Dukascopy': '/broker-logos/dukascopy.svg',
  'Interactive Brokers': '/broker-logos/imgi_4_interactive-brokers-review.png',
  'Charles Schwab': '/broker-logos/imgi_7_charles-schwab-review.png',
  'Fidelity': '/broker-logos/imgi_8_fidelity-review.png',
  'Merrill Edge': '/broker-logos/imgi_10_merrill-edge-review.png',
  'DeGiRO': '/broker-logos/imgi_10_degiro-review.png',
  'Moomoo': '/broker-logos/imgi_10_moomoo-review.png',
  'Tastytrade': '/broker-logos/imgi_16_tastytrade-review.png',
  'Webull': '/broker-logos/imgi_21_webull-review.png',
  'Robinhood': '/broker-logos/imgi_22_robinhood-review.png',
  'SoFi Invest': '/broker-logos/imgi_19_sofi-invest-review.png',
  'Ally Invest': '/broker-logos/imgi_18_ally-invest-review.png',
  'E*TRADE': '/broker-logos/imgi_13_e-trade-review.png',
  'NinjaTrader': '/broker-logos/imgi_5_ninjatrader-review.png',
  // 'TradeStation': '/broker-logos/imgi_26_tradestation-review.png', // Duplicate - removing
  'Vanguard': '/broker-logos/imgi_25_vanguard-review.png',
  // 'Optimus Futures': '/broker-logos/imgi_24_optimus-futures-review.png', // Duplicate - removing
  // 'Amp Futures': '/broker-logos/imgi_23_amp-futures-review.png', // Duplicate - removing
  'FirstTrade': '/broker-logos/imgi_28_firstrade-review.png',
  'SoGoTrade': '/broker-logos/imgi_32_sogotrade-review.png',
  'TradeZero': '/broker-logos/imgi_31_tradezero-review.png',
  'Zacks Trade': '/broker-logos/imgi_30_zacks-trade-review.png',
  'Tradier': '/broker-logos/imgi_29_tradier-review.png',
  'Revolut': '/broker-logos/imgi_33_revolut-review.png',
  'EasyEquities': '/broker-logos/imgi_51_easyequities-review.png',
  'ChoiceTrade': '/broker-logos/imgi_34_choicetrade-review.png',
  'Public.com': '/broker-logos/imgi_17_publiccom-review.png',
  'Trading.com': '/broker-logos/imgi_35_tradingdotcomus_logo-v1.jpg',
  'FBS': '/broker-logos/imgi_43_fbs-review.png',
  'VT Markets': '/broker-logos/imgi_44_vt-markets-review.png',
  'Exness': '/broker-logos/imgi_40_exness-review.png',
  'Trade Nation': '/broker-logos/imgi_39_trade-nation-review.png',
  'MarketsX': '/broker-logos/imgi_46_marketsx-review.png',
  'TMGM': '/broker-logos/imgi_45_tmgm-review.png',
  // 'FXTM': '/broker-logos/imgi_47_fxtm-review.png', // Duplicate - removing
  'Royal Financial': '/broker-logos/imgi_50_royal-review.png',
  'CapTrader': '/broker-logos/imgi_49_captrader-review.png',
  'BlackBull Markets': '/broker-logos/blackbull-markets.svg',
  'Blueberry Markets': '/broker-logos/blueberry-markets.svg',
  'ThinkMarkets': '/broker-logos/thinkmarkets.svg',
  'Admiral Markets': '/broker-logos/imgi_9_admirals-admiral-markets-review.png',
  'Mexem': '/broker-logos/imgi_10_mexem-review.png',
  'IG': '/broker-logos/imgi_14_ig-review.png',
  'Lightyear': '/broker-logos/lightyear.svg',
  'Interactive Investor': '/broker-logos/interactive-investor.svg',
  'Degiro': '/broker-logos/imgi_10_degiro-review.png',
  'Merrill': '/broker-logos/imgi_10_merrill-edge-review.png',
  'Baxia Markets': '/broker-logos/baxia-markets.svg',
  'Go Markets': '/broker-logos/go-markets.svg',
  'Moneta': '/broker-logos/imgi_37_moneta-markets-review.png',
  'Hycm': '/broker-logos/imgi_38_hycm-review.png',
  // 'Global Prime': '/broker-logos/imgi_33_global-prime-review.png', // Duplicate - removing
  'Alpaca': '/broker-logos/imgi_27_alpaca-trading-review.png',
  'Saxo': '/broker-logos/saxo-bank.svg',
  'Dukascopy Bank': '/broker-logos/dukascopy.svg',
  'Interactive': '/broker-logos/imgi_4_interactive-brokers-review.png',
  'Charles': '/broker-logos/imgi_7_charles-schwab-review.png',
  'Ninja': '/broker-logos/imgi_5_ninjatrader-review.png',
  'Tradestation': '/broker-logos/imgi_26_tradestation-review.png',
  'Sogo': '/broker-logos/imgi_32_sogotrade-review.png',
  'Zacks': '/broker-logos/imgi_30_zacks-trade-review.png',
  'Tradier Brokerage': '/broker-logos/imgi_29_tradier-review.png',
  'Revolut Trading': '/broker-logos/imgi_33_revolut-review.png',
  // 'EasyEquities': '/broker-logos/imgi_51_easyequities-review.png', // Duplicate - removing
  'Choicetrade': '/broker-logos/imgi_34_choicetrade-review.png',
  'Public': '/broker-logos/imgi_17_publiccom-review.png',
  'Tradingdotcom': '/broker-logos/imgi_35_tradingdotcomus_logo-v1.jpg',
  'Fbs': '/broker-logos/imgi_43_fbs-review.png',
  'Vt': '/broker-logos/imgi_44_vt-markets-review.png',
  'Exness Group': '/broker-logos/imgi_40_exness-review.png',
  'Trade': '/broker-logos/imgi_39_trade-nation-review.png',
  'Marketsx': '/broker-logos/imgi_46_marketsx-review.png',
  'Tmgm': '/broker-logos/imgi_45_tmgm-review.png',
  'Fxtm': '/broker-logos/imgi_47_fxtm-review.png',
  'Royal': '/broker-logos/imgi_50_royal-review.png',
  'Captrader': '/broker-logos/imgi_49_captrader-review.png',
  'Blackbull': '/broker-logos/blackbull-markets.svg',
  'Blueberry': '/broker-logos/blueberry-markets.svg',
  'Thinkmarkets': '/broker-logos/thinkmarkets.svg',
};

// Function to get logo URL for a broker
export function getBrokerLogoUrl(brokerName: string): string {
  // Try exact match first
  if (brokerLogoMap[brokerName]) {
    return brokerLogoMap[brokerName];
  }

  // Try case-insensitive match
  const normalizedName = brokerName.toLowerCase().trim();
  for (const [key, value] of Object.entries(brokerLogoMap)) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }

  // Try partial match
  for (const [key, value] of Object.entries(brokerLogoMap)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return value;
    }
  }

  // Default fallback logo
  return '/broker-logos/default-broker-logo.svg';
}

// Function to normalize broker name for matching
export function normalizeBrokerName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

// Function to find best matching logo
export function findBestLogoMatch(brokerName: string): string {
  const normalizedName = normalizeBrokerName(brokerName);

  // Direct match
  if (brokerLogoMap[brokerName]) {
    return brokerLogoMap[brokerName];
  }

  // Case-insensitive match
  for (const [key, value] of Object.entries(brokerLogoMap)) {
    if (normalizeBrokerName(key) === normalizedName) {
      return value;
    }
  }

  // Partial match (contains)
  for (const [key, value] of Object.entries(brokerLogoMap)) {
    if (normalizedName.includes(normalizeBrokerName(key)) ||
        normalizeBrokerName(key).includes(normalizedName)) {
      return value;
    }
  }

  // Word-based matching
  const nameWords = normalizedName.split(' ');
  for (const [key, value] of Object.entries(brokerLogoMap)) {
    const keyWords = normalizeBrokerName(key).split(' ');
    const commonWords = nameWords.filter(word => keyWords.includes(word));
    if (commonWords.length > 0) {
      return value;
    }
  }

  // Default fallback
  return '/broker-logos/default-broker-logo.svg';
}

export { brokerLogoMap };