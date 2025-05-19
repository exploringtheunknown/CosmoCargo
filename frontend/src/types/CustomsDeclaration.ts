export interface CustomsDeclaration {
  id?: number;
  shipmentId: string;
  containsLifeforms: boolean;
  lifeformType?: string;
  isPlasmaActive: boolean;
  plasmaStabilityLevel?: number;
  quarantineRequired: boolean;
  originPlanetLawsConfirmed: boolean;
  customsNotes?: string;
  riskLevel: number;
}

export type RiskLevelString = 'Low' | 'Medium' | 'High' | 'Critical';

export const mapRiskLevelToString = (level: number): RiskLevelString => {
  switch(level) {
    case 0: return 'Low';
    case 1: return 'Medium';
    case 2: return 'High';
    case 3: return 'Critical';
    default: return 'Low';
  }
};

export const mapStringToRiskLevel = (level: RiskLevelString): number => {
  switch(level) {
    case 'Low': return 0;
    case 'Medium': return 1;
    case 'High': return 2;
    case 'Critical': return 3;
    default: return 0;
  }
}; 