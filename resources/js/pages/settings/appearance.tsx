import AppearanceTabs from '@/components/appearance-tabs';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Monitor } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Appearance settings', href: '/settings/appearance' }];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />
            <SettingsLayout>

                <div className="glass rounded-xl">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                            <Monitor className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Appearance</h2>
                            <p className="text-xs text-gray-500">Customize how the dashboard looks on your device</p>
                        </div>
                    </div>
                    <div className="px-6 py-6">
                        <AppearanceTabs />
                    </div>
                </div>

            </SettingsLayout>
        </AppLayout>
    );
}
