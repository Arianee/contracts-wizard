import { accessOptions } from '../set-access-control';
import { infoOptions } from '../set-info';
import { upgradeableOptions } from '../set-upgradeable';
import { SmartAssetOptions, uriStorageOptions } from '../smart-asset';
import { generateAlternatives } from './alternatives';

const booleans = [true, false];

const blueprint = {
  name: ['MySmartAsset'],
  symbol: ['MSA'],
  baseUri: [''],
  uriStorage: uriStorageOptions,
  updatable: booleans,
  recoverable: booleans,
  burnable: booleans,
  soulbound: booleans,
  access: accessOptions,
  upgradeable: upgradeableOptions,
  info: infoOptions,
};

export function* generateSmartAssetOptions(): Generator<Required<SmartAssetOptions>> {
  yield* generateAlternatives(blueprint);
}
