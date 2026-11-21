import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import type { Role } from "@/lib/roles";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Update Profile | FixMate" };

// Shared by every role. The current values come straight from the DB through BetterAuth.
export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/profile");

  return (
    <>
      <PageHeader title="Update Profile" description="Keep your photo and contact details up to date." />
      <ProfileForm
        initial={{
          name: user.name,
          email: user.email,
          role: (user.role ?? "customer") as Role,
          image: user.image ?? "",
          phone: user.phone ?? "",
          area: user.area ?? "",
          bio: user.bio ?? "",
        }}
      />
    </>
  );
}