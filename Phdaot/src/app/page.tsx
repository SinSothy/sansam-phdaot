import { PageHeader } from "@/components/dashboard/PageHeader";
import { RecentlyViewed } from "@/components/dashboard/RecentlyViewed";
import { YourWorkspaces } from "@/components/dashboard/YourWorkspaces";

export default function Home() {
  return (
    <>
      <PageHeader />
      <RecentlyViewed />
      <YourWorkspaces />
    </>
  );
}
