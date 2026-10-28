import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/register-offline.mjs', import.meta.url));
test('offline registration rejects missing install and handles an empty profile', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'purge-register-'));
  try {
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: {} }));
    const run = () => spawnSync(process.execPath, [script, dir], { encoding: 'utf8' });
    assert.notEqual(run().status, 0);
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { 'dsh-purge': 'file:bundle.tgz' } }));
    const installed = path.join(dir, 'node_modules', 'dsh-purge');
    fs.mkdirSync(installed, { recursive: true });
    fs.writeFileSync(path.join(installed, 'package.json'), '{}');
    fs.writeFileSync(path.join(dir, 'cordis.patch.yml'), '# fresh\n[]\n');
    fs.writeFileSync(path.join(dir, 'pnpm-workspace.yaml'), 'packages:\n  - .\n');
    assert.equal(run().status, 0);
    assert.equal(run().status, 0);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'package.json'))).dsh.profile.bundles.filter(x => x === 'dsh-purge').length, 1);
    assert.equal((fs.readFileSync(path.join(dir, 'cordis.patch.yml'), 'utf8').match(/- id: dsh-purge/g) || []).length, 1);
    assert.equal(fs.readFileSync(path.join(dir, 'pnpm-workspace.yaml'), 'utf8'), 'packages:\n  - .\n');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
