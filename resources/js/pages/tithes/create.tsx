import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Member {
    id: number;
    first_name: string;
    last_name: string;
    member_number: string;
}

export default function TitheCreate({ members, giving_types }: { members: Member[]; giving_types: Record<string, string> }) {
    const { data, setData, post, processing, errors } = useForm({
        member_id: '',
        giving_type: 'tithe',
        amount: '',
        giving_date: new Date().toISOString().split('T')[0],
        service_type: '',
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tithes.store'));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tithes & Offerings', href: '/tithes' },
                { title: 'Record Giving', href: '#' },
            ]}
        >
            <Head title="Record Giving" />
            <div className="max-w-lg p-6">
                <h1 className="mb-6 text-2xl font-semibold">Record Giving</h1>
                <form onSubmit={submit} className="glass space-y-4 rounded-xl p-6">
                    <div>
                        <Label>Member (optional)</Label>
                        <select
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={data.member_id}
                            onChange={(e) => setData('member_id', e.target.value)}
                        >
                            <option value="">— Anonymous —</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.last_name}, {m.first_name} ({m.member_number})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Giving Type *</Label>
                            <select
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={data.giving_type}
                                onChange={(e) => setData('giving_type', e.target.value)}
                            >
                                {Object.entries(giving_types).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Amount (PGK) *</Label>
                            <Input type="number" step="0.01" min="0.01" value={data.amount} onChange={(e) => setData('amount', e.target.value)} />
                            <InputError message={errors.amount} />
                        </div>
                        <div>
                            <Label>Date *</Label>
                            <Input type="date" value={data.giving_date} onChange={(e) => setData('giving_date', e.target.value)} />
                        </div>
                        <div>
                            <Label>Service</Label>
                            <Input
                                placeholder="e.g. Sunday Morning"
                                value={data.service_type}
                                onChange={(e) => setData('service_type', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Notes</Label>
                        <textarea
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Save Record
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
