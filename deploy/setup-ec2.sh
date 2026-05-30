#!/bin/bash
# RSKMC Suite — EC2 Ubuntu 22.04 Setup Script
# Run as: bash setup-ec2.sh

set -e

echo "=========================================="
echo "  RSKMC Suite — EC2 Deployment Setup"
echo "=========================================="

# ── 1. System update ──────────────────────────────────────────────────────────
echo "[1/10] Updating system..."
sudo apt-get update -y && sudo apt-get upgrade -y

# ── 2. Install PHP 8.2 ───────────────────────────────────────────────────────
echo "[2/10] Installing PHP 8.2..."
sudo apt-get install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt-get update -y
sudo apt-get install -y php8.2 php8.2-fpm php8.2-cli php8.2-mysql \
    php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd \
    php8.2-bcmath php8.2-intl php8.2-tokenizer php8.2-dom

# ── 3. Install Nginx ─────────────────────────────────────────────────────────
echo "[3/10] Installing Nginx..."
sudo apt-get install -y nginx

# ── 4. Install MySQL ─────────────────────────────────────────────────────────
echo "[4/10] Installing MySQL..."
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Set MySQL root password and create database
DB_PASS="RskmcSuite@2025!"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';"
sudo mysql -u root -p${DB_PASS} -e "CREATE DATABASE IF NOT EXISTS rskmc_suite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -u root -p${DB_PASS} -e "CREATE USER IF NOT EXISTS 'rskmc'@'localhost' IDENTIFIED BY '${DB_PASS}';"
sudo mysql -u root -p${DB_PASS} -e "GRANT ALL PRIVILEGES ON rskmc_suite.* TO 'rskmc'@'localhost';"
sudo mysql -u root -p${DB_PASS} -e "FLUSH PRIVILEGES;"
echo "    MySQL database: rskmc_suite | user: rskmc | pass: ${DB_PASS}"

# ── 5. Install Composer ──────────────────────────────────────────────────────
echo "[5/10] Installing Composer..."
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# ── 6. Install Node.js 20 ────────────────────────────────────────────────────
echo "[6/10] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# ── 7. Clone the repository ──────────────────────────────────────────────────
echo "[7/10] Cloning RSKMC Suite..."
cd /var/www
sudo rm -rf rskmc-suite
sudo git clone https://github.com/Tuteveta/rskmc-suite.git rskmc-suite
sudo chown -R $USER:$USER /var/www/rskmc-suite
cd /var/www/rskmc-suite

# ── 8. Laravel setup ─────────────────────────────────────────────────────────
echo "[8/10] Setting up Laravel..."

# Copy env
cp .env.example .env

# Write env values
cat > .env << EOF
APP_NAME="RSKMC Suite"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=Pacific/Port_Moresby
APP_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rskmc_suite
DB_USERNAME=rskmc
DB_PASSWORD=${DB_PASS}

CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

MAIL_MAILER=log
EOF

# Install PHP deps
composer install --no-dev --optimize-autoloader --no-interaction

# Generate app key
php artisan key:generate

# Install Node deps and build
npm install
npm run build

# Run migrations and seed
php artisan migrate --seed --force

# Create admin user
php artisan tinker --execute="App\Models\User::firstOrCreate(['email'=>'admin@rskmc.org'],['name'=>'Admin','role'=>'admin','password'=>bcrypt('Admin@rskmc2025'),'email_verified_at'=>now()]);"

# Permissions
sudo chown -R www-data:www-data /var/www/rskmc-suite/storage
sudo chown -R www-data:www-data /var/www/rskmc-suite/bootstrap/cache
sudo chmod -R 775 /var/www/rskmc-suite/storage
sudo chmod -R 775 /var/www/rskmc-suite/bootstrap/cache

# Storage symlink
php artisan storage:link

# Optimise
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ── 9. Configure Nginx ───────────────────────────────────────────────────────
echo "[9/10] Configuring Nginx..."
sudo tee /etc/nginx/sites-available/rskmc-suite > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;
    root /var/www/rskmc-suite/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/rskmc-suite /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl enable nginx

# ── 10. Start services ───────────────────────────────────────────────────────
echo "[10/10] Starting services..."
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx

PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo ""
echo "=========================================="
echo "  RSKMC Suite is LIVE!"
echo "=========================================="
echo ""
echo "  URL:      http://${PUBLIC_IP}"
echo "  Email:    admin@rskmc.org"
echo "  Password: Admin@rskmc2025"
echo ""
echo "  Change the admin password immediately after first login."
echo "=========================================="
