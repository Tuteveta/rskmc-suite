<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetController extends Controller
{
    public function index()
    {
        return Inertia::render('assets/index', [
            'assets'     => Asset::orderBy('name')->paginate(20),
            'categories' => Asset::categories(),
        ]);
    }

    public function create()
    {
        return Inertia::render('assets/create', [
            'categories' => Asset::categories(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:150',
            'category'         => 'required|in:vehicle,musical_equipment,property,furniture,electronics,other',
            'description'      => 'nullable|string',
            'serial_number'    => 'nullable|string|max:100',
            'brand'            => 'nullable|string|max:100',
            'acquisition_date' => 'nullable|date',
            'acquisition_cost' => 'nullable|numeric|min:0',
            'condition'        => 'required|in:excellent,good,fair,poor',
            'location'         => 'nullable|string|max:150',
            'status'           => 'required|in:active,maintenance,retired',
            'notes'            => 'nullable|string',
        ]);

        Asset::create($request->all());

        return redirect()->route('assets.index')->with('success', 'Asset added successfully.');
    }

    public function show(Asset $asset)
    {
        return Inertia::render('assets/show', ['asset' => $asset]);
    }

    public function edit(Asset $asset)
    {
        return Inertia::render('assets/edit', [
            'asset'      => $asset,
            'categories' => Asset::categories(),
        ]);
    }

    public function update(Request $request, Asset $asset)
    {
        $request->validate([
            'name'             => 'required|string|max:150',
            'category'         => 'required|in:vehicle,musical_equipment,property,furniture,electronics,other',
            'description'      => 'nullable|string',
            'serial_number'    => 'nullable|string|max:100',
            'brand'            => 'nullable|string|max:100',
            'acquisition_date' => 'nullable|date',
            'acquisition_cost' => 'nullable|numeric|min:0',
            'condition'        => 'required|in:excellent,good,fair,poor',
            'location'         => 'nullable|string|max:150',
            'status'           => 'required|in:active,maintenance,retired',
            'notes'            => 'nullable|string',
        ]);

        $asset->update($request->all());

        return redirect()->route('assets.index')->with('success', 'Asset updated successfully.');
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();
        return redirect()->route('assets.index')->with('success', 'Asset deleted.');
    }
}
