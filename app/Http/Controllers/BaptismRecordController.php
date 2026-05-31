<?php

namespace App\Http\Controllers;

use App\Models\BaptismRecord;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BaptismRecordController extends Controller
{
    public function index()
    {
        return Inertia::render('baptism-records/index', [
            'records' => BaptismRecord::with('member')->orderByDesc('date_of_baptism')->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('baptism-records/create', [
            'members'       => Member::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'member_number']),
            'baptism_types' => \App\Models\BaptismRecord::baptismTypes(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'member_id'        => 'nullable|exists:members,id',
            'first_name'       => 'required|string|max:100',
            'last_name'        => 'required|string|max:100',
            'date_of_birth'    => 'nullable|date',
            'date_of_baptism'  => 'required|date',
            'baptism_type'     => 'required|in:infant,immersion',
            'place_of_baptism' => 'nullable|string|max:150',
            'officiant'        => 'required|string|max:150',
            'father_name'      => 'nullable|string|max:150',
            'mother_name'      => 'nullable|string|max:150',
            'witnesses'        => 'nullable|string',
            'notes'            => 'nullable|string',
        ]);

        BaptismRecord::create($request->all());

        return redirect()->route('baptism-records.index')->with('success', 'Baptism record added.');
    }

    public function show(BaptismRecord $baptismRecord)
    {
        return Inertia::render('baptism-records/show', [
            'record' => $baptismRecord->load('member'),
        ]);
    }

    public function edit(BaptismRecord $baptismRecord)
    {
        return Inertia::render('baptism-records/edit', [
            'record'        => $baptismRecord,
            'members'       => Member::orderBy('last_name')->get(['id', 'first_name', 'last_name', 'member_number']),
            'baptism_types' => \App\Models\BaptismRecord::baptismTypes(),
        ]);
    }

    public function update(Request $request, BaptismRecord $baptismRecord)
    {
        $request->validate([
            'member_id'        => 'nullable|exists:members,id',
            'first_name'       => 'required|string|max:100',
            'last_name'        => 'required|string|max:100',
            'date_of_birth'    => 'nullable|date',
            'date_of_baptism'  => 'required|date',
            'baptism_type'     => 'required|in:infant,immersion',
            'place_of_baptism' => 'nullable|string|max:150',
            'officiant'        => 'required|string|max:150',
            'father_name'      => 'nullable|string|max:150',
            'mother_name'      => 'nullable|string|max:150',
            'witnesses'        => 'nullable|string',
            'notes'            => 'nullable|string',
        ]);

        $baptismRecord->update($request->all());

        return redirect()->route('baptism-records.index')->with('success', 'Baptism record updated.');
    }

    public function destroy(BaptismRecord $baptismRecord)
    {
        $baptismRecord->delete();
        return redirect()->route('baptism-records.index')->with('success', 'Record deleted.');
    }
}
