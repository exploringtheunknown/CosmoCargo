import React from "react";
import { Package, Plus, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import QuickActions from "@/components/shared/QuickActions";
import KPIDashboard from "@/components/shared/KPIDashboard";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getShipments } from "@/services/shipment-service";
import { Loader2 } from "lucide-react";
import { ShipmentStatus } from "@/model/types";
import { Button } from "@/components/ui/button";

const CustomerDashboard: React.FC = () => {
  const router = useRouter();

  const { data: shipmentsData, isLoading, error } = useQuery({
    queryKey: ['customer-shipments'],
    queryFn: () => getShipments({ pageSize: 50 }),
    retry: 3,
    retryDelay: 1000,
  });

  const quickActions = [
    {
      id: "create",
      label: "Skapa ny frakt",
      icon: Plus,
      onClick: () => router.push("/dashboard/shipments/add"),
    },
    {
      id: "view_all",
      label: "Visa alla mina frakter",
      icon: Package,
      onClick: () => router.push("/dashboard/shipments/ongoing"),
      variant: "outline" as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-space-accent-purple" />
          <p className="text-space-text-secondary">Laddar dina frakter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-red-500">Ett fel uppstod vid laddning av data</p>
        <p className="text-space-text-secondary text-sm">
          {error instanceof Error ? error.message : 'Okänt fel'}
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Försök igen
        </Button>
      </div>
    );
  }

  const shipments = shipmentsData?.items || [];
  
  const getStatusInSwedish = (status: ShipmentStatus): string => {
    switch (status) {
      case ShipmentStatus.WaitingForApproval:
        return "Väntar godkännande";
      case ShipmentStatus.Approved:
        return "Godkänd";
      case ShipmentStatus.Assigned:
        return "Tilldelad";
      case ShipmentStatus.InTransit:
        return "Under transport";
      case ShipmentStatus.Delivered:
        return "Levererad";
      case ShipmentStatus.Cancelled:
        return "Avbruten";
      default:
        return status;
    }
  };

  const recentActivity = shipments
    .slice(0, 5)
    .map(s => ({
      freightId: s.id,
      activity: `Status: ${getStatusInSwedish(s.status)}`,
      timestamp: new Date(s.createdAt).toLocaleString('sv-SE'),
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-orbitron text-space-text-primary">
            Välkommen tillbaka!
          </h1>
          <p className="text-space-text-secondary">
            Hantera dina frakter och skapa nya leveranser
          </p>
        </div>
      </div>

      <KPIDashboard userRole="customer" />

      <QuickActions title="Snabbåtgärder" actions={quickActions} />

      <Card className="space-card">
        <CardHeader>
          <CardTitle className="font-orbitron flex items-center space-x-2">
            <Clock className="h-5 w-5 text-space-accent-purple" />
            <span>Senaste aktivitet</span>
          </CardTitle>
          <CardDescription>
            Statusuppdateringar på dina frakter
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-space-text-secondary text-center py-4">
              Ingen aktivitet att visa
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 border-l-2 border-space-accent-purple/30 bg-space-secondary/20 rounded-r"
                >
                  <div className="flex-1">
                    <p className="text-space-text-primary font-medium">
                      {activity.freightId}
                    </p>
                    <p className="text-space-text-secondary text-sm">
                      {activity.activity}
                    </p>
                    <p className="text-xs text-space-text-secondary mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="space-card">
        <CardHeader>
          <CardTitle className="font-orbitron">Snabbnavigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/shipments/book">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Plus className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">
                      Skapa frakt
                    </h3>
                    <p className="text-sm text-space-text-secondary">
                      Boka en ny leverans
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/shipments/ongoing">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">
                      Alla mina frakter
                    </h3>
                    <p className="text-sm text-space-text-secondary">
                      Se fullständig historik
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
