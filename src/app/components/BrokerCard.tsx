'use client';

import Link from 'next/link';
import { Star, Plus, MapPin, Building2, Calendar, CreditCard, Monitor, Shield } from 'lucide-react';
import { Broker } from '@/lib/db/schema';

interface BrokerCardProps {
  broker: Broker;
  viewMode?: 'grid' | 'list';
  isInComparison?: boolean;
  onToggleComparison?: (brokerSlug: string) => void;
}

export function BrokerCard({
  broker,
  viewMode = 'grid',
  isInComparison = false,
  onToggleComparison
}: BrokerCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" />
      );
    }

    return stars;
  };

  // Regulation badges component
  const RegulationBadges = ({ regulations }: { regulations: any[] }) => (
    <div className="broker-card-badges">
      {regulations.slice(0, 3).map((reg, index) => (
        <span key={index} className="broker-card-badge broker-card-badge-regulation flex items-center">
          <Shield className="w-3 h-3 mr-1" />
          {reg.regulatory_body || reg}
        </span>
      ))}
      {regulations.length > 3 && (
        <span className="broker-card-badge">
          +{regulations.length - 3}
        </span>
      )}
    </div>
  );

  // Platform badges component
  const PlatformBadges = ({ platforms }: { platforms: any[] }) => (
    <div className="broker-card-badges">
      {platforms.slice(0, 4).map((platform, index) => (
        <span key={index} className="broker-card-badge broker-card-badge-platform flex items-center">
          <Monitor className="w-3 h-3 mr-1" />
          {platform.platform_name || platform}
        </span>
      ))}
    </div>
  );

  // Company info component
  const CompanyInfo = ({ headquarters, established_year }: { headquarters?: string; established_year?: number }) => (
    <div className="text-xs text-gray-600 mb-2 flex flex-wrap gap-2">
      {headquarters && (
        <span className="flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {headquarters}
        </span>
      )}
      {established_year && (
        <span className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Since {established_year}
        </span>
      )}
    </div>
  );

  // Account types info
  const AccountTypesInfo = ({ accountTypes }: { accountTypes: string[] }) => {
    const hasIslamic = accountTypes.some(acc => acc.toLowerCase().includes('islamic'));
    const hasDemo = accountTypes.some(acc => acc.toLowerCase().includes('demo'));

    return (
      <div className="text-xs text-gray-600 mb-1">
        <span className="flex items-center">
          <Building2 className="w-3 h-3 mr-1" />
          {accountTypes.length} account types
        </span>
        {hasIslamic && (
          <span className="ml-2 text-purple-600 flex items-center">
            • Islamic
          </span>
        )}
        {hasDemo && (
          <span className="ml-2 text-green-600 flex items-center">
            • Demo
          </span>
        )}
      </div>
    );
  };

  // Payment methods info
  const PaymentMethodsInfo = ({ paymentMethods }: { paymentMethods: string[] }) => (
    <div className="text-xs text-gray-600 mb-1">
      <span className="flex items-center">
        <CreditCard className="w-3 h-3 mr-1" />
        {paymentMethods.length}+ payment methods
      </span>
    </div>
  );

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLDivElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="broker-card broker-card-interactive broker-card-list">
        <div className="broker-card-content">
          <div className="broker-card-header">
            {/* Logo */}
            <div className="broker-card-logo">
              <img
                src={broker.logo_url || '/broker-logos/default-broker-logo.svg'}
                alt={broker.name}
                onError={handleLogoError}
              />
              <div className="hidden absolute inset-0 bg-gray-200 rounded-lg items-center justify-center">
                <span className="text-xl font-bold text-gray-600">
                  {broker.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Broker Info */}
            <div className="broker-card-info">
              <div className="flex items-center justify-between mb-2">
                <h3 className="broker-card-name text-truncate">
                  {broker.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {broker.featured_status && (
                    <div className="broker-card-featured">
                      Featured
                    </div>
                  )}
                  <button
                    onClick={() => onToggleComparison?.(broker.slug)}
                    className={`broker-card-comparison ${
                      isInComparison
                        ? 'active'
                        : 'inactive'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating and Reviews */}
              <div className="broker-card-rating">
                <div className="broker-card-stars">
                  {renderStars(broker.rating)}
                </div>
                <span className="broker-card-meta">
                  {broker.rating.toFixed(1)} ({broker.review_count} reviews)
                </span>
              </div>

              {/* Company Info */}
              <CompanyInfo headquarters={broker.headquarters} established_year={broker.established_year} />

              
              {/* Enhanced Key Details */}
              <div className="broker-card-details">
                <div className="broker-card-detail">
                  <div className="broker-card-detail-label">Min Deposit</div>
                  <div className="broker-card-detail-value text-blue-600">
                    ${broker.min_deposit.toLocaleString()} {broker.min_deposit_currency}
                  </div>
                </div>
                <div className="broker-card-detail">
                  <div className="broker-card-detail-label">Spread</div>
                  <div className="broker-card-detail-value text-purple-600">{broker.spread_type}</div>
                </div>
                <div className="broker-card-detail">
                  <div className="broker-card-detail-label">Leverage</div>
                  <div className="broker-card-detail-value text-green-600">1:{broker.max_leverage}</div>
                </div>
                                {broker.established_year && (
                  <div className="broker-card-detail">
                    <div className="broker-card-detail-label">Since</div>
                    <div className="broker-card-detail-value text-gray-800">{broker.established_year}</div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
                                              </div>

              {/* Description */}
              {broker.short_description && (
                <p className="broker-card-description">
                  {broker.short_description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="broker-card-footer">
            <div className="text-xs text-gray-500">
              Updated {new Date(broker.updated_at).toLocaleDateString()}
            </div>
            <div className="broker-card-actions">
              <Link
                href={`/brokers/${broker.slug}`}
                className="broker-card-button broker-card-button-primary"
              >
                Read Review
              </Link>
              {broker.affiliate_link && (
                <a
                  href={broker.affiliate_link}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="broker-card-button broker-card-button-secondary"
                >
                  Visit Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="broker-card broker-card-interactive">
      <div className="broker-card-content">
        {/* Header */}
        <div className="broker-card-header">
          <div className="broker-card-logo">
            <img
              src={broker.logo_url || '/broker-logos/default-broker-logo.svg'}
              alt={broker.name}
              onError={handleLogoError}
            />
            <div className="hidden absolute inset-0 bg-gray-200 rounded-lg items-center justify-center">
              <span className="text-xl font-bold text-gray-600">
                {broker.name.charAt(0)}
              </span>
            </div>
          </div>

          <div className="broker-card-info">
            <h3 className="broker-card-name text-truncate">
              {broker.name}
            </h3>
            <div className="broker-card-rating">
              <div className="broker-card-stars">
                {renderStars(broker.rating)}
              </div>
              <span className="broker-card-meta">
                {broker.rating.toFixed(1)} ({broker.review_count} reviews)
              </span>
            </div>
            {/* Company Info */}
            <CompanyInfo headquarters={broker.headquarters} established_year={broker.established_year} />
          </div>

          {broker.featured_status && (
            <div className="broker-card-featured">
              Featured
            </div>
          )}

          <button
            onClick={() => onToggleComparison?.(broker.slug)}
            className={`broker-card-comparison ${
              isInComparison
                ? 'active'
                : 'inactive'
            }`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="broker-card-body">
          
          {/* Enhanced Key Details */}
          <div className="broker-card-details">
            <div className="broker-card-detail">
              <div className="broker-card-detail-label">Min Deposit</div>
              <div className="broker-card-detail-value text-blue-600">
                ${broker.min_deposit.toLocaleString()} {broker.min_deposit_currency}
              </div>
            </div>
            <div className="broker-card-detail">
              <div className="broker-card-detail-label">Max Leverage</div>
              <div className="broker-card-detail-value text-green-600">1:{broker.max_leverage}</div>
            </div>
            <div className="broker-card-detail">
              <div className="broker-card-detail-label">Spread Type</div>
              <div className="broker-card-detail-value text-purple-600">{broker.spread_type}</div>
            </div>
                      </div>

          
          {/* Description */}
          {broker.short_description && (
            <p className="broker-card-description">
              {broker.short_description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="broker-card-footer">
          <div className="text-xs text-gray-500">
            Updated {new Date(broker.updated_at).toLocaleDateString()}
          </div>

          {/* Action Buttons */}
          <div className="broker-card-actions">
            <Link
              href={`/brokers/${broker.slug}`}
              className="broker-card-button broker-card-button-primary"
            >
              Read Review
            </Link>
            {broker.affiliate_link && (
              <a
                href={broker.affiliate_link}
                target="_blank"
                rel="nofollow noreferrer"
                className="broker-card-button broker-card-button-secondary"
              >
                Visit Site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}