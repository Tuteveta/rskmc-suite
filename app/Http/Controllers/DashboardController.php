<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\BaptismRecord;
use App\Models\FuneralRecord;
use App\Models\MarriageRecord;
use App\Models\Member;
use App\Models\Tithe;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();

        return Inertia::render('dashboard', [
            'summary'             => $this->summary($now),
            'variances'           => $this->variances($now),
            'charts'              => $this->charts($now),
            'member_analytics'    => $this->memberAnalyticsData($now),
            'financial_analytics' => $this->financialAnalyticsData($now),
            'asset_monitoring'    => $this->assetMonitoringData(),
        ]);
    }

    // ── Summary counts ────────────────────────────────────────────────────

    private function summary(Carbon $now): array
    {
        return [
            'total_members'    => Member::count(),
            'active_members'   => Member::where('status', 'active')->count(),
            'total_assets'     => \App\Models\Asset::count(),
            'baptism_records'  => BaptismRecord::count(),
            'marriage_records' => MarriageRecord::count(),
            'funeral_records'  => FuneralRecord::count(),
            'tithes_month'     => (float) Tithe::whereMonth('giving_date', $now->month)->whereYear('giving_date', $now->year)->sum('amount'),
            'tithes_year'      => (float) Tithe::whereYear('giving_date', $now->year)->sum('amount'),
        ];
    }

    // ── Variance helpers ──────────────────────────────────────────────────

    private function variances(Carbon $now): array
    {
        return [
            'week'  => $this->periodVariances($now, 'week'),
            'month' => $this->periodVariances($now, 'month'),
            'year'  => $this->periodVariances($now, 'year'),
        ];
    }

    private function periodVariances(Carbon $now, string $period): array
    {
        [$curStart, $curEnd, $prevStart, $prevEnd] = match ($period) {
            'week'  => [
                $now->copy()->startOfWeek(),  $now->copy()->endOfWeek(),
                $now->copy()->subWeek()->startOfWeek(), $now->copy()->subWeek()->endOfWeek(),
            ],
            'month' => [
                $now->copy()->startOfMonth(), $now->copy()->endOfMonth(),
                $now->copy()->subMonth()->startOfMonth(), $now->copy()->subMonth()->endOfMonth(),
            ],
            'year'  => [
                $now->copy()->startOfYear(), $now->copy()->endOfYear(),
                $now->copy()->subYear()->startOfYear(), $now->copy()->subYear()->endOfYear(),
            ],
        };

        $newMembersCur  = Member::whereBetween('join_date', [$curStart, $curEnd])->count();
        $newMembersPrev = Member::whereBetween('join_date', [$prevStart, $prevEnd])->count();

        $baptismsCur  = BaptismRecord::whereBetween('date_of_baptism', [$curStart, $curEnd])->count();
        $baptismsPrev = BaptismRecord::whereBetween('date_of_baptism', [$prevStart, $prevEnd])->count();

        $marriagesCur  = MarriageRecord::whereBetween('date_of_marriage', [$curStart, $curEnd])->count();
        $marriagesPrev = MarriageRecord::whereBetween('date_of_marriage', [$prevStart, $prevEnd])->count();

        $funeralsCur  = FuneralRecord::whereBetween('date_of_death', [$curStart, $curEnd])->count();
        $funeralsPrev = FuneralRecord::whereBetween('date_of_death', [$prevStart, $prevEnd])->count();

        $tithesCur  = (float) Tithe::whereBetween('giving_date', [$curStart, $curEnd])->sum('amount');
        $tithesPrev = (float) Tithe::whereBetween('giving_date', [$prevStart, $prevEnd])->sum('amount');

        return [
            'new_members' => $this->variance($newMembersCur, $newMembersPrev),
            'baptisms'    => $this->variance($baptismsCur, $baptismsPrev),
            'marriages'   => $this->variance($marriagesCur, $marriagesPrev),
            'funerals'    => $this->variance($funeralsCur, $funeralsPrev),
            'tithes'      => $this->variance($tithesCur, $tithesPrev),
        ];
    }

    private function variance(float $current, float $previous): array
    {
        $diff    = $current - $previous;
        $pct     = $previous > 0 ? round(($diff / $previous) * 100, 1) : ($current > 0 ? 100.0 : 0.0);
        $trend   = $diff > 0 ? 'up' : ($diff < 0 ? 'down' : 'neutral');
        return [
            'current'  => $current,
            'previous' => $previous,
            'diff'     => $diff,
            'pct'      => abs($pct),
            'trend'    => $trend,
        ];
    }

    // ── Charts data ───────────────────────────────────────────────────────

    private function charts(Carbon $now): array
    {
        return [
            'member_growth'   => $this->memberGrowthChart($now),
            'giving_monthly'  => $this->givingMonthlyChart($now),
            'giving_weekly'   => $this->givingWeeklyChart($now),
            'giving_by_type'  => $this->givingByTypeChart($now),
            'records_monthly' => $this->recordsMonthlyChart($now),
            'age_pyramid'     => $this->agePyramidChart($now),
            'giving_heatmap'  => $this->givingHeatmapChart($now),
            'member_status'   => $this->memberStatusChart(),
            'giving_race'     => $this->givingRaceChart($now),
        ];
    }

    private function memberGrowthChart(Carbon $now): array
    {
        $data = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $data[] = [
                'month'       => $month->format('M Y'),
                'new_members' => Member::whereYear('join_date', $month->year)->whereMonth('join_date', $month->month)->count(),
                'total'       => Member::where('join_date', '<=', $month->endOfMonth())->count(),
            ];
        }
        return $data;
    }

    private function givingMonthlyChart(Carbon $now): array
    {
        $data = [];
        for ($i = 11; $i >= 0; $i--) {
            $month  = $now->copy()->subMonths($i);
            $cur    = (float) Tithe::whereYear('giving_date', $month->year)->whereMonth('giving_date', $month->month)->sum('amount');
            $prev   = (float) Tithe::whereYear('giving_date', $month->copy()->subYear()->year)->whereMonth('giving_date', $month->month)->sum('amount');
            $data[] = [
                'month'       => $month->format('M Y'),
                'amount'      => $cur,
                'prev_year'   => $prev,
            ];
        }
        return $data;
    }

    private function givingWeeklyChart(Carbon $now): array
    {
        $data = [];
        for ($i = 7; $i >= 0; $i--) {
            $week  = $now->copy()->subWeeks($i);
            $start = $week->copy()->startOfWeek();
            $end   = $week->copy()->endOfWeek();
            $data[] = [
                'week'   => 'W' . $week->weekOfYear . ' ' . $week->format('M'),
                'amount' => (float) Tithe::whereBetween('giving_date', [$start, $end])->sum('amount'),
            ];
        }
        return $data;
    }

    private function givingByTypeChart(Carbon $now): array
    {
        return Tithe::whereYear('giving_date', $now->year)
            ->select('giving_type', DB::raw('SUM(amount) as total'))
            ->groupBy('giving_type')
            ->get()
            ->map(fn ($r) => [
                'type'  => \App\Models\Tithe::givingTypes()[$r->giving_type] ?? $r->giving_type,
                'total' => (float) $r->total,
            ])
            ->toArray();
    }

    private function recordsMonthlyChart(Carbon $now): array
    {
        $data = [];
        for ($i = 11; $i >= 0; $i--) {
            $month  = $now->copy()->subMonths($i);
            $data[] = [
                'month'     => $month->format('M Y'),
                'baptisms'  => BaptismRecord::whereYear('date_of_baptism', $month->year)->whereMonth('date_of_baptism', $month->month)->count(),
                'marriages' => MarriageRecord::whereYear('date_of_marriage', $month->year)->whereMonth('date_of_marriage', $month->month)->count(),
                'funerals'  => FuneralRecord::whereYear('date_of_death', $month->year)->whereMonth('date_of_death', $month->month)->count(),
            ];
        }
        return $data;
    }

    private function agePyramidChart(Carbon $now): array
    {
        $groups = [
            ['label' => '0–9',   'min' => 0,  'max' => 9],
            ['label' => '10–19', 'min' => 10, 'max' => 19],
            ['label' => '20–29', 'min' => 20, 'max' => 29],
            ['label' => '30–39', 'min' => 30, 'max' => 39],
            ['label' => '40–49', 'min' => 40, 'max' => 49],
            ['label' => '50–59', 'min' => 50, 'max' => 59],
            ['label' => '60–69', 'min' => 60, 'max' => 69],
            ['label' => '70+',   'min' => 70, 'max' => 120],
        ];

        return array_map(function ($g) use ($now) {
            $maxDob = $now->copy()->subYears($g['min']);
            $minDob = $now->copy()->subYears($g['max'] + 1)->addDay();
            $q = fn ($gender) => Member::where('gender', $gender)
                ->whereNotNull('date_of_birth')
                ->whereBetween('date_of_birth', [$minDob, $maxDob])
                ->count();
            return ['age_group' => $g['label'], 'male' => $q('male'), 'female' => $q('female')];
        }, $groups);
    }

    private function givingHeatmapChart(Carbon $now): array
    {
        $start = $now->copy()->subYear()->startOfDay();
        return Tithe::where('giving_date', '>=', $start)
            ->select(DB::raw('DATE(giving_date) as date'), DB::raw('SUM(amount) as amount'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($r) => ['date' => $r->date, 'amount' => (float) $r->amount])
            ->toArray();
    }

    private function memberStatusChart(): array
    {
        return Member::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn ($r) => ['label' => ucfirst($r->status), 'value' => (int) $r->count])
            ->toArray();
    }

    private function memberAnalyticsData(Carbon $now): array
    {
        $total  = Member::count();
        $active = Member::where('status', 'active')->count();
        $male   = Member::where('gender', 'male')->count();
        $female = Member::where('gender', 'female')->count();

        $avgTenure = Member::whereNotNull('join_date')->get()
            ->avg(fn ($m) => $m->join_date->diffInYears($now));

        $newThisMonth = Member::whereYear('join_date', $now->year)
            ->whereMonth('join_date', $now->month)->count();

        $newThisYear = Member::whereYear('join_date', $now->year)->count();

        return [
            'retention_rate'   => $total > 0 ? round(($active / $total) * 100, 1) : 0,
            'avg_tenure_years' => round($avgTenure ?? 0, 1),
            'new_this_month'   => $newThisMonth,
            'new_this_year'    => $newThisYear,
            'gender_split'     => [
                ['label' => 'Male',   'value' => $male,   'color' => '#3b82f6'],
                ['label' => 'Female', 'value' => $female, 'color' => '#ec4899'],
            ],
        ];
    }

    private function financialAnalyticsData(Carbon $now): array
    {
        $topGivers = Tithe::whereYear('giving_date', $now->year)
            ->whereNotNull('member_id')
            ->select('member_id', DB::raw('SUM(amount) as total'))
            ->groupBy('member_id')
            ->orderByDesc('total')
            ->limit(5)
            ->with('member:id,first_name,last_name')
            ->get()
            ->map(fn ($r) => [
                'name'  => $r->member ? "{$r->member->first_name} {$r->member->last_name}" : 'Anonymous',
                'total' => (float) $r->total,
            ])
            ->toArray();

        $uniqueGiversMonth = Tithe::whereMonth('giving_date', $now->month)
            ->whereYear('giving_date', $now->year)
            ->whereNotNull('member_id')
            ->distinct('member_id')->count('member_id');

        $uniqueGiversYear = Tithe::whereYear('giving_date', $now->year)
            ->whereNotNull('member_id')
            ->distinct('member_id')->count('member_id');

        $yearTotal   = (float) Tithe::whereYear('giving_date', $now->year)->sum('amount');
        $avgPerGiver = $uniqueGiversYear > 0 ? round($yearTotal / $uniqueGiversYear, 2) : 0;

        $monthlyAvg = collect(range(1, 12))->map(fn ($m) =>
            (float) Tithe::whereYear('giving_date', $now->year)->whereMonth('giving_date', $m)->sum('amount')
        )->filter()->avg() ?? 0;

        return [
            'top_givers'            => $topGivers,
            'unique_givers_month'   => $uniqueGiversMonth,
            'unique_givers_year'    => $uniqueGiversYear,
            'avg_per_giver_year'    => $avgPerGiver,
            'monthly_avg_giving'    => round($monthlyAvg, 2),
        ];
    }

    private function assetMonitoringData(): array
    {
        $conditionColors = [
            'excellent' => '#10b981', 'good' => '#3b82f6',
            'fair' => '#f59e0b', 'poor' => '#ef4444',
        ];
        $conditionLabels = [
            'excellent' => 'Excellent', 'good' => 'Good',
            'fair' => 'Fair', 'poor' => 'Poor',
        ];

        $byCondition = Asset::select('condition', DB::raw('count(*) as count'), DB::raw('SUM(acquisition_cost) as value'))
            ->groupBy('condition')->get()
            ->map(fn ($r) => [
                'label' => $conditionLabels[$r->condition] ?? ucfirst($r->condition),
                'count' => (int) $r->count,
                'value' => (float) $r->value,
                'color' => $conditionColors[$r->condition] ?? '#94a3b8',
            ])->toArray();

        $byCategory = Asset::select('category', DB::raw('count(*) as count'), DB::raw('SUM(acquisition_cost) as value'))
            ->groupBy('category')->orderByDesc('value')->get()
            ->map(fn ($r) => [
                'label' => Asset::categories()[$r->category] ?? ucfirst($r->category),
                'count' => (int) $r->count,
                'value' => (float) $r->value,
            ])->toArray();

        $maintenance = Asset::where('status', 'maintenance')
            ->select('id', 'name', 'category', 'condition')->get()
            ->map(fn ($a) => [
                'name'      => $a->name,
                'category'  => Asset::categories()[$a->category] ?? $a->category,
                'condition' => $a->condition,
            ])->toArray();

        return [
            'by_condition'   => $byCondition,
            'by_category'    => $byCategory,
            'maintenance'    => $maintenance,
            'total_value'    => (float) Asset::sum('acquisition_cost'),
            'total_count'    => Asset::count(),
        ];
    }

    private function givingRaceChart(Carbon $now): array
    {
        $types = Tithe::givingTypes();
        $data  = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $frame = ['month' => $month->format('M Y')];
            foreach ($types as $key => $label) {
                $frame[$label] = (float) Tithe::where('giving_type', $key)
                    ->where('giving_date', '<=', $month->copy()->endOfMonth())
                    ->sum('amount');
            }
            $data[] = $frame;
        }
        return $data;
    }
}
