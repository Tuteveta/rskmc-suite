import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function MemberCreate() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '', last_name: '', gender: 'male', date_of_birth: '',
        phone: '', email: '', address: '', join_date: '', status: 'active', notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('members.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Members', href: '/members' }, { title: 'Add Member', href: '/members/create' }]}>
            <Head title="Add Member" />
            <div className="p-4 sm:p-6 w-full max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6">Add Member</h1>
                <form onSubmit={submit} className="space-y-4 glass rounded-xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Join Date</Label>
                            <Input type="date" value={data.join_date} onChange={e => setData('join_date', e.target.value)} />
                        </div>
                        <div>
                            <Label>Status *</Label>
                            <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.status} onChange={e => setData('status', e.target.value)}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="dedication">Dedication</option>
                                <option value="new_convert">New Convert</option>
                                <option value="follow_up">Follow Up</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label>Notes</Label>
                        <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Save Member</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
