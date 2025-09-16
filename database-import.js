const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

class BrokerDatabaseImporter {
  constructor() {
    this.prisma = new PrismaClient();
    this.importStats = {
      totalBrokers: 0,
      importedBrokers: 0,
      updatedBrokers: 0,
      regulations: 0,
      features: 0,
      platforms: 0,
      paymentMethods: 0,
      support: 0,
      education: 0,
      reviews: 0,
      affiliateLinks: 0,
      promotions: 0,
      errors: []
    };
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log('✅ Connected to database successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async importBroker(brokerData) {
    try {
      // Check if broker already exists
      const existingBroker = await this.prisma.broker.findFirst({
        where: {
          OR: [
            { name: brokerData.name },
            { slug: brokerData.slug || this.generateSlug(brokerData.name) }
          ]
        }
      });

      let broker;
      const brokerSlug = brokerData.slug || this.generateSlug(brokerData.name);

      const brokerPayload = {
        name: brokerData.name,
        slug: brokerSlug,
        logo_url: brokerData.logoUrl || null,
        website_url: brokerData.websiteUrl || null,
        description: brokerData.description || null,
        short_description: brokerData.description ? brokerData.description.substring(0, 200) + '...' : null,
        rating: brokerData.rating || 0,
        review_count: brokerData.reviewCount || 0,
        featured_status: false,
        min_deposit: brokerData.minDeposit || 0,
        min_deposit_currency: 'USD',
        spread_type: 'Variable',
        typical_spread: brokerData.spread || null,
        max_leverage: brokerData.leverage ? parseInt(brokerData.leverage.replace(':', '')) || 0 : 0,
        established_year: brokerData.establishedYear || null,
        headquarters: brokerData.headquarters || null,
        company_size: brokerData.companySize || null,
        total_assets: brokerData.totalAssets || null,
        active_traders: brokerData.activeTraders || null,
        meta_title: `${brokerData.name} Review | BrokerAnalysis.com`,
        meta_description: `Read our comprehensive review of ${brokerData.name}. Learn about spreads, regulations, platforms, and trading conditions.`,
        affiliate_link: brokerData.affiliateLink || null,
        status: 'active'
      };

      if (existingBroker) {
        // Update existing broker
        broker = await this.prisma.broker.update({
          where: { id: existingBroker.id },
          data: brokerPayload
        });
        this.importStats.updatedBrokers++;
        console.log(`📝 Updated broker: ${broker.name}`);
      } else {
        // Create new broker
        broker = await this.prisma.broker.create({
          data: brokerPayload
        });
        this.importStats.importedBrokers++;
        console.log(`➕ Created broker: ${broker.name}`);
      }

      return broker;

    } catch (error) {
      console.error(`❌ Failed to import broker ${brokerData.name}:`, error.message);
      this.importStats.errors.push({
        broker: brokerData.name,
        error: error.message
      });
      return null;
    }
  }

  async importBrokerRegulations(brokerId, regulations) {
    try {
      for (const regulation of regulations) {
        if (regulation && regulation.length > 2) {
          await this.prisma.brokerRegulation.upsert({
            where: {
              broker_id_regulatory_body_jurisdiction: {
                broker_id: brokerId,
                regulatory_body: regulation,
                jurisdiction: 'Global' // Default jurisdiction
              }
            },
            update: {
              regulation_status: 'Regulated',
              verification_date: new Date()
            },
            create: {
              broker_id: brokerId,
              regulatory_body: regulation,
              license_number: null,
              regulation_status: 'Regulated',
              jurisdiction: 'Global',
              verification_date: new Date()
            }
          });
          this.importStats.regulations++;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to import regulations for broker ${brokerId}:`, error.message);
    }
  }

  async importBrokerFeatures(brokerId, accountTypes, platforms) {
    try {
      // Import account types as features
      for (const accountType of accountTypes || []) {
        if (accountType && accountType.length > 2) {
          await this.prisma.brokerFeature.upsert({
            where: {
              broker_id_feature_name: {
                broker_id: brokerId,
                feature_name: accountType
              }
            },
            update: {
              availability: true,
              category: 'Account Types'
            },
            create: {
              broker_id: brokerId,
              feature_name: accountType,
              feature_type: 'Account Type',
              description: `${accountType} trading account available`,
              availability: true,
              category: 'Account Types'
            }
          });
          this.importStats.features++;
        }
      }

      // Import platforms as features
      for (const platform of platforms || []) {
        if (platform && platform.length > 2) {
          await this.prisma.brokerFeature.upsert({
            where: {
              broker_id_feature_name: {
                broker_id: brokerId,
                feature_name: platform
              }
            },
            update: {
              availability: true,
              category: 'Trading Platforms'
            },
            create: {
              broker_id: brokerId,
              feature_name: platform,
              feature_type: 'Trading Platform',
              description: `${platform} trading platform supported`,
              availability: true,
              category: 'Trading Platforms'
            }
          });
          this.importStats.features++;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to import features for broker ${brokerId}:`, error.message);
    }
  }

  async importBrokerPlatforms(brokerId, platforms) {
    try {
      for (const platform of platforms || []) {
        if (platform && platform.length > 2) {
          await this.prisma.brokerPlatform.upsert({
            where: {
              broker_id_platform_name: {
                broker_id: brokerId,
                platform_name: platform
              }
            },
            update: {
              platform_type: 'Trading Platform',
              web_trading: true,
              mobile_trading: true,
              desktop_trading: true
            },
            create: {
              broker_id: brokerId,
              platform_name: platform,
              platform_type: 'Trading Platform',
              version: 'Latest',
              web_trading: true,
              mobile_trading: true,
              desktop_trading: true,
              features: JSON.stringify(['Charting', 'Order Execution', 'Market Analysis'])
            }
          });
          this.importStats.platforms++;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to import platforms for broker ${brokerId}:`, error.message);
    }
  }

  async importBrokerReviews(brokerId, brokerData) {
    try {
      if (brokerData.rating && brokerData.rating > 0) {
        await this.prisma.brokerReview.create({
          data: {
            broker_id: brokerId,
            user_id: null, // System generated
            username: 'System',
            email: 'system@brokeranalysis.com',
            rating: Math.round(brokerData.rating),
            review_text: brokerData.description || `Automated review based on broker analysis`,
            trading_experience: 5,
            account_type: 'Standard Account',
            verified_status: true,
            approved: true,
            helpful_count: 0,
            reported_count: 0
          }
        });
        this.importStats.reviews++;
      }
    } catch (error) {
      console.error(`❌ Failed to import review for broker ${brokerId}:`, error.message);
    }
  }

  async importBrokerAffiliateLinks(brokerId, brokerData) {
    try {
      if (brokerData.affiliateLink) {
        await this.prisma.brokerAffiliateLink.upsert({
          where: {
            broker_id_link_url: {
              broker_id: brokerId,
              link_url: brokerData.affiliateLink
            }
          },
          update: {
            active_status: true,
            click_count: 0,
            conversion_count: 0
          },
          create: {
            broker_id: brokerId,
            link_url: brokerData.affiliateLink,
            tracking_code: null,
            commission_rate: 0.05,
            commission_type: 'cpa',
            active_status: true,
            geo_targeting: '{}',
            device_targeting: '{}',
            click_count: 0,
            conversion_count: 0
          }
        });
        this.importStats.affiliateLinks++;
      }
    } catch (error) {
      console.error(`❌ Failed to import affiliate link for broker ${brokerId}:`, error.message);
    }
  }

  async importCompleteBroker(brokerData) {
    const broker = await this.importBroker(brokerData);
    if (!broker) return false;

    // Import related data
    await this.importBrokerRegulations(broker.id, brokerData.regulations || []);
    await this.importBrokerFeatures(broker.id, brokerData.accountTypes || [], brokerData.platforms || []);
    await this.importBrokerPlatforms(broker.id, brokerData.platforms || []);
    await this.importBrokerReviews(broker.id, brokerData);
    await this.importBrokerAffiliateLinks(broker.id, brokerData);

    this.importStats.totalBrokers++;
    return true;
  }

  async importBatch(validatedBrokers) {
    console.log(`🚀 Starting batch import of ${validatedBrokers.length} brokers...`);

    for (let i = 0; i < validatedBrokers.length; i++) {
      const broker = validatedBrokers[i];
      const progress = ((i + 1) / validatedBrokers.length * 100).toFixed(1);

      process.stdout.write(`\r📊 Progress: ${progress}% (${i + 1}/${validatedBrokers.length}) - ${broker.name}`);

      await this.importCompleteBroker(broker);
    }

    console.log('\n✅ Batch import completed!');
    return this.importStats;
  }

  async generateImportReport() {
    const report = {
      metadata: {
        importedAt: new Date().toISOString(),
        importStats: this.importStats
      },
      summary: {
        totalBrokersProcessed: this.importStats.totalBrokers,
        brokersImported: this.importStats.importedBrokers,
        brokersUpdated: this.importStats.updatedBrokers,
        totalRecordsImported: Object.values(this.importStats)
          .filter(val => typeof val === 'number')
          .reduce((sum, val) => sum + val, 0) - this.importStats.totalBrokers,
        errors: this.importStats.errors.length
      },
      details: this.importStats
    };

    fs.writeFileSync('import-report.json', JSON.stringify(report, null, 2));
    console.log(`📄 Import report saved to: import-report.json`);
    return report;
  }
}

// Main import process
async function runDatabaseImport() {
  try {
    console.log('🚀 Starting database import process...');

    // Load validated data
    const validatedData = JSON.parse(fs.readFileSync('validated-brokers.json', 'utf8'));
    console.log(`📖 Loaded ${validatedData.validBrokers.length} validated brokers`);

    const importer = new BrokerDatabaseImporter();

    // Connect to database
    const connected = await importer.connect();
    if (!connected) {
      console.error('❌ Cannot proceed with database import');
      return null;
    }

    // Import data
    const stats = await importer.importBatch(validatedData.validBrokers);

    // Generate report
    const report = await importer.generateImportReport();

    // Disconnect from database
    await importer.disconnect();

    // Display summary
    console.log('\n📊 Import Summary:');
    console.log(`   Total brokers processed: ${stats.totalBrokers}`);
    console.log(`   Brokers imported: ${stats.importedBrokers}`);
    console.log(`   Brokers updated: ${stats.updatedBrokers}`);
    console.log(`   Regulations imported: ${stats.regulations}`);
    console.log(`   Features imported: ${stats.features}`);
    console.log(`   Platforms imported: ${stats.platforms}`);
    console.log(`   Reviews imported: ${stats.reviews}`);
    console.log(`   Affiliate links imported: ${stats.affiliateLinks}`);
    console.log(`   Total errors: ${stats.errors.length}`);

    if (stats.errors.length > 0) {
      console.log('\n⚠️  Import Errors:');
      stats.errors.slice(0, 5).forEach(error => {
        console.log(`   - ${error.broker}: ${error.error}`);
      });
    }

    console.log('\n🎉 Database import completed successfully!');
    return report;

  } catch (error) {
    console.error(`❌ Database import failed: ${error.message}`);
    return null;
  }
}

// Run the import
runDatabaseImport().then(results => {
  if (results) {
    console.log(`\n✅ Successfully imported broker data to database!`);
  }
});