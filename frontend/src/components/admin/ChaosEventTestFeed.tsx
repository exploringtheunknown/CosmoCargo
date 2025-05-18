"use client";
import React, { useEffect, useRef, useState } from "react";
import { createChaosEventsConnection } from "@/services/signalr";
import { Badge } from "../ui/badge";

interface ChaosEvent {
  id: number;
  timestamp: string;
  shipmentId: string;
  eventType: string;
  eventDescription: string;
  impactDetails: string;
}

const ChaosEventTestFeed: React.FC = () => {
  const [events, setEvents] = useState<ChaosEvent[]>([]);
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    connectionRef.current = createChaosEventsConnection((event: ChaosEvent) => {
      setEvents(prev => [event, ...prev].slice(0, 10));
    });
    return () => {
      connectionRef.current?.stop();
    };
  }, []);

  return (
    <div className="rounded-md border border-space-secondary bg-space-primary min-w-[400px] w-full max-w-xl mx-auto p-4 mb-8">
      <h3 className="text-lg font-semibold mb-2">Test: Real-Time Chaos Event Feed</h3>
      {events.length === 0 ? (
        <div className="text-space-text-secondary">Inga händelser mottagna än.</div>
      ) : (
        <ul className="space-y-2">
          {events.map(ev => (
            <li key={ev.id} className="flex items-center gap-3 p-2 bg-space-secondary rounded">
              <Badge>{ev.eventType}</Badge>
              <span className="text-xs text-space-text-secondary">{new Date(ev.timestamp).toLocaleTimeString()}</span>
              <span className="font-medium">{ev.eventDescription}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChaosEventTestFeed; 