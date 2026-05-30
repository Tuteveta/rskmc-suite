<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Members Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1a1a1a; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; }
        .header img { height: 60px; }
        .header h1 { font-size: 16px; margin: 6px 0 2px; }
        .header p { font-size: 11px; color: #555; margin: 0; }
        .meta { font-size: 10px; color: #666; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1a1a1a; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; }
        td { padding: 5px 8px; border-bottom: 1px solid #e5e5e5; font-size: 10px; }
        tr:nth-child(even) td { background: #f9f9f9; }
        .badge-active { color: #15803d; font-weight: bold; }
        .badge-inactive { color: #dc2626; }
        .footer { margin-top: 20px; font-size: 9px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('logo.jpg') }}" alt="Logo">
        <h1>Rev Sione Kami Memorial Church</h1>
        <p>Congregation Members Report</p>
    </div>
    <div class="meta">Generated: {{ now()->format('d F Y, h:i A') }} &nbsp;|&nbsp; Total: {{ $members->count() }} members
        @if(!empty($applied)) &nbsp;|&nbsp; Filters: {{ implode(' · ', $applied) }} @endif
    </div>
    <table>
        <thead>
            <tr>
                <th>No.</th><th>Name</th><th>Gender</th><th>Date of Birth</th><th>Phone</th><th>Join Date</th><th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($members as $m)
            <tr>
                <td>{{ $m->member_number }}</td>
                <td>{{ $m->last_name }}, {{ $m->first_name }}</td>
                <td>{{ ucfirst($m->gender) }}</td>
                <td>{{ $m->date_of_birth?->format('d/m/Y') ?? '—' }}</td>
                <td>{{ $m->phone ?? '—' }}</td>
                <td>{{ $m->join_date?->format('d/m/Y') ?? '—' }}</td>
                <td class="badge-{{ $m->status }}">{{ ucfirst($m->status) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="footer">RSKMC CMS &mdash; Confidential</div>
</body>
</html>
