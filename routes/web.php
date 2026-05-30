<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AssetMaintenanceLogController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\BaptismRecordController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FuneralRecordController;
use App\Http\Controllers\MarriageRecordController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\TitheController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => redirect()->route('login'))->name('home');

Route::middleware(['auth'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Module access: admin, administrator, data_entry_officer ──────────
    Route::middleware(['role:admin,administrator,data_entry_officer'])->group(function () {
        Route::resource('members', MemberController::class)->except(['destroy']);
        Route::resource('assets', AssetController::class)->except(['destroy']);
        Route::resource('baptism-records', BaptismRecordController::class)->except(['destroy']);
        Route::resource('tithes', TitheController::class)->except(['destroy', 'show']);
        Route::resource('marriage-records', MarriageRecordController::class)->except(['destroy', 'show']);
        Route::resource('funeral-records', FuneralRecordController::class)->except(['destroy', 'show']);

        // Maintenance logs nested under assets
        Route::get('assets/{asset}/maintenance',            [AssetMaintenanceLogController::class, 'index'])->name('assets.maintenance.index');
        Route::get('assets/{asset}/maintenance/create',     [AssetMaintenanceLogController::class, 'create'])->name('assets.maintenance.create');
        Route::post('assets/{asset}/maintenance',           [AssetMaintenanceLogController::class, 'store'])->name('assets.maintenance.store');
        Route::get('assets/{asset}/maintenance/{log}/edit', [AssetMaintenanceLogController::class, 'edit'])->name('assets.maintenance.edit');
        Route::put('assets/{asset}/maintenance/{log}',      [AssetMaintenanceLogController::class, 'update'])->name('assets.maintenance.update');

        // Giving statement PDF
        Route::get('tithes/giving-statement', [TitheController::class, 'givingStatement'])->name('tithes.giving-statement');

        // Exports
        Route::get('export/members/excel',         [ExportController::class, 'membersExcel'])->name('export.members.excel');
        Route::get('export/members/pdf',           [ExportController::class, 'membersPdf'])->name('export.members.pdf');
        Route::get('export/assets/excel',          [ExportController::class, 'assetsExcel'])->name('export.assets.excel');
        Route::get('export/assets/pdf',            [ExportController::class, 'assetsPdf'])->name('export.assets.pdf');
        Route::get('export/baptism-records/excel', [ExportController::class, 'baptismRecordsExcel'])->name('export.baptism-records.excel');
        Route::get('export/baptism-records/pdf',   [ExportController::class, 'baptismRecordsPdf'])->name('export.baptism-records.pdf');
    });

    // ── Destructive: admin & administrator only ───────────────────────────
    Route::middleware(['role:admin,administrator'])->group(function () {
        Route::delete('members/{member}',                   [MemberController::class, 'destroy'])->name('members.destroy');
        Route::delete('assets/{asset}',                     [AssetController::class, 'destroy'])->name('assets.destroy');
        Route::delete('baptism-records/{baptismRecord}',    [BaptismRecordController::class, 'destroy'])->name('baptism-records.destroy');
        Route::delete('tithes/{tithe}',                     [TitheController::class, 'destroy'])->name('tithes.destroy');
        Route::delete('marriage-records/{marriageRecord}',  [MarriageRecordController::class, 'destroy'])->name('marriage-records.destroy');
        Route::delete('funeral-records/{funeralRecord}',    [FuneralRecordController::class, 'destroy'])->name('funeral-records.destroy');
        Route::delete('assets/{asset}/maintenance/{log}',   [AssetMaintenanceLogController::class, 'destroy'])->name('assets.maintenance.destroy');
    });

    // ── Admin only ────────────────────────────────────────────────────────
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('users', UserController::class)->except('show');
        Route::get('audit-logs',              [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('backup',                  [BackupController::class, 'index'])->name('backup.index');
        Route::post('backup',                 [BackupController::class, 'create'])->name('backup.create');
        Route::get('backup/download/{filename}', [BackupController::class, 'download'])->name('backup.download');
        Route::delete('backup/{filename}',    [BackupController::class, 'destroy'])->name('backup.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
