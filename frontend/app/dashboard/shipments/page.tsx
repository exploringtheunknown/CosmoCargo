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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Package,
  CheckCircle,
  XCircle,
  Plane,
  Loader,
  Zap,
} from "lucide-react";
import Shipment from "@/model/shipment";
import { assignPilot, getShipments, ShipmentsFilter, updateShipmentStatus } from "@/services/shipment-service";
import { ShipmentStatus } from "@/model/types";
import { useQuery } from "@tanstack/react-query";
import { getStatusColorClass, getStatusDisplayText } from "@/utils/shipment-status";
import { getPilots, PilotsFilter } from "@/services/pilot-service";
import Pagination from "@/components/ui/pagination";
import { api } from "@/services/api";

const ShipmentManagement = () => {
  const { user } = useAuth();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedPilot, setSelectedPilot] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showChaosDialog, setShowChaosDialog] = useState(false);
  const [chaosLoading, setChaosLoading] = useState(false);
  const [chaosError, setChaosError] = useState<string | null>(null);
  const [chaosSuccess, setChaosSuccess] = useState<string | null>(null);
  
  const { data: shipments, refetch, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["shipments", page],
    queryFn: () => {
      const filter: ShipmentsFilter = {
        page,
        pageSize: 10
      };
      return getShipments(filter);
    },
  });

  const { data: pilots } = useQuery({
    queryKey: ["pilots", page],
    queryFn: () => {
      const filter: PilotsFilter = {
        page,
        pageSize: 10
      };
      return getPilots(filter);
    },
  });


  const handleAction = async (
    shipment: Shipment,
    action: "approve" | "denied" | "assign"
  ) => {
    setSelectedShipment(shipment);
    if (action === "approve") {
      await updateShipmentStatus(shipment.id, {status: ShipmentStatus.Approved});
    } else if (action === "denied") {
      await updateShipmentStatus(shipment.id, {status: ShipmentStatus.Denied});
    } else {
      setShowAssignDialog(true);
      setSelectedPilot("");
    }
  };

  const confirmAction = async (action: "assign") => {
    if (!selectedShipment) return;

    if (action === "assign") {
      if (!selectedPilot) {
        toast.error("Välj en pilot först");
        return;
      }
      await assignPilot(selectedShipment.id, {pilotId: selectedPilot});
      toast.success(
        `Frakt ${selectedShipment.id} har tilldelats`
      );
      setShowAssignDialog(false);
      refetch();
    }
  };

  const handleTriggerChaos = async () => {
    if (!selectedShipment) return;
    setChaosLoading(true);
    setChaosError(null);
    setChaosSuccess(null);
    try {
      await api.post("/chaos-events/trigger", { shipmentId: selectedShipment.id });
      setChaosSuccess("Chaos event triggered!");
    } catch {
      setChaosError("Kunde inte trigga chaos event.");
    } finally {
      setChaosLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Åtkomst nekad</h2>
        <p className="text-space-text-secondary text-center">
          Du har inte behörighet att hantera frakter. Denna sida är endast för
          administratörer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Hantera Frakter
          </h1>
          <p className="text-space-text-secondary">
            Godkänn, tilldela och övervaka frakter
          </p>
        </div>
      </div>

      {shipmentsLoading && (
        <div className="flex flex-col items-center justify-center h-64 p-8">
          <Loader className="w-12 h-12 text-space-text-secondary mb-4 animate-spin" />
        </div>
      )}
      
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
              <TableHead>Pilot</TableHead>
              <TableHead>Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments?.items.map((shipment, ix) => (
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
                  {shipment.pilot ? (
                    <div className="flex items-center gap-1">
                      <Plane className="h-4 w-4 text-space-accent-purple" />
                      {shipment.pilot.name}
                    </div>
                  ) : (
                    <span className="text-space-text-secondary">
                      Inte tilldelad
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {shipment.status === ShipmentStatus.WaitingForApproval && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleAction(shipment, "approve")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Godkänn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleAction(shipment, "denied")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Neka
                        </Button>
                      </>
                    )}
                    {shipment.status === ShipmentStatus.Approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(shipment, "assign")}
                      >
                        <Plane className="h-4 w-4 mr-1" />
                        Tilldela Pilot
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowChaosDialog(true);
                      }}
                      aria-label="Trigger Chaos Event"
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Trigger Chaos
                    </Button>
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-1" />
                      Detaljer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {shipments && shipments.totalPages > 1 && (
        <Pagination
          totalCount={shipments.totalCount}
          page={page}
          pageSize={shipments.pageSize}
          totalPages={shipments.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tilldela Pilot</DialogTitle>
            <DialogDescription>
              Välj en pilot för frakt {selectedShipment?.id} från{" "}
              {selectedShipment?.sender.planet} till {selectedShipment?.receiver.planet}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tillgängliga Piloter
              </label>
              <Select value={selectedPilot} onValueChange={setSelectedPilot}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj en pilot" />
                </SelectTrigger>
                <SelectContent>
                  {pilots?.items.filter((p) => p.available).map((pilot) => (
                    <SelectItem key={pilot.id} value={pilot.id}>
                      {pilot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
            >
              Avbryt
            </Button>
            <Button onClick={() => confirmAction("assign")}>
              <Plane className="h-4 w-4 mr-2" />
              Tilldela Pilot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chaos Event Dialog */}
      <Dialog open={showChaosDialog} onOpenChange={setShowChaosDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trigger Chaos Event</DialogTitle>
            <DialogDescription>
              Bekräfta att du vill trigga ett chaos event för frakt {selectedShipment?.id}.
            </DialogDescription>
          </DialogHeader>
          {chaosError && <p className="text-red-500">{chaosError}</p>}
          {chaosSuccess && <p className="text-green-600">{chaosSuccess}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChaosDialog(false)}>
              Avbryt
            </Button>
            <Button onClick={handleTriggerChaos} disabled={chaosLoading}>
              {chaosLoading ? "Triggar..." : "Trigger Chaos Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipmentManagement;
