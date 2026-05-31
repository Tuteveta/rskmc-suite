import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';
import ExportFilterModal from '@/components/export-filter-modal';

interface Member {
    id: number; member_number: string; first_name: string; last_name: string;
    gender: string; phone: string | null; status: 'active' | 'inactive'; join_date: string | null;
}
interface Props {
    members: { data: Member[]; links: { url: string | null; label: string; active: boolean }[] };
}

export default function MembersIndex({ members }: Props) {
    const { auth } = usePage<any>().props;
    const role = auth.user?.role;
    const canDelete = ['admin', 'administrator'].includes(role);

    const destroy = (id: number) => {
        if (confirm('Delete this member?')) router.delete(route('members.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Members', href: '/members' }]}>
            <Head title="Members" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-2xl font-semibold">Congregation Members</h1>
                    <div className="flex gap-2">
                        <ExportFilterModal
                            title="Members"
                            excelRoute={route('export.members.excel')}
                            pdfRoute={route('export.members.pdf')}
                            filters={[
                                { key: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
                                { key: 'gender', label: 'Gender', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
                                { key: 'join_date_from', label: 'Joined From', type: 'date' },
                                { key: 'join_date_to',   label: 'Joined To',   type: 'date' },
                            ]}
                        />
                        <Link href={route('members.create')}>
                            <Button><UserPlus className="mr-2 h-4 w-4" />Add Member</Button>
                        </Link>
                    </div>
                </div>

                <div className="glass rounded-xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
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
                                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{m.member_number}</td>
                                    <td className="px-4 py-3 font-medium">{m.last_name}, {m.first_name}</td>
                                    <td className="px-4 py-3 capitalize">{m.gender}</td>
                                    <td className="px-4 py-3">{m.phone ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3">{m.join_date ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 justify-end">
                                            <Link href={route('members.edit', m.id)}>
                                                <Button size="sm" variant="outline">Edit</Button>
                                            </Link>
                                            {canDelete && (
                                                <Button size="sm" variant="destructive" onClick={() => destroy(m.id)}>Delete</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {members.data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No members found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-1 flex-wrap">
                    {members.links.map((link, i) => (
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
