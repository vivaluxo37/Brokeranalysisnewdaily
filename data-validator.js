const fs = require('fs');

class BrokerDataValidator {
  constructor() {
    this.validationRules = this.initializeValidationRules();
    this.transformers = this.initializeTransformers();
    this.stats = {
      totalProcessed: 0,
      valid: 0,
      invalid: 0,
      warnings: [],
      errors: []
    };
  }

  initializeValidationRules() {
    return {
      // Required fields
      required: {
        name: {
          validate: (value) => value && typeof value === 'string' && value.trim().length > 2,
          message: 'Broker name must be at least 3 characters long'
        },
        rating: {
          validate: (value) => value !== undefined && value !== null && !isNaN(value) && value >= 0 && value <= 5,
          message: 'Rating must be a number between 0 and 5'
        }
      },

      // Format validation
      format: {
        name: {
          validate: (value) => /^[a-zA-Z0-9\s&\-\.']+$/.test(value.trim()),
          message: 'Broker name contains invalid characters'
        },
        description: {
          validate: (value) => !value || (value.length >= 50 && value.length <= 2000),
          message: 'Description should be between 50 and 2000 characters'
        },
        minDeposit: {
          validate: (value) => !value || /^\d+$/.test(value.toString()),
          message: 'Minimum deposit should be a positive number'
        },
        spread: {
          validate: (value) => !value || (!isNaN(value) && value >= 0),
          message: 'Spread should be a positive number'
        },
        leverage: {
          validate: (value) => !value || /^[\d:]+$/.test(value.toString()),
          message: 'Leverage should be in format like "1:100", "1:500", etc.'
        }
      },

      // Business logic validation
      business: {
        regulations: {
          validate: (value) => Array.isArray(value) && value.length > 0,
          message: 'Broker should have at least one regulatory body'
        },
        platforms: {
          validate: (value) => Array.isArray(value) && value.length > 0,
          message: 'Broker should have at least one trading platform'
        }
      }
    };
  }

  initializeTransformers() {
    return {
      // Clean and normalize data
      name: (value) => {
        if (!value) return null;
        return value
          .replace(/url\([^)]+\)/g, '') // Remove CSS url() patterns
          .replace(/^[^a-zA-Z]+/, '') // Remove leading non-alphabetic characters
          .replace(/[^a-zA-Z0-9\s&\-\.']$/g, '') // Remove trailing invalid characters
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      },

      description: (value) => {
        if (!value) return null;
        return value
          .replace(/The DFX Team at DailyForex[^.]*(\.|\s*For\s+more\s+information)/gi, '') // Remove DailyForex boilerplate
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      },

      regulations: (value) => {
        if (!Array.isArray(value)) return [];
        return value
          .map(reg => reg.toString().trim())
          .filter(reg => {
            // Filter out invalid entries
            const invalidPatterns = [
              /^[^a-zA-Z]*$/, // No letters
              /^(the|and|or|of|in|by|to|for|with)$/i, // Common words only
              /^\d+px$/, // CSS pixel values
              /https?:\/\//, // URLs
              /\.(png|jpg|jpeg|gif|svg)$/i, // Image files
              /^[{}'";]*$/, // CSS/JS fragments
              /^img\-responsive/i, // CSS classes
              /^lazy\s*=\s*loading$/i // Loading attributes
            ];
            return !invalidPatterns.some(pattern => pattern.test(reg));
          })
          .filter((reg, index, self) => self.indexOf(reg) === index); // Remove duplicates
      },

      accountTypes: (value) => {
        if (!Array.isArray(value)) return [];
        return value
          .map(type => type.toString().toLowerCase().trim())
          .filter(type => type.length > 2)
          .map(type => {
            // Normalize common account type names
            const normalizations = {
              'islamic account': 'Islamic Account',
              'islamic': 'Islamic Account',
              'standard account': 'Standard Account',
              'standard': 'Standard Account',
              'mini account': 'Mini Account',
              'mini': 'Mini Account',
              'micro account': 'Micro Account',
              'micro': 'Micro Account',
              'vip account': 'VIP Account',
              'vip': 'VIP Account',
              'ecn account': 'ECN Account',
              'ecn': 'ECN Account',
              'stp account': 'STP Account',
              'stp': 'STP Account'
            };
            return normalizations[type] || type.charAt(0).toUpperCase() + type.slice(1);
          })
          .filter((type, index, self) => self.indexOf(type) === index);
      },

      platforms: (value) => {
        if (!Array.isArray(value)) return [];
        return value
          .map(platform => platform.toString().toLowerCase().trim())
          .filter(platform => platform.length > 2)
          .map(platform => {
            // Normalize platform names
            const normalizations = {
              'mt4': 'MetaTrader 4',
              'metatrader 4': 'MetaTrader 4',
              'mt5': 'MetaTrader 5',
              'metatrader 5': 'MetaTrader 5',
              'ctrader': 'cTrader',
              'web trader': 'Web Trader',
              'mobile trader': 'Mobile Trader'
            };
            return normalizations[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
          })
          .filter((platform, index, self) => self.indexOf(platform) === index);
      },

      rating: (value) => {
        if (!value || isNaN(value)) return 0;
        const rating = parseFloat(value);
        return Math.max(0, Math.min(5, rating)); // Clamp between 0 and 5
      },

      minDeposit: (value) => {
        if (!value) return null;
        const cleanValue = value.toString().replace(/[^\d]/g, '');
        return cleanValue ? parseInt(cleanValue) : null;
      },

      spread: (value) => {
        if (!value || isNaN(value)) return null;
        return Math.max(0, parseFloat(value));
      },

      leverage: (value) => {
        if (!value) return null;
        // Clean leverage format
        return value.toString().replace(/[^0-9:]/g, '');
      }
    };
  }

  validateBroker(broker) {
    this.stats.totalProcessed++;
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      transformed: {}
    };

    // Validate and transform each field
    Object.keys(this.validationRules.required).forEach(field => {
      const rule = this.validationRules.required[field];
      const transformer = this.transformers[field];

      // Transform first
      const transformedValue = transformer ? transformer(broker[field]) : broker[field];
      validation.transformed[field] = transformedValue;

      // Then validate
      if (!rule.validate(transformedValue)) {
        validation.isValid = false;
        validation.errors.push({
          field,
          message: rule.message,
          value: transformedValue
        });
      }
    });

    // Validate format rules
    Object.keys(this.validationRules.format).forEach(field => {
      const rule = this.validationRules.format[field];
      const transformer = this.transformers[field];

      if (broker[field] !== undefined && broker[field] !== null) {
        const transformedValue = transformer ? transformer(broker[field]) : broker[field];
        validation.transformed[field] = transformedValue;

        if (transformedValue && !rule.validate(transformedValue)) {
          validation.warnings.push({
            field,
            message: rule.message,
            value: transformedValue
          });
        }
      }
    });

    // Validate business logic
    Object.keys(this.validationRules.business).forEach(field => {
      const rule = this.validationRules.business[field];
      const transformer = this.transformers[field];

      if (broker[field] !== undefined) {
        const transformedValue = transformer ? transformer(broker[field]) : broker[field];
        validation.transformed[field] = transformedValue;

        if (!rule.validate(transformedValue)) {
          validation.warnings.push({
            field,
            message: rule.message,
            value: transformedValue
          });
        }
      }
    });

    // Apply transformations to remaining fields
    Object.keys(broker).forEach(field => {
      if (!validation.transformed[field] && this.transformers[field]) {
        validation.transformed[field] = this.transformers[field](broker[field]);
      } else if (!validation.transformed[field]) {
        validation.transformed[field] = broker[field];
      }
    });

    // Generate slug from name
    if (validation.transformed.name) {
      validation.transformed.slug = this.generateSlug(validation.transformed.name);
    }

    // Add metadata
    validation.transformed.validatedAt = new Date().toISOString();
    validation.transformed.sourceFile = broker.sourceFile;

    return validation;
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  validateBatch(brokers) {
    const results = {
      valid: [],
      invalid: [],
      summary: {
        total: brokers.length,
        valid: 0,
        invalid: 0,
        totalErrors: 0,
        totalWarnings: 0,
        topErrors: {},
        topWarnings: {}
      }
    };

    console.log(`🔍 Validating ${brokers.length} broker records...`);

    brokers.forEach((broker, index) => {
      const progress = ((index + 1) / brokers.length * 100).toFixed(1);
      process.stdout.write(`\r📊 Progress: ${progress}% (${index + 1}/${brokers.length})`);

      const validation = this.validateBroker(broker);

      if (validation.isValid) {
        results.valid.push(validation.transformed);
        this.stats.valid++;
      } else {
        results.invalid.push({
          original: broker,
          validation: validation
        });
        this.stats.invalid++;
      }

      // Track errors and warnings
      validation.errors.forEach(error => {
        results.summary.totalErrors++;
        results.summary.topErrors[error.field] = (results.summary.topErrors[error.field] || 0) + 1;
      });

      validation.warnings.forEach(warning => {
        results.summary.totalWarnings++;
        results.summary.topWarnings[warning.field] = (results.summary.topWarnings[warning.field] || 0) + 1;
      });
    });

    results.summary.valid = results.valid.length;
    results.summary.invalid = results.invalid.length;

    console.log('\n✅ Validation completed!');
    return results;
  }

  saveResults(results, outputFile = 'validated-brokers.json') {
    const exportData = {
      metadata: {
        validatedAt: new Date().toISOString(),
        validationStats: results.summary,
        totalProcessed: this.stats.totalProcessed,
        validRecords: this.stats.valid,
        invalidRecords: this.stats.invalid
      },
      validBrokers: results.valid,
      invalidBrokers: results.invalid,
      validationRules: Object.keys(this.validationRules).length
    };

    fs.writeFileSync(outputFile, JSON.stringify(exportData, null, 2));
    console.log(`💾 Validation results saved to: ${outputFile}`);
    return outputFile;
  }
}

// Main validation process
async function runValidation() {
  try {
    console.log('🚀 Starting broker data validation...');

    // Load extracted data
    const rawData = JSON.parse(fs.readFileSync('extracted-brokers-data.json', 'utf8'));
    console.log(`📖 Loaded ${rawData.brokers.length} broker records`);

    const validator = new BrokerDataValidator();
    const results = validator.validateBatch(rawData.brokers);

    // Save results
    validator.saveResults(results);

    // Display summary
    console.log('\n📊 Validation Summary:');
    console.log(`   Total processed: ${results.summary.total}`);
    console.log(`   Valid records: ${results.summary.valid}`);
    console.log(`   Invalid records: ${results.summary.invalid}`);
    console.log(`   Total errors: ${results.summary.totalErrors}`);
    console.log(`   Total warnings: ${results.summary.totalWarnings}`);

    if (results.summary.topErrors && Object.keys(results.summary.topErrors).length > 0) {
      console.log('\n🔥 Top Error Fields:');
      Object.entries(results.summary.topErrors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([field, count]) => {
          console.log(`   ${field}: ${count} errors`);
        });
    }

    if (results.summary.topWarnings && Object.keys(results.summary.topWarnings).length > 0) {
      console.log('\n⚠️  Top Warning Fields:');
      Object.entries(results.summary.topWarnings)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([field, count]) => {
          console.log(`   ${field}: ${count} warnings`);
        });
    }

    // Show sample valid broker
    if (results.valid.length > 0) {
      console.log('\n✅ Sample Valid Broker:');
      const sample = results.valid[0];
      console.log(`   Name: ${sample.name}`);
      console.log(`   Rating: ${sample.rating}`);
      console.log(`   Slug: ${sample.slug}`);
      console.log(`   Regulations: ${sample.regulations.length} found`);
      console.log(`   Platforms: ${sample.platforms.length} found`);
    }

    console.log('\n🎉 Data validation completed successfully!');
    return results;

  } catch (error) {
    console.error(`❌ Validation failed: ${error.message}`);
    return null;
  }
}

// Run the validation
runValidation().then(results => {
  if (results) {
    console.log(`\n✅ Ready for database import with ${results.valid.length} validated brokers!`);
  }
});