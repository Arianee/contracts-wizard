import { promises as fs } from 'fs';
import path from 'path';
import hre from 'hardhat';
import type { BuildInfo } from 'hardhat/types';
import { findAll } from 'solidity-ast/utils';
import { rimraf } from 'rimraf';
import { version as ozVersion } from "@openzeppelin/contracts/package.json";
import { version as arianeeVersion } from "@arianee/contracts/package.json";

import type { OpenZeppelinContracts } from '../../openzeppelin-contracts';
import type { ArianeeContracts } from '../../arianee-contracts';
import { writeGeneratedSources } from '../generate/sources';
import { mapValues } from '../utils/map-values';
import { transitiveClosure } from '../utils/transitive-closure';

async function main() {
  const generatedSourcesPath = path.join(hre.config.paths.sources, 'generated');
  await rimraf(generatedSourcesPath);
  await writeGeneratedSources(generatedSourcesPath, 'minimal-cover');
  await hre.run('compile');

  const ozDependencies: Record<string, Set<string>> = {};
  const ozSources: Record<string, string> = {};

  const arianeeDependencies: Record<string, Set<string>> = {};
  const arianeeSources: Record<string, string> = {};

  for (const buildInfoPath of await hre.artifacts.getBuildInfoPaths()) {
    const buildInfo: BuildInfo = JSON.parse(
      await fs.readFile(buildInfoPath, 'utf8'),
    );

    for (const [sourceFile, { ast }] of Object.entries(buildInfo.output.sources)) {
      if (sourceFile.startsWith('@openzeppelin/contracts')) {
        const sourceDependencies = (ozDependencies[sourceFile] ??= new Set());
        for (const imp of findAll('ImportDirective', ast)) {
          sourceDependencies.add(imp.absolutePath);
        }
      }
    }

    for (const [sourceFile, { content }] of Object.entries(buildInfo.input.sources)) {
      if (sourceFile.startsWith('@openzeppelin/contracts')) {
        ozSources[sourceFile] = content;
      }
    }

    for (const [sourceFile, { ast }] of Object.entries(buildInfo.output.sources)) {
      if (sourceFile.startsWith('@arianee/contracts')) {
        const sourceDependencies = (arianeeDependencies[sourceFile] ??= new Set());
        for (const imp of findAll('ImportDirective', ast)) {
          sourceDependencies.add(imp.absolutePath);
        }
      }
    }

    for (const [sourceFile, { content }] of Object.entries(buildInfo.input.sources)) {
      if (sourceFile.startsWith('@arianee/contracts')) {
        arianeeSources[sourceFile] = content;
      }
    }
  }

  const ozContracts: OpenZeppelinContracts = {
    version: ozVersion,
    sources: ozSources,
    dependencies: mapValues(transitiveClosure(ozDependencies), d => Array.from(d)),
  };

  await fs.writeFile('openzeppelin-contracts.json', JSON.stringify(ozContracts, null, 2));

  const arianeeContracts: ArianeeContracts = {
    version: arianeeVersion,
    sources: arianeeSources,
    dependencies: mapValues(transitiveClosure(arianeeDependencies), d => Array.from(d)),
  };

  await fs.writeFile('arianee-contracts.json', JSON.stringify(arianeeContracts, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
