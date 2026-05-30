<?php

namespace App\Exports;

use App\Models\Member;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MembersExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    public function __construct(private array $filters = []) {}

    public function collection()
    {
        return $this->query()->get()->map(fn ($m) => [
            $m->member_number,
            $m->last_name . ', ' . $m->first_name,
            ucfirst($m->gender),
            $m->date_of_birth?->format('d/m/Y') ?? '',
            $m->phone ?? '',
            $m->email ?? '',
            $m->address ?? '',
            $m->join_date?->format('d/m/Y') ?? '',
            ucfirst($m->status),
        ]);
    }

    public function query(): Builder
    {
        return Member::orderBy('last_name')
            ->when($this->filters['status'] ?? null, fn ($q, $v) => $q->where('status', $v))
            ->when($this->filters['gender'] ?? null, fn ($q, $v) => $q->where('gender', $v))
            ->when($this->filters['join_date_from'] ?? null, fn ($q, $v) => $q->whereDate('join_date', '>=', $v))
            ->when($this->filters['join_date_to'] ?? null, fn ($q, $v) => $q->whereDate('join_date', '<=', $v));
    }

    public function headings(): array
    {
        return ['Member No.', 'Full Name', 'Gender', 'Date of Birth', 'Phone', 'Email', 'Address', 'Join Date', 'Status'];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }
}
