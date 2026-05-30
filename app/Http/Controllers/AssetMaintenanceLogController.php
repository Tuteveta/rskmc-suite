<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetMaintenanceLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetMaintenanceLogController extends Controller
{
    public function index(Asset $asset)
    {
        return Inertia::render('assets/maintenance/index', [
            'asset' => $asset,
            'logs'  => $asset->maintenanceLogs()->orderByDesc('service_date')->paginate(20),
            'types' => AssetMaintenanceLog::types(),
        ]);
    }

    public function create(Asset $asset)
    {
        return Inertia::render('assets/maintenance/create', [
            'asset' => $asset,
            'types' => AssetMaintenanceLog::types(),
        ]);
    }

    public function store(Request $request, Asset $asset)
    {
        $request->validate([
            'service_date'  => 'required|date',
            'type'          => 'required|in:service,repair,inspection,upgrade,other',
            'description'   => 'required|string|max:255',
            'cost'          => 'nullable|numeric|min:0',
            'performed_by'  => 'nullable|string|max:150',
            'next_due_date' => 'nullable|date|after:service_date',
            'notes'         => 'nullable|string',
        ]);

        $asset->maintenanceLogs()->create($request->all());

        if ($request->filled('next_due_date') || $request->type === 'repair') {
            $asset->update(['status' => 'active']);
        }

        return redirect()->route('assets.maintenance.index', $asset)
            ->with('success', 'Maintenance log added.');
    }

    public function edit(Asset $asset, AssetMaintenanceLog $log)
    {
        return Inertia::render('assets/maintenance/edit', [
            'asset' => $asset, 'log' => $log, 'types' => AssetMaintenanceLog::types(),
        ]);
    }

    public function update(Request $request, Asset $asset, AssetMaintenanceLog $log)
    {
        $request->validate([
            'service_date'  => 'required|date',
            'type'          => 'required|in:service,repair,inspection,upgrade,other',
            'description'   => 'required|string|max:255',
            'cost'          => 'nullable|numeric|min:0',
            'performed_by'  => 'nullable|string|max:150',
            'next_due_date' => 'nullable|date',
            'notes'         => 'nullable|string',
        ]);

        $log->update($request->all());

        return redirect()->route('assets.maintenance.index', $asset)
            ->with('success', 'Log updated.');
    }

    public function destroy(Asset $asset, AssetMaintenanceLog $log)
    {
        $log->delete();
        return redirect()->route('assets.maintenance.index', $asset)
            ->with('success', 'Log deleted.');
    }

    public function show(string $id) {}
}
