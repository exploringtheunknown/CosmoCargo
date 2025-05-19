// frontend/src/components/CustomsDeclarationDetails.tsx

import React from 'react';
import { CustomsDeclaration, mapRiskLevelToString } from '../types/CustomsDeclaration';
import RiskLevelBadge from './RiskLevelBadge';

interface CustomsDeclarationDetailsProps {
  declaration: CustomsDeclaration;
  showRiskLevel?: boolean;
}

export default function CustomsDeclarationDetails({ 
  declaration, 
  showRiskLevel = true 
}: CustomsDeclarationDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tulldeklaration</h3>
      
      {showRiskLevel && (
        <div className="mb-4">
          <RiskLevelBadge 
            riskLevel={mapRiskLevelToString(declaration.riskLevel)}
            showQuarantine={true}
            quarantineRequired={declaration.quarantineRequired}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Innehåller levande varelser</p>
          <p>{declaration.containsLifeforms ? 'Ja' : 'Nej'}</p>
        </div>
        
        {declaration.containsLifeforms && declaration.lifeformType && (
          <div>
            <p className="text-sm text-gray-500">Beskrivning av livsform</p>
            <p>{declaration.lifeformType}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-500">Innehåller plasma-aktiva material</p>
          <p>{declaration.isPlasmaActive ? 'Ja' : 'Nej'}</p>
        </div>
        
        {declaration.isPlasmaActive && declaration.plasmaStabilityLevel !== undefined && (
          <div>
            <p className="text-sm text-gray-500">Stabilitetsnivå</p>
            <p>{declaration.plasmaStabilityLevel}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-500">Karantän krävs</p>
          <p>{declaration.quarantineRequired ? 'Ja' : 'Nej'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Laglig export bekräftad</p>
          <p>{declaration.originPlanetLawsConfirmed ? 'Ja' : 'Nej'}</p>
        </div>
        
        {declaration.customsNotes && (
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Kommentar</p>
            <p>{declaration.customsNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}