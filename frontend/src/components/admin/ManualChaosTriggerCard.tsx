"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { api } from "@/services/api";

const ManualChaosTriggerCard: React.FC = () => {
  const [shipmentId, setShipmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await api.post("/chaos-events/trigger", { shipmentId });
      setSuccess("Chaos event triggered!");
    } catch {
      setError("Kunde inte trigga chaos event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manuell Chaos Event Trigger</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrigger} className="flex flex-col gap-4">
          <Label htmlFor="shipment-id">ShipmentId</Label>
          <Input
            id="shipment-id"
            value={shipmentId}
            onChange={e => setShipmentId(e.target.value)}
            placeholder="Ange ShipmentId"
            required
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !shipmentId}>
            Trigger Chaos Event
          </Button>
        </form>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
};

export default ManualChaosTriggerCard; 