<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Tithe;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TitheController extends Controller
{
    public function index()
    {
        return Inertia::render('tithes/index', [
            'tithes'      => Tithe::with('member', 'recorder')->orderByDesc('giving_date')->paginate(25),
            'giving_types'=> Tithe::givingTypes(),
            'totals'      => [
                'month' => Tithe::whereMonth('giving_date', now()->month)->whereYear('giving_date', now()->year)->sum('amount'),
                'year'  => Tithe::whereYear('giving_date', now()->year)->sum('amount'),
                'all'   => Tithe::sum('amount'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('tithes/create', [
            'members'      => Member::where('status', 'active')->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'member_number']),
            'giving_types' => Tithe::givingTypes(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'member_id'    => 'nullable|exists:members,id',
            'giving_type'  => 'required|in:tithe,offering,special,building_fund,mission',
            'amount'       => 'required|numeric|min:0.01',
            'giving_date'  => 'required|date',
            'service_type' => 'nullable|string|max:100',
            'notes'        => 'nullable|string',
        ]);

        $receipt = 'RCP-' . strtoupper(now()->format('ymd')) . '-' . str_pad(Tithe::count() + 1, 4, '0', STR_PAD_LEFT);

        Tithe::create(array_merge($request->all(), [
            'receipt_number' => $receipt,
            'recorded_by'    => auth()->id(),
        ]));

        return redirect()->route('tithes.index')->with('success', 'Giving record added.');
    }

    public function edit(Tithe $tithe)
    {
        return Inertia::render('tithes/edit', [
            'tithe'        => $tithe,
            'members'      => Member::where('status', 'active')->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'member_number']),
            'giving_types' => Tithe::givingTypes(),
        ]);
    }

    public function update(Request $request, Tithe $tithe)
    {
        $request->validate([
            'member_id'    => 'nullable|exists:members,id',
            'giving_type'  => 'required|in:tithe,offering,special,building_fund,mission',
            'amount'       => 'required|numeric|min:0.01',
            'giving_date'  => 'required|date',
            'service_type' => 'nullable|string|max:100',
            'notes'        => 'nullable|string',
        ]);

        $tithe->update($request->only('member_id', 'giving_type', 'amount', 'giving_date', 'service_type', 'notes'));

        return redirect()->route('tithes.index')->with('success', 'Record updated.');
    }

    public function destroy(Tithe $tithe)
    {
        $tithe->delete();
        return redirect()->route('tithes.index')->with('success', 'Record deleted.');
    }

    public function show(Tithe $tithe) {}

    public function givingStatement(Request $request)
    {
        $request->validate(['member_id' => 'required|exists:members,id', 'year' => 'required|integer']);
        $member  = Member::findOrFail($request->member_id);
        $tithes  = Tithe::where('member_id', $member->id)->whereYear('giving_date', $request->year)->orderBy('giving_date')->get();
        $total   = $tithes->sum('amount');
        $year    = $request->year;
        $pdf     = Pdf::loadView('pdf.giving-statement', compact('member', 'tithes', 'total', 'year'))->setPaper('a4');
        return $pdf->download("giving-statement-{$member->last_name}-{$year}.pdf");
    }
}
