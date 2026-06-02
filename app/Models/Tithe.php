<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class Tithe extends Model
{
    use Auditable;

    protected $fillable = [
        'member_id', 'recorded_by', 'receipt_number', 'giving_type',
        'amount', 'giving_date', 'service_type', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'giving_date' => 'date',
            'amount'      => 'decimal:2',
        ];
    }

    public function member()  { return $this->belongsTo(Member::class); }
    public function recorder(){ return $this->belongsTo(User::class, 'recorded_by'); }

    public static function givingTypes(): array
    {
        return [
            'tithe'         => 'Tithe',
            'offering'      => 'Offering',
            'special'       => 'Special Offering',
            'building_fund' => 'Building Fund',
            'mission'       => 'Mission Fund',
            'thanksgiving'  => 'Thanksgiving',
            'projects'      => 'Projects',
        ];
    }

    public function auditLabel(): string
    {
        return "Receipt #{$this->receipt_number}";
    }
}
