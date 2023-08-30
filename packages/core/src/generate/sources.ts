import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

import { generateERC20Options } from "./erc20";
import { generateERC721Options } from "./erc721";
import { generateERC1155Options } from "./erc1155";
import { generateGovernorOptions } from "./governor";
import { generateCustomOptions } from "./custom";
import { buildGeneric, GenericOptions } from "../build-generic";
import { printContract } from "../print";
import { OptionsError } from "../error";
import { findCover } from "../utils/find-cover";
import type { Contract } from "../contract";
import { generateSmartAssetOptions } from "./smart-asset";

type Subset = "all" | "minimal-cover";
type Kind =
  | "SmartAsset"
  | "ERC20"
  | "ERC721"
  | "ERC1155"
  | "Governor"
  | "Custom";

export function* generateOptions(kinds?: Kind[]): Generator<GenericOptions> {
  if (!kinds || kinds.includes("SmartAsset")) {
    for (const kindOpts of generateSmartAssetOptions()) {
      yield { kind: "SmartAsset", ...kindOpts };
    }
  }

  if (!kinds || kinds.includes("ERC20")) {
    for (const kindOpts of generateERC20Options()) {
      yield { kind: "ERC20", ...kindOpts };
    }
  }

  if (!kinds || kinds.includes("ERC721")) {
    for (const kindOpts of generateERC721Options()) {
      yield { kind: "ERC721", ...kindOpts };
    }
  }

  if (!kinds || kinds.includes("ERC1155")) {
    for (const kindOpts of generateERC1155Options()) {
      yield { kind: "ERC1155", ...kindOpts };
    }
  }

  if (!kinds || kinds.includes("Governor")) {
    for (const kindOpts of generateGovernorOptions()) {
      yield { kind: "Governor", ...kindOpts };
    }
  }

  if (!kinds || kinds.includes("Custom")) {
    for (const kindOpts of generateCustomOptions()) {
      yield { kind: "Custom", ...kindOpts };
    }
  }
}

interface GeneratedContract {
  id: string;
  options: GenericOptions;
  contract: Contract;
}

interface GeneratedSource extends GeneratedContract {
  source: string;
}

function generateContractSubset(subset: Subset, kinds?: Kind[]): GeneratedContract[] {
  const contracts = [];

  for (const options of generateOptions(kinds)) {
    const id = crypto
      .createHash("sha1")
      .update(JSON.stringify(options))
      .digest()
      .toString("hex");

    try {
      const contract = buildGeneric(options);
      contracts.push({ id, options, contract });
    } catch (e: unknown) {
      if (e instanceof OptionsError) {
        continue;
      } else {
        throw e;
      }
    }
  }

  if (subset === "all") {
    return contracts;
  } else {
    const getParents = (c: GeneratedContract) =>
      c.contract.parents.map((p) => p.contract.path);
    return [
      ...findCover(
        contracts.filter((c) => c.options.upgradeable),
        getParents
      ),
      ...findCover(
        contracts.filter((c) => !c.options.upgradeable),
        getParents
      ),
    ];
  }
}

export function* generateSources(subset: Subset, kinds?: Kind[]): Generator<GeneratedSource> {
  for (const c of generateContractSubset(subset, kinds)) {
    const source = printContract(c.contract);
    yield { ...c, source };
  }
}

export async function writeGeneratedSources(
  dir: string,
  subset: Subset,
  kinds?: Kind[]
): Promise<void> {
  await fs.mkdir(dir, { recursive: true });

  for (const { id, source } of generateSources(subset, kinds)) {
    await fs.writeFile(path.format({ dir, name: id, ext: ".sol" }), source);
  }
}
