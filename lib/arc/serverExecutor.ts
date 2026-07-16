import { createPublicClient, http } from "viem";

import { arcTestnet } from "@/lib/arc/chain";
import { ARC_RPC_URL } from "@/lib/arc/constants";

export async function getArcTxStatus(hash: `0x${string}`) {
  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(ARC_RPC_URL)
  });

  const [tx, receipt] = await Promise.all([
    publicClient.getTransaction({ hash }).catch(() => null),
    publicClient.getTransactionReceipt({ hash }).catch(() => null)
  ]);

  if (!tx) {
    return {
      found: false,
      status: "missing" as const,
      contractAddress: null
    };
  }

  if (!receipt) {
    return {
      found: true,
      status: "pending" as const,
      contractAddress: null
    };
  }

  return {
    found: true,
    status: receipt.status === "success" ? ("confirmed" as const) : ("reverted" as const),
    contractAddress: receipt.contractAddress ?? null
  };
}
