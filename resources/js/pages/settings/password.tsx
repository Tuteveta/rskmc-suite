import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Password settings', href: '/settings/password' }];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />
            <SettingsLayout>
                <div className="glass rounded-xl">
                    <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                            <KeyRound className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Update Password</h2>
                            <p className="text-xs text-gray-500">Use a long, random password to keep your account secure</p>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        {/* Security tip */}
                        <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                            <p className="text-xs text-blue-700">
                                Choose a password with at least 8 characters, mixing letters, numbers, and symbols.
                            </p>
                        </div>

                        <form onSubmit={updatePassword} className="space-y-5">
                            <div className="grid gap-1.5">
                                <Label htmlFor="current_password" className="text-sm font-medium text-gray-700">
                                    Current Password
                                </Label>
                                <Input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter current password"
                                    className="h-10"
                                />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="h-px bg-gray-100" />

                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    New Password
                                </Label>
                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Enter new password"
                                    className="h-10"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
                                    className="h-10"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <Button disabled={processing} className="px-5">
                                    Update Password
                                </Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    leave="transition ease-in-out duration-150"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm font-medium text-green-600">✓ Password updated</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
