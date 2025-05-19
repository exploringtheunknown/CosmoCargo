"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import EngineStatusCard from "@/components/admin/EngineStatusCard";
import ChaosEventLogsCard from "@/components/admin/ChaosEventLogsCard";
import ManualChaosTriggerCard from "@/components/admin/ManualChaosTriggerCard";
import ChaosEventDefinitionsPanel from "@/components/admin/ChaosEventDefinitionsPanel";
import GalacticEventFeed from "@/components/admin/GalacticEventFeed";
import ChaosLogRetentionCard from "@/components/admin/ChaosLogRetentionCard";

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-2xl font-medium mb-2">Åtkomst nekad</h2>
        <p className="text-space-text-secondary text-center">
          Du har inte behörighet att se adminsidan. Denna sida är endast för administratörer.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 grid gap-8 grid-cols-1 lg:grid-cols-2">
      {/* Left column: widgets stacked */}
      <div className="flex flex-col gap-6">
        <EngineStatusCard />
        <ChaosLogRetentionCard />
        <ManualChaosTriggerCard />
        <ChaosEventDefinitionsPanel />
        <GalacticEventFeed />
      </div>
      {/* Right column: logs */}
      <div>
        <ChaosEventLogsCard />
      </div>
    </div>
  );
};

export default AdminDashboardPage; 