import { Card } from "@/components/ui/Card";
import type { SimulationState } from "@/lib/trading/types";

export function StrategyDecisionTree({ state, beat = 0 }: { state: SimulationState | null; beat?: number }) {
  const decision = state?.decision;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.24em] text-terminal-text">Strategy Decision Tree</h2>
        <p className="text-xs text-terminal-muted">Every trade traced</p>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <p className="text-terminal-muted">{decision?.headline ?? "Waiting for signal route."}</p>
        <p className="text-terminal-accent">Edge Conf {decision?.edgeConfidence.toFixed(1) ?? "--"}%</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox="0 0 960 244" className="min-w-[920px]">
          {decision?.edges.map((edge) => {
            const from = decision.nodes.find((node) => node.id === edge.from);
            const to = decision.nodes.find((node) => node.id === edge.to);
            if (!from || !to) {
              return null;
            }
            const startX = from.x + 54;
            const startY = from.y + 20;
            const endX = to.x;
            const endY = to.y + 20;
            const midX = (startX + endX) / 2;
            const label = edge.label ? truncateLabel(edge.label, 14) : null;
            const labelY = getEdgeLabelY(edge.from, edge.to, startY, endY);
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke={edge.active ? "#6ca66a" : "#a59d89"}
                  strokeWidth={edge.active ? 2.4 : 1.2}
                  strokeDasharray={edge.active ? `${8 + (beat % 8)} 6` : "4 3"}
                />
                {label ? (
                  <text x={midX} y={labelY} textAnchor="middle" fontSize="10" fill="#7a725d">
                    {label}
                  </text>
                ) : null}
              </g>
            );
          })}
          {decision?.nodes.map((node) => {
            const tone =
              node.status === "active"
                ? { fill: "#f4df98", stroke: "#a7770f", text: "#5f460a" }
                : node.status === "success"
                  ? { fill: "#dff0de", stroke: "#4f8b57", text: "#295932" }
                  : node.status === "warning"
                    ? { fill: "#f3ddd8", stroke: "#b56c5b", text: "#713f35" }
                    : { fill: "#f6f1de", stroke: "#b7ae93", text: "#5c5545" };
            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width="108"
                  height="40"
                  rx="4"
                  fill={tone.fill}
                  stroke={tone.stroke}
                  style={node.status === "active" ? { transform: `translateY(${Math.sin(beat / 2) * -2}px)` } : undefined}
                />
                <text
                  x={node.x + 54}
                  y={node.y + 24}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fill={tone.text}
                >
                  {truncateLabel(node.label, 16)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

function truncateLabel(value: string, maxChars: number) {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxChars - 1))}…`;
}

function getEdgeLabelY(from: string, to: string, startY: number, endY: number) {
  if (from === "classify" && to === "misprice") {
    return startY - 10;
  }
  if (from === "misprice" && to === "hold") {
    return endY - 12;
  }
  if (from === "conf" && to === "validate") {
    return startY + 6;
  }

  return (startY + endY) / 2 - 10;
}
