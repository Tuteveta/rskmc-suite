import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function UserCreate({ roles }: { roles: Record<string, string> }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', role: 'data_entry_officer', password: '', password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); post(route('users.store')); };

    return (
        <AppLayout breadcrumbs={[{ title: 'User Management', href: '/users' }, { title: 'Create User', href: '#' }]}>
            <Head title="Create User" />
            <div className="p-6 max-w-lg">
                <h1 className="text-2xl font-semibold mb-6">Create User</h1>
                <form onSubmit={submit} className="space-y-4 bg-white rounded-lg border p-6">
                    <div>
                        <Label>Full Name *</Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label>Email Address *</Label>
                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>
                    <div>
                        <Label>Role *</Label>
                        <select className="w-full border rounded-md px-3 py-2 text-sm" value={data.role} onChange={e => setData('role', e.target.value)}>
                            {Object.entries(roles).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <InputError message={errors.role} />
                    </div>
                    <div>
                        <Label>Password *</Label>
                        <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                        <InputError message={errors.password} />
                    </div>
                    <div>
                        <Label>Confirm Password *</Label>
                        <Input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Create User</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
