<?php

namespace App\Http\Controllers;

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
            'summary'    => $this->summary($now),
            'variances'  => $this->variances($now),
            'charts'     => $this->charts($now),
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
            'member_growth'  => $this->memberGrowthChart($now),
            'giving_monthly' => $this->givingMonthlyChart($now),
            'giving_weekly'  => $this->givingWeeklyChart($now),
            'giving_by_type' => $this->givingByTypeChart($now),
            'records_monthly'=> $this->recordsMonthlyChart($now),
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
}
