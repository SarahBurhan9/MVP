import { FinishedGoodRow } from "./FinishedGoodRow.jsx";

export function FinishedGoodsTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <FinishedGoodRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={9}>
            <div className="empty">No finished goods match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table fm-table" style={{ minWidth: 1100 }}>
      <thead>
        <tr>
          <th className="fm-num">#</th>
          <th>Product</th>
          <th>Style</th>
          <th>Variant</th>
          <th>Dimensions</th>
          <th>Ply</th>
          <th>UOM</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
