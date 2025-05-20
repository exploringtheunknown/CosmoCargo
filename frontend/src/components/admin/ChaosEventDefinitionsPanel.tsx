"use client";
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { api } from "@/services/api";

interface ChaosEventDefinition {
  id: number;
  name: string;
  weight: number;
  description?: string;
}

const ChaosEventDefinitionsPanel: React.FC = () => {
  const [definitions, setDefinitions] = useState<ChaosEventDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editDef, setEditDef] = useState<ChaosEventDefinition | null>(null);
  const [form, setForm] = useState({ name: "", weight: "", description: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchDefinitions = async () => {
    setLoading(true);
    try {
      const res = await api.getChaosEventDefinitions();
      if (!res.ok) throw new Error("Kunde inte hämta definitioner");
      setDefinitions(res.data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefinitions();
  }, []);

  const openCreate = () => {
    setEditDef(null);
    setForm({ name: "", weight: "", description: "" });
    setShowDialog(true);
  };

  const openEdit = (def: ChaosEventDefinition) => {
    setEditDef(def);
    setForm({ name: def.name, weight: def.weight.toString(), description: def.description || "" });
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditDef(null);
    setForm({ name: "", weight: "", description: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.weight.trim()) {
      toast({ title: "Namn och vikt krävs", variant: "destructive" });
      return;
    }
    const payload = {
      name: form.name.trim(),
      weight: parseFloat(form.weight),
      description: form.description.trim() || undefined,
    };
    try {
      let res;
      if (editDef) {
        res = await api.putChaosEventDefinition(editDef.id.toString(), payload);
      } else {
        res = await api.postChaosEventDefinition(payload);
      }
      if (!res.ok) {
        throw new Error(res.data?.message || "Fel vid sparande");
      }
      toast({ title: editDef ? "Uppdaterad!" : "Skapad!" });
      closeDialog();
      fetchDefinitions();
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Är du säker på att du vill ta bort denna definition?")) return;
    try {
      const res = await api.deleteChaosEventDefinition(id.toString());
      if (!res.ok) throw new Error("Fel vid borttagning");
      toast({ title: "Borttagen!" });
      fetchDefinitions();
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="rounded-md border border-space-secondary bg-space-primary min-w-[700px] md:min-w-[900px] w-full max-w-5xl mx-auto p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Sannolikhetstabell för kaoshändelser</h2>
        <Button onClick={openCreate} variant="default">Ny händelse</Button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead>Vikt</TableHead>
            <TableHead>Beskrivning</TableHead>
            <TableHead>Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {definitions.map(def => (
            <TableRow key={def.id}>
              <TableCell><Badge>{def.name}</Badge></TableCell>
              <TableCell>{def.weight}</TableCell>
              <TableCell>{def.description}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => openEdit(def)} className="mr-2">Redigera</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(def.id)}>Ta bort</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle>{editDef ? "Redigera kaoshändelse" : "Ny kaoshändelse"}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Namn</label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required autoFocus />
            </div>
            <div>
              <label htmlFor="weight" className="block font-medium mb-1">Vikt (sannolikhet)</label>
              <Input id="weight" name="weight" type="number" min="1" step="1" value={form.weight} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="description" className="block font-medium mb-1">Beskrivning</label>
              <Input id="description" name="description" value={form.description} onChange={handleChange} />
            </div>
            <DialogFooter>
              <Button type="submit" variant="default">{editDef ? "Spara" : "Skapa"}</Button>
              <Button type="button" variant="outline" onClick={closeDialog}>Avbryt</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChaosEventDefinitionsPanel; 