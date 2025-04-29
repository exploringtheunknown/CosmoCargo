import { ShipmentStatus } from './types';

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
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
