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
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-10" style={{ background: 'linear-gradient(145deg, #f8f9ff 0%, #fdf8ff 35%, #f6fbff 70%, #f9fff8 100%)', backgroundAttachment: 'fixed' }}>
            <div className="w-full max-w-sm sm:max-w-md">
                {/* Glass card */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.80)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(255,255,255,0.65)',
                        boxShadow: '0 8px 40px rgba(99,102,241,0.10), 0 2px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
                    }}
                >
                    {/* Header */}
                    <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-0 text-center sm:px-10 sm:pt-10">
                        <img
                            src="/logo.jpg"
                            alt="Rev Sione Kami Memorial Church"
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover shadow-md ring-2 ring-white"
                        />
                        <div>
                            <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
                                Rev Sione Kami Memorial Church
                            </h1>
                            <p className="text-xs text-indigo-400 mt-0.5 font-medium tracking-wide">RSKMC Suite</p>
                        </div>
                        <div className="w-full border-t border-gray-100 pt-4">
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{title}</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">{description}</p>
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="px-6 py-6 sm:px-10 sm:py-8">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} Rev Sione Kami Memorial Church · Port Moresby, PNG
                </p>
            </div>
        </div>
    );
}
