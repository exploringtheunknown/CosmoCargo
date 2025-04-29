import { api } from "./api";
import { PaginatedResult } from "@/model/paginated-result";

export interface Pilot {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  experience: string;
  assignedShipments: number;
  rating: number;
  available?: boolean;
}

export interface PilotsFilter {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

interface CreatePilotDto {
  name: string;
  email: string;
  experience: string;
}

interface UpdatePilotDto {
  name: string;
  email: string;
  experience: string;
}

export const getPilots = async(filter: PilotsFilter = {}): Promise<PaginatedResult<Pilot>> => {
  const queryParams = new URLSearchParams();
  
  if (filter.page) queryParams.append('page', filter.page.toString());
  if (filter.pageSize) queryParams.append('pageSize', filter.pageSize.toString());
  if (filter.search) queryParams.append('search', filter.search);
  if (filter.isActive !== undefined) queryParams.append('isActive', filter.isActive.toString());
  
  const url = `/pilots${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResult<Pilot>>(url);
  
  if (!response.ok) {
    console.error('Fel vid hämtning av piloter:', response.status);
    throw new Error('Kunde inte hämta piloter');
  }
  
  return response.data;
}

export const getPilotById = async(id: string): Promise<Pilot> => {
  const response = await api.get<Pilot>(`/pilots/${id}`);
  
  if (!response.ok) {
    throw new Error('Kunde inte hämta pilot');
  }
  
  return response.data;
}

export const getPilotAvailability = async(id: string): Promise<{isAvailable: boolean, activeShipments: number, maxShipments: number}> => {
  const response = await api.get<{isAvailable: boolean, activeShipments: number, maxShipments: number}>(`/pilots/${id}/availability`);
  
  if (!response.ok) {
    throw new Error('Kunde inte hämta pilottillgänglighet');
  }
  
  return response.data;
}

export const updatePilotStatus = async(id: string, isActive: boolean): Promise<void> => {
  const response = await api.put(`/pilots/${id}/status`, { isActive });
  if (!response.ok) {
    throw new Error('Kunde inte uppdatera pilotstatus');
  }
}

export const createPilot = async(pilotData: CreatePilotDto): Promise<string> => {
  try {
    const response = await api.post<string>('/pilots', pilotData);
    if (!response.ok) {
      throw new Error('Kunde inte skapa pilot');
    }
    return response.data;
  } catch (error) {
    throw new Error(`Fel vid skapande av pilot: ${error instanceof Error ? error.message : 'Okänt fel'}`);
  }
}

export const updatePilot = async(id: string, pilotData: UpdatePilotDto): Promise<void> => {
  const response = await api.put(`/pilots/${id}`, pilotData);
  
  if (!response.ok) {
    throw new Error('Kunde inte uppdatera pilot');
  }
}
