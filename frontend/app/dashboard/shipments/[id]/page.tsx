import { notFound } from "next/navigation";
import ShipmentDetailsView from "@/components/ui/ShipmentDetailsView";

async function getShipment(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/shipments/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = await getShipment(id);
  if (!shipment) return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shipment Not Found</h1>
      <p>The shipment with ID <code>{id}</code> could not be found.</p>
    </main>
  );

  return (
    <ShipmentDetailsView shipment={shipment} />
  );
} 