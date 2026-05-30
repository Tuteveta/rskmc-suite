<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        return Inertia::render('audit-logs/index', [
            'logs' => AuditLog::with('user')->latest()->paginate(30)
                ->through(fn ($log) => [
                    'id'          => $log->id,
                    'action'      => $log->action,
                    'model_short' => $log->model_short_name,
                    'model_label' => $log->model_label,
                    'user'        => $log->user?->name ?? 'System',
                    'ip_address'  => $log->ip_address,
                    'created_at'  => $log->created_at->format('d/m/Y H:i:s'),
                ]),
        ]);
    }
}
