# Broker Data Extraction Strategy

## Analysis Summary

Based on my examination of the HTML files from the scraped DailyForex broker review data, I've identified several key patterns and extraction opportunities. The HTML files are heavily minified but contain structured data that can be extracted programmatically.

## Key Data Patterns Identified

### 1. Page-Level Identifiers
**Found in all HTML files:**
- `PageId`: Unique identifier for each broker page
- `DfxProductId`: Product identifier (consistently = 1)
- `PageGeneratedTimestampt`: Timestamp when page was generated
- `PageLanguage`: Language setting (consistently = 'English')
- `PageLanguageId`: Language ID (consistently = 1)

**Examples:**
- FP Markets (minimum-deposit): PageId = 1563
- BDSwiss: PageId = 833
- Admirals: PageId = 427

### 2. API Endpoints
**Available for data fetching:**
- `DailyforexAPI = "https://apiv2.dailyforex.com"`
- `RatesApiUrl = "https://ratesapi.dailyforex.com"`
- `ApiEnvHost = "https://www.dailyforex.com"`

### 3. Meta Data Structure
**Extractable from meta tags:**
- `og:title`: Broker name and review title
- `og:description`: Brief broker description
- `description`: Meta description
- `keywords`: Target keywords
- `title`: Page title

### 4. File Structure Patterns
**URL patterns observed:**
- Main reviews: `/forex-brokers/{broker-name}-review.html`
- Sub-pages: `/forex-brokers/{broker-name}-review/{topic}.html`
- Topics: minimum-deposit, fees, account-types, demo, withdrawal, etc.

## Data Extraction Strategy

### Phase 1: Basic Broker Information
```javascript
const basicInfo = {
  brokerName: extractFromTitle(),
  pageId: extractFromScript('PageId'),
  generatedTimestamp: extractFromScript('PageGeneratedTimestampt'),
  url: extractFromCanonical(),
  description: extractFromMeta('description'),
  keywords: extractFromMeta('keywords')
};
```

### Phase 2: Specialized Topic Extraction
**For topic-specific pages (minimum-deposit, fees, etc.):**
1. **Minimum Deposit Pages**: Extract deposit amounts, currencies, methods
2. **Fees Pages**: Extract fee structures, commission information
3. **Account Types Pages**: Extract account variations, minimum balances
4. **Demo Pages**: Extract demo account details, limitations
5. **Withdrawal Pages**: Extract withdrawal methods, processing times, fees

### Phase 3: API Integration Strategy
**Leverage discovered API endpoints:**
1. **Broker Details API**: `GET /apiv2.dailyforex.com/brokers/{id}`
2. **Rates API**: `GET /ratesapi.dailyforex.com/{endpoint}`
3. **Reviews API**: `GET /apiv2.dailyforex.com/reviews/{brokerId}`

### Phase 4: Content-Based Extraction
**Text-based pattern matching:**
```javascript
const patterns = {
  headquarters: /headquartered?\s+in\s+([^.]+)/gi,
  founded: /founded?\s+(?:in\s+)?(\d{4})/gi,
  regulation: /regulated\s+by\s+([^.]+)/gi,
  minimumDeposit: /minimum\s+deposit\s+(?:of\s+)?\$?([0-9,]+)/gi,
  leverage: /leverage\s+(?:up\s+to\s+)?(1:?[0-9]+)/gi,
  platforms: /(?:metatrader|mt[45]|webtrader|cfd|forex|crypto|stocks|indices|commodities)/gi
};
```

## Implementation Plan

### Step 1: File Processing Pipeline
1. **File Discovery**: Scan directory for broker HTML files
2. **Pattern Matching**: Apply regex patterns to extract structured data
3. **Data Normalization**: Convert extracted data to consistent format
4. **Validation**: Verify data integrity and cross-reference

### Step 2: Broker Data Schema
```typescript
interface BrokerData {
  id: string;
  name: string;
  url: string;
  pageId: number;
  generatedAt: string;
  description: string;
  keywords: string[];

  // Extracted from content
  headquarters?: string;
  foundedYear?: number;
  regulations?: string[];
  minimumDeposit?: number;
  depositCurrencies?: string[];
  leverage?: string;
  platforms?: string[];
  accountTypes?: string[];
  paymentMethods?: string[];

  // Topic-specific data
  fees?: FeeStructure;
  accountDetails?: AccountInfo;
  withdrawalInfo?: WithdrawalDetails;

  // Metadata
  lastUpdated: string;
  dataSource: 'html' | 'api';
}
```

### Step 3: Processing Priority
1. **High Priority**: Main broker review pages
2. **Medium Priority**: Minimum deposit, fees, account types
3. **Low Priority**: Demo, withdrawal, specialized topics

## Technical Implementation

### Extraction Tools Needed:
1. **HTML Parser**: Cheerio or similar for DOM traversal
2. **Pattern Matching**: Regular expressions for unstructured data
3. **API Client**: Axios for fetching additional data
4. **Data Pipeline**: Stream processing for large file sets

### Error Handling:
- Handle malformed HTML gracefully
- Log missing data points
- Implement retry logic for API calls
- Validate data types and ranges

## Sample Extraction Commands

```bash
# Extract basic broker information
node extractor.js --basic --input "./forex-brokers/*.html"

# Extract all data types
node extractor.js --full --input "./forex-brokers/**/*.html"

# Generate CSV output
node extractor.js --format csv --output brokers.csv

# API-enhanced extraction
node extractor.js --api --enhance
```

## Next Steps

1. **Immediate**: Start with basic file processing and pattern matching
2. **Short-term**: Implement API integration for enhanced data
3. **Long-term**: Create comprehensive broker database with historical tracking
4. **Maintenance**: Set up monitoring for new broker additions and updates

This strategy provides a comprehensive approach to extracting structured broker data from the heavily minified HTML files while leveraging discovered API endpoints for enhanced data quality.