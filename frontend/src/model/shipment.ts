import { ShipmentStatus } from './types';
import User from './user';

export interface ShipmentContact {
    name: string;
    email: string;
    planet: string;
    station: string;
}

export default interface Shipment {
    id: string;
    customerId: string;
    pilotId?: string | null;
    sender: ShipmentContact;
    receiver: ShipmentContact;
    weight: number;
    category: string;
    priority: string;
    description?: string | null;
    hasInsurance: boolean;
    status: ShipmentStatus;
    createdAt: string;
    updatedAt: string;
    pilot?: User | null;
}
