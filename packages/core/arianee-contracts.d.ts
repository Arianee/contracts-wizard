export interface ArianeeContracts {
  version: string;
  sources: Record<string, string>;
  dependencies: Record<string, string[]>;
}

declare const contracts: ArianeeContracts;

export default contracts;
