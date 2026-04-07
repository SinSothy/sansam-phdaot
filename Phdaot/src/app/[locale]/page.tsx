import { PageHeader } from "@/components/dashboard/PageHeader";
import { YourWorkspaces } from "@/components/dashboard/YourWorkspaces";
import { setRequestLocale } from "next-intl/server";

export default async function Home(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <PageHeader />
      <YourWorkspaces />
    </>
  );
}

