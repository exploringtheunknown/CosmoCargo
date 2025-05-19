import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const DEFAULT_HUB_URL = API_BASE_URL.replace(/\/api$/, "") + "/hubs/chaos-events";
const HUB_URL = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || DEFAULT_HUB_URL;

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