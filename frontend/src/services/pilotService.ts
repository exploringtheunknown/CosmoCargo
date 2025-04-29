import { api } from "./api";
import { PaginatedResult } from "@/model/paginated-result";

export interface Pilot {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  experience: string;
  assignedShipments: number;
  rating: number;
  available?: boolean;
}

export interface PilotsFilter {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: string;
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

export const pilotService = {
  async getPilots(filter: PilotsFilter = {}): Promise<PaginatedResult<Pilot>> {
    const queryParams = new URLSearchParams();
    
    if (filter.pageNumber) queryParams.append('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) queryParams.append('pageSize', filter.pageSize.toString());
    if (filter.search) queryParams.append('search', filter.search);
    if (filter.status && filter.status !== 'all') queryParams.append('status', filter.status);
    
    const url = `/pilots${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<PaginatedResult<Pilot>>(url);
    
    if (!response.ok) {
      console.error('Fel vid hämtning av piloter:', response.status);
      throw new Error('Kunde inte hämta piloter');
    }
    
    return response.data;
  },

  async getPilotById(id: string): Promise<Pilot> {
    const response = await api.get<Pilot>(`/pilots/${id}`);
    
    if (!response.ok) {
      throw new Error('Kunde inte hämta pilot');
    }
    
    return response.data;
  },

  async getPilotAvailability(id: string): Promise<{isAvailable: boolean, activeShipments: number, maxShipments: number}> {
    const response = await api.get<{isAvailable: boolean, activeShipments: number, maxShipments: number}>(`/pilots/${id}/availability`);
    
    if (!response.ok) {
      throw new Error('Kunde inte hämta pilottillgänglighet');
    }
    
    return response.data;
  },

  async updatePilotStatus(id: string, status: 'Active' | 'Inactive'): Promise<void> {
    const response = await api.put(`/pilots/${id}/status`, { status });
    
    if (!response.ok) {
      throw new Error('Kunde inte uppdatera pilotstatus');
    }
  },

  async createPilot(pilotData: CreatePilotDto) {
    try {
      const response = await api.post('/pilots', pilotData);
      if (!response.ok) {
        throw new Error('Kunde inte skapa pilot');
      }
      return response.data;
    } catch (error) {
      throw new Error(`Fel vid skapande av pilot: ${error instanceof Error ? error.message : 'Okänt fel'}`);
    }
  },

  async updatePilot(id: string, pilotData: UpdatePilotDto): Promise<void> {
    const response = await api.put(`/pilots/${id}`, pilotData);
    
    if (!response.ok) {
      throw new Error('Kunde inte uppdatera pilot');
    }
  }
}; 