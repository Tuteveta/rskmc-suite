<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function ($model) {
            AuditLog::create([
                'user_id'     => Auth::id(),
                'action'      => 'created',
                'model_type'  => get_class($model),
                'model_id'    => $model->id,
                'model_label' => $model->auditLabel(),
                'new_values'  => $model->getAttributes(),
                'ip_address'  => Request::ip(),
            ]);
        });

        static::updated(function ($model) {
            AuditLog::create([
                'user_id'     => Auth::id(),
                'action'      => 'updated',
                'model_type'  => get_class($model),
                'model_id'    => $model->id,
                'model_label' => $model->auditLabel(),
                'old_values'  => $model->getOriginal(),
                'new_values'  => $model->getChanges(),
                'ip_address'  => Request::ip(),
            ]);
        });

        static::deleted(function ($model) {
            AuditLog::create([
                'user_id'     => Auth::id(),
                'action'      => 'deleted',
                'model_type'  => get_class($model),
                'model_id'    => $model->id,
                'model_label' => $model->auditLabel(),
                'old_values'  => $model->getAttributes(),
                'ip_address'  => Request::ip(),
            ]);
        });
    }

    public function auditLabel(): string
    {
        return method_exists($this, 'getFullNameAttribute')
            ? $this->full_name
            : ($this->name ?? $this->title ?? (string) $this->id);
    }
}
