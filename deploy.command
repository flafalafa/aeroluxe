#!/bin/bash
# ============================================================
# AeroLUXE — Deploy to Cloudflare Pages
# Jalankan file ini dengan double-click atau di Terminal
# ============================================================

echo ""
echo "✈  AeroLUXE Deploy Script"
echo "=========================="
echo ""

# Masuk ke folder project
cd "$(dirname "$0")"

# Login ke Cloudflare (browser akan terbuka)
echo "📋 Step 1: Login ke Cloudflare..."
echo "   Browser akan terbuka. Silakan login dengan akun Cloudflare Anda."
echo ""
npx wrangler login

echo ""
echo "🚀 Step 2: Deploy ke Cloudflare Pages..."
npx wrangler pages deploy . --project-name=aeroluxe --commit-dirty=true

echo ""
echo "✅ SELESAI! Website AeroLUXE sudah live!"
echo "   URL: https://aeroluxe.pages.dev"
echo ""
read -p "Tekan Enter untuk menutup..."
