import { Fragment } from "react";

export function ServiceRow({
  id,
  rowNumber,
  name,
  code,
  uom,
  categories,
  status
}) {
  const statusLabel = status || "Inactive";
  const statusActive = status === "Active";

  return (
    <tr>
      <td className="fm-num">{rowNumber}</td>
      <td>
        <div className="fm-name">{name}</div>
      </td>
      <td className="mono fm-code">{code}</td>
      <td>
        <span className="badge badge-muted">{uom}</span>
      </td>
      <td>
        {categories.map((label, index) => (
          <Fragment key={`${label}-${index}`}>
            {index > 0 ? " " : null}
            <span className="badge badge-info">{label}</span>
          </Fragment>
        ))}
      </td>
      <td>
        <span className={`badge ${statusActive ? "badge-success" : "badge-muted"}`}>
          {statusLabel}
        </span>
      </td>
      <td>
        <div className="row-actions">
          <button
            type="button"
            className="btn btn-sm btn-icon"
            data-edit-srv-master={id}
            title="Edit"
          >
            <i data-lucide="pencil"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-danger"
            data-delete-srv-master={id}
            title="Delete"
          >
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}
