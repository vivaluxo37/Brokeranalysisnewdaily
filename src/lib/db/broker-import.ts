import { PrismaClient } from '@prisma/client';
import { BrokerDataValidator } from '@/lib/validators/broker-data-validator';

const prisma = new PrismaClient();

export interface ImportResult {
  success: boolean;
  brokerId?: string;
  errors: string[];
  warnings: string[];
  stats: {
    regulations: number;
    features: number;
    tradingConditions: number;
    accountTypes: number;
    platforms: number;
    paymentMethods: number;
    support: number;
    education: number;
    reviews: number;
    affiliateLinks: number;
    promotions: number;
  };
}

export class BrokerDataImporter {
  /**
   * Import complete broker data
   */
  static async importBrokerData(data: any): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      errors: [],
      warnings: [],
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
      // Validate data
      const validationResult = BrokerDataValidator.validateCompleteBrokerData(data);
      if (!validationResult.isValid) {
        result.errors = validationResult.errors;
        result.warnings = validationResult.warnings;
        return result;
      }

      // Check if broker exists
      let broker = await prisma.broker.findFirst({
        where: {
          OR: [
            { name: data.broker.name },
            { slug: data.broker.slug }
          ]
        }
      });

      // Create or update broker
      if (broker) {
        // Update existing broker
        broker = await prisma.broker.update({
          where: { id: broker.id },
          data: {
            ...data.broker,
            updated_at: new Date(),
          },
        });
        result.warnings.push(`Updated existing broker: ${data.broker.name}`);
      } else {
        // Create new broker
        broker = await prisma.broker.create({
          data: data.broker,
        });
      }

      result.brokerId = broker.id;

      // Import related data
      await this.importRelatedData(broker.id, data, result);

