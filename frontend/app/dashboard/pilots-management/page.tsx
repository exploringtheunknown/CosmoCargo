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
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { pilotService, Pilot, PilotsFilter } from '@/services/pilotService';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PilotsManagement = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  
  const [filter, setFilter] = useState<PilotsFilter>({
    pageNumber: 1,
    pageSize: 10,
    search: '',
    status: 'all'
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pilots', filter],
    queryFn: () => pilotService.getAllPilots(filter),
    enabled: user?.role === 'admin'
  });

  const handleAction = async (
    pilot: Pilot,
    action: "approve" | "suspend"
  ) => {
    setSelectedPilot(pilot);
    if (action === "approve") {
      setShowApproveDialog(true);
    } else {
      setShowSuspendDialog(true);
    }
  };

  const confirmAction = async (action: "approve" | "suspend") => {
    if (!selectedPilot) return;

    try {
      await pilotService.updatePilotStatus(
        selectedPilot.id, 
        action === "approve" ? "Active" : "Inactive"
      );
      
      toast.success(
        `Pilot ${selectedPilot.name} har ${action === "approve" ? "aktiverats" : "inaktiverats"}`
      );
      
      refetch();
      
      if (action === "approve") {
        setShowApproveDialog(false);
      } else {
        setShowSuspendDialog(false);
      }
    } catch (err) {
      console.error('Error during action:', err);
      toast.error("Ett fel uppstod vid statusuppdatering");
    }
  };

  const handleAddPilot = () => {
    router.push("/dashboard/pilots/add");
  };

  const handleEditPilot = (id: string) => {
    router.push(`/dashboard/pilots/edit/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setFilter(prev => ({ ...prev, pageNumber: newPage }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: e.target.value, pageNumber: 1 }));
  };

  const handleStatusFilterChange = (value: string) => {
    setFilter(prev => ({ ...prev, status: value, pageNumber: 1 }));
  };

  const handlePageSizeChange = (value: string) => {
    setFilter(prev => ({ ...prev, pageSize: parseInt(value), pageNumber: 1 }));
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-space-accent-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Ett fel uppstod</h2>
        <p className="text-space-text-secondary text-center">
          Kunde inte hämta pilotdata. Försök igen senare.
        </p>
        <Button 
          onClick={() => refetch()} 
          className="mt-4 space-button"
        >
          Försök igen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-space-text-primary">
          Pilothantering
        </h1>
        <Button className="space-button" onClick={handleAddPilot}>
          <UserPlus className="h-4 w-4 mr-2" />
          Lägg till pilot
        </Button>
      </div>

      <Card className="bg-space-primary border-space-secondary">
        <CardHeader>
          <CardTitle className="text-space-text-primary">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Status
              </label>
              <Select value={filter.status} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla statusar</SelectItem>
                  <SelectItem value="Active">Aktiv</SelectItem>
                  <SelectItem value="Inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Antal per sida
              </label>
              <Select value={filter.pageSize?.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj antal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Sök
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-space-text-secondary" />
                <Input
                  placeholder="Sök på namn eller email..."
                  className="pl-8"
                  value={filter.search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            {data?.items.map((pilot) => (
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
                      pilot.status === "Active" ? "bg-green-500" : "bg-gray-500"
                    }
                  >
                    {pilot.status === "Active" ? "Aktiv" : "Inaktiv"}
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
                    {pilot.status === "Inactive" ? (
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

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-space-text-secondary">
            Visar {(data.pageNumber - 1) * data.pageSize + 1} till {Math.min(data.pageNumber * data.pageSize, data.totalCount)} av {data.totalCount} piloter
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.pageNumber - 1)}
              disabled={!data.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Föregående
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === data.pageNumber ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.pageNumber + 1)}
              disabled={!data.hasNextPage}
            >
              Nästa
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aktivera Pilot</DialogTitle>
            <DialogDescription>
              Du håller på att aktivera pilot {selectedPilot?.name}. Detta kommer att göra piloten tillgänglig för nya uppdrag.
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

      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inaktivera Pilot</DialogTitle>
            <DialogDescription>
              Du håller på att inaktivera pilot {selectedPilot?.name}. Detta kommer att förhindra piloten från att ta nya uppdrag.
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
