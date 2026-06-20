import { Skeleton } from "@/components/ui/Skeleton";
import GlassCard from "@/components/ui/GlassCard";

export default function SharedReportSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 lg:px-12 relative bg-off-white w-full">
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header / Share Card Skeleton */}
        <div className="text-center mb-12 flex justify-center">
          <div className="glass-strong rounded-3xl p-8 sm:p-12 w-full max-w-2xl flex flex-col items-center">
            <Skeleton className="h-16 w-16 rounded-full mb-4" />
            <Skeleton className="h-10 w-3/4 rounded-lg mb-8" />

            <div className="flex items-center justify-center gap-6 w-full max-w-md">
              <div className="flex flex-col items-center flex-1">
                <Skeleton className="h-4 w-16 mb-2 rounded" />
                <Skeleton className="h-12 w-24 rounded-lg" />
              </div>
              <div className="w-px h-16 bg-stone-200" />
              <div className="flex flex-col items-center flex-1">
                <Skeleton className="h-4 w-16 mb-2 rounded" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 sm:p-8 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2 rounded" />
              <Skeleton className="h-10 w-3/4 rounded-lg" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-6 w-full rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-6 w-full rounded" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8 space-y-8">
            <Skeleton className="h-6 w-1/2 rounded" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
