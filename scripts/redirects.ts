import fs, { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import fg from 'fast-glob';

interface PackageInfo {
  dir: string;
  base: string;
  pdfFile?: string;
}

interface Rewrite {
  source: string;
  destination: string;
}

async function updateVercelConfig() {
  const packageFiles = (
    await fg('*/src/package.json', {
      onlyFiles: true,
    })
  ).sort();

  const packagesInfo: PackageInfo[] = (
    await Promise.all(
      packageFiles.map(async (file) => {
        const talkRoot = dirname(dirname(file));
        const packageJsonPath = resolve(process.cwd(), talkRoot, 'src/package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const pdfFiles = await fg('*.pdf', {
          cwd: resolve(process.cwd(), talkRoot),
          onlyFiles: true,
        });
        const pdfFile = pdfFiles[0];
        const buildScript = packageJson.scripts?.build;

        if (!buildScript) {
          return null;
        }

        const baseMatch = buildScript.match(/--base\s+(\S+)/);
        const base = baseMatch ? baseMatch[1] : null;

        if (!base) {
          return null;
        }

        return {
          dir: talkRoot,
          base,
          pdfFile,
        };
      }),
    )
  ).filter(Boolean) as PackageInfo[];

  const vercelConfigPath = 'vercel.json';
  const vercelConfigContent = await readFile(vercelConfigPath, 'utf-8');
  const vercelConfig = JSON.parse(vercelConfigContent);

  if (!vercelConfig.rewrites || !Array.isArray(vercelConfig.rewrites)) {
    vercelConfig.rewrites = [];
  }

  const existingRewrites = new Set(
    vercelConfig.rewrites.map((r: Rewrite) => `${r.source} -> ${r.destination}`),
  );

  const newRewrites: Rewrite[] = packagesInfo.flatMap(
    ({ base, pdfFile, dir }) => {
      const rewrites: Rewrite[] = [];

      const githubBaseUrl = `https://github.com/hadronomy/talks/blob/main/${dir}`;

      if (pdfFile) {
        const pdfDestination = `${githubBaseUrl}/${pdfFile}?raw=true`;
        const pdfRewrite = {
          source: removeDoubleSlashes(`${base}/pdf`),
          destination: pdfDestination,
        };

        if (!existingRewrites.has(`${pdfRewrite.source} -> ${pdfRewrite.destination}`)) {
          rewrites.push(pdfRewrite);
        }

        const dirPdfRewrite = {
          source: `/${dir}/pdf`,
          destination: pdfDestination,
        };
        if (!existingRewrites.has(`${dirPdfRewrite.source} -> ${dirPdfRewrite.destination}`)) {
          rewrites.push(dirPdfRewrite);
        }
      }

      const githubTreeUrl = `https://github.com/hadronomy/talks/tree/main/${dir}`;
      const srcRewrite = {
        source: removeDoubleSlashes(`${base}/src`),
        destination: githubTreeUrl,
      };
      if (!existingRewrites.has(`${srcRewrite.source} -> ${srcRewrite.destination}`)) {
        rewrites.push(srcRewrite);
      }

      const dirRewrite = {
        source: `/${dir}`,
        destination: base,
      };

      if (!existingRewrites.has(`${dirRewrite.source} -> ${dirRewrite.destination}`)) {
        rewrites.push(dirRewrite);
      }

      const baseWildcardRewrite = {
        source: removeDoubleSlashes(`${base}/(.*)`),
        destination: removeDoubleSlashes(`${base}/index.html`),
      };
      if (
        !existingRewrites.has(
          `${baseWildcardRewrite.source} -> ${baseWildcardRewrite.destination}`,
        )
      ) {
        rewrites.push(baseWildcardRewrite);
      }

      const baseNoWildCardRewrite = {
        source: removeDoubleSlashes(`${base}`),
        destination: removeDoubleSlashes(`${base}/index.html`),
      };
      if (
        !existingRewrites.has(
          `${baseNoWildCardRewrite.source} -> ${baseNoWildCardRewrite.destination}`,
        )
      ) {
        rewrites.push(baseNoWildCardRewrite);
      }

      return rewrites;
    },
  );

  // Add new rewrites to the config
  vercelConfig.rewrites.push(...newRewrites);

  // Add catch-all rewrite if it doesn't exist
  const catchAllExists = vercelConfig.rewrites.some(
    (rewrite: Rewrite) => rewrite.source === '/(.*)',
  );
  if (!catchAllExists) {
    vercelConfig.rewrites.push({
      source: '/(.*)',
      destination: '/index.html',
    });
  }

  // Remove duplicate slashes from source and destination
  vercelConfig.rewrites = vercelConfig.rewrites.map((rewrite: Rewrite) => ({
    source: rewrite.source,
    destination: rewrite.destination,
  }));

  const formattedContent = `${JSON.stringify(vercelConfig, null, 2)}\n`;

  await writeFile(vercelConfigPath, formattedContent, 'utf-8');

  console.log('vercel.json updated successfully.');
}

function removeDoubleSlashes(path: string): string {
  // Remove duplicate slashes, but preserve them in the protocol part (e.g., https://)
  return path.replace(/([^:/]\/)\/+/g, '$1');
}

updateVercelConfig().catch((error) => {
  console.error('Failed to update vercel.json:', error);
});
