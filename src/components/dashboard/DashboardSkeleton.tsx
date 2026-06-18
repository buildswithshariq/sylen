import { Skeleton } from '@/components/ui/Skeleton';
import GlassCard from '@/components/ui/GlassCard';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 lg:px-12 relative bg-off-white w-full">
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-10 w-3/4 sm:w-2/3 rounded-xl" />
            <Skeleton className="h-6 w-full sm:w-5/6 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-14 w-28 rounded-xl" />
            <Skeleton className="h-14 w-40 rounded-xl" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Row 1 */}
          <div className="md:col-span-4 h-full">
            <GlassCard className="h-[280px] p-6 flex flex-col items-center justify-center space-y-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </GlassCard>
          </div>
          
          <div className="md:col-span-4 h-full">
            <GlassCard className="h-[280px] p-6 flex flex-col items-center justify-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-8 w-40 rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </GlassCard>
          </div>
          
          <div className="md:col-span-4 h-full">
            <GlassCard className="h-[280px] p-6 space-y-6">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </GlassCard>
          </div>

          {/* Row 2 */}
          <div className="md:col-span-5 h-full">
            <GlassCard className="h-[320px] p-6 space-y-6">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-7 h-full">
            <GlassCard className="h-[320px] p-6 space-y-8">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}
