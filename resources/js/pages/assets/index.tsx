import ExportFilterModal from '@/components/export-filter-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

interface Asset {
    id: number;
    name: string;
    category: string;
    brand: string | null;
    condition: string;
    status: string;
    location: string | null;
}
interface Props {
    assets: { data: Asset[]; links: { url: string | null; label: string; active: boolean }[] };
    categories: Record<string, string>;
}

const conditionColor: Record<string, string> = {
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    fair: 'bg-yellow-100 text-yellow-700',
    poor: 'bg-red-100 text-red-700',
};
const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
    retired: 'bg-gray-100 text-gray-600',
};

export default function AssetsIndex({ assets, categories }: Props) {
    const { auth } = usePage<SharedData>().props;
    const canDelete = ['admin', 'administrator'].includes(auth.user?.role);

    const destroy = (id: number) => {
        if (confirm('Delete this asset?')) router.delete(route('assets.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Assets', href: '/assets' }]}>
            <Head title="Assets" />
            <div className="space-y-4 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Church Assets</h1>
                    <div className="flex gap-2">
                        <ExportFilterModal
                            title="Assets"
                            excelRoute={route('export.assets.excel')}
                            pdfRoute={route('export.assets.pdf')}
                            filters={[
                                {
                                    key: 'category',
                                    label: 'Category',
                                    type: 'select',
                                    options: Object.entries(categories).map(([k, v]) => ({ value: k, label: v })),
                                },
                                {
                                    key: 'status',
                                    label: 'Status',
                                    type: 'select',
                                    options: [
                                        { value: 'active', label: 'Active' },
                                        { value: 'maintenance', label: 'Maintenance' },
                                        { value: 'retired', label: 'Retired' },
                                    ],
                                },
                                {
                                    key: 'condition',
                                    label: 'Condition',
                                    type: 'select',
                                    options: [
                                        { value: 'excellent', label: 'Excellent' },
                                        { value: 'good', label: 'Good' },
                                        { value: 'fair', label: 'Fair' },
                                        { value: 'poor', label: 'Poor' },
                                    ],
                                },
                            ]}
                        />
                        <Link href={route('assets.create')}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Asset
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="glass overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Brand</th>
                                <th className="px-4 py-3 text-left">Condition</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Location</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {assets.data.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{a.name}</td>
                                    <td className="px-4 py-3">{categories[a.category] ?? a.category}</td>
                                    <td className="px-4 py-3">{a.brand ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${conditionColor[a.condition]}`}>
                                            {a.condition}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[a.status]}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{a.location ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('assets.maintenance.index', a.id)}>
                                                <Button size="sm" variant="outline">
                                                    Logs
                                                </Button>
                                            </Link>
                                            <Link href={route('assets.edit', a.id)}>
                                                <Button size="sm" variant="outline">
                                                    Edit
                                                </Button>
                                            </Link>
                                            {canDelete && (
                                                <Button size="sm" variant="destructive" onClick={() => destroy(a.id)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {assets.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                        No assets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-1">
                    {assets.links.map((link, i) => (
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
