<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Giving Statement {{ $year }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1a1a1a; margin: 0; padding: 24px; }
        .header { display: flex; align-items: center; gap: 16px; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 16px; }
        .header img { height: 60px; }
        .header-text h1 { font-size: 16px; margin: 0 0 2px; }
        .header-text p  { margin: 0; font-size: 11px; color: #555; }
        .member-box { background: #f5f5f5; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 11px; }
        .member-box strong { font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
        th { background: #1a1a1a; color: #fff; padding: 6px 10px; text-align: left; font-size: 10px; }
        td { padding: 5px 10px; border-bottom: 1px solid #e5e5e5; font-size: 10px; }
        tr:nth-child(even) td { background: #f9f9f9; }
        .total-row td { font-weight: bold; border-top: 2px solid #1a1a1a; background: #f0f0f0; }
        .footer { margin-top: 20px; font-size: 9px; color: #999; text-align: center; border-top: 1px solid #e5e5e5; padding-top: 8px; }
        .signature-area { margin-top: 40px; display: flex; justify-content: space-between; font-size: 10px; }
        .sig-line { border-top: 1px solid #333; width: 200px; padding-top: 4px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('logo.jpg') }}" alt="Logo">
        <div class="header-text">
            <h1>Rev Sione Kami Memorial Church</h1>
            <p>Annual Giving Statement &mdash; {{ $year }}</p>
            <p>Generated: {{ now()->format('d F Y') }}</p>
        </div>
    </div>

    <div class="member-box">
        <strong>{{ $member->last_name }}, {{ $member->first_name }}</strong><br>
        Member No: {{ $member->member_number }}
        @if($member->address) &nbsp;|&nbsp; {{ $member->address }} @endif
    </div>

    <table>
        <thead>
            <tr><th>Date</th><th>Receipt No.</th><th>Type</th><th>Service</th><th style="text-align:right">Amount (PGK)</th></tr>
        </thead>
        <tbody>
            @foreach($tithes as $t)
            <tr>
                <td>{{ $t->giving_date->format('d/m/Y') }}</td>
                <td>{{ $t->receipt_number }}</td>
                <td>{{ \App\Models\Tithe::givingTypes()[$t->giving_type] ?? $t->giving_type }}</td>
                <td>{{ $t->service_type ?? '—' }}</td>
                <td style="text-align:right">{{ number_format($t->amount, 2) }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="4">Total Giving for {{ $year }}</td>
                <td style="text-align:right">PGK {{ number_format($total, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="signature-area">
        <div class="sig-line">Church Secretary</div>
        <div class="sig-line">Pastor / Authorized Officer</div>
    </div>

    <div class="footer">
        This statement is issued by Rev Sione Kami Memorial Church for record purposes only. &mdash; Confidential
    </div>
</body>
</html>
