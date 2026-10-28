import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBundledSkillFile } from '../lib/redteam/index.js';

test('bundled skills exclude macOS metadata and hidden files', () => {
  assert.equal(isBundledSkillFile('active-scan.md'), true);
  assert.equal(isBundledSkillFile('._active-scan.md'), false);
  assert.equal(isBundledSkillFile('.hidden.md'), false);
  assert.equal(isBundledSkillFile('readme.txt'), false);
});

test('explicit DSH_HOME never mirrors bundled skills into the default home', async () => {
  const { skillSyncTargets } = await import('../lib/redteam/index.js');
  assert.deepEqual(skillSyncTargets({ dshHome: '/tmp/isolated', userHome: '/tmp/ordinary' }), ['/tmp/isolated/redteam/skills']);
  assert.deepEqual(skillSyncTargets({ dshHome: '', userHome: '/tmp/ordinary' }), ['/tmp/ordinary/.dsh/redteam/skills']);
});
