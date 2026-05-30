<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
    public function index()
    {
        $disk    = Storage::disk('local');
        $backups = [];

        if ($disk->exists('backups')) {
            foreach ($disk->files('backups') as $file) {
                $backups[] = [
                    'name'       => basename($file),
                    'path'       => $file,
                    'size'       => $this->formatBytes($disk->size($file)),
                    'created_at' => date('d/m/Y H:i:s', $disk->lastModified($file)),
                ];
            }
            rsort($backups);
        }

        return Inertia::render('backup/index', ['backups' => $backups]);
    }

    public function create()
    {
        try {
            $filename = 'rskmc-backup-' . now()->format('Ymd-His') . '.sql';
            $path     = storage_path("app/backups/{$filename}");

            if (!is_dir(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

            $db   = config('database.connections.mysql.database');
            $user = config('database.connections.mysql.username');
            $pass = config('database.connections.mysql.password');
            $host = config('database.connections.mysql.host');

            $command = "mysqldump --host={$host} --user={$user} --password={$pass} {$db} > \"{$path}\"";
            exec($command, $output, $code);

            if ($code !== 0 || !file_exists($path)) {
                return back()->with('error', 'Backup failed. Ensure mysqldump is available.');
            }

            return back()->with('success', "Backup created: {$filename}");
        } catch (\Exception $e) {
            return back()->with('error', 'Backup error: ' . $e->getMessage());
        }
    }

    public function download(string $filename): BinaryFileResponse
    {
        $path = storage_path("app/backups/{$filename}");

        abort_unless(file_exists($path) && str_ends_with($filename, '.sql'), 404);

        return response()->download($path);
    }

    public function destroy(string $filename)
    {
        $path = storage_path("app/backups/{$filename}");

        if (file_exists($path)) {
            unlink($path);
        }

        return back()->with('success', 'Backup deleted.');
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1048576) return round($bytes / 1048576, 2) . ' MB';
        if ($bytes >= 1024)    return round($bytes / 1024, 2) . ' KB';
        return $bytes . ' B';
    }
}
