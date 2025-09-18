'use client';

import { ReactNode } from 'react';
import ErrorBoundary from '@/app/components/ui/error-boundary';
import { AlertTriangle, Wifi, Database } from 'lucide-react';

interface BrokersErrorBoundaryProps {
  children: ReactNode;
}

export default function BrokersErrorBoundary({ children }: BrokersErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Unable to Load Brokers
            </h2>
            <p className="text-gray-600 mb-6">
              We're having trouble loading the broker directory. This could be due to a temporary connection issue or server maintenance.
            </p>
            <div className="space-y-3 text-left text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4" />
                <span>Check your internet connection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Try refreshing the page in a few moments</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}