import { Suspense } from "react";
import SharedReportContent from "@/components/shared-report/SharedReportContent";
import SharedReportSkeleton from "@/components/shared-report/SharedReportSkeleton";

export const metadata = {
  title: "Sustainability Report | Sylen",
  description: "View this shared sustainability report on Sylen.",
};

export default function SharedReportPage() {
  return (
    <Suspense fallback={<SharedReportSkeleton />}>
      <SharedReportContent />
    </Suspense>
  );
}
