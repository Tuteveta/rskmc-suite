<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetMaintenanceLog extends Model
{
    protected $fillable = [
        'asset_id', 'service_date', 'type', 'description',
        'cost', 'performed_by', 'next_due_date', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'service_date'  => 'date',
            'next_due_date' => 'date',
            'cost'          => 'decimal:2',
        ];
    }

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public static function types(): array
    {
        return [
            'service'    => 'Service',
            'repair'     => 'Repair',
            'inspection' => 'Inspection',
            'upgrade'    => 'Upgrade',
            'other'      => 'Other',
        ];
    }
}
