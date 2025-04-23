"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, AlertCircle } from "lucide-react";
import { fetchShipments, Shipment } from '../../../lib/api-services';
import { useQuery } from '@tanstack/react-query';

const statusMap = {
  pending: { label: "Väntande", color: "bg-amber-500" },
  in_transit: { label: "Under transport", color: "bg-blue-500" },
  completed: { label: "Levererad", color: "bg-green-500" },
  cancelled: { label: "Avbruten", color: "bg-red-500" },
};

const AssignedShipments = () => {
  const { user } = useAuth();
  const { data: shipments = [], error, isLoading } = useQuery<Shipment[], Error>({
    queryKey: ['assignedShipments'],
    queryFn: fetchShipments
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading shipments</div>;

  const handleUpdateStatus = (shipmentId: string, newStatus: string) => {
    toast.success(
      `Status uppdaterad för frakt ${shipmentId} till ${
        statusMap[newStatus as keyof typeof statusMap].label
      }`
    );
  };

  if (user?.role !== "pilot") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Åtkomst nekad</h2>
        <p className="text-space-text-secondary text-center">
          Du har inte behörighet att se tilldelade frakter. Denna sida är endast
          för piloter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Tilldelade Frakter
          </h1>
          <p className="text-space-text-secondary">
            Hantera dina tilldelade frakter och uppdatera deras status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Rocket className="h-5 w-5 text-space-accent-purple" />
          <span className="font-medium">Pilot: {user.name}</span>
        </div>
      </div>

      {shipments.length > 0 ? (
        <div className="rounded-md border border-space-secondary bg-space-primary">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Frakt ID</TableHead>
                <TableHead>Kund</TableHead>
                <TableHead>Ursprung</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Schemalagd Datum</TableHead>
                <TableHead>Last</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>{shipment.customer}</TableCell>
                  <TableCell>{shipment.origin}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>{shipment.scheduledDate}</TableCell>
                  <TableCell>{shipment.cargo}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusMap[shipment.status as keyof typeof statusMap]
                          .color
                      }`}
                    >
                      {
                        statusMap[shipment.status as keyof typeof statusMap]
                          .label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {shipment.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(shipment.id, "in_transit")
                          }
                        >
                          Påbörja Transport
                        </Button>
                      )}
                      {shipment.status === "in_transit" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(shipment.id, "completed")
                          }
                        >
                          Markera Levererad
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-space-secondary rounded-md p-8">
          <CheckCircle className="w-12 h-12 text-space-text-secondary mb-4" />
          <h3 className="text-xl font-medium mb-1">Inga tilldelade frakter</h3>
          <p className="text-space-text-secondary text-center">
            Du har inga tilldelade frakter för tillfället. När en administratör
            tilldelar dig frakter kommer de att visas här.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedShipments;
