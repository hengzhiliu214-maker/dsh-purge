import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensurePnpmAllowBuild } from "../lib/profile-insert.js";

test("no-postinstall bundle leaves an existing workspace unchanged", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "purge-profile-test-"));
  try {
    const file = path.join(dir, "pnpm-workspace.yaml");
    const original = "packages:\n  - .\nnodeLinker: hoisted\n";
    fs.writeFileSync(file, original);
    const result = ensurePnpmAllowBuild(dir, { manifest: { scripts: {} } });
    assert.equal(result.reason, "no-postinstall");
    assert.equal(result.wrote, false);
    assert.equal(fs.readFileSync(file, "utf8"), original);
    assert.equal(ensurePnpmAllowBuild(dir, { manifest: { scripts: { postinstall: "node setup.js" } } }).wrote, true);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
