import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

interface Record {
    id: number;
    husband_first_name: string;
    husband_last_name: string;
    wife_first_name: string;
    wife_last_name: string;
    date_of_marriage: string;
    place_of_marriage: string | null;
    officiant: string;
}
interface Props {
    records: { data: Record[]; links: { url: string | null; label: string; active: boolean }[] };
}

export default function MarriageRecordsIndex({ records }: Props) {
    const { auth } = usePage<SharedData>().props;
    const canDelete = ['admin', 'administrator'].includes(auth.user?.role);
    const destroy = (id: number) => {
        if (confirm('Delete this record?')) router.delete(route('marriage-records.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Marriage Records', href: '/marriage-records' }]}>
            <Head title="Marriage Records" />
            <div className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Marriage Records</h1>
                    <Link href={route('marriage-records.create')}>
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
                                <th className="px-4 py-3 text-left">Husband</th>
                                <th className="px-4 py-3 text-left">Wife</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Place</th>
                                <th className="px-4 py-3 text-left">Officiant</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">
                                        {r.husband_last_name}, {r.husband_first_name}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {r.wife_last_name}, {r.wife_first_name}
                                    </td>
                                    <td className="px-4 py-3">{r.date_of_marriage}</td>
                                    <td className="px-4 py-3">{r.place_of_marriage ?? '—'}</td>
                                    <td className="px-4 py-3">{r.officiant}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('marriage-records.edit', r.id)}>
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
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
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
