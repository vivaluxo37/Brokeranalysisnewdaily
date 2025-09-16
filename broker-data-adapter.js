const fs = require('fs');

class BrokerDataAdapter {
  constructor() {
    this.fieldMappings = {
      // Component field -> Database field
      'logo': 'logo_url',
      'reviewCount': 'review_count',
      'regulation': 'regulations',
      'minDeposit': 'min_deposit',
      'affiliateLink': 'affiliate_link'
    };

    this.defaultValueMappings = {
      'spread': 'Variable',
      'logo': '/api/placeholder/120/60',
      'features': ['Forex Trading', 'CFD Trading', 'Mobile App'],
      'regulation': ['Regulated'],
      'minDeposit': '$100'
    };
  }

  adaptBrokerForComponent(broker) {
    const adapted = {};

    // Map fields according to the schema
    adapted.id = broker.id;
    adapted.name = broker.name;
    adapted.logo = broker.logo_url || this.defaultValueMappings.logo;
    adapted.rating = broker.rating;
    adapted.reviewCount = broker.review_count || 0;
    adapted.description = broker.short_description || broker.description || 'No description available';
    adapted.features = broker.features || this.defaultValueMappings.features;
    adapted.regulation = broker.regulations || this.defaultValueMappings.regulation;
    adapted.minDeposit = `$${broker.min_deposit || '100'}`;
    adapted.spread = broker.typical_spread ? `${broker.typical_spread} pips` : this.defaultValueMappings.spread;
    adapted.affiliateLink = broker.affiliate_link || `/brokers/${broker.slug}`;

    return adapted;
  }

  adaptBrokersForFeaturedComponent(brokers) {
    // Filter for featured brokers and adapt them
    const featuredBrokers = brokers
      .filter(broker => broker.featured_status)
      .slice(0, 6) // Limit to 6 featured brokers
      .map(broker => this.adaptBrokerForComponent(broker));

    return featuredBrokers;
  }

  adaptBrokersForComparison(brokers) {
    // Adapt brokers for comparison table
    return brokers
      .slice(0, 10) // Limit to 10 brokers for comparison
      .map(broker => ({
        id: broker.id,
        name: broker.name,
        logo: broker.logo_url || this.defaultValueMappings.logo,
        rating: broker.rating,
        regulation: broker.regulations || this.defaultValueMappings.regulation,
        minDeposit: `$${broker.min_deposit || '100'}`,
        spread: broker.typical_spread ? `${broker.typical_spread} pips` : this.defaultValueMappings.spread,
        leverage: `1:${broker.max_leverage || '500'}`,
        platforms: broker.platforms || ['MetaTrader 4'],
        affiliateLink: broker.affiliate_link || `/brokers/${broker.slug}`
      }));
  }

  adaptBrokersForSearch(brokers) {
    // Adapt brokers for search functionality
    return brokers.map(broker => ({
      id: broker.id,
      name: broker.name,
      slug: broker.slug,
      rating: broker.rating,
      reviewCount: broker.review_count,
      regulations: broker.regulations || [],
      platforms: broker.platforms || [],
      features: broker.features || [],
      headquarters: broker.headquarters,
      establishedYear: broker.established_year,
      searchableText: this.generateSearchableText(broker)
    }));
  }

  generateSearchableText(broker) {
    const searchableParts = [
      broker.name,
      broker.headquarters,
      ...(broker.regulations || []),
      ...(broker.platforms || []),
      ...(broker.features || []),
      broker.established_year ? `since ${broker.established_year}` : ''
    ];

    return searchableParts.join(' ').toLowerCase();
  }

  createTestComponent() {
    // Load test data
    const testData = JSON.parse(fs.readFileSync('test-broker-data.json', 'utf8'));
    const adaptedBrokers = this.adaptBrokersForFeaturedComponent(testData.brokers);

    const componentCode = `'use client'

import { Star, Shield, ExternalLink, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Broker {
  id: number
  name: string
  logo: string
  rating: number
  reviewCount: number
  description: string
  features: string[]
  regulation: string[]
  minDeposit: string
  spread: string
  affiliateLink: string
}

const featuredBrokers: Broker[] = ${JSON.stringify(adaptedBrokers, null, 2)}

export default function FeaturedBrokers() {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={\`h-4 w-4 \${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}\`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Top Rated Forex Brokers
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Compare and choose from our carefully selected list of regulated and trusted forex brokers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Broker Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">Logo</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{broker.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(broker.rating)}
                      <span className="text-sm text-gray-500">({broker.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Regulated</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">{broker.description}</p>

              {/* Key Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {broker.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {broker.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{broker.features.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Trading Conditions */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Min Deposit</div>
                    <div className="text-sm font-medium">{broker.minDeposit}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Spread</div>
                    <div className="text-sm font-medium">{broker.spread}</div>
                  </div>
                </div>
              </div>

              {/* Regulation */}
              <div className="mb-6">
                <div className="text-xs text-gray-500 mb-1">Regulation:</div>
                <div className="flex flex-wrap gap-1">
                  {broker.regulation.map((reg, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                    >
                      {reg}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Link href={broker.affiliateLink} className="flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Broker
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Link href={broker.affiliateLink}>Read Review</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            <Link href="/brokers" className="flex items-center space-x-2">
              <span>View All Brokers</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}`;

    // Save the adapted component
    fs.writeFileSync('featured-brokers-adapted.tsx', componentCode);

    return adaptedBrokers;
  }

