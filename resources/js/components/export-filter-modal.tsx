import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, FileText, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export interface FilterField {
    key: string;
    label: string;
    type: 'select' | 'date' | 'text';
    options?: { value: string; label: string }[];
    placeholder?: string;
}

interface Props {
    title: string;
    excelRoute: string;
    pdfRoute: string;
    filters: FilterField[];
}

export default function ExportFilterModal({ title, excelRoute, pdfRoute, filters }: Props) {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(filters.map((f) => [f.key, ''])));

    const buildUrl = (base: string) => {
        const params = new URLSearchParams();
        Object.entries(values).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        const qs = params.toString();
        return qs ? `${base}?${qs}` : base;
    };

    const handleExport = (type: 'excel' | 'pdf') => {
        const url = buildUrl(type === 'excel' ? excelRoute : pdfRoute);
        window.open(url, '_blank');
        setOpen(false);
    };

    const reset = () => setValues(Object.fromEntries(filters.map((f) => [f.key, ''])));

    const hasFilters = Object.values(values).some((v) => v !== '');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                    Export / Print
                    {hasFilters && <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-blue-500" />}
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export — {title}</DialogTitle>
                    <p className="mt-1 text-sm text-gray-500">
                        Apply filters below, then choose your export format. Leave fields blank to include all records.
                    </p>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    {filters.map((field) => (
                        <div key={field.key}>
                            <Label className="text-xs font-medium tracking-wide text-gray-600 uppercase">{field.label}</Label>
                            {field.type === 'select' ? (
                                <select
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:outline-none"
                                    value={values[field.key]}
                                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                                >
                                    <option value="">— All —</option>
                                    {field.options?.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <Input
                                    className="mt-1"
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={values[field.key]}
                                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {hasFilters && (
                    <button onClick={reset} className="text-left text-xs text-blue-500 hover:underline">
                        Clear all filters
                    </button>
                )}

                <div className="flex gap-2 border-t pt-2">
                    <Button className="flex-1" variant="outline" onClick={() => handleExport('excel')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                        Export Excel
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={() => handleExport('pdf')}>
                        <FileText className="mr-2 h-4 w-4 text-red-500" />
                        Export PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
