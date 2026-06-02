import ExportFilterModal from '@/components/export-filter-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';

interface Member {
    id: number;
    member_number: string;
    first_name: string;
    last_name: string;
    gender: string;
    phone: string | null;
    status: 'active' | 'inactive';
    join_date: string | null;
}
interface Props {
    members: { data: Member[]; links: { url: string | null; label: string; active: boolean }[] };
}

export default function MembersIndex({ members }: Props) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user?.role;
    const canDelete = ['admin', 'administrator'].includes(role);

    const destroy = (id: number) => {
        if (confirm('Delete this member?')) router.delete(route('members.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Members', href: '/members' }]}>
            <Head title="Members" />
            <div className="space-y-4 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Congregation Members</h1>
                    <div className="flex gap-2">
                        <ExportFilterModal
                            title="Members"
                            excelRoute={route('export.members.excel')}
                            pdfRoute={route('export.members.pdf')}
                            filters={[
                                {
                                    key: 'status',
                                    label: 'Status',
                                    type: 'select',
                                    options: [
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' },
                                    ],
                                },
                                {
                                    key: 'gender',
                                    label: 'Gender',
                                    type: 'select',
                                    options: [
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                    ],
                                },
                                { key: 'join_date_from', label: 'Joined From', type: 'date' },
                                { key: 'join_date_to', label: 'Joined To', type: 'date' },
                            ]}
                        />
                        <Link href={route('members.create')}>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Member
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="glass overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">No.</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Gender</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Joined</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {members.data.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{m.member_number}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {m.last_name}, {m.first_name}
                                    </td>
                                    <td className="px-4 py-3 capitalize">{m.gender}</td>
                                    <td className="px-4 py-3">{m.phone ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3">{m.join_date ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('members.edit', m.id)}>
                                                <Button size="sm" variant="outline">
                                                    Edit
                                                </Button>
                                            </Link>
                                            {canDelete && (
                                                <Button size="sm" variant="destructive" onClick={() => destroy(m.id)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {members.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                        No members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-1">
                    {members.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
