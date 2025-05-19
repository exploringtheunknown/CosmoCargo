import { CustomsDeclaration } from './CustomsDeclaration';

export interface ShipmentContact {
  name: string;
  email: string;
  planet: string;
  station: string;
}

export interface Pilot {
  id: string;
  name: string;
  status: string;
}

export interface Shipment {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  customsDeclaration?: CustomsDeclaration;
  
  // Lägg till dessa egenskaper
  sender: ShipmentContact;
  receiver: ShipmentContact;
  pilot?: Pilot;
  category: string;
  priority: string;
  weight: number;
  description?: string;
  hasInsurance: boolean;
}