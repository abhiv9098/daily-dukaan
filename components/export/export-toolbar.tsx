"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  History,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { buildExportBundle } from "@/lib/export/build-bundle";
import { exportToExcel } from "@/lib/export/export-excel";
import { exportToPdf } from "@/lib/export/export-pdf";
import { cn } from "@/lib/utils";
import { ExportDataType } from "@/types/export";
import { Badge } from "@/components/ui/badge";

const EXPORT_TYPES: { value: ExportDataType; label: string }[] = [
  { value: "complete", label: "Complete Report" },
  { value: "transactions", label: "Transaction Ledger" },
  { value: "customers", label: "Customer List" },
  { value: "bills", label: "Bills & Expenses" },
];

interface ExportToolbarProps {
  useFiltered?: boolean;
  className?: string;
}

export function ExportToolbar({ useFiltered = true, className }: ExportToolbarProps) {
  const { transactions, stats, settings } = useHisaabContext();
  const { filters } = useFilterContext();
  const filtered = useFilteredTransactions(transactions, filters);
  const [exportType, setExportType] = useState<ExportDataType>("complete");
  const [loading, setLoading] = useState<"xlsx" | "pdf" | null>(null);

  const dataSource = useFiltered ? filtered : transactions;

  const handleExport = async (
    format: "xlsx" | "pdf",
    typeOverride?: ExportDataType
  ) => {
    const type = typeOverride ?? exportType;
    setLoading(format);
    try {
      const bundle = buildExportBundle(
        dataSource,
        transactions,
        stats,
        settings,
        filters,
        type
      );
      if (format === "xlsx") {
        exportToExcel(bundle, type);
      } else {
        exportToPdf(bundle, type);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className={cn("border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60 overflow-hidden", className)}>
      <CardHeader className="pb-4 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Download className="h-4 w-4 text-purple-500" />
            Data Center
          </CardTitle>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-white/10 bg-white/5">
            {dataSource.length} Records
          </Badge>
        </div>
        <CardDescription className="text-xs pt-1">
          Generate professional financial reports in multiple formats.
        </CardDescription>
        
        {/* Decorative corner glow */}
        <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-purple-500/10 blur-2xl" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Configuration</Label>
          <div className="flex flex-col gap-2">
            <Select
              value={exportType}
              onValueChange={(v) => setExportType(v as ExportDataType)}
            >
              <SelectTrigger className="h-9 rounded-xl bg-black/5 dark:bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {EXPORT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                className="h-10 rounded-xl gap-2 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20"
                disabled={!!loading || dataSource.length === 0}
                onClick={() => handleExport("xlsx")}
              >
                {loading === "xlsx" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                Excel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl gap-2 border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                disabled={!!loading || dataSource.length === 0}
                onClick={() => handleExport("pdf")}
              >
                {loading === "pdf" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Bulk Actions</Label>
            <History className="h-3 w-3 text-muted-foreground opacity-50" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 rounded-lg gap-1.5 text-[11px] font-medium bg-white/5 border border-white/10 hover:bg-white/10"
              disabled={!!loading}
              onClick={() => handleExport("xlsx", "complete")}
            >
              Full Excel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 rounded-lg gap-1.5 text-[11px] font-medium bg-white/5 border border-white/10 hover:bg-white/10"
              disabled={!!loading}
              onClick={() => handleExport("pdf", "complete")}
            >
              Full PDF
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-3 flex gap-3">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-500/80 leading-relaxed">
            Exports include automated summaries, categorized expenses, and customer performance metrics based on your current filters.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
