"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { api } from "@/services/api";

const EngineStatusCard: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [interval, setInterval] = useState<number>(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ Enabled: boolean; IntervalSeconds: number }>("/chaos-events/status");
        setEnabled(res.data.Enabled);
        setInterval(res.data.IntervalSeconds);
        setError(null);
      } catch {
        setError("Kunde inte hämta status.");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const endpoint = enabled ? "/chaos-events/disable" : "/chaos-events/enable";
      await api.post(endpoint, {});
      setEnabled(!enabled);
      setError(null);
    } catch {
      setError("Kunde inte ändra status.");
    } finally {
      setLoading(false);
    }
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterval(Number(e.target.value));
  };

  const handleUpdateInterval = async () => {
    setLoading(true);
    try {
      await api.post("/chaos-events/interval", { intervalSeconds: interval });
      setError(null);
    } catch {
      setError("Kunde inte uppdatera intervallet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chaos Engine Status</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex items-center gap-4 mb-4">
          <Label htmlFor="engine-status-toggle">Status:</Label>
          <Button
            id="engine-status-toggle"
            onClick={handleToggle}
            disabled={loading || enabled === null}
            aria-pressed={!!enabled}
          >
            {enabled ? "Stoppa" : "Starta"}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="interval">Interval (sekunder):</Label>
          <Input
            id="interval"
            type="number"
            value={interval}
            onChange={handleIntervalChange}
            min={10}
            disabled={loading}
          />
          <Button onClick={handleUpdateInterval} disabled={loading}>
            Uppdatera
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngineStatusCard; 