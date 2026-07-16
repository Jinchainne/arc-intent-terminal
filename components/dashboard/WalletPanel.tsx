"use client";

import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ARC_CHAIN_ID } from "@/lib/arc/constants";
import { getExplorerAddressUrl } from "@/lib/arc/explorer";
import { formatAddress, formatTokenBalance } from "@/lib/utils/format";

type WalletPanelProps = {
  address: string;
  displayBalance: string;
  chainId: number | null;
  walletConnected: boolean;
  onConnect: () => Promise<void>;
  onSwitch: () => Promise<void>;
  onReset: () => void;
};

export function WalletPanel({
  address,
  displayBalance,
  chainId,
  walletConnected,
  onConnect,
  onSwitch,
  onReset
}: WalletPanelProps) {
  const chainLabel = chainId ? `${chainId}` : `Target ${ARC_CHAIN_ID}`;

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.24em] text-terminal-text">Wallet Panel</h2>
        <Badge tone={walletConnected ? "positive" : "negative"}>{walletConnected ? "READY" : "OFFLINE"}</Badge>
      </div>
      <div className="space-y-3 text-sm">
        <Row label="Address" value={walletConnected ? formatAddress(address) : "Connect injected wallet"} />
        <Row label="Chain ID" value={chainLabel} />
        <Row label="USDC Balance" value={formatTokenBalance(displayBalance)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onConnect}>Connect Wallet</Button>
        <Button variant="ghost" onClick={onSwitch}>
          Switch to Arc Testnet
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Clear Local State
        </Button>
        {walletConnected ? (
          <a
            href={getExplorerAddressUrl(address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-terminal-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-terminal-muted hover:text-terminal-text"
          >
            Explorer
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-terminal-border px-3 py-2">
      <span className="text-terminal-muted">{label}</span>
      <span className="max-w-[60%] truncate text-right text-terminal-text">{value}</span>
    </div>
  );
}
