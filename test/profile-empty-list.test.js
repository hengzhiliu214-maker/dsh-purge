import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureProfileBodyInsert } from "../lib/profile-insert.js";

test("fresh empty YAML list becomes one insert and remains idempotent", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "purge-empty-profile-"));
  try {
    const file = path.join(dir, "cordis.patch.yml");
    fs.writeFileSync(file, "# profile\n[]\n");
    assert.equal(ensureProfileBodyInsert(dir).wrote, true);
    const result = fs.readFileSync(file, "utf8");
    assert.match(result, /^# profile\n\n\n- insert:\n/m);
    assert.doesNotMatch(result, /^\[\]/m);
    assert.equal(ensureProfileBodyInsert(dir).wrote, false);
    assert.equal(fs.readFileSync(file, "utf8"), result);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("existing list entries are retained", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "purge-existing-profile-"));
  try {
    const file = path.join(dir, "cordis.patch.yml");
    const original = "- id: example\n  config:\n    values: []\n";
    fs.writeFileSync(file, original);
    ensureProfileBodyInsert(dir);
    assert.ok(fs.readFileSync(file, "utf8").startsWith(original));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
