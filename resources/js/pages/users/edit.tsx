import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface User { id: number; name: string; email: string; role: string; }

export default function UserEdit({ user, roles }: { user: User; roles: Record<string, string> }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name, email: user.email, role: user.role,
        password: '', password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); put(route('users.update', user.id)); };

    return (
        <AppLayout breadcrumbs={[{ title: 'User Management', href: '/users' }, { title: 'Edit User', href: '#' }]}>
            <Head title="Edit User" />
            <div className="p-6 max-w-lg">
                <h1 className="text-2xl font-semibold mb-6">Edit User</h1>
                <form onSubmit={submit} className="space-y-4 glass rounded-xl p-6">
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
                    </div>
                    <div className="border-t pt-4">
                        <p className="text-xs text-gray-500 mb-3">Leave password blank to keep unchanged.</p>
                        <div className="space-y-4">
                            <div>
                                <Label>New Password</Label>
                                <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                                <InputError message={errors.password} />
                            </div>
                            <div>
                                <Label>Confirm New Password</Label>
                                <Input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Update User</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
