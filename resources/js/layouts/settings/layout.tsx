import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Lock, Palette, User } from 'lucide-react';

const navItems = [
    { title: 'Profile', url: '/settings/profile', icon: User },
    { title: 'Password', url: '/settings/password', icon: Lock },
    { title: 'Appearance', url: '/settings/appearance', icon: Palette },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<SharedData>().props;
    const currentPath = window.location.pathname;

    const initials = (auth?.user?.name ?? 'U')
        .split(' ')
        .map((w: string) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="min-h-screen bg-transparent">
            <div className="w-full px-4 py-8">
                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your profile, security, and preferences</p>
                </div>

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar */}
                    <aside className="flex-shrink-0 lg:w-56">
                        {/* User card */}
                        <div className="mb-3 flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">{auth?.user?.name}</p>
                                <p className="truncate text-xs text-gray-400">{auth?.user?.email}</p>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="glass overflow-hidden rounded-xl">
                            {navItems.map((item, i) => {
                                const active = currentPath === item.url;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.url}
                                        href={item.url}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                                            i < navItems.length - 1 && 'border-b border-gray-100',
                                            active ? 'bg-gray-900 font-medium text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                        )}
                                    >
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main content */}
                    <main className="min-w-0 flex-1 space-y-5">{children}</main>
                </div>
            </div>
        </div>
    );
}
