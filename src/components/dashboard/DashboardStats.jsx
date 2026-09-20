import { StatCard } from "./StatCard.jsx";

export function DashboardStats({
  finishedGoodsCount,
  rawMaterialsCount,
  otherRawMaterialsCount,
  servicesCount,
  formulasCount,
  activeFormulas,
  bomsCount,
  activeBoms,
  formulaVariablesCount,
  dimensionsCount,
  stylesCount,
  materialRatesCount,
  otherMaterialRatesCount,
  serviceRatesCount
}) {
  return (
    <>
      <StatCard
        label="Total Finished Goods"
        value={finishedGoodsCount}
        hint="Product / variant masters"
        page="finished-goods"
      />
      <StatCard
        label="Total Raw Materials"
        value={rawMaterialsCount}
        hint="Purchasing rate source"
        page="raw-materials"
      />
      <StatCard
        label="Total Other Raw Materials"
        value={otherRawMaterialsCount}
        hint="Purchasing rate source"
        page="other-raw-materials"
      />
      <StatCard
        label="Total Services"
        value={servicesCount}
        hint="Process rate source"
        page="services"
      />
      <StatCard
        label="Formula Definitions"
        value={formulasCount}
        hint={`${activeFormulas} active`}
        page="formulas"
      />
      <StatCard
        label="Saved BOMs"
        value={bomsCount}
        hint="Draft and Active versions"
        page="bom-list"
      />
      <StatCard
        label="Active BOMs"
        value={activeBoms}
        hint="Only BOMs with Active status"
        page="bom-list"
      />
      <StatCard
        label="Variables"
        value={formulaVariablesCount}
        hint="Shared formula variables"
        page="formula-variables"
      />
      <StatCard
        label="Dimension"
        value={dimensionsCount}
        hint="Dimension master"
        page="dimensions"
      />
      <StatCard
        label="Style"
        value={stylesCount}
        hint="Style master"
        page="style"
      />
      <StatCard
        label="Raw Material Rates"
        value={materialRatesCount}
        hint="Purchasing rates"
        page="raw-material-rates"
      />
      <StatCard
        label="Other Raw Material Rates"
        value={otherMaterialRatesCount}
        hint="Purchasing rates"
        page="other-raw-material-rates"
      />
      <StatCard
        label="Service Rates"
        value={serviceRatesCount}
        hint="Process pricing"
        page="service-rates"
      />
      <StatCard
        label="BOM & Costing"
        value="Editor"
        hint="Build a BOM"
        page="bom-costing"
      />
      <StatCard
        label="BOM List"
        value="Open"
        hint="View drafts and versions"
        page="bom-list"
      />
      <StatCard
        label="Cost Calculator"
        value="Estimate"
        hint="Quick cost by style and size"
        page="cost-calculator"
      />
    </>
  );
}
