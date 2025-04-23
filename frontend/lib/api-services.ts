export interface Shipment {
  id: string;
  from: string;
  to: string;
  date: string;
  status: string;
  progress: number;
  pilot: string;
  ship: string;
}

export const fetchShipments = async (): Promise<Shipment[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shipments`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}; 