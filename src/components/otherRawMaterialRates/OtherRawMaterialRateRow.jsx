export function OtherRawMaterialRateRow({
  id,
  code,
  name,
  rate,
  rateUom,
  dimensions,
  statusLabel,
  statusActive
}) {
  return (
    <tr>
      <td className="mono">{code}</td>
      <td>{name}</td>
      <td>{rate}</td>
      <td>{rateUom}</td>
      <td>{dimensions}</td>
      <td>
        <span className={`badge ${statusActive ? "badge-success" : "badge-muted"}`}>
          {statusLabel}
        </span>
      </td>
      <td>
        <button type="button" className="btn btn-sm" data-edit-other-material-rate={id}>
          Update
        </button>
      </td>
    </tr>
  );
}
