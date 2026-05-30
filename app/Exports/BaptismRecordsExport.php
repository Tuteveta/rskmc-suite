<?php

namespace App\Exports;

use App\Models\BaptismRecord;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BaptismRecordsExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    public function __construct(private array $filters = []) {}

    public function collection()
    {
        return $this->query()->get()->map(fn ($r) => [
            $r->last_name . ', ' . $r->first_name,
            $r->date_of_birth?->format('d/m/Y') ?? '',
            $r->date_of_baptism?->format('d/m/Y') ?? '',
            $r->place_of_baptism ?? '',
            $r->officiant,
            $r->father_name ?? '',
            $r->mother_name ?? '',
            $r->witnesses ?? '',
            $r->member ? $r->member->last_name . ', ' . $r->member->first_name : '',
        ]);
    }

    public function query(): Builder
    {
        return BaptismRecord::with('member')
            ->orderByDesc('date_of_baptism')
            ->when($this->filters['date_from'] ?? null, fn ($q, $v) => $q->whereDate('date_of_baptism', '>=', $v))
            ->when($this->filters['date_to'] ?? null,   fn ($q, $v) => $q->whereDate('date_of_baptism', '<=', $v))
            ->when($this->filters['officiant'] ?? null, fn ($q, $v) => $q->where('officiant', 'like', "%{$v}%"))
            ->when($this->filters['place'] ?? null,     fn ($q, $v) => $q->where('place_of_baptism', 'like', "%{$v}%"));
    }

    public function headings(): array
    {
        return ['Full Name', 'Date of Birth', 'Date of Baptism', 'Place', 'Officiant', "Father's Name", "Mother's Name", 'Witnesses', 'Linked Member'];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }
}
