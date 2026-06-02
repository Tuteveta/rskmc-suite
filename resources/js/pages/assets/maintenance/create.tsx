import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Asset {
    id: number;
    name: string;
}

export default function MaintenanceCreate({ asset, types }: { asset: Asset; types: Record<string, string> }) {
    const { data, setData, post, processing, errors } = useForm({
        service_date: new Date().toISOString().split('T')[0],
        type: 'service',
        description: '',
        cost: '',
        performed_by: '',
        next_due_date: '',
        notes: '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assets.maintenance.store', asset.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Assets', href: '/assets' },
                { title: asset.name, href: '#' },
                { title: 'Add Maintenance Log', href: '#' },
            ]}
        >
            <Head title="Add Maintenance Log" />
            <div className="max-w-lg p-6">
                <h1 className="mb-1 text-2xl font-semibold">Add Maintenance Log</h1>
                <p className="mb-6 text-sm text-gray-500">{asset.name}</p>
                <form onSubmit={submit} className="glass space-y-4 rounded-xl p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Service Date *</Label>
                            <Input type="date" value={data.service_date} onChange={(e) => setData('service_date', e.target.value)} />
                            <InputError message={errors.service_date} />
                        </div>
                        <div>
                            <Label>Type *</Label>
                            <select
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                {Object.entries(types).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <Label>Description *</Label>
                            <Input value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            <InputError message={errors.description} />
                        </div>
                        <div>
                            <Label>Cost (PGK)</Label>
                            <Input type="number" step="0.01" value={data.cost} onChange={(e) => setData('cost', e.target.value)} />
                        </div>
                        <div>
                            <Label>Performed By</Label>
                            <Input value={data.performed_by} onChange={(e) => setData('performed_by', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <Label>Next Due Date</Label>
                            <Input type="date" value={data.next_due_date} onChange={(e) => setData('next_due_date', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <Label>Notes</Label>
                            <textarea
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                rows={2}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Save Log
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
