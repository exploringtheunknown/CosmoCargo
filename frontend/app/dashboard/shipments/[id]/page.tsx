"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getShipmentById } from "@/services/shipment-service";
import RiskLevelBadge from "@/components/RiskLevelBadge";
import { useAuth } from "@/contexts/AuthContext";
import { Shipment } from "@/types/Shipment";
import { mapRiskLevelToString } from "@/types/CustomsDeclaration";
import CustomsDeclarationDetails from "@/components/CustomsDeclarationDetails";

export default function ShipmentDetailsPage() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchShipment = async () => {
      if (!id) return;
      
      try {
        console.log('fetching shipment', id);
        const data = await getShipmentById(id as string);
        console.log('shipment', data);
        setShipment(data as unknown as Shipment);
      } catch (error) {
        console.error("Kunde inte hämta fraktinformation", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShipment();
  }, [id]);
  
  if (loading) return <div>Laddar fraktinformation...</div>;
  if (!shipment) return <div>Kunde inte hitta frakten</div>;
  
  const isPilot = user?.role?.toLowerCase() === "pilot";
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Fraktdetaljer</h1>
      
      {isPilot && shipment.customsDeclaration && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h2 className="text-lg font-medium mb-2">Säkerhetsinformation för pilot</h2>
          <RiskLevelBadge 
            riskLevel={mapRiskLevelToString(shipment.customsDeclaration.riskLevel)}
            showQuarantine={true}
            quarantineRequired={shipment.customsDeclaration.quarantineRequired}
          />
        </div>
      )}
      
      {shipment.customsDeclaration && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <CustomsDeclarationDetails 
            declaration={shipment.customsDeclaration} 
            showRiskLevel={!isPilot}
          />
        </div>
      )}
      
      
    </div>
  );
} 