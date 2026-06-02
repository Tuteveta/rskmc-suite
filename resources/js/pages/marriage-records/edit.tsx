import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Member { id: number; first_name: string; last_name: string; member_number: string; }
interface Record { id: number; husband_member_id: number|null; wife_member_id: number|null; husband_first_name: string; husband_last_name: string; wife_first_name: string; wife_last_name: string; date_of_marriage: string; place_of_marriage: string|null; officiant: string; witnesses: string|null; license_number: string|null; notes: string|null; }

export default function MarriageRecordEdit({ record }: { record: Record; members?: Member[] }) {
    const { data, setData, put, processing } = useForm({
        husband_member_id: record.husband_member_id ? String(record.husband_member_id) : '',
        wife_member_id: record.wife_member_id ? String(record.wife_member_id) : '',
        husband_first_name: record.husband_first_name, husband_last_name: record.husband_last_name,
        wife_first_name: record.wife_first_name, wife_last_name: record.wife_last_name,
        date_of_marriage: record.date_of_marriage, place_of_marriage: record.place_of_marriage ?? '',
        officiant: record.officiant, witnesses: record.witnesses ?? '',
        license_number: record.license_number ?? '', notes: record.notes ?? '',
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); put(route('marriage-records.update', record.id)); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Marriage Records', href: '/marriage-records' }, { title: 'Edit', href: '#' }]}>
            <Head title="Edit Marriage Record" />
            <div className="p-4 sm:p-6 w-full max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6">Edit Marriage Record</h1>
                <form onSubmit={submit} className="space-y-4 glass rounded-xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><Label>Husband First Name *</Label><Input value={data.husband_first_name} onChange={e => setData('husband_first_name', e.target.value)} /></div>
                        <div><Label>Husband Last Name *</Label><Input value={data.husband_last_name} onChange={e => setData('husband_last_name', e.target.value)} /></div>
                        <div><Label>Wife First Name *</Label><Input value={data.wife_first_name} onChange={e => setData('wife_first_name', e.target.value)} /></div>
                        <div><Label>Wife Last Name *</Label><Input value={data.wife_last_name} onChange={e => setData('wife_last_name', e.target.value)} /></div>
                        <div><Label>Date of Marriage *</Label><Input type="date" value={data.date_of_marriage} onChange={e => setData('date_of_marriage', e.target.value)} /></div>
                        <div><Label>Place</Label><Input value={data.place_of_marriage} onChange={e => setData('place_of_marriage', e.target.value)} /></div>
                        <div><Label>Officiant *</Label><Input value={data.officiant} onChange={e => setData('officiant', e.target.value)} /></div>
                        <div><Label>License No.</Label><Input value={data.license_number} onChange={e => setData('license_number', e.target.value)} /></div>
                        <div className="col-span-2"><Label>Witnesses</Label><Input value={data.witnesses} onChange={e => setData('witnesses', e.target.value)} /></div>
                        <div className="col-span-2"><Label>Notes</Label><textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} /></div>
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
