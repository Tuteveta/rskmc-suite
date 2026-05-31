import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Member { id: number; first_name: string; last_name: string; member_number: string; }

export default function FuneralRecordCreate({ members }: { members: Member[] }) {
    const { data, setData, post, processing, errors } = useForm({
        member_id: '', first_name: '', last_name: '', date_of_birth: '',
        date_of_death: '', date_of_funeral: '', place_of_burial: '',
        officiant: '', cause_of_death: '', notes: '',
    });
    const submit = (e: React.FormEvent) => { e.preventDefault(); post(route('funeral-records.store')); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Funeral Records', href: '/funeral-records' }, { title: 'Add Record', href: '#' }]}>
            <Head title="Add Funeral Record" />
            <div className="p-4 sm:p-6 w-full max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6">Add Funeral / Burial Record</h1>
                <form onSubmit={submit} className="space-y-4 glass rounded-xl p-6">
                    <div>
                        <Label>Link to Member (optional)</Label>
                        <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.member_id} onChange={e => setData('member_id', e.target.value)}>
                            <option value="">— Not linked —</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.last_name}, {m.first_name} ({m.member_number})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><Label>First Name *</Label><Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} /><InputError message={errors.first_name} /></div>
                        <div><Label>Last Name *</Label><Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} /><InputError message={errors.last_name} /></div>
                        <div><Label>Date of Birth</Label><Input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} /></div>
                        <div><Label>Date of Death *</Label><Input type="date" value={data.date_of_death} onChange={e => setData('date_of_death', e.target.value)} /><InputError message={errors.date_of_death} /></div>
                        <div><Label>Date of Funeral</Label><Input type="date" value={data.date_of_funeral} onChange={e => setData('date_of_funeral', e.target.value)} /></div>
                        <div><Label>Place of Burial</Label><Input value={data.place_of_burial} onChange={e => setData('place_of_burial', e.target.value)} /></div>
                        <div><Label>Officiant</Label><Input value={data.officiant} onChange={e => setData('officiant', e.target.value)} /></div>
                        <div><Label>Cause of Death</Label><Input value={data.cause_of_death} onChange={e => setData('cause_of_death', e.target.value)} /></div>
                        <div className="col-span-2"><Label>Notes</Label><textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} /></div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Save Record</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
