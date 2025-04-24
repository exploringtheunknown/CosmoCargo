"use client";

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Define the form schema with zod
const pilotFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Pilotens namn måste vara minst 2 tecken." }),
  email: z.string().email({ message: "Vänligen ange en giltig e-postadress." }),
  experience: z.string().min(1, { message: "Vänligen ange erfarenhet." }),
  isActive: z.boolean(),
  password: z
    .string()
    .min(8, { message: "Lösenordet måste vara minst 8 tecken." })
    .optional()
    .or(z.literal("")),
});

// Mock data for pilots (same as in PilotsManagement)
const MOCK_PILOTS = [
  {
    id: "P1001",
    name: "Erik Nilsson",
    email: "pilot@example.com",
    status: "active",
    experience: "5 years",
    assignedShipments: 1,
    rating: 4.8,
  },
  {
    id: "P1002",
    name: "Anna Lindberg",
    email: "anna.lindberg@example.com",
    status: "inactive",
    experience: "3 years",
    assignedShipments: 0,
    rating: 4.5,
  },
  {
    id: "P1003",
    name: "Lars Svensson",
    email: "lars.svensson@example.com",
    status: "active",
    experience: "7 years",
    assignedShipments: 2,
    rating: 4.9,
  },
];

// Define the type for the form values
type PilotFormValues = z.infer<typeof pilotFormSchema>;

const AddEditPilot = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const isEditMode = !!id;

  // Setup form with react-hook-form
  const form = useForm<PilotFormValues>({
    resolver: zodResolver(pilotFormSchema),
    defaultValues: {
      name: "",
      email: "",
      experience: "",
      isActive: true,
      password: "",
    },
  });

  // Get the pilot data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const pilotToEdit = MOCK_PILOTS.find((pilot) => pilot.id === id);

      if (pilotToEdit) {
        form.reset({
          name: pilotToEdit.name,
          email: pilotToEdit.email,
          experience: pilotToEdit.experience,
          isActive: pilotToEdit.status === "active",
          password: "", // Empty in edit mode
        });
      } else {
        toast.error("Kunde inte hitta piloten");
        router.push("/dashboard/pilots");
      }
    }
  }, [id, isEditMode, router, form]);

  // Handle form submission
  const onSubmit = (data: PilotFormValues) => {
    // In a real app, this would call an API
    console.log("Form data:", data);

    // Show success toast and navigate back to pilots list
    if (isEditMode) {
      toast.success(`Piloten ${data.name} har uppdaterats`);
    } else {
      toast.success(`Piloten ${data.name} har lagts till`);
    }

    router.push("/dashboard/pilots");
  };

  // Check for admin access
  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Åtkomst nekad</h2>
        <p className="text-space-text-secondary text-center">
          Du har inte behörighet att hantera piloter. Denna sida är endast för
          administratörer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/pilots")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Tillbaka
        </Button>
        <h1 className="text-2xl font-medium tracking-tight">
          {isEditMode ? "Redigera Pilot" : "Lägg till ny Pilot"}
        </h1>
      </div>

      <Card className="bg-space-primary border-space-secondary">
        <CardHeader>
          <CardTitle>Pilotinformation</CardTitle>
          <CardDescription>
            Fyll i informationen nedan för att{" "}
            {isEditMode ? "uppdatera" : "skapa"} en pilot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Namn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Erik Nilsson"
                          {...field}
                          className="space-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-post</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="pilot@example.com"
                          type="email"
                          {...field}
                          className="space-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Erfarenhet</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="5 years"
                          {...field}
                          className="space-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isEditMode && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lösenord</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                            className="space-input"
                          />
                        </FormControl>
                        <FormDescription>Minst 8 tecken.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isEditMode && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nytt Lösenord (valfritt)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Lämna tomt för att behålla nuvarande"
                            type="password"
                            {...field}
                            className="space-input"
                          />
                        </FormControl>
                        <FormDescription>
                          Lämna tomt om du inte vill ändra lösenordet.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-space-secondary p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aktiv</FormLabel>
                      <FormDescription>
                        Markera om piloten är aktiv och kan ta emot uppdrag.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-end px-0 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => router.push("/dashboard/pilots")}
                >
                  Avbryt
                </Button>
                <Button type="submit" className="space-button">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Spara ändringar" : "Skapa Pilot"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditPilot;
