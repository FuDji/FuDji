"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";
import * as XLSX from "xlsx";

import { bulkInviteEmployees } from "@/app/company/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Row = { full_name: string; email: string; daily_budget_override: number | null };

export function BulkUploadDialog() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleFile(file: File) {
    setError(null);
    setCreated(null);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const parsed: Row[] = raw
        .map((r) => {
          const fullName = String(r.full_name ?? r["Ime i prezime"] ?? r.name ?? "").trim();
          const email = String(r.email ?? r.Email ?? r["E-mail"] ?? "").trim();
          const budgetRaw = r.daily_budget_override ?? r.budget ?? r["Budžet"] ?? "";
          const budget = budgetRaw === "" ? null : Number(budgetRaw);
          return { full_name: fullName, email, daily_budget_override: Number.isFinite(budget) ? budget : null };
        })
        .filter((r) => r.email.includes("@"));

      if (parsed.length === 0) {
        setError("Nisu pronađeni redovi sa validnim email adresama. Očekivane kolone: full_name, email.");
        return;
      }
      setRows(parsed);
    } catch {
      setError("Fajl nije mogao biti pročitan. Podržani formati: .xlsx, .xls, .csv");
    }
  }

  function submit() {
    startTransition(async () => {
      const result = await bulkInviteEmployees(rows);
      if (result.error) setError(result.error);
      else {
        setCreated(result.created ?? rows.length);
        setRows([]);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setRows([]);
          setError(null);
          setCreated(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary">
          <FileSpreadsheet className="size-4" /> Uvezi iz Excela
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk uvoz zaposlenih</DialogTitle>
          <DialogDescription>
            Otpremi .xlsx/.csv fajl sa kolonama <code>full_name</code> i <code>email</code> (opciono{" "}
            <code>daily_budget_override</code>). Za svaki red se šalje pozivnica.
          </DialogDescription>
        </DialogHeader>

        {created != null ? (
          <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            <CheckCircle2 className="size-4 shrink-0" />
            Kreirano {created} pozivnica.
          </div>
        ) : (
          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground hover:bg-secondary/40">
              <Upload className="size-6" />
              Klikni da izabereš fajl
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>

            {rows.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="px-3 py-1.5">{r.full_name || "—"}</td>
                        <td className="px-3 py-1.5 text-muted-foreground">{r.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <Button className="w-full" disabled={rows.length === 0 || pending} onClick={submit}>
              Pošalji {rows.length > 0 ? `${rows.length} ` : ""}pozivnica
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
