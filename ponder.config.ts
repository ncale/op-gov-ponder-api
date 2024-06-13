import { createConfig, mergeAbis } from "@ponder/core";
import { http } from "viem";

import { TransparentUpgradeableProxyAbi } from "./abis/TransparentUpgradeableProxyAbi";
import { OptimismGovernorV1_0x9d66Abi } from "./abis/OptimismGovernorV1_0x9d66Abi";
import { OptimismGovernorV2_0x0457Abi } from "./abis/OptimismGovernorV2_0x0457Abi";
import { OptimismGovernorV4_0x8518Abi } from "./abis/OptimismGovernorV4_0x8518Abi";
import { OptimismGovernorV5_0x160bAbi } from "./abis/OptimismGovernorV5_0x160bAbi";
import { OptimismGovernorV6_0x0c01Abi } from "./abis/OptimismGovernorV6_0x0c01Abi";
import { GovernanceTokenAbi } from "./abis/GovernanceTokenAbi";

export default createConfig({
  networks: {
    optimism: {
      chainId: 10,
      transport: http(process.env.PONDER_RPC_URL_10),
      pollingInterval: 3_000,
      maxRequestsPerSecond: 40,
    },
  },
  contracts: {
    OptimismGovernorV6: {
      abi: mergeAbis([
        TransparentUpgradeableProxyAbi,
        OptimismGovernorV1_0x9d66Abi,
        OptimismGovernorV2_0x0457Abi,
        OptimismGovernorV4_0x8518Abi,
        OptimismGovernorV5_0x160bAbi,
        OptimismGovernorV6_0x0c01Abi,
      ]),
      address: "0xcdf27f107725988f2261ce2256bdfcde8b382b10",
      network: "optimism",
      // startBlock: 112131709,
      startBlock: 71801427,
    },
    GovernanceToken: {
      abi: GovernanceTokenAbi,
      address: "0x4200000000000000000000000000000000000042",
      network: "optimism",
      startBlock: 114636709, // 6490467
      maxBlockRange: 2000,
    },
  },
});
