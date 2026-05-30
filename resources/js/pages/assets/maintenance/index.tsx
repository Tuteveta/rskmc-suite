import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft } from 'lucide-react';

interface Asset { id: number; name: string; }
interface Log { id: number; service_date: string; type: string; description: string; cost: string|null; performed_by: string|null; next_due_date: string|null; }
interface Props { asset: Asset; logs: { data: Log[]; links: { url: string|null; label: string; active: boolean }[] }; types: Record<string, string>; }

const typeColor: Record<string, string> = {
    service: 'bg-blue-100 text-blue-700', repair: 'bg-red-100 text-red-700',
    inspection: 'bg-yellow-100 text-yellow-700', upgrade: 'bg-green-100 text-green-700', other: 'bg-gray-100 text-gray-600',
};

export default function MaintenanceIndex({ asset, logs, types }: Props) {
    const { auth } = usePage<any>().props;
    const canDelete = ['admin', 'administrator'].includes(auth.user?.role);
    const destroy = (logId: number) => { if (confirm('Delete this log?')) router.delete(route('assets.maintenance.destroy', { asset: asset.id, log: logId })); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assets', href: '/assets' }, { title: asset.name, href: `/assets/${asset.id}/edit` }, { title: 'Maintenance', href: '#' }]}>
            <Head title={`Maintenance — ${asset.name}`} />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <Link href="/assets" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-1"><ArrowLeft className="h-3.5 w-3.5" />Back to Assets</Link>
                        <h1 className="text-2xl font-semibold">Maintenance Log — {asset.name}</h1>
                    </div>
                    <Link href={route('assets.maintenance.create', asset.id)}><Button><PlusCircle className="mr-2 h-4 w-4" />Add Log</Button></Link>
                </div>
                <div className="rounded-lg border bg-white overflow-x-auto shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Description</th><th className="px-4 py-3 text-left">Performed By</th><th className="px-4 py-3 text-right">Cost (PGK)</th><th className="px-4 py-3 text-left">Next Due</th><th className="px-4 py-3"></th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs.data.map(l => (
                                <tr key={l.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">{l.service_date}</td>
                                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${typeColor[l.type] ?? 'bg-gray-100 text-gray-600'}`}>{types[l.type]}</span></td>
                                    <td className="px-4 py-3">{l.description}</td>
                                    <td className="px-4 py-3">{l.performed_by ?? '—'}</td>
                                    <td className="px-4 py-3 text-right">{l.cost ? Number(l.cost).toLocaleString('en-PG', { minimumFractionDigits: 2 }) : '—'}</td>
                                    <td className="px-4 py-3">{l.next_due_date ?? '—'}</td>
                                    <td className="px-4 py-3"><div className="flex gap-2 justify-end">
                                        <Link href={route('assets.maintenance.edit', { asset: asset.id, log: l.id })}><Button size="sm" variant="outline">Edit</Button></Link>
                                        {canDelete && <Button size="sm" variant="destructive" onClick={() => destroy(l.id)}>Delete</Button>}
                                    </div></td>
                                </tr>
                            ))}
                            {logs.data.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No maintenance logs yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
