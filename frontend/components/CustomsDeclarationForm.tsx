import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { customsDeclarationSchema } from '../src/services/form-validation';

interface CustomsDeclarationFormProps {
  shipmentId: string;
  onSubmit: (data: z.infer<typeof customsDeclarationSchema>) => void;
  initialData?: z.infer<typeof customsDeclarationSchema>;
}

export default function CustomsDeclarationForm({ onSubmit, initialData }: CustomsDeclarationFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(customsDeclarationSchema),
    defaultValues: initialData || {
      containsLifeforms: false,
      isPlasmaActive: false,
      quarantineRequired: false,
      originPlanetLawsConfirmed: false,
    }
  });

  const containsLifeforms = watch('containsLifeforms');
  const isPlasmaActive = watch('isPlasmaActive');
  const plasmaStabilityLevel = watch('plasmaStabilityLevel');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-bold">Galactic Cargo Declaration™</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="containsLifeforms"
            {...register('containsLifeforms')}
            className="mr-2"
          />
          <label htmlFor="containsLifeforms">Innehåller levande varelser</label>
        </div>
        
        {containsLifeforms && (
          <div>
            <label htmlFor="lifeformType" className="block mb-1">
              Beskrivning av art, intelligens, riskklass
            </label>
            <textarea
              id="lifeformType"
              {...register('lifeformType')}
              className="w-full p-2 border rounded"
            />
            {errors.lifeformType && (
              <p className="text-red-500 text-sm mt-1">{errors.lifeformType.message}</p>
            )}
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPlasmaActive"
            {...register('isPlasmaActive')}
            className="mr-2"
          />
          <label htmlFor="isPlasmaActive">Innehåller plasma-aktiva material</label>
        </div>
        
        {isPlasmaActive && (
          <div>
            <label htmlFor="plasmaStabilityLevel" className="block mb-1">
              Stabilitetsskala (1-10)
            </label>
            <input
              type="number"
              id="plasmaStabilityLevel"
              min="1"
              max="10"
              {...register('plasmaStabilityLevel', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
            />
            {errors.plasmaStabilityLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.plasmaStabilityLevel.message}</p>
            )}
          </div>
        )}
        
        {isPlasmaActive && (plasmaStabilityLevel ?? 0) < 4 && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="quarantineRequired"
              {...register('quarantineRequired')}
              className="mr-2"
              disabled
              checked
            />
            <label htmlFor="quarantineRequired" className="text-amber-600 font-bold">
              Karantän krävs (automatiskt påtvingad för plasma med stabilitet under 4)
            </label>
            {errors.quarantineRequired && (
              <p className="text-red-500 text-sm mt-1">{errors.quarantineRequired.message}</p>
            )}
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="originPlanetLawsConfirmed"
            {...register('originPlanetLawsConfirmed')}
            className="mr-2"
          />
          <label htmlFor="originPlanetLawsConfirmed">
            Jag intygar att exporten är laglig enligt ursprungsplanetens lagar
          </label>
          {errors.originPlanetLawsConfirmed && (
            <p className="text-red-500 text-sm mt-1">{errors.originPlanetLawsConfirmed.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="customsNotes" className="block mb-1">
            Frivillig kommentar
          </label>
          <textarea
            id="customsNotes"
            {...register('customsNotes')}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Skicka tulldeklaration
      </button>
    </form>
  );
} 