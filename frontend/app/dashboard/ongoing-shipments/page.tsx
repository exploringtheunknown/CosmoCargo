"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getShipments, ShipmentsFilter } from "@/services/shipment-service";
import { ShipmentStatus } from "@/model/types";
import { getStatusDisplayText, getStatusColorClass } from "@/utils/shipment-status";

const OngoingShipments = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShipmentStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: shipments, refetch } = useQuery({
    queryKey: ["shipments", search, status, page, pageSize],
    queryFn: () => {
      const filter: ShipmentsFilter = {
        page,
        pageSize
      };
      if (search) filter.search = search;
      if (status) filter.status = status as ShipmentStatus;
      return getShipments(filter);
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as ShipmentStatus | "");
    setPage(1); // Reset to first page when changing status
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reset to first page when changing page size
  };

  const getProgressPercentage = (status: ShipmentStatus): number => {
    switch (status) {
      case ShipmentStatus.InTransit:
        return 60;
      case ShipmentStatus.Delivered:
        return 100;
      case ShipmentStatus.Assigned:
        return 20;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2">Leveranser</h1>
        <p className="text-space-text-secondary">
          Följ dina leveranser i realtid
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-space-text-secondary" />
          <Input
            placeholder="Sök fraktID eller destination..."
            className="pl-10 space-input w-full"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <select 
            className="space-input"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">Alla statusar</option>
            <option value={ShipmentStatus.WaitingForApproval}>Väntar på godkännande</option>
            <option value={ShipmentStatus.Approved}>Godkänd</option>
            <option value={ShipmentStatus.Denied}>Nekad</option>
            <option value={ShipmentStatus.Assigned}>Tilldelad</option>
            <option value={ShipmentStatus.InTransit}>Under transport</option>
            <option value={ShipmentStatus.Delivered}>Levererad</option>
            <option value={ShipmentStatus.Cancelled}>Avbruten</option>
          </select>

          <select
            className="space-input"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5 per sida</option>
            <option value={10}>10 per sida</option>
            <option value={20}>20 per sida</option>
            <option value={50}>50 per sida</option>
          </select>

          <Button className="space-button" onClick={() => refetch()}>
            Uppdatera
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {shipments?.items.map((shipment) => (
          <Card key={shipment.id} className="space-card overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-medium">
                    Frakt #{shipment.id}
                  </CardTitle>
                  <CardDescription>
                    {shipment.sender.station + ' @ ' + shipment.sender.planet} → {shipment.receiver.station + ' @ ' + shipment.receiver.planet}
                  </CardDescription>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(shipment.status)}`}>
                  {getStatusDisplayText(shipment.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <div>{shipment.sender.planet}</div>
                  <div>{shipment.receiver.planet}</div>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-space-secondary/50">
                    <div
                      style={{ width: `${getProgressPercentage(shipment.status)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-space-accent-blue to-space-accent-purple"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-space-text-secondary text-sm">
                  Last: {shipment.category}
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Visa detaljer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

export default OngoingShipments;
