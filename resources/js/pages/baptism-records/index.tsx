import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ExportFilterModal from '@/components/export-filter-modal';

const TYPE_LABELS: Record<string, string> = { infant: 'Infant', immersion: 'Immersion' };
const TYPE_COLORS: Record<string, string> = { infant: 'bg-blue-100 text-blue-700', immersion: 'bg-indigo-100 text-indigo-700' };

interface Record {
    id: number; first_name: string; last_name: string; baptism_type: string;
    date_of_baptism: string; officiant: string; place_of_baptism: string | null;
    member: { first_name: string; last_name: string } | null;
}
interface Props {
    records: { data: Record[]; links: { url: string | null; label: string; active: boolean }[] };
}

export default function BaptismRecordsIndex({ records }: Props) {
    const { auth } = usePage<any>().props;
    const canDelete = ['admin', 'administrator'].includes(auth.user?.role);

    const destroy = (id: number) => {
        if (confirm('Delete this record?')) router.delete(route('baptism-records.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Baptism Records', href: '/baptism-records' }]}>
            <Head title="Baptism Records" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-2xl font-semibold">Baptism Records</h1>
                    <div className="flex gap-2">
                        <ExportFilterModal
                            title="Baptism Records"
                            excelRoute={route('export.baptism-records.excel')}
                            pdfRoute={route('export.baptism-records.pdf')}
                            filters={[
                                { key: 'date_from', label: 'Baptism Date From', type: 'date' },
                                { key: 'date_to',   label: 'Baptism Date To',   type: 'date' },
                                { key: 'officiant', label: 'Officiant',          type: 'text', placeholder: 'Search by officiant name' },
                                { key: 'place',     label: 'Place',              type: 'text', placeholder: 'Search by place' },
                            ]}
                        />
                        <Link href={route('baptism-records.create')}>
                            <Button><PlusCircle className="mr-2 h-4 w-4" />Add Record</Button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-lg border bg-white overflow-x-auto shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
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
                                    <td className="px-4 py-3 font-medium">{r.last_name}, {r.first_name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[r.baptism_type] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {TYPE_LABELS[r.baptism_type] ?? r.baptism_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{r.date_of_baptism}</td>
                                    <td className="px-4 py-3">{r.officiant}</td>
                                    <td className="px-4 py-3">{r.place_of_baptism ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        {r.member ? `${r.member.last_name}, ${r.member.first_name}` : <span className="text-gray-400 text-xs">Not linked</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 justify-end">
                                            <Link href={route('baptism-records.edit', r.id)}>
                                                <Button size="sm" variant="outline">Edit</Button>
                                            </Link>
                                            {canDelete && (
                                                <Button size="sm" variant="destructive" onClick={() => destroy(r.id)}>Delete</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {records.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-1 flex-wrap">
                    {records.links.map((link, i) => (
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
