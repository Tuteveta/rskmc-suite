import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Member {
    id: number; first_name: string; last_name: string; gender: string;
    date_of_birth: string | null; phone: string | null; email: string | null;
    address: string | null; join_date: string | null; status: string; notes: string | null;
}

export default function MemberEdit({ member }: { member: Member }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: member.first_name, last_name: member.last_name,
        gender: member.gender, date_of_birth: member.date_of_birth ?? '',
        phone: member.phone ?? '', email: member.email ?? '',
        address: member.address ?? '', join_date: member.join_date ?? '',
        status: member.status, notes: member.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('members.update', member.id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Members', href: '/members' }, { title: 'Edit Member', href: '#' }]}>
            <Head title="Edit Member" />
            <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6">Edit Member</h1>
                <form onSubmit={submit} className="space-y-4 glass rounded-xl p-6">
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Gender *</Label>
                            <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <Label>Date of Birth</Label>
                            <Input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Phone</Label>
                            <Input value={data.phone} onChange={e => setData('phone', e.target.value)} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>Address</Label>
                        <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={2} value={data.address} onChange={e => setData('address', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Join Date</Label>
                            <Input type="date" value={data.join_date} onChange={e => setData('join_date', e.target.value)} />
                        </div>
                        <div>
                            <Label>Status *</Label>
                            <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.status} onChange={e => setData('status', e.target.value)}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label>Notes</Label>
                        <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Update Member</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
