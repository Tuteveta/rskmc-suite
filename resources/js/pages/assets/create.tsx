import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function AssetCreate({ categories }: { categories: Record<string, string> }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', category: 'other', description: '', serial_number: '',
        brand: '', acquisition_date: '', acquisition_cost: '',
        condition: 'good', location: '', status: 'active', notes: '',
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); post(route('assets.store')); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assets', href: '/assets' }, { title: 'Add Asset', href: '#' }]}>
            <Head title="Add Asset" />
            <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6">Add Asset</h1>
                <form onSubmit={submit} className="space-y-4 bg-white rounded-lg border p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Asset Name *</Label>
                            <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label>Category *</Label>
                            <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.category} onChange={e => setData('category', e.target.value)}>
                                {Object.entries(categories).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label>Brand</Label>
                            <Input value={data.brand} onChange={e => setData('brand', e.target.value)} />
                        </div>
                        <div>
                            <Label>Serial Number</Label>
                            <Input value={data.serial_number} onChange={e => setData('serial_number', e.target.value)} />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input value={data.location} onChange={e => setData('location', e.target.value)} />
                        </div>
                        <div>
                            <Label>Acquisition Date</Label>
                            <Input type="date" value={data.acquisition_date} onChange={e => setData('acquisition_date', e.target.value)} />
                        </div>
                        <div>
                            <Label>Acquisition Cost (PGK)</Label>
                            <Input type="number" step="0.01" value={data.acquisition_cost} onChange={e => setData('acquisition_cost', e.target.value)} />
                        </div>
                        <div>
                            <Label>Condition *</Label>
                            <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.condition} onChange={e => setData('condition', e.target.value)}>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                            </select>
                        </div>
                        <div>
                            <Label>Status *</Label>
                            <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.status} onChange={e => setData('status', e.target.value)}>
                                <option value="active">Active</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="retired">Retired</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <Label>Description</Label>
                            <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={2} value={data.description} onChange={e => setData('description', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <Label>Notes</Label>
                            <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Save Asset</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
