import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/session";

/**
 * Public layout: Navbar + page + Footer (dashboard pages use their own layout, without the footer).
 * The session is read here on the server, so the navbar is correct on the very first paint.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user ? { name: user.name, email: user.email, image: user.image, role: user.role } : null} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
}