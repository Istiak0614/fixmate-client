import { Hero } from "@/components/home/hero";
import { FeaturedServices } from "@/components/home/featured-services";
import { serverFetch } from "@/lib/server-api";
import type { Service } from "@/lib/types";

// Home page. Featured services are fetched on the server (fresh on every request).
// "How It Works" and "Categories & Why Choose Us" sections are added in Client step 10.
export default async function HomePage() {
  const featured = await serverFetch<Service[]>("/services/featured");

  return (
    <main>
      <Hero />
      <FeaturedServices services={featured} />
    </main>
  );
}