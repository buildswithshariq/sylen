import { Skeleton } from "@/components/ui/Skeleton";
import GlassCard from "@/components/ui/GlassCard";

export default function AssessmentSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 lg:px-12 relative overflow-hidden flex flex-col items-center bg-off-white w-full">
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl z-0" />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col flex-1">
        {/* Header & Progress Skeleton */}
        <div className="mb-8 space-y-4">
          <Skeleton className="h-8 w-3/4 sm:w-1/2 rounded-lg" />
          <Skeleton className="h-5 w-full sm:w-5/6 rounded-md" />
          <div className="pt-4">
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between mt-2">
              <Skeleton className="h-3 w-16 rounded-sm" />
              <Skeleton className="h-3 w-16 rounded-sm" />
              <Skeleton className="h-3 w-16 rounded-sm" />
              <Skeleton className="h-3 w-16 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Step Content Skeleton */}
        <div className="flex-1 min-h-[400px]">
          <GlassCard className="p-6 sm:p-10 md:p-12 h-full flex flex-col space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-7 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-sm" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-5 w-1/4 rounded-sm" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-1/4 rounded-sm" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </GlassCard>
        </div>

        {/* Navigation Buttons Skeleton */}
        <div className="flex items-center justify-between mt-8">
          <Skeleton className="h-14 w-24 rounded-xl" />
          <Skeleton className="h-14 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
