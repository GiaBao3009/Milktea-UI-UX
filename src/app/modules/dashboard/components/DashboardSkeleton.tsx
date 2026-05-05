import React from "react";
import { Card } from "@app/components/ui/card";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} variant="default" padding="lg">
            <div className="flex flex-col h-full">
              {/* Header skeleton */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Content skeleton */}
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
              </div>

              {/* Footer skeleton */}
              <div className="flex items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-2" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart and Top Customers Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Skeleton */}
        <div className="lg:col-span-2">
          <Card variant="default" padding="lg">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-8" />
              </div>

              {/* Chart content */}
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </Card>
        </div>

        {/* Top Customers Skeleton */}
        <div className="lg:col-span-1">
          <Card variant="default" padding="none" className="h-full">
            <div className="flex flex-col h-full">
              {/* Header skeleton */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>

              {/* Customer List skeleton */}
              <div className="flex-1">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Rank Badge skeleton */}
                        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0" />

                        {/* Customer Info skeleton */}
                        <div className="flex-1 min-w-0">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>

                        {/* Ticket Count skeleton */}
                        <div className="text-right flex-shrink-0">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 mb-1 ml-auto" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer skeleton */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
