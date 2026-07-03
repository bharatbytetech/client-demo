import type { NextPage } from "next";
import { useAuth } from "@artsdiva/hooks/useAuth";
import { DashboardContainer } from "@artsdiva/containers/DashboardContainer";

const HomePage: NextPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center">
        <h1 className="text-2xl font-medium">ArtsDiva</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <DashboardContainer />
    </main>
  );
};

export default HomePage;