      result.success = true;
    } catch (error) {
      result.errors.push(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Import related data (regulations, features, etc.)
   */
  private static async importRelatedData(brokerId: string, data: any, result: ImportResult) {
    // Regulations
    if (data.regulations && Array.isArray(data.regulations)) {
      for (const regulation of data.regulations) {
        try {
          await prisma.brokerRegulation.upsert({
            where: {
              broker_id_regulatory_body_jurisdiction: {
                broker_id: brokerId,
                regulatory_body: regulation.regulatory_body,
                jurisdiction: regulation.jurisdiction || '',
              }
            },
            update: { ...regulation, broker_id: brokerId },
            create: { ...regulation, broker_id: brokerId },
          });
          result.stats.regulations++;
        } catch (error) {
          result.errors.push(`Failed to import regulation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Features
    if (data.features && Array.isArray(data.features)) {
      for (const feature of data.features) {
        try {
          await prisma.brokerFeature.upsert({
            where: {
              broker_id_feature_name: {
                broker_id: brokerId,
                feature_name: feature.feature_name,
              }
            },
            update: { ...feature, broker_id: brokerId },
            create: { ...feature, broker_id: brokerId },
          });
          result.stats.features++;
        } catch (error) {
          result.errors.push(`Failed to import feature: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Trading conditions
    if (data.tradingConditions && Array.isArray(data.tradingConditions)) {
      for (const condition of data.tradingConditions) {
        try {
          await prisma.brokerTradingCondition.upsert({
            where: {
              broker_id_instrument_type: {
                broker_id: brokerId,
                instrument_type: condition.instrument_type,
              }
            },
            update: { ...condition, broker_id: brokerId },
            create: { ...condition, broker_id: brokerId },
          });
          result.stats.tradingConditions++;
        } catch (error) {
          result.errors.push(`Failed to import trading condition: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Account types
    if (data.accountTypes && Array.isArray(data.accountTypes)) {
      for (const accountType of data.accountTypes) {
        try {
          await prisma.brokerAccountType.upsert({
            where: {
              broker_id_account_name: {
                broker_id: brokerId,
                account_name: accountType.account_name,
              }
            },
            update: { ...accountType, broker_id: brokerId },
            create: { ...accountType, broker_id: brokerId },
          });
          result.stats.accountTypes++;
        } catch (error) {
          result.errors.push(`Failed to import account type: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Platforms
    if (data.platforms && Array.isArray(data.platforms)) {
      for (const platform of data.platforms) {
        try {
          await prisma.brokerPlatform.upsert({
            where: {
              broker_id_platform_name: {
                broker_id: brokerId,
                platform_name: platform.platform_name,
              }
            },
            update: { ...platform, broker_id: brokerId },
            create: { ...platform, broker_id: brokerId },
          });
          result.stats.platforms++;
        } catch (error) {
          result.errors.push(`Failed to import platform: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Payment methods
    if (data.paymentMethods && Array.isArray(data.paymentMethods)) {
      for (const paymentMethod of data.paymentMethods) {
        try {
          await prisma.brokerPaymentMethod.upsert({
            where: {
              broker_id_payment_method_currency: {
                broker_id: brokerId,
                payment_method: paymentMethod.payment_method,
                currency: paymentMethod.currency || '',
              }
            },
            update: { ...paymentMethod, broker_id: brokerId },
            create: { ...paymentMethod, broker_id: brokerId },
          });
          result.stats.paymentMethods++;
        } catch (error) {
          result.errors.push(`Failed to import payment method: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Support
    if (data.support && Array.isArray(data.support)) {
      for (const support of data.support) {
        try {
          await prisma.brokerSupport.upsert({
            where: {
              broker_id_support_type: {
                broker_id: brokerId,
                support_type: support.support_type,
              }
            },
            update: { ...support, broker_id: brokerId },
            create: { ...support, broker_id: brokerId },
          });
          result.stats.support++;
        } catch (error) {
          result.errors.push(`Failed to import support: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Education
    if (data.education && Array.isArray(data.education)) {
      for (const education of data.education) {
        try {
          await prisma.brokerEducation.create({
            data: { ...education, broker_id: brokerId },
          });
          result.stats.education++;
        } catch (error) {
          result.errors.push(`Failed to import education: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Reviews
    if (data.reviews && Array.isArray(data.reviews)) {
      for (const review of data.reviews) {
        try {
          await prisma.brokerReview.create({
            data: { ...review, broker_id: brokerId },
          });
          result.stats.reviews++;
        } catch (error) {
          result.errors.push(`Failed to import review: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Affiliate links
    if (data.affiliateLinks && Array.isArray(data.affiliateLinks)) {
      for (const affiliateLink of data.affiliateLinks) {
        try {
          await prisma.brokerAffiliateLink.create({
            data: { ...affiliateLink, broker_id: brokerId },
          });
          result.stats.affiliateLinks++;
        } catch (error) {
          result.errors.push(`Failed to import affiliate link: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Promotions
    if (data.promotions && Array.isArray(data.promotions)) {
      for (const promotion of data.promotions) {
        try {
          await prisma.brokerPromotion.create({
            data: { ...promotion, broker_id: brokerId },
          });
          result.stats.promotions++;
        } catch (error) {
          result.errors.push(`Failed to import promotion: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
  }

  /**
   * Import multiple brokers from an array
   */
  static async importMultipleBrokers(brokersData: any[]): Promise<{
    success: boolean;
    results: ImportResult[];
    totalStats: {
      imported: number;
      failed: number;
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
  }> {
    const results: ImportResult[] = [];
    const totalStats = {
      imported: 0,
      failed: 0,
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
    };

    for (const brokerData of brokersData) {
      const result = await this.importBrokerData(brokerData);
      results.push(result);

      if (result.success) {
        totalStats.imported++;
        totalStats.totalRegulations += result.stats.regulations;
        totalStats.totalFeatures += result.stats.features;
        totalStats.totalTradingConditions += result.stats.tradingConditions;
        totalStats.totalAccountTypes += result.stats.accountTypes;
        totalStats.totalPlatforms += result.stats.platforms;
        totalStats.totalPaymentMethods += result.stats.paymentMethods;
        totalStats.totalSupport += result.stats.support;
        totalStats.totalEducation += result.stats.education;
        totalStats.totalReviews += result.stats.reviews;
        totalStats.totalAffiliateLinks += result.stats.affiliateLinks;
        totalStats.totalPromotions += result.stats.promotions;
      } else {
        totalStats.failed++;
      }
    }

    return {
      success: totalStats.imported > 0,
      results,
      totalStats,
    };
  }

  /**
   * Get import statistics
   */
  static async getImportStats(): Promise<{
    totalBrokers: number;
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
  }> {
    const [
      totalBrokers,
      totalRegulations,
      totalFeatures,
      totalTradingConditions,
      totalAccountTypes,
      totalPlatforms,
      totalPaymentMethods,
      totalSupport,
      totalEducation,
      totalReviews,
      totalAffiliateLinks,
      totalPromotions,
    ] = await Promise.all([
      prisma.broker.count(),
      prisma.brokerRegulation.count(),
      prisma.brokerFeature.count(),
      prisma.brokerTradingCondition.count(),
      prisma.brokerAccountType.count(),
      prisma.brokerPlatform.count(),
      prisma.brokerPaymentMethod.count(),
      prisma.brokerSupport.count(),
      prisma.brokerEducation.count(),
      prisma.brokerReview.count(),
      prisma.brokerAffiliateLink.count(),
      prisma.brokerPromotion.count(),
    ]);

    return {
      totalBrokers,
      totalRegulations,
      totalFeatures,
      totalTradingConditions,
      totalAccountTypes,
      totalPlatforms,
      totalPaymentMethods,
      totalSupport,
      totalEducation,
      totalReviews,
      totalAffiliateLinks,
      totalPromotions,
    };
  }

  /**
   * Clean up old data (optional)
   */
  static async cleanupOldData(daysToKeep: number = 30): Promise<{
    deletedBrokers: number;
    deletedRegulations: number;
    deletedFeatures: number;
    deletedTradingConditions: number;
    deletedAccountTypes: number;
    deletedPlatforms: number;
    deletedPaymentMethods: number;
    deletedSupport: number;
    deletedEducation: number;
    deletedReviews: number;
    deletedAffiliateLinks: number;
    deletedPromotions: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const [
      deletedBrokers,
      deletedRegulations,
      deletedFeatures,
      deletedTradingConditions,
      deletedAccountTypes,
      deletedPlatforms,
      deletedPaymentMethods,
      deletedSupport,
      deletedEducation,
      deletedReviews,
      deletedAffiliateLinks,
      deletedPromotions,
    ] = await Promise.all([
      prisma.broker.deleteMany({
        where: { updated_at: { lt: cutoffDate } },
      }),
      prisma.brokerRegulation.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerFeature.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerTradingCondition.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerAccountType.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerPlatform.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerPaymentMethod.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerSupport.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerEducation.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerReview.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerAffiliateLink.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
      prisma.brokerPromotion.deleteMany({
        where: { created_at: { lt: cutoffDate } },
      }),
    ]);

    return {
      deletedBrokers: deletedBrokers.count,
      deletedRegulations: deletedRegulations.count,
      deletedFeatures: deletedFeatures.count,
      deletedTradingConditions: deletedTradingConditions.count,
      deletedAccountTypes: deletedAccountTypes.count,
      deletedPlatforms: deletedPlatforms.count,
      deletedPaymentMethods: deletedPaymentMethods.count,
      deletedSupport: deletedSupport.count,
      deletedEducation: deletedEducation.count,
      deletedReviews: deletedReviews.count,
      deletedAffiliateLinks: deletedAffiliateLinks.count,
      deletedPromotions: deletedPromotions.count,
    };
  }
}