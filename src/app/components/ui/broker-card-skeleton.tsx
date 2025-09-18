interface BrokerCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

const shimmerStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite'
};

export function BrokerCardSkeleton({ viewMode = 'grid' }: BrokerCardSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="broker-card-skeleton broker-card-skeleton-list">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden" style={shimmerStyle} />
          <div className="flex-1 space-y-2">
            <div className="h-6 rounded overflow-hidden w-48" style={shimmerStyle} />
            <div className="flex items-center space-x-2">
              <div className="h-4 rounded overflow-hidden w-24" style={shimmerStyle} />
              <div className="h-4 rounded overflow-hidden w-16" style={shimmerStyle} />
            </div>
          </div>
          <div className="w-8 h-8 rounded overflow-hidden" style={shimmerStyle} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg overflow-hidden" style={shimmerStyle} />
          ))}
        </div>
        <div className="flex space-x-2">
          <div className="flex-1 h-10 rounded-lg overflow-hidden" style={shimmerStyle} />
          <div className="flex-1 h-10 rounded-lg overflow-hidden" style={shimmerStyle} />
        </div>
      </div>
    );
  }

  return (
    <div className="broker-card-skeleton">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden" style={shimmerStyle} />
        <div className="flex-1 space-y-2">
          <div className="h-6 rounded overflow-hidden w-32" style={shimmerStyle} />
          <div className="flex items-center space-x-2">
            <div className="h-4 rounded overflow-hidden w-24" style={shimmerStyle} />
            <div className="h-4 rounded overflow-hidden w-16" style={shimmerStyle} />
          </div>
        </div>
        <div className="w-8 h-8 rounded overflow-hidden" style={shimmerStyle} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-6 w-16 rounded-full overflow-hidden" style={shimmerStyle} />
        <div className="h-6 w-20 rounded-full overflow-hidden" style={shimmerStyle} />
        <div className="h-6 w-12 rounded-full overflow-hidden" style={shimmerStyle} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg overflow-hidden" style={shimmerStyle} />
        ))}
      </div>

      <div className="h-12 rounded-lg overflow-hidden mb-4" style={shimmerStyle} />

      <div className="flex space-x-2">
        <div className="flex-1 h-10 rounded-lg overflow-hidden" style={shimmerStyle} />
        <div className="flex-1 h-10 rounded-lg overflow-hidden" style={shimmerStyle} />
      </div>
    </div>
  );
}