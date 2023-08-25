import { accessOptions } from '../set-access-control';
import { infoOptions } from '../set-info';
import { SmartAssetOptions, uriStorageOptions } from '../smart-asset';
import { generateAlternatives } from './alternatives';

const booleans = [true, false];

const blueprint = {
  name: ['MySmartAsset'],
  symbol: ['MSA'],
  rulesManager: ['0x0000000000000000000000000000000000000000'],
  creditManager: ['0x0000000000000000000000000000000000000000'],
  trustedForwarder: ['0x0000000000000000000000000000000000000000'],
  baseUri: [''],
  uriStorage: uriStorageOptions,
  updatable: booleans,
  recoverable: booleans,
  burnable: booleans,
  soulbound: booleans,
  shared: booleans,
  access: accessOptions,
  upgradeable: [false] as const,
  info: infoOptions,
};

export function* generateSmartAssetOptions(): Generator<Required<SmartAssetOptions>> {
  yield* generateAlternatives(blueprint);
}
