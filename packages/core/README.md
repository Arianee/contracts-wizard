# Arianee Contracts Wizard for Solidity
[![NPM Package](https://img.shields.io/npm/v/@arianee/contracts-wizard?color=4db9b4)](https://www.npmjs.com/package/@arianee/contracts-wizard)

<p align="center">
  <img width="125" height="125" src="https://storage.googleapis.com/arn3-static-resources/arianee/arianee_hardhat.png">
</p>

Interactively build a contract out of components from Arianee Contracts. Provide parameters and desired features for the kind of contract that you want, and the Wizard will generate all of the code necessary. The resulting code is ready to be compiled and deployed, or it can serve as a starting point and customized further with application specific logic.

This package provides a programmatic API. For a web interface, see https://wizard.arianee.com

### Installation

`npm install @arianee/contracts-wizard`

### Contract types

The following contract types are supported:
- `smartAsset`
- `erc20`
- `erc721`
- `erc1155`
- `governor`
- `custom`

Each contract type has functions/constants as defined below.

### Functions

#### `print`
```js
function print(opts?: SmartAssetOptions): string
```
```js
function print(opts?: ERC20Options): string
```
```js
function print(opts?: ERC721Options): string
```
```js
function print(opts?: ERC1155Options): string
```
```js
function print(opts?: GovernorOptions): string
```
```js
function print(opts?: CustomOptions): string
```
Returns a string representation of a contract generated using the provided options. If `opts` is not provided, uses [`defaults`](#defaults).

#### `defaults`
```js
const defaults: Required<SmartAssetOptions>
```
```js
const defaults: Required<ERC20Options>
```
```js
const defaults: Required<ERC721Options>
```
```js
const defaults: Required<ERC1155Options>
```
```js
const defaults: Required<GovernorOptions>
```
```js
const defaults: Required<CustomOptions>
```
The default options that are used for [`print`](#print).

#### `isAccessControlRequired`
```js
function isAccessControlRequired(opts: Partial<ERC20Options>): boolean
```
```js
function isAccessControlRequired(opts: Partial<ERC721Options>): boolean
```
```js
function isAccessControlRequired(opts: Partial<ERC1155Options>): boolean
```
```js
function isAccessControlRequired(opts: Partial<GovernorOptions>): boolean
```
```js
function isAccessControlRequired(opts: Partial<CustomOptions>): boolean
```
Whether any of the provided options require access control to be enabled. If this returns `true`, then calling `print` with the same options would cause the `access` option to default to `'ownable'` if it was `undefined` or `false`. 

### Examples

Import the contract type(s) that you want to use from the `@arianee/contracts-wizard` package:

```js
import { smartAsset } from '@arianee/contracts-wizard';
```

To generate the source code for a SmartAsset contract with all of the default settings:
```js
const contract = smartAsset.print();
```

To generate the source code for an SmartAsset contract with a custom name and symbol, along with some custom settings:
```js
const contract = smartAsset.print({
  name: 'MySmartAsset',
  symbol: 'MSA',
  updatable: true,
  burnable: true,
});
```

___
This package is a fork of [OpenZeppelin Contracts Wizard for Solidity](https://github.com/OpenZeppelin/contracts-wizard).