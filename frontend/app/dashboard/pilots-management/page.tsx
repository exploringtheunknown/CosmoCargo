"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  Rocket,
  UserPlus,
  UserCheck,
  UserX,
  Edit,
} from "lucide-react";

// Mock data for pilots
const MOCK_PILOTS = [
  {
    id: "P1001",
    name: "Erik Nilsson",
    email: "pilot@example.com",
    status: "active",
    experience: "5 years",
    assignedShipments: 1,
    rating: 4.8,
  },
  {
    id: "P1002",
    name: "Anna Lindberg",
    email: "anna.lindberg@example.com",
    status: "inactive",
    experience: "3 years",
    assignedShipments: 0,
    rating: 4.5,
  },
  {
    id: "P1003",
    name: "Lars Svensson",
    email: "lars.svensson@example.com",
    status: "active",
    experience: "7 years",
    assignedShipments: 2,
    rating: 4.9,
  },
];

const PilotsManagement = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState<
    (typeof MOCK_PILOTS)[0] | null
  >(null);

  const handleAction = (
    pilot: (typeof MOCK_PILOTS)[0],
    action: "approve" | "suspend"
  ) => {
    setSelectedPilot(pilot);
    if (action === "approve") {
      setShowApproveDialog(true);
    } else {
      setShowSuspendDialog(true);
    }
  };

  const confirmAction = (action: "approve" | "suspend") => {
    if (!selectedPilot) return;

    if (action === "approve") {
      toast.success(`Pilot ${selectedPilot.name} har aktiverats`);
      setShowApproveDialog(false);
    } else {
      toast.success(`Pilot ${selectedPilot.name} har inaktiverats`);
      setShowSuspendDialog(false);
    }
  };

  const handleAddPilot = () => {
    router.push("/dashboard/pilots/add");
  };

  const handleEditPilot = (id: string) => {
    router.push(`/dashboard/pilots/edit/${id}`);
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Åtkomst nekad</h2>
        <p className="text-space-text-secondary text-center">
          Du har inte behörighet att hantera piloter. Denna sida är endast för
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
            Hantera Piloter
          </h1>
          <p className="text-space-text-secondary">
            Övervaka och hantera piloter för CosmoCargo™ fraktuppdrag
          </p>
        </div>
        <Button
          className="flex items-center gap-2 space-button"
          onClick={handleAddPilot}
        >
          <UserPlus className="h-4 w-4" />
          <span>Lägg till Pilot</span>
        </Button>
      </div>

      <div className="rounded-md border border-space-secondary bg-space-primary">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pilot ID</TableHead>
              <TableHead>Namn</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erfarenhet</TableHead>
              <TableHead>Tilldelade Frakter</TableHead>
              <TableHead>Betyg</TableHead>
              <TableHead>Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PILOTS.map((pilot) => (
              <TableRow key={pilot.id}>
                <TableCell className="font-medium">{pilot.id}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-space-accent-purple" />
                  {pilot.name}
                </TableCell>
                <TableCell>{pilot.email}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      pilot.status === "active" ? "bg-green-500" : "bg-gray-500"
                    }
                  >
                    {pilot.status === "active" ? "Aktiv" : "Inaktiv"}
                  </Badge>
                </TableCell>
                <TableCell>{pilot.experience}</TableCell>
                <TableCell>{pilot.assignedShipments}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">{pilot.rating}</span>
                    <span className="ml-1 text-yellow-400">★</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {pilot.status === "inactive" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleAction(pilot, "approve")}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Aktivera
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleAction(pilot, "suspend")}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Inaktivera
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPilot(pilot.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Redigera
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
            <DialogTitle>Aktivera Pilot</DialogTitle>
            <DialogDescription>
              Du håller på att aktivera piloten {selectedPilot?.name}. Piloten
              kommer att kunna ta emot fraktuppdrag.
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
              <UserCheck className="h-4 w-4 mr-2" />
              Bekräfta Aktivering
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inaktivera Pilot</DialogTitle>
            <DialogDescription>
              Du håller på att inaktivera piloten {selectedPilot?.name}. Piloten
              kommer inte att kunna ta emot nya fraktuppdrag.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSuspendDialog(false)}
            >
              Avbryt
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmAction("suspend")}
            >
              <UserX className="h-4 w-4 mr-2" />
              Bekräfta Inaktivering
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PilotsManagement;
