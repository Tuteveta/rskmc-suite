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

export default function MarriageRecordCreate({ members }: { members: Member[] }) {
    const { data, setData, post, processing, errors } = useForm({
        husband_member_id: '',
        wife_member_id: '',
        husband_first_name: '',
        husband_last_name: '',
        wife_first_name: '',
        wife_last_name: '',
        date_of_marriage: '',
        place_of_marriage: '',
        officiant: '',
        witnesses: '',
        license_number: '',
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('marriage-records.store'));
    };

    const MemberSelect = ({ label, field }: { label: string; field: 'husband_member_id' | 'wife_member_id' }) => (
        <div>
            <Label>{label} Member (optional)</Label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" value={data[field]} onChange={(e) => setData(field, e.target.value)}>
                <option value="">— Not linked —</option>
                {members.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.last_name}, {m.first_name} ({m.member_number})
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Marriage Records', href: '/marriage-records' },
                { title: 'Add Record', href: '#' },
            ]}
        >
            <Head title="Add Marriage Record" />
            <div className="w-full max-w-2xl p-4 sm:p-6">
                <h1 className="mb-6 text-2xl font-semibold">Add Marriage Record</h1>
                <form onSubmit={submit} className="glass space-y-5 rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-4 border-b pb-4">
                        <h3 className="col-span-2 font-medium text-gray-700">Husband</h3>
                        <MemberSelect label="Husband" field="husband_member_id" />
                        <div />
                        <div>
                            <Label>First Name *</Label>
                            <Input value={data.husband_first_name} onChange={(e) => setData('husband_first_name', e.target.value)} />
                            <InputError message={errors.husband_first_name} />
                        </div>
                        <div>
                            <Label>Last Name *</Label>
                            <Input value={data.husband_last_name} onChange={(e) => setData('husband_last_name', e.target.value)} />
                            <InputError message={errors.husband_last_name} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b pb-4">
                        <h3 className="col-span-2 font-medium text-gray-700">Wife</h3>
                        <MemberSelect label="Wife" field="wife_member_id" />
                        <div />
                        <div>
                            <Label>First Name *</Label>
                            <Input value={data.wife_first_name} onChange={(e) => setData('wife_first_name', e.target.value)} />
                            <InputError message={errors.wife_first_name} />
                        </div>
                        <div>
                            <Label>Last Name *</Label>
                            <Input value={data.wife_last_name} onChange={(e) => setData('wife_last_name', e.target.value)} />
                            <InputError message={errors.wife_last_name} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Date of Marriage *</Label>
                            <Input type="date" value={data.date_of_marriage} onChange={(e) => setData('date_of_marriage', e.target.value)} />
                            <InputError message={errors.date_of_marriage} />
                        </div>
                        <div>
                            <Label>Place of Marriage</Label>
                            <Input value={data.place_of_marriage} onChange={(e) => setData('place_of_marriage', e.target.value)} />
                        </div>
                        <div>
                            <Label>Officiant *</Label>
                            <Input value={data.officiant} onChange={(e) => setData('officiant', e.target.value)} />
                            <InputError message={errors.officiant} />
                        </div>
                        <div>
                            <Label>License No.</Label>
                            <Input value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <Label>Witnesses</Label>
                            <Input
                                value={data.witnesses}
                                onChange={(e) => setData('witnesses', e.target.value)}
                                placeholder="Comma-separated names"
                            />
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
