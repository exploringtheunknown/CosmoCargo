import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomsDeclaration } from '../types/CustomsDeclaration';

interface CustomsDeclarationFormProps {
  declaration?: CustomsDeclaration;
  showRiskLevel?: boolean;
}

export default function CustomsDeclarationForm({

}: CustomsDeclarationFormProps) {
  return (
    <div className="space-y-6 mb-6">
      <h4 className="text-md font-medium">Galactic Cargo Declaration™</h4>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="containsLifeforms" name="containsLifeforms" />
          <Label htmlFor="containsLifeforms">Innehåller levande varelser</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lifeformType">Beskrivning av art, intelligens, riskklass</Label>
          <Textarea
            id="lifeformType"
            name="lifeformType"
            placeholder="Beskriv livsformen..."
            className="space-input"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="isPlasmaActive" name="isPlasmaActive" />
          <Label htmlFor="isPlasmaActive">Innehåller plasma-aktiva material</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plasmaStabilityLevel">Stabilitetsskala (1-10)</Label>
          <Input
            type="number"
            id="plasmaStabilityLevel"
            name="plasmaStabilityLevel"
            min="1"
            max="10"
            placeholder="Ange stabilitetsnivå"
            className="space-input"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="quarantineRequired" name="quarantineRequired" />
          <Label htmlFor="quarantineRequired">Karantän krävs</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="originPlanetLawsConfirmed" name="originPlanetLawsConfirmed" />
          <Label htmlFor="originPlanetLawsConfirmed">
            Jag intygar att exporten är laglig enligt ursprungsplanetens lagar
          </Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customsNotes">Frivillig kommentar</Label>
          <Textarea
            id="customsNotes"
            name="customsNotes"
            placeholder="Ytterligare information..."
            className="space-input"
          />
        </div>
      </div>
    </div>
  );
} 