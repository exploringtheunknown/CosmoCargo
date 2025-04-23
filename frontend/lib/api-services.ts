export interface Shipment {
  id: string;
  from: string;
  to: string;
  date: string;
  status: string;
  progress: number;
  pilot: string;
  ship: string;
  customer: string;
  origin: string;
  destination: string;
  scheduledDate: string;
  cargo: string;
  weight: string;
}

export const fetchShipments = async (): Promise<Shipment[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shipments`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const approveShipment = async (shipmentId: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shipments/${shipmentId}/approve`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to approve shipment');
  }
};

export const rejectShipment = async (shipmentId: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shipments/${shipmentId}/reject`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to reject shipment');
  }
};

export const assignPilotToShipment = async (shipmentId: string, pilotId: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shipments/${shipmentId}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pilotId }),
  });
  if (!response.ok) {
    throw new Error('Failed to assign pilot to shipment');
  }
}; 