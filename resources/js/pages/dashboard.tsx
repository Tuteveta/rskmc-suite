import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
    Users, Package, Droplets, Heart, Cross,
    DollarSign, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import AgePyramid      from '@/components/charts/AgePyramid';
import CalendarHeatmap from '@/components/charts/CalendarHeatmap';
import DonutChart      from '@/components/charts/DonutChart';
import BarRace         from '@/components/charts/BarRace';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

type Period = 'week' | 'month' | 'year';

interface Variance { current: number; previous: number; diff: number; pct: number; trend: 'up' | 'down' | 'neutral'; }
interface PeriodVariances { new_members: Variance; baptisms: Variance; marriages: Variance; funerals: Variance; tithes: Variance; }

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const PIE_COLORS: Record<string, string> = {
    'Tithe': '#3b82f6', 'Offering': '#10b981', 'Special Offering': '#f59e0b',
    'Building Fund': '#f97316', 'Mission Fund': '#8b5cf6',
};

// ── Trend indicator ──────────────────────────────────────────────────────────
function TrendBadge({ v, invert = false }: { v: Variance; invert?: boolean }) {
    const effectiveTrend = invert
        ? (v.trend === 'up' ? 'down' : v.trend === 'down' ? 'up' : 'neutral')
        : v.trend;

    if (effectiveTrend === 'neutral') return (
        <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
            <Minus className="h-3 w-3" /> No change
        </span>
    );

    const up = effectiveTrend === 'up';
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
            {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {v.pct}%
        </span>
    );
}

// ── Variance card ────────────────────────────────────────────────────────────
function VCard({ label, value, variance, icon: Icon, color, isCurrency = false, invert = false }: {
    label: string; value: number; variance: Variance;
    icon: React.ElementType; color: string; isCurrency?: boolean; invert?: boolean;
}) {
    const fmt = (n: number) => isCurrency
        ? `PGK ${n.toLocaleString('en-PG', { minimumFractionDigits: 2 })}`
        : n.toLocaleString();

    return (
        <div className="rounded-xl border bg-white p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <TrendBadge v={variance} invert={invert} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{fmt(variance.current)}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                    vs {fmt(variance.previous)} prev period
                    {variance.diff !== 0 && (
                        <span className={variance.diff > 0 ? ' text-green-600' : ' text-red-500'}>
                            {' '}({variance.diff > 0 ? '+' : ''}{isCurrency ? `PGK ${variance.diff.toFixed(2)}` : variance.diff})
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}

// ── Section heading ──────────────────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
            {children}
        </div>
    );
}

// ── Custom tooltip ───────────────────────────────────────────────────────────
function CurrencyTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-white p-3 shadow-md text-xs">
            <p className="font-semibold mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.color }}>
                    {p.name}: PGK {Number(p.value).toLocaleString('en-PG', { minimumFractionDigits: 2 })}
                </p>
            ))}
        </div>
    );
}

