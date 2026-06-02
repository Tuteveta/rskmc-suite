import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

interface Record {
    id: number;
    first_name: string;
    last_name: string;
    date_of_death: string;
    date_of_funeral: string | null;
    place_of_burial: string | null;
    officiant: string | null;
    member: { first_name: string; last_name: string } | null;
}
interface Props {
    records: { data: Record[]; links: { url: string | null; label: string; active: boolean }[] };
}

export default function FuneralRecordsIndex({ records }: Props) {
    const { auth } = usePage<SharedData>().props;
    const canDelete = ['admin', 'administrator'].includes(auth.user?.role);
    const destroy = (id: number) => {
        if (confirm('Delete this record?')) router.delete(route('funeral-records.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Funeral Records', href: '/funeral-records' }]}>
            <Head title="Funeral Records" />
            <div className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Funeral / Burial Records</h1>
                    <Link href={route('funeral-records.create')}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Record
                        </Button>
                    </Link>
                </div>
                <div className="glass overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Date of Death</th>
                                <th className="px-4 py-3 text-left">Funeral Date</th>
                                <th className="px-4 py-3 text-left">Place of Burial</th>
                                <th className="px-4 py-3 text-left">Officiant</th>
                                <th className="px-4 py-3 text-left">Member</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">
                                        {r.last_name}, {r.first_name}
                                    </td>
                                    <td className="px-4 py-3">{r.date_of_death}</td>
                                    <td className="px-4 py-3">{r.date_of_funeral ?? '—'}</td>
                                    <td className="px-4 py-3">{r.place_of_burial ?? '—'}</td>
                                    <td className="px-4 py-3">{r.officiant ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        {r.member ? (
                                            `${r.member.last_name}, ${r.member.first_name}`
                                        ) : (
                                            <span className="text-xs text-gray-400">Not linked</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('funeral-records.edit', r.id)}>
                                                <Button size="sm" variant="outline">
                                                    Edit
                                                </Button>
                                            </Link>
                                            {canDelete && (
                                                <Button size="sm" variant="destructive" onClick={() => destroy(r.id)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {records.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap gap-1">
                    {records.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-black text-white' : 'bg-white text-gray-700'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
