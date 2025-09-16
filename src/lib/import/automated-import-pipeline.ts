import { promises as fs } from 'fs';
import path from 'path';
import { BrokerHTMLParser } from '@/lib/parsers/broker-html-parser';
import { JavaScriptDataExtractor } from '@/lib/parsers/js-data-extractor';
import { BrokerDataImporter } from '@/lib/db/broker-import';
import { BrokerDataValidator } from '@/lib/validators/broker-data-validator';

export interface ImportPipelineConfig {
  sourceDirectory: string;
  filePatterns: string[];
  batchSize: number;
  maxRetries: number;
  enableLogging: boolean;
  skipExisting: boolean;
  validationStrict: boolean;
}

export interface ImportPipelineResult {
  success: boolean;
  processedFiles: number;
  importedBrokers: number;
  failedFiles: number;
  errors: string[];
  warnings: string[];
  stats: {
    totalRegulations: number;
    totalFeatures: number;
    totalTradingConditions: number;
    totalAccountTypes: number;
    totalPlatforms: number;
    totalPaymentMethods: number;
    totalSupport: number;
    totalEducation: number;
    totalReviews: number;
    totalAffiliateLinks: number;
    totalPromotions: number;
  };
  processingTime: number;
}

export class AutomatedImportPipeline {
  private config: ImportPipelineConfig;
  private logBuffer: string[] = [];

  constructor(config: Partial<ImportPipelineConfig> = {}) {
    this.config = {
      sourceDirectory: 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers',
      filePatterns: ['*.html', '*.js'],
      batchSize: 10,
      maxRetries: 3,
      enableLogging: true,
      skipExisting: true,
      validationStrict: false,
      ...config,
    };
  }

