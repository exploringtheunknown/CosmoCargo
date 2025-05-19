import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { api } from "@/services/api";

const ChaosLogRetentionCard: React.FC = () => {
  const [days, setDays] = useState<number>(30);
  const [editValue, setEditValue] = useState<string>("30");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cleanupMsg, setCleanupMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getChaosLogRetention()
      .then(res => {
        setDays(res.data.days);
        setEditValue(res.data.days.toString());
        setError(null);
      })
      .catch(() => setError("Kunde inte hämta loggretenstion."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);
    const val = parseInt(editValue, 10);
    if (isNaN(val) || val < 1 || val > 365) {
      setError("Värdet måste vara mellan 1 och 365.");
      setSaving(false);
      return;
    }
    try {
      await api.setChaosLogRetention(val);
      setDays(val);
      setSuccess("Sparat!");
    } catch {
      setError("Kunde inte spara loggretenstion.");
    } finally {
      setSaving(false);
    }
  };

  const handleCleanup = async () => {
    setCleanupLoading(true);
    setCleanupMsg(null);
    setError(null);
    try {
      const res = await api.manualChaosLogCleanup();
      setCleanupMsg(res.data.message);
    } catch {
      setError("Kunde inte rensa gamla loggar.");
    } finally {
      setCleanupLoading(false);
    }
  };

  return (
    <Card className="mb-6" aria-label="Chaos Log Retention Config" role="region" tabIndex={0}>
      <CardHeader>
        <CardTitle>Loggretenstion & Rensning</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSave} className="flex flex-col gap-4 mb-4" aria-label="Retention form">
          <Label htmlFor="retention-days">Behåll loggar (dagar):</Label>
          <Input
            id="retention-days"
            type="number"
            min={1}
            max={365}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            disabled={loading || saving}
            required
            aria-required="true"
          />
          <Button type="submit" disabled={loading || saving} aria-disabled={loading || saving}>
            Spara
          </Button>
          {success && <div className="text-green-600">{success}</div>}
        </form>
        <Button
          variant="destructive"
          onClick={handleCleanup}
          disabled={cleanupLoading}
          aria-disabled={cleanupLoading}
        >
          Rensa gamla loggar (behåll sista 10 min)
        </Button>
        {cleanupMsg && <div className="text-green-600 mt-2">{cleanupMsg}</div>}
      </CardContent>
    </Card>
  );
};

export default ChaosLogRetentionCard; 