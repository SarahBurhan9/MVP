export function RawMaterialRateRow({
  id,
  rowNumber,
  name,
  code,
  rate,
  rateUom,
  dimensions,
  statusLabel,
  statusActive
}) {
  return (
    <tr>
      <td className="fm-num">{rowNumber}</td>
      <td>
        <div className="fm-name">{name}</div>
      </td>
      <td className="mono fm-code">{code}</td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{rate}</code>
      </td>
      <td>
        <span className="badge badge-muted">{rateUom}</span>
      </td>
      <td>{dimensions}</td>
      <td>
        <span className={`badge ${statusActive ? "badge-success" : "badge-muted"}`}>
          {statusLabel}
        </span>
      </td>
      <td>
        <button type="button" className="btn btn-sm" data-edit-material-rate={id}>
          Update
        </button>
      </td>
    </tr>
  );
}