// ── Main dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ summary, variances, charts }: {
    summary: Record<string, number>;
    variances: Record<Period, PeriodVariances>;
    charts: Record<string, any[]>;
}) {
    const { auth } = usePage<any>().props;
    const role = auth.user?.role_label ?? auth.user?.role ?? '';
    const [period, setPeriod] = useState<Period>('month');
    const v = variances[period];

    const periodLabel: Record<Period, string> = {
        week: 'vs last week', month: 'vs last month', year: 'vs last year',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Welcome, {auth.user?.name}</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{role} · RSKMC Suite</p>
                    </div>
                    {/* Period toggle */}
                    <div className="flex rounded-lg border bg-white overflow-hidden text-sm">
                        {(['week', 'month', 'year'] as Period[]).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 capitalize transition-colors ${period === p ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Period label */}
                <p className="text-xs text-gray-400 -mt-4">Showing variances <strong>{periodLabel[period]}</strong></p>

                {/* Variance cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <VCard label="New Members"       value={summary.total_members}   variance={v.new_members} icon={Users}      color="bg-blue-500" />
                    <VCard label="Baptisms"          value={summary.baptism_records}  variance={v.baptisms}    icon={Droplets}   color="bg-indigo-500" />
                    <VCard label="Marriages"         value={summary.marriage_records} variance={v.marriages}   icon={Heart}      color="bg-pink-500" />
                    <VCard label="Funerals"          value={summary.funeral_records}  variance={v.funerals}    icon={Cross}      color="bg-gray-500" invert />
                    <VCard label={`Giving (${period === 'year' ? 'Year' : period === 'month' ? 'Month' : 'Week'})`}
                        value={summary.tithes_month} variance={v.tithes} icon={DollarSign} color="bg-green-500" isCurrency />
                </div>

                {/* Summary totals */}
                <div className="grid gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Total Members',   value: summary.total_members,   sub: `${summary.active_members} active` },
                        { label: 'Total Assets',    value: summary.total_assets,    sub: 'registered' },
                        { label: 'Giving This Month', value: `PGK ${Number(summary.tithes_month).toLocaleString('en-PG', { minimumFractionDigits: 2 })}`, sub: 'tithes & offerings', raw: true },
                        { label: 'Giving This Year',  value: `PGK ${Number(summary.tithes_year).toLocaleString('en-PG', { minimumFractionDigits: 2 })}`, sub: 'cumulative', raw: true },
                    ].map(s => (
                        <div key={s.label} className="rounded-xl border bg-white p-4">
                            <p className="text-xs text-gray-500">{s.label}</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</p>
                            <p className="text-xs text-gray-400">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Charts row 1 */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <ChartCard title="Member Growth — Last 12 Months">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={charts.member_growth}>
                                <defs>
                                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={1} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Area type="monotone" dataKey="total" name="Total Members" stroke="#3b82f6" fill="url(#totalGrad)" strokeWidth={2} dot={false} />
                                <Bar dataKey="new_members" name="New Members" fill="#10b981" radius={[3, 3, 0, 0]} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Monthly Giving — This Year vs Last Year">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={charts.giving_monthly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={1} />
                                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `K${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CurrencyTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Bar dataKey="amount"    name="This Year"  fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="prev_year" name="Last Year"  fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* D3 Charts — row 1: Age Pyramid + Giving Heatmap */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <ChartCard title="Member Age Distribution">
                        <AgePyramid data={charts.age_pyramid ?? []} />
                    </ChartCard>
                    <ChartCard title="Giving Activity — Last 12 Months">
                        <CalendarHeatmap data={charts.giving_heatmap ?? []} />
                    </ChartCard>
                </div>

                {/* D3 Charts — row 2: Member Status Donut + Giving Race */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <ChartCard title="Member Status Breakdown">
                        <DonutChart data={charts.member_status ?? []} centerLabel="Members" />
                    </ChartCard>
                    <ChartCard title="Cumulative Giving by Type — 12-Month Race">
                        <BarRace data={charts.giving_race ?? []} />
                    </ChartCard>
                </div>

                {/* Charts row 2 */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <ChartCard title="Weekly Giving — Last 8 Weeks">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={charts.giving_weekly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `K${v}`} />
                                <Tooltip content={<CurrencyTooltip />} />
                                <Bar dataKey="amount" name="Giving" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Giving by Type — This Year">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={charts.giving_by_type} dataKey="total" nameKey="type" cx="50%" cy="50%" outerRadius={75} label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {charts.giving_by_type.map((entry: any, i: number) => (
                                        <Cell key={i} fill={PIE_COLORS[entry.type] ?? CHART_COLORS[i % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => `PGK ${v.toLocaleString('en-PG', { minimumFractionDigits: 2 })}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Records Activity — Last 12 Months">
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={charts.records_monthly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={2} />
                                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: 10 }} />
                                <Line type="monotone" dataKey="baptisms"  name="Baptisms"  stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="marriages" name="Marriages" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="funerals"  name="Funerals"  stroke="#64748b" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

            </div>
        </AppLayout>
    );
}
