"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table } from "../ui/table";
import Pagination from "../ui/pagination";
import { api } from "@/services/api";

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
        <Table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>ShipmentId</th>
              <th>EventType</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{log.timestamp}</td>
                <td>{log.shipmentId}</td>
                <td>{log.eventType}</td>
                <td>{log.eventDescription}</td>
              </tr>
            ))}
          </tbody>
        </Table>
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