import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-6 text-white">
                <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-white">
                            Rev Sione Kami Memorial Church
                        </h1>
                        <p className="text-sm text-[#A1A09A]">Content Management System</p>
                    </div>

                    <div className="w-full border-t border-[#2a2a2a]" />

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block w-full rounded-md bg-white px-6 py-2.5 text-sm font-medium text-[#1b1b18] transition hover:bg-[#ededec]"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-block w-full rounded-md bg-white px-6 py-2.5 text-sm font-medium text-[#1b1b18] transition hover:bg-[#ededec]"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