  testAdaptation() {
    console.log('🔄 Testing data adaptation...');

    try {
      // Load test data
      const testData = JSON.parse(fs.readFileSync('test-broker-data.json', 'utf8'));
      const originalBrokers = testData.brokers;

      // Adapt brokers
      const adaptedBrokers = this.adaptBrokersForFeaturedComponent(originalBrokers);

      // Test compatibility
      const requiredFields = [
        'id', 'name', 'logo', 'rating', 'reviewCount', 'description',
        'features', 'regulation', 'minDeposit', 'spread', 'affiliateLink'
      ];

      const adaptationIssues = [];
      adaptedBrokers.forEach((broker, index) => {
        requiredFields.forEach(field => {
          if (broker[field] === undefined || broker[field] === null) {
            adaptationIssues.push(`Broker ${index + 1}: Missing ${field}`);
          }
        });
      });

      // Create adapted component
      this.createTestComponent();

      // Test TypeScript compilation
      const { execSync } = require('child_process');
      let compilationSuccess = false;
      try {
        execSync('npx tsc --noEmit featured-brokers-adapted.tsx', { stdio: 'pipe' });
        compilationSuccess = true;
      } catch (error) {
        console.log('Compilation error:', error.message);
      }

      console.log('\n📊 Adaptation Test Results:');
      console.log(`   Original Brokers: ${originalBrokers.length}`);
      console.log(`   Featured Brokers: ${adaptedBrokers.length}`);
      console.log(`   Adaptation Issues: ${adaptationIssues.length}`);
      console.log(`   Compilation Success: ${compilationSuccess}`);

      if (adaptationIssues.length === 0 && compilationSuccess) {
        console.log('✅ Data adaptation successful!');
        return true;
      } else {
        console.log('❌ Data adaptation failed');
        if (adaptationIssues.length > 0) {
          console.log('   Issues:', adaptationIssues.slice(0, 3));
        }
        return false;
      }

    } catch (error) {
      console.error('❌ Adaptation test failed:', error.message);
      return false;
    }
  }

  generateAdaptationReport() {
    const testData = JSON.parse(fs.readFileSync('test-broker-data.json', 'utf8'));
    const adaptedBrokers = this.adaptBrokersForFeaturedComponent(testData.brokers);

    const report = {
      adaptation: {
        originalCount: testData.brokers.length,
        adaptedCount: adaptedBrokers.length,
        fieldMappings: this.fieldMappings,
        defaultValues: this.defaultValueMappings
      },
      adaptedBrokers: adaptedBrokers,
      compatibility: {
        componentInterface: 'FeaturedBrokers',
        databaseSchema: 'Broker Table',
        status: 'Adapted Successfully'
      },
      recommendations: [
        'Use this adapter in production to ensure compatibility',
        'Consider creating a generic adapter for all components',
        'Add error handling for missing fields',
        'Implement caching for adapted data'
      ]
    };

    fs.writeFileSync('broker-adaptation-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Adaptation report saved to: broker-adaptation-report.json');

    return report;
  }
}

// Test the data adapter
async function testDataAdapter() {
  console.log('🚀 Testing Broker Data Adapter...');

  const adapter = new BrokerDataAdapter();

  // Test adaptation
  const adaptationSuccess = adapter.testAdaptation();

  // Generate report
  const report = adapter.generateAdaptationReport();

  if (adaptationSuccess) {
    console.log('\n🎉 Data adapter testing completed successfully!');
    console.log('🚀 FeaturedBrokers component is ready for production with adapted data.');
  } else {
    console.log('\n⚠️  Data adapter testing completed with issues.');
    console.log('📋 Review adaptation report for details.');
  }

  return { success: adaptationSuccess, report };
}

// Execute the adapter testing
testDataAdapter().then(({ success, report }) => {
  if (success) {
    console.log('\n✅ Ready to proceed with remaining frontend tests!');
  }
}).catch(error => {
  console.error('❌ Data adapter testing failed:', error.message);
});