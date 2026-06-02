import ExportFilterModal from '@/components/export-filter-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = { infant: 'Infant', immersion: 'Immersion' };
const TYPE_COLORS: Record<string, string> = { infant: 'bg-blue-100 text-blue-700', immersion: 'bg-indigo-100 text-indigo-700' };

interface Record {
    id: number;
    first_name: string;
    last_name: string;
    baptism_type: string;
    date_of_baptism: string;
    officiant: string;
    place_of_baptism: string | null;
    member: { first_name: string; last_name: string } | null;
}
interface Props {
    records: { data: Record[]; links: { url: string | null; label: string; active: boolean }[] };
}

export default function BaptismRecordsIndex({ records }: Props) {
    const { auth } = usePage<SharedData>().props;
    const canDelete = ['admin', 'administrator'].includes(auth.user?.role);

    const destroy = (id: number) => {
        if (confirm('Delete this record?')) router.delete(route('baptism-records.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Baptism Records', href: '/baptism-records' }]}>
            <Head title="Baptism Records" />
            <div className="space-y-4 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Baptism Records</h1>
                    <div className="flex gap-2">
                        <ExportFilterModal
                            title="Baptism Records"
                            excelRoute={route('export.baptism-records.excel')}
                            pdfRoute={route('export.baptism-records.pdf')}
                            filters={[
                                { key: 'date_from', label: 'Baptism Date From', type: 'date' },
                                { key: 'date_to', label: 'Baptism Date To', type: 'date' },
                                { key: 'officiant', label: 'Officiant', type: 'text', placeholder: 'Search by officiant name' },
                                { key: 'place', label: 'Place', type: 'text', placeholder: 'Search by place' },
                            ]}
                        />
                        <Link href={route('baptism-records.create')}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Record
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="glass overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Date of Baptism</th>
                                <th className="px-4 py-3 text-left">Officiant</th>
                                <th className="px-4 py-3 text-left">Place</th>
                                <th className="px-4 py-3 text-left">Linked Member</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">
                                        {r.last_name}, {r.first_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[r.baptism_type] ?? 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {TYPE_LABELS[r.baptism_type] ?? r.baptism_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{r.date_of_baptism}</td>
                                    <td className="px-4 py-3">{r.officiant}</td>
                                    <td className="px-4 py-3">{r.place_of_baptism ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        {r.member ? (
                                            `${r.member.last_name}, ${r.member.first_name}`
                                        ) : (
                                            <span className="text-xs text-gray-400">Not linked</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('baptism-records.edit', r.id)}>
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
                            className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
