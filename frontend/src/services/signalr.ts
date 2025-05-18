import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";

const HUB_URL = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || "/hubs/chaos-events";

export function createChaosEventsConnection(onEvent: (event: any) => void): HubConnection {
  const connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, { withCredentials: true })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.on("ChaosEventOccurred", onEvent);

  connection.start().catch(err => {
    // eslint-disable-next-line no-console
    console.error("SignalR connection error:", err);
  });

  return connection;
} 