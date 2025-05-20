"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import Pagination from "../ui/pagination";
import { api } from "@/services/api";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

const PAGE_SIZE = 10;

const ChaosEventLogsCard: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [shipmentId, setShipmentId] = useState("");
  const [eventType, setEventType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (shipmentId) params.shipmentId = shipmentId;
      if (eventType) params.eventType = eventType;
      if (from) params.from = from;
      if (to) params.to = to;
      params.page = page.toString();
      params.pageSize = PAGE_SIZE.toString();

      const res = await api.get<{ items: any[]; total: number }>(
        "/chaos-events/logs?" + new URLSearchParams(params).toString()
      );
      setLogs(res.data.items ?? []);
      setTotal(res.data.total);
      setError(null);
    } catch {
      setError("Kunde inte hämta loggar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chaos Event Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form
          className="flex flex-wrap gap-2 mb-4"
          onSubmit={e => {
            e.preventDefault();
            setPage(1);
            fetchLogs();
          }}
        >
          <Input
            placeholder="ShipmentId"
            value={shipmentId}
            onChange={e => setShipmentId(e.target.value)}
          />
          <Input
            placeholder="EventType"
            value={eventType}
            onChange={e => setEventType(e.target.value)}
          />
          <Input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
          <Input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
          <Button type="submit">Sök</Button>
        </form>
        <div className="rounded-md border border-space-secondary bg-space-primary min-w-[700px] md:min-w-[900px] w-full max-w-5xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tidpunkt</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Beskrivning</TableHead>
                <TableHead>Effekt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, i) => (
                <TableRow key={i}>
                  <TableCell>{format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                  <TableCell><Badge>{log.eventType}</Badge></TableCell>
                  <TableCell>{log.eventDescription}</TableCell>
                  <TableCell>{log.impactDetails}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          page={page}
          totalCount={total}
          pageSize={PAGE_SIZE}
          totalPages={Math.ceil(total / PAGE_SIZE)}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
};

export default ChaosEventLogsCard; 