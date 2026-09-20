export function BomCostAlert({ errors }) {
  if (!errors || !errors.length) return null;

  return (
    <div className="cost-alert" role="alert">
      <div className="cost-alert-title">Error calculating cost — fix these first</div>
      <ul>
        {errors.map((item, index) => (
          <li key={index}>
            {item.label} ({item.section}): {item.error}
          </li>
        ))}
      </ul>
    </div>
  );
}
