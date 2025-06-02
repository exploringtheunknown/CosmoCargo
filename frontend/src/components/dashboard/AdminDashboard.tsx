import React, { useState } from "react";
import { 
  Shield, 
  Users, 
  Package, 
  CheckCircle, 
  X, 
  ArrowRight,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import KPIDashboard from "@/components/shared/KPIDashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShipments, updateShipmentStatus } from "@/services/shipment-service";
import { ShipmentStatus } from "@/model/types";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100/10 text-red-500";
    case "Express":
      return "bg-orange-100/10 text-orange-500";
    case "Standard":
      return "bg-blue-100/10 text-blue-500";
    default:
      return "bg-gray-100/10 text-gray-500";
  }
};

const AdminDashboard: React.FC = () => {
  const [pendingApprovalsPage, setPendingApprovalsPage] = useState(1);
  const itemsPerPage = 5;
  const queryClient = useQueryClient();

  const { data: shipmentsData, isLoading: shipmentsLoading, error: shipmentsError } = useQuery({
    queryKey: ['admin-shipments'],
    queryFn: () => getShipments({ page: 1, pageSize: 100 }),
  });

  const approvalMutation = useMutation({
    mutationFn: (params: { freightId: string; approved: boolean }) => {
      const newStatus = params.approved ? ShipmentStatus.Approved : ShipmentStatus.Cancelled;
      return updateShipmentStatus(params.freightId, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipments'] });
    },
  });


  const handleApproval = (freightId: string, approved: boolean) => {
    approvalMutation.mutate({ freightId, approved });
  };

  const isLoading = shipmentsLoading;
  const error = shipmentsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-space-accent-purple" />
          <p className="text-space-text-secondary">Laddar adminpanel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Ett fel uppstod vid laddning av data</p>
      </div>
    );
  }

  const shipments = shipmentsData?.items || [];

  const pendingApprovals = shipments.filter(s => s.status === ShipmentStatus.WaitingForApproval);

  const pendingApprovalsTotal = pendingApprovals.length;
  const pendingApprovalsTotalPages = Math.ceil(pendingApprovalsTotal / itemsPerPage);
  const pendingApprovalsStartIndex = (pendingApprovalsPage - 1) * itemsPerPage;
  const pendingApprovalsEndIndex = pendingApprovalsStartIndex + itemsPerPage;
  const paginatedPendingApprovals = pendingApprovals.slice(pendingApprovalsStartIndex, pendingApprovalsEndIndex);

  const PaginationControls = ({ 
    currentPage, 
    totalPages, 
    totalItems, 
    onPageChange,
    label 
  }: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    label: string;
  }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-space-secondary">
        <div className="text-sm text-space-text-secondary">
          Visar {((currentPage - 1) * itemsPerPage) + 1} till {Math.min(currentPage * itemsPerPage, totalItems)} av {totalItems} {label}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-space-secondary hover:bg-space-secondary/30"
          >
            <ChevronLeft className="h-4 w-4" />
            Föregående
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              const isCurrentPage = pageNumber === currentPage;
              
              return (
                <Button
                  key={pageNumber}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className={isCurrentPage ? 
                    "bg-space-accent-purple hover:bg-space-accent-purple/80" : 
                    "border-space-secondary hover:bg-space-secondary/30"
                  }
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-space-secondary hover:bg-space-secondary/30"
          >
            Nästa
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-orbitron text-space-text-primary">
            Administratörspanel
          </h1>
          <p className="text-space-text-secondary">
            Systemöversikt och frakthantering
          </p>
        </div>
      </div>

      <KPIDashboard userRole="admin" />

      {/* Väntande godkännanden */}
      <Card className="space-card">
        <CardHeader>
          <CardTitle className="font-orbitron flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-space-accent-purple" />
              <span>Väntande godkännanden</span>
            </div>
            <div className="text-sm font-normal text-space-text-secondary">
              Sida {pendingApprovalsPage} av {pendingApprovalsTotalPages} • {pendingApprovalsTotal} totalt
            </div>
          </CardTitle>
          <CardDescription>
            Frakter som behöver godkännas eller nekas (visar {itemsPerPage} åt gången)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedPendingApprovals.length === 0 ? (
            <p className="text-space-text-secondary text-center py-8">
              Inga väntande godkännanden
            </p>
          ) : (
            <div className="space-y-4">
              {paginatedPendingApprovals.map((freight) => (
                <div
                  key={freight.id}
                  className="border border-space-secondary rounded-lg p-4 hover:bg-space-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-space-text-primary text-lg">
                          {freight.id}
                        </span>
                        <Badge className={getPriorityColor(freight.priority)}>
                          {freight.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-space-text-secondary text-sm">Origin</p>
                          <p className="text-space-text-primary font-medium">{freight.sender.planet}</p>
                        </div>
                        <div>
                          <p className="text-space-text-secondary text-sm">Destination</p>
                          <p className="text-space-text-primary font-medium">{freight.receiver.planet}</p>
                        </div>
                        <div>
                          <p className="text-space-text-secondary text-sm">Lasttyp</p>
                          <p className="text-space-text-primary font-medium">{freight.category}</p>
                        </div>
                        <div>
                          <p className="text-space-text-secondary text-sm">Vikt</p>
                          <p className="text-space-text-primary font-medium">{freight.weight} ton</p>
                        </div>
                        <div>
                          <p className="text-space-text-secondary text-sm">Försäkrad</p>
                          <p className="text-space-text-primary font-medium">{freight.hasInsurance ? 'Ja' : 'Nej'}</p>
                        </div>
                        <div>
                          <p className="text-space-text-secondary text-sm">Skapat</p>
                          <p className="text-space-text-primary font-medium">
                            {new Date(freight.createdAt).toLocaleDateString('sv-SE')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-space-secondary">
                    <Button
                      onClick={() => handleApproval(freight.id, true)}
                      disabled={approvalMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Godkänn
                    </Button>
                    
                    <Button
                      onClick={() => handleApproval(freight.id, false)}
                      disabled={approvalMutation.isPending}
                      variant="destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Neka
                    </Button>
                    
                    <Button variant="outline" className="border-space-secondary hover:bg-space-secondary/30">
                      Visa detaljer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <PaginationControls 
            currentPage={pendingApprovalsPage}
            totalPages={pendingApprovalsTotalPages}
            totalItems={pendingApprovalsTotal}
            onPageChange={setPendingApprovalsPage}
            label="godkännanden"
          />
        </CardContent>
      </Card>

      <Card className="space-card">
        <CardHeader>
          <CardTitle className="font-orbitron">Snabbnavigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/shipments">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">Alla frakter</h3>
                    <p className="text-sm text-space-text-secondary">Komplett översikt</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-space-text-secondary ml-auto" />
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/pilots">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">Hantera piloter</h3>
                    <p className="text-sm text-space-text-secondary">Pilot administration</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-space-text-secondary ml-auto" />
                </div>
              </div>
            </Link>
            
          </div>
        </CardContent>
      </Card>

      

      
    </div>
  );
};

export default AdminDashboard;
