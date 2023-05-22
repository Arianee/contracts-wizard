import { Contract, ContractBuilder } from "./contract";
import { defineFunctions } from "./utils/define-functions";
import {
  CommonOptions,
  withCommonDefaults,
  defaults as commonDefaults,
} from "./common-options";
import { setInfo } from "./set-info";
import { printContract } from "./print";

export const uriStorageOptions = ["baseURI", "overridableBaseURI"] as const;

export type UriStorage = (typeof uriStorageOptions)[number];

export interface SmartAssetOptions extends CommonOptions {
  name: string;
  symbol: string;
  baseUri: string;
  uriStorage: UriStorage;
  updatable?: boolean;
  recoverable?: boolean;
  burnable?: boolean;
  soulbound?: boolean;
}

export const defaults: Required<SmartAssetOptions> = {
  name: "MySmartAsset",
  symbol: "MSA",
  baseUri: "",
  uriStorage: "baseURI",
  updatable: false,
  recoverable: false,
  burnable: false,
  soulbound: false,
  access: commonDefaults.access,
  upgradeable: commonDefaults.upgradeable,
  info: commonDefaults.info,
} as const;

function withDefaults(opts: SmartAssetOptions): Required<SmartAssetOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    updatable: opts.updatable ?? defaults.updatable,
    recoverable: opts.recoverable ?? defaults.recoverable,
    burnable: opts.burnable ?? defaults.burnable,
    soulbound: opts.soulbound ?? defaults.soulbound,
  };
}

export function printSmartAsset(opts: SmartAssetOptions = defaults): string {
  return printContract(buildSmartAsset(opts));
}

export function isAccessControlRequired(
  opts: Partial<SmartAssetOptions>
): boolean {
  return false;
}

export function buildSmartAsset(opts: SmartAssetOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.name);

  const { info } = allOpts;

  addBase(c, allOpts.name, allOpts.symbol, allOpts.uriStorage, allOpts.baseUri);

  if (allOpts.updatable) {
    addUpdatable(c);
  }

  if (allOpts.recoverable) {
    addRecoverable(c);
  }

  if (allOpts.burnable) {
    addBurnable(c);
  }

  if (allOpts.soulbound) {
    addSoulbound(c);
  }

  setInfo(c, info);

  return c;
}

const arianeeContractsBasePath = "@arianee/contracts";

function addBase(
  c: ContractBuilder,
  name: string,
  symbol: string,
  uriStorage: UriStorage,
  baseUri: string
) {
  c.addParent(
    {
      name: "SmartAssetBase",
      path: `${arianeeContractsBasePath}/SmartAsset/SmartAssetBase.sol`,
    },
    [name, symbol]
  );

  c.addOverride("ERC721", functions._burn);
  c.addOverride("ERC721", functions._baseURI);
  c.addOverride("ERC721", functions.tokenURI);

  c.addOverride("SmartAssetBase", functions.setTokenTransferKey);
  c.addOverride("SmartAssetBase", functions.requestToken);
  c.addOverride("SmartAssetBase", functions.hydrateToken);
  c.addOverride("SmartAssetBase", functions.supportsInterface);
  c.addOverride("SmartAssetBase", functions._beforeTokenTransfer);
  c.addOverride("SmartAssetBase", functions._transfer);
  c.addOverride("SmartAssetBase", functions._afterFirstTokenTransfer);

  switch (uriStorage) {
    case "overridableBaseURI":
      c.addParent(
        {
          name: "SmartAssetURIStorageOverridable",
          path: `${arianeeContractsBasePath}/SmartAsset/SmartAssetURIStorageOverridable.sol`,
        },
        [baseUri]
      );

      c.addOverride("SmartAssetURIStorageOverridable", functions.hydrateToken);
      c.addOverride("SmartAssetURIStorageOverridable", functions.tokenURI);
      c.addOverride(
        "SmartAssetURIStorageOverridable",
        functions.supportsInterface
      );
      c.addOverride("SmartAssetURIStorageOverridable", functions._transfer);
      c.addOverride("SmartAssetURIStorageOverridable", functions._burn);
      c.addOverride(
        "SmartAssetURIStorageOverridable",
        functions._beforeTokenTransfer
      );
      c.addOverride("SmartAssetURIStorageOverridable", functions._baseURI);
      break;

    default: {
      c.addParent(
        {
          name: "SmartAssetURIStorage",
          path: `${arianeeContractsBasePath}/SmartAsset/SmartAssetURIStorage.sol`,
        },
        [baseUri]
      );

      c.addOverride("SmartAssetURIStorage", functions._baseURI);
      break;
    }
  }
}

function addUpdatable(c: ContractBuilder) {
  c.addParent({
    name: "SmartAssetUpdatable",
    path: `${arianeeContractsBasePath}/SmartAsset/SmartAssetUpdatable.sol`,
  });
}

function addRecoverable(c: ContractBuilder) {
  c.addParent({
    name: "SmartAssetRecoverable",
    path: `${arianeeContractsBasePath}/SmartAsset/SmartAssetRecoverable.sol`,
  });

  c.addOverride("SmartAssetRecoverable", functions.hydrateToken);
  c.addOverride("SmartAssetRecoverable", functions._burn);
  c.addOverride("SmartAssetRecoverable", functions._afterFirstTokenTransfer);
}

function addBurnable(c: ContractBuilder) {
  c.addParent({
    name: "SmartAssetBurnable",
    path: `${arianeeContractsBasePath}/SmartAsset/SmartAssetBurnable.sol`,
  });
}

function addSoulbound(c: ContractBuilder) {
  c.addParent({
    name: "SmartAssetSoulbound",
    path: `${arianeeContractsBasePath}/SmartAsset/SmartAssetSoulbound.sol`,
  });

  c.addOverride("SmartAssetSoulbound", functions.setTokenTransferKey);
  c.addOverride("SmartAssetSoulbound", functions.requestToken);
  c.addOverride("SmartAssetSoulbound", functions._transfer);
}

const functions = defineFunctions({
  setTokenTransferKey: {
    kind: "public" as const,
    args: [
      { name: "tokenId", type: "uint256" },
      { name: "key", type: "address" },
    ],
  },

  requestToken: {
    kind: "public" as const,
    args: [
      { name: "tokenId", type: "uint256" },
      { name: "signature", type: "bytes", location: "calldata" },
      { name: "newOwner", type: "address" },
      { name: "keepTransferKey", type: "bool" },
    ],
  },

  hydrateToken: {
    kind: "public" as const,
    args: [
      {
        name: "tokenHydratationParams",
        type: "TokenHydratationParams",
        location: "memory",
      },
    ],
  },

  tokenURI: {
    kind: "public" as const,
    mutability: "view" as const,
    args: [{ name: "tokenId", type: "uint256" }],
    returns: ["string memory"],
  },

  supportsInterface: {
    kind: "public" as const,
    mutability: "view" as const,
    args: [{ name: "interfaceId", type: "bytes4" }],
    returns: ["bool"],
  },

  _beforeTokenTransfer: {
    kind: "internal" as const,
    args: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "batchSize", type: "uint256" },
    ],
  },

  _transfer: {
    kind: "internal" as const,
    args: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
  },

  _afterFirstTokenTransfer: {
    kind: "internal" as const,
    args: [{ name: "tokenId", type: "uint256" }],
  },

  _burn: {
    kind: "internal" as const,
    args: [{ name: "tokenId", type: "uint256" }],
  },

  _baseURI: {
    kind: "internal" as const,
    mutability: "view" as const,
    args: [],
    returns: ["string memory"],
  },
});
