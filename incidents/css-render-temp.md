THis timelptase the Doculaulns groitdh which soherd aslo list in hover form by Risk score , which equals likelihood multiplied by impact.

.riskChart {
  position: relative;
  height: 420px;
  border-left: 2px solid #444;
  border-bottom: 2px solid #444;
  background:
    linear-gradient(to right, #ddd 1px, transparent 1px),
    linear-gradient(to top, #ddd 1px, transparent 1px);
  background-size: 25% 25%;
}

.riskPoint {
  position: absolute;
  transform: translate(-50%, 50%);
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 2px solid #842029;
  background: #f8d7da;
  font-weight: 700;
  cursor: pointer;
}

.tooltip {
  display: none;
  position: absolute;
  left: 50%;
  bottom: 130%;
  transform: translateX(-50%);
  width: 280px;
  padding: 12px;
  border: 1px solid #bbb;
  border-radius: 6px;
  background: white;
  color: #111;
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
  text-align: left;
  z-index: 10;
}

.riskPoint:hover .tooltip,
.riskPoint:focus .tooltip {
  display: grid;
  gap: 6px;
}







Then render it as a scatter/pinpoint chart. If this repo uses Docusaurus/MDX, I’d make something like:

<RiskPinpointChart risks={risks} />
The component would map likelihood and impact onto a 10x10 grid:

const left = `${((risk.likelihood - 1) / 9) * 100}%`;
const bottom = `${((risk.impact - 1) / 9) * 100}%`;
Each risk becomes a button positioned on the chart:

<button
  className="riskPoint"
  style={{ left, bottom }}
  aria-label={`${risk.id}: ${risk.title}`}
>
  {risk.id}
  <span className="tooltip">
    <strong>{risk.id}</strong>
    <span>{risk.title}</span>
    <span>Category: {risk.category}</span>
    <span>Score: {risk.score}</span>
    <span>Status: {risk.status}</span>
    <span>Mitigation: {risk.mitigation}</span>
  </span>
</button>

