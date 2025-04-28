export interface Pilot {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  experience: string;
  assignedShipments: number;
  rating: number;
  available?: boolean;
}

interface CreatePilotDto {
  name: string;
  email: string;
  experience: string;
}

// Importera api-hjälparen för att använda samma basURL och felhantering
import { api } from "./api";

export const pilotService = {
  async getAllPilots(): Promise<Pilot[]> {
    // Använd api-hjälparen istället för fetch direkt
    const response = await api.get<Pilot[]>('/pilots');
    
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

  async createPilot(pilotData: CreatePilotDto) {
    const response = await api.post('/pilots', pilotData);

    if (!response.ok) {
      throw new Error('Kunde inte skapa pilot');
    }

    return response.data;
  }
}; 