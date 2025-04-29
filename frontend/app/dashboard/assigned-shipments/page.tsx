"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ShipmentStatus } from "@/model/types";
import { getShipments, ShipmentsFilter, updateShipmentStatus } from "@/services/shipment-service";
import { getStatusDisplayText, getStatusColorClass } from "@/utils/shipment-status";

const AssignedShipments = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  
  const { data: shipments, refetch, isLoading } = useQuery({
    queryKey: ["shipments", page],
    queryFn: () => {
      const filter: ShipmentsFilter = {
        page,
        pageSize: 10
      };
      return getShipments(filter);
    },
  });

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

  const handleUpdateStatus = async (shipmentId: string, newStatus: ShipmentStatus) => {
    await updateShipmentStatus(shipmentId, { status: newStatus });
    toast.success(
      `Status uppdaterad för frakt ${shipmentId} till ${getStatusDisplayText(newStatus)}`
    );
    refetch();
  };

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
      </div>

      {shipments && shipments.items.length > 0 ? (
        <div className="rounded-md border border-space-secondary bg-space-primary">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Kund</TableHead>
                <TableHead>Ursprung</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Last</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.items.map((shipment, ix) => (
                <TableRow key={shipment.id}>
                  <TableCell>{ix + 1}</TableCell>
                  <TableCell>{shipment.sender.name}</TableCell>
                  <TableCell>{shipment.sender.station + " @ " + shipment.sender.planet}</TableCell>
                  <TableCell>{shipment.receiver.station + " @ " + shipment.receiver.planet}</TableCell>
                  <TableCell>{shipment.category}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(shipment.status)}`}>
                      {getStatusDisplayText(shipment.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {shipment.status === "Assigned" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(shipment.id, ShipmentStatus.InTransit)
                          }
                        >
                          Påbörja Transport
                        </Button>
                      )}
                      {shipment.status === "InTransit" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(shipment.id, ShipmentStatus.Delivered)
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
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 p-8">
          <Loader className="w-12 h-12 text-space-text-secondary mb-4 animate-spin" />
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

      {/* Pagination Controls */}
      {shipments && shipments.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-space-text-secondary">
            Visar {shipments.items.length} av {shipments.totalCount} leveranser
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Sida {page} av {shipments.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(shipments.totalPages, p + 1))}
              disabled={page === shipments.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedShipments;
