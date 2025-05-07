import * as z from 'zod';

export const customsDeclarationSchema = z.object({
  containsLifeforms: z.boolean(),
  lifeformType: z.string().optional(),
  isPlasmaActive: z.boolean(),
  plasmaStabilityLevel: z.number().optional(),
  quarantineRequired: z.boolean(),
  originPlanetLawsConfirmed: z.boolean(),
  customsNotes: z.string().optional(),
}).refine(
  (data) => !data.containsLifeforms || (data.lifeformType && data.lifeformType.length > 0),
  {
    message: "Beskrivning av livsform krävs när frakten innehåller levande varelser",
    path: ["lifeformType"]
  }
).refine(
  (data) => !data.isPlasmaActive || (data.plasmaStabilityLevel !== undefined && data.plasmaStabilityLevel !== null),
  {
    message: "Stabilitetsnivå krävs för plasmaaktiva material",
    path: ["plasmaStabilityLevel"]
  }
).refine(
  (data) => !data.isPlasmaActive || !data.plasmaStabilityLevel || (data.plasmaStabilityLevel >= 1 && data.plasmaStabilityLevel <= 10),
  {
    message: "Stabilitetsnivå måste vara mellan 1 och 10",
    path: ["plasmaStabilityLevel"]
  }
).refine(
  (data) => !data.isPlasmaActive || !data.plasmaStabilityLevel || data.plasmaStabilityLevel >= 4 || data.quarantineRequired === true,
  {
    message: "Karantän krävs för plasmaaktiva material med stabilitetsnivå under 4",
    path: ["quarantineRequired"]
  }
).refine(
  (data) => data.originPlanetLawsConfirmed === true,
  {
    message: "Du måste intyga att exporten är laglig enligt ursprungsplanetens lagar",
    path: ["originPlanetLawsConfirmed"]
  }
);