import { NotFoundView } from "@/components/shared/not-found-view";

// Shown when a public page calls notFound() (e.g. a missing service). Keeps the navbar + footer.
export default function PublicNotFound() {
  return <NotFoundView />;
}