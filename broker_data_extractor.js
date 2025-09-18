const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class BrokerDataExtractor {
    constructor() {
        this.extractedData = [];
        this.patterns = {
            // Page-level patterns
            pageId: /const PageId=(\d+);/g,
            generatedTimestamp: /const PageGeneratedTimestampt=(\d+);/g,

            // Meta data patterns
            title: /<title>([^<]+)<\/title>/g,
            description: /<meta id=description name=description content="([^"]+)">/g,
            keywords: /<meta id=keywords name=keywords content="([^"]+)">/g,
            canonical: /<link rel=canonical href=([^>]+)>/g,

            // Content patterns
            headquarters: /headquartered?\s+in\s+([^.]+)/gi,
            founded: /founded?\s+(?:in\s+)?(\d{4})/gi,
            regulation: /regulated\s+by\s+([^.]+)/gi,
            minimumDeposit: /minimum\s+deposit\s+(?:of\s+)?\$?([0-9,]+)/gi,
            leverage: /leverage\s+(?:up\s+to\s+)?(1:?[0-9]+)/gi,

            // Platform and instrument patterns
            platforms: /(?:metatrader|mt[45]|webtrader|cfd|forex|crypto|stocks|indices|commodities)/gi,
            paymentMethods: /(?:credit\s+card|debit\s+card|bank\s+transfer|paypal|skrill|neteller|wire\s+transfer)/gi,
            regulationBodies: /(?:fca|cysec|asic|nfa|cftc|fsc|fsa|sec|esma)/gi,

            // Account types
            accountTypes: /(?:standard|premium|vip|islamic|mini|micro|ecn|stp|demo|live)/gi,

            // Contact information
            support: /(?:support|help|contact|customer\s+service)/gi,
            phone: /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi,
            email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi
        };
    }

    async extractFromFile(filePath) {
        try {
            const content = await readFile(filePath, 'utf8');
            const fileName = path.basename(filePath, '.html');

            // Extract basic page information
            const pageId = this.extractSingleMatch(content, this.patterns.pageId);
            const generatedTimestamp = this.extractSingleMatch(content, this.patterns.generatedTimestamp);
            let timestamp = null;
            if (generatedTimestamp) {
                try {
                    timestamp = new Date(parseInt(generatedTimestamp) / 10000 - 62135596800000).toISOString();
                } catch (error) {
                    console.warn(`Invalid timestamp for ${fileName}: ${generatedTimestamp}`);
                }
            }
            const title = this.extractSingleMatch(content, this.patterns.title);
            const description = this.extractSingleMatch(content, this.patterns.description);
            const keywords = this.extractSingleMatch(content, this.patterns.keywords);
            const canonical = this.extractSingleMatch(content, this.patterns.canonical);

            // Extract broker name from filename or title
            const brokerName = this.extractBrokerName(fileName, title);

            // Extract content-based information
            const headquarters = this.extractMultipleMatches(content, this.patterns.headquarters);
            const foundedYear = this.extractSingleMatch(content, this.patterns.founded);
            const regulations = this.extractMultipleMatches(content, this.patterns.regulation);
            const minimumDeposit = this.extractSingleMatch(content, this.patterns.minimumDeposit);
            const leverage = this.extractSingleMatch(content, this.patterns.leverage);
            const platforms = this.extractMultipleMatches(content, this.patterns.platforms);
            const paymentMethods = this.extractMultipleMatches(content, this.patterns.paymentMethods);
            const regulationBodies = this.extractMultipleMatches(content, this.patterns.regulationBodies);
            const accountTypes = this.extractMultipleMatches(content, this.patterns.accountTypes);

            // Determine page type from filename
            const pageType = this.determinePageType(fileName);

            const brokerData = {
                brokerName,
                pageId: pageId ? parseInt(pageId) : null,
                generatedTimestamp: timestamp,
                title: this.cleanText(title),
                description: this.cleanText(description),
                keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
                canonical: this.cleanText(canonical),
                pageType,

                // Extracted content data
                headquarters: headquarters.map(h => this.cleanText(h)),
                foundedYear: foundedYear ? parseInt(foundedYear) : null,
                regulations: regulations.map(r => this.cleanText(r)),
                minimumDeposit: minimumDeposit ? parseFloat(minimumDeposit.replace(/,/g, '')) : null,
                leverage: this.cleanText(leverage),
                platforms: [...new Set(platforms.map(p => p.toLowerCase()))],
                paymentMethods: [...new Set(paymentMethods.map(p => p.toLowerCase()))],
                regulationBodies: [...new Set(regulationBodies.map(r => r.toUpperCase()))],
                accountTypes: [...new Set(accountTypes.map(a => a.toLowerCase()))],

                // File metadata
                fileName,
                filePath,
                extractedAt: new Date().toISOString(),
                dataSource: 'html'
            };

            return brokerData;
        } catch (error) {
            console.error(`Error extracting from ${filePath}:`, error);
            return null;
        }
    }

    extractSingleMatch(content, pattern) {
        const match = content.match(pattern);
        return match ? match[1] || match[0] : null;
    }

    extractMultipleMatches(content, pattern) {
        const matches = content.match(pattern);
        return matches ? matches : [];
    }

    extractBrokerName(fileName, title) {
        // Extract from filename first (e.g., "fp-markets-review" -> "FP Markets")
        const nameMatch = fileName.match(/^([a-z-]+)-review/);
        if (nameMatch) {
            return nameMatch[1].split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }

        // Fallback to title extraction
        if (title) {
            const titleMatch = title.match(/^([^.]+)\s+Review/);
            if (titleMatch) {
                return titleMatch[1];
            }
        }

        return fileName;
    }

    determinePageType(fileName) {
        if (fileName.includes('minimum-deposit')) return 'minimum-deposit';
        if (fileName.includes('fees')) return 'fees';
        if (fileName.includes('account-types')) return 'account-types';
        if (fileName.includes('demo')) return 'demo';
        if (fileName.includes('withdrawal')) return 'withdrawal';
        if (fileName.includes('islamic-account')) return 'islamic-account';
        return 'main-review';
    }

    cleanText(text) {
        if (!text) return '';
        return text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ')
            .trim();
    }

    async processDirectory(directoryPath) {
        const files = fs.readdirSync(directoryPath);
        const htmlFiles = files.filter(file => file.endsWith('.html'));

        console.log(`Found ${htmlFiles.length} HTML files to process...`);

        for (const file of htmlFiles) {
            const filePath = path.join(directoryPath, file);
            console.log(`Processing: ${file}`);

            const data = await this.extractFromFile(filePath);
            if (data) {
                this.extractedData.push(data);
            }
        }

        return this.extractedData;
    }

    async saveToJson(outputPath) {
        const jsonData = {
            extractedAt: new Date().toISOString(),
            totalBrokers: this.extractedData.length,
            brokers: this.extractedData
        };

        await writeFile(outputPath, JSON.stringify(jsonData, null, 2));
        console.log(`Data saved to: ${outputPath}`);
    }

    generateSummary() {
        const summary = {
            totalFiles: this.extractedData.length,
            brokers: [...new Set(this.extractedData.map(d => d.brokerName))],
            pageTypes: {},
            averageMinimumDeposit: null,
            commonPlatforms: {},
            regulationStats: {}
        };

        // Count page types
        this.extractedData.forEach(data => {
            summary.pageTypes[data.pageType] = (summary.pageTypes[data.pageType] || 0) + 1;
        });

        // Calculate average minimum deposit
        const deposits = this.extractedData
            .filter(d => d.minimumDeposit && d.minimumDeposit > 0)
            .map(d => d.minimumDeposit);

        if (deposits.length > 0) {
            summary.averageMinimumDeposit = deposits.reduce((a, b) => a + b, 0) / deposits.length;
        }

        // Count platforms
        this.extractedData.forEach(data => {
            data.platforms.forEach(platform => {
                summary.commonPlatforms[platform] = (summary.commonPlatforms[platform] || 0) + 1;
            });
        });

        // Count regulations
        this.extractedData.forEach(data => {
            data.regulationBodies.forEach(regulation => {
                summary.regulationStats[regulation] = (summary.regulationStats[regulation] || 0) + 1;
            });
        });

        return summary;
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const inputDir = args[0] || './forex-brokers';
    const outputFile = args[1] || './extracted_broker_data.json';

    const extractor = new BrokerDataExtractor();

    try {
        console.log('Starting broker data extraction...');
        console.log(`Input directory: ${inputDir}`);
        console.log(`Output file: ${outputFile}`);

        await extractor.processDirectory(inputDir);
        await extractor.saveToJson(outputFile);

        const summary = extractor.generateSummary();
        console.log('\nExtraction Summary:');
        console.log(JSON.stringify(summary, null, 2));

        console.log('\nExtraction completed successfully!');
    } catch (error) {
        console.error('Extraction failed:', error);
        process.exit(1);
    }
}

// Export for use as module
module.exports = BrokerDataExtractor;

// Run as CLI if called directly
if (require.main === module) {
    main();
}