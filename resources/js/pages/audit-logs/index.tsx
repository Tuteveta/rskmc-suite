import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Log {
    id: number;
    action: string;
    model_short: string;
    model_label: string;
    user: string;
    ip_address: string;
    created_at: string;
}
interface Props {
    logs: { data: Log[]; links: { url: string | null; label: string; active: boolean }[] };
}

const actionStyle: Record<string, string> = {
    created: 'bg-green-100 text-green-700',
    updated: 'bg-blue-100 text-blue-700',
    deleted: 'bg-red-100 text-red-700',
};

export default function AuditLogsIndex({ logs }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Audit Log', href: '/audit-logs' }]}>
            <Head title="Audit Log" />
            <div className="space-y-4 p-4 sm:p-6">
                <h1 className="text-2xl font-semibold">Audit Log</h1>

                <div className="glass overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">When</th>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3 text-left">Action</th>
                                <th className="px-4 py-3 text-left">Module</th>
                                <th className="px-4 py-3 text-left">Record</th>
                                <th className="px-4 py-3 text-left">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs.data.map((l) => (
                                <tr key={l.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">{l.created_at}</td>
                                    <td className="px-4 py-3 font-medium">{l.user}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${actionStyle[l.action] ?? 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {l.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{l.model_short}</td>
                                    <td className="px-4 py-3">{l.model_label}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{l.ip_address ?? '—'}</td>
                                </tr>
                            ))}
                            {logs.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                        No log entries yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-1">
                    {logs.links.map((link, i) => (
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
