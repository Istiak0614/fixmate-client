import { Hero } from "@/components/home/hero";
import { FeaturedServices } from "@/components/home/featured-services";
import { HowItWorks } from "@/components/home/how-it-works";
import { CategoriesWhy } from "@/components/home/categories-why";
import { serverFetch } from "@/lib/server-api";
import type { Service } from "@/lib/types";

// Home page. Featured services are fetched on the server (fresh on every request).
export default async function HomePage() {
  const featured = await serverFetch<Service[]>("/services/featured");

  return (
    <main>
      <Hero />
      <FeaturedServices services={featured} />
      <HowItWorks />
      <CategoriesWhy />
    </main>
  );
}