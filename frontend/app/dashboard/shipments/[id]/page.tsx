import { notFound } from "next/navigation";

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
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shipment Details</h1>
      <section aria-labelledby="shipment-info" className="mb-6">
        <h2 id="shipment-info" className="text-lg font-semibold mb-2">General Info</h2>
        <dl className="grid grid-cols-1 gap-2">
          <div>
            <dt className="font-medium">Shipment ID</dt>
            <dd className="break-all">{shipment.id}</dd>
          </div>
          <div>
            <dt className="font-medium">Status</dt>
            <dd>{shipment.status}</dd>
          </div>
          <div>
            <dt className="font-medium">Created</dt>
            <dd>{shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : "-"}</dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby="sender-info" className="mb-6">
        <h2 id="sender-info" className="text-lg font-semibold mb-2">Sender</h2>
        <dl className="grid grid-cols-1 gap-2">
          <div>
            <dt className="font-medium">Name</dt>
            <dd>{shipment.sender?.name}</dd>
          </div>
          <div>
            <dt className="font-medium">Email</dt>
            <dd>{shipment.sender?.email}</dd>
          </div>
          <div>
            <dt className="font-medium">Planet</dt>
            <dd>{shipment.sender?.planet}</dd>
          </div>
          <div>
            <dt className="font-medium">Station</dt>
            <dd>{shipment.sender?.station}</dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby="receiver-info" className="mb-6">
        <h2 id="receiver-info" className="text-lg font-semibold mb-2">Receiver</h2>
        <dl className="grid grid-cols-1 gap-2">
          <div>
            <dt className="font-medium">Name</dt>
            <dd>{shipment.receiver?.name}</dd>
          </div>
          <div>
            <dt className="font-medium">Email</dt>
            <dd>{shipment.receiver?.email}</dd>
          </div>
          <div>
            <dt className="font-medium">Planet</dt>
            <dd>{shipment.receiver?.planet}</dd>
          </div>
          <div>
            <dt className="font-medium">Station</dt>
            <dd>{shipment.receiver?.station}</dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby="pilot-info">
        <h2 id="pilot-info" className="text-lg font-semibold mb-2">Pilot</h2>
        <dl className="grid grid-cols-1 gap-2">
          <div>
            <dt className="font-medium">Name</dt>
            <dd>{shipment.pilot?.name || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium">Email</dt>
            <dd>{shipment.pilot?.email || "-"}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
} 