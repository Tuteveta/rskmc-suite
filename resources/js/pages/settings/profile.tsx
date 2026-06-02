import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Mail, ShieldAlert, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profile settings', href: '/settings/profile' }];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const initials = (auth.user.name ?? 'U')
        .split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <SettingsLayout>

                {/* Profile card */}
                <div className="glass rounded-xl">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                            <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Profile Information</h2>
                            <p className="text-xs text-gray-500">Update your name and email address</p>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
                                {initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{auth.user.name}</p>
                                <p className="text-xs text-gray-400">{auth.user.email}</p>
                                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 capitalize">
                                    {String(auth.user.role ?? 'User').replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Your full name"
                                    className="h-10"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="your@email.com"
                                        className="h-10 pl-9"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="underline font-medium hover:text-amber-900"
                                    >
                                        Resend verification email.
                                    </Link>
                                    {status === 'verification-link-sent' && (
                                        <p className="mt-1 text-green-600 font-medium">Verification link sent!</p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-1">
                                <Button disabled={processing} className="px-5">
                                    Save Changes
                                </Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    leave="transition ease-in-out duration-150"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600 font-medium">✓ Saved successfully</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Danger zone */}
                <div className="glass rounded-xl border-red-200">
                    <div className="px-6 py-5 border-b border-red-100 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
                            <p className="text-xs text-red-400">Irreversible and destructive actions</p>
                        </div>
                    </div>
                    <div className="px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Delete Account</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Permanently delete your account and all associated data. This cannot be undone.
                                </p>
                            </div>
                            <DeleteUser />
                        </div>
                    </div>
                </div>

            </SettingsLayout>
        </AppLayout>
    );
}
