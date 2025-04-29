"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { pilotService, Pilot } from "@/services/pilotService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditPilotPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    status: "Active",
  });

  const pilotId = params.id as string;

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      toast.error("Du har inte behörighet att se denna sida");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchPilot = async () => {
      try {
        setIsLoading(true);
        const data = await pilotService.getPilotById(pilotId);
        setPilot(data);
        setFormData({
          name: data.name,
          email: data.email,
          experience: data.experience || "",
          status: data.status,
        });
      } catch (error) {
        console.error("Error fetching pilot:", error);
        toast.error("Kunde inte hämta pilotinformation");
        router.push("/dashboard/pilots-management");
      } finally {
        setIsLoading(false);
      }
    };

    if (pilotId) {
      fetchPilot();
    }
  }, [pilotId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as "Active" | "Inactive" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Namn och e-post är obligatoriska fält");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (pilot && pilot.status !== formData.status) {
        await pilotService.updatePilotStatus(pilotId, formData.status as "Active" | "Inactive");
      }
      
      await pilotService.updatePilot(pilotId, {
        name: formData.name,
        email: formData.email,
        experience: formData.experience
      });
      
      toast.success("Pilotinformationen har uppdaterats");
      router.push("/dashboard/pilots-management");
    } catch (error) {
      console.error("Error updating pilot:", error);
      toast.error("Ett fel uppstod när piloten skulle uppdateras");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-space-accent-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push("/dashboard/pilots-management")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <h1 className="text-3xl font-bold text-space-text-primary">
          Redigera pilot
        </h1>
      </div>

      <Card className="bg-space-primary border-space-secondary">
        <CardHeader>
          <CardTitle className="text-space-text-primary">Pilotinformation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Namn *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ange pilotens namn"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">E-post *</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ange pilotens e-postadress"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Erfarenhet</label>
              <Textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Beskriv pilotens erfarenhet och kvalifikationer"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Aktiv</SelectItem>
                  <SelectItem value="Inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/pilots-management")}
              >
                Avbryt
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sparar...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Spara
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPilotPage; 