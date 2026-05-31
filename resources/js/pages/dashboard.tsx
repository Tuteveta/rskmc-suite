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
    UserCheck, Clock, UserPlus, Trophy, Wrench, AlertTriangle,
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
        <div className="glass rounded-xl p-5 flex flex-col gap-3">
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
        <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
            {children}
        </div>
    );
}

// ── Custom tooltip ───────────────────────────────────────────────────────────
function CurrencyTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass rounded-lg p-3 text-xs">
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
interface MemberAnalytics {
    retention_rate: number; avg_tenure_years: number;
    new_this_month: number; new_this_year: number;
    gender_split: { label: string; value: number; color: string }[];
}
interface FinancialAnalytics {
    top_givers: { name: string; total: number }[];
    unique_givers_month: number; unique_givers_year: number;
    avg_per_giver_year: number; monthly_avg_giving: number;
}
interface AssetMonitoring {
    by_condition: { label: string; count: number; value: number; color: string }[];
    by_category: { label: string; count: number; value: number }[];
    maintenance: { name: string; category: string; condition: string }[];
    total_value: number; total_count: number;
}

// ── Insight metric card ───────────────────────────────────────────────────────
function InsightCard({ icon: Icon, iconBg, label, value, sub }: {
    icon: React.ElementType; iconBg: string; label: string; value: string | number; sub?: string;
}) {
    return (
        <div className="glass rounded-xl p-4 flex items-start gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

export default function Dashboard({ summary, variances, charts, member_analytics, financial_analytics, asset_monitoring }: {
    summary: Record<string, number>;
    variances: Record<Period, PeriodVariances>;
    charts: Record<string, any[]>;
    member_analytics: MemberAnalytics;
    financial_analytics: FinancialAnalytics;
    asset_monitoring: AssetMonitoring;
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
                    <div className="flex glass rounded-lg overflow-hidden text-sm">
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
                        <div key={s.label} className="glass rounded-xl p-4">
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

                {/* ── Analytics: Quick KPI strip ──────────────────────────── */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <InsightCard icon={UserCheck}  iconBg="bg-emerald-500" label="Retention Rate"        value={`${member_analytics?.retention_rate ?? 0}%`}       sub="active members" />
                    <InsightCard icon={Clock}       iconBg="bg-violet-500"  label="Avg Member Tenure"     value={`${member_analytics?.avg_tenure_years ?? 0} yrs`}   sub="since joining" />
                    <InsightCard icon={Trophy}      iconBg="bg-amber-500"   label="Avg Giving / Member"   value={`PGK ${(financial_analytics?.avg_per_giver_year ?? 0).toLocaleString('en-PG', { minimumFractionDigits: 0 })}`} sub="this year" />
                    <InsightCard icon={Wrench}      iconBg="bg-rose-500"    label="Under Maintenance"     value={asset_monitoring?.maintenance?.length ?? 0}         sub="assets" />
                </div>

                {/* ── Analytics: Member + Financial ────────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-2">

                    {/* Member insights */}
                    <ChartCard title="Member Insights">
                        <div className="space-y-5">
                            {/* Stats row */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'New This Month', value: member_analytics?.new_this_month ?? 0, icon: UserPlus, color: 'text-blue-600' },
                                    { label: 'New This Year',  value: member_analytics?.new_this_year ?? 0,  icon: UserPlus, color: 'text-indigo-600' },
                                ].map(s => (
                                    <div key={s.label} className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-xs text-gray-500">{s.label}</p>
                                        <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Gender split */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Gender Distribution</p>
                                {(member_analytics?.gender_split ?? []).map(g => {
                                    const total = (member_analytics?.gender_split ?? []).reduce((s, i) => s + i.value, 0);
                                    const pct = total > 0 ? Math.round((g.value / total) * 100) : 0;
                                    return (
                                        <div key={g.label} className="mb-2">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>{g.label}</span>
                                                <span className="font-semibold">{g.value} <span className="text-gray-400">({pct}%)</span></span>
                                            </div>
                                            <div className="h-2 rounded-full bg-gray-100">
                                                <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: g.color }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </ChartCard>

                    {/* Top givers */}
                    <ChartCard title="Top Givers — This Year">
                        {(financial_analytics?.top_givers ?? []).length === 0 ? (
                            <p className="text-sm text-gray-400 py-6 text-center">No giving records yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {(() => {
                                    const max = Math.max(...(financial_analytics?.top_givers ?? []).map(g => g.total), 1);
                                    return (financial_analytics?.top_givers ?? []).map((g, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                                                    <span className="font-medium text-gray-800">{g.name}</span>
                                                </span>
                                                <span className="font-semibold text-gray-900 text-xs">
                                                    PGK {g.total.toLocaleString('en-PG', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-gray-100">
                                                <div className="h-1.5 rounded-full bg-blue-500 transition-all" style={{ width: `${(g.total / max) * 100}%` }} />
                                            </div>
                                        </div>
                                    ));
                                })()}
                                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
                                    <div><span className="font-semibold text-gray-700">{financial_analytics?.unique_givers_month ?? 0}</span> givers this month</div>
                                    <div><span className="font-semibold text-gray-700">{financial_analytics?.unique_givers_year ?? 0}</span> givers this year</div>
                                </div>
                            </div>
                        )}
                    </ChartCard>
                </div>

                {/* ── Analytics: Asset Monitoring ──────────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-2">

                    {/* Asset condition */}
                    <ChartCard title="Asset Condition Overview">
                        <div className="space-y-4">
                            {(asset_monitoring?.by_condition ?? []).length === 0 ? (
                                <p className="text-sm text-gray-400 py-6 text-center">No assets registered.</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(asset_monitoring?.by_condition ?? []).map(c => (
                                            <div key={c.label} className="rounded-lg border p-3 flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: c.color }} />
                                                <div>
                                                    <p className="text-xs text-gray-500">{c.label}</p>
                                                    <p className="text-lg font-bold text-gray-900">{c.count}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-xs text-gray-500 mb-1.5">Value distribution by condition</p>
                                        <ResponsiveContainer width="100%" height={120}>
                                            <BarChart data={asset_monitoring?.by_condition ?? []} layout="vertical" margin={{ left: 60, right: 40, top: 4, bottom: 4 }}>
                                                <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={v => `K${(v/1000).toFixed(0)}k`} />
                                                <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={58} />
                                                <Tooltip formatter={(v: number) => `PGK ${v.toLocaleString('en-PG', { minimumFractionDigits: 0 })}`} />
                                                <Bar dataKey="value" name="Value" radius={[0, 4, 4, 0]}>
                                                    {(asset_monitoring?.by_condition ?? []).map((c, i) => (
                                                        <Cell key={i} fill={c.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
                            )}
                        </div>
                    </ChartCard>

                    {/* Asset by category + maintenance alerts */}
                    <div className="space-y-4">
                        <ChartCard title="Assets by Category">
                            {(asset_monitoring?.by_category ?? []).length === 0 ? (
                                <p className="text-sm text-gray-400 py-4 text-center">No assets registered.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={160}>
                                    <BarChart data={asset_monitoring?.by_category ?? []} layout="vertical" margin={{ left: 90, right: 50, top: 4, bottom: 4 }}>
                                        <XAxis type="number" tick={{ fontSize: 9 }} />
                                        <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={88} />
                                        <Tooltip formatter={(v: number) => [`${v} assets`, 'Count']} />
                                        <Bar dataKey="count" name="Assets" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </ChartCard>

                        <ChartCard title="Maintenance Alerts">
                            {(asset_monitoring?.maintenance ?? []).length === 0 ? (
                                <div className="flex items-center gap-2 text-sm text-emerald-600 py-2">
                                    <UserCheck className="h-4 w-4" />
                                    All assets are operational.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {(asset_monitoring?.maintenance ?? []).map((a, i) => (
                                        <div key={i} className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-gray-800 truncate">{a.name}</p>
                                                <p className="text-xs text-gray-400">{a.category} · {a.condition}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ChartCard>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
