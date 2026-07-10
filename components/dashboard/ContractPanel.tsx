"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deployTradeIntentLedgerWithBrowserWallet } from "@/lib/arc/wallet";
import { getExplorerAddressUrl, getExplorerTxUrl } from "@/lib/arc/explorer";
import { formatAddress } from "@/lib/utils/format";

type ContractPanelProps = {
  walletConnected: boolean;
  ledgerAddress: string;
  deploymentTxHash: string;
  onLedgerDeployed: (next: { ledgerAddress: string; txHash: string }) => void;
};

export function ContractPanel({
  walletConnected,
  ledgerAddress,
  deploymentTxHash,
  onLedgerDeployed
}: ContractPanelProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(
    ledgerAddress
      ? "Ledger is ready for testnet-contract mode."
      : "Deploy a fresh ArcTradeIntentLedger with your browser wallet to enable real Arc testnet logging."
  );

  async function deployLedger() {
    setPending(true);
    try {
      const deployed = await deployTradeIntentLedgerWithBrowserWallet();
      onLedgerDeployed({
        ledgerAddress: deployed.contractAddress,
        txHash: deployed.hash
      });
      setMessage("Ledger deployed successfully. Contract mode can now write real testnet intents.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Contract deployment failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.24em] text-terminal-text">Contract Panel</h2>
        <p className="text-xs text-terminal-accent">ARC TESTNET LEDGER</p>
      </div>
      <div className="space-y-3 text-sm">
        <Row label="Wallet" value={walletConnected ? "Connected" : "Connect wallet first"} />
        <Row label="Ledger" value={ledgerAddress ? formatAddress(ledgerAddress) : "Not deployed yet"} />
        <Row label="Deploy Tx" value={deploymentTxHash ? `${deploymentTxHash.slice(0, 14)}...` : "None"} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={deployLedger} disabled={!walletConnected || pending}>
          {pending ? "Deploying..." : ledgerAddress ? "Redeploy Ledger" : "Deploy Ledger"}
        </Button>
        {ledgerAddress ? (
          <a
            href={getExplorerAddressUrl(ledgerAddress)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-terminal-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-terminal-muted hover:text-terminal-text"
          >
            Contract
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
        {deploymentTxHash ? (
          <a
            href={getExplorerTxUrl(deploymentTxHash)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-terminal-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-terminal-muted hover:text-terminal-text"
          >
            Deploy Tx
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
      <div className="mt-4 border border-terminal-border bg-terminal-panelAlt p-3 text-xs text-terminal-text">
        {message}
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-terminal-border px-3 py-2">
      <span className="text-terminal-muted">{label}</span>
      <span className="text-terminal-text">{value}</span>
    </div>
  );
}
