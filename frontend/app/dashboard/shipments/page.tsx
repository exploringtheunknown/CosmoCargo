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
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { MOCK_SHIPMENTS, MOCK_PILOTS, SHIPMENT_STATUS_MAP, MockShipment } from '../../../src/data/mock-data';

const ShipmentManagement = () => {
  const { user } = useAuth();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<MockShipment | null>(null);
  const [selectedPilot, setSelectedPilot] = useState<string>("");

  const handleAction = (
    shipment: MockShipment,
    action: "approve" | "reject" | "assign"
  ) => {
    setSelectedShipment(shipment);
    if (action === "approve") {
      setShowApproveDialog(true);
    } else if (action === "reject") {
      setShowRejectDialog(true);
    } else {
      setShowAssignDialog(true);
      setSelectedPilot("");
    }
  };

  const confirmAction = (action: "approve" | "reject" | "assign") => {
    if (!selectedShipment) return;

    if (action === "approve") {
      toast.success(`Frakt ${selectedShipment.id} har godkänts`);
      setShowApproveDialog(false);
    } else if (action === "reject") {
      toast.success(`Frakt ${selectedShipment.id} har nekats`);
      setShowRejectDialog(false);
    } else if (action === "assign") {
      if (!selectedPilot) {
        toast.error("Välj en pilot först");
        return;
      }
      const pilot = MOCK_PILOTS.find((p) => p.id === selectedPilot);
      toast.success(
        `Frakt ${selectedShipment.id} har tilldelats till ${pilot?.name}`
      );
      setShowAssignDialog(false);
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
              <TableHead>Vikt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pilot</TableHead>
              <TableHead>Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_SHIPMENTS.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell>{shipment.customer}</TableCell>
                <TableCell>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{shipment.scheduledDate}</TableCell>
                <TableCell>{shipment.cargo}</TableCell>
                <TableCell>{shipment.weight}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      SHIPMENT_STATUS_MAP[shipment.status as keyof typeof SHIPMENT_STATUS_MAP].color
                    }`}
                  >
                    {SHIPMENT_STATUS_MAP[shipment.status as keyof typeof SHIPMENT_STATUS_MAP].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {shipment.pilot ? (
                    <div className="flex items-center gap-1">
                      <Plane className="h-4 w-4 text-space-accent-purple" />
                      {shipment.pilot}
                    </div>
                  ) : (
                    <span className="text-space-text-secondary">
                      Inte tilldelad
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {shipment.status === "pending_approval" && (
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
                          onClick={() => handleAction(shipment, "reject")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Neka
                        </Button>
                      </>
                    )}
                    {shipment.status === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(shipment, "assign")}
                      >
                        <Plane className="h-4 w-4 mr-1" />
                        Tilldela Pilot
                      </Button>
                    )}
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

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Godkänn Frakt</DialogTitle>
            <DialogDescription>
              Du håller på att godkänna frakt {selectedShipment?.id} från{" "}
              {selectedShipment?.origin} till {selectedShipment?.destination}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
            >
              Avbryt
            </Button>
            <Button onClick={() => confirmAction("approve")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Bekräfta Godkännande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neka Frakt</DialogTitle>
            <DialogDescription>
              Du håller på att neka frakt {selectedShipment?.id} från{" "}
              {selectedShipment?.origin} till {selectedShipment?.destination}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Avbryt
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmAction("reject")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Bekräfta Nekande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tilldela Pilot</DialogTitle>
            <DialogDescription>
              Välj en pilot för frakt {selectedShipment?.id} från{" "}
              {selectedShipment?.origin} till {selectedShipment?.destination}.
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
                  {MOCK_PILOTS.filter((p) => p.available).map((pilot) => (
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
    </div>
  );
};

export default ShipmentManagement;
