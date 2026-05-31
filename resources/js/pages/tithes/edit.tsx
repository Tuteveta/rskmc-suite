import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Member { id: number; first_name: string; last_name: string; member_number: string; }
interface Tithe { id: number; member_id: number | null; giving_type: string; amount: string; giving_date: string; service_type: string | null; notes: string | null; }

export default function TitheEdit({ tithe, members, giving_types }: { tithe: Tithe; members: Member[]; giving_types: Record<string, string> }) {
    const { data, setData, put, processing, errors } = useForm({
        member_id: tithe.member_id ? String(tithe.member_id) : '',
        giving_type: tithe.giving_type, amount: tithe.amount,
        giving_date: tithe.giving_date, service_type: tithe.service_type ?? '', notes: tithe.notes ?? '',
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); put(route('tithes.update', tithe.id)); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tithes & Offerings', href: '/tithes' }, { title: 'Edit Record', href: '#' }]}>
            <Head title="Edit Giving Record" />
            <div className="p-6 max-w-lg">
                <h1 className="text-2xl font-semibold mb-6">Edit Giving Record</h1>
                <form onSubmit={submit} className="space-y-4 glass rounded-xl p-6">
                    <div>
                        <Label>Member (optional)</Label>
                        <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.member_id} onChange={e => setData('member_id', e.target.value)}>
                            <option value="">— Anonymous —</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.last_name}, {m.first_name} ({m.member_number})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Giving Type *</Label>
                            <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.giving_type} onChange={e => setData('giving_type', e.target.value)}>
                                {Object.entries(giving_types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label>Amount (PGK) *</Label>
                            <Input type="number" step="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)} />
                            <InputError message={errors.amount} />
                        </div>
                        <div>
                            <Label>Date *</Label>
                            <Input type="date" value={data.giving_date} onChange={e => setData('giving_date', e.target.value)} />
                        </div>
                        <div>
                            <Label>Service</Label>
                            <Input value={data.service_type} onChange={e => setData('service_type', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>Notes</Label>
                        <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Update Record</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
