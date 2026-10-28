#!/usr/bin/env node
// Register an already installed offline bundle without editing pnpm build approvals.
import fs from 'node:fs';
import path from 'node:path';
import { ensureProfileBodyInsert, ensureProfileBundles } from '../lib/profile-insert.js';

const dir = process.argv[2];
if (!dir || process.argv.length !== 3) {
  console.error('Usage: node scripts/register-offline.mjs <profile-directory>');
  process.exit(2);
}
const profile = path.resolve(dir);
const manifestPath = path.join(profile, 'package.json');
const installedPath = path.join(profile, 'node_modules', 'dsh-purge', 'package.json');
let manifest;
try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
catch { console.error('Cannot read profile package.json'); process.exit(1); }
if (!manifest.dependencies?.['dsh-purge'] || !fs.existsSync(installedPath)) {
  console.error('Install dsh-purge in this profile before registration.');
  process.exit(1);
}
try {
  const bundle = ensureProfileBundles(profile);
  const insert = ensureProfileBodyInsert(profile);
  console.log(`Bundle registered (changed=${bundle.wrote}); body insert registered (changed=${insert.wrote}).`);
} catch (error) {
  console.error('Registration failed:', error.message);
  process.exit(1);
}
