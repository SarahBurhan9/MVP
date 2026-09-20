export function BomListRow({
  id,
  rowNumber,
  bomNo,
  finishedGoodName,
  variant,
  version,
  statusLabel,
  statusActive,
  finalCost,
  updatedAt
}) {
  return (
    <tr>
      <td className="fm-num">{rowNumber}</td>
      <td className="mono fm-code">{bomNo}</td>
      <td>
        <div className="fm-name">{finishedGoodName}</div>
      </td>
      <td>{variant}</td>
      <td>
        <span className="badge badge-info">{version}</span>
      </td>
      <td>
        <span className={`badge ${statusActive ? "badge-success" : "badge-muted"}`}>
          {statusLabel}
        </span>
      </td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{finalCost}</code>
      </td>
      <td className="fm-code">{updatedAt}</td>
      <td>
        <div className="row-actions">
          <button type="button" className="btn btn-sm" data-load-bom={id}>
            View / Edit
          </button>
          <button type="button" className="btn btn-sm btn-duplicate" data-duplicate-bom={id}>
            Duplicate
          </button>
        </div>
      </td>
    </tr>
  );
}
