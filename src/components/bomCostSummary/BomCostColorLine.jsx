export function BomCostColorLine({ visible, amount }) {
  if (!visible) return null;

  return (
    <div className="cost-color-line">
      <span>Color Printing Cost</span>
      <strong>{amount}</strong>
    </div>
  );
}
