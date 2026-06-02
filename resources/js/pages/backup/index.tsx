import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { HardDrive, Download, Trash2, RefreshCw } from 'lucide-react';

interface Backup { name: string; path: string; size: string; created_at: string; }
interface Props { backups: Backup[]; }

export default function BackupIndex({ backups }: Props) {
    const { processing } = useForm({});

    const runBackup = () => {
        router.post(route('backup.create'));
    };

    const deleteBackup = (name: string) => {
        if (confirm(`Delete backup "${name}"?`)) {
            router.delete(route('backup.destroy', { filename: name }));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Backup & Restore', href: '/backup' }]}>
            <Head title="Backup & Restore" />
            <div className="p-6 space-y-6 max-w-3xl">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Backup & Restore</h1>
                    <Button onClick={runBackup} disabled={processing}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {processing ? 'Creating...' : 'Create Backup'}
                    </Button>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <HardDrive className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">Database Backups</p>
                            <p className="text-xs text-gray-500">{backups.length} backup{backups.length !== 1 ? 's' : ''} stored locally</p>
                        </div>
                    </div>

                    {backups.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No backups yet. Click "Create Backup" to generate one.</p>
                    ) : (
                        <div className="divide-y">
                            {backups.map((b) => (
                                <div key={b.name} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium">{b.name}</p>
                                        <p className="text-xs text-gray-400">{b.size} &mdash; {b.created_at}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a href={route('backup.download', { filename: b.name })}>
                                            <Button size="sm" variant="outline">
                                                <Download className="mr-1.5 h-3.5 w-3.5" />Download
                                            </Button>
                                        </a>
                                        <Button size="sm" variant="destructive" onClick={() => deleteBackup(b.name)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                    <strong>Note:</strong> Backups are stored in <code className="bg-yellow-100 px-1 rounded">storage/app/backups/</code>. Ensure <code>mysqldump</code> is available on the server. Download and store copies offsite regularly.
                </div>
            </div>
        </AppLayout>
    );
}
