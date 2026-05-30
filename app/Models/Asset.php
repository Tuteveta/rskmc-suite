<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    use Auditable;
    protected $fillable = [
        'name', 'category', 'description', 'serial_number', 'brand',
        'acquisition_date', 'acquisition_cost', 'condition',
        'location', 'status', 'notes',
        'depreciation_method', 'useful_life_years', 'salvage_value',
    ];

    protected function casts(): array
    {
        return [
            'acquisition_date' => 'date',
            'acquisition_cost' => 'decimal:2',
        ];
    }

    public function maintenanceLogs()
    {
        return $this->hasMany(AssetMaintenanceLog::class);
    }

    public function getCurrentBookValueAttribute(): ?float
    {
        if (!$this->acquisition_cost || !$this->acquisition_date || $this->depreciation_method === 'none') {
            return null;
        }
        $years = $this->acquisition_date->diffInYears(now());
        $cost  = (float) $this->acquisition_cost;
        $salvage = (float) ($this->salvage_value ?? 0);
        $life  = $this->useful_life_years ?? 10;

        if ($this->depreciation_method === 'straight_line') {
            $annual = ($cost - $salvage) / $life;
            return max($salvage, $cost - ($annual * $years));
        }
        // declining balance
        $rate = 1 - pow($salvage / max($cost, 1), 1 / $life);
        return max($salvage, $cost * pow(1 - $rate, $years));
    }

    public function auditLabel(): string { return $this->name; }

    public static function categories(): array
    {
        return [
            'vehicle'           => 'Vehicle',
            'musical_equipment' => 'Musical Equipment',
            'property'          => 'Property',
            'furniture'         => 'Furniture',
            'electronics'       => 'Electronics',
            'other'             => 'Other',
        ];
    }
}
