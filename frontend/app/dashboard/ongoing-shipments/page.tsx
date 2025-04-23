"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Package, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { fetchShipments } from '../../../lib/api-services';

interface Shipment {
  id: string;
  from: string;
  to: string;
  date: string;
  status: string;
  progress: number;
  pilot: string;
  ship: string;
}

const OngoingShipments = () => {
  const { data: shipments = [], error, isLoading } = useQuery<Shipment[], Error>({
    queryKey: ['shipments'],
    queryFn: fetchShipments
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading shipments</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2">Pågående Leveranser</h1>
        <p className="text-space-text-secondary">
          Följ dina pågående leveranser i realtid
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-space-text-secondary" />
          <Input
            placeholder="Sök fraktID eller destination..."
            className="pl-10 space-input w-full"
          />
        </div>

        <div className="flex gap-2">
          <select className="space-input">
            <option value="">Alla statusar</option>
            <option value="preparing">Förbereder</option>
            <option value="in-transit">I transit</option>
            <option value="approaching">Närmar sig destination</option>
          </select>

          <Button className="space-button">Uppdatera</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="space-card overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <Package className="h-5 w-5 mr-2" />
                    {shipment.id}
                  </CardTitle>
                  <CardDescription>Skickad: {shipment.date}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="font-medium">{shipment.status}</div>
                  <div className="text-sm text-space-text-secondary">
                    Pilot: {shipment.pilot}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <div>{shipment.from}</div>
                  <div>{shipment.to}</div>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-space-secondary/50">
                    <div
                      style={{ width: `${shipment.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-space-accent-blue to-space-accent-purple"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-space-text-secondary text-sm">
                  Skepp: {shipment.ship}
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
    </div>
  );
};

export default OngoingShipments;
