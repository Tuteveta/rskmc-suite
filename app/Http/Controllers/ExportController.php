<?php

namespace App\Http\Controllers;

use App\Exports\AssetsExport;
use App\Exports\BaptismRecordsExport;
use App\Exports\MembersExport;
use App\Models\Asset;
use App\Models\BaptismRecord;
use App\Models\Member;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    // ── Members ──────────────────────────────────────────────────────────

    public function membersExcel(Request $request)
    {
        $filters = $request->only(['status', 'gender', 'join_date_from', 'join_date_to']);
        $suffix  = now()->format('Ymd');
        return Excel::download(new MembersExport($filters), "members-{$suffix}.xlsx");
    }

    public function membersPdf(Request $request)
    {
        $filters  = $request->only(['status', 'gender', 'join_date_from', 'join_date_to']);
        $export   = new MembersExport($filters);
        $members  = $export->query()->get();
        $applied  = $this->describeFilters($filters, [
            'status'         => 'Status',
            'gender'         => 'Gender',
            'join_date_from' => 'Joined From',
            'join_date_to'   => 'Joined To',
        ]);
        $pdf = Pdf::loadView('pdf.members', compact('members', 'applied'))->setPaper('a4', 'landscape');
        return $pdf->download('members-' . now()->format('Ymd') . '.pdf');
    }

    // ── Assets ───────────────────────────────────────────────────────────

    public function assetsExcel(Request $request)
    {
        $filters = $request->only(['category', 'status', 'condition']);
        return Excel::download(new AssetsExport($filters), 'assets-' . now()->format('Ymd') . '.xlsx');
    }

    public function assetsPdf(Request $request)
    {
        $filters    = $request->only(['category', 'status', 'condition']);
        $export     = new AssetsExport($filters);
        $assets     = $export->query()->get();
        $categories = Asset::categories();
        $applied    = $this->describeFilters($filters, [
            'category'  => 'Category',
            'status'    => 'Status',
            'condition' => 'Condition',
        ]);
        $pdf = Pdf::loadView('pdf.assets', compact('assets', 'categories', 'applied'))->setPaper('a4', 'landscape');
        return $pdf->download('assets-' . now()->format('Ymd') . '.pdf');
    }

    // ── Baptism Records ──────────────────────────────────────────────────

    public function baptismRecordsExcel(Request $request)
    {
        $filters = $request->only(['date_from', 'date_to', 'officiant', 'place']);
        return Excel::download(new BaptismRecordsExport($filters), 'baptism-records-' . now()->format('Ymd') . '.xlsx');
    }

    public function baptismRecordsPdf(Request $request)
    {
        $filters = $request->only(['date_from', 'date_to', 'officiant', 'place']);
        $export  = new BaptismRecordsExport($filters);
        $records = $export->query()->get();
        $applied = $this->describeFilters($filters, [
            'date_from' => 'Baptism From',
            'date_to'   => 'Baptism To',
            'officiant' => 'Officiant',
            'place'     => 'Place',
        ]);
        $pdf = Pdf::loadView('pdf.baptism-records', compact('records', 'applied'))->setPaper('a4', 'landscape');
        return $pdf->download('baptism-records-' . now()->format('Ymd') . '.pdf');
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private function describeFilters(array $filters, array $labels): array
    {
        $result = [];
        foreach ($filters as $key => $value) {
            if ($value !== null && $value !== '') {
                $result[] = ($labels[$key] ?? $key) . ': ' . $value;
            }
        }
        return $result;
    }
}
