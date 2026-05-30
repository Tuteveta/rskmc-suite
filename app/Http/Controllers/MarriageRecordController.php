<?php

namespace App\Http\Controllers;

use App\Models\MarriageRecord;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarriageRecordController extends Controller
{
    public function index()
    {
        return Inertia::render('marriage-records/index', [
            'records' => MarriageRecord::with('husband', 'wife')->orderByDesc('date_of_marriage')->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('marriage-records/create', [
            'members' => Member::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'member_number']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'husband_first_name' => 'required|string|max:100',
            'husband_last_name'  => 'required|string|max:100',
            'wife_first_name'    => 'required|string|max:100',
            'wife_last_name'     => 'required|string|max:100',
            'date_of_marriage'   => 'required|date',
            'place_of_marriage'  => 'nullable|string|max:150',
            'officiant'          => 'required|string|max:150',
            'witnesses'          => 'nullable|string',
            'license_number'     => 'nullable|string|max:100',
            'husband_member_id'  => 'nullable|exists:members,id',
            'wife_member_id'     => 'nullable|exists:members,id',
            'notes'              => 'nullable|string',
        ]);

        MarriageRecord::create($request->all());

        return redirect()->route('marriage-records.index')->with('success', 'Marriage record added.');
    }

    public function edit(MarriageRecord $marriageRecord)
    {
        return Inertia::render('marriage-records/edit', [
            'record'  => $marriageRecord,
            'members' => Member::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'member_number']),
        ]);
    }

    public function update(Request $request, MarriageRecord $marriageRecord)
    {
        $request->validate([
            'husband_first_name' => 'required|string|max:100',
            'husband_last_name'  => 'required|string|max:100',
            'wife_first_name'    => 'required|string|max:100',
            'wife_last_name'     => 'required|string|max:100',
            'date_of_marriage'   => 'required|date',
            'place_of_marriage'  => 'nullable|string|max:150',
            'officiant'          => 'required|string|max:150',
            'witnesses'          => 'nullable|string',
            'license_number'     => 'nullable|string|max:100',
            'husband_member_id'  => 'nullable|exists:members,id',
            'wife_member_id'     => 'nullable|exists:members,id',
            'notes'              => 'nullable|string',
        ]);

        $marriageRecord->update($request->all());

        return redirect()->route('marriage-records.index')->with('success', 'Record updated.');
    }

    public function destroy(MarriageRecord $marriageRecord)
    {
        $marriageRecord->delete();
        return redirect()->route('marriage-records.index')->with('success', 'Record deleted.');
    }

    public function show(MarriageRecord $marriageRecord) {}
}
