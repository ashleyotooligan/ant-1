// Check MANIFEST.sha256 against the working tree.
//
// The manifest shipped with 0.1.0 listed six entries that did not match: three
// .github files that were never committed, and three files whose contents had
// moved on. Nothing in the repository read the manifest, so nothing noticed.
// `npm run verify:manifest` is that missing reader.
//
// Read-only. Use `--write` to regenerate the manifest after an intended change.
import {createHash} from 'node:crypto';
import {readFile, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';

const MANIFEST = 'MANIFEST.sha256';
const write = process.argv.includes('--write');

const sha256 = async (file) =>
  createHash('sha256').update(await readFile(file)).digest('hex');

// The manifest describes tracked files, so git is the source of truth for the
// list. It excludes the manifest itself: a file cannot contain its own hash.
const tracked = () =>
  execFileSync('git', ['ls-files', '-z'], {encoding: 'utf8'})
    .split('\0')
    .filter((p) => p && p !== MANIFEST)
    .sort();

if (write) {
  const lines = [];
  for (const file of tracked()) lines.push(`${await sha256(file)}  ${file}`);
  await writeFile(MANIFEST, lines.join('\n') + '\n');
  console.log(`Wrote ${MANIFEST}: ${lines.length} entries.`);
  process.exit(0);
}

const text = await readFile(MANIFEST, 'utf8');
const recorded = new Map();
for (const line of text.split('\n')) {
  if (!line.trim()) continue;
  const match = line.match(/^([0-9a-f]{64})\s\s(.+)$/);
  if (!match) {
    console.error(`Malformed manifest line: ${line}`);
    process.exitCode = 1;
    continue;
  }
  recorded.set(match[2], match[1]);
}

const missing = [];
const changed = [];
for (const [file, expected] of recorded) {
  let actual;
  try {
    actual = await sha256(file);
  } catch {
    missing.push(file);
    continue;
  }
  if (actual !== expected) changed.push(file);
}

const untracked = tracked().filter((f) => !recorded.has(f));

for (const f of missing) console.error(`missing:   ${f} is in the manifest but not in the tree`);
for (const f of changed) console.error(`changed:   ${f} does not match its recorded hash`);
for (const f of untracked) console.error(`unlisted:  ${f} is tracked but absent from the manifest`);

const bad = missing.length + changed.length + untracked.length;
if (bad) {
  console.error(
    `\nMANIFEST.sha256 does not describe this tree ` +
      `(${missing.length} missing, ${changed.length} changed, ${untracked.length} unlisted).\n` +
      `If the change was intended: npm run verify:manifest -- --write`
  );
  process.exit(1);
}
console.log(`MANIFEST.sha256 matches all ${recorded.size} tracked files.`);
