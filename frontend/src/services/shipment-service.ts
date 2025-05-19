import { api } from "./api";
import { Shipment, ShipmentContact } from "../types/Shipment";
import { ShipmentStatus } from "../model/types";
import { mapBackendStatusToFrontend, mapFrontendStatusToBackend } from "../utils/shipment-status";
import { PaginatedResult } from "@/model/paginated-result";

export interface CreateShipmentRequest {
    origin: ShipmentContact;
    destination: ShipmentContact;
    weight: number;
    category: string;
    priority: string;
    description?: string | null;
    hasInsurance: boolean;
}

export interface UpdateShipmentStatusRequest {
    status: ShipmentStatus;
}

export interface AssignPilotRequest {
    pilotId: string;
}

export interface ShipmentsFilter {
    search?: string;
    status?: ShipmentStatus;
    page?: number;
    pageSize?: number;
}

export const getShipments = async (filter?: ShipmentsFilter): Promise<PaginatedResult<Shipment>> => {
    const queryParams = new URLSearchParams();
    if (filter?.search) queryParams.append('search', filter.search);
    if (filter?.status) queryParams.append('status', mapFrontendStatusToBackend(filter.status).toString());
    queryParams.append('page', (filter?.page || 1).toString());
    queryParams.append('pageSize', (filter?.pageSize || 10).toString());
    
    const response = await api.get<PaginatedResult<Shipment>>(`/shipments?${queryParams.toString()}`);
    
    const convertedItems = response.data.items.map(shipment => ({
        ...shipment,
        status: mapBackendStatusToFrontend(shipment.status as unknown as number)
    }));

    return {
        ...response.data,
        items: convertedItems
    };
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
    try {
        // Hämta endast fraktinformation utan tulldeklaration
        const response = await api.get<Shipment>(`/shipments/${id}`);
        
        return {
            ...response.data,
            status: mapBackendStatusToFrontend(response.data.status as unknown as number)
        };
    } catch (error) {
        console.error("Kunde inte hämta fraktinformation", error);
        throw error;
    }
};

export const createShipment = async (request: CreateShipmentRequest): Promise<Shipment> => {
    const response = await api.post<Shipment>('/shipments', request);
    
    return {
        ...response.data,
        status: mapBackendStatusToFrontend(response.data.status as unknown as number)
    };
};

export const updateShipmentStatus = async (id: string, request: UpdateShipmentStatusRequest): Promise<Shipment> => {
    const backendStatus = mapFrontendStatusToBackend(request.status);
    const response = await api.put<Shipment>(`/shipments/${id}/status`, { status: backendStatus });
    
    return {
        ...response.data,
        status: mapBackendStatusToFrontend(response.data.status as unknown as number)
    };
};

export const assignPilot = async (id: string, request: AssignPilotRequest): Promise<Shipment> => {
    const response = await api.put<Shipment>(`/shipments/${id}/assign-pilot`, request);
    
    return {
        ...response.data,
        status: mapBackendStatusToFrontend(response.data.status as unknown as number)
    };
};

