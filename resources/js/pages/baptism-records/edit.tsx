import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface BaptismRecord {
    id: number; member_id: number | null; first_name: string; last_name: string;
    date_of_birth: string | null; date_of_baptism: string; place_of_baptism: string | null;
    officiant: string; father_name: string | null; mother_name: string | null;
    witnesses: string | null; notes: string | null;
}
interface Member { id: number; first_name: string; last_name: string; member_number: string; }

export default function BaptismRecordEdit({ record, members }: { record: BaptismRecord; members: Member[] }) {
    const { data, setData, put, processing, errors } = useForm({
        member_id: record.member_id ? String(record.member_id) : '',
        first_name: record.first_name, last_name: record.last_name,
        date_of_birth: record.date_of_birth ?? '', date_of_baptism: record.date_of_baptism,
        place_of_baptism: record.place_of_baptism ?? '', officiant: record.officiant,
        father_name: record.father_name ?? '', mother_name: record.mother_name ?? '',
        witnesses: record.witnesses ?? '', notes: record.notes ?? '',
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); put(route('baptism-records.update', record.id)); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Baptism Records', href: '/baptism-records' }, { title: 'Edit Record', href: '#' }]}>
            <Head title="Edit Baptism Record" />
            <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6">Edit Baptism Record</h1>
                <form onSubmit={submit} className="space-y-4 bg-white rounded-lg border p-6">
                    <div>
                        <Label>Link to Member (optional)</Label>
                        <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.member_id} onChange={e => setData('member_id', e.target.value)}>
                            <option value="">— Not linked —</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.last_name}, {m.first_name} ({m.member_number})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>First Name *</Label>
                            <Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
                            <InputError message={errors.first_name} />
                        </div>
                        <div>
                            <Label>Last Name *</Label>
                            <Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} />
                        </div>
                        <div>
                            <Label>Date of Birth</Label>
                            <Input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} />
                        </div>
                        <div>
                            <Label>Date of Baptism *</Label>
                            <Input type="date" value={data.date_of_baptism} onChange={e => setData('date_of_baptism', e.target.value)} />
                            <InputError message={errors.date_of_baptism} />
                        </div>
                        <div>
                            <Label>Place of Baptism</Label>
                            <Input value={data.place_of_baptism} onChange={e => setData('place_of_baptism', e.target.value)} />
                        </div>
                        <div>
                            <Label>Officiant *</Label>
                            <Input value={data.officiant} onChange={e => setData('officiant', e.target.value)} />
                            <InputError message={errors.officiant} />
                        </div>
                        <div>
                            <Label>Father's Name</Label>
                            <Input value={data.father_name} onChange={e => setData('father_name', e.target.value)} />
                        </div>
                        <div>
                            <Label>Mother's Name</Label>
                            <Input value={data.mother_name} onChange={e => setData('mother_name', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <Label>Witnesses</Label>
                            <Input value={data.witnesses} onChange={e => setData('witnesses', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <Label>Notes</Label>
                            <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)} />
                        </div>
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
