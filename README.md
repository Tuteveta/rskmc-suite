# RSKMC Suite — Church Management System

A full-featured church management platform built for the **Royale Samoan Kingdom Mission Church (RSKMC)**, Port Moresby, Papua New Guinea. Manages congregation members, sacramental records, assets, tithes & offerings, and provides rich analytics dashboards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 11 (PHP 8.2+) |
| Frontend | React 19 + TypeScript + Inertia.js |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts + D3.js v7 |
| Database | SQLite (local) / MySQL 8 (production) |
| Build | Vite |
| Server | Nginx + PHP-FPM (EC2 Ubuntu) |

---

## Features

- **Congregation Members** — Full CRUD with member numbers, status tracking, gender, DOB, contact details, and join date
- **Baptism Records** — Sacramental records with officiant, parents, and place of baptism
- **Marriage Records** — Wedding records linked to members
- **Funeral Records** — Funeral and bereavement records
- **Tithes & Offerings** — Multi-type giving records (Tithe, Offering, Special Offering, Building Fund, Mission Fund) with PDF giving statements
- **Asset Register** — Track church property, vehicles, equipment with maintenance logs and condition tracking
- **Analytics Dashboard** — Live Recharts + D3.js charts including:
  - Member growth (area chart)
  - Monthly giving year-on-year (bar chart)
  - Records activity (line chart)
  - Age pyramid (D3 — population by age group & gender)
  - Giving calendar heatmap (D3 — GitHub-style daily giving)
  - Member status donut (D3 — animated arc)
  - Cumulative giving bar race (D3 — animated, play/pause controls)
- **Role-Based Access Control** — Four roles with graduated permissions
- **Audit Log** — Every create/update/delete action is logged with user and timestamp
- **Exports** — Excel and filtered PDF exports for Members, Assets, and Baptism Records
- **Backups** — One-click database backup with download and delete

---

## Roles

| Role | Access |
|---|---|
| `administrator` | Full access including user management, audit logs, backups |
| `pastoral_staff` | Read/write on all records; no user management |
| `council_member` | Read/write on all records; no user management |
| `data_entry_officer` | Create and edit records; no delete, no admin |

---

## Local Development

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/Tuteveta/rskmc-suite.git
cd rskmc-suite

cp .env.example .env

composer install
php artisan key:generate
php artisan migrate --seed

npm install
npm run dev
```

The app will be available at `http://localhost:8000` (or via Laravel Herd).

### Default Login Accounts

| Email | Role | Password |
|---|---|---|
| `admin@rskmc.org` | Administrator | `Password@123` |
| `pastor@rskmc.org` | Pastoral Staff | `Password@123` |
| `council@rskmc.org` | Council Member | `Password@123` |
| `entry@rskmc.org` | Data Entry Officer | `Password@123` |

> Change all passwords immediately after first login in production.

---

## Production Deployment (AWS EC2)

### First-Time Setup

SSH into a fresh Ubuntu 22.04 / 24.04 / 25.04 EC2 instance, then run:

```bash
curl -fsSL https://raw.githubusercontent.com/Tuteveta/rskmc-suite/master/deploy/setup-ec2.sh | bash
```

Or clone and run locally:

```bash
bash deploy/setup-ec2.sh
```

The script will automatically:

1. Update the system
2. Install PHP 8.2/8.3 (auto-detected by Ubuntu version)
3. Install and configure Nginx
4. Install MySQL 8, create the `rskmc_suite` database and user
5. Install Composer and Node.js 20
6. Clone this repository to `/var/www/rskmc-suite`
7. Configure `.env` with the instance's public IP
8. Install dependencies and build frontend assets
9. Run database migrations and seed user accounts
10. Configure Nginx virtual host and reload

On completion it prints the public URL and login credentials.

### EC2 Security Group — Required Inbound Rules

| Port | Protocol | Source |
|---|---|---|
| 22 | TCP | Your IP (SSH) |
| 80 | TCP | 0.0.0.0/0 (HTTP) |
| 443 | TCP | 0.0.0.0/0 (HTTPS, if using SSL) |

### Updating a Running Instance

```bash
cd /var/www/rskmc-suite
git pull origin master
composer install --no-dev --optimize-autoloader
npm install && npm run build
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
sudo systemctl restart php8.2-fpm nginx
```

---

## Environment Variables

Key variables to configure in `.env` for production:

```env
APP_NAME="RSKMC Suite"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://your-ec2-public-ip

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rskmc_suite
DB_USERNAME=rskmc
DB_PASSWORD=your-db-password

APP_TIMEZONE=Pacific/Port_Moresby
```

---

## Project Structure

```
app/
  Http/Controllers/     # Feature controllers (Members, Assets, Tithes, etc.)
  Models/               # Eloquent models
  Traits/Auditable.php  # Auto audit-log trait used by all models
database/
  migrations/           # All table definitions
  seeders/              # User seed only (no mock data)
deploy/
  setup-ec2.sh          # Full EC2 provisioning script
resources/
  js/
    pages/              # Inertia page components (React)
    components/
      charts/           # D3.js chart components (AgePyramid, CalendarHeatmap, DonutChart, BarRace)
      ui/               # shadcn/ui components
    layouts/            # App shell layout
  css/app.css           # Tailwind v4 theme + CSS variables
```

---

## License

Proprietary — RSKMC, Port Moresby, Papua New Guinea. All rights reserved.
