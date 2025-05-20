import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ShipmentDetailsView from "@/components/ui/ShipmentDetailsView";
import { getShipmentById } from "@/services/shipment-service";
import Shipment from "@/model/shipment";
import { Loader } from "lucide-react";

interface ShipmentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  shipmentId?: string;
  shipment?: Shipment;
}

const ShipmentDetailsModal: React.FC<ShipmentDetailsModalProps> = ({ open, onClose, shipmentId, shipment }) => {
  const [loading, setLoading] = useState(false);
  const [fetchedShipment, setFetchedShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shipmentId && !shipment && open) {
      setLoading(true);
      setError(null);
      getShipmentById(shipmentId)
        .then((data) => {
          setFetchedShipment(data);
        })
        .catch(() => {
          setError("Could not load shipment details.");
        })
        .finally(() => setLoading(false));
    } else if (!open) {
      setFetchedShipment(null);
      setError(null);
    }
  }, [shipmentId, shipment, open]);

  const shipmentToShow = shipment || fetchedShipment;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent
        onPointerDownOutside={e => e.preventDefault()} // Prevent close on outside click
        onInteractOutside={e => e.preventDefault()} // Prevent close on outside click
        aria-label="Shipment Details"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader className="w-8 h-8 animate-spin mb-2" />
            <span>Loading shipment details...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : shipmentToShow ? (
          <ShipmentDetailsView shipment={shipmentToShow} />
        ) : (
          <div className="p-4">No shipment selected.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentDetailsModal; 