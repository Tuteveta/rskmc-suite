<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('members/index', [
            'members' => Member::orderBy('last_name')->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('members/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'    => 'required|string|max:100',
            'last_name'     => 'required|string|max:100',
            'gender'        => 'required|in:male,female',
            'date_of_birth' => 'nullable|date',
            'phone'         => 'nullable|string|max:30',
            'email'         => 'nullable|email|max:150',
            'address'       => 'nullable|string',
            'join_date'     => 'nullable|date',
            'status'        => 'required|in:active,inactive,dedication,new_convert,follow_up',
            'notes'         => 'nullable|string',
        ]);

        $data['member_number'] = 'M' . str_pad((Member::max('id') ?? 0) + 1, 5, '0', STR_PAD_LEFT);

        Member::create($data);

        return redirect()->route('members.index')->with('success', 'Member added successfully.');
    }

    public function show(Member $member)
    {
        return Inertia::render('members/show', [
            'member' => $member->load('baptismRecords'),
        ]);
    }

    public function edit(Member $member)
    {
        return Inertia::render('members/edit', ['member' => $member]);
    }

    public function update(Request $request, Member $member)
    {
        $data = $request->validate([
            'first_name'    => 'required|string|max:100',
            'last_name'     => 'required|string|max:100',
            'gender'        => 'required|in:male,female',
            'date_of_birth' => 'nullable|date',
            'phone'         => 'nullable|string|max:30',
            'email'         => 'nullable|email|max:150',
            'address'       => 'nullable|string',
            'join_date'     => 'nullable|date',
            'status'        => 'required|in:active,inactive,dedication,new_convert,follow_up',
            'notes'         => 'nullable|string',
        ]);

        $member->update($data);

        return redirect()->route('members.index')->with('success', 'Member updated successfully.');
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return redirect()->route('members.index')->with('success', 'Member deleted.');
    }
}
