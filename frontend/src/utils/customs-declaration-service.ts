import { api } from "../services/api";
import { CustomsDeclaration, mapRiskLevelToString, mapStringToRiskLevel } from "../types/CustomsDeclaration";

export interface CreateCustomsDeclarationRequest {
  containsLifeforms: boolean;
  lifeformType?: string;
  isPlasmaActive: boolean;
  plasmaStabilityLevel?: number;
  quarantineRequired: boolean;
  originPlanetLawsConfirmed: boolean;
  customsNotes?: string;
}

export const getCustomsDeclaration = async (shipmentId: string): Promise<CustomsDeclaration | null> => {
  try {
    const response = await api.get<CustomsDeclaration>(`/shipments/${shipmentId}/customs-declaration`);
    return response.data;
  } catch (error) {
    console.log("Ingen tulldeklaration hittades", error);
    return null;
  }
};

export const createCustomsDeclaration = async (
  shipmentId: string, 
  request: CreateCustomsDeclarationRequest
): Promise<CustomsDeclaration> => {
  const response = await api.post<CustomsDeclaration>(
    `/shipments/${shipmentId}/customs-declaration`, 
    request
  );
  return response.data;
};

export { mapRiskLevelToString, mapStringToRiskLevel };