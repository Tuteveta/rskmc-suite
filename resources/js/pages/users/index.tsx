import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface User { id: number; name: string; email: string; role: string; created_at: string; }

interface Props {
    users: { data: User[]; links: { url: string | null; label: string; active: boolean }[] };
    roles: Record<string, string>;
}

export default function UsersIndex({ users, roles }: Props) {
    const destroy = (id: number, name: string) => {
        if (confirm(`Delete user "${name}"?`)) router.delete(route('users.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'User Management', href: '/users' }]}>
            <Head title="User Management" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">User Management</h1>
                    <Link href={route('users.create')}>
                        <Button><UserPlus className="mr-2 h-4 w-4" />Create User</Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Created</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.data.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{u.name}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {roles[u.role] ?? u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 flex gap-2 justify-end">
                                        <Link href={route('users.edit', u.id)}>
                                            <Button size="sm" variant="outline">Edit</Button>
                                        </Link>
                                        <Button size="sm" variant="destructive" onClick={() => destroy(u.id, u.name)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-1">
                    {users.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'}
                            className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
