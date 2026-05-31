import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Asset { id: number; name: string; }
interface Log { id: number; service_date: string; type: string; description: string; cost: string|null; performed_by: string|null; next_due_date: string|null; notes: string|null; }

export default function MaintenanceEdit({ asset, log, types }: { asset: Asset; log: Log; types: Record<string, string> }) {
    const { data, setData, put, processing } = useForm({
        service_date: log.service_date, type: log.type, description: log.description,
        cost: log.cost ?? '', performed_by: log.performed_by ?? '',
        next_due_date: log.next_due_date ?? '', notes: log.notes ?? '',
    });
    const submit = (e: React.FormEvent) => { e.preventDefault(); put(route('assets.maintenance.update', { asset: asset.id, log: log.id })); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assets', href: '/assets' }, { title: asset.name, href: '#' }, { title: 'Edit Log', href: '#' }]}>
            <Head title="Edit Maintenance Log" />
            <div className="p-6 max-w-lg">
                <h1 className="text-2xl font-semibold mb-6">Edit Maintenance Log</h1>
                <form onSubmit={submit} className="space-y-4 glass rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Service Date *</Label><Input type="date" value={data.service_date} onChange={e => setData('service_date', e.target.value)} /></div>
                        <div><Label>Type *</Label><select className="w-full border rounded-md px-3 py-2 text-sm" value={data.type} onChange={e => setData('type', e.target.value)}>{Object.entries(types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                        <div className="col-span-2"><Label>Description *</Label><Input value={data.description} onChange={e => setData('description', e.target.value)} /></div>
                        <div><Label>Cost (PGK)</Label><Input type="number" step="0.01" value={data.cost} onChange={e => setData('cost', e.target.value)} /></div>
                        <div><Label>Performed By</Label><Input value={data.performed_by} onChange={e => setData('performed_by', e.target.value)} /></div>
                        <div className="col-span-2"><Label>Next Due Date</Label><Input type="date" value={data.next_due_date} onChange={e => setData('next_due_date', e.target.value)} /></div>
                        <div className="col-span-2"><Label>Notes</Label><textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} /></div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Update Log</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
