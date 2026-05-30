import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}) {
    useEffect(() => {
        const html = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');
        return () => {
            if (wasDark) html.classList.add('dark');
        };
    }, []);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-white p-6 md:p-10">
            <div className="w-full max-w-md">
                <Card className="rounded-2xl border-2 border-gray-200 shadow-none">
                    <CardHeader className="px-10 pt-10 pb-0 text-center flex flex-col items-center gap-4">
                        <img
                            src="/logo.jpg"
                            alt="Rev Sione Kami Memorial Church"
                            className="h-24 w-24 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-gray-900">
                                Rev Sione Kami Memorial Church
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">RSKMC Suite</p>
                        </div>
                        <div className="w-full border-t border-gray-200 pt-4">
                            <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
                            <CardDescription className="text-gray-500 mt-1">{description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 py-8">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
