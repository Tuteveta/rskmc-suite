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
interface Record {
    id: number;
    member_id: number | null;
    first_name: string;
    last_name: string;
    date_of_birth: string | null;
    date_of_death: string;
    date_of_funeral: string | null;
    place_of_burial: string | null;
    officiant: string | null;
    cause_of_death: string | null;
    notes: string | null;
}

export default function FuneralRecordEdit({ record, members }: { record: Record; members: Member[] }) {
    const { data, setData, put, processing } = useForm({
        member_id: record.member_id ? String(record.member_id) : '',
        first_name: record.first_name,
        last_name: record.last_name,
        date_of_birth: record.date_of_birth ?? '',
        date_of_death: record.date_of_death,
        date_of_funeral: record.date_of_funeral ?? '',
        place_of_burial: record.place_of_burial ?? '',
        officiant: record.officiant ?? '',
        cause_of_death: record.cause_of_death ?? '',
        notes: record.notes ?? '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('funeral-records.update', record.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Funeral Records', href: '/funeral-records' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Funeral Record" />
            <div className="w-full max-w-2xl p-4 sm:p-6">
                <h1 className="mb-6 text-2xl font-semibold">Edit Funeral / Burial Record</h1>
                <form onSubmit={submit} className="glass space-y-4 rounded-xl p-6">
                    <div>
                        <Label>Link to Member</Label>
                        <select
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={data.member_id}
                            onChange={(e) => setData('member_id', e.target.value)}
                        >
                            <option value="">— Not linked —</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.last_name}, {m.first_name} ({m.member_number})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>First Name *</Label>
                            <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                        </div>
                        <div>
                            <Label>Last Name *</Label>
                            <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                        </div>
                        <div>
                            <Label>Date of Birth</Label>
                            <Input type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} />
                        </div>
                        <div>
                            <Label>Date of Death *</Label>
                            <Input type="date" value={data.date_of_death} onChange={(e) => setData('date_of_death', e.target.value)} />
                        </div>
                        <div>
                            <Label>Date of Funeral</Label>
                            <Input type="date" value={data.date_of_funeral} onChange={(e) => setData('date_of_funeral', e.target.value)} />
                        </div>
                        <div>
                            <Label>Place of Burial</Label>
                            <Input value={data.place_of_burial} onChange={(e) => setData('place_of_burial', e.target.value)} />
                        </div>
                        <div>
                            <Label>Officiant</Label>
                            <Input value={data.officiant} onChange={(e) => setData('officiant', e.target.value)} />
                        </div>
                        <div>
                            <Label>Cause of Death</Label>
                            <Input value={data.cause_of_death} onChange={(e) => setData('cause_of_death', e.target.value)} />
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
                            Update Record
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
