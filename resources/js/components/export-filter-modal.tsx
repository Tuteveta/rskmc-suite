import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileSpreadsheet, FileText, SlidersHorizontal } from 'lucide-react';

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
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(filters.map(f => [f.key, '']))
    );

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

    const reset = () => setValues(Object.fromEntries(filters.map(f => [f.key, ''])));

    const hasFilters = Object.values(values).some(v => v !== '');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                    Export / Print
                    {hasFilters && (
                        <span className="ml-1.5 h-2 w-2 rounded-full bg-blue-500 inline-block" />
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export — {title}</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Apply filters below, then choose your export format. Leave fields blank to include all records.
                    </p>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    {filters.map(field => (
                        <div key={field.key}>
                            <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                {field.label}
                            </Label>
                            {field.type === 'select' ? (
                                <select
                                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                                    value={values[field.key]}
                                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                                >
                                    <option value="">— All —</option>
                                    {field.options?.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <Input
                                    className="mt-1"
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={values[field.key]}
                                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {hasFilters && (
                    <button
                        onClick={reset}
                        className="text-xs text-blue-500 hover:underline text-left"
                    >
                        Clear all filters
                    </button>
                )}

                <div className="flex gap-2 pt-2 border-t">
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => handleExport('excel')}
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                        Export Excel
                    </Button>
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => handleExport('pdf')}
                    >
                        <FileText className="mr-2 h-4 w-4 text-red-500" />
                        Export PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
