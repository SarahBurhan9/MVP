    /* ==================================================
       Static master data
       ================================================== */

    const finishedGoods = [
      {
        id: 1,
        product: "Cake Box",
        variant: "1 Pound",
        style: "Window Lid",
        material: "CARD BOARD",
        ply: 3,
        dimensions: { L: 7, W: 7, H: 4 },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      },
      {
        id: 2,
        product: "Cake Box",
        variant: "2 Pound",
        style: "Window Lid",
        material: "CARD BOARD",
        ply: 3,
        dimensions: { L: 9, W: 9, H: 5 },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      },
      {
        id: 3,
        product: "Pizza Box",
        variant: "Large",
        style: "Locking Flap",
        material: "KRAFT PAPER",
        ply: 3,
        dimensions: { L: 12, W: 12, H: 2 },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      },
      {
        id: 1004,
        product: "SINGLE PLY BOX",
        variant: "STANDARD",
        style: "SIMPLE LID",
        material: "KRAFT PAPER",
        ply: 1,
        dimensions: { L: 10, W: 10, H: 5 },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      },
      {
        id: 1005,
        product: "PIZZA BOX",
        variant: "MEDIUM",
        style: "STANDARD",
        material: "KRAFT + FLUTING",
        ply: 2,
        dimensions: { L: 12, W: 12, H: 2 },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      }
    ];

    const styles = [
      { id: 1, code: "WINDOW-LID", name: "Window Lid", description: "Carton with a window lid", status: "Active" },
      { id: 2, code: "LOCKING-FLAP", name: "Locking Flap", description: "Locking flap carton", status: "Active" },
      { id: 3, code: "SIMPLE-LID", name: "SIMPLE LID", description: "Simple lid carton", status: "Active" },
      { id: 4, code: "STANDARD", name: "STANDARD", description: "Standard carton style", status: "Active" }
    ];

    const dimensions = [
      { id: 1, code: "7x7x4", L: 7, W: 7, H: 4, uom: "inch", status: "Active" },
      { id: 2, code: "9x9x5", L: 9, W: 9, H: 5, uom: "inch", status: "Active" },
      { id: 3, code: "12x12x2", L: 12, W: 12, H: 2, uom: "inch", status: "Active" },
      { id: 4, code: "10x10x5", L: 10, W: 10, H: 5, uom: "inch", status: "Active" }
    ];

    const rawMaterials = [
      { id: 101, code: "RM-KRAFT-125", name: "Kraft Paper 125 GSM", category: "Paper", uom: "kg", purchasingRate: 165, rateUOM: "kg", gsm: 125, status: "Active" },
      { id: 102, code: "RM-KRAFT-150", name: "Kraft Paper 150 GSM", category: "Paper", uom: "kg", purchasingRate: 185, rateUOM: "kg", gsm: 150, status: "Active" },
      { id: 103, code: "RM-FLUTE-120", name: "Fluting Paper 120 GSM", category: "Paper", uom: "kg", purchasingRate: 155, rateUOM: "kg", gsm: 120, status: "Active" },
      { id: 104, code: "RM-FLUTE-140", name: "Fluting Paper 140 GSM", category: "Paper", uom: "kg", purchasingRate: 175, rateUOM: "kg", gsm: 140, status: "Active" },
      { id: 105, code: "RM-DUPLEX-300", name: "Duplex Board 300 GSM", category: "Board", uom: "kg", purchasingRate: 160, rateUOM: "kg", gsm: 300, status: "Active" },
      { id: 106, code: "RM-DUPLEX-350", name: "Duplex Board 350 GSM", category: "Board", uom: "kg", purchasingRate: 175, rateUOM: "kg", gsm: 350, status: "Active" },
      { id: 107, code: "RM-SHEET-3PLY", name: "Corrugated Sheet 3 Ply", category: "Sheet", uom: "sheet", purchasingRate: 150, rateUOM: "sheet", gsm: null, status: "Active" },
      { id: 108, code: "RM-FILM-WIN", name: "Window Film", category: "Film", uom: "kg", purchasingRate: 300, rateUOM: "kg", gsm: null, status: "Active" },
      { id: 109, code: "RM-INK-PRINT", name: "Printing Ink", category: "Consumable", uom: "kg", purchasingRate: 800, rateUOM: "kg", gsm: null, status: "Active" },
      { id: 110, code: "RM-GLUE-ADH", name: "Glue / Adhesive", category: "Consumable", uom: "kg", purchasingRate: 600, rateUOM: "kg", gsm: null, status: "Active" },
      { id: 111, code: "RM-BOARD-CORR", name: "Corrugated Board", category: "Board", uom: "sq.meter", purchasingRate: 150, rateUOM: "sq.meter", gsm: 180, status: "Active" }
    ];

    const services = [
      { id: 201, code: "SRV-PRINT", name: "Printing", uom: "pieces", serviceRate: 3.5, rateUOM: "piece", status: "Active" },
      { id: 202, code: "SRV-DIECUT", name: "Die Cutting", uom: "pieces", serviceRate: 2, rateUOM: "piece", status: "Active" },
      { id: 203, code: "SRV-LAM", name: "Lamination", uom: "pieces", serviceRate: 4.5, rateUOM: "piece", status: "Active" },
      { id: 204, code: "SRV-PASTE", name: "Pasting", uom: "pieces", serviceRate: 1, rateUOM: "piece", status: "Active" },
      { id: 205, code: "SRV-WINPASTE", name: "Window Pasting", uom: "pieces", serviceRate: 1.25, rateUOM: "piece", status: "Active" },
      { id: 206, code: "SRV-STITCH", name: "Stitching", uom: "pieces", serviceRate: 0.85, rateUOM: "piece", status: "Active" },
      { id: 207, code: "SRV-PLATE", name: "Plate", uom: "job", serviceRate: 1800, rateUOM: "job", status: "Active" },
      { id: 208, code: "SRV-LABOUR", name: "Labour", uom: "pieces", serviceRate: 4.5, rateUOM: "piece", status: "Active" }
    ];

    const formulas = [
      {
        id: 301,
        code: "FLAT_LENGTH",
        name: "Flat Length",
        type: "Material",
        description: "Unfolded carton length including glue flap.",
        expression: "2 * L + 2 * W + GLUE_FLAP",
        isActive: true
      },
      {
        id: 302,
        code: "FLAT_WIDTH",
        name: "Flat Width",
        type: "Material",
        description: "Unfolded carton width from height and base width.",
        expression: "2 * H + W",
        isActive: true
      },
      {
        id: 303,
        code: "FLAT_AREA",
        name: "Flat Area",
        type: "Material",
        description: "Blank area from flat length and width.",
        expression: "FLAT_LENGTH * FLAT_WIDTH",
        isActive: true
      },
      {
        id: 304,
        code: "COVERED_AREA",
        name: "Covered Area",
        type: "Material",
        description: "Material coverage area for the finished blank.",
        expression: "FLAT_AREA",
        isActive: true
      },
      {
        id: 305,
        code: "SHEET_WEIGHT",
        name: "Sheet Weight",
        type: "Material",
        description: "Weight from covered area and GSM.",
        expression: "COVERED_AREA * GSM * SQ_IN_TO_SQ_M / 1000",
        isActive: true
      },
      {
        id: 306,
        code: "GROSS_QTY",
        name: "Gross Quantity With Wastage",
        type: "Material",
        description: "Net quantity inflated by wastage percent.",
        expression: "NET_QTY * (1 + WASTAGE / 100)",
        isActive: true
      },
      {
        id: 307,
        code: "PIECES_PER_SHEET",
        name: "Pieces From Sheet",
        type: "Material",
        description: "How many pieces nest on one sheet.",
        expression: "SHEET_AREA / PIECE_AREA",
        isActive: true
      },
      {
        id: 308,
        code: "REQUIRED_SHEETS",
        name: "Required Sheets",
        type: "Material",
        description: "Sheets needed for the order quantity.",
        expression: "ORDER_QTY / PIECES_PER_SHEET",
        isActive: true
      },
      {
        id: 309,
        code: "PRINTING_COST",
        name: "Printing Cost",
        type: "Service",
        description: "Printing charge from print area and service rate.",
        expression: "PRINT_AREA * SERVICE_RATE",
        isActive: true
      },
      {
        id: 310,
        code: "PIECE_COST",
        name: "Per Piece Cost",
        type: "Service",
        description: "Rolled-up material and service cost per piece.",
        expression: "MATERIAL_COST + SERVICE_COST",
        isActive: true
      },
      {
        id: 311,
        code: "PRINTING_QTY",
        name: "Printing Qty",
        type: "Service",
        description: "Printing quantity per finished piece.",
        expression: "1",
        isActive: true
      },
      {
        id: 312,
        code: "DIE_CUTTING_QTY",
        name: "Die Cutting Qty",
        type: "Service",
        description: "Die cutting quantity per finished piece.",
        expression: "1",
        isActive: true
      },
      {
        id: 313,
        code: "WINDOW_PASTING_QTY",
        name: "Window Pasting Qty",
        type: "Service",
        description: "Window pasting quantity per finished piece.",
        expression: "1",
        isActive: true
      },
      {
        id: 314,
        code: "PASTING_QTY",
        name: "Pasting Qty",
        type: "Service",
        description: "Pasting quantity per finished piece.",
        expression: "1",
        isActive: true
      }
    ];

    /* Transaction / configuration data. Do not mix with master data. */
    const boms = [];

    const SQ_IN_TO_SQ_M = 0.00064516;
    const GRAM_TO_KG = 0.001;
    const DEFAULT_GLUE_FLAP = 1;
    const DEFAULT_WASTAGE_PERCENT = 5;
    const STRUCTURAL_PLY_LAYERS = {
      1: ["Single Layer"],
      2: ["Top Liner", "Bottom Liner"],
      3: ["Top Liner", "Fluting", "Bottom Liner"]
    };

    /* Sample BOM configuration only. Rates and quantities are calculated at runtime. */
    const sampleBomMaterials = {
      1: [
        { rawMaterialId: 101, layer: "Top Liner", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 103, layer: "Fluting", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 102, layer: "Bottom Liner", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 108, layer: "Other", calculationMethod: "manual", formulaCode: null, manualQty: 0.002, wastagePercent: 5 },
        { rawMaterialId: 110, layer: "Other", calculationMethod: "manual", formulaCode: null, manualQty: 0.004, wastagePercent: 5 }
      ],
      2: [
        { rawMaterialId: 101, layer: "Top Liner", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 104, layer: "Fluting", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 102, layer: "Bottom Liner", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 108, layer: "Other", calculationMethod: "manual", formulaCode: null, manualQty: 0.0025, wastagePercent: 5 },
        { rawMaterialId: 110, layer: "Other", calculationMethod: "manual", formulaCode: null, manualQty: 0.005, wastagePercent: 5 }
      ],
      3: [
        { rawMaterialId: 102, layer: "Top Liner", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 104, layer: "Fluting", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 102, layer: "Bottom Liner", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 110, layer: "Other", calculationMethod: "manual", formulaCode: null, manualQty: 0.006, wastagePercent: 5 }
      ],
      1004: [
        { rawMaterialId: 101, layer: "Single Layer", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 }
      ],
      1005: [
        { rawMaterialId: 101, layer: "Top Liner", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 },
        { rawMaterialId: 103, layer: "Bottom Liner", calculationMethod: "formula", formulaCode: "SHEET_WEIGHT", manualQty: null, wastagePercent: 5 }
      ]
    };

    const sampleBomServices = {
      1: [
        { serviceId: 201, calculationMethod: "formula", formulaCode: "PRINTING_QTY", manualQty: null },
        { serviceId: 202, calculationMethod: "formula", formulaCode: "DIE_CUTTING_QTY", manualQty: null },
        { serviceId: 205, calculationMethod: "formula", formulaCode: "WINDOW_PASTING_QTY", manualQty: null },
        { serviceId: 204, calculationMethod: "formula", formulaCode: "PASTING_QTY", manualQty: null }
      ],
      2: [
        { serviceId: 201, calculationMethod: "formula", formulaCode: "PRINTING_QTY", manualQty: null },
        { serviceId: 202, calculationMethod: "formula", formulaCode: "DIE_CUTTING_QTY", manualQty: null },
        { serviceId: 205, calculationMethod: "formula", formulaCode: "WINDOW_PASTING_QTY", manualQty: null },
        { serviceId: 204, calculationMethod: "formula", formulaCode: "PASTING_QTY", manualQty: null }
      ],
      3: [
        { serviceId: 201, calculationMethod: "formula", formulaCode: "PRINTING_QTY", manualQty: null },
        { serviceId: 202, calculationMethod: "formula", formulaCode: "DIE_CUTTING_QTY", manualQty: null },
        { serviceId: 204, calculationMethod: "formula", formulaCode: "PASTING_QTY", manualQty: null }
      ],
      1004: [
        { serviceId: 201, calculationMethod: "formula", formulaCode: "PRINTING_QTY", manualQty: null },
        { serviceId: 202, calculationMethod: "formula", formulaCode: "DIE_CUTTING_QTY", manualQty: null }
      ],
      1005: [
        { serviceId: 201, calculationMethod: "formula", formulaCode: "PRINTING_QTY", manualQty: null },
        { serviceId: 202, calculationMethod: "formula", formulaCode: "DIE_CUTTING_QTY", manualQty: null },
        { serviceId: 204, calculationMethod: "formula", formulaCode: "PASTING_QTY", manualQty: null }
      ]
    };

    let bomLineSeq = 1;
    let bomSeq = 1;
    let formulaSeq = formulas.reduce((max, item) => Math.max(max, item.id), 300) + 1;

    const BASE_VARIABLES = [
      "L", "W", "H", "GSM", "PLY", "GLUE_FLAP", "WASTAGE", "NET_QTY", "ORDER_QTY",
      "SHEET_LENGTH", "SHEET_WIDTH", "SHEET_AREA", "PIECE_AREA",
      "FLAT_LENGTH", "FLAT_WIDTH", "FLAT_AREA", "COVERED_AREA",
      "MATERIAL_RATE", "SERVICE_RATE", "PRINT_AREA", "MATERIAL_COST", "SERVICE_COST"
    ];

    const ENGINE_CONSTANTS = {
      SQ_IN_TO_SQ_M,
      GRAM_TO_KG,
      CONVERSION_FACTOR: 1 / (SQ_IN_TO_SQ_M * GRAM_TO_KG)
    };

    const DEFAULT_TEST_VALUES = {
      L: 7,
      W: 7,
      H: 4,
      GSM: 125,
      PLY: 3,
      GLUE_FLAP: 1,
      WASTAGE: 5,
      NET_QTY: 1,
      ORDER_QTY: 1,
      SHEET_LENGTH: 40,
      SHEET_WIDTH: 48,
      SHEET_AREA: 1920,
      PIECE_AREA: 435,
      MATERIAL_RATE: 300,
      SERVICE_RATE: 2.5,
      PRINT_AREA: 435,
      MATERIAL_COST: 0,
      SERVICE_COST: 0
    };

    /* ==================================================
       Application state
       ================================================== */

    const PAGE_META = {
      dashboard: { title: "Dashboard", subtitle: "Manufacturing overview" },
      "finished-goods": { title: "Finished Goods", subtitle: "Product master" },
      "raw-materials": { title: "Raw Materials", subtitle: "Purchasing master" },
      services: { title: "Services", subtitle: "Conversion & process rates" },
      style: { title: "Style", subtitle: "Style master" },
      dimensions: { title: "Dimensions", subtitle: "Dimension master" },
      formulas: { title: "Formula Management", subtitle: "Definitions, builder, and validation" },
      "bom-costing": { title: "BOM & Costing", subtitle: "Select a finished good to begin" },
      "bom-list": { title: "BOM List", subtitle: "Saved drafts and active versions" }
    };

    const state = {
      currentPage: "dashboard",
      searches: {
        finishedGoods: "",
        rawMaterials: "",
        services: "",
        style: "",
        dimensions: "",
        formulas: "",
        bomFinishedGood: "",
        boms: ""
      },
      formulaFilter: "all",
      bomListFilter: "all",
      workflowError: "",
      notification: null,
      sidebarOpen: false,
      selectedFinishedGoodId: null,
      currentBOM: null,
      bomMaterials: [],
      bomServices: [],
      totalMaterialCost: 0,
      totalServiceCost: 0,
      finalCostPerPiece: 0,
      costPer100: 0,
      costPer1000: 0,
      fgSelectorOpen: false,
      modal: {
        type: null,
        selectedId: null,
        mode: "add",
        lineId: null,
        draft: null,
        errors: {}
      }
    };

    /* ==================================================
       Utility functions
       ================================================== */

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function formatNumber(value, decimals) {
      if (value === null || value === undefined || Number.isNaN(value)) return "—";
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: decimals ?? 0,
        maximumFractionDigits: decimals ?? 0
      });
    }

    function formatMoney(value) {
      return formatNumber(value, 2);
    }

    function formatCurrency(value) {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
      return "Rs. " + Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    function formatRateUnit(rateUom) {
      return String(rateUom || "").replace(/^Rs\.?\s*\/\s*/i, "").trim();
    }

    function formatRatePkr(rate, rateUom) {
      if (rate === null || rate === undefined || Number.isNaN(Number(rate))) return "—";
      const unit = formatRateUnit(rateUom) || "unit";
      return `${formatCurrency(rate)}/${unit}`;
    }

    function formatDimensions(item) {
      const dims = item.dimensions || item;
      const { L, W, H } = dims;
      return `${L} × ${W} × ${H} ${item.dimensionUOM || item.uom || ""}`.trim();
    }

    function formatRupees(value) {
      return formatCurrency(value);
    }

    function formatFinishedGoodDisplayName(item) {
      const dims = `${item.dimensions.L}x${item.dimensions.W}x${item.dimensions.H}`;
      return [item.product, item.style, item.material, item.variant, dims]
        .filter((part) => part !== null && part !== undefined && String(part).trim() !== "")
        .join(" ");
    }

    function formatFinishedGoodOption(item) {
      return `${formatFinishedGoodDisplayName(item)} — ${item.ply} Ply`;
    }

    function nextMasterId(items) {
      const ids = items.map((item) => Number(item.id) || 0);
      return (ids.length ? Math.max(...ids) : 0) + 1;
    }

    function getPlyLayers(plyCount) {
      return STRUCTURAL_PLY_LAYERS[Number(plyCount)] || STRUCTURAL_PLY_LAYERS[3];
    }

    function getStructuralLayers(plyCount) {
      return STRUCTURAL_PLY_LAYERS[Number(plyCount)] || STRUCTURAL_PLY_LAYERS[3];
    }

    function getLayerOptionsForEditor(currentLayer) {
      const fg = getSelectedFinishedGood();
      const layers = getPlyLayers(fg ? fg.ply : 3);
      if (currentLayer && !layers.includes(currentLayer)) return layers.concat([currentLayer]);
      return layers;
    }

    function getFinishedGoodMaterialOptions() {
      const fromRm = rawMaterials.map((item) => item.name);
      const fromFg = finishedGoods.map((item) => item.material).filter(Boolean);
      return [...new Set(fromFg.concat(fromRm))].sort((a, b) => String(a).localeCompare(String(b)));
    }

    function normalizeUnit(unit) {
      const raw = String(unit || "").trim().toLowerCase().replace(/\s+/g, "");
      const stripped = raw.replace(/^rs\.?\//, "");
      const map = {
        kg: "kg",
        kgs: "kg",
        kilogram: "kg",
        kilograms: "kg",
        gm: "gm",
        g: "gm",
        gram: "gm",
        grams: "gm",
        sheet: "sheet",
        sheets: "sheet",
        piece: "piece",
        pieces: "piece",
        pcs: "piece",
        "1000pieces": "1000piece",
        "1000piece": "1000piece",
        "1000pcs": "1000piece",
        "sq.m": "sqm",
        "sq.meter": "sqm",
        "sq.metre": "sqm",
        sqm: "sqm",
        sqmeter: "sqm",
        squaremeter: "sqm",
        "sq.inch": "sqin",
        sqinch: "sqin",
        "sq.in": "sqin",
        meter: "m",
        metre: "m",
        m: "m",
        inch: "inch",
        job: "job",
        box: "box"
      };
      return map[stripped] || map[raw] || stripped || raw;
    }

    function convertQuantity(qty, fromUnit, toUnit, extras) {
      const n = Number(qty);
      if (!Number.isFinite(n)) return n;
      const from = normalizeUnit(fromUnit);
      const to = normalizeUnit(toUnit);
      if (!from || !to || from === to) return n;

      const meta = extras || {};
      const gsm = meta.gsm != null && meta.gsm !== "" ? Number(meta.gsm) : null;
      const sheetAreaSqIn = Number(meta.sheetArea != null ? meta.sheetArea : DEFAULT_TEST_VALUES.SHEET_AREA);
      const sheetAreaSqM = sheetAreaSqIn * SQ_IN_TO_SQ_M;

      function toKg(value, unit) {
        if (unit === "kg") return value;
        if (unit === "gm") return value / 1000;
        if (unit === "sqm" && gsm) return value * gsm / 1000;
        if (unit === "sheet" && gsm) return value * sheetAreaSqM * gsm / 1000;
        return null;
      }

      function fromKg(value, unit) {
        if (unit === "kg") return value;
        if (unit === "gm") return value * 1000;
        if (unit === "sqm" && gsm) return value * 1000 / gsm;
        if (unit === "sheet" && gsm) return value / (sheetAreaSqM * gsm / 1000);
        return null;
      }

      const asKg = toKg(n, from);
      if (asKg != null) {
        const converted = fromKg(asKg, to);
        if (converted != null && Number.isFinite(converted)) return converted;
      }

      if (from === "piece" && to === "1000piece") return n / 1000;
      if (from === "1000piece" && to === "piece") return n * 1000;
      if (from === "sqin" && to === "sqm") return n * SQ_IN_TO_SQ_M;
      if (from === "sqm" && to === "sqin") return n / SQ_IN_TO_SQ_M;
      if (from === "sqin" && to === "m") return n * SQ_IN_TO_SQ_M;
      return n;
    }

    function convertRate(rate, fromUnit, toUnit, gsm = null) {
      const n = Number(rate);
      if (!Number.isFinite(n)) return n;
      const from = normalizeUnit(fromUnit);
      const to = normalizeUnit(toUnit);
      if (from === to) return n;
      return n * convertQuantity(1, to, from, { gsm });
    }

    function getSelectedFinishedGood() {
      if (state.selectedFinishedGoodId == null) return null;
      return finishedGoods.find((item) => item.id === state.selectedFinishedGoodId) || null;
    }

    function generateBomNo(item) {
      const family = item.product.replace(/\s*Box$/i, "").trim().toUpperCase().replace(/\s+/g, "-");
      const siblings = finishedGoods.filter((fg) => fg.product === item.product);
      const sequence = siblings.findIndex((fg) => fg.id === item.id) + 1;
      return `BOM-${family}-${String(sequence).padStart(3, "0")}`;
    }

    function nextBomId() {
      const id = bomSeq;
      bomSeq += 1;
      return id;
    }

    function parseVersion(value) {
      const number = parseFloat(String(value || "").replace(/^v/i, ""));
      return Number.isFinite(number) ? number : 0;
    }

    function formatVersion(value) {
      return Number(value).toFixed(1);
    }

    function formatDateTime(value) {
      if (!value) return "—";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "—";
      return date.toLocaleString();
    }

    function getBomsForFinishedGood(finishedGoodId) {
      return boms.filter((item) => item.finishedGoodId === Number(finishedGoodId));
    }

    function getBomNoForFinishedGood(item) {
      const existing = getBomsForFinishedGood(item.id)[0];
      return existing ? existing.bomNo : generateBomNo(item);
    }

    function nextVersionForBomNo(bomNo) {
      const versions = boms.filter((item) => item.bomNo === bomNo).map((item) => parseVersion(item.version));
      const max = versions.length ? Math.max(...versions) : 0;
      return formatVersion(max + 1);
    }

    function cloneData(value) {
      if (value === undefined) return undefined;
      return JSON.parse(JSON.stringify(value));
    }

    function getStoredBom(id) {
      return boms.find((item) => item.id === Number(id)) || null;
    }

    function findLatestDraftForBomNo(bomNo) {
      return boms
        .filter((item) => item.bomNo === bomNo && item.status === "Draft")
        .sort((a, b) => parseVersion(b.version) - parseVersion(a.version))[0] || null;
    }

    function findActiveBomForNumber(bomNo) {
      return boms.find((item) => item.bomNo === bomNo && item.status === "Active") || null;
    }

    function syncEditorBomMeta(record) {
      state.currentBOM = {
        id: record.id,
        bomNo: record.bomNo,
        finishedGoodId: record.finishedGoodId,
        version: record.version,
        status: record.status,
        createdAt: record.createdAt
      };
    }

    function copyLinesForEditor(record) {
      return {
        materials: cloneData(record.materials || []).map((line) => ({
          ...line,
          id: nextBomLineId(),
          netQty: 0,
          grossQty: 0,
          rate: 0,
          costPerPiece: 0
        })),
        services: cloneData(record.services || []).map((line) => ({
          ...line,
          id: nextBomLineId(),
          quantity: 0,
          rate: 0,
          costPerPiece: 0
        }))
      };
    }

    function showNotification(message, type) {
      state.notification = { message, type: type || "success" };
      const toast = document.getElementById("app-toast");
      if (!toast) return;
      toast.hidden = false;
      toast.className = "toast show toast-" + state.notification.type;
      toast.textContent = message;
      clearTimeout(state.notificationTimer);
      state.notificationTimer = setTimeout(() => {
        state.notification = null;
        toast.classList.remove("show");
        toast.hidden = true;
      }, 3500);
    }

    function setWorkflowError(message) {
      state.workflowError = message || "";
      if (message) showNotification(message, "error");
      renderBOMHeader();
    }

    function filterBomFinishedGoods(query) {
      return finishedGoods.filter((item) =>
        matchesQuery(
          [item.product, item.variant, item.style, item.material, item.ply, item.dimensions.L, item.dimensions.W, item.dimensions.H, formatDimensions(item), formatFinishedGoodDisplayName(item)],
          query
        )
      );
    }

    function formatQty(value) {
      return formatNumber(value, 4);
    }

    function nextBomLineId() {
      return bomLineSeq++;
    }

    function getRawMaterial(id) {
      return rawMaterials.find((item) => item.id === Number(id)) || null;
    }

    function getService(id) {
      return services.find((item) => item.id === Number(id)) || null;
    }

    function getServiceFormulas() {
      return formulas.filter((item) => item.type === "Service" && item.isActive);
    }

    function getFormula(id) {
      return formulas.find((item) => item.id === Number(id)) || null;
    }

    function getFormulaByCode(code) {
      return formulas.find((item) => item.code === code) || null;
    }

    function getMaterialFormulas() {
      return formulas.filter((item) => item.type === "Material" && item.isActive);
    }

    function nextFormulaId() {
      const id = formulaSeq;
      formulaSeq += 1;
      return id;
    }

    function shortMaterialName(name) {
      return String(name || "").replace(/\s+\d+\s*GSM$/i, "");
    }

    function layerMaterialName(layer) {
      const line = state.bomMaterials.find((item) => item.layer === layer);
      if (!line) return "";
      const material = getRawMaterial(line.rawMaterialId);
      return material ? shortMaterialName(material.name) : "";
    }

    /* ==================================================
       Formula engine and material costing
       ================================================== */

    function tokenizeExpression(expression) {
      const src = String(expression || "");
      const tokens = [];
      let i = 0;
      while (i < src.length) {
        const ch = src[i];
        if (/\s/.test(ch)) {
          i += 1;
          continue;
        }
        if ("+-*/()".includes(ch)) {
          tokens.push({ type: ch });
          i += 1;
          continue;
        }
        if (/\d/.test(ch) || (ch === "." && /\d/.test(src[i + 1] || ""))) {
          const start = i;
          i += 1;
          while (i < src.length && /[\d.]/.test(src[i])) i += 1;
          const raw = src.slice(start, i);
          const value = Number(raw);
          if (!Number.isFinite(value)) throw new Error("Invalid number in formula");
          tokens.push({ type: "num", value });
          continue;
        }
        if (/[A-Za-z_]/.test(ch)) {
          const start = i;
          i += 1;
          while (i < src.length && /[A-Za-z0-9_]/.test(src[i])) i += 1;
          tokens.push({ type: "id", value: src.slice(start, i) });
          continue;
        }
        throw new Error("Unexpected character in formula: " + ch);
      }
      return tokens;
    }

    function calculateFormula(expression, variables) {
      try {
        const tokens = tokenizeExpression(expression);
        let pos = 0;

        function peek() {
          return tokens[pos] || null;
        }

        function consume() {
          return tokens[pos++];
        }

        function parseExpression() {
          let left = parseTerm();
          while (peek() && (peek().type === "+" || peek().type === "-")) {
            const op = consume().type;
            const right = parseTerm();
            left = op === "+" ? left + right : left - right;
          }
          return left;
        }

        function parseTerm() {
          let left = parseFactor();
          while (peek() && (peek().type === "*" || peek().type === "/")) {
            const op = consume().type;
            const right = parseFactor();
            if (op === "/" && right === 0) throw new Error("Division by zero");
            left = op === "*" ? left * right : left / right;
          }
          return left;
        }

        function parseFactor() {
          const token = peek();
          if (!token) throw new Error("Unexpected end of formula");
          if (token.type === "+") {
            consume();
            return parseFactor();
          }
          if (token.type === "-") {
            consume();
            return -parseFactor();
          }
          if (token.type === "num") {
            consume();
            return token.value;
          }
          if (token.type === "id") {
            consume();
            if (!Object.prototype.hasOwnProperty.call(variables, token.value)) {
              throw new Error("Unknown variable `" + token.value + "`.");
            }
            const value = variables[token.value];
            if (value === null || value === undefined || Number.isNaN(Number(value))) {
              throw new Error("Variable has no numeric value: " + token.value);
            }
            return Number(value);
          }
          if (token.type === "(") {
            consume();
            const value = parseExpression();
            if (!peek() || peek().type !== ")") throw new Error("Missing closing parenthesis.");
            consume();
            return value;
          }
          throw new Error("Invalid formula token");
        }

        const result = parseExpression();
        if (pos < tokens.length) throw new Error("Unexpected extra characters in formula");
        if (!Number.isFinite(result)) throw new Error("Formula result is not a valid number");
        return { success: true, result, error: null };
      } catch (error) {
        return { success: false, result: null, error: error.message || "Formula cannot be evaluated." };
      }
    }

    function extractIdentifiers(expression) {
      try {
        return [...new Set(
          tokenizeExpression(expression)
            .filter((token) => token.type === "id")
            .map((token) => token.value)
        )];
      } catch (error) {
        return [];
      }
    }

    function getExpressionDependencies(expression) {
      return extractIdentifiers(expression).filter((id) => !Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, id));
    }

    function isKnownSymbol(id) {
      return BASE_VARIABLES.includes(id) ||
        Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, id) ||
        Boolean(getFormulaByCode(id));
    }

    function numericOrNull(value) {
      if (value === null || value === undefined || value === "") return null;
      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    }

    function resolveIdentifier(id, provided, stack) {
      const providedValue = numericOrNull(provided ? provided[id] : null);
      if (providedValue !== null) return { success: true, value: providedValue };

      if (Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, id)) {
        return { success: true, value: ENGINE_CONSTANTS[id] };
      }

      const dependency = getFormulaByCode(id);
      if (dependency) {
        if (!dependency.isActive) {
          return { success: false, error: "Formula `" + id + "` is inactive." };
        }
        if (stack.includes(id)) {
          return { success: false, error: "Circular formula dependency detected." };
        }
        const nested = evaluateFormula(dependency.expression, provided, stack.concat(id));
        if (!nested.success) return { success: false, error: nested.error };
        return { success: true, value: nested.result };
      }

      if (BASE_VARIABLES.includes(id)) {
        return { success: false, error: "Variable has no numeric value: " + id };
      }
      return { success: false, error: "Unknown variable `" + id + "`." };
    }

    function evaluateFormula(expression, provided, stack) {
      const path = stack || [];
      const syntax = validateFormulaSyntax(expression);
      if (!syntax.valid) return { success: false, result: null, error: syntax.error };

      const variables = { ...(provided || {}) };
      for (const id of extractIdentifiers(expression)) {
        const resolved = resolveIdentifier(id, variables, path);
        if (!resolved.success) return { success: false, result: null, error: resolved.error };
        variables[id] = resolved.value;
      }
      return calculateFormula(expression, variables);
    }

    function validateFormulaSyntax(expression) {
      if (!expression || !String(expression).trim()) {
        return { valid: false, error: "Expression is required." };
      }
      try {
        const tokens = tokenizeExpression(expression);
        if (!tokens.length) return { valid: false, error: "Expression is required." };

        let depth = 0;
        let previous = null;
        for (const token of tokens) {
          if (token.type === "(") depth += 1;
          if (token.type === ")") {
            depth -= 1;
            if (depth < 0) return { valid: false, error: "Missing opening parenthesis." };
          }
          if (previous && "+-*/".includes(previous.type) && "+*/".includes(token.type)) {
            return { valid: false, error: "Operators are not valid in this sequence." };
          }
          previous = token;
        }
        if (depth > 0) return { valid: false, error: "Missing closing parenthesis." };

        const parsed = calculateFormula(expression, Object.fromEntries(
          extractIdentifiers(expression).map((id) => [id, 1])
        ));
        if (!parsed.success && /Unexpected|Invalid|character|parenthesis|token|number/i.test(parsed.error || "")) {
          return { valid: false, error: parsed.error };
        }
        return { valid: true, error: null };
      } catch (error) {
        return { valid: false, error: error.message || "Formula cannot be evaluated." };
      }
    }

    function detectCircularDependency(expression, selfCode, stack) {
      const path = stack || (selfCode ? [selfCode] : []);
      for (const id of getExpressionDependencies(expression)) {
        const dependency = getFormulaByCode(id);
        if (!dependency) continue;
        if (path.includes(id) || id === selfCode) return true;
        if (detectCircularDependency(dependency.expression, dependency.code, path.concat(id))) return true;
      }
      return false;
    }

    function validateFormula(expression, options) {
      const opts = options || {};
      const syntax = validateFormulaSyntax(expression);
      if (!syntax.valid) return { valid: false, error: syntax.error, result: null };

      for (const id of extractIdentifiers(expression)) {
        if (!isKnownSymbol(id)) {
          return { valid: false, error: "Unknown variable `" + id + "`.", result: null };
        }
        if (!BASE_VARIABLES.includes(id) && !Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, id) && !getFormulaByCode(id)) {
          return { valid: false, error: "Unknown formula dependency.", result: null };
        }
      }

      if (detectCircularDependency(expression, opts.selfCode)) {
        return { valid: false, error: "Circular formula dependency detected.", result: null };
      }

      const evaluated = evaluateFormula(expression, { ...DEFAULT_TEST_VALUES, ...(opts.variables || {}) }, opts.selfCode ? [opts.selfCode] : []);
      if (!evaluated.success) {
        return { valid: false, error: evaluated.error || "Formula cannot be evaluated.", result: null };
      }
      return { valid: true, error: null, result: evaluated.result };
    }

    function buildFormulaVariables(finishedGood, material, wastagePercent) {
      return {
        L: Number(finishedGood.dimensions.L),
        W: Number(finishedGood.dimensions.W),
        H: Number(finishedGood.dimensions.H),
        PLY: Number(finishedGood.ply),
        GSM: material && material.gsm != null ? Number(material.gsm) : null,
        GLUE_FLAP: DEFAULT_GLUE_FLAP,
        WASTAGE: Number(wastagePercent),
        MATERIAL_RATE: material ? Number(material.purchasingRate) : null,
        ORDER_QTY: 1,
        NET_QTY: 1,
        SHEET_LENGTH: DEFAULT_TEST_VALUES.SHEET_LENGTH,
        SHEET_WIDTH: DEFAULT_TEST_VALUES.SHEET_WIDTH,
        SHEET_AREA: DEFAULT_TEST_VALUES.SHEET_AREA,
        PIECE_AREA: DEFAULT_TEST_VALUES.PIECE_AREA,
        SQ_IN_TO_SQ_M,
        GRAM_TO_KG,
        CONVERSION_FACTOR: ENGINE_CONSTANTS.CONVERSION_FACTOR
      };
    }

    function calculateMaterialCost(materialLine) {
      const line = { ...materialLine, error: null };
      const finishedGood = getSelectedFinishedGood();
      const material = getRawMaterial(line.rawMaterialId);

      if (!finishedGood) {
        line.error = "A finished good is required before materials can be calculated.";
        line.netQty = 0;
        line.grossQty = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      if (!material) {
        line.error = "This material does not exist in the Raw Material Master.";
        line.netQty = 0;
        line.grossQty = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      const rate = Number(material.purchasingRate);
      if (!Number.isFinite(rate) || rate < 0) {
        line.error = "Purchasing rate from the Raw Material Master is not valid.";
        line.netQty = 0;
        line.grossQty = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      line.rate = rate;
      const wastage = Number(line.wastagePercent);
      if (Number.isNaN(wastage) || wastage < 0) {
        line.error = "Wastage cannot be negative.";
        line.netQty = 0;
        line.grossQty = 0;
        line.costPerPiece = 0;
        return line;
      }

      let netQty = 0;
      if (line.calculationMethod === "manual") {
        netQty = Number(line.manualQty);
        if (!Number.isFinite(netQty) || netQty <= 0) {
          line.error = "Manual quantity must be greater than 0.";
          line.netQty = 0;
          line.grossQty = 0;
          line.costPerPiece = 0;
          return line;
        }
      } else {
        const formula = getFormula(line.formulaId);
        if (!formula || !formula.isActive) {
          line.error = formula && !formula.isActive
            ? "The selected material formula is inactive."
            : "A valid material formula is required.";
          line.netQty = 0;
          line.grossQty = 0;
          line.costPerPiece = 0;
          return line;
        }
        const variables = buildFormulaVariables(finishedGood, material, wastage);
        const calculated = evaluateFormula(formula.expression, variables, [formula.code]);
        if (!calculated.success) {
          line.error = calculated.error;
          line.netQty = 0;
          line.grossQty = 0;
          line.costPerPiece = 0;
          return line;
        }
        netQty = calculated.result;
      }

      const variables = buildFormulaVariables(finishedGood, material, wastage);
      const grossFormula = getFormulaByCode("GROSS_QTY");
      let grossQty;
      if (grossFormula && grossFormula.isActive) {
        const grossEval = evaluateFormula(
          grossFormula.expression,
          { ...variables, NET_QTY: netQty, WASTAGE: wastage },
          [grossFormula.code]
        );
        if (!grossEval.success) {
          line.error = grossEval.error;
          line.netQty = 0;
          line.grossQty = 0;
          line.costPerPiece = 0;
          return line;
        }
        grossQty = grossEval.result;
      } else {
        grossQty = netQty * (1 + wastage / 100);
      }
      line.netQty = netQty;
      line.grossQty = grossQty;
      const qtyForRate = convertQuantity(grossQty, material.uom, formatRateUnit(material.rateUOM), {
        gsm: material.gsm,
        sheetArea: DEFAULT_TEST_VALUES.SHEET_AREA
      });
      if (!Number.isFinite(qtyForRate)) {
        line.error = "Quantity could not be converted to the purchasing rate unit.";
        line.costPerPiece = 0;
        return line;
      }
      line.qtyForRate = qtyForRate;
      line.costPerPiece = qtyForRate * line.rate;
      return line;
    }

    function calculateTotalMaterialCost() {
      return state.bomMaterials.reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
    }

    function buildServiceFormulaVariables(finishedGood, service) {
      const L = Number(finishedGood.dimensions.L);
      const W = Number(finishedGood.dimensions.W);
      const H = Number(finishedGood.dimensions.H);
      const area = evaluateFormula("COVERED_AREA", {
        L,
        W,
        H,
        PLY: Number(finishedGood.ply),
        GLUE_FLAP: DEFAULT_GLUE_FLAP
      });
      return {
        L,
        W,
        H,
        PLY: Number(finishedGood.ply),
        GLUE_FLAP: DEFAULT_GLUE_FLAP,
        ORDER_QTY: 1,
        SERVICE_RATE: Number(service.serviceRate),
        PRINT_AREA: area.success ? area.result : null,
        MATERIAL_COST: Number(state.totalMaterialCost || 0),
        SERVICE_COST: 0
      };
    }

    function calculateServiceCost(serviceLine) {
      const line = { ...serviceLine, error: null };
      const finishedGood = getSelectedFinishedGood();
      const service = getService(line.serviceId);

      if (!finishedGood) {
        line.error = "A finished good is required before services can be calculated.";
        line.quantity = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      if (!service) {
        line.error = "This service does not exist in the Service Master.";
        line.quantity = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      const rate = Number(service.serviceRate);
      if (!Number.isFinite(rate) || rate < 0) {
        line.error = "Service rate from the Service Master is not valid.";
        line.quantity = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      line.rate = rate;
      let quantity = 0;

      if (line.calculationMethod === "manual") {
        quantity = Number(line.manualQty);
        if (!Number.isFinite(quantity) || quantity <= 0) {
          line.error = "Quantity / Piece must be greater than 0.";
          line.quantity = 0;
          line.costPerPiece = 0;
          return line;
        }
      } else {
        const formula = getFormula(line.formulaId);
        if (!formula || !formula.isActive || formula.type !== "Service") {
          line.error = formula && !formula.isActive
            ? "The selected service formula is inactive."
            : "A valid service formula is required.";
          line.quantity = 0;
          line.costPerPiece = 0;
          return line;
        }
        const calculated = evaluateFormula(
          formula.expression,
          buildServiceFormulaVariables(finishedGood, service),
          [formula.code]
        );
        if (!calculated.success) {
          line.error = calculated.error;
          line.quantity = 0;
          line.costPerPiece = 0;
          return line;
        }
        quantity = calculated.result;
        if (!Number.isFinite(quantity) || quantity < 0) {
          line.error = "Formula quantity cannot be negative.";
          line.quantity = 0;
          line.costPerPiece = 0;
          return line;
        }
      }

      line.quantity = quantity;
      const qtyForRate = convertQuantity(quantity, service.uom, formatRateUnit(service.rateUOM), {});
      if (!Number.isFinite(qtyForRate)) {
        line.error = "Quantity could not be converted to the service rate unit.";
        line.costPerPiece = 0;
        return line;
      }
      line.qtyForRate = qtyForRate;
      line.costPerPiece = qtyForRate * line.rate;
      return line;
    }

    function calculateTotalServiceCost() {
      return state.bomServices.reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
    }

    function recalculateBOMCosts() {
      state.bomMaterials = state.bomMaterials.map((line) => calculateMaterialCost(line));
      state.totalMaterialCost = calculateTotalMaterialCost();
      state.bomServices = state.bomServices.map((line) => calculateServiceCost(line));
      state.totalServiceCost = calculateTotalServiceCost();
      state.finalCostPerPiece = state.totalMaterialCost + state.totalServiceCost;
      state.costPer100 = state.finalCostPerPiece * 100;
      state.costPer1000 = state.finalCostPerPiece * 1000;
    }

    function createMaterialLineFromConfig(config) {
      const formula = config.formulaCode ? getFormulaByCode(config.formulaCode) : getFormula(config.formulaId);
      return calculateMaterialCost({
        id: nextBomLineId(),
        rawMaterialId: config.rawMaterialId,
        layer: config.layer,
        calculationMethod: config.calculationMethod,
        formulaId: formula ? formula.id : null,
        manualQty: config.manualQty,
        wastagePercent: config.wastagePercent ?? DEFAULT_WASTAGE_PERCENT,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      });
    }

    function loadSampleBomMaterials(finishedGoodId) {
      const configs = sampleBomMaterials[finishedGoodId] || [];
      state.bomMaterials = configs.map((config) => createMaterialLineFromConfig(config));
    }

    function createServiceLineFromConfig(config) {
      const formula = config.formulaCode ? getFormulaByCode(config.formulaCode) : getFormula(config.formulaId);
      return calculateServiceCost({
        id: nextBomLineId(),
        serviceId: config.serviceId,
        calculationMethod: config.calculationMethod,
        formulaId: formula ? formula.id : null,
        manualQty: config.manualQty,
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      });
    }

    function loadSampleBomServices(finishedGoodId) {
      const configs = sampleBomServices[finishedGoodId] || [];
      state.bomServices = configs.map((config) => createServiceLineFromConfig(config));
    }

    function loadSampleBom(finishedGoodId) {
      loadSampleBomMaterials(finishedGoodId);
      loadSampleBomServices(finishedGoodId);
      recalculateBOMCosts();
    }

    function findDuplicateService(serviceId, excludeLineId) {
      return state.bomServices.find((line) =>
        line.serviceId === Number(serviceId) && line.id !== excludeLineId
      );
    }

    function validateCurrentBom(requirePositiveCost) {
      const fg = getSelectedFinishedGood();
      if (!fg) return "Select a Finished Good before saving the BOM.";
      if (!state.bomMaterials.length) return "Add at least one raw material before saving the BOM.";

      const usedLayers = state.bomMaterials.map((line) => line.layer);
      const ply = Number(fg.ply);
      if (ply === 1 && !usedLayers.includes("Single Layer")) {
        return "A 1-ply BOM needs at least one material on Single Layer.";
      }
      if (ply === 2 && (!usedLayers.includes("Top Liner") || !usedLayers.includes("Bottom Liner"))) {
        return "A 2-ply BOM needs materials on both Top Liner and Bottom Liner.";
      }

      for (const line of state.bomMaterials) {
        if (!getRawMaterial(line.rawMaterialId)) return "A BOM material does not reference a valid raw material master record.";
        if (line.calculationMethod === "formula" && !getFormula(line.formulaId)) return "A BOM material formula is missing or invalid.";
        if (line.error) return "Resolve material calculation errors before saving: " + line.error;
      }

      for (const line of state.bomServices) {
        if (!getService(line.serviceId)) return "A BOM service does not reference a valid service master record.";
        if (line.calculationMethod === "formula" && !getFormula(line.formulaId)) return "A BOM service formula is missing or invalid.";
        if (line.error) return "Resolve service calculation errors before saving: " + line.error;
      }

      if (requirePositiveCost) {
        if (!Number.isFinite(state.finalCostPerPiece) || state.finalCostPerPiece <= 0) {
          return "Final Cost / Piece must be a valid positive number before activation.";
        }
      }
      return "";
    }

    function snapshotCurrentBom(status) {
      const fg = getSelectedFinishedGood();
      const now = new Date().toISOString();
      return cloneData({
        id: state.currentBOM.id || nextBomId(),
        bomNo: state.currentBOM.bomNo,
        finishedGoodId: fg.id,
        finishedGoodName: fg.product,
        variant: fg.variant,
        style: fg.style,
        ply: fg.ply,
        uom: fg.uom,
        dimensions: { L: fg.dimensions.L, W: fg.dimensions.W, H: fg.dimensions.H },
        dimensionUOM: fg.dimensionUOM,
        version: state.currentBOM.version,
        status,
        materials: state.bomMaterials,
        services: state.bomServices,
        totalMaterialCost: state.totalMaterialCost,
        totalServiceCost: state.totalServiceCost,
        finalCostPerPiece: state.finalCostPerPiece,
        costPer100: state.costPer100,
        costPer1000: state.costPer1000,
        createdAt: state.currentBOM.createdAt || now,
        updatedAt: now
      });
    }

    function applyBomRecordToEditor(record) {
      const copy = cloneData(record);
      state.selectedFinishedGoodId = copy.finishedGoodId;
      syncEditorBomMeta(copy);
      state.bomMaterials = cloneData(copy.materials || []);
      state.bomServices = cloneData(copy.services || []);
      state.searches.bomFinishedGood = "";
      state.fgSelectorOpen = false;
      state.workflowError = "";
      recalculateBOMCosts();
    }

    function upsertDraftRecord(record) {
      const copy = cloneData(record);
      const index = boms.findIndex((item) => item.id === copy.id);
      if (index >= 0) {
        if (boms[index].status === "Active") return false;
        boms[index] = copy;
      } else {
        boms.push(copy);
      }
      syncEditorBomMeta(copy);
      return true;
    }

    function persistNewDraftFromEditor(bomNo, finishedGoodId) {
      state.currentBOM = {
        id: null,
        bomNo,
        finishedGoodId,
        version: nextVersionForBomNo(bomNo),
        status: "Draft",
        createdAt: null
      };
      const record = snapshotCurrentBom("Draft");
      boms.push(cloneData(record));
      syncEditorBomMeta(record);
      return record;
    }

    function createDraftVersionFromBom(source) {
      const original = cloneData(source);
      const fg = finishedGoods.find((item) => item.id === original.finishedGoodId);
      if (!fg) return null;

      const lines = copyLinesForEditor(original);
      state.selectedFinishedGoodId = fg.id;
      state.bomMaterials = lines.materials;
      state.bomServices = lines.services;
      recalculateBOMCosts();

      const now = new Date().toISOString();
      const record = cloneData({
        id: nextBomId(),
        bomNo: original.bomNo,
        finishedGoodId: original.finishedGoodId,
        finishedGoodName: original.finishedGoodName || fg.product,
        variant: original.variant || fg.variant,
        style: original.style || fg.style,
        ply: original.ply || fg.ply,
        uom: original.uom || fg.uom,
        dimensions: original.dimensions || { L: fg.dimensions.L, W: fg.dimensions.W, H: fg.dimensions.H },
        dimensionUOM: original.dimensionUOM || fg.dimensionUOM,
        version: nextVersionForBomNo(original.bomNo),
        status: "Draft",
        materials: state.bomMaterials,
        services: state.bomServices,
        totalMaterialCost: state.totalMaterialCost,
        totalServiceCost: state.totalServiceCost,
        finalCostPerPiece: state.finalCostPerPiece,
        costPer100: state.costPer100,
        costPer1000: state.costPer1000,
        createdAt: now,
        updatedAt: now
      });
      boms.push(cloneData(record));
      applyBomRecordToEditor(record);
      return record;
    }

    function saveDraftBom() {
      recalculateBOMCosts();
      const error = validateCurrentBom(false);
      if (error) {
        setWorkflowError(error);
        return;
      }
      if (!state.currentBOM) {
        setWorkflowError("There is no BOM in the editor to save.");
        return;
      }

      const stored = state.currentBOM.id ? getStoredBom(state.currentBOM.id) : null;
      if (stored && stored.status === "Active") {
        const draft = persistNewDraftFromEditor(stored.bomNo, stored.finishedGoodId);
        state.workflowError = "";
        showNotification("Active BOM was not changed. Saved as Draft version " + draft.version + ".");
        refreshBomViews();
        return;
      }

      const record = snapshotCurrentBom("Draft");
      if (!upsertDraftRecord(record)) {
        const draft = persistNewDraftFromEditor(state.currentBOM.bomNo, state.currentBOM.finishedGoodId);
        showNotification("Active BOM was not changed. Saved as Draft version " + draft.version + ".");
        refreshBomViews();
        return;
      }

      state.workflowError = "";
      showNotification("Draft saved: " + record.bomNo + " version " + record.version);
      refreshBomViews();
    }

    function activateCurrentBom() {
      recalculateBOMCosts();
      const error = validateCurrentBom(true);
      if (error) {
        setWorkflowError(error);
        return;
      }
      if (!state.currentBOM) {
        setWorkflowError("There is no BOM in the editor to activate.");
        return;
      }

      const stored = state.currentBOM.id ? getStoredBom(state.currentBOM.id) : null;
      if (stored && stored.status === "Active") {
        setWorkflowError("This version is already Active. Edit it to create a Draft, then activate that Draft.");
        return;
      }

      if (!stored) {
        persistNewDraftFromEditor(state.currentBOM.bomNo, state.currentBOM.finishedGoodId);
      }

      const record = snapshotCurrentBom("Active");
      const draftIndex = boms.findIndex((item) => item.id === record.id);
      if (draftIndex >= 0 && boms[draftIndex].status === "Active") {
        setWorkflowError("Cannot overwrite an Active BOM. Create a Draft version first.");
        return;
      }
      if (draftIndex >= 0) boms[draftIndex] = cloneData(record);
      else boms.push(cloneData(record));

      const now = new Date().toISOString();
      let demoted = 0;
      boms.forEach((item) => {
        if (item.finishedGoodId === record.finishedGoodId && item.id !== record.id && item.status === "Active") {
          item.status = "Draft";
          item.updatedAt = now;
          demoted += 1;
        }
      });

      syncEditorBomMeta(record);
      state.workflowError = "";
      showNotification(
        demoted
          ? "BOM activated: " + record.bomNo + " version " + record.version + ". Previous Active version is now Draft."
          : "BOM activated: " + record.bomNo + " version " + record.version
      );
      refreshBomViews();
    }

    function duplicateBomRecord(sourceId) {
      const source = sourceId
        ? getStoredBom(sourceId)
        : (state.currentBOM && state.currentBOM.id ? getStoredBom(state.currentBOM.id) : null);

      if (!source) {
        setWorkflowError("Save the BOM before duplicating it.");
        return;
      }

      const draft = createDraftVersionFromBom(source);
      if (!draft) {
        setWorkflowError("The finished good for this BOM no longer exists.");
        return;
      }
      showNotification("BOM duplicated as " + draft.bomNo + " version " + draft.version + " (Draft). Original is unchanged.");
      navigateTo("bom-costing");
    }

    function loadBomIntoEditor(bomId) {
      const record = getStoredBom(bomId);
      if (!record) {
        showNotification("That BOM could not be found.", "error");
        return;
      }

      if (record.status === "Active") {
        const existingDraft = findLatestDraftForBomNo(record.bomNo);
        if (existingDraft && parseVersion(existingDraft.version) > parseVersion(record.version)) {
          applyBomRecordToEditor(existingDraft);
          showNotification("Working on Draft version " + existingDraft.version + ". Active version " + record.version + " is locked.");
        } else {
          const draft = createDraftVersionFromBom(record);
          if (!draft) {
            showNotification("The finished good for this BOM no longer exists.", "error");
            return;
          }
          showNotification("Created Draft version " + draft.version + " from Active " + record.bomNo + " " + record.version + ". The Active BOM is unchanged.");
        }
        navigateTo("bom-costing");
        return;
      }

      applyBomRecordToEditor(record);
      navigateTo("bom-costing");
    }

    function findDuplicateMaterial(rawMaterialId, layer, excludeLineId) {
      return state.bomMaterials.find((line) =>
        line.rawMaterialId === Number(rawMaterialId) &&
        line.layer === layer &&
        line.id !== excludeLineId
      );
    }

    function refreshBomViews() {
      renderBOMHeader();
      renderProductInformation();
      renderMaterialSection();
      renderServiceSection();
      renderCostSummary();
      refreshIcons();
    }

    function statusBadge(status, isActive) {
      const active = typeof isActive === "boolean" ? isActive : status === "Active";
      const label = status || (active ? "Active" : "Inactive");
      const cls = active ? "badge-success" : "badge-muted";
      return `<span class="badge ${cls}">${escapeHtml(label)}</span>`;
    }

    function matchesQuery(haystacks, query) {
      if (!query) return true;
      const q = query.trim().toLowerCase();
      return haystacks.some((part) => String(part ?? "").toLowerCase().includes(q));
    }

    function emptyRow(colspan, message) {
      return `<tr><td colspan="${colspan}"><div class="empty">${escapeHtml(message)}</div></td></tr>`;
    }

    function toolbarSearch(id, value, placeholder) {
      return `
        <div class="search">
          <i data-lucide="search"></i>
          <input id="${id}" type="search" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
        </div>
      `;
    }

    function refreshIcons() {
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    }

    /* ==================================================
       Search / filter functions
       ================================================== */

    function filterFinishedGoods() {
      const q = state.searches.finishedGoods;
      return finishedGoods.filter((item) =>
        matchesQuery(
          [item.product, item.variant, item.style, item.material, item.uom, item.ply, formatDimensions(item), item.status, formatFinishedGoodDisplayName(item)],
          q
        )
      );
    }

    function filterRawMaterials() {
      const q = state.searches.rawMaterials;
      return rawMaterials.filter((item) =>
        matchesQuery(
          [item.code, item.name, item.category, item.uom, item.rateUOM, item.gsm, item.purchasingRate, item.status],
          q
        )
      );
    }

    function filterServices() {
      const q = state.searches.services;
      return services.filter((item) =>
        matchesQuery([item.code, item.name, item.uom, item.rateUOM, item.serviceRate, item.status], q)
      );
    }

    function filterStyles() {
      const q = state.searches.style;
      return styles.filter((item) =>
        matchesQuery([item.code, item.name, item.description, item.status], q)
      );
    }

    function filterDimensions() {
      const q = state.searches.dimensions;
      return dimensions.filter((item) =>
        matchesQuery([item.code, item.L, item.W, item.H, item.uom, item.status, `${item.L}x${item.W}x${item.H}`], q)
      );
    }

    function filterBoms() {
      const q = state.searches.boms;
      const mode = state.bomListFilter;
      return boms.filter((item) => {
        const matchesSearch = matchesQuery(
          [item.bomNo, item.finishedGoodName, item.variant, item.status, item.version],
          q
        );
        if (!matchesSearch) return false;
        if (mode === "draft") return item.status === "Draft";
        if (mode === "active") return item.status === "Active";
        return true;
      });
    }

    function filterFormulas() {
      const q = state.searches.formulas;
      const mode = state.formulaFilter;

      return formulas.filter((item) => {
        const statusLabel = item.isActive ? "Active" : "Inactive";
        const matchesSearch = matchesQuery(
          [item.name, item.code, item.type, item.expression, item.description, statusLabel],
          q
        );
        if (!matchesSearch) return false;

        if (mode === "all") return true;
        if (mode === "material") return item.type === "Material";
        if (mode === "service") return item.type === "Service";
        if (mode === "active") return item.isActive === true;
        if (mode === "inactive") return item.isActive === false;
        return true;
      });
    }

    /* ==================================================
       Rendering functions
       ================================================== */

    function renderDashboard() {
      const activeBoms = boms.filter((bom) => bom.status === "Active").length;
      const activeFormulas = formulas.filter((f) => f.isActive).length;

      document.getElementById("page-dashboard").innerHTML = `
        <div class="stat-grid">
          <article class="stat-card">
            <div class="stat-label">Total Finished Goods</div>
            <div class="stat-value">${finishedGoods.length}</div>
            <div class="stat-hint">Product / variant masters</div>
          </article>
          <article class="stat-card">
            <div class="stat-label">Total Raw Materials</div>
            <div class="stat-value">${rawMaterials.length}</div>
            <div class="stat-hint">Purchasing rate source</div>
          </article>
          <article class="stat-card">
            <div class="stat-label">Total Services</div>
            <div class="stat-value">${services.length}</div>
            <div class="stat-hint">Process rate source</div>
          </article>
          <article class="stat-card">
            <div class="stat-label">Formula Definitions</div>
            <div class="stat-value">${formulas.length}</div>
            <div class="stat-hint">${activeFormulas} active</div>
          </article>
          <article class="stat-card">
            <div class="stat-label">Saved BOMs</div>
            <div class="stat-value">${boms.length}</div>
            <div class="stat-hint">Draft and Active versions</div>
          </article>
          <article class="stat-card">
            <div class="stat-label">Active BOMs</div>
            <div class="stat-value">${activeBoms}</div>
            <div class="stat-hint">Only BOMs with Active status</div>
          </article>
        </div>
        <div class="card">
          <div class="card-body">
            <strong>BOM &amp; Costing MVP</strong>
            <p style="margin-top:8px;color:var(--text-muted);line-height:1.5;">
              Master data, formula engine, material and service costing in Pakistani Rupees (Rs.), and BOM draft/activate/duplicate workflow
              are available in this local file. Saved BOMs stay in memory until the page is refreshed.
            </p>
          </div>
        </div>
      `;
    }

    function renderFinishedGoods() {
      const rows = filterFinishedGoods();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td>${escapeHtml(item.product)}</td>
              <td>${escapeHtml(item.style)}</td>
              <td>${escapeHtml(item.material || "—")}</td>
              <td>${escapeHtml(item.variant)}</td>
              <td>${escapeHtml(formatDimensions(item))}</td>
              <td>${escapeHtml(item.ply)}</td>
              <td>${escapeHtml(item.uom)}</td>
              <td>${statusBadge(item.status)}</td>
            </tr>
          `).join("")
        : emptyRow(8, "No finished goods match this search.");

      document.getElementById("page-finished-goods").innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("fg-search", state.searches.finishedGoods, "Search product, variant, style...")}
          </div>
          <div class="toolbar-right">
            <button type="button" class="btn btn-primary" id="btn-add-product">
              <i data-lucide="plus"></i> Add Product
            </button>
            <span class="badge badge-muted">${rows.length} of ${finishedGoods.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Style</th>
                  <th>Material</th>
                  <th>Variant</th>
                  <th>Dimensions</th>
                  <th>Ply</th>
                  <th>UOM</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    function renderRawMaterials() {
      const rows = filterRawMaterials();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td>${escapeHtml(item.name)}</td>
              <td><span class="badge badge-info">${escapeHtml(item.category)}</span></td>
              <td>${item.gsm === null ? "—" : escapeHtml(item.gsm)}</td>
              <td>${escapeHtml(item.uom)}</td>
              <td>${formatCurrency(item.purchasingRate)}</td>
              <td>Rs./${escapeHtml(formatRateUnit(item.rateUOM) || item.rateUOM)}</td>
              <td>${statusBadge(item.status)}</td>
            </tr>
          `).join("")
        : emptyRow(8, "No raw materials match this search.");

      document.getElementById("page-raw-materials").innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("rm-search", state.searches.rawMaterials, "Search code, material, category...")}
          </div>
          <div class="toolbar-right">
            <button type="button" class="btn btn-primary" id="btn-add-material-master">
              <i data-lucide="plus"></i> Add Material
            </button>
            <span class="badge badge-muted">${rows.length} of ${rawMaterials.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Material</th>
                  <th>Category</th>
                  <th>GSM</th>
                  <th>UOM</th>
                  <th>Purchasing Rate</th>
                  <th>Rate UOM</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    function renderServices() {
      const rows = filterServices();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.uom)}</td>
              <td>${formatCurrency(item.serviceRate)}</td>
              <td>Rs./${escapeHtml(formatRateUnit(item.rateUOM) || item.rateUOM)}</td>
              <td>${statusBadge(item.status)}</td>
            </tr>
          `).join("")
        : emptyRow(6, "No services match this search.");

      document.getElementById("page-services").innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("srv-search", state.searches.services, "Search code, service, UOM...")}
          </div>
          <div class="toolbar-right">
            <button type="button" class="btn btn-primary" id="btn-add-service-master">
              <i data-lucide="plus"></i> Add Service
            </button>
            <span class="badge badge-muted">${rows.length} of ${services.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Service</th>
                  <th>UOM</th>
                  <th>Service Rate</th>
                  <th>Rate UOM</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    function renderStyles() {
      const rows = filterStyles();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.description || "—")}</td>
              <td>${statusBadge(item.status)}</td>
            </tr>
          `).join("")
        : emptyRow(4, "No styles match this search.");

      document.getElementById("page-style").innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("style-search", state.searches.style, "Search style code, name, description...")}
          </div>
          <div class="toolbar-right">
            <button type="button" class="btn btn-primary" id="btn-add-style">
              <i data-lucide="plus"></i> Add Style
            </button>
            <span class="badge badge-muted">${rows.length} of ${styles.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Style</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    function renderDimensions() {
      const rows = filterDimensions();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td>${escapeHtml(item.L)}</td>
              <td>${escapeHtml(item.W)}</td>
              <td>${escapeHtml(item.H)}</td>
              <td>${escapeHtml(item.uom)}</td>
              <td>${statusBadge(item.status)}</td>
            </tr>
          `).join("")
        : emptyRow(6, "No dimensions match this search.");

      document.getElementById("page-dimensions").innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("dim-search", state.searches.dimensions, "Search L x W x H, UOM...")}
          </div>
          <div class="toolbar-right">
            <button type="button" class="btn btn-primary" id="btn-add-dimension">
              <i data-lucide="plus"></i> Add Dimension
            </button>
            <span class="badge badge-muted">${rows.length} of ${dimensions.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Length</th>
                  <th>Width</th>
                  <th>Height</th>
                  <th>UOM</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    function formulaDependsOnCode(expression, targetCode, stack) {
      const path = stack || [];
      for (const id of getExpressionDependencies(expression)) {
        if (id === targetCode) return true;
        const dependency = getFormulaByCode(id);
        if (!dependency || path.includes(id)) continue;
        if (formulaDependsOnCode(dependency.expression, targetCode, path.concat(id))) return true;
      }
      return false;
    }

    function lineUsesFormula(line, formula) {
      if (!formula) return false;
      if (Number(line.formulaId) === formula.id) return true;
      const used = getFormula(line.formulaId);
      return used ? formulaDependsOnCode(used.expression, formula.code) : false;
    }

    function isFormulaUsed(formulaId) {
      const formula = getFormula(formulaId);
      const usedInEditor = state.bomMaterials.some((line) => lineUsesFormula(line, formula)) ||
        state.bomServices.some((line) => lineUsesFormula(line, formula));
      const usedInSaved = boms.some((bom) =>
        (bom.materials || []).some((line) => lineUsesFormula(line, formula)) ||
        (bom.services || []).some((line) => lineUsesFormula(line, formula))
      );
      return usedInEditor || usedInSaved;
    }

    function renderDependencyBadges(expression) {
      const deps = getExpressionDependencies(expression);
      if (!deps.length) return `<span class="badge badge-muted">None</span>`;
      return `<div class="dep-badges">${deps.map((dep) => `<span class="badge ${getFormulaByCode(dep) ? "badge-info" : "badge-muted"}">${escapeHtml(dep)}</span>`).join("")}</div>`;
    }

    function renderFormulas() {
      const rows = filterFormulas();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td><span class="badge ${item.type === "Service" ? "badge-warn" : "badge-info"}">${escapeHtml(item.type)}</span></td>
              <td class="mono">${escapeHtml(item.expression)}</td>
              <td>${renderDependencyBadges(item.expression)}</td>
              <td>${statusBadge(item.isActive ? "Active" : "Inactive", item.isActive)}</td>
              <td>
                <div class="row-actions">
                  <button class="btn btn-sm" type="button" data-edit-formula="${item.id}">Edit</button>
                  <button class="btn btn-sm" type="button" data-test-formula="${item.id}">Test</button>
                  <button class="btn btn-sm ${item.isActive ? "btn-danger" : ""}" type="button" data-toggle-formula="${item.id}">
                    ${item.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </td>
            </tr>
          `).join("")
        : emptyRow(7, "No formulas match this search or filter.");

      document.getElementById("page-formulas").innerHTML = `
        <div class="toolbar">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Formula Management</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-new-formula">
            <i data-lucide="plus"></i> New Formula
          </button>
        </div>
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("formula-search", state.searches.formulas, "Search formula name, code, expression...")}
            <select class="filter-select" id="formula-filter">
              <option value="all" ${state.formulaFilter === "all" ? "selected" : ""}>All</option>
              <option value="material" ${state.formulaFilter === "material" ? "selected" : ""}>Material</option>
              <option value="service" ${state.formulaFilter === "service" ? "selected" : ""}>Service</option>
              <option value="active" ${state.formulaFilter === "active" ? "selected" : ""}>Active</option>
              <option value="inactive" ${state.formulaFilter === "inactive" ? "selected" : ""}>Inactive</option>
            </select>
          </div>
          <div class="toolbar-right">
            <span class="badge badge-muted">${rows.length} of ${formulas.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table" style="min-width:1100px;">
              <thead>
                <tr>
                  <th>Formula Name</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Expression</th>
                  <th>Dependencies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    function renderBOMPage() {
      document.getElementById("page-bom-costing").innerHTML = `
        <div class="bom-flow">
          <span>Select Finished Good</span>
          <span class="flow-arrow">↓</span>
          <span>Product Information</span>
          <span class="flow-arrow">↓</span>
          <span>Raw Materials</span>
          <span class="flow-arrow">↓</span>
          <span>Services</span>
          <span class="flow-arrow">↓</span>
          <span>Cost Summary</span>
        </div>
        <div class="bom-layout">
          <div class="bom-main">
            <div class="card">
              <div class="card-body">
                <div class="section-kicker">BOM &amp; Product Costing</div>
                <div class="section-title" style="margin:4px 0 14px;">Select a finished good to configure its BOM</div>
                <div id="fg-selector-root"></div>
              </div>
            </div>
            <div id="bom-header-root"></div>
            <div id="bom-product-root"></div>
            <div id="bom-materials-root"></div>
            <div id="bom-services-root"></div>
          </div>
          <aside id="bom-cost-root"></aside>
        </div>
      `;
      renderFinishedGoodSelector();
      renderBOMHeader();
      renderProductInformation();
      renderMaterialSection();
      renderServiceSection();
      renderCostSummary();
    }

    function renderFinishedGoodSelector() {
      const root = document.getElementById("fg-selector-root");
      if (!root) return;

      const selected = getSelectedFinishedGood();
      const query = state.searches.bomFinishedGood;
      const options = filterBomFinishedGoods(query);
      const inputValue = state.fgSelectorOpen || !selected ? query : formatFinishedGoodOption(selected);

      const list = options.length
        ? options.map((item) => `
            <button type="button" class="fg-option ${item.id === state.selectedFinishedGoodId ? "selected" : ""}" data-fg-id="${item.id}">
              ${escapeHtml(formatFinishedGoodOption(item))}
            </button>
          `).join("")
        : `<div class="empty">No finished goods match this search.</div>`;

      root.innerHTML = `
        <div class="fg-combo" id="fg-combo">
          <label for="fg-combo-search">Select Finished Good</label>
          <div class="fg-combo-control">
            <div class="fg-combo-wrap">
              <i data-lucide="search"></i>
              <input id="fg-combo-search" type="search" autocomplete="off" placeholder="Search product, variant, style, ply, dimensions..." value="${escapeHtml(inputValue)}" />
            </div>
            <button type="button" class="fg-combo-toggle" id="fg-combo-toggle" aria-label="Toggle finished good list">
              <i data-lucide="chevron-down"></i>
            </button>
          </div>
          <div class="fg-combo-list ${state.fgSelectorOpen ? "open" : ""}" id="fg-combo-list">${list}</div>
        </div>
      `;
    }

    function resetBomEditor() {
      state.selectedFinishedGoodId = null;
      state.currentBOM = null;
      state.bomMaterials = [];
      state.bomServices = [];
      state.totalMaterialCost = 0;
      state.totalServiceCost = 0;
      state.finalCostPerPiece = 0;
      state.costPer100 = 0;
      state.costPer1000 = 0;
      state.searches.bomFinishedGood = "";
      state.fgSelectorOpen = false;
      state.workflowError = "";
      closeModal();
    }

    function handleFinishedGoodChange(id) {
      const nextId = Number(id);
      const item = finishedGoods.find((fg) => fg.id === nextId);
      if (!item) return;
      if (state.selectedFinishedGoodId === nextId && state.currentBOM) {
        state.fgSelectorOpen = false;
        state.searches.bomFinishedGood = "";
        renderFinishedGoodSelector();
        refreshIcons();
        return;
      }

      state.selectedFinishedGoodId = item.id;
      const existing = getBomsForFinishedGood(item.id);
      state.currentBOM = {
        id: null,
        finishedGoodId: item.id,
        bomNo: getBomNoForFinishedGood(item),
        version: existing.length ? nextVersionForBomNo(getBomNoForFinishedGood(item)) : "1.0",
        status: "Draft"
      };
      state.workflowError = "";
      state.searches.bomFinishedGood = "";
      state.fgSelectorOpen = false;
      closeModal();
      loadSampleBom(item.id);
      renderBOMPage();
      refreshIcons();
    }

    function plyLayerClass(layer) {
      if (layer === "Single Layer") return "ply-single";
      if (layer === "Top Liner") return "ply-top";
      if (layer === "Fluting") return "ply-flute";
      if (layer === "Bottom Liner") return "ply-bottom";
      return "";
    }

    function renderPlyVisualization(ply) {
      const layers = getStructuralLayers(ply);
      const blocks = layers.map((layer, index) => {
        const name = layerMaterialName(layer);
        const arrow = index < layers.length - 1 ? `<div class="ply-arrow">↓</div>` : "";
        return `
          <div class="ply-layer ${plyLayerClass(layer)}">${escapeHtml(layer)}${name ? `<span class="ply-name">${escapeHtml(name)}</span>` : ""}</div>
          ${arrow}
        `;
      }).join("");
      return `<div class="ply-stack" aria-label="${escapeHtml(ply)} ply structure">${blocks}</div>`;
    }

    function renderBOMHeader() {
      const root = document.getElementById("bom-header-root");
      if (!root) return;
      const bom = state.currentBOM;
      const fg = getSelectedFinishedGood();
      const activeSibling = bom && bom.status === "Draft" ? findActiveBomForNumber(bom.bomNo) : null;
      if (!bom || !fg) {
        root.innerHTML = "";
        return;
      }

      root.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="section-kicker">BOM Header</div>
            <div class="bom-meta" style="margin-top:12px;">
              <div>
                <div class="field-label">BOM No</div>
                <div class="field-value mono">${escapeHtml(bom.bomNo)}</div>
              </div>
              <div>
                <div class="field-label">Version</div>
                <div class="field-value">${escapeHtml(bom.version)}</div>
              </div>
              <div>
                <div class="field-label">Status</div>
                <div>${statusBadge(bom.status, bom.status === "Active")}</div>
              </div>
            </div>
            <div class="workflow-actions">
              <button type="button" class="btn btn-primary" id="btn-save-draft">Save Draft</button>
              <button type="button" class="btn btn-activate" id="btn-activate-bom">Activate BOM</button>
              <button type="button" class="btn btn-duplicate" id="btn-duplicate-bom">Duplicate BOM</button>
            </div>
            ${activeSibling ? `<div class="modal-note" style="margin-top:12px;margin-bottom:0;">You are editing Draft version ${escapeHtml(bom.version)}. Active version ${escapeHtml(activeSibling.version)} is locked and will not change until you activate this Draft.</div>` : ""}
            ${state.workflowError ? `<div class="workflow-error">${escapeHtml(state.workflowError)}</div>` : ""}
          </div>
        </div>
      `;
    }

    function renderBomList() {
      const rows = filterBoms();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td class="mono">${escapeHtml(item.bomNo)}</td>
              <td>${escapeHtml(item.finishedGoodName)}</td>
              <td>${escapeHtml(item.variant)}</td>
              <td>${escapeHtml(item.version)}</td>
              <td>${statusBadge(item.status, item.status === "Active")}</td>
              <td>${formatRupees(item.finalCostPerPiece)}</td>
              <td>${escapeHtml(formatDateTime(item.updatedAt))}</td>
              <td>
                <div class="row-actions">
                  <button type="button" class="btn btn-sm" data-load-bom="${item.id}">View / Edit</button>
                  <button type="button" class="btn btn-sm btn-duplicate" data-duplicate-bom="${item.id}">Duplicate</button>
                </div>
              </td>
            </tr>
          `).join("")
        : emptyRow(8, "No saved BOMs match this search.");

      document.getElementById("page-bom-list").innerHTML = `
        <div class="toolbar">
          <div>
            <div class="section-kicker">Repository</div>
            <div class="section-title">BOM List</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-new-bom">New BOM</button>
        </div>
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("bom-list-search", state.searches.boms, "Search BOM number, product, variant, status...")}
            <select class="filter-select" id="bom-list-filter">
              <option value="all" ${state.bomListFilter === "all" ? "selected" : ""}>All</option>
              <option value="draft" ${state.bomListFilter === "draft" ? "selected" : ""}>Draft</option>
              <option value="active" ${state.bomListFilter === "active" ? "selected" : ""}>Active</option>
            </select>
          </div>
          <div class="toolbar-right">
            <span class="badge badge-muted">${rows.length} of ${boms.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table" style="min-width:980px;">
              <thead>
                <tr>
                  <th>BOM Number</th>
                  <th>Finished Good</th>
                  <th>Variant</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Final Cost / Piece</th>
                  <th>Updated Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    function renderProductInformation() {
      const root = document.getElementById("bom-product-root");
      if (!root) return;
      const fg = getSelectedFinishedGood();

      if (!fg) {
        root.innerHTML = `
          <div class="card">
            <div class="placeholder-panel">
              <h2>Select a Finished Good to begin BOM configuration.</h2>
              <p>Product details, ply structure, and BOM header will appear after you choose an item from the list above.</p>
            </div>
          </div>
        `;
        return;
      }

      root.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="pi-grid">
              <div>
                <div class="section-kicker">Finished Good</div>
                <div class="pi-fields">
                  <div class="product-name">${escapeHtml(fg.product)}</div>
                  <div>
                    <div class="field-label">Variant</div>
                    <div class="field-value">${escapeHtml(fg.variant)}</div>
                  </div>
                  <div>
                    <div class="field-label">Style</div>
                    <div class="field-value">${escapeHtml(fg.style)}</div>
                  </div>
                  <div>
                    <div class="field-label">Material</div>
                    <div class="field-value">${escapeHtml(fg.material || "—")}</div>
                  </div>
                  <div>
                    <div class="field-label">Ply</div>
                    <div class="field-value">${escapeHtml(fg.ply)} Ply</div>
                  </div>
                  <div>
                    <div class="field-label">UOM</div>
                    <div class="field-value">${escapeHtml(fg.uom)}</div>
                  </div>
                  <div>
                    <div class="field-label">Dimensions</div>
                    <div class="field-value">${escapeHtml(formatDimensions(fg))}</div>
                  </div>
                </div>
                <div class="dim-grid">
                  <div class="dim-box">
                    <div class="field-label">Length</div>
                    <strong>${escapeHtml(fg.dimensions.L)} ${escapeHtml(fg.dimensionUOM)}</strong>
                  </div>
                  <div class="dim-box">
                    <div class="field-label">Width</div>
                    <strong>${escapeHtml(fg.dimensions.W)} ${escapeHtml(fg.dimensionUOM)}</strong>
                  </div>
                  <div class="dim-box">
                    <div class="field-label">Height</div>
                    <strong>${escapeHtml(fg.dimensions.H)} ${escapeHtml(fg.dimensionUOM)}</strong>
                  </div>
                </div>
              </div>
              <div>
                <div class="section-kicker" style="margin-bottom:8px;">${escapeHtml(fg.ply)} Ply Structure</div>
                ${renderPlyVisualization(fg.ply)}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function renderMaterialSection() {
      const root = document.getElementById("bom-materials-root");
      if (!root) return;
      const hasFg = Boolean(getSelectedFinishedGood());
      const rows = state.bomMaterials;

      const body = !hasFg
        ? emptyRow(11, "Select a Finished Good before adding raw materials.")
        : rows.length
          ? rows.map((line, index) => {
              const material = getRawMaterial(line.rawMaterialId);
              const formula = getFormula(line.formulaId);
              const methodLabel = line.calculationMethod === "manual" ? "Manual" : "Formula";
              const formulaLabel = line.calculationMethod === "formula" && formula ? formula.name : "—";
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <div>${escapeHtml(material ? material.name : "Unknown material")}</div>
                    <div class="stat-hint">${escapeHtml(material ? material.code : "")}</div>
                    ${line.error ? `<div class="field-error">${escapeHtml(line.error)}</div>` : ""}
                  </td>
                  <td>${escapeHtml(line.layer)}</td>
                  <td>${escapeHtml(methodLabel)}</td>
                  <td>${escapeHtml(formulaLabel)}</td>
                  <td>${formatQty(line.netQty)}</td>
                  <td>
                    <input class="wastage-input" type="number" min="0" step="1" data-wastage-line="${line.id}" value="${escapeHtml(line.wastagePercent)}" />
                  </td>
                  <td>${formatQty(line.grossQty)}</td>
                  <td>${material ? formatRatePkr(material.purchasingRate, material.rateUOM) : "—"}</td>
                  <td>${formatRupees(line.costPerPiece)}</td>
                  <td>
                    <div class="row-actions">
                      <button type="button" class="btn btn-sm btn-icon" data-breakdown-line="${line.id}" title="Calculation breakdown">
                        <i data-lucide="calculator"></i>
                      </button>
                      <button type="button" class="btn btn-sm btn-icon" data-edit-line="${line.id}" title="Edit">
                        <i data-lucide="pencil"></i>
                      </button>
                      <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-line="${line.id}" title="Delete">
                        <i data-lucide="trash-2"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")
          : emptyRow(11, "No raw materials added yet.");

      root.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="section-head">
              <div>
                <div class="section-kicker">Raw Materials</div>
                <div class="section-title">BOM consumption</div>
              </div>
              <button type="button" class="btn btn-primary" id="btn-add-material" ${hasFg ? "" : "disabled"}>
                <i data-lucide="plus"></i> Add Raw Material
              </button>
            </div>
            <div class="table-wrap">
              <table class="data-table" style="min-width:1100px;">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Material</th>
                    <th>Layer</th>
                    <th>Calculation</th>
                    <th>Formula</th>
                    <th>Net Qty</th>
                    <th>Wastage</th>
                    <th>Gross Qty</th>
                    <th>Rate</th>
                    <th>Cost / Piece</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>${body}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    function renderServiceSection() {
      const root = document.getElementById("bom-services-root");
      if (!root) return;
      const hasFg = Boolean(getSelectedFinishedGood());
      const rows = state.bomServices;

      const body = !hasFg
        ? emptyRow(8, "Select a Finished Good before adding services.")
        : rows.length
          ? rows.map((line, index) => {
              const service = getService(line.serviceId);
              const formula = getFormula(line.formulaId);
              const methodLabel = line.calculationMethod === "manual" ? "Manual" : "Formula";
              const formulaLabel = line.calculationMethod === "formula" && formula ? formula.name : "—";
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <div>${escapeHtml(service ? service.name : "Unknown service")}</div>
                    <div class="stat-hint">${escapeHtml(service ? service.code : "")}</div>
                    ${line.error ? `<div class="field-error">${escapeHtml(line.error)}</div>` : ""}
                  </td>
                  <td>${escapeHtml(methodLabel)}</td>
                  <td>${escapeHtml(formulaLabel)}</td>
                  <td>${formatQty(line.quantity)}</td>
                  <td>
                    ${service ? formatRatePkr(service.serviceRate, service.rateUOM) : "—"}
                    <div class="stat-hint">Rate Source: Service Master (PKR)</div>
                  </td>
                  <td>${formatRupees(line.costPerPiece)}</td>
                  <td>
                    <div class="row-actions">
                      <button type="button" class="btn btn-sm btn-icon" data-breakdown-service="${line.id}" title="Calculation breakdown">
                        <i data-lucide="calculator"></i>
                      </button>
                      <button type="button" class="btn btn-sm btn-icon" data-edit-service="${line.id}" title="Edit">
                        <i data-lucide="pencil"></i>
                      </button>
                      <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-service="${line.id}" title="Delete">
                        <i data-lucide="trash-2"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")
          : emptyRow(8, "No services added yet.");

      root.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="section-head">
              <div>
                <div class="section-kicker">Services / Processes</div>
                <div class="section-title">Conversion steps</div>
              </div>
              <button type="button" class="btn btn-primary" id="btn-add-service" ${hasFg ? "" : "disabled"}>
                <i data-lucide="plus"></i> Add Service
              </button>
            </div>
            <div class="table-wrap">
              <table class="data-table" style="min-width:980px;">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th>Calculation</th>
                    <th>Formula</th>
                    <th>Qty / Piece</th>
                    <th>Rate</th>
                    <th>Cost / Piece</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>${body}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    function renderCostSummary() {
      const root = document.getElementById("bom-cost-root");
      if (!root) return;
      const total = Number(state.finalCostPerPiece) || 0;
      const materialPct = total > 0 ? (Number(state.totalMaterialCost) / total) * 100 : 0;
      const servicePct = total > 0 ? (Number(state.totalServiceCost) / total) * 100 : 0;
      root.innerHTML = `
        <div class="card cost-summary">
          <div class="card-body">
            <div class="section-kicker">Cost Summary (PKR)</div>
            <div class="section-title" style="margin-bottom:12px;">Per piece roll-up</div>
            <div class="cost-row">
              <span>Material Cost</span>
              <strong>${formatCurrency(state.totalMaterialCost)}</strong>
            </div>
            <div class="cost-row">
              <span>Service Cost</span>
              <strong>${formatCurrency(state.totalServiceCost)}</strong>
            </div>
            <div class="cost-row cost-final">
              <span>Final Cost/Piece</span>
              <strong>${formatCurrency(state.finalCostPerPiece)}</strong>
            </div>
            <div class="cost-row">
              <span>Cost per 100</span>
              <strong>${formatCurrency(state.costPer100)}</strong>
            </div>
            <div class="cost-row">
              <span>Cost per 1,000</span>
              <strong>${formatCurrency(state.costPer1000)}</strong>
            </div>
            <div class="cost-bars">
              <div class="cost-bar">
                <div class="cost-bar-mat" style="width:${escapeHtml(materialPct)}%;"></div>
                <div class="cost-bar-svc" style="width:${escapeHtml(servicePct)}%;"></div>
              </div>
              <div class="cost-legend">
                <span>Material ${formatNumber(materialPct, 1)}%</span>
                <span>Service ${formatNumber(servicePct, 1)}%</span>
              </div>
            </div>
            <p class="stat-hint">Final cost is Material Cost + Service Cost in Pakistani Rupees (Rs.). Rates come from master data after unit conversion.</p>
          </div>
        </div>
      `;
    }

    function defaultFormulaDraft(formula) {
      return {
        id: formula ? formula.id : null,
        name: formula ? formula.name : "",
        code: formula ? formula.code : "",
        type: formula ? formula.type : "Material",
        description: formula ? formula.description : "",
        expression: formula ? formula.expression : "",
        testValues: { ...DEFAULT_TEST_VALUES },
        testResult: null
      };
    }

    function validateFormulaCode(code) {
      if (!code) return "Formula Code is required.";
      if (!/^[A-Z][A-Z0-9_]*$/.test(code)) {
        return "Formula code can contain only A-Z, 0-9 and underscores.";
      }
      return "";
    }

    function formulaReferencedVars(expression) {
      return getExpressionDependencies(expression);
    }

    function currentFormulaValidation() {
      const draft = state.modal.draft || {};
      return validateFormula(draft.expression, {
        selfCode: draft.code || null,
        variables: draft.testValues || {}
      });
    }

    function renderFormulaStatus(validation) {
      if (validation.valid) {
        return `<div class="formula-status status-valid">Formula Valid</div>`;
      }
      return `<div class="formula-status status-invalid">Formula Invalid${validation.error ? `: ${escapeHtml(validation.error)}` : ""}</div>`;
    }

    function renderFormulaTestFields(expression, testValues) {
      const vars = formulaReferencedVars(expression);
      if (!vars.length) return `<p class="stat-hint">No variables detected in this expression.</p>`;
      return `
        <div class="test-fields">
          ${vars.map((name) => `
            <div>
              <label class="form-label" for="ft-${escapeHtml(name)}">${escapeHtml(name)}</label>
              <input id="ft-${escapeHtml(name)}" class="full-search" data-test-var="${escapeHtml(name)}" type="number" step="any" value="${testValues[name] ?? ""}" />
            </div>
          `).join("")}
        </div>
      `;
    }

    function renderFormulaBuilderModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const validation = currentFormulaValidation();
      const test = draft.testResult;
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Formula Builder</div>
            <strong>${state.modal.mode === "edit" ? "Edit Formula" : "New Formula"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="fb-layout">
            <div class="form-grid">
              <div>
                <label class="form-label" for="fb-name">Formula Name</label>
                <input id="fb-name" class="full-search ${errors.name ? "input-invalid" : ""}" value="${escapeHtml(draft.name)}" />
                ${errors.name ? `<div class="field-error">${escapeHtml(errors.name)}</div>` : ""}
              </div>
              <div>
                <label class="form-label" for="fb-code">Formula Code</label>
                <input id="fb-code" class="full-search ${errors.code ? "input-invalid" : ""}" value="${escapeHtml(draft.code)}" placeholder="FLAT_LENGTH" />
                ${errors.code ? `<div class="field-error">${escapeHtml(errors.code)}</div>` : ""}
              </div>
              <div>
                <label class="form-label" for="fb-type">Type</label>
                <select id="fb-type" class="full-select ${errors.type ? "input-invalid" : ""}">
                  <option value="Material" ${draft.type === "Material" ? "selected" : ""}>Material</option>
                  <option value="Service" ${draft.type === "Service" ? "selected" : ""}>Service</option>
                </select>
                ${errors.type ? `<div class="field-error">${escapeHtml(errors.type)}</div>` : ""}
              </div>
              <div>
                <label class="form-label" for="fb-description">Description</label>
                <input id="fb-description" class="full-search" value="${escapeHtml(draft.description)}" />
              </div>
              <div>
                <label class="form-label" for="fb-expression">Expression</label>
                <div class="op-row">
                  <button type="button" class="op-btn" data-insert="+">+</button>
                  <button type="button" class="op-btn" data-insert="-">−</button>
                  <button type="button" class="op-btn" data-insert="*">×</button>
                  <button type="button" class="op-btn" data-insert="/">÷</button>
                  <button type="button" class="op-btn" data-insert="(">(</button>
                  <button type="button" class="op-btn" data-insert=")">)</button>
                </div>
                <textarea id="fb-expression" class="expression-input ${errors.expression ? "input-invalid" : ""}">${escapeHtml(draft.expression)}</textarea>
                ${errors.expression ? `<div class="field-error">${escapeHtml(errors.expression)}</div>` : ""}
                <div style="margin-top:8px;">${renderFormulaStatus(validation)}</div>
              </div>
            </div>
            <div>
              <div class="section-kicker">Variables</div>
              <p class="stat-hint" style="margin:6px 0 8px;">Click to insert into the expression.</p>
              <div class="chip-wrap">
                ${BASE_VARIABLES.map((name) => `<button type="button" class="chip" data-insert="${name}">${name}</button>`).join("")}
              </div>
            </div>
          </div>
          <div style="margin-top:16px;">
            <div class="section-kicker">Formula Test</div>
            <p class="stat-hint" style="margin:6px 0 8px;">Values are generated from variables used in the expression.</p>
            ${renderFormulaTestFields(draft.expression, draft.testValues)}
            <div class="toolbar-left" style="margin-top:10px;">
              <button type="button" class="btn" id="btn-test-formula">Test Formula</button>
              <button type="button" class="btn btn-primary" id="btn-calculate-formula">Calculate</button>
            </div>
            ${test ? `
              <div class="preview-box">
                ${renderFormulaStatus({ valid: test.success, error: test.error })}
                ${test.success ? `<div class="cost-row"><span>Result</span><strong>${escapeHtml(test.result)}</strong></div>` : ""}
              </div>
            ` : ""}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-formula">Save Formula</button>
        </div>
      `;
    }

    function renderFormulaTestModal() {
      const draft = state.modal.draft;
      const validation = currentFormulaValidation();
      const test = draft.testResult;
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Formula Test</div>
            <strong>${escapeHtml(draft.name || draft.code)}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="detail-list">
            <div><span>Code</span><strong class="mono">${escapeHtml(draft.code)}</strong></div>
            <div><span>Expression</span><strong class="mono">${escapeHtml(draft.expression)}</strong></div>
            <div><span>Dependencies</span><strong>${getExpressionDependencies(draft.expression).join(", ") || "None"}</strong></div>
          </div>
          <div style="margin-top:12px;">${renderFormulaStatus(validation)}</div>
          <div style="margin-top:14px;">
            <div class="section-kicker">Required variables</div>
            <div style="margin-top:8px;">${renderFormulaTestFields(draft.expression, draft.testValues)}</div>
          </div>
          <div class="toolbar-left" style="margin-top:12px;">
            <button type="button" class="btn btn-primary" id="btn-calculate-formula">Calculate</button>
          </div>
          ${test ? `
            <div class="preview-box">
              ${renderFormulaStatus({ valid: test.success, error: test.error })}
              ${test.success ? `<div class="cost-row"><span>Result</span><strong>${escapeHtml(test.result)}</strong></div>` : ""}
            </div>
          ` : ""}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-modal-close>Close</button>
        </div>
      `;
    }

    function openFormulaBuilder(formulaId) {
      const formula = formulaId ? getFormula(formulaId) : null;
      state.modal = {
        type: "formula-builder",
        selectedId: formula ? formula.id : null,
        mode: formula ? "edit" : "add",
        lineId: null,
        draft: defaultFormulaDraft(formula),
        errors: {},
        cursor: (formula && formula.expression ? formula.expression.length : 0)
      };
      renderModal();
    }

    function openFormulaTest(formulaId) {
      const formula = getFormula(formulaId);
      if (!formula) return;
      state.modal = {
        type: "formula-test",
        selectedId: formula.id,
        mode: "test",
        lineId: null,
        draft: defaultFormulaDraft(formula),
        errors: {},
        cursor: 0
      };
      renderModal();
    }

    function insertIntoExpression(token) {
      if (!state.modal.draft) return;
      const current = String(state.modal.draft.expression || "");
      const field = document.getElementById("fb-expression");
      const start = field ? field.selectionStart : (state.modal.cursor || current.length);
      const end = field ? field.selectionEnd : start;
      const insert = /[A-Z_]/.test(token[0]) ? token : ` ${token} `;
      state.modal.draft.expression = current.slice(0, start) + insert + current.slice(end);
      state.modal.cursor = start + insert.length;
      state.modal.draft.testResult = null;
      state.modal.errors = {};
      renderModal();
      const next = document.getElementById("fb-expression");
      if (next) {
        next.focus();
        next.setSelectionRange(state.modal.cursor, state.modal.cursor);
      }
    }

    function runFormulaTest() {
      if (!state.modal.draft) return;
      const result = evaluateFormula(
        state.modal.draft.expression,
        state.modal.draft.testValues || {},
        state.modal.draft.code ? [state.modal.draft.code] : []
      );
      state.modal.draft.testResult = result;
      renderModal();
    }

    function saveFormulaFromModal() {
      const draft = state.modal.draft;
      const errors = {};
      if (!draft.name || !String(draft.name).trim()) errors.name = "Formula Name is required.";
      const codeError = validateFormulaCode(String(draft.code || "").trim().toUpperCase());
      if (codeError) errors.code = codeError;
      if (!draft.type) errors.type = "Type is required.";
      if (!draft.expression || !String(draft.expression).trim()) errors.expression = "Expression is required.";

      const code = String(draft.code || "").trim().toUpperCase();
      const duplicate = formulas.find((item) => item.code === code && item.id !== draft.id);
      if (!errors.code && duplicate) errors.code = "Formula Code must be unique.";

      const validation = validateFormula(draft.expression, { selfCode: code, variables: draft.testValues || {} });
      if (!errors.expression && !validation.valid) errors.expression = validation.error;

      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }

      const payload = {
        id: draft.id || nextFormulaId(),
        code,
        name: String(draft.name).trim(),
        type: draft.type,
        description: String(draft.description || "").trim(),
        expression: String(draft.expression).trim(),
        isActive: draft.id ? (getFormula(draft.id)?.isActive !== false) : true
      };

      if (draft.id) {
        const index = formulas.findIndex((item) => item.id === draft.id);
        if (index >= 0) formulas[index] = { ...formulas[index], ...payload };
      } else {
        formulas.push(payload);
      }

      closeModal();
      renderFormulas();
      refreshIcons();
      if (state.selectedFinishedGoodId) recalculateBOMCosts();
    }

    function toggleFormulaActive(formulaId) {
      const formula = getFormula(formulaId);
      if (!formula) return;
      if (formula.isActive && isFormulaUsed(formula.id)) {
        state.modal = {
          type: "formula-in-use",
          selectedId: formula.id,
          mode: "view",
          lineId: null,
          draft: null,
          errors: {}
        };
        renderModal();
        return;
      }
      formula.isActive = !formula.isActive;
      renderFormulas();
      refreshIcons();
      if (state.selectedFinishedGoodId) recalculateBOMCosts();
    }

    function closeModal() {
      state.modal = {
        type: null,
        selectedId: null,
        mode: "add",
        lineId: null,
        draft: null,
        errors: {}
      };
      const backdrop = document.getElementById("modal-backdrop");
      const dialog = document.getElementById("modal-dialog");
      if (backdrop) {
        backdrop.classList.remove("show");
        backdrop.hidden = true;
      }
      if (dialog) {
        dialog.classList.remove("wide");
        dialog.classList.remove("wide-form");
        dialog.innerHTML = "";
      }
    }

    function defaultFinishedGoodDraft() {
      return {
        product: "",
        style: styles[0] ? styles[0].name : "",
        material: getFinishedGoodMaterialOptions()[0] || "",
        variant: "",
        ply: 3,
        L: "",
        W: "",
        H: "",
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      };
    }

    function validateFinishedGoodDraft(draft) {
      const errors = {};
      if (!String(draft.product || "").trim()) errors.product = "Product Name is required.";
      if (!String(draft.style || "").trim()) errors.style = "Style is required.";
      if (!String(draft.material || "").trim()) errors.material = "Material is required.";
      if (!String(draft.variant || "").trim()) errors.variant = "Variant is required.";
      if (![1, 2, 3].includes(Number(draft.ply))) errors.ply = "Ply must be 1, 2, or 3.";
      const L = Number(draft.L);
      const W = Number(draft.W);
      const H = Number(draft.H);
      if (!Number.isFinite(L) || L <= 0) errors.L = "Length must be greater than 0.";
      if (!Number.isFinite(W) || W <= 0) errors.W = "Width must be greater than 0.";
      if (!Number.isFinite(H) || H <= 0) errors.H = "Height must be greater than 0.";
      if (!draft.dimensionUOM) errors.dimensionUOM = "Dimension UOM is required.";
      if (!draft.uom) errors.uom = "UOM is required.";
      if (!draft.status) errors.status = "Status is required.";
      return errors;
    }

    function renderFinishedGoodFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const materialOptions = getFinishedGoodMaterialOptions();
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Product master</div>
            <strong>Add New Finished Good</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid two">
            <div class="form-span-2">
              <label class="form-label" for="fg-product">Product Name</label>
              <input id="fg-product" class="full-search ${errors.product ? "input-invalid" : ""}" value="${escapeHtml(draft.product)}" placeholder="CAKE BOX" />
              ${errors.product ? `<div class="field-error">${escapeHtml(errors.product)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="fg-style">Style</label>
              <select id="fg-style" class="full-select ${errors.style ? "input-invalid" : ""}">
                <option value="">Select a style...</option>
                ${styles.map((item) => `<option value="${escapeHtml(item.name)}" ${draft.style === item.name ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
              </select>
              ${errors.style ? `<div class="field-error">${escapeHtml(errors.style)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="fg-material">Material</label>
              <select id="fg-material" class="full-select ${errors.material ? "input-invalid" : ""}">
                <option value="">Select a material...</option>
                ${materialOptions.map((name) => `<option value="${escapeHtml(name)}" ${draft.material === name ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
              </select>
              ${errors.material ? `<div class="field-error">${escapeHtml(errors.material)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="fg-variant">Variant</label>
              <input id="fg-variant" class="full-search ${errors.variant ? "input-invalid" : ""}" value="${escapeHtml(draft.variant)}" placeholder="1POUND" />
              ${errors.variant ? `<div class="field-error">${escapeHtml(errors.variant)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="fg-ply">Ply Selection</label>
              <select id="fg-ply" class="full-select ${errors.ply ? "input-invalid" : ""}">
                ${[1, 2, 3].map((ply) => `<option value="${ply}" ${Number(draft.ply) === ply ? "selected" : ""}>${ply}</option>`).join("")}
              </select>
              ${errors.ply ? `<div class="field-error">${escapeHtml(errors.ply)}</div>` : ""}
            </div>
            <div class="form-span-2">
              <label class="form-label">Dimensions</label>
              <div class="dim-input-row">
                <div>
                  <input id="fg-dim-l" class="full-search ${errors.L ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.L)}" placeholder="Length" />
                  ${errors.L ? `<div class="field-error">${escapeHtml(errors.L)}</div>` : ""}
                </div>
                <div>
                  <input id="fg-dim-w" class="full-search ${errors.W ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.W)}" placeholder="Width" />
                  ${errors.W ? `<div class="field-error">${escapeHtml(errors.W)}</div>` : ""}
                </div>
                <div>
                  <input id="fg-dim-h" class="full-search ${errors.H ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.H)}" placeholder="Height" />
                  ${errors.H ? `<div class="field-error">${escapeHtml(errors.H)}</div>` : ""}
                </div>
              </div>
            </div>
            <div>
              <label class="form-label" for="fg-dim-uom">Dimension UOM</label>
              <select id="fg-dim-uom" class="full-select ${errors.dimensionUOM ? "input-invalid" : ""}">
                ${["inch", "cm", "mm"].map((uom) => `<option value="${uom}" ${draft.dimensionUOM === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="fg-uom">UOM</label>
              <select id="fg-uom" class="full-select ${errors.uom ? "input-invalid" : ""}">
                ${["pieces", "kg", "box"].map((uom) => `<option value="${uom}" ${draft.uom === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="fg-status">Status</label>
              <select id="fg-status" class="full-select">
                <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-finished-good">Add Product</button>
        </div>
      `;
    }

    function openFinishedGoodModal() {
      state.modal = {
        type: "finished-good",
        selectedId: null,
        mode: "add",
        lineId: null,
        draft: defaultFinishedGoodDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveFinishedGoodFromModal() {
      const draft = state.modal.draft;
      const errors = validateFinishedGoodDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }
      const item = {
        id: nextMasterId(finishedGoods),
        product: String(draft.product).trim(),
        style: String(draft.style).trim(),
        material: String(draft.material).trim(),
        variant: String(draft.variant).trim(),
        ply: Number(draft.ply),
        dimensions: { L: Number(draft.L), W: Number(draft.W), H: Number(draft.H) },
        dimensionUOM: draft.dimensionUOM,
        uom: draft.uom,
        status: draft.status
      };
      item.displayName = formatFinishedGoodDisplayName(item);
      finishedGoods.push(item);
      const dimCode = `${item.dimensions.L}x${item.dimensions.W}x${item.dimensions.H}`;
      if (!dimensions.some((dim) => dim.code === dimCode && dim.uom === item.dimensionUOM)) {
        dimensions.push({
          id: nextMasterId(dimensions),
          code: dimCode,
          L: item.dimensions.L,
          W: item.dimensions.W,
          H: item.dimensions.H,
          uom: item.dimensionUOM,
          status: "Active"
        });
      }
      closeModal();
      renderFinishedGoods();
      refreshIcons();
      showNotification("Product added successfully");
    }

    function updateFinishedGoodDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "finished-good") return false;
      const draft = state.modal.draft;
      if (target.id === "fg-product") draft.product = target.value;
      else if (target.id === "fg-style") draft.style = target.value;
      else if (target.id === "fg-material") draft.material = target.value;
      else if (target.id === "fg-variant") draft.variant = target.value;
      else if (target.id === "fg-ply") draft.ply = Number(target.value);
      else if (target.id === "fg-dim-l") draft.L = target.value === "" ? "" : Number(target.value);
      else if (target.id === "fg-dim-w") draft.W = target.value === "" ? "" : Number(target.value);
      else if (target.id === "fg-dim-h") draft.H = target.value === "" ? "" : Number(target.value);
      else if (target.id === "fg-dim-uom") draft.dimensionUOM = target.value;
      else if (target.id === "fg-uom") draft.uom = target.value;
      else if (target.id === "fg-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultRawMaterialDraft() {
      return {
        code: "",
        name: "",
        category: "Paper",
        uom: "kg",
        purchasingRate: "",
        rateUOM: "kg",
        gsm: "",
        status: "Active"
      };
    }

    function validateRawMaterialDraft(draft) {
      const errors = {};
      const code = String(draft.code || "").trim().toUpperCase();
      if (!code) errors.code = "Code is required.";
      else if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(code)) errors.code = "Code must be alphanumeric.";
      else if (rawMaterials.some((item) => item.code.toUpperCase() === code)) errors.code = "Code must be unique.";
      if (!String(draft.name || "").trim()) errors.name = "Name is required.";
      if (!draft.category) errors.category = "Category is required.";
      if (!draft.uom) errors.uom = "UOM is required.";
      const rate = Number(draft.purchasingRate);
      if (!Number.isFinite(rate) || rate <= 0) errors.purchasingRate = "Purchasing rate must be greater than 0.";
      if (!draft.rateUOM) errors.rateUOM = "Rate UOM is required.";
      if ((draft.category === "Paper" || draft.category === "Board") && draft.gsm !== "" && draft.gsm != null) {
        const gsm = Number(draft.gsm);
        if (!Number.isFinite(gsm) || gsm <= 0) errors.gsm = "GSM must be greater than 0.";
      }
      if (!draft.status) errors.status = "Status is required.";
      return errors;
    }

    function renderRawMaterialFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const showGsm = draft.category === "Paper" || draft.category === "Board";
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Material master</div>
            <strong>Add New Raw Material</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="rm-code">Code</label>
              <input id="rm-code" class="full-search ${errors.code ? "input-invalid" : ""}" value="${escapeHtml(draft.code)}" placeholder="KRAFT-PH" />
              ${errors.code ? `<div class="field-error">${escapeHtml(errors.code)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="rm-name">Name</label>
              <input id="rm-name" class="full-search ${errors.name ? "input-invalid" : ""}" value="${escapeHtml(draft.name)}" placeholder="Kraft Paper High" />
              ${errors.name ? `<div class="field-error">${escapeHtml(errors.name)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="rm-category">Category</label>
              <select id="rm-category" class="full-select">
                ${["Paper", "Board", "Sheet", "Film", "Consumable"].map((cat) => `<option value="${cat}" ${draft.category === cat ? "selected" : ""}>${cat}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="rm-uom">UOM</label>
              <select id="rm-uom" class="full-select">
                ${["kg", "gm", "sheet"].map((uom) => `<option value="${uom}" ${draft.uom === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="rm-rate">Purchasing Rate (PKR)</label>
              <input id="rm-rate" class="full-search ${errors.purchasingRate ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.purchasingRate)}" placeholder="150.50" />
              ${errors.purchasingRate ? `<div class="field-error">${escapeHtml(errors.purchasingRate)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="rm-rate-uom">Rate UOM</label>
              <select id="rm-rate-uom" class="full-select">
                ${[["kg", "Rs./kg"], ["sheet", "Rs./sheet"], ["piece", "Rs./piece"], ["gm", "Rs./gm"]].map(([value, label]) => `
                  <option value="${value}" ${draft.rateUOM === value ? "selected" : ""}>${label}</option>
                `).join("")}
              </select>
            </div>
            ${showGsm ? `
              <div>
                <label class="form-label" for="rm-gsm">GSM (Basis Weight)</label>
                <input id="rm-gsm" class="full-search ${errors.gsm ? "input-invalid" : ""}" type="number" min="0" step="1" value="${escapeHtml(draft.gsm)}" placeholder="Optional" />
                ${errors.gsm ? `<div class="field-error">${escapeHtml(errors.gsm)}</div>` : ""}
              </div>
            ` : ""}
            <div>
              <label class="form-label" for="rm-status">Status</label>
              <select id="rm-status" class="full-select">
                <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-raw-material">Add Material</button>
        </div>
      `;
    }

    function openRawMaterialMasterModal() {
      state.modal = {
        type: "raw-material-master",
        selectedId: null,
        mode: "add",
        lineId: null,
        draft: defaultRawMaterialDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveRawMaterialFromModal() {
      const draft = state.modal.draft;
      const errors = validateRawMaterialDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }
      const showGsm = draft.category === "Paper" || draft.category === "Board";
      rawMaterials.push({
        id: nextMasterId(rawMaterials),
        code: String(draft.code).trim().toUpperCase(),
        name: String(draft.name).trim(),
        category: draft.category,
        uom: draft.uom,
        purchasingRate: Number(draft.purchasingRate),
        rateUOM: draft.rateUOM,
        gsm: showGsm && draft.gsm !== "" && draft.gsm != null ? Number(draft.gsm) : null,
        status: draft.status
      });
      closeModal();
      renderRawMaterials();
      refreshIcons();
      showNotification("Material added successfully");
    }

    function updateRawMaterialDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "raw-material-master") return false;
      const draft = state.modal.draft;
      if (target.id === "rm-code") draft.code = target.value.toUpperCase();
      else if (target.id === "rm-name") draft.name = target.value;
      else if (target.id === "rm-category") draft.category = target.value;
      else if (target.id === "rm-uom") draft.uom = target.value;
      else if (target.id === "rm-rate") draft.purchasingRate = target.value === "" ? "" : Number(target.value);
      else if (target.id === "rm-rate-uom") draft.rateUOM = target.value;
      else if (target.id === "rm-gsm") draft.gsm = target.value === "" ? "" : Number(target.value);
      else if (target.id === "rm-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultServiceMasterDraft() {
      return {
        code: "",
        name: "",
        uom: "pieces",
        serviceRate: "",
        rateUOM: "piece",
        status: "Active"
      };
    }

    function validateServiceMasterDraft(draft) {
      const errors = {};
      const code = String(draft.code || "").trim().toUpperCase();
      if (!code) errors.code = "Code is required.";
      else if (services.some((item) => item.code.toUpperCase() === code)) errors.code = "Code must be unique.";
      if (!String(draft.name || "").trim()) errors.name = "Name is required.";
      if (!draft.uom) errors.uom = "UOM is required.";
      const rate = Number(draft.serviceRate);
      if (!Number.isFinite(rate) || rate <= 0) errors.serviceRate = "Service rate must be greater than 0.";
      if (!draft.rateUOM) errors.rateUOM = "Rate UOM is required.";
      if (!draft.status) errors.status = "Status is required.";
      return errors;
    }

    function renderServiceMasterFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Service master</div>
            <strong>Add New Service</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="srv-code">Code</label>
              <input id="srv-code" class="full-search ${errors.code ? "input-invalid" : ""}" value="${escapeHtml(draft.code)}" placeholder="PRINT-COLOR" />
              ${errors.code ? `<div class="field-error">${escapeHtml(errors.code)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="srv-name">Name</label>
              <input id="srv-name" class="full-search ${errors.name ? "input-invalid" : ""}" value="${escapeHtml(draft.name)}" placeholder="Color Printing" />
              ${errors.name ? `<div class="field-error">${escapeHtml(errors.name)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="srv-uom">UOM</label>
              <select id="srv-uom" class="full-select">
                ${["pieces", "sq.inch", "meter"].map((uom) => `<option value="${uom}" ${draft.uom === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="srv-rate">Service Rate (PKR)</label>
              <input id="srv-rate" class="full-search ${errors.serviceRate ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.serviceRate)}" placeholder="2.50" />
              ${errors.serviceRate ? `<div class="field-error">${escapeHtml(errors.serviceRate)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="srv-rate-uom">Rate UOM</label>
              <select id="srv-rate-uom" class="full-select">
                ${[["piece", "Rs./piece"], ["sq.inch", "Rs./sq.inch"], ["meter", "Rs./meter"]].map(([value, label]) => `
                  <option value="${value}" ${draft.rateUOM === value ? "selected" : ""}>${label}</option>
                `).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="srv-status">Status</label>
              <select id="srv-status" class="full-select">
                <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-service-master">Add Service</button>
        </div>
      `;
    }

    function openServiceMasterModal() {
      state.modal = {
        type: "service-master",
        selectedId: null,
        mode: "add",
        lineId: null,
        draft: defaultServiceMasterDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveServiceMasterFromModal() {
      const draft = state.modal.draft;
      const errors = validateServiceMasterDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }
      services.push({
        id: nextMasterId(services),
        code: String(draft.code).trim().toUpperCase(),
        name: String(draft.name).trim(),
        uom: draft.uom,
        serviceRate: Number(draft.serviceRate),
        rateUOM: draft.rateUOM,
        status: draft.status
      });
      closeModal();
      renderServices();
      refreshIcons();
      showNotification("Service added successfully");
    }

    function updateServiceMasterDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "service-master") return false;
      const draft = state.modal.draft;
      if (target.id === "srv-code") draft.code = target.value.toUpperCase();
      else if (target.id === "srv-name") draft.name = target.value;
      else if (target.id === "srv-uom") draft.uom = target.value;
      else if (target.id === "srv-rate") draft.serviceRate = target.value === "" ? "" : Number(target.value);
      else if (target.id === "srv-rate-uom") draft.rateUOM = target.value;
      else if (target.id === "srv-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultStyleDraft() {
      return {
        code: "",
        name: "",
        description: "",
        status: "Active"
      };
    }

    function validateStyleDraft(draft) {
      const errors = {};
      const code = String(draft.code || "").trim().toUpperCase();
      const name = String(draft.name || "").trim();
      if (!code) errors.code = "Code is required.";
      else if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(code)) errors.code = "Code must be alphanumeric.";
      else if (styles.some((item) => item.code.toUpperCase() === code)) errors.code = "Code must be unique.";
      if (!name) errors.name = "Style name is required.";
      else if (styles.some((item) => item.name.toLowerCase() === name.toLowerCase())) errors.name = "Style name must be unique.";
      if (!draft.status) errors.status = "Status is required.";
      return errors;
    }

    function renderStyleFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Style master</div>
            <strong>Add New Style</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="style-code">Code</label>
              <input id="style-code" class="full-search ${errors.code ? "input-invalid" : ""}" value="${escapeHtml(draft.code)}" placeholder="WINDOW-LID" />
              ${errors.code ? `<div class="field-error">${escapeHtml(errors.code)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="style-name">Style Name</label>
              <input id="style-name" class="full-search ${errors.name ? "input-invalid" : ""}" value="${escapeHtml(draft.name)}" placeholder="Window Lid" />
              ${errors.name ? `<div class="field-error">${escapeHtml(errors.name)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="style-description">Description</label>
              <input id="style-description" class="full-search" value="${escapeHtml(draft.description)}" placeholder="Optional" />
            </div>
            <div>
              <label class="form-label" for="style-status">Status</label>
              <select id="style-status" class="full-select">
                <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-style">Add Style</button>
        </div>
      `;
    }

    function openStyleModal() {
      state.modal = {
        type: "style-master",
        selectedId: null,
        mode: "add",
        lineId: null,
        draft: defaultStyleDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveStyleFromModal() {
      const draft = state.modal.draft;
      const errors = validateStyleDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }
      styles.push({
        id: nextMasterId(styles),
        code: String(draft.code).trim().toUpperCase(),
        name: String(draft.name).trim(),
        description: String(draft.description || "").trim(),
        status: draft.status
      });
      closeModal();
      renderStyles();
      refreshIcons();
      showNotification("Style added successfully");
    }

    function updateStyleDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "style-master") return false;
      const draft = state.modal.draft;
      if (target.id === "style-code") draft.code = target.value.toUpperCase();
      else if (target.id === "style-name") draft.name = target.value;
      else if (target.id === "style-description") draft.description = target.value;
      else if (target.id === "style-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultDimensionDraft() {
      return {
        L: "",
        W: "",
        H: "",
        uom: "inch",
        status: "Active"
      };
    }

    function formatDimensionCode(draft) {
      return `${draft.L}x${draft.W}x${draft.H}`;
    }

    function validateDimensionDraft(draft) {
      const errors = {};
      const L = Number(draft.L);
      const W = Number(draft.W);
      const H = Number(draft.H);
      if (!Number.isFinite(L) || L <= 0) errors.L = "Length must be greater than 0.";
      if (!Number.isFinite(W) || W <= 0) errors.W = "Width must be greater than 0.";
      if (!Number.isFinite(H) || H <= 0) errors.H = "Height must be greater than 0.";
      if (!draft.uom) errors.uom = "UOM is required.";
      if (!draft.status) errors.status = "Status is required.";
      if (!errors.L && !errors.W && !errors.H && draft.uom) {
        const code = formatDimensionCode({ L, W, H });
        if (dimensions.some((item) => item.code === code && item.uom === draft.uom)) {
          errors.duplicate = "This dimension already exists.";
        }
      }
      return errors;
    }

    function renderDimensionFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const previewCode = Number(draft.L) > 0 && Number(draft.W) > 0 && Number(draft.H) > 0
        ? formatDimensionCode(draft)
        : "—";
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Dimension master</div>
            <strong>Add New Dimension</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-span-2">
              <label class="form-label">Dimensions</label>
              <div class="dim-input-row">
                <div>
                  <input id="dim-l" class="full-search ${errors.L ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.L)}" placeholder="Length" />
                  ${errors.L ? `<div class="field-error">${escapeHtml(errors.L)}</div>` : ""}
                </div>
                <div>
                  <input id="dim-w" class="full-search ${errors.W ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.W)}" placeholder="Width" />
                  ${errors.W ? `<div class="field-error">${escapeHtml(errors.W)}</div>` : ""}
                </div>
                <div>
                  <input id="dim-h" class="full-search ${errors.H ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.H)}" placeholder="Height" />
                  ${errors.H ? `<div class="field-error">${escapeHtml(errors.H)}</div>` : ""}
                </div>
              </div>
            </div>
            <div>
              <label class="form-label" for="dim-uom">UOM</label>
              <select id="dim-uom" class="full-select">
                ${["inch", "cm", "mm"].map((uom) => `<option value="${uom}" ${draft.uom === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="dim-status">Status</label>
              <select id="dim-status" class="full-select">
                <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
          <div class="preview-box">
            <div class="cost-row"><span>Code</span><strong class="mono">${escapeHtml(previewCode)}</strong></div>
          </div>
          ${errors.duplicate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.duplicate)}</div>` : ""}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-dimension">Add Dimension</button>
        </div>
      `;
    }

    function openDimensionModal() {
      state.modal = {
        type: "dimension-master",
        selectedId: null,
        mode: "add",
        lineId: null,
        draft: defaultDimensionDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveDimensionFromModal() {
      const draft = state.modal.draft;
      const errors = validateDimensionDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }
      const item = {
        id: nextMasterId(dimensions),
        L: Number(draft.L),
        W: Number(draft.W),
        H: Number(draft.H),
        uom: draft.uom,
        status: draft.status
      };
      item.code = formatDimensionCode(item);
      dimensions.push(item);
      closeModal();
      renderDimensions();
      refreshIcons();
      showNotification("Dimension added successfully");
    }

    function updateDimensionDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "dimension-master") return false;
      const draft = state.modal.draft;
      if (target.id === "dim-l") draft.L = target.value === "" ? "" : Number(target.value);
      else if (target.id === "dim-w") draft.W = target.value === "" ? "" : Number(target.value);
      else if (target.id === "dim-h") draft.H = target.value === "" ? "" : Number(target.value);
      else if (target.id === "dim-uom") draft.uom = target.value;
      else if (target.id === "dim-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultMaterialDraft(line) {
      const sheetWeight = getFormulaByCode("SHEET_WEIGHT");
      if (line) {
        return {
          rawMaterialId: line.rawMaterialId,
          layer: line.layer,
          calculationMethod: line.calculationMethod,
          formulaId: line.formulaId || (sheetWeight ? sheetWeight.id : null),
          manualQty: line.manualQty,
          wastagePercent: line.wastagePercent
        };
      }
      const fg = getSelectedFinishedGood();
      const layers = getPlyLayers(fg ? fg.ply : 3);
      return {
        rawMaterialId: null,
        layer: layers[0],
        calculationMethod: "formula",
        formulaId: sheetWeight ? sheetWeight.id : null,
        manualQty: null,
        wastagePercent: DEFAULT_WASTAGE_PERCENT
      };
    }

    function validateMaterialDraft(draft, lineId) {
      const errors = {};
      if (!getSelectedFinishedGood()) errors.finishedGood = "Select a Finished Good before adding materials.";
      if (!draft.rawMaterialId) errors.rawMaterialId = "Raw Material is required.";
      const material = getRawMaterial(draft.rawMaterialId);
      if (draft.rawMaterialId && !material) errors.rawMaterialId = "Material must exist in the Raw Material Master.";
      if (!draft.layer) errors.layer = "Layer is required.";
      const allowedLayers = getLayerOptionsForEditor(draft.layer);
      if (draft.layer && !allowedLayers.includes(draft.layer)) {
        errors.layer = "Layer is not valid for this ply count.";
      }
      if (draft.calculationMethod === "formula") {
        const selectedFormula = getFormula(draft.formulaId);
        if (!draft.formulaId) errors.formulaId = "Formula is required when Formula method is selected.";
        else if (!selectedFormula || !selectedFormula.isActive) errors.formulaId = "Selected formula is not valid or is inactive.";
      } else {
        const qty = Number(draft.manualQty);
        if (!Number.isFinite(qty) || qty <= 0) errors.manualQty = "Manual quantity must be greater than 0.";
      }
      if (material && !Number.isFinite(Number(material.purchasingRate))) {
        errors.rate = "Purchasing rate from the Raw Material Master is not valid.";
      }
      const wastage = Number(draft.wastagePercent);
      if (Number.isNaN(wastage) || wastage < 0) errors.wastagePercent = "Wastage cannot be negative.";
      if (draft.rawMaterialId && draft.layer && findDuplicateMaterial(draft.rawMaterialId, draft.layer, lineId)) {
        errors.duplicate = "This material is already added to the selected layer.";
      }
      if (!errors.formulaId && !errors.rawMaterialId && !errors.manualQty && !errors.wastagePercent && !errors.finishedGood) {
        const preview = calculateMaterialCost({
          id: lineId || 0,
          rawMaterialId: draft.rawMaterialId,
          layer: draft.layer,
          calculationMethod: draft.calculationMethod,
          formulaId: draft.formulaId,
          manualQty: draft.manualQty,
          wastagePercent: draft.wastagePercent,
          netQty: 0,
          grossQty: 0,
          rate: 0,
          costPerPiece: 0
        });
        if (preview.error) errors.formula = preview.error;
      }
      return errors;
    }

    function renderMaterialFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const material = getRawMaterial(draft.rawMaterialId);
      const formula = getFormula(draft.formulaId);
      const preview = material ? calculateMaterialCost({
        id: state.modal.lineId || 0,
        rawMaterialId: draft.rawMaterialId,
        layer: draft.layer,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.formulaId,
        manualQty: draft.manualQty,
        wastagePercent: draft.wastagePercent,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      }) : null;

      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">BOM line</div>
            <strong>${state.modal.mode === "edit" ? "Edit Raw Material" : "Add Raw Material"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="modal-material-select">Raw Material</label>
              <select id="modal-material-select" class="full-select ${errors.rawMaterialId ? "input-invalid" : ""}">
                <option value="">Select a raw material...</option>
                ${rawMaterials.map((item) => `
                  <option value="${item.id}" ${Number(draft.rawMaterialId) === item.id ? "selected" : ""}>
                    ${escapeHtml(item.code)} — ${escapeHtml(item.name)}
                  </option>
                `).join("")}
              </select>
              ${errors.rawMaterialId ? `<div class="field-error">${escapeHtml(errors.rawMaterialId)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="modal-layer-select">Layer</label>
              <select id="modal-layer-select" class="full-select ${errors.layer ? "input-invalid" : ""}">
                ${getLayerOptionsForEditor(draft.layer).map((layer) => `<option value="${escapeHtml(layer)}" ${draft.layer === layer ? "selected" : ""}>${escapeHtml(layer)}</option>`).join("")}
              </select>
              ${errors.layer ? `<div class="field-error">${escapeHtml(errors.layer)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="modal-method-select">Calculation Method</label>
              <select id="modal-method-select" class="full-select">
                <option value="formula" ${draft.calculationMethod === "formula" ? "selected" : ""}>Formula</option>
                <option value="manual" ${draft.calculationMethod === "manual" ? "selected" : ""}>Manual</option>
              </select>
            </div>
            ${draft.calculationMethod === "formula" ? `
              <div>
                <label class="form-label" for="modal-formula-select">Formula</label>
                <select id="modal-formula-select" class="full-select ${errors.formulaId ? "input-invalid" : ""}">
                  <option value="">Select a formula...</option>
                  ${getMaterialFormulas().map((item) => `
                    <option value="${item.id}" ${Number(draft.formulaId) === item.id ? "selected" : ""}>
                      ${escapeHtml(item.name)} (${escapeHtml(item.code)})
                    </option>
                  `).join("")}
                </select>
                ${formula ? `<p class="stat-hint mono" style="margin-top:8px;">${escapeHtml(formula.expression)}</p>` : ""}
                ${errors.formulaId ? `<div class="field-error">${escapeHtml(errors.formulaId)}</div>` : ""}
                ${errors.formula ? `<div class="field-error">${escapeHtml(errors.formula)}</div>` : ""}
              </div>
            ` : `
              <div>
                <label class="form-label" for="modal-manual-qty">Net Quantity</label>
                <input id="modal-manual-qty" class="full-search ${errors.manualQty ? "input-invalid" : ""}" type="number" min="0.0001" step="0.0001" value="${draft.manualQty ?? ""}" />
                ${errors.manualQty ? `<div class="field-error">${escapeHtml(errors.manualQty)}</div>` : ""}
              </div>
            `}
            <div>
              <label class="form-label" for="modal-wastage">Wastage %</label>
              <input id="modal-wastage" class="full-search ${errors.wastagePercent ? "input-invalid" : ""}" type="number" min="0" step="1" value="${escapeHtml(draft.wastagePercent)}" />
              ${errors.wastagePercent ? `<div class="field-error">${escapeHtml(errors.wastagePercent)}</div>` : ""}
            </div>
          </div>
          ${material ? `
            <div class="detail-list">
              <div><span>Material Name</span><strong>${escapeHtml(material.name)}</strong></div>
              <div><span>Code</span><strong class="mono">${escapeHtml(material.code)}</strong></div>
              <div><span>GSM</span><strong>${material.gsm === null ? "—" : escapeHtml(material.gsm)}</strong></div>
              <div><span>UOM</span><strong>${escapeHtml(material.uom)}</strong></div>
              <div><span>Purchasing Rate</span><strong>${formatRatePkr(material.purchasingRate, material.rateUOM)}</strong></div>
              <div><span>Qty UOM</span><strong>${escapeHtml(material.uom)}</strong></div>
            </div>
            <div class="rate-source">Rate Source: Purchasing Rate (PKR). Wastage is applied before unit conversion.</div>
          ` : ""}
          ${errors.duplicate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.duplicate)}</div>` : ""}
          ${errors.finishedGood ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.finishedGood)}</div>` : ""}
          ${preview && !preview.error ? `
            <div class="preview-box">
              <div class="cost-row"><span>Net Qty</span><strong>${formatQty(preview.netQty)} ${escapeHtml(material.uom)}</strong></div>
              <div class="cost-row"><span>Gross Qty (after wastage)</span><strong>${formatQty(preview.grossQty)} ${escapeHtml(material.uom)}</strong></div>
              ${preview.qtyForRate != null ? `<div class="cost-row"><span>Qty at rate UOM</span><strong>${formatQty(preview.qtyForRate)} ${escapeHtml(formatRateUnit(material.rateUOM))}</strong></div>` : ""}
              <div class="cost-row"><span>Cost / Piece</span><strong>${formatCurrency(preview.costPerPiece)}</strong></div>
            </div>
          ` : ""}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-material">Save</button>
        </div>
      `;
    }

    function renderBreakdownModal() {
      const line = state.bomMaterials.find((item) => item.id === state.modal.lineId);
      const fg = getSelectedFinishedGood();
      if (!line || !fg) {
        return `<div class="modal-body"><p>Calculation details are unavailable.</p></div>`;
      }
      const material = getRawMaterial(line.rawMaterialId);
      const formula = getFormula(line.formulaId);
      const variables = material ? buildFormulaVariables(fg, material, line.wastagePercent) : {};
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Calculation</div>
            <strong>Calculation Breakdown</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="detail-list">
            <div><span>Material</span><strong>${escapeHtml(material ? material.name : "—")}</strong></div>
            <div><span>Finished Good</span><strong>${escapeHtml(fg.product)} — ${escapeHtml(fg.variant)}</strong></div>
            <div><span>Dimensions</span><strong>L = ${escapeHtml(fg.dimensions.L)} &nbsp; W = ${escapeHtml(fg.dimensions.W)} &nbsp; H = ${escapeHtml(fg.dimensions.H)}</strong></div>
            <div><span>GSM</span><strong>${material && material.gsm != null ? escapeHtml(material.gsm) : "—"}</strong></div>
            <div><span>Formula</span><strong>${line.calculationMethod === "formula" && formula ? escapeHtml(formula.code) : "Manual"}</strong></div>
            <div><span>Formula Expression</span><strong class="mono">${line.calculationMethod === "formula" && formula ? escapeHtml(formula.expression) : "—"}</strong></div>
            <div><span>Net Quantity</span><strong>${formatQty(line.netQty)} ${escapeHtml(material ? material.uom : "")}</strong></div>
            <div><span>Wastage</span><strong>${escapeHtml(line.wastagePercent)}%</strong></div>
            <div><span>Gross Quantity</span><strong>${formatQty(line.grossQty)} ${escapeHtml(material ? material.uom : "")}</strong></div>
            <div><span>Qty at rate UOM</span><strong>${formatQty(line.qtyForRate)} ${escapeHtml(material ? formatRateUnit(material.rateUOM) : "")}</strong></div>
            <div><span>Purchasing Rate</span><strong>${material ? formatRatePkr(material.purchasingRate, material.rateUOM) : "—"}</strong></div>
            ${material && normalizeUnit(material.uom) !== normalizeUnit(material.rateUOM) ? `<div><span>Equivalent rate in ${escapeHtml(material.uom)}</span><strong>${formatRatePkr(convertRate(material.purchasingRate, material.rateUOM, material.uom, material.gsm), material.uom)}</strong></div>` : ""}
            <div><span>Material Cost</span><strong>${formatCurrency(line.costPerPiece)}</strong></div>
          </div>
          <div class="section-kicker" style="margin-top:14px;">Variables</div>
          <div class="var-grid">
            ${Object.entries(variables).map(([key, value]) => `
              <div><span class="mono">${escapeHtml(key)}</span> = <strong>${value === null || value === undefined ? "—" : escapeHtml(value)}</strong></div>
            `).join("")}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-modal-close>Close</button>
        </div>
      `;
    }

    function renderConfirmDeleteModal() {
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Confirm</div>
            <strong>Remove raw material</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <p>Remove this raw material from the BOM?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-confirm-delete">Remove</button>
        </div>
      `;
    }

    function renderModal() {
      const backdrop = document.getElementById("modal-backdrop");
      const dialog = document.getElementById("modal-dialog");
      if (!state.modal.type) {
        closeModal();
        return;
      }

      dialog.classList.toggle("wide", state.modal.type === "formula-builder" || state.modal.type === "formula-test");
      dialog.classList.toggle("wide-form", state.modal.type === "finished-good");

      if (state.modal.type === "finished-good") {
        dialog.innerHTML = renderFinishedGoodFormModal();
      } else if (state.modal.type === "raw-material-master") {
        dialog.innerHTML = renderRawMaterialFormModal();
      } else if (state.modal.type === "service-master") {
        dialog.innerHTML = renderServiceMasterFormModal();
      } else if (state.modal.type === "style-master") {
        dialog.innerHTML = renderStyleFormModal();
      } else if (state.modal.type === "dimension-master") {
        dialog.innerHTML = renderDimensionFormModal();
      } else if (state.modal.type === "material") {
        dialog.innerHTML = renderMaterialFormModal();
      } else if (state.modal.type === "formula-builder") {
        dialog.innerHTML = renderFormulaBuilderModal();
      } else if (state.modal.type === "formula-test") {
        dialog.innerHTML = renderFormulaTestModal();
      } else if (state.modal.type === "formula-in-use") {
        dialog.innerHTML = `
          <div class="modal-header">
            <div>
              <div class="section-kicker">Formula in use</div>
              <strong>Cannot deactivate</strong>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
          </div>
          <div class="modal-body">
            <p>This formula is currently used by a BOM configuration and cannot be deactivated.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-modal-close>Close</button>
          </div>
        `;
      } else if (state.modal.type === "breakdown") {
        dialog.innerHTML = renderBreakdownModal();
      } else if (state.modal.type === "confirm-delete") {
        dialog.innerHTML = renderConfirmDeleteModal();
      } else if (state.modal.type === "service") {
        dialog.innerHTML = renderServiceFormModal();
      } else if (state.modal.type === "service-breakdown") {
        dialog.innerHTML = renderServiceBreakdownModal();
      } else if (state.modal.type === "confirm-delete-service") {
        dialog.innerHTML = `
          <div class="modal-header">
            <div>
              <div class="section-kicker">Confirm</div>
              <strong>Remove service</strong>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
          </div>
          <div class="modal-body">
            <p>Remove this service from the BOM?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" data-modal-close>Cancel</button>
            <button type="button" class="btn btn-primary" id="btn-confirm-delete-service">Remove</button>
          </div>
        `;
      }

      backdrop.hidden = false;
      backdrop.classList.add("show");
    }

    function openMaterialModal(lineId) {
      if (!getSelectedFinishedGood()) return;
      const line = lineId ? state.bomMaterials.find((item) => item.id === Number(lineId)) : null;
      state.modal = {
        type: "material",
        selectedId: line ? line.rawMaterialId : null,
        mode: line ? "edit" : "add",
        lineId: line ? line.id : null,
        draft: defaultMaterialDraft(line),
        errors: {}
      };
      renderModal();
    }

    function openBreakdownModal(lineId) {
      state.modal = {
        type: "breakdown",
        selectedId: null,
        mode: "view",
        lineId: Number(lineId),
        draft: null,
        errors: {}
      };
      renderModal();
    }

    function openDeleteMaterialModal(lineId) {
      state.modal = {
        type: "confirm-delete",
        selectedId: null,
        mode: "delete",
        lineId: Number(lineId),
        draft: null,
        errors: {}
      };
      renderModal();
    }

    function saveMaterialFromModal() {
      const draft = state.modal.draft;
      const errors = validateMaterialDraft(draft, state.modal.lineId);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }

      const nextLine = calculateMaterialCost({
        id: state.modal.lineId || nextBomLineId(),
        rawMaterialId: Number(draft.rawMaterialId),
        layer: draft.layer,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? Number(draft.formulaId) : null,
        manualQty: draft.calculationMethod === "manual" ? Number(draft.manualQty) : null,
        wastagePercent: Number(draft.wastagePercent),
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      });

      if (state.modal.mode === "edit") {
        state.bomMaterials = state.bomMaterials.map((line) => line.id === nextLine.id ? nextLine : line);
      } else {
        state.bomMaterials.push(nextLine);
      }

      recalculateBOMCosts();
      closeModal();
      refreshBomViews();
    }

    function confirmDeleteMaterial() {
      state.bomMaterials = state.bomMaterials.filter((line) => line.id !== state.modal.lineId);
      recalculateBOMCosts();
      closeModal();
      refreshBomViews();
    }

    function updateLineWastage(lineId, value) {
      const wastage = Number(value);
      state.bomMaterials = state.bomMaterials.map((line) => {
        if (line.id !== Number(lineId)) return line;
        return { ...line, wastagePercent: wastage };
      });
      recalculateBOMCosts();
      refreshBomViews();
    }

    function updateMaterialDraftFromEvent(target) {
      if (!state.modal.draft) return false;
      const draft = state.modal.draft;
      if (target.id === "modal-material-select") draft.rawMaterialId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-layer-select") draft.layer = target.value;
      else if (target.id === "modal-method-select") draft.calculationMethod = target.value;
      else if (target.id === "modal-formula-select") draft.formulaId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-manual-qty") draft.manualQty = target.value === "" ? null : Number(target.value);
      else if (target.id === "modal-wastage") draft.wastagePercent = target.value === "" ? "" : Number(target.value);
      else return false;
      state.modal.errors = {};
      renderModal();
      return true;
    }

    function defaultServiceDraft(line) {
      const printingQty = getFormulaByCode("PRINTING_QTY");
      if (line) {
        return {
          serviceId: line.serviceId,
          calculationMethod: line.calculationMethod,
          formulaId: line.formulaId || (printingQty ? printingQty.id : null),
          manualQty: line.manualQty
        };
      }
      return {
        serviceId: null,
        calculationMethod: "formula",
        formulaId: printingQty ? printingQty.id : null,
        manualQty: 1
      };
    }

    function validateServiceDraft(draft, lineId) {
      const errors = {};
      if (!getSelectedFinishedGood()) errors.finishedGood = "Select a Finished Good before adding services.";
      if (!draft.serviceId) errors.serviceId = "Service is required.";
      const service = getService(draft.serviceId);
      if (draft.serviceId && !service) errors.serviceId = "Service must exist in the Service Master.";
      if (service && !Number.isFinite(Number(service.serviceRate))) errors.rate = "Service rate from the Service Master is not valid.";
      if (draft.calculationMethod === "formula") {
        const selectedFormula = getFormula(draft.formulaId);
        if (!draft.formulaId) errors.formulaId = "Formula is required when Formula method is selected.";
        else if (!selectedFormula || !selectedFormula.isActive || selectedFormula.type !== "Service") {
          errors.formulaId = "Selected formula is not valid or is inactive.";
        }
      } else {
        const qty = Number(draft.manualQty);
        if (!Number.isFinite(qty) || qty <= 0) errors.manualQty = "Quantity / Piece must be greater than 0.";
      }
      if (draft.serviceId && findDuplicateService(draft.serviceId, lineId)) {
        errors.duplicate = "This service is already added to the BOM.";
      }
      if (!Object.keys(errors).length) {
        const preview = calculateServiceCost({
          id: lineId || 0,
          serviceId: draft.serviceId,
          calculationMethod: draft.calculationMethod,
          formulaId: draft.formulaId,
          manualQty: draft.manualQty,
          quantity: 0,
          rate: 0,
          costPerPiece: 0
        });
        if (preview.error) errors.formula = preview.error;
      }
      return errors;
    }

    function renderServiceFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const service = getService(draft.serviceId);
      const formula = getFormula(draft.formulaId);
      const preview = service ? calculateServiceCost({
        id: state.modal.lineId || 0,
        serviceId: draft.serviceId,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.formulaId,
        manualQty: draft.manualQty,
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      }) : null;

      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">BOM line</div>
            <strong>${state.modal.mode === "edit" ? "Edit Service" : "Add Service"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="modal-service-select">Service</label>
              <select id="modal-service-select" class="full-select ${errors.serviceId ? "input-invalid" : ""}">
                <option value="">Select a service...</option>
                ${services.map((item) => `
                  <option value="${item.id}" ${Number(draft.serviceId) === item.id ? "selected" : ""}>
                    ${escapeHtml(item.code)} — ${escapeHtml(item.name)}
                  </option>
                `).join("")}
              </select>
              ${errors.serviceId ? `<div class="field-error">${escapeHtml(errors.serviceId)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="modal-service-method">Calculation Method</label>
              <select id="modal-service-method" class="full-select">
                <option value="formula" ${draft.calculationMethod === "formula" ? "selected" : ""}>Formula</option>
                <option value="manual" ${draft.calculationMethod === "manual" ? "selected" : ""}>Manual</option>
              </select>
            </div>
            ${draft.calculationMethod === "formula" ? `
              <div>
                <label class="form-label" for="modal-service-formula">Formula</label>
                <select id="modal-service-formula" class="full-select ${errors.formulaId ? "input-invalid" : ""}">
                  <option value="">Select a formula...</option>
                  ${getServiceFormulas().map((item) => `
                    <option value="${item.id}" ${Number(draft.formulaId) === item.id ? "selected" : ""}>
                      ${escapeHtml(item.name)} (${escapeHtml(item.code)})
                    </option>
                  `).join("")}
                </select>
                ${formula ? `<p class="stat-hint mono" style="margin-top:8px;">${escapeHtml(formula.expression)}</p>` : ""}
                ${errors.formulaId ? `<div class="field-error">${escapeHtml(errors.formulaId)}</div>` : ""}
                ${errors.formula ? `<div class="field-error">${escapeHtml(errors.formula)}</div>` : ""}
              </div>
            ` : `
              <div>
                <label class="form-label" for="modal-service-qty">Quantity / Piece</label>
                <input id="modal-service-qty" class="full-search ${errors.manualQty ? "input-invalid" : ""}" type="number" min="0.0001" step="0.0001" value="${draft.manualQty ?? ""}" />
                ${errors.manualQty ? `<div class="field-error">${escapeHtml(errors.manualQty)}</div>` : ""}
              </div>
            `}
          </div>
          ${service ? `
            <div class="detail-list">
              <div><span>Service Name</span><strong>${escapeHtml(service.name)}</strong></div>
              <div><span>Code</span><strong class="mono">${escapeHtml(service.code)}</strong></div>
              <div><span>UOM</span><strong>${escapeHtml(service.uom)}</strong></div>
              <div><span>Service Rate</span><strong>${formatRatePkr(service.serviceRate, service.rateUOM)}</strong></div>
              <div><span>Qty UOM</span><strong>${escapeHtml(service.uom)}</strong></div>
            </div>
            <div class="rate-source">Rate Source: Service Master (PKR)</div>
          ` : ""}
          ${errors.duplicate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.duplicate)}</div>` : ""}
          ${errors.finishedGood ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.finishedGood)}</div>` : ""}
          ${errors.rate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.rate)}</div>` : ""}
          ${preview && !preview.error ? `
            <div class="preview-box">
              <div class="cost-row"><span>Qty / Piece</span><strong>${formatQty(preview.quantity)}</strong></div>
              <div class="cost-row"><span>Cost / Piece</span><strong>${formatRupees(preview.costPerPiece)}</strong></div>
            </div>
          ` : ""}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-service">Save</button>
        </div>
      `;
    }

    function renderServiceBreakdownModal() {
      const line = state.bomServices.find((item) => item.id === state.modal.lineId);
      const fg = getSelectedFinishedGood();
      if (!line || !fg) {
        return `<div class="modal-body"><p>Calculation details are unavailable.</p></div>`;
      }
      const service = getService(line.serviceId);
      const formula = getFormula(line.formulaId);
      const variables = service ? buildServiceFormulaVariables(fg, service) : {};
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Calculation Breakdown</div>
            <strong>Service calculation</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="detail-list">
            <div><span>Service</span><strong>${escapeHtml(service ? service.name : "—")}</strong></div>
            <div><span>Finished Good</span><strong>${escapeHtml(fg.product)} — ${escapeHtml(fg.variant)}</strong></div>
            <div><span>Dimensions</span><strong>${escapeHtml(formatDimensions(fg))}</strong></div>
            <div><span>Calculation Method</span><strong>${escapeHtml(line.calculationMethod === "manual" ? "Manual" : "Formula")}</strong></div>
            <div><span>Formula</span><strong>${line.calculationMethod === "formula" && formula ? escapeHtml(formula.code) : "—"}</strong></div>
            <div><span>Formula Expression</span><strong class="mono">${line.calculationMethod === "formula" && formula ? escapeHtml(formula.expression) : "—"}</strong></div>
            <div><span>Quantity / Piece</span><strong>${formatQty(line.quantity)}</strong></div>
            <div><span>Service Rate</span><strong>${service ? formatRatePkr(service.serviceRate, service.rateUOM) : "—"}</strong></div>
            <div><span>Rate Source</span><strong>Service Master</strong></div>
            <div><span>Service Cost / Piece</span><strong>${formatRupees(line.costPerPiece)}</strong></div>
          </div>
          <div class="section-kicker" style="margin-top:14px;">Variables</div>
          <div class="var-grid">
            ${Object.entries(variables).map(([key, value]) => `
              <div><span class="mono">${escapeHtml(key)}</span> = <strong>${value === null || value === undefined ? "—" : escapeHtml(value)}</strong></div>
            `).join("")}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-modal-close>Close</button>
        </div>
      `;
    }

    function openServiceModal(lineId) {
      if (!getSelectedFinishedGood()) return;
      const line = lineId ? state.bomServices.find((item) => item.id === Number(lineId)) : null;
      state.modal = {
        type: "service",
        selectedId: line ? line.serviceId : null,
        mode: line ? "edit" : "add",
        lineId: line ? line.id : null,
        draft: defaultServiceDraft(line),
        errors: {}
      };
      renderModal();
    }

    function openServiceBreakdownModal(lineId) {
      state.modal = {
        type: "service-breakdown",
        selectedId: null,
        mode: "view",
        lineId: Number(lineId),
        draft: null,
        errors: {}
      };
      renderModal();
    }

    function openDeleteServiceModal(lineId) {
      state.modal = {
        type: "confirm-delete-service",
        selectedId: null,
        mode: "delete",
        lineId: Number(lineId),
        draft: null,
        errors: {}
      };
      renderModal();
    }

    function saveServiceFromModal() {
      const draft = state.modal.draft;
      const errors = validateServiceDraft(draft, state.modal.lineId);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }

      const nextLine = calculateServiceCost({
        id: state.modal.lineId || nextBomLineId(),
        serviceId: Number(draft.serviceId),
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? Number(draft.formulaId) : null,
        manualQty: draft.calculationMethod === "manual" ? Number(draft.manualQty) : null,
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      });

      if (state.modal.mode === "edit") {
        state.bomServices = state.bomServices.map((line) => line.id === nextLine.id ? nextLine : line);
      } else {
        state.bomServices.push(nextLine);
      }

      recalculateBOMCosts();
      closeModal();
      refreshBomViews();
    }

    function confirmDeleteService() {
      state.bomServices = state.bomServices.filter((line) => line.id !== state.modal.lineId);
      recalculateBOMCosts();
      closeModal();
      refreshBomViews();
    }

    function updateServiceDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "service") return false;
      const draft = state.modal.draft;
      if (target.id === "modal-service-select") draft.serviceId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-service-method") draft.calculationMethod = target.value;
      else if (target.id === "modal-service-formula") draft.formulaId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-service-qty") draft.manualQty = target.value === "" ? null : Number(target.value);
      else return false;
      state.modal.errors = {};
      renderModal();
      return true;
    }

    function renderCurrentPage() {
      const page = state.currentPage;
      if (page === "dashboard") renderDashboard();
      if (page === "finished-goods") renderFinishedGoods();
      if (page === "raw-materials") renderRawMaterials();
      if (page === "services") renderServices();
      if (page === "style") renderStyles();
      if (page === "dimensions") renderDimensions();
      if (page === "formulas") renderFormulas();
      if (page === "bom-costing") renderBOMPage();
      if (page === "bom-list") {
        if (state.selectedFinishedGoodId) recalculateBOMCosts();
        renderBomList();
      }
      refreshIcons();
    }

    /* ==================================================
       Navigation
       ================================================== */

    function setSidebarOpen(open) {
      state.sidebarOpen = open;
      document.getElementById("sidebar").classList.toggle("open", open);
      document.getElementById("sidebar-overlay").classList.toggle("show", open);
    }

    function navigateTo(page) {
      if (!PAGE_META[page]) return;
      state.currentPage = page;

      document.querySelectorAll(".nav-item").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === page);
      });

      document.querySelectorAll(".page").forEach((section) => {
        section.classList.toggle("active", section.id === "page-" + page);
      });

      const meta = PAGE_META[page];
      document.getElementById("header-title").textContent = meta.title;
      document.getElementById("header-subtitle").textContent = meta.subtitle;

      setSidebarOpen(false);
      if (page !== "bom-costing") {
        state.fgSelectorOpen = false;
        closeModal();
      }
      renderCurrentPage();
    }

    function setupNavigation() {
      document.getElementById("sidebar-nav").addEventListener("click", (event) => {
        const btn = event.target.closest("[data-page]");
        if (!btn) return;
        navigateTo(btn.dataset.page);
      });

      document.getElementById("menu-btn").addEventListener("click", () => {
        setSidebarOpen(!state.sidebarOpen);
      });

      document.getElementById("sidebar-overlay").addEventListener("click", () => {
        setSidebarOpen(false);
      });
    }

    /* ==================================================
       Event handlers
       ================================================== */

    function restoreFocus(id) {
      const field = document.getElementById(id);
      if (!field) return;
      field.focus();
      try {
        const len = field.value.length;
        if (typeof field.setSelectionRange === "function") {
          field.setSelectionRange(len, len);
        }
      } catch (error) {
        /* some input types do not support selection ranges */
      }
    }

    function setupEventHandlers() {
      document.querySelector(".content").addEventListener("input", (event) => {
        const id = event.target.id;
        if (id === "fg-search") {
          state.searches.finishedGoods = event.target.value;
          renderFinishedGoods();
          refreshIcons();
          restoreFocus(id);
        } else if (id === "rm-search") {
          state.searches.rawMaterials = event.target.value;
          renderRawMaterials();
          refreshIcons();
          restoreFocus(id);
        } else if (id === "srv-search") {
          state.searches.services = event.target.value;
          renderServices();
          refreshIcons();
          restoreFocus(id);
        } else if (id === "bom-list-search") {
          state.searches.boms = event.target.value;
          renderBomList();
          refreshIcons();
          restoreFocus(id);
        } else if (id === "style-search") {
          state.searches.style = event.target.value;
          renderStyles();
          refreshIcons();
          restoreFocus(id);
        } else if (id === "dim-search") {
          state.searches.dimensions = event.target.value;
          renderDimensions();
          refreshIcons();
          restoreFocus(id);
        } else if (id === "formula-search") {
          state.searches.formulas = event.target.value;
          renderFormulas();
          refreshIcons();
          restoreFocus(id);
        } else if (id === "fg-combo-search") {
          state.searches.bomFinishedGood = event.target.value;
          state.fgSelectorOpen = true;
          renderFinishedGoodSelector();
          refreshIcons();
          restoreFocus(id);
        } else if (event.target.dataset.wastageLine) {
          const lineId = event.target.dataset.wastageLine;
          const caret = event.target.selectionStart;
          updateLineWastage(lineId, event.target.value);
          const next = document.querySelector(`[data-wastage-line="${lineId}"]`);
          if (next) {
            next.focus();
            try {
              const pos = Math.min(Number(caret) || next.value.length, next.value.length);
              next.setSelectionRange(pos, pos);
            } catch (error) {
              /* number inputs may not support selection ranges */
            }
          }
        }
      });

      document.querySelector(".content").addEventListener("change", (event) => {
        if (event.target.id === "formula-filter") {
          state.formulaFilter = event.target.value;
          renderFormulas();
          refreshIcons();
        }
        if (event.target.id === "bom-list-filter") {
          state.bomListFilter = event.target.value;
          renderBomList();
          refreshIcons();
        }
      });

      document.querySelector(".content").addEventListener("click", (event) => {
        if (event.target.closest("#fg-combo")) {
          event.stopPropagation();
        }

        if (event.target.closest("#fg-combo-toggle")) {
          state.fgSelectorOpen = !state.fgSelectorOpen;
          if (state.fgSelectorOpen && getSelectedFinishedGood() && !state.searches.bomFinishedGood) {
            state.searches.bomFinishedGood = "";
          }
          renderFinishedGoodSelector();
          refreshIcons();
          return;
        }

        const option = event.target.closest("[data-fg-id]");
        if (option) {
          handleFinishedGoodChange(option.dataset.fgId);
          return;
        }

        if (event.target.closest("#btn-save-draft")) {
          saveDraftBom();
          return;
        }
        if (event.target.closest("#btn-activate-bom")) {
          activateCurrentBom();
          return;
        }
        if (event.target.closest("#btn-duplicate-bom")) {
          duplicateBomRecord();
          return;
        }
        if (event.target.closest("#btn-new-bom")) {
          resetBomEditor();
          navigateTo("bom-costing");
          return;
        }
        const loadBom = event.target.closest("[data-load-bom]");
        if (loadBom) {
          loadBomIntoEditor(loadBom.dataset.loadBom);
          return;
        }
        const duplicateSaved = event.target.closest("[data-duplicate-bom]");
        if (duplicateSaved) {
          duplicateBomRecord(duplicateSaved.dataset.duplicateBom);
          return;
        }
        if (event.target.closest("#btn-add-product")) {
          openFinishedGoodModal();
          return;
        }
        if (event.target.closest("#btn-add-material-master")) {
          openRawMaterialMasterModal();
          return;
        }
        if (event.target.closest("#btn-add-service-master")) {
          openServiceMasterModal();
          return;
        }
        if (event.target.closest("#btn-add-style")) {
          openStyleModal();
          return;
        }
        if (event.target.closest("#btn-add-dimension")) {
          openDimensionModal();
          return;
        }
        if (event.target.closest("#btn-new-formula")) {
          openFormulaBuilder();
          return;
        }

        const editFormula = event.target.closest("[data-edit-formula]");
        if (editFormula) {
          openFormulaBuilder(editFormula.dataset.editFormula);
          return;
        }

        const testFormula = event.target.closest("[data-test-formula]");
        if (testFormula) {
          openFormulaTest(testFormula.dataset.testFormula);
          return;
        }

        const toggleFormula = event.target.closest("[data-toggle-formula]");
        if (toggleFormula) {
          toggleFormulaActive(toggleFormula.dataset.toggleFormula);
          return;
        }

        if (event.target.closest("#btn-add-material")) {
          openMaterialModal();
          return;
        }

        if (event.target.closest("#btn-add-service")) {
          openServiceModal();
          return;
        }

        const editBtn = event.target.closest("[data-edit-line]");
        if (editBtn) {
          openMaterialModal(editBtn.dataset.editLine);
          return;
        }

        const deleteBtn = event.target.closest("[data-delete-line]");
        if (deleteBtn) {
          openDeleteMaterialModal(deleteBtn.dataset.deleteLine);
          return;
        }

        const breakdownBtn = event.target.closest("[data-breakdown-line]");
        if (breakdownBtn) {
          openBreakdownModal(breakdownBtn.dataset.breakdownLine);
          return;
        }

        const editService = event.target.closest("[data-edit-service]");
        if (editService) {
          openServiceModal(editService.dataset.editService);
          return;
        }

        const deleteService = event.target.closest("[data-delete-service]");
        if (deleteService) {
          openDeleteServiceModal(deleteService.dataset.deleteService);
          return;
        }

        const breakdownService = event.target.closest("[data-breakdown-service]");
        if (breakdownService) {
          openServiceBreakdownModal(breakdownService.dataset.breakdownService);
          return;
        }
      });

      document.querySelector(".content").addEventListener("focusin", (event) => {
        if (event.target.id === "fg-combo-search" && !state.fgSelectorOpen) {
          state.fgSelectorOpen = true;
          renderFinishedGoodSelector();
          refreshIcons();
          restoreFocus("fg-combo-search");
        }
      });

      document.addEventListener("click", (event) => {
        if (!state.fgSelectorOpen) return;
        if (event.target.closest("#fg-combo") || event.target.closest("#fg-combo-toggle")) return;
        state.fgSelectorOpen = false;
        if (state.currentPage === "bom-costing") {
          renderFinishedGoodSelector();
          refreshIcons();
        }
      });

      document.getElementById("modal-backdrop").addEventListener("click", (event) => {
        if (event.target.id === "modal-backdrop" || event.target.closest("[data-modal-close]")) {
          closeModal();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && state.modal && state.modal.type) {
          closeModal();
        }
      });

      document.getElementById("modal-dialog").addEventListener("change", (event) => {
        if (event.target.id === "fb-type") {
          state.modal.draft.type = event.target.value;
          return;
        }
        if (updateFinishedGoodDraftFromEvent(event.target)) return;
        if (updateRawMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "rm-category") renderModal();
          restoreFocus(event.target.id);
          return;
        }
        if (updateServiceMasterDraftFromEvent(event.target)) return;
        if (updateStyleDraftFromEvent(event.target)) return;
        if (updateDimensionDraftFromEvent(event.target)) {
          renderModal();
          restoreFocus(event.target.id);
          return;
        }
        if (updateServiceDraftFromEvent(event.target)) {
          restoreFocus(event.target.id);
          return;
        }
        if (updateMaterialDraftFromEvent(event.target)) {
          restoreFocus(event.target.id);
        }
      });

      document.getElementById("modal-dialog").addEventListener("input", (event) => {
        if (event.target.id === "modal-manual-qty" || event.target.id === "modal-wastage") {
          updateMaterialDraftFromEvent(event.target);
          restoreFocus(event.target.id);
        }
        if (event.target.id === "modal-service-qty") {
          updateServiceDraftFromEvent(event.target);
          restoreFocus(event.target.id);
        }
        if (updateFinishedGoodDraftFromEvent(event.target)) {
          if (event.target.id === "rm-code") event.target.value = String(event.target.value || "").toUpperCase();
          restoreFocus(event.target.id);
        }
        if (updateRawMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "rm-code") event.target.value = String(event.target.value || "").toUpperCase();
          restoreFocus(event.target.id);
        }
        if (updateServiceMasterDraftFromEvent(event.target)) {
          if (event.target.id === "srv-code") event.target.value = String(event.target.value || "").toUpperCase();
          restoreFocus(event.target.id);
        }
        if (updateStyleDraftFromEvent(event.target)) {
          if (event.target.id === "style-code") event.target.value = String(event.target.value || "").toUpperCase();
          restoreFocus(event.target.id);
        }
        if (updateDimensionDraftFromEvent(event.target)) {
          if (event.target.id === "dim-l" || event.target.id === "dim-w" || event.target.id === "dim-h") {
            renderModal();
          }
          restoreFocus(event.target.id);
        }
        if (!state.modal.draft) return;
        if (event.target.id === "fb-name") state.modal.draft.name = event.target.value;
        if (event.target.id === "fb-code") {
          event.target.value = event.target.value.toUpperCase();
          state.modal.draft.code = event.target.value;
        }
        if (event.target.id === "fb-description") state.modal.draft.description = event.target.value;
        if (event.target.dataset.testVar) {
          state.modal.draft.testValues[event.target.dataset.testVar] = event.target.value === "" ? "" : Number(event.target.value);
        }
        if (event.target.id === "fb-expression") {
          state.modal.draft.expression = event.target.value;
          state.modal.cursor = event.target.selectionStart;
          state.modal.draft.testResult = null;
          renderModal();
          restoreFocus("fb-expression");
        }
      });

      document.getElementById("modal-dialog").addEventListener("click", (event) => {
        const insert = event.target.closest("[data-insert]");
        if (insert) {
          insertIntoExpression(insert.dataset.insert);
          return;
        }
        if (event.target.closest("#btn-save-finished-good")) {
          saveFinishedGoodFromModal();
          return;
        }
        if (event.target.closest("#btn-save-raw-material")) {
          saveRawMaterialFromModal();
          return;
        }
        if (event.target.closest("#btn-save-service-master")) {
          saveServiceMasterFromModal();
          return;
        }
        if (event.target.closest("#btn-save-style")) {
          saveStyleFromModal();
          return;
        }
        if (event.target.closest("#btn-save-dimension")) {
          saveDimensionFromModal();
          return;
        }
        if (event.target.closest("#btn-save-formula")) {
          saveFormulaFromModal();
          return;
        }
        if (event.target.closest("#btn-test-formula") || event.target.closest("#btn-calculate-formula")) {
          runFormulaTest();
          return;
        }
        if (event.target.closest("#btn-save-material")) {
          saveMaterialFromModal();
          return;
        }
        if (event.target.closest("#btn-save-service")) {
          saveServiceFromModal();
          return;
        }
        if (event.target.closest("#btn-confirm-delete")) {
          confirmDeleteMaterial();
          return;
        }
        if (event.target.closest("#btn-confirm-delete-service")) {
          confirmDeleteService();
          return;
        }
      });
    }

    /* ==================================================
       Boot
       ================================================== */

    function init() {
      setupNavigation();
      setupEventHandlers();
      navigateTo("dashboard");
    }

    document.addEventListener("DOMContentLoaded", init);
