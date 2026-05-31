import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileSpreadsheet, FileText } from 'lucide-react';

interface Tithe { id: number; receipt_number: string; giving_type: string; amount: string; giving_date: string; service_type: string | null; member: { first_name: string; last_name: string } | null; }
interface Props {
    tithes: { data: Tithe[]; links: { url: string | null; label: string; active: boolean }[] };
    giving_types: Record<string, string>;
    totals: { month: number; year: number; all: number };
}

const typeColor: Record<string, string> = {
    tithe: 'bg-blue-100 text-blue-700', offering: 'bg-green-100 text-green-700',
    special: 'bg-purple-100 text-purple-700', building_fund: 'bg-orange-100 text-orange-700',
    mission: 'bg-teal-100 text-teal-700',
};

export default function TithesIndex({ tithes, giving_types, totals }: Props) {
    const { auth } = usePage<any>().props;
    const canDelete = ['admin', 'administrator'].includes(auth.user?.role);

    const destroy = (id: number) => {
        if (confirm('Delete this record?')) router.delete(route('tithes.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tithes & Offerings', href: '/tithes' }]}>
            <Head title="Tithes & Offerings" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-2xl font-semibold">Tithes & Offerings</h1>
                    <div className="flex gap-2">
                        <Link href={route('tithes.create')}>
                            <Button><PlusCircle className="mr-2 h-4 w-4" />Record Giving</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'This Month', value: totals.month },
                        { label: `This Year (${new Date().getFullYear()})`, value: totals.year },
                        { label: 'All Time', value: totals.all },
                    ].map(s => (
                        <div key={s.label} className="rounded-lg border bg-white p-4">
                            <p className="text-xs text-gray-500">{s.label}</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">PGK {Number(s.value).toLocaleString('en-PG', { minimumFractionDigits: 2 })}</p>
                        </div>
                    ))}
                </div>

                <div className="glass rounded-xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Receipt</th>
                                <th className="px-4 py-3 text-left">Member</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-right">Amount (PGK)</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tithes.data.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.receipt_number}</td>
                                    <td className="px-4 py-3 font-medium">{t.member ? `${t.member.last_name}, ${t.member.first_name}` : <span className="text-gray-400">Anonymous</span>}</td>
                                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[t.giving_type] ?? 'bg-gray-100 text-gray-600'}`}>{giving_types[t.giving_type]}</span></td>
                                    <td className="px-4 py-3">{t.giving_date}</td>
                                    <td className="px-4 py-3 text-right font-medium">{Number(t.amount).toLocaleString('en-PG', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 justify-end">
                                            <Link href={route('tithes.edit', t.id)}><Button size="sm" variant="outline">Edit</Button></Link>
                                            {canDelete && <Button size="sm" variant="destructive" onClick={() => destroy(t.id)}>Delete</Button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tithes.data.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-1 flex-wrap">
                    {tithes.links.map((link, i) => (
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
