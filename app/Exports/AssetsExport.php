<?php

namespace App\Exports;

use App\Models\Asset;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AssetsExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    public function __construct(private array $filters = []) {}

    public function collection()
    {
        return $this->query()->get()->map(fn ($a) => [
            $a->name,
            Asset::categories()[$a->category] ?? $a->category,
            $a->brand ?? '',
            $a->serial_number ?? '',
            ucfirst($a->condition),
            ucfirst($a->status),
            $a->location ?? '',
            $a->acquisition_date?->format('d/m/Y') ?? '',
            $a->acquisition_cost ? number_format($a->acquisition_cost, 2) : '',
        ]);
    }

    public function query(): Builder
    {
        return Asset::orderBy('name')
            ->when($this->filters['category'] ?? null, fn ($q, $v) => $q->where('category', $v))
            ->when($this->filters['status'] ?? null,   fn ($q, $v) => $q->where('status', $v))
            ->when($this->filters['condition'] ?? null, fn ($q, $v) => $q->where('condition', $v));
    }

    public function headings(): array
    {
        return ['Name', 'Category', 'Brand', 'Serial No.', 'Condition', 'Status', 'Location', 'Acquired', 'Cost (PGK)'];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }
}
