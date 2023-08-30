import JSZip from 'jszip';

import type { Contract } from './contract';
import { printContract } from './print';
import { reachable } from './utils/transitive-closure';

import ozContracts from '../openzeppelin-contracts';
import arianeeContracts from '../arianee-contracts';
import { withHelpers } from './options';

const readme = (variant: string) => `\
# OpenZeppelin Contracts

The files in this directory were sourced unmodified from OpenZeppelin Contracts v${ozContracts.version}.

They are not meant to be edited.

The originals can be found on [GitHub] and [npm].

[GitHub]: https://github.com/OpenZeppelin/openzeppelin-contracts${variant}/tree/v${ozContracts.version}
[npm]: https://www.npmjs.com/package/@openzeppelin/contracts${variant}/v/${ozContracts.version}

Generated with OpenZeppelin Contracts Wizard (https://zpl.in/wizard).
`;

export function zipContract(c: Contract): JSZip {
  const { transformImport } = withHelpers(c);
  const contractsVariant = c.upgradeable ? '-upgradeable' : '';

  const fileName = c.name + '.sol';

  const dependencies = {
    [fileName]: c.imports.map(i => transformImport(i)),
    ...ozContracts.dependencies,
  };

  const allImports = reachable(dependencies, fileName);

  const zip = new JSZip();

  zip.file(fileName, printContract(c, { transformImport: p => './' + p }));

  zip.file(`@openzeppelin/contracts${contractsVariant}/README.md`, readme(contractsVariant));

  const sources = { ...ozContracts.sources, ...arianeeContracts.sources };

  for (const importPath of allImports) {
    const source = sources[importPath];
    if (source === undefined) {
      throw new Error(`Source for ${importPath} not found`);
    }
    zip.file(importPath, source);
  }

  return zip;
}