  /**
   * Run the complete import pipeline
   */
  async run(): Promise<ImportPipelineResult> {
    const startTime = Date.now();
    const result: ImportPipelineResult = {
      success: false,
      processedFiles: 0,
      importedBrokers: 0,
      failedFiles: 0,
      errors: [],
      warnings: [],
      stats: {
        totalRegulations: 0,
        totalFeatures: 0,
        totalTradingConditions: 0,
        totalAccountTypes: 0,
        totalPlatforms: 0,
        totalPaymentMethods: 0,
        totalSupport: 0,
        totalEducation: 0,
        totalReviews: 0,
        totalAffiliateLinks: 0,
        totalPromotions: 0,
      },
      processingTime: 0,
    };

    try {
      this.log('Starting automated import pipeline...');
      this.log(`Source directory: ${this.config.sourceDirectory}`);
      this.log(`File patterns: ${this.config.filePatterns.join(', ')}`);

      // Find files to process
      const files = await this.findFiles();
      this.log(`Found ${files.length} files to process`);

      // Process files in batches
      const batches = this.createBatches(files);

      for (let i = 0; i < batches.length; i++) {
        this.log(`Processing batch ${i + 1} of ${batches.length}...`);

        const batchResult = await this.processBatch(batches[i]);
        this.updateResult(result, batchResult);
      }

      result.success = result.importedBrokers > 0;
      result.processingTime = Date.now() - startTime;

      this.log(`Import pipeline completed in ${result.processingTime}ms`);
      this.log(`Imported ${result.importedBrokers} brokers from ${result.processedFiles} files`);
      this.log(`Failed files: ${result.failedFiles}`);

    } catch (error) {
      result.errors.push(`Pipeline error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.processingTime = Date.now() - startTime;
    }

    return result;
  }

  /**
   * Find all files matching the patterns
   */
  private async findFiles(): Promise<string[]> {
    const files: string[] = [];

    for (const pattern of this.config.filePatterns) {
      const patternPath = path.join(this.config.sourceDirectory, pattern);

      try {
        const matchedFiles = await this.globFiles(patternPath);
        files.push(...matchedFiles);
      } catch (error) {
        this.log(`Warning: Could not find files matching pattern ${pattern}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Remove duplicates and sort
    return [...new Set(files)].sort();
  }

  /**
   * Glob-style file matching
   */
  private async globFiles(pattern: string): Promise<string[]> {
    const files: string[] = [];
    const dir = path.dirname(pattern);
    const filePattern = path.basename(pattern);

    try {
      const dirFiles = await fs.readdir(dir);

      for (const file of dirFiles) {
        if (this.matchesPattern(file, filePattern)) {
          files.push(path.join(dir, file));
        }
      }
    } catch (error) {
      // Directory might not exist
    }

    return files;
  }

  /**
   * Simple pattern matching
   */
  private matchesPattern(filename: string, pattern: string): boolean {
    const regex = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
      .replace(/\./g, '\\.');

    return new RegExp(`^${regex}$`).test(filename);
  }

  /**
   * Create batches of files
   */
  private createBatches(files: string[]): string[][] {
    const batches: string[][] = [];

    for (let i = 0; i < files.length; i += this.config.batchSize) {
      batches.push(files.slice(i, i + this.config.batchSize));
    }

    return batches;
  }

  /**
   * Process a batch of files
   */
  private async processBatch(files: string[]): Promise<Partial<ImportPipelineResult>> {
    const batchResult: Partial<ImportPipelineResult> = {
      processedFiles: 0,
      importedBrokers: 0,
      failedFiles: 0,
      errors: [],
      warnings: [],
      stats: {
        totalRegulations: 0,
        totalFeatures: 0,
        totalTradingConditions: 0,
        totalAccountTypes: 0,
        totalPlatforms: 0,
        totalPaymentMethods: 0,
        totalSupport: 0,
        totalEducation: 0,
        totalReviews: 0,
        totalAffiliateLinks: 0,
        totalPromotions: 0,
      },
    };

    for (const file of files) {
      try {
        const fileResult = await this.processFile(file);

        batchResult.processedFiles++;

        if (fileResult.success) {
          batchResult.importedBrokers++;

          // Update stats
          batchResult.stats.totalRegulations += fileResult.stats.regulations;
          batchResult.stats.totalFeatures += fileResult.stats.features;
          batchResult.stats.totalTradingConditions += fileResult.stats.tradingConditions;
          batchResult.stats.totalAccountTypes += fileResult.stats.accountTypes;
          batchResult.stats.totalPlatforms += fileResult.stats.platforms;
          batchResult.stats.totalPaymentMethods += fileResult.stats.paymentMethods;
          batchResult.stats.totalSupport += fileResult.stats.support;
          batchResult.stats.totalEducation += fileResult.stats.education;
          batchResult.stats.totalReviews += fileResult.stats.reviews;
          batchResult.stats.totalAffiliateLinks += fileResult.stats.affiliateLinks;
          batchResult.stats.totalPromotions += fileResult.stats.promotions;
        } else {
          batchResult.failedFiles++;
        }

        batchResult.errors.push(...fileResult.errors);
        batchResult.warnings.push(...fileResult.warnings);

      } catch (error) {
        batchResult.failedFiles++;
        batchResult.errors.push(`Failed to process file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return batchResult;
  }

  /**
   * Process a single file
   */
  private async processFile(filePath: string): Promise<{
    success: boolean;
    errors: string[];
    warnings: string[];
    stats: any;
  }> {
    const result = {
      success: false,
      errors: [] as string[],
      warnings: [] as string[],
      stats: {
        regulations: 0,
        features: 0,
        tradingConditions: 0,
        accountTypes: 0,
        platforms: 0,
        paymentMethods: 0,
        support: 0,
        education: 0,
        reviews: 0,
        affiliateLinks: 0,
        promotions: 0,
      },
    };

    try {
      this.log(`Processing file: ${filePath}`);

      // Read file content
      const content = await fs.readFile(filePath, 'utf-8');

      // Determine file type and parse
      let brokerData;

      if (filePath.endsWith('.html')) {
        brokerData = this.parseHTMLFile(content, filePath);
      } else if (filePath.endsWith('.js')) {
        brokerData = this.parseJSFile(content, filePath);
      } else {
        throw new Error(`Unsupported file type: ${path.extname(filePath)}`);
      }

      // Skip if no broker data found
      if (!brokerData.broker.name) {
        result.errors.push(`No broker data found in file: ${filePath}`);
        return result;
      }

      // Check if broker already exists (if configured)
      if (this.config.skipExisting) {
        const existingBroker = await this.checkExistingBroker(brokerData.broker.name);
        if (existingBroker) {
          result.warnings.push(`Broker ${brokerData.broker.name} already exists, skipping`);
          return result;
        }
      }

      // Validate data
      const validationResult = BrokerDataValidator.validateCompleteBrokerData(brokerData);

      if (!validationResult.isValid) {
        if (this.config.validationStrict) {
          result.errors.push(`Validation failed for ${filePath}: ${validationResult.errors.join(', ')}`);
          return result;
        } else {
          result.warnings.push(`Validation warnings for ${filePath}: ${validationResult.errors.join(', ')}`);
        }
      }

      result.warnings.push(...validationResult.warnings);

      // Import to database
      const importResult = await BrokerDataImporter.importBrokerData(brokerData);

      if (importResult.success) {
        result.success = true;
        result.stats = importResult.stats;
        this.log(`Successfully imported broker: ${brokerData.broker.name}`);
      } else {
        result.errors.push(`Import failed for ${filePath}: ${importResult.errors.join(', ')}`);
      }

    } catch (error) {
      result.errors.push(`Error processing ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Parse HTML file
   */
  private parseHTMLFile(content: string, filePath: string): any {
    const parser = new BrokerHTMLParser(content);
    const parsedData = parser.parse();

    // Extract broker name from file path
    const fileName = path.basename(filePath, '.html');
    const brokerName = this.extractBrokerNameFromFileName(fileName);

    // Override extracted name with file-based name if available
    if (brokerName && !parsedData.broker.name) {
      parsedData.broker.name = brokerName;
    }

    return parsedData;
  }

  /**
   * Parse JavaScript file
   */
  private parseJSFile(content: string, filePath: string): any {
    const extractedData = JavaScriptDataExtractor.extractFromBundle(content);
    const normalizedData = JavaScriptDataExtractor.convertToDatabaseFormat(extractedData);

    // If multiple brokers found, create an array for batch processing
    if (normalizedData.broker.name && extractedData.brokers.length > 1) {
      return {
        brokers: extractedData.brokers,
        source: filePath,
      };
    }

    return normalizedData;
  }

  /**
   * Extract broker name from file name
   */
  private extractBrokerNameFromFileName(fileName: string): string | null {
    // Remove common prefixes/suffixes
    const cleanName = fileName
      .replace(/-review$/i, '')
      .replace(/-broker$/i, '')
      .replace(/review-$/i, '')
      .replace(/broker-$/i, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    return cleanName || fileName;
  }

  /**
   * Check if broker already exists
   */
  private async checkExistingBroker(brokerName: string): Promise<boolean> {
    try {
      // This would need to be implemented with actual database check
      // For now, return false to allow all imports
      return false;
    } catch (error) {
      this.log(`Warning: Could not check existing broker: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Update result with batch result
   */
  private updateResult(result: ImportPipelineResult, batchResult: Partial<ImportPipelineResult>): void {
    result.processedFiles += batchResult.processedFiles || 0;
    result.importedBrokers += batchResult.importedBrokers || 0;
    result.failedFiles += batchResult.failedFiles || 0;
    result.errors.push(...(batchResult.errors || []));
    result.warnings.push(...(batchResult.warnings || []));

    // Update stats
    if (batchResult.stats) {
      result.stats.totalRegulations += batchResult.stats.totalRegulations || 0;
      result.stats.totalFeatures += batchResult.stats.totalFeatures || 0;
      result.stats.totalTradingConditions += batchResult.stats.totalTradingConditions || 0;
      result.stats.totalAccountTypes += batchResult.stats.totalAccountTypes || 0;
      result.stats.totalPlatforms += batchResult.stats.totalPlatforms || 0;
      result.stats.totalPaymentMethods += batchResult.stats.totalPaymentMethods || 0;
      result.stats.totalSupport += batchResult.stats.totalSupport || 0;
      result.stats.totalEducation += batchResult.stats.totalEducation || 0;
      result.stats.totalReviews += batchResult.stats.totalReviews || 0;
      result.stats.totalAffiliateLinks += batchResult.stats.totalAffiliateLinks || 0;
      result.stats.totalPromotions += batchResult.stats.totalPromotions || 0;
    }
  }

  /**
   * Log message
   */
  private log(message: string): void {
    if (this.config.enableLogging) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${message}`;
      this.logBuffer.push(logMessage);
      console.log(logMessage);
    }
  }

  /**
   * Get logs
   */
  getLogs(): string[] {
    return [...this.logBuffer];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logBuffer = [];
  }

  /**
   * Export logs to file
   */
  async exportLogs(filePath: string): Promise<void> {
    try {
      await fs.writeFile(filePath, this.logBuffer.join('\n'), 'utf-8');
      this.log(`Logs exported to: ${filePath}`);
    } catch (error) {
      this.log(`Failed to export logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Example usage
export async function runImportPipeline(): Promise<ImportPipelineResult> {
  const pipeline = new AutomatedImportPipeline({
    sourceDirectory: 'C:\\My Web Sites\\daily forex\\www.dailyforex.com\\forex-brokers',
    filePatterns: ['*-review.html', '*.js'],
    batchSize: 5,
    enableLogging: true,
    skipExisting: true,
    validationStrict: false,
  });

  const result = await pipeline.run();

  // Export logs
  await pipeline.exportLogs('./import-logs.txt');

  return result;
}