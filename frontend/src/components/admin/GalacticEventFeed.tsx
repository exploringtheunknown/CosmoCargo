"use client";
import React, { useEffect, useRef, useState } from "react";
import { createChaosEventsConnection } from "@/services/signalr";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface ChaosEvent {
  id: number;
  timestamp: string;
  shipmentId: string;
  eventType: string;
  eventDescription: string;
  impactDetails: string;
}

const GalacticEventFeed: React.FC = () => {
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
    <Card
      className="bg-space-primary border-space-secondary shadow-lg galactic-glow text-space-text-primary min-w-[400px] w-full max-w-xl mx-auto mb-8"
      aria-label="Galactic Event Feed"
      role="region"
      tabIndex={0}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span role="img" aria-label="galaxy" className="animate-spin-slow">🪐</span>
          Galactic Event Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-space-text-secondary">No chaos events received yet.</div>
        ) : (
          <ul className="space-y-2" aria-live="polite">
            {events.map(ev => (
              <li
                key={ev.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-space-secondary/80 rounded galactic-row-glow focus-within:ring-2 focus-within:ring-space-accent"
                tabIndex={0}
                aria-label={`Chaos event: ${ev.eventType}, ${ev.eventDescription}`}
              >
                <Badge variant="info" className="galactic-badge-glow" aria-label={ev.eventType}>
                  {ev.eventType}
                </Badge>
                <span className="text-xs text-space-text-secondary" aria-label="Event time">
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-medium" aria-label="Description">{ev.eventDescription}</span>
                <span className="text-xs text-space-text-secondary" aria-label="Impact details">{ev.impactDetails}</span>
                <span className="text-xs text-space-text-secondary" aria-label="Shipment ID">🚀 {ev.shipmentId}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default GalacticEventFeed;

// Add galactic-glow and galactic-badge-glow classes in your global CSS for cosmic effects. 