import { PageLoader } from "@/components/shared/page-loader";

// Shown inside the public layout (navbar + footer stay visible) while a page loads
export default function Loading() {
  return <PageLoader />;
}