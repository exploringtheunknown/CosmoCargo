"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Package, ArrowRight } from "lucide-react";

const BookShipment = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Frakt bokad",
      description: "Din frakt har bokats och väntar på godkännande.",
      variant: "default",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2">Boka Frakt</h1>
        <p className="text-space-text-secondary">
          Fyll i information om din intergalaktiska frakt
        </p>
      </div>

      <Card className="space-card">
        <CardHeader>
          <CardTitle className="text-xl">
            <Package className="h-5 w-5 inline-block mr-2" />
            Fraktinformation
          </CardTitle>
          <CardDescription>
            Alla fält markerade med * är obligatoriska
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Avsändare</h3>

                <div className="space-y-2">
                  <Label htmlFor="sender-name">Namn *</Label>
                  <Input
                    id="sender-name"
                    placeholder="Ditt namn"
                    className="space-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-email">E-post *</Label>
                  <Input
                    id="sender-email"
                    type="email"
                    placeholder="din@email.com"
                    className="space-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-planet">Planet *</Label>
                  <Input
                    id="sender-planet"
                    placeholder="Jorden"
                    className="space-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-station">Rymdstation *</Label>
                  <Input
                    id="sender-station"
                    placeholder="t.ex. Alpha Station"
                    className="space-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mottagare</h3>

                <div className="space-y-2">
                  <Label htmlFor="receiver-name">Namn *</Label>
                  <Input
                    id="receiver-name"
                    placeholder="Mottagarens namn"
                    className="space-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver-email">E-post *</Label>
                  <Input
                    id="receiver-email"
                    type="email"
                    placeholder="mottagare@email.com"
                    className="space-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver-planet">Planet *</Label>
                  <Input
                    id="receiver-planet"
                    placeholder="t.ex. Mars"
                    className="space-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver-station">Rymdstation *</Label>
                  <Input
                    id="receiver-station"
                    placeholder="t.ex. Olympus Station"
                    className="space-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-space-secondary/30 pt-6">
              <h3 className="text-lg font-medium mb-4">Paketinformation</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="package-weight">Vikt (kg) *</Label>
                  <Input
                    id="package-weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="t.ex. 5.2"
                    className="space-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-dimensions">Dimensioner (cm) *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      id="package-length"
                      type="number"
                      min="1"
                      placeholder="Längd"
                      className="space-input"
                      required
                    />
                    <Input
                      id="package-width"
                      type="number"
                      min="1"
                      placeholder="Bredd"
                      className="space-input"
                      required
                    />
                    <Input
                      id="package-height"
                      type="number"
                      min="1"
                      placeholder="Höjd"
                      className="space-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-type">Kategori *</Label>
                  <select
                    id="package-type"
                    className="space-input w-full"
                    required
                  >
                    <option value="">Välj kategori</option>
                    <option value="standard">Standardfrakt</option>
                    <option value="fragile">Ömtåligt</option>
                    <option value="hazardous">Farligt gods</option>
                    <option value="liquid">Vätska</option>
                    <option value="living">Levande organism</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-priority">Prioritet *</Label>
                  <select
                    id="package-priority"
                    className="space-input w-full"
                    required
                  >
                    <option value="">Välj prioritet</option>
                    <option value="standard">Standard (5-7 dagar)</option>
                    <option value="express">Express (2-3 dagar)</option>
                    <option value="priority">Prioritet (24 timmar)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="package-description">Beskrivning</Label>
                <textarea
                  id="package-description"
                  rows={3}
                  placeholder="Beskriv innehållet i paketet..."
                  className="space-input w-full"
                />
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="insurance" />
                  <Label htmlFor="insurance">
                    Lägg till fraktförsäkring (+15%)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="regulations" required />
                  <Label htmlFor="regulations">
                    Jag bekräftar att innehållet följer intergalaktiska
                    fraktregler *
                  </Label>
                </div>
              </div>
            </div>

            <div className="border-t border-space-secondary/30 pt-6 flex justify-end">
              <Button type="submit" className="space-button">
                Fortsätt till tullformulär
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookShipment;
