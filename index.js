import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfYEIou9GM0h1JX4-ncYn6SrseU9ZhmWs",
  authDomain: "erp-bom-app.firebaseapp.com",
  projectId: "erp-bom-app",
  storageBucket: "erp-bom-app.firebasestorage.app",
  messagingSenderId: "621897236908",
  appId: "1:621897236908:web:91df86414620e9d450fa09",
  measurementId: "G-V3XZR3DF9M"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

    /* ==================================================
       Static master data
       ================================================== */

    const finishedGoods = [
      {
        id: 1,
        product: "Cake Box",
        variant: "1 Pound",
        style: "WINDOW LID",
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
        style: "WINDOW LID",
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
        ply: 2,
        dimensions: { L: 12, W: 12, H: 2 },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      }
    ];

    const styles = [
      { id: 101, name: "WINDOW LID", description: "Lid with window cutout", status: "Active" },
      { id: 102, name: "SIMPLE LID", description: "Lid without cutout", status: "Active" },
      { id: 103, name: "STANDARD", description: "Standard box style", status: "Active" },
      { id: 104, name: "Locking Flap", description: "Locking flap carton", status: "Active" }
    ];

    const styleVariables = [
      { id: 1, styleId: 101, variableCode: "GLUE_FLAP", value: 12.25, unit: "mm" },
      { id: 2, styleId: 101, variableCode: "SHEET_WIDTH", value: 100, unit: "cm" },
      { id: 3, styleId: 102, variableCode: "GLUE_FLAP", value: 10.5, unit: "mm" },
      { id: 4, styleId: 102, variableCode: "SHEET_WIDTH", value: 95, unit: "cm" },
      { id: 5, styleId: 103, variableCode: "GLUE_FLAP", value: 15.0, unit: "mm" }
    ];

    const styleFormulas = [
      { id: 1, styleId: 101, formulaId: 315, order: 1, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: 2, styleId: 101, formulaId: 316, order: 2, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: 3, styleId: 103, formulaId: 316, order: 1, createdAt: "2026-01-01T00:00:00.000Z" }
    ];

    const formulaVariables = [
      { id: 1, code: "L", name: "Length", description: "Product Length", dataType: "numeric", defaultValue: 7, unit: "inch", category: "Dimension", isActive: true },
      { id: 2, code: "W", name: "Width", description: "Product Width", dataType: "numeric", defaultValue: 7, unit: "inch", category: "Dimension", isActive: true },
      { id: 3, code: "H", name: "Height", description: "Product Height", dataType: "numeric", defaultValue: 4, unit: "inch", category: "Dimension", isActive: true },
      { id: 4, code: "GSM", name: "Basis Weight", description: "Paper Basis Weight", dataType: "numeric", defaultValue: 150, unit: "gsm", category: "Material", isActive: true },
      { id: 5, code: "PLY", name: "Ply Count", description: "Number of Plies", dataType: "numeric", defaultValue: 3, unit: "", category: "Material", isActive: true },
      { id: 6, code: "GLUE_FLAP", name: "Glue Flap Width", description: "Width of glue overlap", dataType: "numeric", defaultValue: 12.5, unit: "mm", category: "Costing", isActive: true },
      { id: 7, code: "WASTAGE", name: "Wastage Percentage", description: "Material wastage percentage", dataType: "numeric", defaultValue: 5, unit: "%", category: "Costing", isActive: true },
      { id: 8, code: "SHEET_WIDTH", name: "Sheet Width", description: "Standard sheet width", dataType: "numeric", defaultValue: 40, unit: "inch", category: "Sheet", isActive: true },
      { id: 9, code: "SHEET_LENGTH", name: "Sheet Length", description: "Standard sheet length", dataType: "numeric", defaultValue: 48, unit: "inch", category: "Sheet", isActive: true },
      { id: 10, code: "ORDER_QTY", name: "Order Quantity", description: "Pieces to manufacture", dataType: "numeric", defaultValue: 1, unit: "pieces", category: "Costing", isActive: true },
      { id: 11, code: "NET_QTY", name: "Net Quantity", description: "Net quantity before wastage", dataType: "numeric", defaultValue: 1, unit: "", category: "Costing", isActive: true },
      { id: 12, code: "SHEET_AREA", name: "Sheet Area", description: "Standard sheet area", dataType: "numeric", defaultValue: 1920, unit: "sq.inch", category: "Sheet", isActive: true },
      { id: 13, code: "PIECE_AREA", name: "Piece Area", description: "Finished piece area", dataType: "numeric", defaultValue: 435, unit: "sq.inch", category: "Area", isActive: true },
      { id: 14, code: "MATERIAL_RATE", name: "Material Rate", description: "Purchasing rate from material master", dataType: "numeric", defaultValue: 150, unit: "Rs./kg", category: "Costing", isActive: true },
      { id: 15, code: "SERVICE_RATE", name: "Service Rate", description: "Rate from service master", dataType: "numeric", defaultValue: 2.5, unit: "Rs./piece", category: "Service", isActive: true },
      { id: 16, code: "PRINT_AREA", name: "Print Area", description: "Printable area", dataType: "numeric", defaultValue: 435, unit: "sq.inch", category: "Area", isActive: true },
      { id: 17, code: "MATERIAL_COST", name: "Material Cost", description: "Rolled-up material cost", dataType: "numeric", defaultValue: 0, unit: "Rs.", category: "Costing", isActive: true },
      { id: 18, code: "SERVICE_COST", name: "Service Cost", description: "Rolled-up service cost", dataType: "numeric", defaultValue: 0, unit: "Rs.", category: "Service", isActive: true }
    ];

    const dimensions = [
      { id: 201, name: "7x7x4", description: "Small Box 7x7x4 inches", code: "7x7x4", L: 7, W: 7, H: 4, uom: "inch", unit: "inch", status: "Active" },
      { id: 202, name: "10x10x5", description: "Medium Box 10x10x5 inches", code: "10x10x5", L: 10, W: 10, H: 5, uom: "inch", unit: "inch", status: "Active" },
      { id: 203, name: "12x12x2", description: "Large Box 12x12x2 inches", code: "12x12x2", L: 12, W: 12, H: 2, uom: "inch", unit: "inch", status: "Active" },
      { id: 204, name: "9x9x5", description: "Cake box 9x9x5 inches", code: "9x9x5", L: 9, W: 9, H: 5, uom: "inch", unit: "inch", status: "Active" }
    ];

    const rawMaterials = [
      { id: 101, code: "RM-KRAFT-125", name: "Kraft Paper 125 GSM", category: "Paper", uom: "kg", purchasingRate: 165, rateUOM: "kg", gsm: 125, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 102, code: "RM-KRAFT-150", name: "Kraft Paper 150 GSM", category: "Paper", uom: "kg", purchasingRate: 185, rateUOM: "kg", gsm: 150, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 103, code: "RM-FLUTE-120", name: "Fluting Paper 120 GSM", category: "Paper", uom: "kg", purchasingRate: 155, rateUOM: "kg", gsm: 120, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 104, code: "RM-FLUTE-140", name: "Fluting Paper 140 GSM", category: "Paper", uom: "kg", purchasingRate: 175, rateUOM: "kg", gsm: 140, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 105, code: "RM-DUPLEX-300", name: "Duplex Board 300 GSM", category: "Board", uom: "kg", purchasingRate: 160, rateUOM: "kg", gsm: 300, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 106, code: "RM-DUPLEX-350", name: "Duplex Board 350 GSM", category: "Board", uom: "kg", purchasingRate: 175, rateUOM: "kg", gsm: 350, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 107, code: "RM-SHEET-3PLY", name: "Corrugated Sheet 3 Ply", category: "Sheet", uom: "sheet", purchasingRate: 150, rateUOM: "sheet", gsm: null, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 108, code: "RM-FILM-WIN", name: "Window Film", category: "Film", uom: "kg", purchasingRate: 300, rateUOM: "kg", gsm: null, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 109, code: "RM-INK-PRINT", name: "Printing Ink", category: "Consumable", uom: "kg", purchasingRate: 800, rateUOM: "kg", gsm: null, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 110, code: "RM-GLUE-ADH", name: "Glue / Adhesive", category: "Consumable", uom: "kg", purchasingRate: 600, rateUOM: "kg", gsm: null, status: "Active", qtyFormulaId: null, dimensionIds: [] },
      { id: 111, code: "RM-BOARD-CORR", name: "Corrugated Board", category: "Board", uom: "sq.meter", purchasingRate: 150, rateUOM: "sq.meter", gsm: 180, status: "Active", qtyFormulaId: null, dimensionIds: [] }
    ];

    const services = [
      { id: 201, code: "SRV-PRINT", name: "Printing", uom: "pieces", serviceRate: 3.5, rateUOM: "piece", status: "Active", formulaId: null, dimensionIds: [] },
      { id: 202, code: "SRV-DIECUT", name: "Die Cutting", uom: "pieces", serviceRate: 2, rateUOM: "piece", status: "Active", formulaId: null, dimensionIds: [] },
      { id: 203, code: "SRV-LAM", name: "Lamination", uom: "pieces", serviceRate: 4.5, rateUOM: "piece", status: "Active", formulaId: null, dimensionIds: [] },
      { id: 204, code: "SRV-PASTE", name: "Pasting", uom: "pieces", serviceRate: 1, rateUOM: "piece", status: "Active", formulaId: null, dimensionIds: [] },
      { id: 205, code: "SRV-WINPASTE", name: "Window Pasting", uom: "pieces", serviceRate: 1.25, rateUOM: "piece", status: "Active", formulaId: null, dimensionIds: [] },
      { id: 206, code: "SRV-STITCH", name: "Stitching", uom: "pieces", serviceRate: 0.85, rateUOM: "piece", status: "Active", formulaId: null, dimensionIds: [] },
      { id: 207, code: "SRV-PLATE", name: "Plate", uom: "job", serviceRate: 1800, rateUOM: "job", status: "Active", formulaId: null, dimensionIds: [] },
      { id: 208, code: "SRV-LABOUR", name: "Labour", uom: "pieces", serviceRate: 4.5, rateUOM: "piece", status: "Active", formulaId: null, dimensionIds: [] }
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
      },
      {
        id: 315,
        code: "GLUE_CALC",
        name: "Glue Amount",
        type: "Style",
        description: "Glue flap allowance doubled for this style.",
        expression: "GLUE_FLAP * 2",
        isActive: true
      },
      {
        id: 316,
        code: "AREA_CALC",
        name: "Covered Area",
        type: "Style",
        description: "Simple length times width for the style blank.",
        expression: "L * W",
        isActive: true
      }
    ];

    /* Transaction / configuration data. Do not mix with master data. */
    const boms = [];

    const SQ_IN_TO_SQ_M = 0.00064516;
    const DIMENSION_RATE_DIVISOR = 1000;
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

    function snapshotData(value) {
      return JSON.parse(JSON.stringify(value));
    }

    const SEED_DATA = {
      finishedGoods: snapshotData(finishedGoods),
      rawMaterials: snapshotData(rawMaterials),
      services: snapshotData(services),
      formulas: snapshotData(formulas),
      boms: snapshotData(boms),
      styles: snapshotData(styles),
      dimensions: snapshotData(dimensions),
      formulaVariables: snapshotData(formulaVariables),
      styleVariables: snapshotData(styleVariables),
      styleFormulas: snapshotData(styleFormulas)
    };

    const FORMULA_TYPES = ["Material", "Service", "Style"];

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
      style: { title: "Style", subtitle: "Style master and style variables" },
      "formula-variables": { title: "Formula Variables", subtitle: "Shared variables used by formulas" },
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
        formulaVariables: "",
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
      bomStyleResults: [],
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
       IndexedDB persistence
       ================================================== */

    const IDB_NAME = "packaging-erp-db";
    const IDB_VERSION = 2;
    const IDB_COLLECTION_STORES = [
      "finishedGoods",
      "rawMaterials",
      "services",
      "formulas",
      "boms",
      "styles",
      "dimensions",
      "formulaVariables",
      "styleVariables",
      "styleFormulas"
    ];

    let idb = null;
    let idbReady = false;
    let idbHydrating = false;
    let lastSavedAt = null;
    let persistEditorTimer = null;
    let persistPrefsTimer = null;
    let hydratedFromSeed = false;
    let cloudUser = null;
    let cloudSyncTimer = null;
    let cloudReconcileInFlight = false;
    let suppressCloudPush = false;
    let lastReconciledUid = null;

    function initIndexedDB() {
      return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
          reject(new Error("IndexedDB is not supported in this browser"));
          return;
        }
        const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
        request.onupgradeneeded = (event) => {
          const database = event.target.result;
          IDB_COLLECTION_STORES.forEach((name) => {
            if (!database.objectStoreNames.contains(name)) {
              database.createObjectStore(name, { keyPath: "id" });
            }
          });
          if (!database.objectStoreNames.contains("appState")) {
            database.createObjectStore("appState", { keyPath: "key" });
          }
        };
        request.onsuccess = () => {
          idb = request.result;
          idb.onerror = (event) => console.error("IndexedDB error", event.target && event.target.error);
          idbReady = true;
          resolve(idb);
        };
        request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
        request.onblocked = () => reject(new Error("IndexedDB open was blocked"));
      });
    }

    function getCollectionArray(storeName) {
      if (storeName === "finishedGoods") return finishedGoods;
      if (storeName === "rawMaterials") return rawMaterials;
      if (storeName === "services") return services;
      if (storeName === "formulas") return formulas;
      if (storeName === "boms") return boms;
      if (storeName === "styles") return styles;
      if (storeName === "dimensions") return dimensions;
      if (storeName === "formulaVariables") return formulaVariables;
      if (storeName === "styleVariables") return styleVariables;
      if (storeName === "styleFormulas") return styleFormulas;
      return null;
    }

    function replaceArrayContents(target, items) {
      target.length = 0;
      (items || []).forEach((item) => target.push(item));
    }

    function saveToIndexedDB(storeName, arrayData) {
      return new Promise((resolve, reject) => {
        if (!idb) {
          reject(new Error("IndexedDB is not ready"));
          return;
        }
        const tx = idb.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.clear();
        (arrayData || []).forEach((item) => store.put(snapshotData(item)));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error("Failed to save " + storeName));
        tx.onabort = () => reject(tx.error || new Error("Save aborted for " + storeName));
      });
    }

    function deleteFromIndexedDB(storeName, itemId) {
      return new Promise((resolve, reject) => {
        if (!idb) {
          reject(new Error("IndexedDB is not ready"));
          return;
        }
        const tx = idb.transaction(storeName, "readwrite");
        tx.objectStore(storeName).delete(itemId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error("Failed to delete from " + storeName));
      });
    }

    function loadAllFromStore(storeName) {
      return new Promise((resolve, reject) => {
        if (!idb) {
          reject(new Error("IndexedDB is not ready"));
          return;
        }
        const tx = idb.transaction(storeName, "readonly");
        const request = tx.objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error || new Error("Failed to load " + storeName));
      });
    }

    function getAppStateRecord(key) {
      return new Promise((resolve, reject) => {
        if (!idb) {
          reject(new Error("IndexedDB is not ready"));
          return;
        }
        const tx = idb.transaction("appState", "readonly");
        const request = tx.objectStore("appState").get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error("Failed to read app state"));
      });
    }

    function putAppStateRecord(record) {
      return new Promise((resolve, reject) => {
        if (!idb) {
          reject(new Error("IndexedDB is not ready"));
          return;
        }
        const tx = idb.transaction("appState", "readwrite");
        tx.objectStore("appState").put(snapshotData(record));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error("Failed to write app state"));
      });
    }

    function persistAllCollections() {
      return Promise.all(
        IDB_COLLECTION_STORES.map((name) => saveToIndexedDB(name, getCollectionArray(name)))
      );
    }

    function persistSequencesNow() {
      return putAppStateRecord({
        key: "sequences",
        bomLineSeq,
        bomSeq,
        formulaSeq
      });
    }

    function persistEditorNow() {
      return putAppStateRecord({
        key: "editor",
        selectedFinishedGoodId: state.selectedFinishedGoodId,
        currentBOM: state.currentBOM,
        bomMaterials: state.bomMaterials,
        bomServices: state.bomServices
      });
    }

    function persistPrefsNow() {
      return putAppStateRecord({
        key: "prefs",
        currentPage: state.currentPage,
        searches: state.searches,
        formulaFilter: state.formulaFilter,
        bomListFilter: state.bomListFilter
      });
    }

    function persistMetaNow() {
      const stamp = (lastSavedAt || new Date()).toISOString();
      return putAppStateRecord({
        key: "meta",
        initialized: true,
        lastSavedAt: stamp
      });
    }

    function setSaveStatus(text, kind) {
      const el = document.getElementById("save-status");
      if (!el) return;
      el.textContent = text;
      el.className = "save-status" + (kind ? " is-" + kind : "");
    }

    function formatSavedClock(date) {
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }

    function formatLastSavedRelative() {
      if (!lastSavedAt) return "Not saved yet";
      const diff = Date.now() - lastSavedAt.getTime();
      if (diff < 45000) return "Saved just now";
      const minutes = Math.round(diff / 60000);
      if (minutes === 1) return "Last saved: 1 minute ago";
      if (minutes < 60) return "Last saved: " + minutes + " minutes ago";
      return "Last saved: " + formatSavedClock(lastSavedAt);
    }

    function markSaved() {
      lastSavedAt = new Date();
      setSaveStatus("✓ Saved", "saved");
      persistMetaNow().catch((error) => console.error("Failed to save offline metadata", error));
    }

    function afterDataChange(...storeNames) {
      if (!idbReady || idbHydrating) return Promise.resolve();
      const unique = [...new Set(storeNames.filter(Boolean))];
      if (!unique.length) return Promise.resolve();
      setSaveStatus("Saving...", "saving");
      return Promise.all(unique.map((name) => saveToIndexedDB(name, getCollectionArray(name))))
        .then(() => persistSequencesNow())
        .then(() => {
          markSaved();
          syncDataChangeToCloud();
        })
        .catch((error) => {
          console.error("Failed to save offline data", error);
          setSaveStatus("Save failed", "error");
          showNotification("Failed to save offline data", "error");
        });
    }

    function persistEditorState() {
      if (!idbReady || idbHydrating) return;
      clearTimeout(persistEditorTimer);
      persistEditorTimer = setTimeout(() => {
        setSaveStatus("Saving...", "saving");
        Promise.all([persistEditorNow(), persistSequencesNow()])
          .then(() => {
            markSaved();
            syncDataChangeToCloud();
          })
          .catch((error) => {
            console.error("Failed to save offline data", error);
            setSaveStatus("Save failed", "error");
            showNotification("Failed to save offline data", "error");
          });
      }, 180);
    }

    function persistPrefs() {
      if (!idbReady || idbHydrating) return;
      clearTimeout(persistPrefsTimer);
      persistPrefsTimer = setTimeout(() => {
        persistPrefsNow().catch((error) => console.error("Failed to save preferences", error));
      }, 400);
    }

    function isCloudLinked() {
      return Boolean((auth.currentUser && auth.currentUser.uid) || localStorage.getItem("firebaseUserId"));
    }

    function getCurrentUser() {
      const user = auth.currentUser;
      return {
        uid: (user && user.uid) || localStorage.getItem("firebaseUserId"),
        email: (user && user.email) || localStorage.getItem("firebaseUserEmail")
      };
    }

    function rememberCloudUser(user) {
      if (!user) return;
      cloudUser = user;
      localStorage.setItem("firebaseUserId", user.uid);
      localStorage.setItem("firebaseUserEmail", user.email || "");
    }

    function forgetCloudUser() {
      cloudUser = null;
      lastReconciledUid = null;
      localStorage.removeItem("firebaseUserId");
      localStorage.removeItem("firebaseUserEmail");
    }

    function parseStamp(value) {
      const t = Date.parse(value);
      return Number.isFinite(t) ? t : 0;
    }

    function collectCloudBackupPayload() {
      return snapshotData({
        finishedGoods,
        rawMaterials,
        services,
        formulas,
        formulaVariables,
        styles,
        styleVariables,
        styleFormulas,
        dimensions,
        boms,
        sequences: {
          bomLineSeq,
          bomSeq,
          formulaSeq
        },
        editor: {
          selectedFinishedGoodId: state.selectedFinishedGoodId,
          currentBOM: state.currentBOM,
          bomMaterials: state.bomMaterials,
          bomServices: state.bomServices
        },
        syncTimestamp: new Date().toISOString()
      });
    }

    async function saveAllDataToIndexedDB() {
      if (!idbReady) return;
      await persistAllCollections();
      await persistSequencesNow();
      await persistEditorNow();
      await persistMetaNow();
    }

    function applyCloudPayload(cloudData) {
      replaceArrayContents(finishedGoods, cloudData.finishedGoods || []);
      replaceArrayContents(rawMaterials, cloudData.rawMaterials || []);
      replaceArrayContents(services, cloudData.services || []);
      replaceArrayContents(formulas, cloudData.formulas || []);
      replaceArrayContents(formulaVariables, cloudData.formulaVariables || []);
      replaceArrayContents(styles, cloudData.styles || []);
      replaceArrayContents(styleVariables, cloudData.styleVariables || []);
      replaceArrayContents(styleFormulas, cloudData.styleFormulas || []);
      replaceArrayContents(dimensions, cloudData.dimensions || []);
      replaceArrayContents(boms, cloudData.boms || []);
      sanitizeNumericMasters();
      const sequences = cloudData.sequences || {};
      if (Number.isFinite(sequences.bomLineSeq)) bomLineSeq = sequences.bomLineSeq;
      if (Number.isFinite(sequences.bomSeq)) bomSeq = sequences.bomSeq;
      if (Number.isFinite(sequences.formulaSeq)) formulaSeq = sequences.formulaSeq;
      const editor = cloudData.editor;
      if (editor) {
        state.selectedFinishedGoodId = editor.selectedFinishedGoodId || null;
        state.currentBOM = editor.currentBOM || null;
        state.bomMaterials = Array.isArray(editor.bomMaterials) ? editor.bomMaterials : [];
        state.bomServices = Array.isArray(editor.bomServices) ? editor.bomServices : [];
      }
      syncSequencesFromData();
      ensureSeedStyleFormulas();
      syncSequencesFromData();
      if (state.selectedFinishedGoodId && getSelectedFinishedGood()) {
        try {
          recalculateBOMCosts();
        } catch (error) {
          console.error("Could not recalculate restored BOM", error);
        }
      } else if (state.selectedFinishedGoodId && !getSelectedFinishedGood()) {
        state.selectedFinishedGoodId = null;
        state.currentBOM = null;
        state.bomMaterials = [];
        state.bomServices = [];
        state.bomStyleResults = [];
      }
    }

    function updateHeaderCloudBadge() {
      const el = document.getElementById("cloud-badge");
      if (!el) return;
      if (isCloudLinked()) {
        el.textContent = "Cloud linked";
        el.className = "badge badge-info";
      } else {
        el.textContent = "Local only";
        el.className = "badge badge-muted";
      }
    }

    function updateAuthUI() {
      updateHeaderCloudBadge();
      const linkBtn = document.getElementById("btn-link-cloud");
      const unlinkBtn = document.getElementById("btn-unlink-cloud");
      const statusDiv = document.getElementById("authStatus");
      if (!linkBtn && !unlinkBtn && !statusDiv) return;
      const linked = isCloudLinked();
      const user = getCurrentUser();
      if (linkBtn) linkBtn.hidden = linked;
      if (unlinkBtn) unlinkBtn.hidden = !linked;
      if (statusDiv) {
        statusDiv.innerHTML = linked
          ? "Signed in as: <strong>" + escapeHtml(user.email || user.uid || "") + "</strong>"
          : "Not connected to cloud";
      }
      const last = localStorage.getItem("lastSyncTime");
      const syncDiv = document.getElementById("syncStatus");
      if (linked && last && syncDiv && !syncDiv.textContent) {
        updateSyncStatus("Last sync: " + new Date(last).toLocaleString(), "success");
      }
    }

    function updateSyncStatus(message, status) {
      const syncDiv = document.getElementById("syncStatus");
      if (!syncDiv) return;
      syncDiv.textContent = message;
      syncDiv.className = "stat-hint" + (status ? " is-" + status : "");
    }

    async function syncAllDataToCloud() {
      if (!isCloudLinked() || suppressCloudPush || idbHydrating) return;
      const userId = getCurrentUser().uid;
      if (!userId) return;
      if (!navigator.onLine) {
        updateSyncStatus("Offline — will sync when online", "info");
        return;
      }
      try {
        updateSyncStatus("Syncing...", "info");
        const allData = collectCloudBackupPayload();
        await setDoc(doc(db, "users", userId, "data", "backup"), allData);
        localStorage.setItem("lastSyncTime", allData.syncTimestamp);
        updateSyncStatus("Synced " + new Date(allData.syncTimestamp).toLocaleTimeString(), "success");
      } catch (error) {
        console.error("Sync error:", error);
        updateSyncStatus("Sync failed", "error");
        if (navigator.onLine) {
          showNotification("Cloud sync failed: " + error.message, "error");
        } else {
          updateSyncStatus("Offline — will sync when online", "info");
        }
      }
    }

    function syncDataChangeToCloud() {
      if (!isCloudLinked() || suppressCloudPush || idbHydrating) return;
      clearTimeout(cloudSyncTimer);
      cloudSyncTimer = setTimeout(() => {
        syncAllDataToCloud();
      }, 2000);
    }

    async function applyCloudData(cloudData, options) {
      suppressCloudPush = true;
      idbHydrating = true;
      try {
        applyCloudPayload(cloudData);
        lastSavedAt = cloudData.syncTimestamp ? new Date(cloudData.syncTimestamp) : new Date();
        await saveAllDataToIndexedDB();
        hydratedFromSeed = false;
        if (cloudData.syncTimestamp) localStorage.setItem("lastSyncTime", cloudData.syncTimestamp);
        updateSyncStatus("Synced", "success");
        if (options && options.notify) showNotification("Data restored from cloud");
        const page = PAGE_META[state.currentPage] ? state.currentPage : "dashboard";
        navigateTo(page);
      } finally {
        idbHydrating = false;
        suppressCloudPush = false;
      }
    }

    async function syncAllDataFromCloud() {
      if (!isCloudLinked()) return;
      const userId = getCurrentUser().uid;
      if (!userId) return;
      try {
        updateSyncStatus("Syncing...", "info");
        const docSnap = await getDoc(doc(db, "users", userId, "data", "backup"));
        if (!docSnap.exists()) {
          await syncAllDataToCloud();
          return;
        }
        await applyCloudData(docSnap.data(), { notify: true });
      } catch (error) {
        console.error("Restore error:", error);
        updateSyncStatus("Sync failed", "error");
        showNotification("Could not restore cloud data: " + error.message, "error");
      }
    }

    async function reconcileCloudOnLogin() {
      if (!isCloudLinked() || cloudReconcileInFlight) return;
      const userId = getCurrentUser().uid;
      if (!userId) return;
      cloudReconcileInFlight = true;
      try {
        updateSyncStatus("Syncing...", "info");
        const docSnap = await getDoc(doc(db, "users", userId, "data", "backup"));
        if (!docSnap.exists()) {
          await syncAllDataToCloud();
          return;
        }
        const cloudData = docSnap.data();
        const cloudTime = parseStamp(cloudData.syncTimestamp);
        const localTime = lastSavedAt ? lastSavedAt.getTime() : 0;
        if (hydratedFromSeed || cloudTime > localTime + 1500) {
          await applyCloudData(cloudData, { notify: true });
        } else {
          await syncAllDataToCloud();
        }
      } catch (error) {
        console.error("Cloud reconcile error:", error);
        updateSyncStatus("Sync failed", "error");
        showNotification("Cloud sync failed: " + error.message, "error");
      } finally {
        cloudReconcileInFlight = false;
      }
    }

    async function linkCloudAccount() {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        rememberCloudUser(result.user);
        updateAuthUI();
        showNotification("Account linked: " + (result.user.email || result.user.uid));
      } catch (error) {
        console.error("Login failed:", error);
        showNotification("Login failed: " + error.message, "error");
      }
    }

    async function unlinkCloudAccount() {
      try {
        await signOut(auth);
        forgetCloudUser();
        updateAuthUI();
        updateSyncStatus("", "");
        showNotification("Account unlinked");
      } catch (error) {
        console.error("Logout failed:", error);
        showNotification("Logout failed: " + error.message, "error");
      }
    }

    function startCloudAuthListener() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          rememberCloudUser(user);
          updateAuthUI();
          if (lastReconciledUid !== user.uid) {
            lastReconciledUid = user.uid;
            reconcileCloudOnLogin();
          }
        } else {
          forgetCloudUser();
          updateAuthUI();
        }
      });
    }

    function syncSequencesFromData() {
      const maxBomId = boms.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
      bomSeq = Math.max(bomSeq, maxBomId + 1);
      const maxFormulaId = formulas.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
      formulaSeq = Math.max(formulaSeq, maxFormulaId + 1);
      let maxLineId = 0;
      state.bomMaterials.forEach((line) => {
        maxLineId = Math.max(maxLineId, Number(line.id) || 0);
      });
      state.bomServices.forEach((line) => {
        maxLineId = Math.max(maxLineId, Number(line.id) || 0);
      });
      boms.forEach((record) => {
        (record.materials || []).forEach((line) => {
          maxLineId = Math.max(maxLineId, Number(line.id) || 0);
        });
        (record.services || []).forEach((line) => {
          maxLineId = Math.max(maxLineId, Number(line.id) || 0);
        });
      });
      bomLineSeq = Math.max(bomLineSeq, maxLineId + 1);
    }

    async function loadDataFromIndexedDB() {
      if (!idb) throw new Error("IndexedDB is not ready");
      idbHydrating = true;
      try {
        const meta = await getAppStateRecord("meta");
        if (!meta || !meta.initialized) {
          sanitizeNumericMasters();
          await persistAllCollections();
          await persistSequencesNow();
          await persistEditorNow();
          await persistPrefsNow();
          lastSavedAt = new Date();
          await persistMetaNow();
          setSaveStatus("✓ Saved", "saved");
          return { fromSeed: true };
        }

        const loaded = {};
        for (let i = 0; i < IDB_COLLECTION_STORES.length; i += 1) {
          const name = IDB_COLLECTION_STORES[i];
          loaded[name] = await loadAllFromStore(name);
        }
        IDB_COLLECTION_STORES.forEach((name) => {
          replaceArrayContents(getCollectionArray(name), loaded[name]);
        });
        sanitizeNumericMasters();

        try {
          const sequences = await getAppStateRecord("sequences");
          if (sequences) {
            if (Number.isFinite(sequences.bomLineSeq)) bomLineSeq = sequences.bomLineSeq;
            if (Number.isFinite(sequences.bomSeq)) bomSeq = sequences.bomSeq;
            if (Number.isFinite(sequences.formulaSeq)) formulaSeq = sequences.formulaSeq;
          }

          const editor = await getAppStateRecord("editor");
          if (editor) {
            state.selectedFinishedGoodId = editor.selectedFinishedGoodId || null;
            state.currentBOM = editor.currentBOM || null;
            state.bomMaterials = Array.isArray(editor.bomMaterials) ? editor.bomMaterials : [];
            state.bomServices = Array.isArray(editor.bomServices) ? editor.bomServices : [];
          }

          syncSequencesFromData();
          if (ensureSeedStyleFormulas()) {
            syncSequencesFromData();
            await persistAllCollections();
            await persistSequencesNow();
          }

          if (state.selectedFinishedGoodId && getSelectedFinishedGood()) {
            try {
              recalculateBOMCosts();
            } catch (error) {
              console.error("Could not recalculate restored BOM", error);
            }
          } else if (state.selectedFinishedGoodId && !getSelectedFinishedGood()) {
            state.selectedFinishedGoodId = null;
            state.currentBOM = null;
            state.bomMaterials = [];
            state.bomServices = [];
          }

          const prefs = await getAppStateRecord("prefs");
          if (prefs) {
            if (prefs.searches) state.searches = { ...state.searches, ...prefs.searches };
            if (prefs.formulaFilter) state.formulaFilter = prefs.formulaFilter;
            if (prefs.bomListFilter) state.bomListFilter = prefs.bomListFilter;
            if (prefs.currentPage && PAGE_META[prefs.currentPage]) state.currentPage = prefs.currentPage;
          }
        } catch (error) {
          console.error("Could not restore editor or preferences", error);
        }

        lastSavedAt = meta.lastSavedAt ? new Date(meta.lastSavedAt) : new Date();
        setSaveStatus(formatLastSavedRelative(), "saved");
        return { fromSeed: false };
      } finally {
        idbHydrating = false;
      }
    }

    function ensureSeedStyleFormulas() {
      const seeds = (SEED_DATA.formulas || []).filter((item) => item.type === "Style");
      let added = false;
      seeds.forEach((seed) => {
        if (getFormulaByCode(seed.code)) return;
        formulas.push({
          id: nextFormulaId(),
          code: seed.code,
          name: seed.name,
          type: "Style",
          description: seed.description,
          expression: seed.expression,
          isActive: seed.isActive !== false
        });
        added = true;
      });
      if (!styleFormulas.length) {
        (SEED_DATA.styleFormulas || []).forEach((seedLink) => {
          const seedFormula = (SEED_DATA.formulas || []).find((item) => item.id === seedLink.formulaId);
          const formula = seedFormula ? getFormulaByCode(seedFormula.code) : getFormula(seedLink.formulaId);
          const style = styles.find((item) => item.id === seedLink.styleId);
          if (!formula || !style) return;
          if (styleFormulas.some((row) => row.styleId === style.id && Number(row.formulaId) === formula.id)) return;
          styleFormulas.push({
            id: nextMasterId(styleFormulas),
            styleId: style.id,
            formulaId: formula.id,
            order: Number(seedLink.order) || styleFormulas.length + 1,
            createdAt: seedLink.createdAt || new Date().toISOString()
          });
          added = true;
        });
      }
      return added;
    }

    async function resetToSeedData() {
      replaceArrayContents(finishedGoods, snapshotData(SEED_DATA.finishedGoods));
      replaceArrayContents(rawMaterials, snapshotData(SEED_DATA.rawMaterials));
      replaceArrayContents(services, snapshotData(SEED_DATA.services));
      replaceArrayContents(formulas, snapshotData(SEED_DATA.formulas));
      replaceArrayContents(boms, snapshotData(SEED_DATA.boms));
      replaceArrayContents(styles, snapshotData(SEED_DATA.styles));
      replaceArrayContents(dimensions, snapshotData(SEED_DATA.dimensions));
      replaceArrayContents(formulaVariables, snapshotData(SEED_DATA.formulaVariables));
      replaceArrayContents(styleVariables, snapshotData(SEED_DATA.styleVariables));
      replaceArrayContents(styleFormulas, snapshotData(SEED_DATA.styleFormulas));
      sanitizeNumericMasters();
      resetBomEditor();
      bomLineSeq = 1;
      bomSeq = 1;
      formulaSeq = formulas.reduce((max, item) => Math.max(max, item.id), 300) + 1;
      state.searches = {
        finishedGoods: "",
        rawMaterials: "",
        services: "",
        style: "",
        formulaVariables: "",
        dimensions: "",
        formulas: "",
        bomFinishedGood: "",
        boms: ""
      };
      state.formulaFilter = "all";
      state.bomListFilter = "all";
      if (!idbReady) return;
      setSaveStatus("Saving...", "saving");
      try {
        await persistAllCollections();
        await persistSequencesNow();
        await persistEditorNow();
        await persistPrefsNow();
        markSaved();
        hydratedFromSeed = true;
        await syncAllDataToCloud();
      } catch (error) {
        console.error("Failed to save offline data", error);
        setSaveStatus("Save failed", "error");
        showNotification("Failed to save offline data", "error");
      }
    }

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

    const DECIMAL_RULES = {
      dimension: { decimals: 2, min: 0.1, max: 99999, label: "Dimension" },
      rate: { decimals: 2, min: 0.01, max: 999999.99, label: "Rate", decimalError: "Rate must have maximum 2 decimal places" },
      quantity: { decimals: 4, min: 0.0001, max: 999999, label: "Quantity" },
      wastage: { decimals: 2, min: 0, max: 100, label: "Wastage" },
      gsm: { decimals: 1, min: 1, max: 999, label: "GSM" },
      variable: { decimals: 4, min: -999999999, max: 999999999, label: "Value" }
    };

    function roundTo(value, decimals) {
      const n = Number(value);
      const places = Number.isFinite(Number(decimals)) ? Math.max(0, Math.min(10, Number(decimals))) : 2;
      if (!Number.isFinite(n)) return n;
      return Number(Math.round(Number(n + "e" + places)) + "e-" + places);
    }

    function formatDecimal(value, decimals, padZeros) {
      const places = decimals == null ? 2 : decimals;
      const rounded = roundTo(value, places);
      if (!Number.isFinite(rounded)) return "";
      const fixed = rounded.toFixed(places);
      if (padZeros !== false) return fixed;
      return String(parseFloat(fixed));
    }

    function countDecimalPlaces(raw) {
      const text = String(raw ?? "").trim();
      const match = text.match(/\.(\d+)$/);
      return match ? match[1].length : 0;
    }

    function parseNumeric(stringInput, maxDecimals, options) {
      const opts = options || {};
      const places = maxDecimals == null ? 2 : maxDecimals;
      const raw = String(stringInput ?? "").trim();
      if (raw === "") {
        return { ok: false, value: null, error: opts.requiredError || "Please enter a valid number" };
      }
      if (!/^-?\d+(\.\d+)?$/.test(raw)) {
        return { ok: false, value: null, error: "Please enter a valid number" };
      }
      if (countDecimalPlaces(raw) > places) {
        return {
          ok: false,
          value: null,
          error: opts.decimalError || ("Value must have maximum " + places + " decimal place" + (places === 1 ? "" : "s"))
        };
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        return { ok: false, value: null, error: "Please enter a valid number" };
      }
      if (opts.min != null && n < opts.min) {
        return { ok: false, value: null, error: opts.minError || ((opts.label || "Value") + " must be at least " + opts.min) };
      }
      if (opts.max != null && n > opts.max) {
        return { ok: false, value: null, error: opts.maxError || ((opts.label || "Value") + " must be at most " + opts.max) };
      }
      return { ok: true, value: roundTo(n, places), error: null };
    }

    function parseByRule(stringInput, ruleName, extra) {
      const rule = DECIMAL_RULES[ruleName] || DECIMAL_RULES.variable;
      return parseNumeric(stringInput, rule.decimals, { ...rule, ...(extra || {}) });
    }

    function showFirstValidationError(errors) {
      const first = errors && Object.keys(errors).map((key) => errors[key]).find(Boolean);
      if (first) showNotification(first, "error");
    }

    function formatNumber(value, decimals) {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
      const places = decimals ?? 0;
      const rounded = roundTo(value, places);
      return rounded.toLocaleString("en-US", {
        minimumFractionDigits: places,
        maximumFractionDigits: places
      });
    }

    function formatMoney(value) {
      return formatNumber(value, 2);
    }

    function formatCurrency(value) {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
      const rounded = roundTo(value, 2);
      return "Rs. " + rounded.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    function formatCurrencyDisplay(value) {
      return formatCurrency(value);
    }

    function sanitizeNumericMasters() {
      dimensions.forEach((item) => {
        item.L = roundTo(item.L, 2);
        item.W = roundTo(item.W, 2);
        item.H = roundTo(item.H, 2);
        const clean = formatDimensionCode(item.L, item.W);
        if (!item.code || isAutoDimensionCode(item.code)) item.code = clean;
        if (!item.name || isAutoDimensionCode(item.name)) item.name = clean;
      });
      finishedGoods.forEach((item) => {
        if (!item.dimensions) return;
        item.dimensions.L = roundTo(item.dimensions.L, 2);
        item.dimensions.W = roundTo(item.dimensions.W, 2);
        item.dimensions.H = roundTo(item.dimensions.H, 2);
        delete item.material;
        item.displayName = formatFinishedGoodDisplayName(item);
      });
      rawMaterials.forEach((item) => {
        item.purchasingRate = roundTo(item.purchasingRate, 2);
        if (item.gsm != null && item.gsm !== "") item.gsm = roundTo(item.gsm, 1);
        item.qtyFormulaId = normalizeFormulaBinding(item.qtyFormulaId);
        item.dimensionIds = normalizeDimensionIds(item.dimensionIds);
        delete item.rateFormulaId;
      });
      services.forEach((item) => {
        item.serviceRate = roundTo(item.serviceRate, 2);
        item.formulaId = normalizeFormulaBinding(item.formulaId);
        item.dimensionIds = normalizeDimensionIds(item.dimensionIds);
      });
      styleVariables.forEach((item) => {
        if (item.value != null && item.value !== "") item.value = roundTo(item.value, 4);
      });
      formulaVariables.forEach((item) => {
        if (item.dataType === "numeric" && item.defaultValue != null && item.defaultValue !== "") {
          const n = Number(item.defaultValue);
          if (Number.isFinite(n)) item.defaultValue = roundTo(n, 4);
        }
      });
    }

    function numericTestValues(values) {
      const out = {};
      Object.keys(values || {}).forEach((key) => {
        const raw = values[key];
        if (raw === "" || raw == null) {
          out[key] = raw;
          return;
        }
        const parsed = parseByRule(raw, "variable");
        out[key] = parsed.ok ? parsed.value : Number(raw);
      });
      return out;
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
      const code = formatFinishedGoodSizeCode(dims).replace(/x/g, " × ");
      return `${code} ${item.dimensionUOM || item.uom || ""}`.trim();
    }

    function formatRupees(value) {
      return formatCurrency(value);
    }

    function formatFinishedGoodDisplayName(item) {
      const dims = formatFinishedGoodSizeCode(item.dimensions);
      return [item.product, item.style, item.variant, dims]
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

    function masterRowActions(editAttr, editId, deleteAttr, deleteId) {
      return `
        <td>
          <div class="row-actions">
            <button type="button" class="btn btn-sm btn-icon" ${editAttr}="${editId}" title="Edit">
              <i data-lucide="pencil"></i>
            </button>
            <button type="button" class="btn btn-sm btn-icon btn-danger" ${deleteAttr}="${deleteId}" title="Delete">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      `;
    }

    function getFormulaVariableByCode(code) {
      return formulaVariables.find((item) => item.code === String(code || "").toUpperCase()) ||
        formulaVariables.find((item) => item.code === code) || null;
    }

    function getActiveFormulaVariables() {
      return formulaVariables.filter((item) => item.isActive);
    }

    function getFormulaVariableDefaults() {
      const values = { ...DEFAULT_TEST_VALUES };
      formulaVariables.forEach((item) => {
        if (!item.isActive) return;
        const numeric = numericOrNull(item.defaultValue);
        if (numeric !== null) values[item.code] = numeric;
      });
      return values;
    }

    function findStyleByName(name) {
      const needle = String(name || "").trim().toLowerCase();
      if (!needle) return null;
      return styles.find((item) => String(item.name).trim().toLowerCase() === needle) || null;
    }

    function getStyleVariables(styleId) {
      return styleVariables.filter((item) => item.styleId === Number(styleId));
    }

    const BOM_DIMENSION_DISPLAY = [
      { code: "L", name: "Flat Length", kind: "fg" },
      { code: "W", name: "Flat Width", kind: "fg" },
      { code: "H", name: "Height", kind: "fg" },
      { code: "AREA", name: "Covered Area", kind: "derived" },
      { code: "PERIMETER", name: "Perimeter", kind: "derived" },
      { code: "GLUE_FLAP", name: "Glue Flap", kind: "variable" },
      { code: "SHEET_WIDTH", name: "Sheet Width", kind: "variable" }
    ];

    function squaredDimensionUnit(uom) {
      const unit = String(uom || "").trim();
      if (!unit) return "";
      if (/²$/.test(unit) || /^sq\.?/i.test(unit)) return unit;
      return unit + "²";
    }

    function formatDimensionDisplayValue(value) {
      const n = roundTo(value, 2);
      if (!Number.isFinite(n)) return "—";
      return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    function dimensionSourceLabel(source) {
      if (source === "fg") return "From finished good";
      if (source === "style") return "From style variable";
      if (source === "formula") return "From formula variable default";
      if (source === "derived") return "Calculated from L and W";
      return "";
    }

    function resolveBomDimensionContext(finishedGood) {
      const context = {};
      const units = {};
      const sources = {};
      formulaVariables.forEach((item) => {
        if (item.isActive === false) return;
        const n = numericOrNull(item.defaultValue);
        if (n === null) return;
        context[item.code] = n;
        units[item.code] = item.unit || "";
        sources[item.code] = "formula";
      });
      const style = finishedGood ? findStyleByName(finishedGood.style) : null;
      if (style) {
        getStyleVariables(style.id).forEach((row) => {
          const n = numericOrNull(row.value);
          if (n === null) return;
          const catalog = getFormulaVariableByCode(row.variableCode);
          context[row.variableCode] = n;
          units[row.variableCode] = row.unit || (catalog && catalog.unit) || units[row.variableCode] || "";
          sources[row.variableCode] = "style";
        });
      }
      const dimUnit = String((finishedGood && finishedGood.dimensionUOM) || "").trim();
      const dims = finishedGood && finishedGood.dimensions ? finishedGood.dimensions : {};
      const L = numericOrNull(dims.L);
      const W = numericOrNull(dims.W);
      const H = numericOrNull(dims.H);
      if (L !== null) {
        context.L = L;
        units.L = dimUnit || units.L || "";
        sources.L = "fg";
      }
      if (W !== null) {
        context.W = W;
        units.W = dimUnit || units.W || "";
        sources.W = "fg";
      }
      if (H !== null) {
        context.H = H;
        units.H = dimUnit || units.H || "";
        sources.H = "fg";
      }
      return { context, units, sources, style, dimUnit };
    }

    function calculateBomDimensions(finishedGood) {
      if (!finishedGood) return [];
      const { context, units, sources, style, dimUnit } = resolveBomDimensionContext(finishedGood);
      const L = Number(context.L) || 0;
      const W = Number(context.W) || 0;
      const linearUnit = dimUnit || units.L || units.W || "";
      const rows = BOM_DIMENSION_DISPLAY.map((def) => {
        if (def.kind === "derived" && def.code === "AREA") {
          return {
            code: def.code,
            name: def.name,
            value: L * W,
            unit: squaredDimensionUnit(linearUnit),
            source: "derived"
          };
        }
        if (def.kind === "derived" && def.code === "PERIMETER") {
          return {
            code: def.code,
            name: def.name,
            value: 2 * (L + W),
            unit: linearUnit,
            source: "derived"
          };
        }
        const catalog = getFormulaVariableByCode(def.code);
        return {
          code: def.code,
          name: def.name,
          value: context[def.code],
          unit: units[def.code] || (catalog && catalog.unit) || (def.kind === "fg" ? linearUnit : ""),
          source: sources[def.code] || (def.kind === "fg" ? "fg" : "formula")
        };
      });
      const shown = new Set(rows.map((row) => row.code));
      if (style) {
        getStyleVariables(style.id).forEach((row) => {
          if (shown.has(row.variableCode)) return;
          const catalog = getFormulaVariableByCode(row.variableCode);
          rows.push({
            code: row.variableCode,
            name: catalog ? catalog.name : row.variableCode,
            value: numericOrNull(row.value),
            unit: row.unit || (catalog && catalog.unit) || "",
            source: "style"
          });
          shown.add(row.variableCode);
        });
      }
      return rows;
    }

    function renderCalculatedDimensionsSection(finishedGood) {
      const rows = calculateBomDimensions(finishedGood);
      if (!rows.length) return "";
      return `
        <div id="calculatedDimensionsSection" class="calc-dims">
          <div class="calc-dims-head">
            <div>
              <div class="section-kicker">Calculated dimensions</div>
              <div class="section-title">Variable values for this finished good</div>
            </div>
            <span class="badge badge-muted">Live</span>
          </div>
          <div id="dimensionsGrid" class="calc-dims-grid">
            ${rows.map((row) => {
              const valueText = formatDimensionDisplayValue(row.value);
              const unit = row.unit ? ` ${row.unit}` : "";
              const source = dimensionSourceLabel(row.source);
              return `
                <div class="calc-dims-item" title="${escapeHtml(source)}">
                  <span class="calc-dims-name">${escapeHtml(row.name)}</span>
                  <span class="calc-dims-value">= ${escapeHtml(valueText)}${escapeHtml(unit)}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    function getStyleFormulaLinks(styleId) {
      return styleFormulas
        .filter((item) => item.styleId === Number(styleId))
        .slice()
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || a.id - b.id);
    }

    function getStyleTypeFormulas() {
      return formulas.filter((item) => item.type === "Style" && item.isActive);
    }

    function buildStyleFormulaVariables(finishedGood) {
      const vars = buildFormulaVariables(finishedGood, null, DEFAULT_WASTAGE_PERCENT);
      const style = finishedGood ? findStyleByName(finishedGood.style) : null;
      if (style) {
        getStyleVariables(style.id).forEach((row) => {
          const n = numericOrNull(row.value);
          if (n !== null) vars[row.variableCode] = n;
        });
      }
      return vars;
    }

    function evaluateStyleFormulasForFinishedGood(finishedGood) {
      if (!finishedGood) return [];
      const style = findStyleByName(finishedGood.style);
      if (!style) return [];
      const variables = buildStyleFormulaVariables(finishedGood);
      return getStyleFormulaLinks(style.id).map((link) => {
        const formula = getFormula(link.formulaId);
        if (!formula) {
          return {
            linkId: link.id,
            formulaId: link.formulaId,
            code: "—",
            name: "Missing formula",
            expression: "",
            success: false,
            result: null,
            error: "Linked style formula no longer exists."
          };
        }
        if (!formula.isActive) {
          return {
            linkId: link.id,
            formulaId: formula.id,
            code: formula.code,
            name: formula.name,
            expression: formula.expression,
            success: false,
            result: null,
            error: "This style formula is inactive."
          };
        }
        const calculated = evaluateFormula(formula.expression, variables, [formula.code]);
        return {
          linkId: link.id,
          formulaId: formula.id,
          code: formula.code,
          name: formula.name,
          expression: formula.expression,
          success: calculated.success,
          result: calculated.success ? calculated.result : null,
          error: calculated.success ? null : calculated.error
        };
      });
    }

    function getStyleVariableValue(styleId, variableCode) {
      const row = styleVariables.find((item) =>
        item.styleId === Number(styleId) && item.variableCode === variableCode
      );
      return row ? numericOrNull(row.value) : null;
    }

    function resolveVariableValue(code, finishedGood, fallback) {
      const style = finishedGood ? findStyleByName(finishedGood.style) : null;
      if (style) {
        const styled = getStyleVariableValue(style.id, code);
        if (styled !== null) return styled;
      }
      const catalog = getFormulaVariableByCode(code);
      if (catalog) {
        const def = numericOrNull(catalog.defaultValue);
        if (def !== null) return def;
      }
      return fallback;
    }

    function formulasUsingVariable(code) {
      return formulas.filter((item) => extractIdentifiers(item.expression).includes(code));
    }

    function productsUsingStyle(styleName) {
      const needle = String(styleName || "").trim().toLowerCase();
      return finishedGoods.filter((item) => String(item.style || "").trim().toLowerCase() === needle);
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
        if (converted != null && Number.isFinite(converted)) return roundTo(converted, 8);
      }

      if (from === "piece" && to === "1000piece") return roundTo(n / 1000, 8);
      if (from === "1000piece" && to === "piece") return roundTo(n * 1000, 8);
      if (from === "sqin" && to === "sqm") return roundTo(n * SQ_IN_TO_SQ_M, 8);
      if (from === "sqm" && to === "sqin") return roundTo(n / SQ_IN_TO_SQ_M, 8);
      if (from === "sqin" && to === "m") return roundTo(n * SQ_IN_TO_SQ_M, 8);
      return n;
    }

    function convertRate(rate, fromUnit, toUnit, gsm = null) {
      const n = Number(rate);
      if (!Number.isFinite(n)) return n;
      const from = normalizeUnit(fromUnit);
      const to = normalizeUnit(toUnit);
      if (from === to) return roundTo(n, 6);
      return roundTo(n * convertQuantity(1, to, from, { gsm }), 6);
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
          [item.product, item.variant, item.style, item.ply, item.dimensions.L, item.dimensions.W, item.dimensions.H, formatDimensions(item), formatFinishedGoodDisplayName(item)],
          query
        )
      );
    }

    function formatQty(value) {
      if (value === null || value === undefined || !Number.isFinite(Number(value))) return "—";
      return formatDecimal(value, 4, false);
    }

    function formatFormulaResult(value) {
      if (value === null || value === undefined || value === "") return "—";
      const n = Number(value);
      if (!Number.isFinite(n)) return String(value);
      return formatDecimal(n, 6, false);
    }

    function refreshDimensionCodePreview() {
      const el = document.querySelector("#modal-dialog .preview-box .mono");
      if (!el || !state.modal || !state.modal.draft) return;
      const parsedL = parseByRule(state.modal.draft.L, "dimension");
      const parsedW = parseByRule(state.modal.draft.W, "dimension");
      el.textContent = parsedL.ok && parsedW.ok
        ? formatDimensionCode(parsedL.value, parsedW.value)
        : "—";
    }

    function normalizeDraftNumber(target, draftKey, ruleName, padZeros, draftObj) {
      const draft = draftObj || (state.modal && state.modal.draft);
      if (!draft) return;
      const parsed = parseByRule(target.value, ruleName);
      if (!parsed.ok) return;
      const rule = DECIMAL_RULES[ruleName] || DECIMAL_RULES.variable;
      draft[draftKey] = parsed.value;
      target.value = formatDecimal(parsed.value, rule.decimals, padZeros === true);
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

    function normalizeFormulaBinding(value) {
      if (value === "" || value == null) return null;
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }

    function formatBoundFormulaCode(id) {
      const formula = getFormula(id);
      return formula ? formula.code : "—";
    }

    function renderBoundFormulaOptions(type, selectedId) {
      const selected = selectedId ? getFormula(selectedId) : null;
      const active = formulas.filter((item) => item.type === type && item.isActive);
      const list = selected && !active.some((item) => item.id === selected.id)
        ? [selected].concat(active)
        : active;
      return `<option value="">None</option>` + list.map((item) => `
        <option value="${item.id}" ${Number(selectedId) === item.id ? "selected" : ""}>
          ${escapeHtml(item.name)} (${escapeHtml(item.code)})${item.isActive ? "" : " — inactive"}
        </option>
      `).join("");
    }

    function getDimension(id) {
      return dimensions.find((item) => item.id === Number(id)) || null;
    }

    function normalizeDimensionIds(value) {
      const list = Array.isArray(value) ? value : (value == null || value === "" ? [] : [value]);
      const unique = [];
      list.forEach((raw) => {
        const id = Number(raw);
        if (!Number.isFinite(id) || unique.includes(id)) return;
        if (getDimension(id)) unique.push(id);
      });
      return unique;
    }

    function formatDimensionChipLabel(dim) {
      if (!dim) return "Unknown";
      const code = dim.code || dim.name || formatDimensionCode(dim.L, dim.W);
      const unit = dim.uom || dim.unit || "";
      return unit ? code + " " + unit : code;
    }

    function formatLinkedDimensionSummary(ids) {
      const labels = normalizeDimensionIds(ids).map((id) => formatDimensionChipLabel(getDimension(id)));
      return labels.length ? labels.join(", ") : "—";
    }

    function addLinkedDimensionId(ids, value) {
      const next = normalizeDimensionIds(ids);
      const id = Number(value);
      if (Number.isFinite(id) && getDimension(id) && !next.includes(id)) next.push(id);
      return next;
    }

    function removeLinkedDimensionId(ids, value) {
      const id = Number(value);
      return normalizeDimensionIds(ids).filter((item) => item !== id);
    }

    function pickBomDimensionId(linkedIds, currentId, finishedGood) {
      const linked = normalizeDimensionIds(linkedIds);
      if (!linked.length) return null;
      const current = Number(currentId);
      if (linked.includes(current)) return current;
      if (finishedGood && finishedGood.dimensions) {
        const L = roundTo(finishedGood.dimensions.L, 2);
        const W = roundTo(finishedGood.dimensions.W, 2);
        const H = roundTo(finishedGood.dimensions.H, 2);
        const match = linked.find((id) => {
          const dim = getDimension(id);
          return dim && roundTo(dim.L, 2) === L && roundTo(dim.W, 2) === W && roundTo(dim.H, 2) === H;
        });
        if (match) return match;
      }
      return linked.length === 1 ? linked[0] : null;
    }

    function applyDimensionBasedRate(baseRate, dimensionId, linkedIds) {
      const linked = normalizeDimensionIds(linkedIds);
      if (!linked.length) {
        return { rate: roundTo(baseRate, 2), source: "master", dimension: null, volume: null };
      }
      const dim = getDimension(dimensionId);
      if (!dim) {
        return { error: "Select a dimension for rate calculation." };
      }
      if (!linked.includes(dim.id)) {
        return { error: "Selected dimension is not linked to this item." };
      }
      const L = Number(dim.L);
      const W = Number(dim.W);
      const H = Number(dim.H);
      if (!Number.isFinite(L) || !Number.isFinite(W) || !Number.isFinite(H)) {
        return { error: "Linked dimension is missing L, W, or H." };
      }
      const volume = L * W * H;
      return {
        rate: roundTo(baseRate * volume / DIMENSION_RATE_DIVISOR, 2),
        source: "dimension",
        dimension: dim,
        volume
      };
    }

    function renderLinkedDimensionPicker(selectedIds, selectId) {
      const selected = normalizeDimensionIds(selectedIds);
      const unused = dimensions.filter((item) => item.status !== "Inactive" && !selected.includes(item.id));
      const chips = selected.map((id) => {
        const dim = getDimension(id);
        return `
          <span class="dim-chip">
            ${escapeHtml(formatDimensionChipLabel(dim))}
            <button type="button" class="dim-chip-remove" data-remove-linked-dim="${id}" aria-label="Remove dimension">&times;</button>
          </span>
        `;
      }).join("");
      return `
        <div class="form-span-2 linked-dim-section">
          <label class="form-label" for="${selectId}">Link Dimensions</label>
          <select id="${selectId}" class="full-select">
            <option value="">Select dimensions to add...</option>
            ${unused.map((item) => `
              <option value="${item.id}">${escapeHtml(formatDimensionChipLabel(item))}</option>
            `).join("")}
          </select>
          <div class="dim-chip-wrap">${chips || `<span class="stat-hint">No dimensions linked. Rate will use the base rate only.</span>`}</div>
          <p class="stat-hint">Optional. Select dimensions to use for rate calculation (rate = base × L × W × H / ${DIMENSION_RATE_DIVISOR}).</p>
        </div>
      `;
    }

    function renderBomDimensionSelect(linkedIds, selectedId, selectId, error) {
      const linked = normalizeDimensionIds(linkedIds);
      if (!linked.length) return "";
      return `
        <div>
          <label class="form-label" for="${selectId}">Select Dimension</label>
          <select id="${selectId}" class="full-select ${error ? "input-invalid" : ""}">
            <option value="">Select a dimension...</option>
            ${linked.map((id) => {
              const dim = getDimension(id);
              return `<option value="${id}" ${Number(selectedId) === id ? "selected" : ""}>${escapeHtml(formatDimensionChipLabel(dim))}</option>`;
            }).join("")}
          </select>
          ${error ? `<div class="field-error">${escapeHtml(error)}</div>` : ""}
          <p class="stat-hint" style="margin-top:6px;">Rate uses L × W × H from the selected dimension.</p>
        </div>
      `;
    }

    function applyMaterialFormulaBindings(draft) {
      const material = getRawMaterial(draft.rawMaterialId);
      if (!material) return;
      if (material.qtyFormulaId) {
        draft.calculationMethod = "formula";
        draft.formulaId = Number(material.qtyFormulaId);
      }
      draft.dimensionId = pickBomDimensionId(material.dimensionIds, draft.dimensionId, getSelectedFinishedGood());
    }

    function applyServiceFormulaBinding(draft) {
      const service = getService(draft.serviceId);
      if (!service) return;
      if (service.formulaId) {
        draft.calculationMethod = "formula";
        draft.formulaId = Number(service.formulaId);
      }
      draft.dimensionId = pickBomDimensionId(service.dimensionIds, draft.dimensionId, getSelectedFinishedGood());
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
      return Boolean(getFormulaVariableByCode(id)) ||
        BASE_VARIABLES.includes(id) ||
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

      if (getFormulaVariableByCode(id) || BASE_VARIABLES.includes(id)) {
        return { success: false, error: "Variable has no numeric value: " + id };
      }
      return { success: false, error: "Variable " + id + " not found in Formula Variables" };
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
          return { valid: false, error: "Variable " + id + " not found in Formula Variables", result: null };
        }
      }

      if (detectCircularDependency(expression, opts.selfCode)) {
        return { valid: false, error: "Circular formula dependency detected.", result: null };
      }

      const evaluated = evaluateFormula(expression, { ...getFormulaVariableDefaults(), ...(opts.variables || {}) }, opts.selfCode ? [opts.selfCode] : []);
      if (!evaluated.success) {
        return { valid: false, error: evaluated.error || "Formula cannot be evaluated.", result: null };
      }
      return { valid: true, error: null, result: evaluated.result };
    }

    function buildFormulaVariables(finishedGood, material, wastagePercent) {
      const defaults = getFormulaVariableDefaults();
      const glueFlap = resolveVariableValue("GLUE_FLAP", finishedGood, defaults.GLUE_FLAP ?? DEFAULT_GLUE_FLAP);
      const sheetLength = resolveVariableValue("SHEET_LENGTH", finishedGood, defaults.SHEET_LENGTH ?? DEFAULT_TEST_VALUES.SHEET_LENGTH);
      const sheetWidth = resolveVariableValue("SHEET_WIDTH", finishedGood, defaults.SHEET_WIDTH ?? DEFAULT_TEST_VALUES.SHEET_WIDTH);
      const sheetArea = resolveVariableValue("SHEET_AREA", finishedGood, Number(sheetLength) * Number(sheetWidth));
      const pieceArea = resolveVariableValue("PIECE_AREA", finishedGood, defaults.PIECE_AREA ?? DEFAULT_TEST_VALUES.PIECE_AREA);
      return {
        L: roundTo(finishedGood.dimensions.L, 2),
        W: roundTo(finishedGood.dimensions.W, 2),
        H: roundTo(finishedGood.dimensions.H, 2),
        PLY: Number(finishedGood.ply),
        GSM: material && material.gsm != null ? roundTo(material.gsm, 1) : resolveVariableValue("GSM", finishedGood, defaults.GSM),
        GLUE_FLAP: glueFlap,
        WASTAGE: roundTo(wastagePercent, 2),
        MATERIAL_RATE: material ? roundTo(material.purchasingRate, 2) : resolveVariableValue("MATERIAL_RATE", finishedGood, defaults.MATERIAL_RATE),
        ORDER_QTY: resolveVariableValue("ORDER_QTY", finishedGood, defaults.ORDER_QTY ?? 1),
        NET_QTY: resolveVariableValue("NET_QTY", finishedGood, defaults.NET_QTY ?? 1),
        SHEET_LENGTH: sheetLength,
        SHEET_WIDTH: sheetWidth,
        SHEET_AREA: sheetArea,
        PIECE_AREA: pieceArea,
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

      const masterRate = Number(material.purchasingRate);
      if (!Number.isFinite(masterRate) || masterRate < 0) {
        line.error = "Purchasing rate from the Raw Material Master is not valid.";
        line.netQty = 0;
        line.grossQty = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      line.rate = roundTo(masterRate, 2);
      line.rateSource = "master";
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
      line.netQty = roundTo(netQty, 4);
      line.grossQty = roundTo(grossQty, 4);
      delete line.rateFormulaId;
      const rateResult = applyDimensionBasedRate(masterRate, line.dimensionId, material.dimensionIds);
      if (rateResult.error) {
        line.error = rateResult.error;
        line.costPerPiece = 0;
        return line;
      }
      line.rate = rateResult.rate;
      line.rateSource = rateResult.source;
      line.dimensionId = rateResult.dimension ? rateResult.dimension.id : null;
      line.dimensionVolume = rateResult.volume;
      const qtyForRate = convertQuantity(grossQty, material.uom, formatRateUnit(material.rateUOM), {
        gsm: material.gsm,
        sheetArea: DEFAULT_TEST_VALUES.SHEET_AREA
      });
      if (!Number.isFinite(qtyForRate)) {
        line.error = "Quantity could not be converted to the purchasing rate unit.";
        line.costPerPiece = 0;
        return line;
      }
      line.qtyForRate = roundTo(qtyForRate, 4);
      line.costPerPiece = roundTo(qtyForRate * line.rate, 2);
      return line;
    }

    function calculateTotalMaterialCost() {
      return state.bomMaterials.reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
    }

    function buildServiceFormulaVariables(finishedGood, service, dimensionId) {
      const dim = getDimension(dimensionId);
      const L = roundTo(dim ? dim.L : finishedGood.dimensions.L, 2);
      const W = roundTo(dim ? dim.W : finishedGood.dimensions.W, 2);
      const H = roundTo(dim ? dim.H : finishedGood.dimensions.H, 2);
      const glueFlap = resolveVariableValue("GLUE_FLAP", finishedGood, DEFAULT_GLUE_FLAP);
      const area = evaluateFormula("COVERED_AREA", {
        L,
        W,
        H,
        PLY: Number(finishedGood.ply),
        GLUE_FLAP: glueFlap
      });
      return {
        L,
        W,
        H,
        PLY: Number(finishedGood.ply),
        GLUE_FLAP: glueFlap,
        ORDER_QTY: resolveVariableValue("ORDER_QTY", finishedGood, 1),
        SERVICE_RATE: roundTo(service.serviceRate, 2),
        PRINT_AREA: area.success ? area.result : resolveVariableValue("PRINT_AREA", finishedGood, null),
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

      line.rate = roundTo(rate, 2);
      line.rateSource = "master";
      const rateResult = applyDimensionBasedRate(rate, line.dimensionId, service.dimensionIds);
      if (rateResult.error) {
        line.error = rateResult.error;
        line.quantity = 0;
        line.costPerPiece = 0;
        return line;
      }
      line.rate = rateResult.rate;
      line.rateSource = rateResult.source;
      line.dimensionId = rateResult.dimension ? rateResult.dimension.id : null;
      line.dimensionVolume = rateResult.volume;
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
          buildServiceFormulaVariables(finishedGood, service, line.dimensionId),
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

      line.quantity = roundTo(quantity, 4);
      const qtyForRate = convertQuantity(quantity, service.uom, formatRateUnit(service.rateUOM), {});
      if (!Number.isFinite(qtyForRate)) {
        line.error = "Quantity could not be converted to the service rate unit.";
        line.costPerPiece = 0;
        return line;
      }
      line.qtyForRate = roundTo(qtyForRate, 4);
      line.costPerPiece = roundTo(qtyForRate * line.rate, 2);
      return line;
    }

    function calculateTotalServiceCost() {
      return state.bomServices.reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
    }

    function recalculateBOMCosts() {
      state.bomMaterials = state.bomMaterials.map((line) => calculateMaterialCost(line));
      state.totalMaterialCost = roundTo(calculateTotalMaterialCost(), 2);
      state.bomServices = state.bomServices.map((line) => calculateServiceCost(line));
      state.totalServiceCost = roundTo(calculateTotalServiceCost(), 2);
      state.finalCostPerPiece = roundTo(state.totalMaterialCost + state.totalServiceCost, 2);
      state.costPer100 = roundTo(state.finalCostPerPiece * 100, 2);
      state.costPer1000 = roundTo(state.finalCostPerPiece * 1000, 2);
      state.bomStyleResults = evaluateStyleFormulasForFinishedGood(getSelectedFinishedGood());
    }

    function createMaterialLineFromConfig(config) {
      const formula = config.formulaCode ? getFormulaByCode(config.formulaCode) : getFormula(config.formulaId);
      const material = getRawMaterial(config.rawMaterialId);
      return calculateMaterialCost({
        id: nextBomLineId(),
        rawMaterialId: config.rawMaterialId,
        layer: config.layer,
        calculationMethod: config.calculationMethod,
        formulaId: formula ? formula.id : (material ? normalizeFormulaBinding(material.qtyFormulaId) : null),
        dimensionId: config.dimensionId !== undefined
          ? (config.dimensionId == null ? null : Number(config.dimensionId))
          : pickBomDimensionId(material && material.dimensionIds, null, getSelectedFinishedGood()),
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
      const service = getService(config.serviceId);
      return calculateServiceCost({
        id: nextBomLineId(),
        serviceId: config.serviceId,
        calculationMethod: config.calculationMethod,
        formulaId: formula ? formula.id : normalizeFormulaBinding(service && service.formulaId),
        dimensionId: config.dimensionId !== undefined
          ? (config.dimensionId == null ? null : Number(config.dimensionId))
          : pickBomDimensionId(service && service.dimensionIds, null, getSelectedFinishedGood()),
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
      persistEditorState();
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
      afterDataChange("boms");
      persistEditorState();
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
      afterDataChange("boms");
      persistEditorState();
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
      afterDataChange("boms");
      persistEditorState();
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
      afterDataChange("boms");
      persistEditorState();
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
      renderStyleFormulasSection();
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
          [item.product, item.variant, item.style, item.uom, item.ply, formatDimensions(item), item.status, formatFinishedGoodDisplayName(item)],
          q
        )
      );
    }

    function filterRawMaterials() {
      const q = state.searches.rawMaterials;
      return rawMaterials.filter((item) =>
        matchesQuery(
          [
            item.code,
            item.name,
            item.category,
            item.uom,
            item.rateUOM,
            item.gsm,
            item.purchasingRate,
            item.status,
            formatBoundFormulaCode(item.qtyFormulaId),
            formatLinkedDimensionSummary(item.dimensionIds)
          ],
          q
        )
      );
    }

    function filterServices() {
      const q = state.searches.services;
      return services.filter((item) =>
        matchesQuery(
          [item.code, item.name, item.uom, item.rateUOM, item.serviceRate, item.status, formatBoundFormulaCode(item.formulaId), formatLinkedDimensionSummary(item.dimensionIds)],
          q
        )
      );
    }

    function filterStyles() {
      const q = state.searches.style;
      return styles.filter((item) =>
        matchesQuery([item.name, item.description, item.status], q)
      );
    }

    function filterDimensions() {
      const q = state.searches.dimensions;
      return dimensions.filter((item) =>
        matchesQuery([item.name, item.description, item.code, item.L, item.W, item.H, item.uom, item.unit, item.status, `${item.L}x${item.W}x${item.H}`], q)
      );
    }

    function filterFormulaVariables() {
      const q = state.searches.formulaVariables;
      return formulaVariables.filter((item) =>
        matchesQuery([item.code, item.name, item.description, item.category, item.unit, item.dataType, item.defaultValue, item.isActive ? "Active" : "Inactive"], q)
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
        if (mode === "style") return item.type === "Style";
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
      const linked = isCloudLinked();
      const user = getCurrentUser();
      const lastSync = localStorage.getItem("lastSyncTime");

      document.getElementById("page-dashboard").innerHTML = `
        <div class="card cloud-sync-card">
          <div class="card-body">
            <div class="section-kicker">Cloud backup</div>
            <div class="section-title">Cloud Sync</div>
            <p id="authStatus" class="stat-hint" style="margin-top:8px;">${
              linked
                ? "Signed in as: <strong>" + escapeHtml(user.email || user.uid || "") + "</strong>"
                : "Not connected to cloud"
            }</p>
            <p style="margin-top:8px;color:var(--text-muted);line-height:1.5;">
              IndexedDB stays primary on this device. When an account is linked, changes upload to Firestore after a short delay and restore on other devices after Google sign-in.
            </p>
            <div class="cloud-sync-actions">
              <button type="button" class="btn btn-primary" id="btn-link-cloud" ${linked ? "hidden" : ""}>
                <i data-lucide="cloud"></i> Link Cloud Account
              </button>
              <button type="button" class="btn btn-danger-solid" id="btn-unlink-cloud" ${linked ? "" : "hidden"}>
                Unlink Account
              </button>
            </div>
            <div id="syncStatus" class="stat-hint${lastSync && linked ? " is-success" : ""}" style="margin-top:10px;">${
              lastSync && linked ? "Last sync: " + escapeHtml(new Date(lastSync).toLocaleString()) : ""
            }</div>
          </div>
        </div>
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
              are available in this local file. All products, materials, services, formulas, BOMs, and editor work are saved in the browser (IndexedDB) and reload automatically after refresh.
            </p>
            <p style="margin-top:8px;color:var(--text-muted);">${escapeHtml(formatLastSavedRelative())}${idbReady ? "" : " · Persistence unavailable"}</p>
            <div style="margin-top:12px;">
              <button type="button" class="btn" id="btn-reset-local-data">Restore seed data</button>
            </div>
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
              <td>${escapeHtml(item.variant)}</td>
              <td>${escapeHtml(formatDimensions(item))}</td>
              <td>${escapeHtml(item.ply)}</td>
              <td>${escapeHtml(item.uom)}</td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-fg", item.id, "data-delete-fg", item.id)}
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
                  <th>Variant</th>
                  <th>Dimensions</th>
                  <th>Ply</th>
                  <th>UOM</th>
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

    function renderRawMaterials() {
      const rows = filterRawMaterials();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td>${escapeHtml(item.name)}</td>
              <td><span class="badge badge-info">${escapeHtml(item.category)}</span></td>
              <td>${item.gsm === null ? "—" : escapeHtml(formatDecimal(item.gsm, 1, false))}</td>
              <td>${escapeHtml(item.uom)}</td>
              <td>${formatCurrency(item.purchasingRate)}</td>
              <td>Rs./${escapeHtml(formatRateUnit(item.rateUOM) || item.rateUOM)}</td>
              <td class="mono">${escapeHtml(formatBoundFormulaCode(item.qtyFormulaId))}</td>
              <td>${escapeHtml(formatLinkedDimensionSummary(item.dimensionIds))}</td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-rm", item.id, "data-delete-rm", item.id)}
            </tr>
          `).join("")
        : emptyRow(11, "No raw materials match this search.");

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
                  <th>Qty Formula</th>
                  <th>Dimensions</th>
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
              <td class="mono">${escapeHtml(formatBoundFormulaCode(item.formulaId))}</td>
              <td>${escapeHtml(formatLinkedDimensionSummary(item.dimensionIds))}</td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-srv-master", item.id, "data-delete-srv-master", item.id)}
            </tr>
          `).join("")
        : emptyRow(9, "No services match this search.");

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
                  <th>Formula</th>
                  <th>Dimensions</th>
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

    function renderStyles() {
      const rows = filterStyles();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.description || "—")}</td>
              <td>${getStyleVariables(item.id).length} variables</td>
              <td>${getStyleFormulaLinks(item.id).length} formulas</td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-style", item.id, "data-delete-style", item.id)}
            </tr>
          `).join("")
        : emptyRow(6, "No styles match this search.");

      document.getElementById("page-style").innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("style-search", state.searches.style, "Search style name, description...")}
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
                  <th>Style Name</th>
                  <th>Description</th>
                  <th>Variables</th>
                  <th>Formulas</th>
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

    function renderDimensions() {
      const rows = filterDimensions();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td>${escapeHtml(item.name || item.code)}</td>
              <td>${escapeHtml(item.description || "—")}</td>
              <td>${escapeHtml(formatDecimal(item.L, 2, false))}</td>
              <td>${escapeHtml(formatDecimal(item.W, 2, false))}</td>
              <td>${escapeHtml(item.unit || item.uom)}</td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-dim", item.id, "data-delete-dim", item.id)}
            </tr>
          `).join("")
        : emptyRow(7, "No dimensions match this search.");

      document.getElementById("page-dimensions").innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("dim-search", state.searches.dimensions, "Search L x W, UOM...")}
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
                  <th>Name</th>
                  <th>Description</th>
                  <th>Length</th>
                  <th>Width</th>
                  <th>Unit</th>
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

    function renderFormulaVariables() {
      const rows = filterFormulaVariables();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.description || "—")}</td>
              <td><span class="badge badge-info">${escapeHtml(item.category)}</span></td>
              <td>${escapeHtml(item.unit || "—")}</td>
              <td>${escapeHtml(item.dataType)}</td>
              <td>${item.defaultValue === null || item.defaultValue === undefined || item.defaultValue === "" ? "—" : escapeHtml(item.dataType === "numeric" ? formatDecimal(item.defaultValue, 4, false) : item.defaultValue)}</td>
              <td>${statusBadge(item.isActive ? "Active" : "Inactive", item.isActive)}</td>
              ${masterRowActions("data-edit-fvar", item.id, "data-delete-fvar", item.id)}
            </tr>
          `).join("")
        : emptyRow(9, "No formula variables match this search.");

      document.getElementById("page-formula-variables").innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("fvar-search", state.searches.formulaVariables, "Search code, name, category...")}
          </div>
          <div class="toolbar-right">
            <button type="button" class="btn btn-primary" id="btn-add-formula-variable">
              <i data-lucide="plus"></i> Add Variable
            </button>
            <span class="badge badge-muted">${rows.length} of ${formulaVariables.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table" style="min-width:1100px;">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Data Type</th>
                  <th>Default Value</th>
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

    function bindingUsesFormula(bindingId, formula) {
      if (!formula || bindingId == null || bindingId === "") return false;
      if (Number(bindingId) === formula.id) return true;
      const used = getFormula(bindingId);
      return used ? formulaDependsOnCode(used.expression, formula.code) : false;
    }

    function lineUsesFormula(line, formula) {
      if (!formula || !line) return false;
      return bindingUsesFormula(line.formulaId, formula);
    }

    function isFormulaUsed(formulaId) {
      const formula = getFormula(formulaId);
      const usedInMasters = rawMaterials.some((item) => bindingUsesFormula(item.qtyFormulaId, formula))
        || services.some((item) => bindingUsesFormula(item.formulaId, formula))
        || styleFormulas.some((item) => bindingUsesFormula(item.formulaId, formula));
      const usedInEditor = state.bomMaterials.some((line) => lineUsesFormula(line, formula)) ||
        state.bomServices.some((line) => lineUsesFormula(line, formula));
      const usedInSaved = boms.some((bom) =>
        (bom.materials || []).some((line) => lineUsesFormula(line, formula)) ||
        (bom.services || []).some((line) => lineUsesFormula(line, formula))
      );
      return usedInMasters || usedInEditor || usedInSaved;
    }

    function renderDependencyBadges(expression) {
      const deps = getExpressionDependencies(expression);
      if (!deps.length) return `<span class="badge badge-muted">None</span>`;
      return `<div class="dep-badges">${deps.map((dep) => `<span class="badge ${getFormulaByCode(dep) ? "badge-info" : "badge-muted"}">${escapeHtml(dep)}</span>`).join("")}</div>`;
    }

    function formulaTypeBadge(type) {
      const cls = type === "Service" ? "badge-warn" : type === "Style" ? "badge-success" : "badge-info";
      return `<span class="badge ${cls}">${escapeHtml(type)}</span>`;
    }

    function renderFormulaTable(items, emptyMessage) {
      const body = items.length
        ? items.map((item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td>${formulaTypeBadge(item.type)}</td>
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
        : emptyRow(7, emptyMessage || "No formulas match this search or filter.");
      return `
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
      `;
    }

    function renderFormulas() {
      const rows = filterFormulas();
      const grouped = state.formulaFilter === "all";
      const tables = grouped
        ? FORMULA_TYPES.map((type) => {
            const items = rows.filter((item) => item.type === type);
            return `
              <div class="card" style="margin-bottom:16px;">
                <div class="card-body">
                  <div class="section-head">
                    <div>
                      <div class="section-kicker">${escapeHtml(type)} formulas</div>
                      <div class="section-title">${escapeHtml(type)}</div>
                    </div>
                    <span class="badge badge-muted">${items.length}</span>
                  </div>
                  ${renderFormulaTable(items, `No ${type.toLowerCase()} formulas.`)}
                </div>
              </div>
            `;
          }).join("")
        : `<div class="card">${renderFormulaTable(rows)}</div>`;

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
              <option value="style" ${state.formulaFilter === "style" ? "selected" : ""}>Style</option>
              <option value="active" ${state.formulaFilter === "active" ? "selected" : ""}>Active</option>
              <option value="inactive" ${state.formulaFilter === "inactive" ? "selected" : ""}>Inactive</option>
            </select>
          </div>
          <div class="toolbar-right">
            <span class="badge badge-muted">${rows.length} of ${formulas.length}</span>
          </div>
        </div>
        ${tables}
      `;
    }

    function renderBOMPage() {
      document.getElementById("page-bom-costing").innerHTML = `
        <div class="bom-flow">
          <span>Select Finished Good</span>
          <span class="flow-arrow">↓</span>
          <span>Product Information</span>
          <span class="flow-arrow">↓</span>
          <span>Style Formulas</span>
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
            <div id="bom-style-formulas-root"></div>
            <div id="bom-materials-root"></div>
            <div id="bom-services-root"></div>
          </div>
          <aside id="bom-cost-root"></aside>
        </div>
      `;
      renderFinishedGoodSelector();
      renderBOMHeader();
      renderProductInformation();
      renderStyleFormulasSection();
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
      state.bomStyleResults = [];
      state.totalMaterialCost = 0;
      state.totalServiceCost = 0;
      state.finalCostPerPiece = 0;
      state.costPer100 = 0;
      state.costPer1000 = 0;
      state.searches.bomFinishedGood = "";
      state.fgSelectorOpen = false;
      state.workflowError = "";
      closeModal();
      persistEditorState();
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
      persistEditorState();
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
              </div>
              <div>
                <div class="section-kicker" style="margin-bottom:8px;">${escapeHtml(fg.ply)} Ply Structure</div>
                ${renderPlyVisualization(fg.ply)}
              </div>
            </div>
            ${renderCalculatedDimensionsSection(fg)}
          </div>
        </div>
      `;
    }

    function renderStyleFormulasSection() {
      const root = document.getElementById("bom-style-formulas-root");
      if (!root) return;
      const fg = getSelectedFinishedGood();
      if (!fg) {
        root.innerHTML = "";
        return;
      }
      const rows = Array.isArray(state.bomStyleResults) ? state.bomStyleResults : [];
      if (!rows.length) {
        root.innerHTML = "";
        return;
      }
      root.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="section-head">
              <div>
                <div class="section-kicker">Style formulas</div>
                <div class="section-title">Style Formulas (Auto-calculated)</div>
              </div>
              <span class="badge badge-muted">Read-only</span>
            </div>
            <p class="stat-hint" style="margin:0 0 12px;">Linked to style <strong>${escapeHtml(fg.style)}</strong>. Values update when the finished good or style variables change.</p>
            <div class="style-formula-results">
              ${rows.map((row) => `
                <div class="style-formula-row">
                  <div>
                    <div><span class="mono">${escapeHtml(row.code)}</span>: ${escapeHtml(row.name)}</div>
                    <div class="stat-hint mono">${escapeHtml(row.expression || "—")}</div>
                  </div>
                  <div class="style-formula-value">
                    ${row.success
                      ? `<strong>= ${escapeHtml(formatFormulaResult(row.result))}</strong>`
                      : `<div class="field-error">${escapeHtml(row.error || "Could not evaluate")}</div>`}
                  </div>
                </div>
              `).join("")}
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
                    <div class="stat-hint">${escapeHtml(material ? material.code : "")}${line.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(line.dimensionId))) : ""}</div>
                    ${line.error ? `<div class="field-error">${escapeHtml(line.error)}</div>` : ""}
                  </td>
                  <td>${escapeHtml(line.layer)}</td>
                  <td>${escapeHtml(methodLabel)}</td>
                  <td>${escapeHtml(formulaLabel)}</td>
                  <td>${formatQty(line.netQty)}</td>
                  <td>
                    <input class="wastage-input" type="number" min="0" max="100" step="0.01" data-wastage-line="${line.id}" value="${escapeHtml(formatDecimal(line.wastagePercent, 2, false))}" />
                  </td>
                  <td>${formatQty(line.grossQty)}</td>
                  <td>
                    ${material ? formatRatePkr(line.rate, material.rateUOM) : "—"}
                    ${line.rateSource === "dimension" ? `<div class="stat-hint">Dimension rate</div>` : ""}
                  </td>
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
                    <div class="stat-hint">${escapeHtml(service ? service.code : "")}${line.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(line.dimensionId))) : ""}</div>
                    ${line.error ? `<div class="field-error">${escapeHtml(line.error)}</div>` : ""}
                  </td>
                  <td>${escapeHtml(methodLabel)}</td>
                  <td>${escapeHtml(formulaLabel)}</td>
                  <td>${formatQty(line.quantity)}</td>
                  <td>
                    ${service ? formatRatePkr(line.rate, service.rateUOM) : "—"}
                    <div class="stat-hint">${line.rateSource === "dimension"
                      ? "Dimension rate"
                      : service && service.formulaId
                        ? "Bound formula: " + escapeHtml(formatBoundFormulaCode(service.formulaId))
                        : "Rate Source: Service Master (PKR)"}</div>
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
      const materialPct = total > 0 ? roundTo((Number(state.totalMaterialCost) / total) * 100, 1) : 0;
      const servicePct = total > 0 ? roundTo((Number(state.totalServiceCost) / total) * 100, 1) : 0;
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
        testValues: { ...getFormulaVariableDefaults() },
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
        variables: numericTestValues(draft.testValues || {})
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
          ${vars.map((name) => {
            const catalog = getFormulaVariableByCode(name);
            const label = catalog ? `${catalog.code} — ${catalog.name}` : name;
            const unit = catalog && catalog.unit ? ` (${catalog.unit})` : "";
            return `
            <div>
              <label class="form-label" for="ft-${escapeHtml(name)}">${escapeHtml(label)}${escapeHtml(unit)}</label>
              <input id="ft-${escapeHtml(name)}" class="full-search" data-test-var="${escapeHtml(name)}" type="number" step="any" value="${testValues[name] ?? ""}" />
            </div>`;
          }).join("")}
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
                  <option value="Style" ${draft.type === "Style" ? "selected" : ""}>Style</option>
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
                ${getActiveFormulaVariables().map((item) => `<button type="button" class="chip" data-insert="${escapeHtml(item.code)}" title="${escapeHtml(item.name)}">${escapeHtml(item.code)}</button>`).join("")}
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
                ${test.success ? `<div class="cost-row"><span>Result</span><strong>${escapeHtml(formatFormulaResult(test.result))}</strong></div>` : ""}
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
              ${test.success ? `<div class="cost-row"><span>Result</span><strong>${escapeHtml(formatFormulaResult(test.result))}</strong></div>` : ""}
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
        numericTestValues(state.modal.draft.testValues || {}),
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
      else if (!FORMULA_TYPES.includes(draft.type)) errors.type = "Type must be Material, Service, or Style.";
      if (!draft.expression || !String(draft.expression).trim()) errors.expression = "Expression is required.";

      const code = String(draft.code || "").trim().toUpperCase();
      const duplicate = formulas.find((item) => item.code === code && item.id !== draft.id);
      if (!errors.code && duplicate) errors.code = "Formula Code must be unique.";

      const validation = validateFormula(draft.expression, { selfCode: code, variables: numericTestValues(draft.testValues || {}) });
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
      afterDataChange("formulas");
      refreshOpenBomCalculations();
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
      afterDataChange("formulas");
      refreshOpenBomCalculations();
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
      if (!String(draft.variant || "").trim()) errors.variant = "Variant is required.";
      if (![1, 2, 3].includes(Number(draft.ply))) errors.ply = "Ply must be 1, 2, or 3.";
      const L = parseByRule(draft.L, "dimension", { requiredError: "Length must be greater than 0.", minError: "Length must be at least 0.1." });
      const W = parseByRule(draft.W, "dimension", { requiredError: "Width must be greater than 0.", minError: "Width must be at least 0.1." });
      const H = parseByRule(draft.H, "dimension", { requiredError: "Height must be greater than 0.", minError: "Height must be at least 0.1." });
      if (!L.ok) errors.L = L.error;
      if (!W.ok) errors.W = W.error;
      if (!H.ok) errors.H = H.error;
      if (!draft.dimensionUOM) errors.dimensionUOM = "Dimension UOM is required.";
      if (!draft.uom) errors.uom = "UOM is required.";
      if (!draft.status) errors.status = "Status is required.";
      return errors;
    }

    function renderFinishedGoodFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Product master</div>
            <strong>${state.modal.mode === "edit" ? "Edit Finished Good" : "Add New Finished Good"}</strong>
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
                  <input id="fg-dim-l" class="full-search ${errors.L ? "input-invalid" : ""}" type="number" min="0.1" step="0.01" value="${escapeHtml(draft.L === "" || draft.L == null ? "" : formatDecimal(draft.L, 2, false))}" placeholder="Length" />
                  ${errors.L ? `<div class="field-error">${escapeHtml(errors.L)}</div>` : ""}
                </div>
                <div>
                  <input id="fg-dim-w" class="full-search ${errors.W ? "input-invalid" : ""}" type="number" min="0.1" step="0.01" value="${escapeHtml(draft.W === "" || draft.W == null ? "" : formatDecimal(draft.W, 2, false))}" placeholder="Width" />
                  ${errors.W ? `<div class="field-error">${escapeHtml(errors.W)}</div>` : ""}
                </div>
                <div>
                  <input id="fg-dim-h" class="full-search ${errors.H ? "input-invalid" : ""}" type="number" min="0.1" step="0.01" value="${escapeHtml(draft.H === "" || draft.H == null ? "" : formatDecimal(draft.H, 2, false))}" placeholder="Height" />
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
          <button type="button" class="btn btn-primary" id="btn-save-finished-good">${state.modal.mode === "edit" ? "Update Product" : "Add Product"}</button>
        </div>
      `;
    }

    function finishedGoodToDraft(item) {
      return {
        id: item.id,
        product: item.product,
        style: item.style,
        variant: item.variant,
        ply: item.ply,
        L: formatDecimal(item.dimensions.L, 2, false),
        W: formatDecimal(item.dimensions.W, 2, false),
        H: formatDecimal(item.dimensions.H, 2, false),
        dimensionUOM: item.dimensionUOM,
        uom: item.uom,
        status: item.status
      };
    }

    function openFinishedGoodModal(id) {
      const item = id ? finishedGoods.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "finished-good",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        draft: item ? finishedGoodToDraft(item) : defaultFinishedGoodDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveFinishedGoodFromModal() {
      const draft = state.modal.draft;
      const errors = validateFinishedGoodDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const parsedL = parseByRule(draft.L, "dimension");
      const parsedW = parseByRule(draft.W, "dimension");
      const parsedH = parseByRule(draft.H, "dimension");
      const payload = {
        product: String(draft.product).trim(),
        style: String(draft.style).trim(),
        variant: String(draft.variant).trim(),
        ply: Number(draft.ply),
        dimensions: { L: parsedL.value, W: parsedW.value, H: parsedH.value },
        dimensionUOM: draft.dimensionUOM,
        uom: draft.uom,
        status: draft.status
      };
      payload.displayName = formatFinishedGoodDisplayName(payload);
      if (state.modal.mode === "edit" && draft.id) {
        const index = finishedGoods.findIndex((row) => row.id === draft.id);
        if (index >= 0) {
          finishedGoods[index] = { ...finishedGoods[index], ...payload };
          delete finishedGoods[index].material;
        }
        showNotification("Product updated successfully");
      } else {
        const item = { id: nextMasterId(finishedGoods), ...payload };
        finishedGoods.push(item);
        showNotification("Product added successfully");
      }
      closeModal();
      renderFinishedGoods();
      refreshIcons();
      afterDataChange("finishedGoods");
      refreshOpenBomCalculations();
    }

    function updateFinishedGoodDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "finished-good") return false;
      const draft = state.modal.draft;
      if (target.id === "fg-product") draft.product = target.value;
      else if (target.id === "fg-style") draft.style = target.value;
      else if (target.id === "fg-variant") draft.variant = target.value;
      else if (target.id === "fg-ply") draft.ply = Number(target.value);
      else if (target.id === "fg-dim-l") draft.L = target.value;
      else if (target.id === "fg-dim-w") draft.W = target.value;
      else if (target.id === "fg-dim-h") draft.H = target.value;
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
        qtyFormulaId: null,
        dimensionIds: [],
        status: "Active"
      };
    }

    function validateRawMaterialDraft(draft) {
      const errors = {};
      const code = String(draft.code || "").trim().toUpperCase();
      if (!code) errors.code = "Code is required.";
      else if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(code)) errors.code = "Code must be alphanumeric.";
      else if (rawMaterials.some((item) => item.code.toUpperCase() === code && item.id !== draft.id)) errors.code = "Code must be unique.";
      if (!String(draft.name || "").trim()) errors.name = "Name is required.";
      if (!draft.category) errors.category = "Category is required.";
      if (!draft.uom) errors.uom = "UOM is required.";
      const rate = parseByRule(draft.purchasingRate, "rate", { requiredError: "Purchasing rate must be greater than 0." });
      if (!rate.ok) errors.purchasingRate = rate.error;
      if (!draft.rateUOM) errors.rateUOM = "Rate UOM is required.";
      if ((draft.category === "Paper" || draft.category === "Board") && draft.gsm !== "" && draft.gsm != null) {
        const gsm = parseByRule(draft.gsm, "gsm", { requiredError: "GSM must be greater than 0." });
        if (!gsm.ok) errors.gsm = gsm.error;
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
            <strong>${state.modal.mode === "edit" ? "Edit Raw Material" : "Add New Raw Material"}</strong>
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
              <input id="rm-rate" class="full-search ${errors.purchasingRate ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.purchasingRate === "" || draft.purchasingRate == null ? "" : formatDecimal(draft.purchasingRate, 2, true))}" placeholder="150.50" />
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
            <div>
              <label class="form-label" for="rm-qty-formula">Quantity Formula</label>
              <select id="rm-qty-formula" class="full-select">
                ${renderBoundFormulaOptions("Material", draft.qtyFormulaId)}
              </select>
              <p class="stat-hint" style="margin-top:6px;">Optional. Used to auto-fill quantity in the BOM editor.</p>
            </div>
            ${showGsm ? `
              <div>
                <label class="form-label" for="rm-gsm">GSM (Basis Weight)</label>
                <input id="rm-gsm" class="full-search ${errors.gsm ? "input-invalid" : ""}" type="number" min="1" max="999" step="0.1" value="${escapeHtml(draft.gsm === "" || draft.gsm == null ? "" : formatDecimal(draft.gsm, 1, false))}" placeholder="Optional" />
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
          ${renderLinkedDimensionPicker(draft.dimensionIds, "rm-dimension-select")}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-raw-material">${state.modal.mode === "edit" ? "Update Material" : "Add Material"}</button>
        </div>
      `;
    }

    function rawMaterialToDraft(item) {
      return {
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category,
        uom: item.uom,
        purchasingRate: formatDecimal(item.purchasingRate, 2, true),
        rateUOM: item.rateUOM,
        gsm: item.gsm == null ? "" : formatDecimal(item.gsm, 1, false),
        qtyFormulaId: normalizeFormulaBinding(item.qtyFormulaId),
        dimensionIds: normalizeDimensionIds(item.dimensionIds),
        status: item.status
      };
    }

    function openRawMaterialMasterModal(id) {
      const item = id ? rawMaterials.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "raw-material-master",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        draft: item ? rawMaterialToDraft(item) : defaultRawMaterialDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveRawMaterialFromModal() {
      const draft = state.modal.draft;
      const errors = validateRawMaterialDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const showGsm = draft.category === "Paper" || draft.category === "Board";
      const parsedRate = parseByRule(draft.purchasingRate, "rate");
      const parsedGsm = showGsm && draft.gsm !== "" && draft.gsm != null ? parseByRule(draft.gsm, "gsm") : null;
      const payload = {
        code: String(draft.code).trim().toUpperCase(),
        name: String(draft.name).trim(),
        category: draft.category,
        uom: draft.uom,
        purchasingRate: parsedRate.value,
        rateUOM: draft.rateUOM,
        gsm: parsedGsm && parsedGsm.ok ? parsedGsm.value : null,
        qtyFormulaId: normalizeFormulaBinding(draft.qtyFormulaId),
        dimensionIds: normalizeDimensionIds(draft.dimensionIds),
        status: draft.status
      };
      if (state.modal.mode === "edit" && draft.id) {
        const index = rawMaterials.findIndex((row) => row.id === draft.id);
        if (index >= 0) {
          rawMaterials[index] = { ...rawMaterials[index], ...payload };
          delete rawMaterials[index].rateFormulaId;
        }
        showNotification("Material updated successfully");
      } else {
        rawMaterials.push({ id: nextMasterId(rawMaterials), ...payload });
        showNotification("Material added successfully");
      }
      closeModal();
      renderRawMaterials();
      refreshIcons();
      afterDataChange("rawMaterials");
    }

    function updateRawMaterialDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "raw-material-master") return false;
      const draft = state.modal.draft;
      if (target.id === "rm-code") draft.code = target.value.toUpperCase();
      else if (target.id === "rm-name") draft.name = target.value;
      else if (target.id === "rm-category") draft.category = target.value;
      else if (target.id === "rm-uom") draft.uom = target.value;
      else if (target.id === "rm-rate") draft.purchasingRate = target.value;
      else if (target.id === "rm-rate-uom") draft.rateUOM = target.value;
      else if (target.id === "rm-gsm") draft.gsm = target.value;
      else if (target.id === "rm-qty-formula") draft.qtyFormulaId = normalizeFormulaBinding(target.value);
      else if (target.id === "rm-dimension-select") {
        draft.dimensionIds = addLinkedDimensionId(draft.dimensionIds, target.value);
      }
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
        formulaId: null,
        dimensionIds: [],
        status: "Active"
      };
    }

    function validateServiceMasterDraft(draft) {
      const errors = {};
      const code = String(draft.code || "").trim().toUpperCase();
      if (!code) errors.code = "Code is required.";
      else if (services.some((item) => item.code.toUpperCase() === code && item.id !== draft.id)) errors.code = "Code must be unique.";
      if (!String(draft.name || "").trim()) errors.name = "Name is required.";
      if (!draft.uom) errors.uom = "UOM is required.";
      const rate = parseByRule(draft.serviceRate, "rate", { requiredError: "Service rate must be greater than 0." });
      if (!rate.ok) errors.serviceRate = rate.error;
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
            <strong>${state.modal.mode === "edit" ? "Edit Service" : "Add New Service"}</strong>
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
              <input id="srv-rate" class="full-search ${errors.serviceRate ? "input-invalid" : ""}" type="number" min="0.01" step="0.01" value="${escapeHtml(draft.serviceRate === "" || draft.serviceRate == null ? "" : formatDecimal(draft.serviceRate, 2, true))}" placeholder="2.50" />
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
              <label class="form-label" for="srv-formula">Formula</label>
              <select id="srv-formula" class="full-select">
                ${renderBoundFormulaOptions("Service", draft.formulaId)}
              </select>
              <p class="stat-hint" style="margin-top:6px;">Optional. Used to auto-fill the service formula in the BOM editor.</p>
            </div>
            <div>
              <label class="form-label" for="srv-status">Status</label>
              <select id="srv-status" class="full-select">
                <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
          ${renderLinkedDimensionPicker(draft.dimensionIds, "srv-dimension-select")}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-service-master">${state.modal.mode === "edit" ? "Update Service" : "Add Service"}</button>
        </div>
      `;
    }

    function serviceToDraft(item) {
      return {
        id: item.id,
        code: item.code,
        name: item.name,
        uom: item.uom,
        serviceRate: formatDecimal(item.serviceRate, 2, true),
        rateUOM: item.rateUOM,
        formulaId: normalizeFormulaBinding(item.formulaId),
        dimensionIds: normalizeDimensionIds(item.dimensionIds),
        status: item.status
      };
    }

    function openServiceMasterModal(id) {
      const item = id ? services.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "service-master",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        draft: item ? serviceToDraft(item) : defaultServiceMasterDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveServiceMasterFromModal() {
      const draft = state.modal.draft;
      const errors = validateServiceMasterDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const parsedRate = parseByRule(draft.serviceRate, "rate");
      const payload = {
        code: String(draft.code).trim().toUpperCase(),
        name: String(draft.name).trim(),
        uom: draft.uom,
        serviceRate: parsedRate.value,
        rateUOM: draft.rateUOM,
        formulaId: normalizeFormulaBinding(draft.formulaId),
        dimensionIds: normalizeDimensionIds(draft.dimensionIds),
        status: draft.status
      };
      if (state.modal.mode === "edit" && draft.id) {
        const index = services.findIndex((row) => row.id === draft.id);
        if (index >= 0) services[index] = { ...services[index], ...payload };
        showNotification("Service updated successfully");
      } else {
        services.push({ id: nextMasterId(services), ...payload });
        showNotification("Service added successfully");
      }
      closeModal();
      renderServices();
      refreshIcons();
      afterDataChange("services");
    }

    function updateServiceMasterDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "service-master") return false;
      const draft = state.modal.draft;
      if (target.id === "srv-code") draft.code = target.value.toUpperCase();
      else if (target.id === "srv-name") draft.name = target.value;
      else if (target.id === "srv-uom") draft.uom = target.value;
      else if (target.id === "srv-rate") draft.serviceRate = target.value;
      else if (target.id === "srv-rate-uom") draft.rateUOM = target.value;
      else if (target.id === "srv-formula") draft.formulaId = normalizeFormulaBinding(target.value);
      else if (target.id === "srv-dimension-select") {
        draft.dimensionIds = addLinkedDimensionId(draft.dimensionIds, target.value);
      }
      else if (target.id === "srv-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultStyleDraft() {
      return {
        name: "",
        description: "",
        status: "Active",
        pendingVariables: []
      };
    }

    function nextPendingStyleVarKey() {
      return "pv-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    }

    function createPendingStyleVariable() {
      return {
        key: nextPendingStyleVarKey(),
        variableCode: "",
        value: "",
        unit: "",
        errors: {}
      };
    }

    function renderPendingStyleVariables() {
      const draft = state.modal.draft || {};
      const rows = Array.isArray(draft.pendingVariables) ? draft.pendingVariables : [];
      const used = new Set(rows.map((row) => row.variableCode).filter(Boolean));
      const catalog = getActiveFormulaVariables();
      const body = rows.length
        ? rows.map((row) => {
            const options = catalog.filter((item) => !used.has(item.code) || item.code === row.variableCode);
            const errors = row.errors || {};
            return `
              <div class="style-var-row" data-pending-var="${escapeHtml(row.key)}">
                <div>
                  <label class="form-label" for="pending-var-code-${escapeHtml(row.key)}">Variable Code</label>
                  <select id="pending-var-code-${escapeHtml(row.key)}" class="full-select ${errors.variableCode ? "input-invalid" : ""}" data-pending-var-code="${escapeHtml(row.key)}">
                    <option value="">Select a variable...</option>
                    ${options.map((item) => `
                      <option value="${escapeHtml(item.code)}" ${row.variableCode === item.code ? "selected" : ""}>
                        ${escapeHtml(item.code)} — ${escapeHtml(item.name)}
                      </option>
                    `).join("")}
                  </select>
                  ${errors.variableCode ? `<div class="field-error">${escapeHtml(errors.variableCode)}</div>` : ""}
                </div>
                <div>
                  <label class="form-label style-var-row-label" for="pending-var-value-${escapeHtml(row.key)}">Value</label>
                  <input id="pending-var-value-${escapeHtml(row.key)}" class="full-search ${errors.value ? "input-invalid" : ""}" type="number" step="0.0001" data-pending-var-value="${escapeHtml(row.key)}" value="${escapeHtml(row.value === "" || row.value == null ? "" : row.value)}" placeholder="0" />
                  ${errors.value ? `<div class="field-error">${escapeHtml(errors.value)}</div>` : ""}
                </div>
                <div>
                  <label class="form-label style-var-row-label">Unit</label>
                  <input class="full-search" value="${escapeHtml(row.unit || "")}" placeholder="Unit" disabled />
                </div>
                <div class="style-var-row-actions">
                  <button type="button" class="btn btn-sm btn-icon btn-danger" data-remove-pending-var="${escapeHtml(row.key)}" title="Remove variable">
                    <i data-lucide="trash-2"></i>
                  </button>
                </div>
              </div>
            `;
          }).join("")
        : `<div class="style-var-empty">No variables yet. Variables are optional — add them now or later from Edit Style.</div>`;
      return `
        <div class="style-var-composer">
          <div class="section-head">
            <div>
              <div class="section-kicker">Style variables</div>
              <p class="stat-hint" style="margin:4px 0 0;">Optional. Choose a formula variable, enter its value, then save with the style.</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-add-pending-style-variable">
              <i data-lucide="plus"></i> Add Variable
            </button>
          </div>
          <div class="style-var-list">${body}</div>
        </div>
      `;
    }

    function validateStyleDraft(draft) {
      const errors = {};
      const name = String(draft.name || "").trim();
      if (!name) errors.name = "Style name is required.";
      else if (styles.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== draft.id)) {
        errors.name = "Style name must be unique.";
      }
      if (!draft.status) errors.status = "Status is required.";
      return errors;
    }

    function renderStyleFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const editing = state.modal.mode === "edit";
      const tab = state.modal.styleTab || "info";
      const styleVars = editing && draft.id ? getStyleVariables(draft.id) : [];
      const infoForm = `
        <div class="form-grid">
          <div>
            <label class="form-label" for="style-name">Style Name</label>
            <input id="style-name" class="full-search ${errors.name ? "input-invalid" : ""}" value="${escapeHtml(draft.name)}" placeholder="WINDOW LID" />
            ${errors.name ? `<div class="field-error">${escapeHtml(errors.name)}</div>` : ""}
          </div>
          <div>
            <label class="form-label" for="style-status">Status</label>
            <select id="style-status" class="full-select">
              <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
              <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
            </select>
          </div>
          <div class="form-span-2">
            <label class="form-label" for="style-description">Description</label>
            <textarea id="style-description" class="full-search">${escapeHtml(draft.description)}</textarea>
          </div>
        </div>
      `;
      const varRows = styleVars.length
        ? styleVars.map((row) => {
            const catalog = getFormulaVariableByCode(row.variableCode);
            return `
              <tr>
                <td class="mono">${escapeHtml(row.variableCode)}</td>
                <td>${escapeHtml(catalog ? catalog.name : row.variableCode)}</td>
                <td>${escapeHtml(formatDecimal(row.value, 4, false))}</td>
                <td>${escapeHtml(row.unit || (catalog && catalog.unit) || "")}</td>
                ${masterRowActions("data-edit-style-var", row.id, "data-delete-style-var", row.id)}
              </tr>
            `;
          }).join("")
        : emptyRow(5, "No variables added to this style yet.");
      const linkedFormulas = editing && draft.id ? getStyleFormulaLinks(draft.id) : [];
      const linkedIds = new Set(linkedFormulas.map((row) => Number(row.formulaId)));
      const availableFormulas = getStyleTypeFormulas().filter((item) => !linkedIds.has(item.id));
      const formulaRows = linkedFormulas.length
        ? linkedFormulas.map((row) => {
            const formula = getFormula(row.formulaId);
            return `
              <tr>
                <td class="mono">${escapeHtml(formula ? formula.code : "—")}</td>
                <td>${escapeHtml(formula ? formula.name : "Missing formula")}</td>
                <td class="mono">${escapeHtml(formula ? formula.expression : "—")}</td>
                <td>
                  <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-style-formula="${row.id}" title="Remove formula">
                    <i data-lucide="trash-2"></i>
                  </button>
                </td>
              </tr>
            `;
          }).join("")
        : emptyRow(4, "No formulas linked to this style yet.");
      const formulasForm = `
        <div class="section-head">
          <div>
            <div class="section-kicker">Style formulas</div>
            <p class="stat-hint" style="margin:4px 0 0;">Optional. Link Style-type formulas. They auto-calculate in the BOM when a finished good uses this style.</p>
          </div>
        </div>
        <div class="form-grid two" style="margin-bottom:12px;">
          <div>
            <label class="form-label" for="style-formula-select">Add Formula</label>
            <select id="style-formula-select" class="full-select" ${availableFormulas.length ? "" : "disabled"}>
              <option value="">${availableFormulas.length ? "Select a Style formula..." : "No unused Style formulas"}</option>
              ${availableFormulas.map((item) => `
                <option value="${item.id}">${escapeHtml(item.name)} (${escapeHtml(item.code)})</option>
              `).join("")}
            </select>
          </div>
          <div style="display:flex;align-items:flex-end;">
            <button type="button" class="btn btn-primary" id="btn-add-style-formula" ${availableFormulas.length ? "" : "disabled"}>
              <i data-lucide="plus"></i> Add Formula
            </button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table" style="min-width:640px;">
            <thead>
              <tr>
                <th>Formula Code</th>
                <th>Name</th>
                <th>Expression</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>${formulaRows}</tbody>
          </table>
        </div>
      `;
      const variablesForm = `
        <div class="section-head">
          <div class="section-kicker">Style variables</div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-style-variable">
            <i data-lucide="plus"></i> Add Variable to Style
          </button>
        </div>
        <div class="table-wrap">
          <table class="data-table" style="min-width:640px;">
            <thead>
              <tr>
                <th>Variable Code</th>
                <th>Variable Name</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${varRows}</tbody>
          </table>
        </div>
      `;
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Style master</div>
            <strong>${editing ? "Edit Style" : "Add New Style"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          ${editing ? `
            <div class="section-tabs">
              <button type="button" class="section-tab ${tab === "info" ? "active" : ""}" data-style-tab="info">Style Info</button>
              <button type="button" class="section-tab ${tab === "variables" ? "active" : ""}" data-style-tab="variables">Variables</button>
              <button type="button" class="section-tab ${tab === "formulas" ? "active" : ""}" data-style-tab="formulas">Style Formulas</button>
            </div>
            ${tab === "variables" ? variablesForm : tab === "formulas" ? formulasForm : infoForm}
          ` : `${infoForm}${renderPendingStyleVariables()}`}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          ${!editing || tab === "info" ? `<button type="button" class="btn btn-primary" id="btn-save-style">${editing ? "Update Style Info" : "Add Style"}</button>` : ""}
        </div>
      `;
    }

    function openStyleModal(id) {
      const item = id ? styles.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "style-master",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        styleTab: "info",
        draft: item ? { id: item.id, name: item.name, description: item.description || "", status: item.status } : defaultStyleDraft(),
        errors: {},
        sub: null
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
      const payload = {
        name: String(draft.name).trim(),
        description: String(draft.description || "").trim(),
        status: draft.status
      };
      if (state.modal.mode === "edit" && draft.id) {
        const index = styles.findIndex((row) => row.id === draft.id);
        const previous = index >= 0 ? styles[index].name : "";
        if (index >= 0) styles[index] = { ...styles[index], ...payload };
        if (previous && previous !== payload.name) {
          finishedGoods.forEach((fg) => {
            if (String(fg.style).toLowerCase() === String(previous).toLowerCase()) fg.style = payload.name;
          });
        }
        showNotification("Style updated successfully");
        state.modal.errors = {};
        renderModal();
        renderStyles();
        refreshIcons();
        afterDataChange("styles", "finishedGoods");
        refreshOpenBomCalculations();
        return;
      }
      const pending = (draft.pendingVariables || []).filter((row) =>
        String(row.variableCode || "").trim() || String(row.value ?? "").trim() !== ""
      );
      let pendingInvalid = false;
      const usedCodes = new Set();
      pending.forEach((row) => {
        row.errors = {};
        if (!row.variableCode) row.errors.variableCode = "Variable is required.";
        const parsed = parseByRule(row.value, "variable", { requiredError: "Value is required." });
        if (!parsed.ok) row.errors.value = parsed.error;
        if (row.variableCode && usedCodes.has(row.variableCode)) row.errors.variableCode = "Variable already added.";
        if (row.variableCode) usedCodes.add(row.variableCode);
        row.parsedValue = parsed.ok ? parsed.value : null;
        if (Object.keys(row.errors).length) pendingInvalid = true;
      });
      if (pendingInvalid) {
        showNotification("Please fix style variable errors", "error");
        renderModal();
        refreshIcons();
        return;
      }
      const styleId = nextMasterId(styles);
      styles.push({ id: styleId, ...payload });
      pending.forEach((row) => {
        const catalog = getFormulaVariableByCode(row.variableCode);
        styleVariables.push({
          id: nextMasterId(styleVariables),
          styleId,
          variableCode: row.variableCode,
          value: row.parsedValue,
          unit: catalog ? catalog.unit : row.unit
        });
      });
      closeModal();
      renderStyles();
      refreshIcons();
      showNotification(
        pending.length
          ? "Style added with " + pending.length + " variable" + (pending.length === 1 ? "" : "s")
          : "Style added successfully"
      );
      afterDataChange("styles", "styleVariables");
    }

    function addPendingStyleVariable() {
      if (!state.modal.draft) return;
      if (!Array.isArray(state.modal.draft.pendingVariables)) state.modal.draft.pendingVariables = [];
      state.modal.draft.pendingVariables.push(createPendingStyleVariable());
      renderModal();
      refreshIcons();
    }

    function removePendingStyleVariable(key) {
      if (!state.modal.draft || !Array.isArray(state.modal.draft.pendingVariables)) return;
      state.modal.draft.pendingVariables = state.modal.draft.pendingVariables.filter((row) => row.key !== key);
      renderModal();
      refreshIcons();
    }

    function updatePendingStyleVariableFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "style-master" || state.modal.mode !== "add") return false;
      const rows = state.modal.draft.pendingVariables || [];
      const codeKey = target.dataset.pendingVarCode;
      const valueKey = target.dataset.pendingVarValue;
      if (!codeKey && !valueKey) return false;
      const row = rows.find((item) => item.key === (codeKey || valueKey));
      if (!row) return false;
      if (codeKey) {
        row.variableCode = target.value;
        const catalog = getFormulaVariableByCode(target.value);
        row.unit = catalog ? catalog.unit : "";
        if (catalog && (row.value === "" || row.value == null) && catalog.defaultValue != null) {
          row.value = catalog.defaultValue;
        }
        if (row.errors) row.errors.variableCode = "";
        return "rerender";
      }
      row.value = target.value;
      if (row.errors) row.errors.value = "";
      return true;
    }

    function updateStyleDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "style-master") return false;
      const draft = state.modal.draft;
      if (target.id === "style-name") draft.name = target.value;
      else if (target.id === "style-description") draft.description = target.value;
      else if (target.id === "style-status") draft.status = target.value;
      else return false;
      return true;
    }

    function renderStyleVariableFormModal() {
      const sub = state.modal.sub || {};
      const draft = sub.draft || {};
      const errors = sub.errors || {};
      const style = styles.find((item) => item.id === state.modal.draft.id);
      const used = new Set(getStyleVariables(state.modal.draft.id).map((row) => row.variableCode));
      const options = getActiveFormulaVariables().filter((item) => !used.has(item.code) || item.code === draft.variableCode);
      const editing = sub.mode === "edit";
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Style variable</div>
            <strong>${editing ? `Edit ${escapeHtml(draft.variableCode || "")} for ${escapeHtml(style ? style.name : "")}` : `Add Variable to ${escapeHtml(style ? style.name : "")}`}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-back-style-edit">Back</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="svar-code">Select Variable</label>
              ${editing ? `<input class="full-search" value="${escapeHtml(draft.variableCode)}" disabled />` : `
                <select id="svar-code" class="full-select ${errors.variableCode ? "input-invalid" : ""}">
                  <option value="">Select a variable...</option>
                  ${options.map((item) => `
                    <option value="${escapeHtml(item.code)}" ${draft.variableCode === item.code ? "selected" : ""}>
                      ${escapeHtml(item.code)} — ${escapeHtml(item.name)} — ${escapeHtml(item.unit || "")}
                    </option>
                  `).join("")}
                </select>
              `}
              ${errors.variableCode ? `<div class="field-error">${escapeHtml(errors.variableCode)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="svar-value">Value</label>
              <input id="svar-value" class="full-search ${errors.value ? "input-invalid" : ""}" type="number" step="0.0001" value="${escapeHtml(draft.value === "" || draft.value == null ? "" : formatDecimal(draft.value, 4, false))}" />
              ${errors.value ? `<div class="field-error">${escapeHtml(errors.value)}</div>` : ""}
            </div>
            <div>
              <label class="form-label">Unit</label>
              <input class="full-search" value="${escapeHtml(draft.unit || "")}" disabled />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" id="btn-back-style-edit">Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-style-variable">${editing ? "Update Variable" : "Add to Style"}</button>
        </div>
      `;
    }

    function openStyleVariableModal(rowId) {
      const existing = rowId ? styleVariables.find((row) => row.id === Number(rowId)) : null;
      const catalog = existing ? getFormulaVariableByCode(existing.variableCode) : null;
      state.modal.sub = {
        type: "style-variable",
        mode: existing ? "edit" : "add",
        draft: existing
          ? { id: existing.id, variableCode: existing.variableCode, value: existing.value, unit: existing.unit || (catalog && catalog.unit) || "" }
          : { variableCode: "", value: "", unit: "" },
        errors: {}
      };
      renderModal();
    }

    function saveStyleVariableFromModal() {
      const sub = state.modal.sub;
      if (!sub || !sub.draft) return;
      const draft = sub.draft;
      const errors = {};
      if (!draft.variableCode) errors.variableCode = "Variable is required.";
      const parsedValue = parseByRule(draft.value, "variable", { requiredError: "Value is required." });
      if (!parsedValue.ok) errors.value = parsedValue.error;
      sub.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const value = parsedValue.value;
      const catalog = getFormulaVariableByCode(draft.variableCode);
      const unit = catalog ? catalog.unit : draft.unit;
      if (sub.mode === "edit" && draft.id) {
        const index = styleVariables.findIndex((row) => row.id === draft.id);
        if (index >= 0) {
          styleVariables[index] = { ...styleVariables[index], value, unit };
        }
        showNotification("Variable updated");
      } else {
        styleVariables.push({
          id: nextMasterId(styleVariables),
          styleId: state.modal.draft.id,
          variableCode: draft.variableCode,
          value,
          unit
        });
        showNotification("Variable added to style");
      }
      state.modal.sub = null;
      state.modal.styleTab = "variables";
      renderModal();
      renderStyles();
      refreshIcons();
      afterDataChange("styleVariables");
      refreshBomStyleFormulasIfNeeded(state.modal.draft && state.modal.draft.id);
    }

    function updateStyleVariableDraftFromEvent(target) {
      if (!state.modal.sub || !state.modal.sub.draft) return false;
      const draft = state.modal.sub.draft;
      if (target.id === "svar-code") {
        draft.variableCode = target.value;
        const catalog = getFormulaVariableByCode(target.value);
        draft.unit = catalog ? catalog.unit : "";
        if (catalog && draft.value === "" && catalog.defaultValue != null) draft.value = catalog.defaultValue;
        return true;
      }
      if (target.id === "svar-value") {
        draft.value = target.value;
        return true;
      }
      return false;
    }

    function backToStyleEdit() {
      state.modal.sub = null;
      state.modal.styleTab = "variables";
      renderModal();
      refreshIcons();
    }

    function refreshBomStyleFormulasIfNeeded(styleId) {
      const fg = getSelectedFinishedGood();
      const style = fg ? findStyleByName(fg.style) : null;
      if (styleId != null && (!style || style.id !== Number(styleId))) return;
      if (!fg) return;
      refreshOpenBomCalculations();
    }

    function refreshOpenBomCalculations() {
      if (!state.selectedFinishedGoodId || !getSelectedFinishedGood()) return;
      recalculateBOMCosts();
      if (state.currentPage === "bom-costing") refreshBomViews();
    }

    function addStyleFormulaToStyle() {
      if (state.modal.type !== "style-master" || state.modal.mode !== "edit" || !state.modal.draft || !state.modal.draft.id) return;
      const select = document.getElementById("style-formula-select");
      const formulaId = select && select.value ? Number(select.value) : null;
      const formula = getFormula(formulaId);
      if (!formula || formula.type !== "Style") {
        showNotification("Select a Style formula to add.", "error");
        return;
      }
      const styleId = Number(state.modal.draft.id);
      if (styleFormulas.some((row) => row.styleId === styleId && Number(row.formulaId) === formula.id)) {
        showNotification("This formula is already linked to the style.", "error");
        return;
      }
      const order = getStyleFormulaLinks(styleId).reduce((max, row) => Math.max(max, Number(row.order) || 0), 0) + 1;
      styleFormulas.push({
        id: nextMasterId(styleFormulas),
        styleId,
        formulaId: formula.id,
        order,
        createdAt: new Date().toISOString()
      });
      showNotification("Formula linked to style");
      state.modal.styleTab = "formulas";
      renderModal();
      renderStyles();
      refreshIcons();
      afterDataChange("styleFormulas");
      refreshBomStyleFormulasIfNeeded(styleId);
    }

    function removeStyleFormulaFromStyle(linkId) {
      const index = styleFormulas.findIndex((row) => row.id === Number(linkId));
      if (index < 0) return;
      const styleId = styleFormulas[index].styleId;
      styleFormulas.splice(index, 1);
      showNotification("Formula removed from style");
      if (state.modal.type === "style-master") {
        state.modal.styleTab = "formulas";
        renderModal();
      }
      renderStyles();
      refreshIcons();
      afterDataChange("styleFormulas");
      refreshBomStyleFormulasIfNeeded(styleId);
    }

    function defaultDimensionDraft() {
      return {
        name: "",
        description: "",
        L: "",
        W: "",
        H: "",
        uom: "inch",
        status: "Active"
      };
    }

    function formatDimensionCode(L, W) {
      const source = (L !== null && typeof L === "object" && !Array.isArray(L)) ? L : { L, W };
      return [source.L, source.W].map((part) => {
        const n = Number(part);
        return Number.isFinite(n) ? formatDecimal(n, 2, false) : "";
      }).join("x");
    }

    function formatFinishedGoodSizeCode(dims) {
      const source = dims || {};
      return [source.L, source.W, source.H].map((part) => {
        const n = Number(part);
        return Number.isFinite(n) ? formatDecimal(n, 2, false) : "";
      }).join("x");
    }

    function isAutoDimensionCode(value) {
      return /^\d+(\.\d+)?x\d+(\.\d+)?(x\d+(\.\d+)?)?$/i.test(String(value || "").trim());
    }

    function validateDimensionDraft(draft) {
      const errors = {};
      const L = parseByRule(draft.L, "dimension", { requiredError: "Length must be greater than 0.", minError: "Length must be at least 0.1." });
      const W = parseByRule(draft.W, "dimension", { requiredError: "Width must be greater than 0.", minError: "Width must be at least 0.1." });
      if (!L.ok) errors.L = L.error;
      if (!W.ok) errors.W = W.error;
      if (!draft.uom) errors.uom = "UOM is required.";
      if (!draft.status) errors.status = "Status is required.";
      if (!errors.L && !errors.W && draft.uom) {
        const code = formatDimensionCode(L.value, W.value);
        if (dimensions.some((item) => (item.code === code || item.name === code) && (item.uom === draft.uom || item.unit === draft.uom) && item.id !== draft.id)) {
          errors.duplicate = "This dimension already exists.";
        }
      }
      return errors;
    }

    function renderDimensionFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const previewL = parseByRule(draft.L, "dimension");
      const previewW = parseByRule(draft.W, "dimension");
      const previewCode = previewL.ok && previewW.ok
        ? formatDimensionCode(previewL.value, previewW.value)
        : "—";
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Dimension master</div>
            <strong>${state.modal.mode === "edit" ? "Edit Dimension" : "Add New Dimension"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="dim-name">Dimension Name</label>
              <input id="dim-name" class="full-search" value="${escapeHtml(draft.name)}" placeholder="7x7" />
            </div>
            <div>
              <label class="form-label" for="dim-uom">Unit</label>
              <select id="dim-uom" class="full-select">
                ${["inch", "cm", "mm"].map((uom) => `<option value="${uom}" ${draft.uom === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div class="form-span-2">
              <label class="form-label" for="dim-description">Description</label>
              <textarea id="dim-description" class="full-search">${escapeHtml(draft.description)}</textarea>
            </div>
            <div class="form-span-2">
              <label class="form-label">Values</label>
              <div class="dim-input-row two">
                <div>
                  <input id="dim-l" class="full-search ${errors.L ? "input-invalid" : ""}" type="number" min="0.1" step="0.01" value="${escapeHtml(draft.L === "" || draft.L == null ? "" : formatDecimal(draft.L, 2, false))}" placeholder="Length" />
                  ${errors.L ? `<div class="field-error">${escapeHtml(errors.L)}</div>` : ""}
                </div>
                <div>
                  <input id="dim-w" class="full-search ${errors.W ? "input-invalid" : ""}" type="number" min="0.1" step="0.01" value="${escapeHtml(draft.W === "" || draft.W == null ? "" : formatDecimal(draft.W, 2, false))}" placeholder="Width" />
                  ${errors.W ? `<div class="field-error">${escapeHtml(errors.W)}</div>` : ""}
                </div>
              </div>
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
          <button type="button" class="btn btn-primary" id="btn-save-dimension">${state.modal.mode === "edit" ? "Update Dimension" : "Add Dimension"}</button>
        </div>
      `;
    }

    function openDimensionModal(id) {
      const item = id ? dimensions.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "dimension-master",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        draft: item
          ? { id: item.id, name: item.name || item.code, description: item.description || "", L: formatDecimal(item.L, 2, false), W: formatDecimal(item.W, 2, false), H: formatDecimal(item.H, 2, false), uom: item.unit || item.uom, status: item.status }
          : defaultDimensionDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveDimensionFromModal() {
      const draft = state.modal.draft;
      const errors = validateDimensionDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const parsedL = parseByRule(draft.L, "dimension");
      const parsedW = parseByRule(draft.W, "dimension");
      const code = formatDimensionCode(parsedL.value, parsedW.value);
      const typedName = String(draft.name || "").trim();
      const existing = state.modal.mode === "edit" && draft.id
        ? dimensions.find((row) => row.id === draft.id)
        : null;
      const storedH = numericOrNull(draft.H);
      const payload = {
        name: !typedName || isAutoDimensionCode(typedName) ? code : typedName,
        description: String(draft.description || "").trim(),
        code,
        L: parsedL.value,
        W: parsedW.value,
        H: storedH !== null ? storedH : (existing && numericOrNull(existing.H) !== null ? existing.H : 0),
        uom: draft.uom,
        unit: draft.uom,
        status: draft.status
      };
      if (state.modal.mode === "edit" && draft.id) {
        const index = dimensions.findIndex((row) => row.id === draft.id);
        if (index >= 0) dimensions[index] = { ...dimensions[index], ...payload };
        showNotification("Dimension updated successfully");
      } else {
        dimensions.push({ id: nextMasterId(dimensions), ...payload });
        showNotification("Dimension added successfully");
      }
      closeModal();
      renderDimensions();
      refreshIcons();
      afterDataChange("dimensions");
    }

    function updateDimensionDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "dimension-master") return false;
      const draft = state.modal.draft;
      if (target.id === "dim-name") draft.name = target.value;
      else if (target.id === "dim-description") draft.description = target.value;
      else if (target.id === "dim-l") draft.L = target.value;
      else if (target.id === "dim-w") draft.W = target.value;
      else if (target.id === "dim-uom") draft.uom = target.value;
      else if (target.id === "dim-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultFormulaVariableDraft() {
      return {
        code: "",
        name: "",
        description: "",
        category: "Dimension",
        dataType: "numeric",
        unit: "inch",
        defaultValue: "",
        isActive: true
      };
    }

    function validateFormulaVariableDraft(draft) {
      const errors = {};
      const code = String(draft.code || "").trim().toUpperCase();
      if (!code) errors.code = "Code is required.";
      else if (!/^[A-Z][A-Z0-9_]*$/.test(code)) errors.code = "Code can contain only A-Z, 0-9 and underscores.";
      else if (formulaVariables.some((item) => item.code.toUpperCase() === code && item.id !== draft.id)) {
        errors.code = "Code must be unique.";
      }
      if (!String(draft.name || "").trim()) errors.name = "Name is required.";
      if (!draft.category) errors.category = "Category is required.";
      if (!draft.dataType) errors.dataType = "Data type is required.";
      if (draft.dataType === "numeric" && draft.defaultValue !== "" && draft.defaultValue != null) {
        const parsed = parseByRule(draft.defaultValue, "variable");
        if (!parsed.ok) errors.defaultValue = parsed.error;
      }
      return errors;
    }

    function renderFormulaVariableFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const editing = state.modal.mode === "edit";
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Formula variable</div>
            <strong>${editing ? "Edit Formula Variable" : "Add New Formula Variable"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid two">
            <div>
              <label class="form-label" for="fvar-code">Code</label>
              <input id="fvar-code" class="full-search ${errors.code ? "input-invalid" : ""}" value="${escapeHtml(draft.code)}" placeholder="GLUE_FLAP" ${editing ? "disabled" : ""} />
              ${errors.code ? `<div class="field-error">${escapeHtml(errors.code)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="fvar-name">Name</label>
              <input id="fvar-name" class="full-search ${errors.name ? "input-invalid" : ""}" value="${escapeHtml(draft.name)}" placeholder="Glue Flap Width" />
              ${errors.name ? `<div class="field-error">${escapeHtml(errors.name)}</div>` : ""}
            </div>
            <div class="form-span-2">
              <label class="form-label" for="fvar-description">Description</label>
              <textarea id="fvar-description" class="full-search">${escapeHtml(draft.description)}</textarea>
            </div>
            <div>
              <label class="form-label" for="fvar-category">Category</label>
              <select id="fvar-category" class="full-select">
                ${["Dimension", "Material", "Costing", "Sheet", "Area", "Service", "Other"].map((cat) => `<option value="${cat}" ${draft.category === cat ? "selected" : ""}>${cat}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="fvar-datatype">Data Type</label>
              <select id="fvar-datatype" class="full-select">
                <option value="numeric" ${draft.dataType === "numeric" ? "selected" : ""}>numeric</option>
                <option value="text" ${draft.dataType === "text" ? "selected" : ""}>text</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="fvar-unit">Unit</label>
              <select id="fvar-unit" class="full-select">
                ${["inch", "cm", "mm", "kg", "gm", "sq.m", "sq.inch", "%", "pieces", "gsm", "Rs.", ""].map((unit) => `<option value="${escapeHtml(unit)}" ${String(draft.unit) === unit ? "selected" : ""}>${unit || "(none)"}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="fvar-default">Default Value</label>
              <input id="fvar-default" class="full-search ${errors.defaultValue ? "input-invalid" : ""}" value="${escapeHtml(draft.defaultValue)}" />
              ${errors.defaultValue ? `<div class="field-error">${escapeHtml(errors.defaultValue)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="fvar-status">Status</label>
              <select id="fvar-status" class="full-select">
                <option value="Active" ${draft.isActive ? "selected" : ""}>Active</option>
                <option value="Inactive" ${!draft.isActive ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-formula-variable">${editing ? "Update Variable" : "Add Variable"}</button>
        </div>
      `;
    }

    function openFormulaVariableModal(id) {
      const item = id ? formulaVariables.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "formula-variable",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        draft: item
          ? { id: item.id, code: item.code, name: item.name, description: item.description || "", category: item.category, dataType: item.dataType, unit: item.unit || "", defaultValue: item.defaultValue == null ? "" : item.defaultValue, isActive: item.isActive !== false }
          : defaultFormulaVariableDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveFormulaVariableFromModal() {
      const draft = state.modal.draft;
      const errors = validateFormulaVariableDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      let defaultValue = draft.defaultValue === "" ? null : draft.defaultValue;
      if (draft.dataType === "numeric" && defaultValue != null) {
        const parsed = parseByRule(defaultValue, "variable");
        defaultValue = parsed.ok ? parsed.value : defaultValue;
      }
      const payload = {
        name: String(draft.name).trim(),
        description: String(draft.description || "").trim(),
        category: draft.category,
        dataType: draft.dataType,
        unit: draft.unit,
        defaultValue,
        isActive: draft.isActive !== false
      };
      if (state.modal.mode === "edit" && draft.id) {
        const index = formulaVariables.findIndex((row) => row.id === draft.id);
        if (index >= 0) formulaVariables[index] = { ...formulaVariables[index], ...payload };
        showNotification("Variable updated successfully");
      } else {
        formulaVariables.push({
          id: nextMasterId(formulaVariables),
          code: String(draft.code).trim().toUpperCase(),
          ...payload
        });
        showNotification("Variable added successfully");
      }
      closeModal();
      renderFormulaVariables();
      refreshIcons();
      afterDataChange("formulaVariables");
    }

    function updateFormulaVariableDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "formula-variable") return false;
      const draft = state.modal.draft;
      if (target.id === "fvar-code") draft.code = target.value.toUpperCase();
      else if (target.id === "fvar-name") draft.name = target.value;
      else if (target.id === "fvar-description") draft.description = target.value;
      else if (target.id === "fvar-category") draft.category = target.value;
      else if (target.id === "fvar-datatype") draft.dataType = target.value;
      else if (target.id === "fvar-unit") draft.unit = target.value;
      else if (target.id === "fvar-default") draft.defaultValue = target.value;
      else if (target.id === "fvar-status") draft.isActive = target.value === "Active";
      else return false;
      return true;
    }

    function openMasterDeleteModal(entity, id, label) {
      state.modal = {
        type: "confirm-delete-master",
        entity,
        selectedId: Number(id),
        label,
        mode: "delete",
        lineId: null,
        draft: null,
        errors: {}
      };
      renderModal();
    }

    function renderMasterDeleteModal() {
      const isReset = state.modal.entity === "local-data";
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Confirm</div>
            <strong>${isReset ? "Reset local data" : "Delete Confirmation"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <p>${isReset
            ? "Delete all locally saved products, materials, services, formulas, BOMs, and preferences, then restore the original seed data? This cannot be undone."
            : "Are you sure you want to delete " + escapeHtml(state.modal.label) + "? This action cannot be undone."}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-danger-solid" id="btn-confirm-master-delete">${isReset ? "Reset data" : "Delete"}</button>
        </div>
      `;
    }

    function confirmMasterDelete() {
      const id = Number(state.modal.selectedId);
      const entity = state.modal.entity;
      if (entity === "local-data") {
        closeModal();
        resetToSeedData().then(() => {
          navigateTo("dashboard");
          showNotification("Local data cleared. Seed data restored.");
        });
        return;
      }
      if (entity === "finished-good") {
        const index = finishedGoods.findIndex((item) => item.id === id);
        if (index >= 0) finishedGoods.splice(index, 1);
        closeModal();
        renderFinishedGoods();
        showNotification("Product deleted successfully");
        afterDataChange("finishedGoods");
      } else if (entity === "raw-material") {
        const index = rawMaterials.findIndex((item) => item.id === id);
        if (index >= 0) rawMaterials.splice(index, 1);
        closeModal();
        renderRawMaterials();
        showNotification("Material deleted successfully");
        afterDataChange("rawMaterials");
      } else if (entity === "service") {
        const index = services.findIndex((item) => item.id === id);
        if (index >= 0) services.splice(index, 1);
        closeModal();
        renderServices();
        showNotification("Service deleted successfully");
        afterDataChange("services");
      } else if (entity === "style") {
        const style = styles.find((item) => item.id === id);
        const used = style ? productsUsingStyle(style.name) : [];
        if (used.length) {
          showNotification("Cannot delete. Style is used in " + used.length + " products", "error");
          return;
        }
        const index = styles.findIndex((item) => item.id === id);
        if (index >= 0) styles.splice(index, 1);
        for (let i = styleVariables.length - 1; i >= 0; i -= 1) {
          if (styleVariables[i].styleId === id) styleVariables.splice(i, 1);
        }
        for (let i = styleFormulas.length - 1; i >= 0; i -= 1) {
          if (styleFormulas[i].styleId === id) styleFormulas.splice(i, 1);
        }
        closeModal();
        renderStyles();
        showNotification("Style deleted successfully");
        afterDataChange("styles", "styleVariables", "styleFormulas");
      } else if (entity === "dimension") {
        const index = dimensions.findIndex((item) => item.id === id);
        if (index >= 0) dimensions.splice(index, 1);
        closeModal();
        renderDimensions();
        showNotification("Dimension deleted successfully");
        afterDataChange("dimensions");
      } else if (entity === "formula-variable") {
        const variable = formulaVariables.find((item) => item.id === id);
        const used = variable ? formulasUsingVariable(variable.code) : [];
        if (used.length) {
          showNotification("Cannot delete. Variable is used in formulas: " + used.map((item) => item.code).join(", "), "error");
          return;
        }
        const index = formulaVariables.findIndex((item) => item.id === id);
        if (index >= 0) formulaVariables.splice(index, 1);
        closeModal();
        renderFormulaVariables();
        showNotification("Variable deleted successfully");
        afterDataChange("formulaVariables");
      } else if (entity === "style-variable") {
        const parent = state.modal.parentStyle;
        const row = styleVariables.find((item) => item.id === id);
        const styleId = row ? row.styleId : (parent && parent.draft && parent.draft.id);
        const index = styleVariables.findIndex((item) => item.id === id);
        if (index >= 0) styleVariables.splice(index, 1);
        showNotification("Variable removed");
        afterDataChange("styleVariables");
        if (parent) {
          state.modal = parent;
          state.modal.sub = null;
          state.modal.styleTab = "variables";
          renderModal();
        } else {
          closeModal();
        }
        renderStyles();
        refreshIcons();
        refreshBomStyleFormulasIfNeeded(styleId);
        return;
      }
      refreshIcons();
    }

    function defaultMaterialDraft(line) {
      const sheetWeight = getFormulaByCode("SHEET_WEIGHT");
      if (line) {
        const material = getRawMaterial(line.rawMaterialId);
        return {
          rawMaterialId: line.rawMaterialId,
          layer: line.layer,
          calculationMethod: line.calculationMethod,
          formulaId: line.formulaId || (sheetWeight ? sheetWeight.id : null),
          dimensionId: line.dimensionId != null
            ? Number(line.dimensionId)
            : pickBomDimensionId(material && material.dimensionIds, null, getSelectedFinishedGood()),
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
        dimensionId: null,
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
        const qty = parseByRule(draft.manualQty, "quantity", { requiredError: "Manual quantity must be greater than 0." });
        if (!qty.ok) errors.manualQty = qty.error;
      }
      if (material && !Number.isFinite(Number(material.purchasingRate))) {
        errors.rate = "Purchasing rate from the Raw Material Master is not valid.";
      }
      const linkedDims = material ? normalizeDimensionIds(material.dimensionIds) : [];
      if (linkedDims.length && !draft.dimensionId) {
        errors.dimensionId = "Select a dimension for rate calculation.";
      } else if (draft.dimensionId && linkedDims.length && !linkedDims.includes(Number(draft.dimensionId))) {
        errors.dimensionId = "Selected dimension is not linked to this material.";
      }
      const wastage = parseByRule(draft.wastagePercent, "wastage", { requiredError: "Wastage cannot be negative." });
      if (!wastage.ok) errors.wastagePercent = wastage.error;
      if (draft.rawMaterialId && draft.layer && findDuplicateMaterial(draft.rawMaterialId, draft.layer, lineId)) {
        errors.duplicate = "This material is already added to the selected layer.";
      }
      if (!errors.formulaId && !errors.rawMaterialId && !errors.manualQty && !errors.wastagePercent && !errors.finishedGood && !errors.dimensionId) {
        const preview = calculateMaterialCost({
          id: lineId || 0,
          rawMaterialId: draft.rawMaterialId,
          layer: draft.layer,
          calculationMethod: draft.calculationMethod,
          formulaId: draft.formulaId,
          dimensionId: draft.dimensionId,
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
        dimensionId: draft.dimensionId,
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
                <label class="form-label" for="modal-formula-select">Quantity Formula</label>
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
                <input id="modal-manual-qty" class="full-search ${errors.manualQty ? "input-invalid" : ""}" type="number" min="0.0001" step="0.0001" value="${draft.manualQty == null || draft.manualQty === "" ? "" : escapeHtml(formatDecimal(draft.manualQty, 4, false))}" />
                ${errors.manualQty ? `<div class="field-error">${escapeHtml(errors.manualQty)}</div>` : ""}
              </div>
            `}
            ${renderBomDimensionSelect(material ? material.dimensionIds : [], draft.dimensionId, "modal-line-dimension", errors.dimensionId)}
            <div>
              <label class="form-label" for="modal-wastage">Wastage %</label>
              <input id="modal-wastage" class="full-search ${errors.wastagePercent ? "input-invalid" : ""}" type="number" min="0" max="100" step="0.01" value="${escapeHtml(draft.wastagePercent === "" || draft.wastagePercent == null ? "" : formatDecimal(draft.wastagePercent, 2, false))}" />
              ${errors.wastagePercent ? `<div class="field-error">${escapeHtml(errors.wastagePercent)}</div>` : ""}
            </div>
          </div>
          ${material ? `
            <div class="detail-list">
              <div><span>Material Name</span><strong>${escapeHtml(material.name)}</strong></div>
              <div><span>Code</span><strong class="mono">${escapeHtml(material.code)}</strong></div>
              <div><span>GSM</span><strong>${material.gsm === null ? "—" : escapeHtml(formatDecimal(material.gsm, 1, false))}</strong></div>
              <div><span>UOM</span><strong>${escapeHtml(material.uom)}</strong></div>
              <div><span>Purchasing Rate</span><strong>${formatRatePkr(material.purchasingRate, material.rateUOM)}</strong></div>
              <div><span>Qty Formula</span><strong class="mono">${escapeHtml(formatBoundFormulaCode(material.qtyFormulaId))}</strong></div>
              <div><span>Linked Dimensions</span><strong>${escapeHtml(formatLinkedDimensionSummary(material.dimensionIds))}</strong></div>
              <div><span>Qty UOM</span><strong>${escapeHtml(material.uom)}</strong></div>
            </div>
            <div class="rate-source">${preview && preview.rateSource === "dimension" && preview.dimensionId
              ? "Rate Source: Dimension (" + escapeHtml(formatDimensionChipLabel(getDimension(preview.dimensionId))) + ") · purchasingRate × L × W × H / " + DIMENSION_RATE_DIVISOR + "."
              : "Rate Source: Purchasing Rate (PKR)."} Wastage is applied before unit conversion.</div>
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
            <div><span>Dimensions</span><strong>L = ${escapeHtml(formatDecimal(fg.dimensions.L, 2, false))} &nbsp; W = ${escapeHtml(formatDecimal(fg.dimensions.W, 2, false))} &nbsp; H = ${escapeHtml(formatDecimal(fg.dimensions.H, 2, false))}</strong></div>
            <div><span>GSM</span><strong>${material && material.gsm != null ? escapeHtml(formatDecimal(material.gsm, 1, false)) : "—"}</strong></div>
            <div><span>Quantity Formula</span><strong>${line.calculationMethod === "formula" && formula ? escapeHtml(formula.code) : "Manual"}</strong></div>
            <div><span>Quantity Expression</span><strong class="mono">${line.calculationMethod === "formula" && formula ? escapeHtml(formula.expression) : "—"}</strong></div>
            <div><span>Rate Dimension</span><strong>${line.rateSource === "dimension" ? escapeHtml(formatDimensionChipLabel(getDimension(line.dimensionId))) : "—"}</strong></div>
            <div><span>Net Quantity</span><strong>${formatQty(line.netQty)} ${escapeHtml(material ? material.uom : "")}</strong></div>
            <div><span>Wastage</span><strong>${escapeHtml(formatDecimal(line.wastagePercent, 2, false))}%</strong></div>
            <div><span>Gross Quantity</span><strong>${formatQty(line.grossQty)} ${escapeHtml(material ? material.uom : "")}</strong></div>
            <div><span>Qty at rate UOM</span><strong>${formatQty(line.qtyForRate)} ${escapeHtml(material ? formatRateUnit(material.rateUOM) : "")}</strong></div>
            <div><span>Purchasing Rate</span><strong>${material ? formatRatePkr(material.purchasingRate, material.rateUOM) : "—"}</strong></div>
            <div><span>Applied Rate</span><strong>${formatRatePkr(line.rate, material ? material.rateUOM : "")}${line.rateSource === "dimension" ? " (dimension)" : " (master)"}</strong></div>
            ${material && normalizeUnit(material.uom) !== normalizeUnit(material.rateUOM) ? `<div><span>Equivalent rate in ${escapeHtml(material.uom)}</span><strong>${formatRatePkr(convertRate(material.purchasingRate, material.rateUOM, material.uom, material.gsm), material.uom)}</strong></div>` : ""}
            <div><span>Material Cost</span><strong>${formatCurrency(line.costPerPiece)}</strong></div>
          </div>
          <div class="section-kicker" style="margin-top:14px;">Variables</div>
          <div class="var-grid">
            ${Object.entries(variables).map(([key, value]) => `
              <div><span class="mono">${escapeHtml(key)}</span> = <strong>${value === null || value === undefined ? "—" : escapeHtml(formatFormulaResult(value))}</strong></div>
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

      dialog.classList.toggle("wide", state.modal.type === "formula-builder" || state.modal.type === "formula-test" || (state.modal.type === "style-master" && state.modal.mode === "edit"));
      dialog.classList.toggle("wide-form", state.modal.type === "finished-good" || state.modal.type === "formula-variable" || state.modal.type === "raw-material-master" || state.modal.type === "service-master" || (state.modal.type === "style-master" && state.modal.mode === "add"));

      if (state.modal.type === "finished-good") {
        dialog.innerHTML = renderFinishedGoodFormModal();
      } else if (state.modal.type === "raw-material-master") {
        dialog.innerHTML = renderRawMaterialFormModal();
      } else if (state.modal.type === "service-master") {
        dialog.innerHTML = renderServiceMasterFormModal();
      } else if (state.modal.type === "style-master" && state.modal.sub && state.modal.sub.type === "style-variable") {
        dialog.innerHTML = renderStyleVariableFormModal();
      } else if (state.modal.type === "style-master") {
        dialog.innerHTML = renderStyleFormModal();
      } else if (state.modal.type === "dimension-master") {
        dialog.innerHTML = renderDimensionFormModal();
      } else if (state.modal.type === "formula-variable") {
        dialog.innerHTML = renderFormulaVariableFormModal();
      } else if (state.modal.type === "confirm-delete-master") {
        dialog.innerHTML = renderMasterDeleteModal();
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
        showFirstValidationError(errors);
        renderModal();
        return;
      }

      const nextLine = calculateMaterialCost({
        id: state.modal.lineId || nextBomLineId(),
        rawMaterialId: Number(draft.rawMaterialId),
        layer: draft.layer,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? Number(draft.formulaId) : null,
        dimensionId: draft.dimensionId ? Number(draft.dimensionId) : null,
        manualQty: draft.calculationMethod === "manual" ? parseByRule(draft.manualQty, "quantity").value : null,
        wastagePercent: parseByRule(draft.wastagePercent, "wastage").value,
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
      persistEditorState();
    }

    function confirmDeleteMaterial() {
      state.bomMaterials = state.bomMaterials.filter((line) => line.id !== state.modal.lineId);
      recalculateBOMCosts();
      closeModal();
      refreshBomViews();
      persistEditorState();
    }

    function updateLineWastage(lineId, value) {
      const parsed = parseByRule(value === "" ? "0" : value, "wastage");
      if (!parsed.ok) {
        showNotification(parsed.error, "error");
        refreshBomViews();
        return;
      }
      state.bomMaterials = state.bomMaterials.map((line) => {
        if (line.id !== Number(lineId)) return line;
        return { ...line, wastagePercent: parsed.value };
      });
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
    }

    function updateMaterialDraftFromEvent(target) {
      if (!state.modal.draft) return false;
      const draft = state.modal.draft;
      if (target.id === "modal-material-select") {
        draft.rawMaterialId = target.value ? Number(target.value) : null;
        applyMaterialFormulaBindings(draft);
      }
      else if (target.id === "modal-layer-select") draft.layer = target.value;
      else if (target.id === "modal-method-select") draft.calculationMethod = target.value;
      else if (target.id === "modal-formula-select") draft.formulaId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-line-dimension") draft.dimensionId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-manual-qty") {
        draft.manualQty = target.value === "" ? null : target.value;
        state.modal.errors = {};
        return true;
      } else if (target.id === "modal-wastage") {
        draft.wastagePercent = target.value;
        state.modal.errors = {};
        return true;
      } else return false;
      state.modal.errors = {};
      renderModal();
      return true;
    }

    function defaultServiceDraft(line) {
      const printingQty = getFormulaByCode("PRINTING_QTY");
      if (line) {
        const service = getService(line.serviceId);
        return {
          serviceId: line.serviceId,
          calculationMethod: line.calculationMethod,
          formulaId: line.formulaId || (printingQty ? printingQty.id : null),
          dimensionId: line.dimensionId != null
            ? Number(line.dimensionId)
            : pickBomDimensionId(service && service.dimensionIds, null, getSelectedFinishedGood()),
          manualQty: line.manualQty
        };
      }
      return {
        serviceId: null,
        calculationMethod: "formula",
        formulaId: null,
        dimensionId: null,
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
      const linkedDims = service ? normalizeDimensionIds(service.dimensionIds) : [];
      if (linkedDims.length && !draft.dimensionId) {
        errors.dimensionId = "Select a dimension for rate calculation.";
      } else if (draft.dimensionId && linkedDims.length && !linkedDims.includes(Number(draft.dimensionId))) {
        errors.dimensionId = "Selected dimension is not linked to this service.";
      }
      if (draft.calculationMethod === "formula") {
        const selectedFormula = getFormula(draft.formulaId);
        if (!draft.formulaId) errors.formulaId = "Formula is required when Formula method is selected.";
        else if (!selectedFormula || !selectedFormula.isActive || selectedFormula.type !== "Service") {
          errors.formulaId = "Selected formula is not valid or is inactive.";
        }
      } else {
        const qty = parseByRule(draft.manualQty, "quantity", { requiredError: "Quantity / Piece must be greater than 0." });
        if (!qty.ok) errors.manualQty = qty.error;
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
          dimensionId: draft.dimensionId,
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
        dimensionId: draft.dimensionId,
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
                <input id="modal-service-qty" class="full-search ${errors.manualQty ? "input-invalid" : ""}" type="number" min="0.0001" step="0.0001" value="${draft.manualQty == null || draft.manualQty === "" ? "" : escapeHtml(formatDecimal(draft.manualQty, 4, false))}" />
                ${errors.manualQty ? `<div class="field-error">${escapeHtml(errors.manualQty)}</div>` : ""}
              </div>
            `}
            ${renderBomDimensionSelect(service ? service.dimensionIds : [], draft.dimensionId, "modal-service-dimension", errors.dimensionId)}
          </div>
          ${service ? `
            <div class="detail-list">
              <div><span>Service Name</span><strong>${escapeHtml(service.name)}</strong></div>
              <div><span>Code</span><strong class="mono">${escapeHtml(service.code)}</strong></div>
              <div><span>UOM</span><strong>${escapeHtml(service.uom)}</strong></div>
              <div><span>Service Rate</span><strong>${formatRatePkr(service.serviceRate, service.rateUOM)}</strong></div>
              <div><span>Bound Formula</span><strong class="mono">${escapeHtml(formatBoundFormulaCode(service.formulaId))}</strong></div>
              <div><span>Linked Dimensions</span><strong>${escapeHtml(formatLinkedDimensionSummary(service.dimensionIds))}</strong></div>
              <div><span>Qty UOM</span><strong>${escapeHtml(service.uom)}</strong></div>
            </div>
            <div class="rate-source">${preview && preview.rateSource === "dimension"
              ? "Rate Source: Dimension (" + escapeHtml(formatDimensionChipLabel(getDimension(preview.dimensionId))) + ") · serviceRate × L × W × H / " + DIMENSION_RATE_DIVISOR + "."
              : "Rate Source: Service Master (PKR)."}</div>
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
      const variables = service ? buildServiceFormulaVariables(fg, service, line.dimensionId) : {};
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
            <div><span>Rate Dimension</span><strong>${line.rateSource === "dimension" ? escapeHtml(formatDimensionChipLabel(getDimension(line.dimensionId))) : "—"}</strong></div>
            <div><span>Quantity / Piece</span><strong>${formatQty(line.quantity)}</strong></div>
            <div><span>Service Rate</span><strong>${service ? formatRatePkr(service.serviceRate, service.rateUOM) : "—"}</strong></div>
            <div><span>Master Formula</span><strong>${escapeHtml(formatBoundFormulaCode(service && service.formulaId))}</strong></div>
            <div><span>Applied Rate</span><strong>${formatRatePkr(line.rate, service ? service.rateUOM : "")}${line.rateSource === "dimension" ? " (dimension)" : " (master)"}</strong></div>
            <div><span>Service Cost / Piece</span><strong>${formatRupees(line.costPerPiece)}</strong></div>
          </div>
          <div class="section-kicker" style="margin-top:14px;">Variables</div>
          <div class="var-grid">
            ${Object.entries(variables).map(([key, value]) => `
              <div><span class="mono">${escapeHtml(key)}</span> = <strong>${value === null || value === undefined ? "—" : escapeHtml(formatFormulaResult(value))}</strong></div>
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
        showFirstValidationError(errors);
        renderModal();
        return;
      }

      const nextLine = calculateServiceCost({
        id: state.modal.lineId || nextBomLineId(),
        serviceId: Number(draft.serviceId),
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? Number(draft.formulaId) : null,
        dimensionId: draft.dimensionId ? Number(draft.dimensionId) : null,
        manualQty: draft.calculationMethod === "manual" ? parseByRule(draft.manualQty, "quantity").value : null,
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
      persistEditorState();
    }

    function confirmDeleteService() {
      state.bomServices = state.bomServices.filter((line) => line.id !== state.modal.lineId);
      recalculateBOMCosts();
      closeModal();
      refreshBomViews();
      persistEditorState();
    }

    function updateServiceDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "service") return false;
      const draft = state.modal.draft;
      if (target.id === "modal-service-select") {
        draft.serviceId = target.value ? Number(target.value) : null;
        applyServiceFormulaBinding(draft);
      }
      else if (target.id === "modal-service-method") draft.calculationMethod = target.value;
      else if (target.id === "modal-service-formula") draft.formulaId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-service-dimension") draft.dimensionId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-service-qty") {
        draft.manualQty = target.value === "" ? null : target.value;
        state.modal.errors = {};
        return true;
      } else return false;
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
      if (page === "formula-variables") renderFormulaVariables();
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
      persistPrefs();
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
          persistPrefs();
        } else if (id === "rm-search") {
          state.searches.rawMaterials = event.target.value;
          renderRawMaterials();
          refreshIcons();
          restoreFocus(id);
          persistPrefs();
        } else if (id === "srv-search") {
          state.searches.services = event.target.value;
          renderServices();
          refreshIcons();
          restoreFocus(id);
          persistPrefs();
        } else if (id === "bom-list-search") {
          state.searches.boms = event.target.value;
          renderBomList();
          refreshIcons();
          restoreFocus(id);
          persistPrefs();
        } else if (id === "style-search") {
          state.searches.style = event.target.value;
          renderStyles();
          refreshIcons();
          restoreFocus(id);
          persistPrefs();
        } else if (id === "fvar-search") {
          state.searches.formulaVariables = event.target.value;
          renderFormulaVariables();
          refreshIcons();
          restoreFocus(id);
          persistPrefs();
        } else if (id === "dim-search") {
          state.searches.dimensions = event.target.value;
          renderDimensions();
          refreshIcons();
          restoreFocus(id);
          persistPrefs();
        } else if (id === "formula-search") {
          state.searches.formulas = event.target.value;
          renderFormulas();
          refreshIcons();
          restoreFocus(id);
          persistPrefs();
        } else if (id === "fg-combo-search") {
          state.searches.bomFinishedGood = event.target.value;
          state.fgSelectorOpen = true;
          renderFinishedGoodSelector();
          refreshIcons();
          restoreFocus(id);
          persistPrefs();
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
          persistPrefs();
        }
        if (event.target.id === "bom-list-filter") {
          state.bomListFilter = event.target.value;
          renderBomList();
          refreshIcons();
          persistPrefs();
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
        if (event.target.closest("#btn-reset-local-data")) {
          openMasterDeleteModal("local-data", 0, "all locally saved data");
          return;
        }
        if (event.target.closest("#btn-link-cloud")) {
          linkCloudAccount();
          return;
        }
        if (event.target.closest("#btn-unlink-cloud")) {
          unlinkCloudAccount();
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
        if (event.target.closest("#btn-add-formula-variable")) {
          openFormulaVariableModal();
          return;
        }
        if (event.target.closest("#btn-add-dimension")) {
          openDimensionModal();
          return;
        }
        const editFg = event.target.closest("[data-edit-fg]");
        if (editFg) {
          openFinishedGoodModal(editFg.dataset.editFg);
          return;
        }
        const deleteFg = event.target.closest("[data-delete-fg]");
        if (deleteFg) {
          const item = finishedGoods.find((row) => row.id === Number(deleteFg.dataset.deleteFg));
          openMasterDeleteModal("finished-good", deleteFg.dataset.deleteFg, item ? item.product : "this product");
          return;
        }
        const editRm = event.target.closest("[data-edit-rm]");
        if (editRm) {
          openRawMaterialMasterModal(editRm.dataset.editRm);
          return;
        }
        const deleteRm = event.target.closest("[data-delete-rm]");
        if (deleteRm) {
          const item = rawMaterials.find((row) => row.id === Number(deleteRm.dataset.deleteRm));
          openMasterDeleteModal("raw-material", deleteRm.dataset.deleteRm, item ? item.name : "this material");
          return;
        }
        const editSrv = event.target.closest("[data-edit-srv-master]");
        if (editSrv) {
          openServiceMasterModal(editSrv.dataset.editSrvMaster);
          return;
        }
        const deleteSrv = event.target.closest("[data-delete-srv-master]");
        if (deleteSrv) {
          const item = services.find((row) => row.id === Number(deleteSrv.dataset.deleteSrvMaster));
          openMasterDeleteModal("service", deleteSrv.dataset.deleteSrvMaster, item ? item.name : "this service");
          return;
        }
        const editStyle = event.target.closest("[data-edit-style]");
        if (editStyle) {
          openStyleModal(editStyle.dataset.editStyle);
          return;
        }
        const deleteStyle = event.target.closest("[data-delete-style]");
        if (deleteStyle) {
          const item = styles.find((row) => row.id === Number(deleteStyle.dataset.deleteStyle));
          const used = item ? productsUsingStyle(item.name) : [];
          if (used.length) {
            showNotification("Cannot delete. Style is used in " + used.length + " products", "error");
            return;
          }
          openMasterDeleteModal("style", deleteStyle.dataset.deleteStyle, item ? item.name : "this style");
          return;
        }
        const editDim = event.target.closest("[data-edit-dim]");
        if (editDim) {
          openDimensionModal(editDim.dataset.editDim);
          return;
        }
        const deleteDim = event.target.closest("[data-delete-dim]");
        if (deleteDim) {
          const item = dimensions.find((row) => row.id === Number(deleteDim.dataset.deleteDim));
          openMasterDeleteModal("dimension", deleteDim.dataset.deleteDim, item ? (item.name || item.code) : "this dimension");
          return;
        }
        const editFvar = event.target.closest("[data-edit-fvar]");
        if (editFvar) {
          openFormulaVariableModal(editFvar.dataset.editFvar);
          return;
        }
        const deleteFvar = event.target.closest("[data-delete-fvar]");
        if (deleteFvar) {
          const item = formulaVariables.find((row) => row.id === Number(deleteFvar.dataset.deleteFvar));
          if (item) {
            const used = formulasUsingVariable(item.code);
            if (used.length) {
              showNotification("Cannot delete. Variable is used in formulas: " + used.map((row) => row.code).join(", "), "error");
              return;
            }
          }
          openMasterDeleteModal("formula-variable", deleteFvar.dataset.deleteFvar, item ? item.code : "this variable");
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
        if (updateFinishedGoodDraftFromEvent(event.target)) {
          if (event.target.id === "fg-dim-l") normalizeDraftNumber(event.target, "L", "dimension");
          else if (event.target.id === "fg-dim-w") normalizeDraftNumber(event.target, "W", "dimension");
          else if (event.target.id === "fg-dim-h") normalizeDraftNumber(event.target, "H", "dimension");
          return;
        }
        if (updateRawMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "rm-rate") normalizeDraftNumber(event.target, "purchasingRate", "rate", true);
          if (event.target.id === "rm-gsm") normalizeDraftNumber(event.target, "gsm", "gsm");
          if (event.target.id === "rm-category" || event.target.id === "rm-dimension-select") renderModal();
          restoreFocus(event.target.id);
          return;
        }
        if (updateServiceMasterDraftFromEvent(event.target)) {
          if (event.target.id === "srv-rate") normalizeDraftNumber(event.target, "serviceRate", "rate", true);
          if (event.target.id === "srv-dimension-select") renderModal();
          return;
        }
        if (updateStyleDraftFromEvent(event.target)) return;
        const pendingChange = updatePendingStyleVariableFromEvent(event.target);
        if (pendingChange) {
          if (pendingChange === "rerender") {
            renderModal();
            refreshIcons();
            restoreFocus(event.target.id);
          }
          return;
        }
        if (updateStyleVariableDraftFromEvent(event.target)) {
          if (event.target.id === "svar-value") normalizeDraftNumber(event.target, "value", "variable", false, state.modal.sub && state.modal.sub.draft);
          if (event.target.id === "svar-code") renderModal();
          restoreFocus(event.target.id);
          return;
        }
        if (updateFormulaVariableDraftFromEvent(event.target)) return;
        if (updateDimensionDraftFromEvent(event.target)) {
          if (event.target.id === "dim-l") normalizeDraftNumber(event.target, "L", "dimension");
          else if (event.target.id === "dim-w") normalizeDraftNumber(event.target, "W", "dimension");
          if (event.target.id === "dim-l" || event.target.id === "dim-w") {
            refreshDimensionCodePreview();
          } else {
            renderModal();
            restoreFocus(event.target.id);
          }
          return;
        }
        if (updateServiceDraftFromEvent(event.target)) {
          if (event.target.id === "modal-service-qty") normalizeDraftNumber(event.target, "manualQty", "quantity");
          restoreFocus(event.target.id);
          return;
        }
        if (updateMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "modal-manual-qty") normalizeDraftNumber(event.target, "manualQty", "quantity");
          if (event.target.id === "modal-wastage") normalizeDraftNumber(event.target, "wastagePercent", "wastage");
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
          restoreFocus(event.target.id);
        }
        if (updatePendingStyleVariableFromEvent(event.target)) {
          restoreFocus(event.target.id);
        }
        if (updateStyleVariableDraftFromEvent(event.target)) {
          restoreFocus(event.target.id);
        }
        if (updateFormulaVariableDraftFromEvent(event.target)) {
          if (event.target.id === "fvar-code") event.target.value = String(event.target.value || "").toUpperCase();
          restoreFocus(event.target.id);
        }
        if (updateDimensionDraftFromEvent(event.target)) {
          if (event.target.id === "dim-l" || event.target.id === "dim-w") {
            refreshDimensionCodePreview();
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
          state.modal.draft.testValues[event.target.dataset.testVar] = event.target.value;
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
        const removeLinkedDim = event.target.closest("[data-remove-linked-dim]");
        if (removeLinkedDim && state.modal.draft) {
          state.modal.draft.dimensionIds = removeLinkedDimensionId(state.modal.draft.dimensionIds, removeLinkedDim.dataset.removeLinkedDim);
          renderModal();
          refreshIcons();
          return;
        }
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
        if (event.target.closest("#btn-save-style-variable")) {
          saveStyleVariableFromModal();
          return;
        }
        if (event.target.closest("#btn-back-style-edit")) {
          backToStyleEdit();
          return;
        }
        if (event.target.closest("#btn-add-style-variable")) {
          openStyleVariableModal();
          return;
        }
        if (event.target.closest("#btn-add-style-formula")) {
          addStyleFormulaToStyle();
          return;
        }
        const deleteStyleFormula = event.target.closest("[data-delete-style-formula]");
        if (deleteStyleFormula) {
          removeStyleFormulaFromStyle(deleteStyleFormula.dataset.deleteStyleFormula);
          return;
        }
        if (event.target.closest("#btn-add-pending-style-variable")) {
          addPendingStyleVariable();
          return;
        }
        const removePendingVar = event.target.closest("[data-remove-pending-var]");
        if (removePendingVar) {
          removePendingStyleVariable(removePendingVar.dataset.removePendingVar);
          return;
        }
        const styleTab = event.target.closest("[data-style-tab]");
        if (styleTab) {
          state.modal.styleTab = styleTab.dataset.styleTab;
          renderModal();
          refreshIcons();
          return;
        }
        const editStyleVar = event.target.closest("[data-edit-style-var]");
        if (editStyleVar) {
          openStyleVariableModal(editStyleVar.dataset.editStyleVar);
          return;
        }
        const deleteStyleVar = event.target.closest("[data-delete-style-var]");
        if (deleteStyleVar) {
          const row = styleVariables.find((item) => item.id === Number(deleteStyleVar.dataset.deleteStyleVar));
          const parent = {
            type: state.modal.type,
            selectedId: state.modal.selectedId,
            mode: state.modal.mode,
            lineId: state.modal.lineId,
            styleTab: "variables",
            draft: state.modal.draft,
            errors: {},
            sub: null
          };
          openMasterDeleteModal("style-variable", deleteStyleVar.dataset.deleteStyleVar, row ? row.variableCode : "this variable");
          state.modal.parentStyle = parent;
          return;
        }
        if (event.target.closest("#btn-save-formula-variable")) {
          saveFormulaVariableFromModal();
          return;
        }
        if (event.target.closest("#btn-confirm-master-delete")) {
          confirmMasterDelete();
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

    async function boot() {
      setupNavigation();
      setupEventHandlers();
      try {
        await initIndexedDB();
      } catch (error) {
        console.error("IndexedDB initialization failed", error);
        idbReady = false;
        showNotification("Could not initialize offline storage. Using seed data only.", "warning");
        setSaveStatus("Not persisted", "error");
        navigateTo("dashboard");
        return;
      }
      try {
        const loaded = await loadDataFromIndexedDB();
        hydratedFromSeed = Boolean(loaded && loaded.fromSeed);
      } catch (error) {
        console.error("Could not load saved data", error);
        showNotification("Could not load saved data, using defaults", "warning");
        setSaveStatus("Using defaults", "error");
      }
      startCloudAuthListener();
      window.addEventListener("online", () => {
        updateSyncStatus("Syncing...", "info");
        syncAllDataToCloud();
      });
      window.addEventListener("offline", () => {
        updateSyncStatus("Offline — will sync when online", "info");
      });
      updateHeaderCloudBadge();
      const startPage = PAGE_META[state.currentPage] ? state.currentPage : "dashboard";
      navigateTo(startPage);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
