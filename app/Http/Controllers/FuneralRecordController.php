<?php

namespace App\Http\Controllers;

use App\Models\FuneralRecord;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FuneralRecordController extends Controller
{
    public function index()
    {
        return Inertia::render('funeral-records/index', [
            'records' => FuneralRecord::with('member')->orderByDesc('date_of_death')->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('funeral-records/create', [
            'members' => Member::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'member_number']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'date_of_birth'   => 'nullable|date',
            'date_of_death'   => 'required|date',
            'date_of_funeral' => 'nullable|date|after_or_equal:date_of_death',
            'place_of_burial' => 'nullable|string|max:150',
            'officiant'       => 'nullable|string|max:150',
            'cause_of_death'  => 'nullable|string|max:150',
            'member_id'       => 'nullable|exists:members,id',
            'notes'           => 'nullable|string',
        ]);

        $record = FuneralRecord::create($request->all());

        if ($request->filled('member_id')) {
            Member::find($request->member_id)?->update(['status' => 'inactive']);
        }

        return redirect()->route('funeral-records.index')->with('success', 'Funeral record added.');
    }

    public function edit(FuneralRecord $funeralRecord)
    {
        return Inertia::render('funeral-records/edit', [
            'record'  => $funeralRecord,
            'members' => Member::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'member_number']),
        ]);
    }

    public function update(Request $request, FuneralRecord $funeralRecord)
    {
        $request->validate([
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'date_of_birth'   => 'nullable|date',
            'date_of_death'   => 'required|date',
            'date_of_funeral' => 'nullable|date',
            'place_of_burial' => 'nullable|string|max:150',
            'officiant'       => 'nullable|string|max:150',
            'cause_of_death'  => 'nullable|string|max:150',
            'member_id'       => 'nullable|exists:members,id',
            'notes'           => 'nullable|string',
        ]);

        $funeralRecord->update($request->all());

        return redirect()->route('funeral-records.index')->with('success', 'Record updated.');
    }

    public function destroy(FuneralRecord $funeralRecord)
    {
        $funeralRecord->delete();
        return redirect()->route('funeral-records.index')->with('success', 'Record deleted.');
    }

    public function show(FuneralRecord $funeralRecord) {}
}
