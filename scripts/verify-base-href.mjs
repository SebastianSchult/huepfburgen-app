import { existsSync, readFileSync } from 'node:fs';

const expectedBaseHref = '<base href="/huepfburgen-app/">';
const indexCandidates = [
  'dist/huepfburgen-app/index.html',
  'dist/huepfburgen-app/browser/index.html',
];

const indexPath = indexCandidates.find((candidate) => existsSync(candidate));

if (!indexPath) {
  console.error(`Could not find index.html in: ${indexCandidates.join(', ')}`);
  process.exit(1);
}

const indexHtml = readFileSync(indexPath, 'utf8');

if (!indexHtml.includes(expectedBaseHref)) {
  console.error(`Expected ${expectedBaseHref} in ${indexPath}`);
  process.exit(1);
}

console.log(`Verified ${expectedBaseHref} in ${indexPath}`);
