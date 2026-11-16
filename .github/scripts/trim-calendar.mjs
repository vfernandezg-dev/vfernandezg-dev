// Removes the star and fork counters from the 3D contribution calendars.
//
// The drawing ends with three figures: contributions, stars and forks. Most of the work
// behind the calendar is in private repositories, so the last two say nothing about it.
// The generator has no option to leave them out, so they are cut from its output.
//
// Usage: node .github/scripts/trim-calendar.mjs <folder with the SVG files>
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const folder = process.argv[2] ?? 'profile-3d-contrib';

/** An icon followed by its number, twice, right after the "contributions" label. */
const COUNTERS =
  /(contributions<\/text>)(?:<g transform="translate\([^)]*\), scale\(2\)"><path[^>]*><\/path><\/g><text[^>]*>[^<]*<title>[^<]*<\/title><\/text>){2}/;

for (const name of await readdir(folder)) {
  if (!name.endsWith('.svg')) continue;
  const file = join(folder, name);
  const svg = await readFile(file, 'utf8');
  if (!COUNTERS.test(svg)) {
    // A new version of the generator may write them differently: keep its output as it is.
    console.warn(`${name}: counters not found, left unchanged`);
    continue;
  }
  await writeFile(file, svg.replace(COUNTERS, '$1'));
  console.log(`${name}: star and fork counters removed`);
}
