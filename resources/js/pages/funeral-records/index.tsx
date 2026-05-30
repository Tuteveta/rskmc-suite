import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface Record { id: number; first_name: string; last_name: string; date_of_death: string; date_of_funeral: string|null; place_of_burial: string|null; officiant: string|null; member: { first_name: string; last_name: string }|null; }
interface Props { records: { data: Record[]; links: { url: string|null; label: string; active: boolean }[] }; }

export default function FuneralRecordsIndex({ records }: Props) {
    const { auth } = usePage<any>().props;
    const canDelete = ['admin', 'administrator'].includes(auth.user?.role);
    const destroy = (id: number) => { if (confirm('Delete this record?')) router.delete(route('funeral-records.destroy', id)); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Funeral Records', href: '/funeral-records' }]}>
            <Head title="Funeral Records" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Funeral / Burial Records</h1>
                    <Link href={route('funeral-records.create')}><Button><PlusCircle className="mr-2 h-4 w-4" />Add Record</Button></Link>
                </div>
                <div className="rounded-lg border bg-white overflow-x-auto shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Date of Death</th><th className="px-4 py-3 text-left">Funeral Date</th><th className="px-4 py-3 text-left">Place of Burial</th><th className="px-4 py-3 text-left">Officiant</th><th className="px-4 py-3 text-left">Member</th><th className="px-4 py-3"></th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {records.data.map(r => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{r.last_name}, {r.first_name}</td>
                                    <td className="px-4 py-3">{r.date_of_death}</td>
                                    <td className="px-4 py-3">{r.date_of_funeral ?? '—'}</td>
                                    <td className="px-4 py-3">{r.place_of_burial ?? '—'}</td>
                                    <td className="px-4 py-3">{r.officiant ?? '—'}</td>
                                    <td className="px-4 py-3">{r.member ? `${r.member.last_name}, ${r.member.first_name}` : <span className="text-gray-400 text-xs">Not linked</span>}</td>
                                    <td className="px-4 py-3"><div className="flex gap-2 justify-end">
                                        <Link href={route('funeral-records.edit', r.id)}><Button size="sm" variant="outline">Edit</Button></Link>
                                        {canDelete && <Button size="sm" variant="destructive" onClick={() => destroy(r.id)}>Delete</Button>}
                                    </div></td>
                                </tr>
                            ))}
                            {records.data.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="flex gap-1 flex-wrap">{records.links.map((link, i) => <Link key={i} href={link.url ?? '#'} className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-black text-white' : 'bg-white text-gray-700'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>
            </div>
        </AppLayout>
    );
}
