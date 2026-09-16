import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import * as XLSX from "xlsx";

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

    const finishedGoods = [];
    const finishingServices = [];

    const styles = [
      { id: 101, name: "WINDOW LID", description: "Lid with window cutout", status: "Active" },
      { id: 102, name: "SIMPLE LID", description: "Lid without cutout", status: "Active" },
      { id: 103, name: "STANDARD", description: "Standard box style", status: "Active" },
      { id: 104, name: "Locking Flap", description: "Locking flap carton", status: "Active" }
    ];

    const styleVariables = [
      { id: 1, styleId: 101, variableCode: "GLUE_FLAP", ply: 1, value: 10, unit: "mm" },
      { id: 2, styleId: 101, variableCode: "SHEET_WIDTH", ply: 1, value: 50, unit: "inch" },
      { id: 3, styleId: 102, variableCode: "GLUE_FLAP", ply: 1, value: 10.5, unit: "mm" },
      { id: 4, styleId: 102, variableCode: "SHEET_WIDTH", ply: 1, value: 95, unit: "cm" },
      { id: 5, styleId: 103, variableCode: "GLUE_FLAP", ply: 2, value: 15.0, unit: "mm" },
      { id: 6, styleId: 101, variableCode: "GLUE_FLAP", ply: 2, value: 12, unit: "mm" },
      { id: 7, styleId: 101, variableCode: "GLUE_FLAP", ply: 3, value: 15, unit: "mm" },
      { id: 8, styleId: 101, variableCode: "WASTAGE", ply: 1, value: 5, unit: "%" },
      { id: 9, styleId: 101, variableCode: "WASTAGE", ply: 2, value: 5, unit: "%" },
      { id: 10, styleId: 101, variableCode: "WASTAGE", ply: 3, value: 5, unit: "%" },
      { id: 11, styleId: 101, variableCode: "SHEET_WIDTH", ply: 2, value: 50, unit: "inch" },
      { id: 12, styleId: 101, variableCode: "SHEET_WIDTH", ply: 3, value: 50, unit: "inch" },
      { id: 13, styleId: 101, variableCode: "SHEET_LENGTH", ply: 1, value: 50, unit: "inch" },
      { id: 14, styleId: 101, variableCode: "SHEET_LENGTH", ply: 2, value: 50, unit: "inch" },
      { id: 15, styleId: 101, variableCode: "SHEET_LENGTH", ply: 3, value: 50, unit: "inch" }
    ];

    const styleFormulas = [
      { id: 1, styleId: 101, formulaId: 315, order: 1, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: 2, styleId: 101, formulaId: 316, order: 2, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: 3, styleId: 103, formulaId: 316, order: 1, createdAt: "2026-01-01T00:00:00.000Z" }
    ];

    const serviceDimensions = [];

    const materialDimensions = [];

    const otherMaterialDimensions = [];

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
      { id: 12, code: "SHEET_AREA", name: "Sheet Area", description: "Calculated as SHEET_WIDTH × SHEET_LENGTH", dataType: "numeric", defaultValue: null, unit: "sq.inch", category: "Sheet", isActive: true },
      { id: 13, code: "PIECE_AREA", name: "Piece Area", description: "Finished piece area", dataType: "numeric", defaultValue: 435, unit: "sq.inch", category: "Area", isActive: true },
      { id: 14, code: "MATERIAL_RATE", name: "Material Rate", description: "Purchasing rate from material master", dataType: "numeric", defaultValue: 150, unit: "Rs./kg", category: "Costing", isActive: true },
      { id: 15, code: "SERVICE_RATE", name: "Service Rate", description: "Rate from service master", dataType: "numeric", defaultValue: 2.5, unit: "Rs./piece", category: "Service", isActive: true },
      { id: 16, code: "PRINT_AREA", name: "Print Area", description: "Printable area", dataType: "numeric", defaultValue: 435, unit: "sq.inch", category: "Area", isActive: true },
      { id: 17, code: "MATERIAL_COST", name: "Material Cost", description: "Rolled-up material cost", dataType: "numeric", defaultValue: 0, unit: "Rs.", category: "Costing", isActive: true },
      { id: 18, code: "SERVICE_COST", name: "Service Cost", description: "Rolled-up service cost", dataType: "numeric", defaultValue: 0, unit: "Rs.", category: "Service", isActive: true },
      { id: 19, code: "NO_OF_COLOR", name: "Number of Colors", description: "Number of print colors entered by the user", dataType: "numeric", defaultValue: 1, unit: "", category: "Printing", isActive: true }
    ];

    const dimensions = [
      { id: 201, name: "7x7x4", description: "Small Box 7x7x4 inches", code: "7x7x4", L: 7, W: 7, H: 4, uom: "inch", unit: "inch", status: "Active" },
      { id: 202, name: "10x10x5", description: "Medium Box 10x10x5 inches", code: "10x10x5", L: 10, W: 10, H: 5, uom: "inch", unit: "inch", status: "Active" },
      { id: 203, name: "12x12x2", description: "Large Box 12x12x2 inches", code: "12x12x2", L: 12, W: 12, H: 2, uom: "inch", unit: "inch", status: "Active" },
      { id: 204, name: "9x9x5", description: "Cake box 9x9x5 inches", code: "9x9x5", L: 9, W: 9, H: 5, uom: "inch", unit: "inch", status: "Active" }
    ];

    const rawMaterials = [];

    const materialRates = [];

    const otherRawMaterials = [];
    const otherMaterialRates = [];

    const services = [];

    const serviceRates = [];

    const SERVICE_CATEGORY_OPTIONS = [
      { id: "general", label: "General" },
      { id: "finishing", label: "Finishing" },
      { id: "other", label: "Other" }
    ];
    const SERVICE_CATEGORY_IDS = SERVICE_CATEGORY_OPTIONS.map((item) => item.id);

    const formulas = [
      {
        id: 301,
        code: "FLAT_LENGTH",
        name: "Flat Length",
        type: "Material",
        purpose: null,
        description: "Unfolded carton length including glue flap.",
        expression: "2 * L + 2 * W + GLUE_FLAP",
        isActive: true
      },
      {
        id: 302,
        code: "FLAT_WIDTH",
        name: "Flat Width",
        type: "Material",
        purpose: null,
        description: "Unfolded carton width from height and base width.",
        expression: "2 * H + W",
        isActive: true
      },
      {
        id: 303,
        code: "FLAT_AREA",
        name: "Flat Area",
        type: "Material",
        purpose: null,
        description: "Blank area from flat length and width.",
        expression: "FLAT_LENGTH * FLAT_WIDTH",
        isActive: true
      },
      {
        id: 304,
        code: "COVERED_AREA",
        name: "Covered Area",
        type: "Material",
        purpose: null,
        description: "Material coverage area for the finished blank.",
        expression: "FLAT_AREA",
        isActive: true
      },
      {
        id: 305,
        code: "SHEET_WEIGHT",
        name: "Sheet Weight",
        type: "Material",
        purpose: "Quantity",
        description: "Weight from covered area and GSM.",
        expression: "COVERED_AREA * GSM * SQ_IN_TO_SQ_M / 1000",
        isActive: true
      },
      {
        id: 306,
        code: "GROSS_QTY",
        name: "Gross Quantity With Wastage",
        type: "Material",
        purpose: null,
        description: "Net quantity inflated by wastage percent.",
        expression: "NET_QTY * (1 + WASTAGE / 100)",
        isActive: true
      },
      {
        id: 307,
        code: "PIECES_PER_SHEET",
        name: "Pieces From Sheet",
        type: "Material",
        purpose: null,
        description: "How many pieces nest on one sheet.",
        expression: "SHEET_AREA / PIECE_AREA",
        isActive: true
      },
      {
        id: 308,
        code: "REQUIRED_SHEETS",
        name: "Required Sheets",
        type: "Material",
        purpose: null,
        description: "Sheets needed for the order quantity.",
        expression: "ORDER_QTY / PIECES_PER_SHEET",
        isActive: true
      },
      {
        id: 309,
        code: "PRINTING_COST",
        name: "Printing Cost",
        type: "Service",
        purpose: null,
        description: "Printing charge from print area and service rate.",
        expression: "PRINT_AREA * SERVICE_RATE",
        isActive: true
      },
      {
        id: 310,
        code: "PIECE_COST",
        name: "Per Piece Cost",
        type: "Service",
        purpose: null,
        description: "Rolled-up material and service cost per piece.",
        expression: "MATERIAL_COST + SERVICE_COST",
        isActive: true
      },
      {
        id: 311,
        code: "PRINTING_QTY",
        name: "Printing Qty",
        type: "Service",
        purpose: "Quantity",
        description: "Printing quantity per finished piece.",
        expression: "1",
        isActive: true
      },
      {
        id: 312,
        code: "DIE_CUTTING_QTY",
        name: "Die Cutting Qty",
        type: "Service",
        purpose: "Quantity",
        description: "Die cutting quantity per finished piece.",
        expression: "1",
        isActive: true
      },
      {
        id: 313,
        code: "WINDOW_PASTING_QTY",
        name: "Window Pasting Qty",
        type: "Service",
        purpose: null,
        description: "Window pasting quantity per finished piece.",
        expression: "1",
        isActive: true
      },
      {
        id: 314,
        code: "PASTING_QTY",
        name: "Pasting Qty",
        type: "Service",
        purpose: "Quantity",
        description: "Pasting quantity per finished piece.",
        expression: "1",
        isActive: true
      },
      {
        id: 315,
        code: "GLUE_CALC",
        name: "Glue Amount",
        type: "Style",
        purpose: null,
        description: "Glue flap allowance doubled for this style.",
        expression: "GLUE_FLAP * 2",
        isActive: true
      },
      {
        id: 316,
        code: "AREA_CALC",
        name: "Covered Area",
        type: "Style",
        purpose: null,
        description: "Simple length times width for the style blank.",
        expression: "L * W",
        coveredArea: true,
        isActive: true
      }
    ];

    /* Transaction / configuration data. Do not mix with master data. */
    const boms = [];

    const SQ_IN_TO_SQ_M = 0.00064516;
    const GRAM_TO_KG = 0.001;
    const DEFAULT_GLUE_FLAP = 1;
    const DEFAULT_WASTAGE_PERCENT = 5;
    const SERVICE_CUSTOM_DIM_ERROR = "Enter custom Length and Width.";
    const STRUCTURAL_PLY_LAYERS = {
      1: ["Single Layer"],
      2: ["Top Liner", "Bottom Liner"],
      3: ["Top Liner", "Inner Liner", "Bottom Liner"]
    };

    let bomLineSeq = 1;
    let bomSeq = 1;
    let formulaSeq = formulas.reduce((max, item) => Math.max(max, item.id), 300) + 1;

    function snapshotData(value) {
      return JSON.parse(JSON.stringify(value));
    }

    const SEED_DATA = {
      finishedGoods: snapshotData(finishedGoods),
      finishingServices: snapshotData(finishingServices),
      rawMaterials: snapshotData(rawMaterials),
      otherRawMaterials: snapshotData(otherRawMaterials),
      materialRates: snapshotData(materialRates),
      otherMaterialRates: snapshotData(otherMaterialRates),
      services: snapshotData(services),
      serviceRates: snapshotData(serviceRates),
      formulas: snapshotData(formulas),
      boms: snapshotData(boms),
      styles: snapshotData(styles),
      dimensions: snapshotData(dimensions),
      formulaVariables: snapshotData(formulaVariables),
      styleVariables: snapshotData(styleVariables),
      styleFormulas: snapshotData(styleFormulas),
      serviceDimensions: snapshotData(serviceDimensions),
      materialDimensions: snapshotData(materialDimensions),
      otherMaterialDimensions: snapshotData(otherMaterialDimensions)
    };

    const FORMULA_TYPES = ["Material", "Service", "Style"];
    const FORMULA_PURPOSES = ["Rate", "Quantity"];
    const MATERIAL_CATEGORIES = ["Paper", "Board", "Sheet", "Film", "Consumable"];
    const MATERIAL_UOMS = ["kg", "gm", "sheet", "sq.meter"];
    const FINISHED_GOOD_UOMS = ["pieces", "kg", "box"];

    const BASE_VARIABLES = [
      "L", "W", "H", "GSM", "PLY", "GLUE_FLAP", "WASTAGE", "NET_QTY", "ORDER_QTY",
      "SHEET_LENGTH", "SHEET_WIDTH", "SHEET_AREA", "PIECE_AREA",
      "FLAT_LENGTH", "FLAT_WIDTH", "FLAT_AREA", "COVERED_AREA",
      "MATERIAL_RATE", "SERVICE_RATE", "PRINT_AREA", "MATERIAL_COST", "SERVICE_COST", "NO_OF_COLOR"
    ];

    const ENGINE_CONSTANTS = {
      SQ_IN_TO_SQ_M,
      GRAM_TO_KG,
      CONVERSION_FACTOR: 1 / (SQ_IN_TO_SQ_M * GRAM_TO_KG)
    };

    const ENGINE_CONSTANT_LABELS = {
      SQ_IN_TO_SQ_M: "sq in → sq m conversion",
      GRAM_TO_KG: "grams → kilograms conversion",
      CONVERSION_FACTOR: "unit conversion factor"
    };

    const FIXED_IMPLEMENTATION_VARIABLES = [
      {
        code: "SQ_IN_TO_SQ_M",
        value: SQ_IN_TO_SQ_M,
        formula: "0.00064516",
        description: "Fixed. Converts square inches to square meters."
      },
      {
        code: "GRAM_TO_KG",
        value: GRAM_TO_KG,
        formula: "0.001",
        description: "Fixed. Converts grams to kilograms."
      },
      {
        code: "CONVERSION_FACTOR",
        value: ENGINE_CONSTANTS.CONVERSION_FACTOR,
        formula: "1 / (SQ_IN_TO_SQ_M × GRAM_TO_KG)",
        description: "Fixed. Combined unit conversion factor used by the formula engine."
      },
      {
        code: "ORDER_QTY",
        value: 1,
        formula: "1",
        description: "Fixed. Pieces to manufacture."
      }
    ];

    const CONVERSION_FACTOR_CODE = "CONVERSION_FACTOR";
    const CONVERSION_FACTOR_FORMULA = "1 / (SQ_IN_TO_SQ_M × GRAM_TO_KG)";

    function builtInFixedVariableRows() {
      return FIXED_IMPLEMENTATION_VARIABLES.map((item, index) => ({
        id: index + 1,
        code: item.code,
        value: item.value,
        description: item.description,
        builtIn: true
      }));
    }

    const fixedVariables = builtInFixedVariableRows();
    SEED_DATA.fixedVariables = snapshotData(fixedVariables);

    function getFixedVariableByCode(code) {
      const target = String(code || "").toUpperCase();
      return fixedVariables.find((item) => String(item.code || "").toUpperCase() === target) || null;
    }

    function isDerivedFixedVariable(item) {
      return Boolean(item && String(item.code || "").toUpperCase() === CONVERSION_FACTOR_CODE);
    }

    function syncEngineConstantsFromFixedVariables() {
      const sqInRow = getFixedVariableByCode("SQ_IN_TO_SQ_M");
      const gramRow = getFixedVariableByCode("GRAM_TO_KG");
      const sqIn = sqInRow && Number.isFinite(Number(sqInRow.value)) && Number(sqInRow.value) > 0
        ? Number(sqInRow.value)
        : SQ_IN_TO_SQ_M;
      const gram = gramRow && Number.isFinite(Number(gramRow.value)) && Number(gramRow.value) > 0
        ? Number(gramRow.value)
        : GRAM_TO_KG;
      const conversionFactor = 1 / (sqIn * gram);
      const cfRow = getFixedVariableByCode(CONVERSION_FACTOR_CODE);
      if (cfRow) cfRow.value = conversionFactor;
      Object.keys(ENGINE_CONSTANTS).forEach((key) => delete ENGINE_CONSTANTS[key]);
      fixedVariables.forEach((item) => {
        const code = String(item.code || "").toUpperCase();
        if (!code || code === "ORDER_QTY") return;
        const value = Number(item.value);
        if (Number.isFinite(value)) ENGINE_CONSTANTS[code] = value;
      });
      ENGINE_CONSTANTS.SQ_IN_TO_SQ_M = sqIn;
      ENGINE_CONSTANTS.GRAM_TO_KG = gram;
      ENGINE_CONSTANTS[CONVERSION_FACTOR_CODE] = conversionFactor;
    }

    function ensureFixedVariables() {
      FIXED_IMPLEMENTATION_VARIABLES.forEach((seed) => {
        if (!getFixedVariableByCode(seed.code)) {
          fixedVariables.push({
            id: nextMasterId(fixedVariables),
            code: seed.code,
            value: seed.value,
            description: seed.description,
            builtIn: true
          });
        }
      });
      fixedVariables.forEach((item) => {
        if (FIXED_IMPLEMENTATION_VARIABLES.some((seed) => seed.code === String(item.code || "").toUpperCase())) {
          item.builtIn = true;
        }
      });
      syncEngineConstantsFromFixedVariables();
    }

    syncEngineConstantsFromFixedVariables();

    const FIXED_SHEET_AREA = {
      code: "SHEET_AREA",
      formula: "SHEET_WIDTH × SHEET_LENGTH",
      description: "Fixed calculation. Sheet area is always calculated from sheet width × sheet length."
    };

    const FIXED_COST_FORMULAS = {
      lineCost: {
        formula: "Converted Quantity × Rate",
        description: "Fixed. Line cost is converted quantity × master rate."
      },
      colorCost: {
        formula: "Number of Colors × Rate Per Color",
        description: "Fixed. Color cost is colors × rate per color."
      },
      finalCost: {
        formula: "Material Total + Service Total + Finishing Total",
        description: "Fixed. Final Cost is Material Total Cost + Service Total Cost + Finishing Services Total Cost. Consumable materials are Additional Cost and are not included. Color printing is shown separately when entered."
      },
      finalCostCalculator: {
        formula: "Material Total + Service Total + Finishing Total",
        description: "Fixed. Final Cost is Material Total Cost + Service Total Cost + Finishing Services Total Cost. Consumable materials are Additional Cost and are not included. Color printing is shown separately when entered."
      },
      materialTotal: {
        formula: "Material Per Piece × Order Quantity",
        description: "Fixed. Material total is per-piece material × Order Quantity."
      },
      additionalCost: {
        formula: "Sum of Consumable materials",
        description: "Fixed. Additional Cost is the sum of Consumable raw materials. It is not included in Final Cost/Piece."
      },
      finishingCost: {
        formula: "Sum of Finishing Service line costs",
        description: "Fixed. Each finishing service line is converted quantity × master rate."
      },
      finishingTotal: {
        formula: "Finishing Per Piece × Order Quantity",
        description: "Fixed. Finishing total is per-piece finishing × Order Quantity."
      },
      per1: {
        formula: "Material Per Piece + Service Per Piece + Finishing Per Piece",
        description: "Fixed. Cost of 1 piece uses service per piece, not the 1,000-piece service total."
      },
      givenQuantity: {
        formula: "(Material Per Piece × Order Quantity + Service Total + Finishing Per Piece × Order Quantity) / Order Quantity",
        description: "Fixed. Service Total is packaging services × 1,000. Material and finishing use per-piece × Order Quantity."
      },
      per100: {
        formula: "(Material Per Piece × 100 + Service Total + Finishing Per Piece × 100) / 100",
        description: "Fixed. Service Total is packaging services × 1,000. Material and finishing use per-piece × 100. Not Order Quantity."
      },
      per500: {
        formula: "(Material Per Piece × 500 + Service Total + Finishing Per Piece × 500) / 500",
        description: "Fixed. Service Total is packaging services × 1,000. Material and finishing use per-piece × 500. Not Order Quantity."
      },
      per1000: {
        formula: "(Material Per Piece × 1,000 + Service Total + Finishing Per Piece × 1,000) / 1,000",
        description: "Fixed. Service Total is packaging services × 1,000. Material and finishing use per-piece × 1,000. Not Order Quantity."
      },
      orderCost: {
        formula: "Final Cost/Piece × Order Quantity",
        description: "Fixed. Order total is per-piece cost × entered quantity. Box/kg are not converted to pieces."
      },
      saleCost: {
        formula: "Cost + Overhead, then Profit is applied to that subtotal",
        description: "Fixed. Overhead is applied to cost first, then profit on that subtotal."
      }
    };

    function isFixedSheetAreaCode(code) {
      return String(code || "").toUpperCase() === "SHEET_AREA";
    }

    function isReservedImplementationVariableCode(code) {
      return Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, String(code || "").toUpperCase());
    }

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
      SHEET_WIDTH: 40,
      SHEET_LENGTH: 48,
      PIECE_AREA: 435,
      MATERIAL_RATE: 300,
      SERVICE_RATE: 2.5,
      PRINT_AREA: 435,
      MATERIAL_COST: 0,
      SERVICE_COST: 0,
      NO_OF_COLOR: 1
    };

    /* ==================================================
       Application state
       ================================================== */

    const PAGE_META = {
      dashboard: { title: "Dashboard", subtitle: "Manufacturing overview" },
      "formula-variables": { title: "Variables", subtitle: "Shared variables used by formulas" },
      formulas: { title: "Formula", subtitle: "Definitions, builder, and validation" },
      dimensions: { title: "Dimension", subtitle: "Dimension master" },
      style: { title: "Style", subtitle: "Style master and style variables" },
      "raw-materials": { title: "Raw Material", subtitle: "Purchasing master" },
      "raw-material-rates": { title: "Raw Material Rates", subtitle: "Manage purchasing rates for raw materials" },
      services: { title: "Services", subtitle: "Conversion process master" },
      "service-rates": { title: "Service Rates", subtitle: "Manage pricing and formulas for services" },
      "other-raw-materials": { title: "Other Raw Material", subtitle: "Purchasing master" },
      "other-raw-material-rates": { title: "Other Raw Material Rates", subtitle: "Manage purchasing rates for other raw materials" },
      "finished-goods": { title: "Finished Goods", subtitle: "Product master" },
      "bom-costing": { title: "BOM & Costing", subtitle: "Select a finished good to begin" },
      "bom-list": { title: "BOM List", subtitle: "Saved drafts and active versions" },
      "cost-calculator": { title: "Cost Calculator", subtitle: "Quick cost estimate by style, size, ply, and materials" }
    };

    const state = {
      currentPage: "dashboard",
      searches: {
        finishedGoods: "",
        rawMaterials: "",
        otherRawMaterials: "",
        materialRates: "",
        otherMaterialRates: "",
        services: "",
        serviceRates: "",
        style: "",
        formulaVariables: "",
        dimensions: "",
        formulas: "",
        bomFinishedGood: "",
        bomFinishingService: "",
        boms: ""
      },
      formulaFilter: "all",
      materialRateFilter: "all",
      materialRateSort: "name",
      otherMaterialRateFilter: "all",
      otherMaterialRateSort: "name",
      serviceRateFilter: "all",
      serviceRateSort: "name",
      bomListFilter: "all",
      workflowError: "",
      notification: null,
      sidebarOpen: false,
      selectedFinishedGoodId: null,
      selectedFinishingServiceId: null,
      currentBOM: null,
      bomMaterials: [],
      bomOtherMaterials: [],
      bomServices: [],
      bomAdditionalServices: [],
      bomFinishingServices: [],
      bomStyleResults: [],
      totalMaterialCost: 0,
      totalOtherMaterialCost: 0,
      totalServiceCost: 0,
      totalFinishingServiceCost: 0,
      finalCostPerPiece: 0,
      batchFinalCost: 0,
      costPer1: 0,
      costPer100: 0,
      costPer500: 0,
      costPer1000: 0,
      costPerGivenQuantity: null,
      totalColorCost: 0,
      totalOrderCost: null,
      bomProfitPercent: 0,
      bomOverheadPercent: 0,
      bomNumberOfColors: null,
      bomColorRate: null,
      bomOrderQuantity: null,
      bomOrderQuantityUOM: "pieces",
      saleCost: 0,
      fgSelectorOpen: false,
      showCalculatedDimensions: false,
      ccStyleSelectorOpen: false,
      ccStyleSearch: "",
      fsSelectorOpen: false,
      cleaningUserData: false,
      bomFlowSection: "fg-selector-root",
      modal: {
        type: null,
        selectedId: null,
        mode: "add",
        lineId: null,
        draft: null,
        errors: {}
      },
      costCalculator: {
        styleId: "",
        L: "",
        W: "",
        H: "",
        ply: "",
        layers: [],
        otherLayers: [],
        services: [],
        finishingServices: [],
        additionalMaterials: [],
        additionalServices: [],
        removedServices: [],
        nextServiceKey: 1,
        styleFormulasOpen: false,
        ccNumberOfColors: null,
        ccColorRate: null,
        ccOrderQuantity: null,
        ccOrderQuantityUOM: "pieces"
      }
    };

    /* ==================================================
       IndexedDB persistence
       ================================================== */

    const IDB_NAME = "packaging-erp-db";
    const IDB_VERSION = 9;
    const IDB_COLLECTION_STORES = [
      "finishedGoods",
      "finishingServices",
      "rawMaterials",
      "otherRawMaterials",
      "materialRates",
      "otherMaterialRates",
      "services",
      "serviceRates",
      "formulas",
      "boms",
      "styles",
      "dimensions",
      "formulaVariables",
      "styleVariables",
      "styleFormulas",
      "serviceDimensions",
      "materialDimensions",
      "otherMaterialDimensions",
      "fixedVariables"
    ];

    let idb = null;
    let idbReady = false;
    let idbHydrating = false;
    let lastSavedAt = null;
    let persistEditorTimer = null;
    let persistPrefsTimer = null;
    let hydratedFromSeed = false;
    let userClearedAllData = false;
    let pendingCloudInit = false;
    let lastCloudUserId = null;
    let cloudUser = null;
    let cloudSyncTimer = null;
    let cloudReconcileInFlight = false;
    let suppressCloudPush = false;
    let lastReconciledUid = null;
    const QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION = "qtyFormulaFromMaterialDimensionsV1";
    const SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION = "serviceFormulaFromServiceDimensionsV1";
    let dataMigrations = {
      [QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION]: false,
      qtyFormulaFromMaterialDimensionsV1Report: null,
      [SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION]: false,
      serviceFormulaFromServiceDimensionsV1Report: null
    };
    let pendingQtyFormulaMigrationNotice = null;
    let pendingServiceFormulaMigrationNotice = null;

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
      if (storeName === "finishingServices") return finishingServices;
      if (storeName === "rawMaterials") return rawMaterials;
      if (storeName === "otherRawMaterials") return otherRawMaterials;
      if (storeName === "materialRates") return materialRates;
      if (storeName === "otherMaterialRates") return otherMaterialRates;
      if (storeName === "services") return services;
      if (storeName === "serviceRates") return serviceRates;
      if (storeName === "formulas") return formulas;
      if (storeName === "boms") return boms;
      if (storeName === "styles") return styles;
      if (storeName === "dimensions") return dimensions;
      if (storeName === "formulaVariables") return formulaVariables;
      if (storeName === "styleVariables") return styleVariables;
      if (storeName === "styleFormulas") return styleFormulas;
      if (storeName === "serviceDimensions") return serviceDimensions;
      if (storeName === "materialDimensions") return materialDimensions;
      if (storeName === "otherMaterialDimensions") return otherMaterialDimensions;
      if (storeName === "fixedVariables") return fixedVariables;
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
        selectedFinishingServiceId: state.selectedFinishingServiceId,
        currentBOM: state.currentBOM,
        bomMaterials: state.bomMaterials,
        bomOtherMaterials: state.bomOtherMaterials,
        bomServices: state.bomServices,
        bomAdditionalServices: state.bomAdditionalServices,
        bomFinishingServices: state.bomFinishingServices,
        bomProfitPercent: state.bomProfitPercent,
        bomOverheadPercent: state.bomOverheadPercent,
        bomNumberOfColors: state.bomNumberOfColors,
        bomColorRate: state.bomColorRate,
        bomOrderQuantity: state.bomOrderQuantity,
        bomOrderQuantityUOM: state.bomOrderQuantityUOM,
        costCalculator: snapshotData(state.costCalculator)
      });
    }

    function persistPrefsNow() {
      return putAppStateRecord({
        key: "prefs",
        currentPage: state.currentPage,
        searches: state.searches,
        formulaFilter: state.formulaFilter,
        materialRateFilter: state.materialRateFilter,
        materialRateSort: state.materialRateSort,
        otherMaterialRateFilter: state.otherMaterialRateFilter,
        otherMaterialRateSort: state.otherMaterialRateSort,
        serviceRateFilter: state.serviceRateFilter,
        serviceRateSort: state.serviceRateSort,
        bomListFilter: state.bomListFilter
      });
    }

    function persistMetaNow() {
      const stamp = (lastSavedAt || new Date()).toISOString();
      return putAppStateRecord({
        key: "meta",
        initialized: true,
        lastSavedAt: stamp,
        userClearedAllData: Boolean(userClearedAllData),
        hydratedFromSeed: Boolean(hydratedFromSeed),
        lastCloudUserId: lastCloudUserId || null
      });
    }

    function persistMigrationsNow() {
      return putAppStateRecord({
        key: "migrations",
        [QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION]: Boolean(dataMigrations[QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION]),
        qtyFormulaFromMaterialDimensionsV1Report: dataMigrations.qtyFormulaFromMaterialDimensionsV1Report || null,
        [SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION]: Boolean(dataMigrations[SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION]),
        serviceFormulaFromServiceDimensionsV1Report: dataMigrations.serviceFormulaFromServiceDimensionsV1Report || null
      });
    }

    function applyStoredMigrations(record) {
      if (!record) return;
      dataMigrations[QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION] = Boolean(record[QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION]);
      if (record.qtyFormulaFromMaterialDimensionsV1Report) {
        dataMigrations.qtyFormulaFromMaterialDimensionsV1Report = record.qtyFormulaFromMaterialDimensionsV1Report;
      }
      dataMigrations[SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION] = Boolean(record[SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION]);
      if (record.serviceFormulaFromServiceDimensionsV1Report) {
        dataMigrations.serviceFormulaFromServiceDimensionsV1Report = record.serviceFormulaFromServiceDimensionsV1Report;
      }
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
      if (!idbReady || idbHydrating || pendingCloudInit) return Promise.resolve();
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
      if (!idbReady || idbHydrating || pendingCloudInit) return;
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
      if (!idbReady || idbHydrating || pendingCloudInit) return;
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
        email: (user && user.email) || localStorage.getItem("firebaseUserEmail"),
        photoURL: (user && user.photoURL) || localStorage.getItem("firebaseUserPhotoURL") || ""
      };
    }

    function rememberCloudUser(user) {
      if (!user) return;
      cloudUser = user;
      localStorage.setItem("firebaseUserId", user.uid);
      localStorage.setItem("firebaseUserEmail", user.email || "");
      localStorage.setItem("firebaseUserPhotoURL", user.photoURL || "");
    }

    function forgetCloudUser() {
      cloudUser = null;
      lastReconciledUid = null;
      localStorage.removeItem("firebaseUserId");
      localStorage.removeItem("firebaseUserEmail");
      localStorage.removeItem("firebaseUserPhotoURL");
      // Do not reset userClearedAllData or hydratedFromSeed here. Clearing
      // those flags would let ensureSeed* refill an empty catalog on refresh.
    }

    function parseStamp(value) {
      const t = Date.parse(value);
      return Number.isFinite(t) ? t : 0;
    }

    function collectCloudBackupPayload() {
      return snapshotData({
        finishedGoods,
        finishingServices,
        rawMaterials,
        otherRawMaterials,
        materialRates,
        otherMaterialRates,
        services,
        serviceRates,
        formulas,
        formulaVariables,
        styles,
        styleVariables,
        styleFormulas,
        serviceDimensions,
        materialDimensions,
        otherMaterialDimensions,
        fixedVariables,
        dimensions,
        boms,
        sequences: {
          bomLineSeq,
          bomSeq,
          formulaSeq
        },
        editor: {
          selectedFinishedGoodId: state.selectedFinishedGoodId,
          selectedFinishingServiceId: state.selectedFinishingServiceId,
          currentBOM: state.currentBOM,
          bomMaterials: state.bomMaterials,
          bomOtherMaterials: state.bomOtherMaterials,
          bomServices: state.bomServices,
          bomAdditionalServices: state.bomAdditionalServices,
          bomFinishingServices: state.bomFinishingServices,
          bomProfitPercent: state.bomProfitPercent,
          bomOverheadPercent: state.bomOverheadPercent,
          bomNumberOfColors: state.bomNumberOfColors,
          bomColorRate: state.bomColorRate,
          bomOrderQuantity: state.bomOrderQuantity,
          bomOrderQuantityUOM: state.bomOrderQuantityUOM,
          costCalculator: snapshotData(state.costCalculator)
        },
        userClearedAllData: Boolean(userClearedAllData),
        hydratedFromSeed: Boolean(hydratedFromSeed),
        migrations: {
          [QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION]: Boolean(dataMigrations[QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION]),
          qtyFormulaFromMaterialDimensionsV1Report: dataMigrations.qtyFormulaFromMaterialDimensionsV1Report || null,
          [SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION]: Boolean(dataMigrations[SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION]),
          serviceFormulaFromServiceDimensionsV1Report: dataMigrations.serviceFormulaFromServiceDimensionsV1Report || null
        },
        syncTimestamp: new Date().toISOString()
      });
    }

    const EXCEL_EXPORT_SHEETS = [
      { name: "Finished Goods", key: "finishedGoods" },
      { name: "Finishing Services", key: "finishingServices" },
      { name: "Raw Materials", key: "rawMaterials" },
      { name: "Material Rates", key: "materialRates" },
      { name: "Material Dimensions", key: "materialDimensions" },
      { name: "Other Raw Materials", key: "otherRawMaterials" },
      { name: "Other Material Rates", key: "otherMaterialRates" },
      { name: "Other Material Dims", key: "otherMaterialDimensions" },
      { name: "Formulas", key: "formulas" },
      { name: "Formula Variables", key: "formulaVariables" },
      { name: "Services", key: "services" },
      { name: "Service Rates", key: "serviceRates" },
      { name: "Service Dimensions", key: "serviceDimensions" },
      { name: "Styles", key: "styles" },
      { name: "Style Formulas", key: "styleFormulas" },
      { name: "Style Variables", key: "styleVariables" },
      { name: "Dimensions", key: "dimensions" }
    ];

    function excelCellValue(value) {
      if (value === null || value === undefined) return "";
      if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") return value;
      try {
        return JSON.stringify(value);
      } catch (error) {
        return String(value);
      }
    }

    function flattenRecordForExcel(record) {
      if (!record || typeof record !== "object" || Array.isArray(record)) {
        return { value: excelCellValue(record) };
      }
      const row = {};
      Object.keys(record).forEach((key) => {
        const value = record[key];
        const isPlainObject = value && typeof value === "object" && !Array.isArray(value);
        const canFlatten = isPlainObject && Object.values(value).every((nested) =>
          nested == null || typeof nested === "number" || typeof nested === "boolean" || typeof nested === "string"
        );
        if (canFlatten) {
          Object.keys(value).forEach((nestedKey) => {
            row[key + "." + nestedKey] = excelCellValue(value[nestedKey]);
          });
          return;
        }
        row[key] = excelCellValue(value);
      });
      return row;
    }

    function rowsForExcelSheet(items) {
      if (!Array.isArray(items) || !items.length) return [];
      return items.map((item) => flattenRecordForExcel(item));
    }

    function appendExcelSheet(workbook, name, rows) {
      const sheet = rows.length
        ? XLSX.utils.json_to_sheet(rows)
        : XLSX.utils.aoa_to_sheet([["(no records)"]]);
      XLSX.utils.book_append_sheet(workbook, sheet, name.slice(0, 31));
    }

    function flattenBomLineRows(boms, lineKey) {
      const rows = [];
      (boms || []).forEach((bom) => {
        (bom[lineKey] || []).forEach((line, lineIndex) => {
          rows.push(flattenRecordForExcel({
            bomId: bom.id,
            bomNo: bom.bomNo,
            version: bom.version,
            status: bom.status,
            finishedGoodId: bom.finishedGoodId,
            lineIndex,
            ...line
          }));
        });
      });
      return rows;
    }

    function excelExportFilename(date) {
      const stamp = date instanceof Date ? date : new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return "packaging-erp-data-" +
        stamp.getFullYear() +
        pad(stamp.getMonth() + 1) +
        pad(stamp.getDate()) +
        "-" +
        pad(stamp.getHours()) +
        pad(stamp.getMinutes()) +
        pad(stamp.getSeconds()) +
        ".xlsx";
    }

    function buildExcelWorkbookFromPayload(payload) {
      const workbook = XLSX.utils.book_new();
      const data = payload || {};
      EXCEL_EXPORT_SHEETS.forEach((sheet) => {
        appendExcelSheet(workbook, sheet.name, rowsForExcelSheet(data[sheet.key]));
      });
      appendExcelSheet(workbook, "BOMs", rowsForExcelSheet(data.boms));
      appendExcelSheet(workbook, "BOM Materials", flattenBomLineRows(data.boms, "materials"));
      appendExcelSheet(workbook, "BOM Services", flattenBomLineRows(data.boms, "services"));
      appendExcelSheet(workbook, "BOM Finishing Services", flattenBomLineRows(data.boms, "finishingServiceLines"));
      const sequences = data.sequences || {};
      appendExcelSheet(workbook, "Sequences", [flattenRecordForExcel({
        bomSeq: sequences.bomSeq,
        formulaSeq: sequences.formulaSeq,
        bomLineSeq: sequences.bomLineSeq
      })]);
      return workbook;
    }

    function downloadAllDataAsExcel() {
      try {
        const payload = collectCloudBackupPayload();
        const filename = excelExportFilename(new Date());
        const workbook = buildExcelWorkbookFromPayload(payload);
        XLSX.writeFile(workbook, filename);
        showNotification("✓ Downloaded");
      } catch (error) {
        console.error("Excel export failed", error);
        showNotification("Excel export failed. Please try again.", "error");
      }
    }

    async function saveAllDataToIndexedDB() {
      if (!idbReady) return;
      await persistAllCollections();
      await persistSequencesNow();
      await persistEditorNow();
      await persistMetaNow();
      await persistMigrationsNow();
    }

    function applyCloudPayload(cloudData) {
      const cloudCleared = cloudData.userClearedAllData === true;
      const restoringSeed = cloudData.userClearedAllData === false;
      if (userClearedAllData && !restoringSeed && !cloudCleared) {
        return;
      }
      if (cloudCleared) userClearedAllData = true;
      else if (cloudData.userClearedAllData === false) userClearedAllData = false;
      if (typeof cloudData.hydratedFromSeed === "boolean") {
        hydratedFromSeed = cloudData.hydratedFromSeed;
      }
      replaceArrayContents(finishedGoods, cloudData.finishedGoods || []);
      replaceArrayContents(finishingServices, cloudData.finishingServices || []);
      replaceArrayContents(rawMaterials, cloudData.rawMaterials || []);
      replaceArrayContents(otherRawMaterials, cloudData.otherRawMaterials || []);
      replaceArrayContents(materialRates, cloudData.materialRates || []);
      replaceArrayContents(otherMaterialRates, cloudData.otherMaterialRates || []);
      replaceArrayContents(services, cloudData.services || []);
      replaceArrayContents(serviceRates, cloudData.serviceRates || []);
      replaceArrayContents(formulas, cloudData.formulas || []);
      replaceArrayContents(formulaVariables, cloudData.formulaVariables || []);
      replaceArrayContents(styles, cloudData.styles || []);
      replaceArrayContents(styleVariables, cloudData.styleVariables || []);
      replaceArrayContents(styleFormulas, cloudData.styleFormulas || []);
      replaceArrayContents(serviceDimensions, cloudData.serviceDimensions || []);
      replaceArrayContents(materialDimensions, cloudData.materialDimensions || []);
      replaceArrayContents(otherMaterialDimensions, cloudData.otherMaterialDimensions || []);
      replaceArrayContents(fixedVariables, cloudData.fixedVariables || []);
      replaceArrayContents(dimensions, cloudData.dimensions || []);
      replaceArrayContents(boms, cloudData.boms || []);
      if (cloudData.migrations) {
        applyStoredMigrations(cloudData.migrations);
      } else {
        dataMigrations[QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION] = false;
        dataMigrations[SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION] = false;
      }
      sanitizeNumericMasters();
      migrateQtyFormulaFromMaterialDimensions({ notify: true });
      migrateServiceFormulaFromServiceDimensions({ notify: true });
      const sequences = cloudData.sequences || {};
      if (Number.isFinite(sequences.bomLineSeq)) bomLineSeq = sequences.bomLineSeq;
      if (Number.isFinite(sequences.bomSeq)) bomSeq = sequences.bomSeq;
      if (Number.isFinite(sequences.formulaSeq)) formulaSeq = sequences.formulaSeq;
      const editor = cloudData.editor;
      if (editor) {
        state.selectedFinishedGoodId = editor.selectedFinishedGoodId || null;
        state.selectedFinishingServiceId = editor.selectedFinishingServiceId || (editor.currentBOM && editor.currentBOM.finishingServiceId) || null;
        state.currentBOM = editor.currentBOM || null;
        hydrateBomEditorMaterials(editor.bomMaterials, editor.bomOtherMaterials);
        state.bomServices = Array.isArray(editor.bomServices) ? editor.bomServices : [];
        state.bomAdditionalServices = Array.isArray(editor.bomAdditionalServices) ? editor.bomAdditionalServices : [];
        state.bomFinishingServices = Array.isArray(editor.bomFinishingServices) ? editor.bomFinishingServices : [];
        state.bomProfitPercent = storedBomPercent(editor.bomProfitPercent);
        state.bomOverheadPercent = storedBomPercent(editor.bomOverheadPercent);
        applyBomCostingExtras(editor);
        applyStoredCostCalculator(editor);
      }
      syncSequencesFromData();
      if (cloudCleared) {
        pendingCloudInit = false;
        hydratedFromSeed = false;
      } else if (!userClearedAllData) {
        ensureSeedStyleFormulas();
        ensureSeedServiceDimensions();
        ensureSeedMaterialDimensions();
        ensureSeedStyleWastageVariables();
        ensureSeedWindowLidSheetVariables();
        ensureCalculatedSheetAreaCatalog();
        ensureSeedNoOfColorVariable();
        ensureServiceRates();
        ensureMaterialRates();
        ensureOtherMaterialRates();
        syncSequencesFromData();
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
        state.bomOtherMaterials = [];
        state.bomServices = [];
        state.bomAdditionalServices = [];
        state.bomFinishingServices = [];
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

    function cloudAuthStatusMarkup(linked, user) {
      if (!linked) return "Not connected to cloud";
      const email = (user && (user.email || user.uid)) || "";
      const letter = escapeHtml((String(email).trim().charAt(0) || "?").toUpperCase());
      const photoURL = user && user.photoURL;
      const avatar = photoURL
        ? `<img class="cloud-auth-avatar-img" src="${escapeHtml(photoURL)}" alt="" referrerpolicy="no-referrer" onerror="this.hidden=true;var n=this.nextElementSibling;if(n)n.hidden=false;"><span class="cloud-auth-avatar-fallback" hidden>${letter}</span>`
        : `<span class="cloud-auth-avatar-fallback">${letter}</span>`;
      return `<span class="cloud-auth-identity"><span class="cloud-auth-avatar">${avatar}</span><span class="cloud-auth-copy">Signed in as: <strong class="cloud-auth-email">${escapeHtml(email)}</strong></span></span>`;
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
        statusDiv.className = linked ? "cloud-auth-status" : "stat-hint";
        statusDiv.style.marginTop = "8px";
        statusDiv.innerHTML = cloudAuthStatusMarkup(linked, user);
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
      if (!isCloudLinked() || suppressCloudPush || idbHydrating || pendingCloudInit) return;
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
      if (!isCloudLinked() || suppressCloudPush || idbHydrating || pendingCloudInit) return;
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
        pendingCloudInit = false;
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
        const switchedAccount = Boolean(lastCloudUserId && lastCloudUserId !== userId);

        if (!docSnap.exists()) {
          lastCloudUserId = userId;
          if (switchedAccount) {
            wipeWorkingDataInMemory();
            userClearedAllData = false;
            hydratedFromSeed = false;
          }
          pendingCloudInit = false;
          if (idbReady) await persistUserDataStores();
          await syncAllDataToCloud();
          return;
        }

        const cloudData = docSnap.data();

        if (pendingCloudInit) {
          lastCloudUserId = userId;
          await applyCloudData(cloudData, { notify: true });
          return;
        }

        if (switchedAccount) {
          lastCloudUserId = userId;
          await applyCloudData(cloudData, { notify: true });
          return;
        }

        if (cloudData.userClearedAllData === true) {
          lastCloudUserId = userId;
          await applyCloudData(cloudData, { notify: true });
          return;
        }

        if (userClearedAllData === true) {
          lastCloudUserId = userId;
          if (idbReady) await persistMetaNow();
          await syncAllDataToCloud();
          return;
        }

        if (!hydratedFromSeed && !catalogHasPersistedData()) {
          lastCloudUserId = userId;
          await applyCloudData(cloudData, { notify: true });
          return;
        }

        lastCloudUserId = userId;
        const cloudTime = parseStamp(cloudData.syncTimestamp);
        const localTime = lastSavedAt ? lastSavedAt.getTime() : 0;
        if (hydratedFromSeed || cloudTime > localTime + 1500) {
          await applyCloudData(cloudData, { notify: true });
        } else {
          await syncAllDataToCloud();
        }
        if (idbReady) await persistMetaNow();
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
      state.bomOtherMaterials.forEach((line) => {
        maxLineId = Math.max(maxLineId, Number(line.id) || 0);
      });
      state.bomServices.forEach((line) => {
        maxLineId = Math.max(maxLineId, Number(line.id) || 0);
      });
      (state.bomAdditionalServices || []).forEach((line) => {
        maxLineId = Math.max(maxLineId, Number(line.id) || 0);
      });
      (state.bomFinishingServices || []).forEach((line) => {
        maxLineId = Math.max(maxLineId, Number(line.id) || 0);
      });
      boms.forEach((record) => {
        (record.materials || []).forEach((line) => {
          maxLineId = Math.max(maxLineId, Number(line.id) || 0);
        });
        (record.otherMaterials || []).forEach((line) => {
          maxLineId = Math.max(maxLineId, Number(line.id) || 0);
        });
        (record.services || []).forEach((line) => {
          maxLineId = Math.max(maxLineId, Number(line.id) || 0);
        });
        (record.additionalServices || []).forEach((line) => {
          maxLineId = Math.max(maxLineId, Number(line.id) || 0);
        });
        (record.finishingServiceLines || []).forEach((line) => {
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
          pendingCloudInit = true;
          userClearedAllData = false;
          hydratedFromSeed = false;
          wipeWorkingDataInMemory();
          return { fromSeed: false, needsCloudCheck: true };
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
        applyStoredMigrations(await getAppStateRecord("migrations"));
        const qtyFormulaMigration = migrateQtyFormulaFromMaterialDimensions({ notify: true });
        const serviceFormulaMigration = migrateServiceFormulaFromServiceDimensions({ notify: true });
        if (idbReady && (!qtyFormulaMigration.skipped || !serviceFormulaMigration.skipped)) {
          await persistMigrationsNow();
          if (qtyFormulaMigration.migrated && qtyFormulaMigration.migrated.length) {
            await saveToIndexedDB("rawMaterials", rawMaterials);
          }
          if (serviceFormulaMigration.migrated && serviceFormulaMigration.migrated.length) {
            await saveToIndexedDB("serviceRates", serviceRates);
          }
        }
        userClearedAllData = Boolean(meta.userClearedAllData);
        hydratedFromSeed = Boolean(meta.hydratedFromSeed);
        lastCloudUserId = meta.lastCloudUserId || null;
        pendingCloudInit = false;

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
            state.selectedFinishingServiceId = editor.selectedFinishingServiceId || (editor.currentBOM && editor.currentBOM.finishingServiceId) || null;
            state.currentBOM = editor.currentBOM || null;
            hydrateBomEditorMaterials(editor.bomMaterials, editor.bomOtherMaterials);
            state.bomServices = Array.isArray(editor.bomServices) ? editor.bomServices : [];
            state.bomAdditionalServices = Array.isArray(editor.bomAdditionalServices) ? editor.bomAdditionalServices : [];
            state.bomFinishingServices = Array.isArray(editor.bomFinishingServices) ? editor.bomFinishingServices : [];
            state.bomProfitPercent = storedBomPercent(editor.bomProfitPercent);
            state.bomOverheadPercent = storedBomPercent(editor.bomOverheadPercent);
            applyBomCostingExtras(editor);
            applyStoredCostCalculator(editor);
          }

          syncSequencesFromData();
          if (!userClearedAllData) {
            const seededStyle = ensureSeedStyleFormulas();
            const seededServiceDims = ensureSeedServiceDimensions();
            const seededMaterialDims = ensureSeedMaterialDimensions();
            const seededWastage = ensureSeedStyleWastageVariables();
            const seededSheetVars = ensureSeedWindowLidSheetVariables();
            const seededSheetArea = ensureCalculatedSheetAreaCatalog();
            const seededNoOfColor = ensureSeedNoOfColorVariable();
            const seededServiceRates = ensureServiceRates();
            const seededMaterialRates = ensureMaterialRates();
            const seededOtherMaterialRates = ensureOtherMaterialRates();
            if (seededStyle || seededServiceDims || seededMaterialDims || seededWastage || seededSheetVars || seededSheetArea || seededNoOfColor || seededServiceRates || seededMaterialRates || seededOtherMaterialRates) {
              syncSequencesFromData();
              await persistAllCollections();
              await persistSequencesNow();
            }
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
            state.bomOtherMaterials = [];
            state.bomServices = [];
            state.bomAdditionalServices = [];
            state.bomFinishingServices = [];
          }

          const prefs = await getAppStateRecord("prefs");
          if (prefs) {
            if (prefs.searches) state.searches = { ...state.searches, ...prefs.searches };
            if (prefs.formulaFilter) state.formulaFilter = prefs.formulaFilter;
            if (prefs.materialRateFilter) state.materialRateFilter = prefs.materialRateFilter;
            if (prefs.materialRateSort) state.materialRateSort = prefs.materialRateSort;
            if (prefs.otherMaterialRateFilter) state.otherMaterialRateFilter = prefs.otherMaterialRateFilter;
            if (prefs.otherMaterialRateSort) state.otherMaterialRateSort = prefs.otherMaterialRateSort;
            if (prefs.serviceRateFilter) state.serviceRateFilter = prefs.serviceRateFilter;
            if (prefs.serviceRateSort) state.serviceRateSort = prefs.serviceRateSort;
            if (prefs.bomListFilter) state.bomListFilter = prefs.bomListFilter;
            if (prefs.currentPage && PAGE_META[prefs.currentPage]) state.currentPage = prefs.currentPage;
          }
        } catch (error) {
          console.error("Could not restore editor or preferences", error);
        }

        lastSavedAt = meta.lastSavedAt ? new Date(meta.lastSavedAt) : new Date();
        setSaveStatus(formatLastSavedRelative(), "saved");
        return { fromSeed: Boolean(hydratedFromSeed) };
      } finally {
        idbHydrating = false;
      }
    }

    function catalogHasPersistedData() {
      return IDB_COLLECTION_STORES.some((name) => (getCollectionArray(name) || []).length > 0);
    }

    function seedCatalogBlocked() {
      return userClearedAllData === true || pendingCloudInit || !hydratedFromSeed;
    }

    function ensureSeedStyleFormulas() {
      if (seedCatalogBlocked()) return false;
      const seeds = (SEED_DATA.formulas || []).filter((item) => item.type === "Style");
      let added = false;
      seeds.forEach((seed) => {
        if (getFormulaByCode(seed.code)) return;
        formulas.push({
          id: nextFormulaId(),
          code: seed.code,
          name: seed.name,
          type: "Style",
          purpose: null,
          description: seed.description,
          expression: seed.expression,
          serviceLength: Boolean(seed.serviceLength),
          serviceWidth: Boolean(seed.serviceWidth),
          coveredArea: Boolean(seed.coveredArea),
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

    function ensureSeedServiceDimensions() {
      if (seedCatalogBlocked()) return false;
      if (serviceDimensions.length) return false;
      let added = false;
      (SEED_DATA.serviceDimensions || []).forEach((seedLink) => {
        const service = getService(seedLink.serviceId);
        const dimension = getDimension(seedLink.dimensionId);
        const seedFormula = (SEED_DATA.formulas || []).find((item) => item.id === seedLink.formulaId);
        const formula = seedFormula ? getFormulaByCode(seedFormula.code) : getFormula(seedLink.formulaId);
        if (!service || !dimension || !formula) return;
        serviceDimensions.push({
          id: nextMasterId(serviceDimensions),
          serviceId: service.id,
          dimensionId: dimension.id,
          ply: normalizeStylePly(seedLink.ply, 3),
          formulaId: formula.id,
          createdAt: seedLink.createdAt || new Date().toISOString()
        });
        added = true;
      });
      if (added) {
        services.forEach((item) => syncServiceDimensionIds(item.id));
      }
      return added;
    }

    function ensureSeedMaterialDimensions() {
      if (seedCatalogBlocked()) return false;
      if (materialDimensions.length) return false;
      let added = false;
      (SEED_DATA.materialDimensions || []).forEach((seedLink) => {
        const material = getRawMaterial(seedLink.rawMaterialId);
        const dimension = getDimension(seedLink.dimensionId);
        const seedFormula = (SEED_DATA.formulas || []).find((item) => item.id === seedLink.formulaId);
        const formula = seedFormula ? getFormulaByCode(seedFormula.code) : getFormula(seedLink.formulaId);
        if (!material || !dimension || !formula) return;
        materialDimensions.push({
          id: nextMasterId(materialDimensions),
          rawMaterialId: material.id,
          dimensionId: dimension.id,
          ply: normalizeStylePly(seedLink.ply, 3),
          formulaId: formula.id,
          createdAt: seedLink.createdAt || new Date().toISOString()
        });
        added = true;
      });
      if (added) {
        rawMaterials.forEach((item) => syncMaterialDimensionIds(item.id));
      }
      return added;
    }

    function ensureSeedStyleWastageVariables() {
      if (seedCatalogBlocked()) return false;
      const style = styles.find((item) => item.id === 101) || findStyleByName("WINDOW LID");
      if (!style) return false;
      let added = false;
      [1, 2, 3].forEach((ply) => {
        if (findStyleVariable(style.id, "WASTAGE", ply)) return;
        const catalog = getFormulaVariableByCode("WASTAGE");
        styleVariables.push({
          id: nextMasterId(styleVariables),
          styleId: style.id,
          variableCode: "WASTAGE",
          ply,
          value: 5,
          unit: (catalog && catalog.unit) || "%"
        });
        added = true;
      });
      return added;
    }

    function ensureSeedWindowLidSheetVariables() {
      if (seedCatalogBlocked()) return false;
      const style = styles.find((item) => item.id === 101) || findStyleByName("WINDOW LID");
      if (!style) return false;
      let added = false;
      const catalogWidth = getFormulaVariableByCode("SHEET_WIDTH");
      const catalogLength = getFormulaVariableByCode("SHEET_LENGTH");
      [1, 2, 3].forEach((ply) => {
        const widthRow = findStyleVariable(style.id, "SHEET_WIDTH", ply);
        if (!widthRow) {
          styleVariables.push({
            id: nextMasterId(styleVariables),
            styleId: style.id,
            variableCode: "SHEET_WIDTH",
            ply,
            value: 50,
            unit: (catalogWidth && catalogWidth.unit) || "inch"
          });
          added = true;
        } else if (Number(widthRow.value) === 100 && String(widthRow.unit || "").toLowerCase() === "cm") {
          widthRow.value = 50;
          widthRow.unit = "inch";
          added = true;
        }
        const lengthRow = findStyleVariable(style.id, "SHEET_LENGTH", ply);
        if (!lengthRow) {
          styleVariables.push({
            id: nextMasterId(styleVariables),
            styleId: style.id,
            variableCode: "SHEET_LENGTH",
            ply,
            value: 50,
            unit: (catalogLength && catalogLength.unit) || "inch"
          });
          added = true;
        }
      });
      return added;
    }

    function ensureSeedNoOfColorVariable() {
      if (seedCatalogBlocked()) return false;
      if (getFormulaVariableByCode("NO_OF_COLOR")) return false;
      const seed = (SEED_DATA.formulaVariables || []).find((item) => item.code === "NO_OF_COLOR");
      formulaVariables.push({
        id: nextMasterId(formulaVariables),
        code: "NO_OF_COLOR",
        name: (seed && seed.name) || "Number of Colors",
        description: (seed && seed.description) || "Number of print colors entered by the user",
        dataType: "numeric",
        defaultValue: seed && seed.defaultValue != null ? seed.defaultValue : 1,
        unit: seed && seed.unit != null ? seed.unit : "",
        category: (seed && seed.category) || "Printing",
        isActive: seed ? seed.isActive !== false : true
      });
      return true;
    }

    function ensureCalculatedSheetAreaCatalog() {
      if (seedCatalogBlocked()) return false;
      const item = getFormulaVariableByCode("SHEET_AREA");
      if (!item) return false;
      let changed = false;
      if (item.defaultValue != null && item.defaultValue !== "") {
        item.defaultValue = null;
        changed = true;
      }
      const description = "Calculated as SHEET_WIDTH × SHEET_LENGTH";
      if (item.description !== description) {
        item.description = description;
        changed = true;
      }
      return changed;
    }

    function ensureServiceRates() {
      if (seedCatalogBlocked()) return false;
      let added = false;
      const now = "2026-01-01T00:00:00.000Z";
      services.forEach((service) => {
        if (getServiceRate(service.id)) {
          delete service.serviceRate;
          delete service.rateUOM;
          delete service.formulaId;
          return;
        }
        const seed = (SEED_DATA.serviceRates || []).find((row) => Number(row.serviceId) === service.id);
        const rate = seed ? seed.rate : Number(service.serviceRate);
        const rateUOM = seed ? seed.rateUOM : (service.rateUOM || "Rs./piece");
        const formulaId = seed ? seed.formulaId : service.formulaId;
        if (!Number.isFinite(Number(rate)) && !seed) {
          delete service.serviceRate;
          delete service.rateUOM;
          delete service.formulaId;
          return;
        }
        serviceRates.push({
          id: nextMasterId(serviceRates),
          serviceId: service.id,
          rate: roundTo(Number(rate) || 0, 2),
          rateUOM: normalizeServiceRateUom(rateUOM) || "Rs./piece",
          formulaId: normalizeFormulaBinding(formulaId),
          status: seed && seed.status ? seed.status : "Active",
          createdAt: (seed && seed.createdAt) || now,
          updatedAt: (seed && seed.updatedAt) || now
        });
        delete service.serviceRate;
        delete service.rateUOM;
        delete service.formulaId;
        added = true;
      });
      return added;
    }

    function ensureMaterialRates() {
      if (seedCatalogBlocked()) return false;
      let added = false;
      const now = "2026-01-01T00:00:00.000Z";
      rawMaterials.forEach((material) => {
        if (getMaterialRate(material.id)) {
          delete material.purchasingRate;
          delete material.rateUOM;
          return;
        }
        const seed = (SEED_DATA.materialRates || []).find((row) => Number(row.rawMaterialId) === material.id);
        const rate = seed ? seed.rate : Number(material.purchasingRate);
        const rateUOM = seed ? seed.rateUOM : (material.rateUOM || "Rs./kg");
        if (!Number.isFinite(Number(rate)) && !seed) {
          delete material.purchasingRate;
          delete material.rateUOM;
          return;
        }
        materialRates.push({
          id: nextMasterId(materialRates),
          rawMaterialId: material.id,
          rate: roundTo(Number(rate) || 0, 2),
          rateUOM: normalizeMaterialRateUom(rateUOM) || "Rs./kg",
          status: seed && seed.status ? seed.status : "Active",
          createdAt: (seed && seed.createdAt) || now,
          updatedAt: (seed && seed.updatedAt) || now
        });
        delete material.purchasingRate;
        delete material.rateUOM;
        added = true;
      });
      return added;
    }

    function ensureOtherMaterialRates() {
      if (seedCatalogBlocked()) return false;
      let added = false;
      const now = "2026-01-01T00:00:00.000Z";
      otherRawMaterials.forEach((material) => {
        if (getOtherMaterialRate(material.id)) {
          delete material.purchasingRate;
          delete material.rateUOM;
          return;
        }
        const seed = (SEED_DATA.otherMaterialRates || []).find((row) => Number(row.otherRawMaterialId) === material.id);
        const rate = seed ? seed.rate : Number(material.purchasingRate);
        const rateUOM = seed ? seed.rateUOM : (material.rateUOM || "Rs./kg");
        if (!Number.isFinite(Number(rate)) && !seed) {
          delete material.purchasingRate;
          delete material.rateUOM;
          return;
        }
        otherMaterialRates.push({
          id: nextMasterId(otherMaterialRates),
          otherRawMaterialId: material.id,
          rate: roundTo(Number(rate) || 0, 2),
          rateUOM: normalizeMaterialRateUom(rateUOM) || "Rs./kg",
          status: seed && seed.status ? seed.status : "Active",
          createdAt: (seed && seed.createdAt) || now,
          updatedAt: (seed && seed.updatedAt) || now
        });
        delete material.purchasingRate;
        delete material.rateUOM;
        added = true;
      });
      return added;
    }

    function resetSearchAndFilterState() {
      state.searches = {
        finishedGoods: "",
        rawMaterials: "",
        otherRawMaterials: "",
        materialRates: "",
        otherMaterialRates: "",
        services: "",
        serviceRates: "",
        style: "",
        formulaVariables: "",
        dimensions: "",
        formulas: "",
        bomFinishedGood: "",
        bomFinishingService: "",
        boms: ""
      };
      state.formulaFilter = "all";
      state.materialRateFilter = "all";
      state.materialRateSort = "name";
      state.otherMaterialRateFilter = "all";
      state.otherMaterialRateSort = "name";
      state.serviceRateFilter = "all";
      state.serviceRateSort = "name";
      state.bomListFilter = "all";
    }

    function wipeWorkingDataInMemory() {
      IDB_COLLECTION_STORES.forEach((name) => {
        replaceArrayContents(getCollectionArray(name), []);
      });
      sanitizeNumericMasters();
      dataMigrations[QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION] = false;
      dataMigrations.qtyFormulaFromMaterialDimensionsV1Report = null;
      dataMigrations[SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION] = false;
      dataMigrations.serviceFormulaFromServiceDimensionsV1Report = null;
      pendingQtyFormulaMigrationNotice = null;
      pendingServiceFormulaMigrationNotice = null;
      resetBomEditor({ keepModal: true, skipPersist: true });
      state.costCalculator = defaultCostCalculatorState();
      bomLineSeq = 1;
      bomSeq = 1;
      formulaSeq = 1;
      resetSearchAndFilterState();
    }

    function applySeedDataInMemory() {
      replaceArrayContents(finishedGoods, snapshotData(SEED_DATA.finishedGoods));
      replaceArrayContents(finishingServices, snapshotData(SEED_DATA.finishingServices));
      replaceArrayContents(rawMaterials, snapshotData(SEED_DATA.rawMaterials));
      replaceArrayContents(otherRawMaterials, snapshotData(SEED_DATA.otherRawMaterials));
      replaceArrayContents(materialRates, snapshotData(SEED_DATA.materialRates));
      replaceArrayContents(otherMaterialRates, snapshotData(SEED_DATA.otherMaterialRates));
      replaceArrayContents(services, snapshotData(SEED_DATA.services));
      replaceArrayContents(serviceRates, snapshotData(SEED_DATA.serviceRates));
      replaceArrayContents(formulas, snapshotData(SEED_DATA.formulas));
      replaceArrayContents(boms, snapshotData(SEED_DATA.boms));
      replaceArrayContents(styles, snapshotData(SEED_DATA.styles));
      replaceArrayContents(dimensions, snapshotData(SEED_DATA.dimensions));
      replaceArrayContents(formulaVariables, snapshotData(SEED_DATA.formulaVariables));
      replaceArrayContents(styleVariables, snapshotData(SEED_DATA.styleVariables));
      replaceArrayContents(styleFormulas, snapshotData(SEED_DATA.styleFormulas));
      replaceArrayContents(serviceDimensions, snapshotData(SEED_DATA.serviceDimensions));
      replaceArrayContents(materialDimensions, snapshotData(SEED_DATA.materialDimensions));
      replaceArrayContents(otherMaterialDimensions, snapshotData(SEED_DATA.otherMaterialDimensions));
      replaceArrayContents(fixedVariables, snapshotData(SEED_DATA.fixedVariables));
      sanitizeNumericMasters();
      migrateQtyFormulaFromMaterialDimensions({ notify: false });
      migrateServiceFormulaFromServiceDimensions({ notify: false });
      resetBomEditor({ skipPersist: true });
      state.costCalculator = defaultCostCalculatorState();
      bomLineSeq = 1;
      bomSeq = 1;
      formulaSeq = formulas.reduce((max, item) => Math.max(max, item.id), 300) + 1;
      resetSearchAndFilterState();
      userClearedAllData = false;
      pendingCloudInit = false;
      hydratedFromSeed = true;
    }

    async function initializeWithSeedData() {
      applySeedDataInMemory();
      if (!idbReady) return;
      setSaveStatus("Saving...", "saving");
      await persistAllCollections();
      await persistSequencesNow();
      await persistEditorNow();
      await persistPrefsNow();
      lastSavedAt = new Date();
      await persistMetaNow();
      await persistMigrationsNow();
      setSaveStatus("✓ Saved", "saved");
    }

    async function resetToSeedData() {
      try {
        await initializeWithSeedData();
        await syncAllDataToCloud();
      } catch (error) {
        console.error("Failed to save offline data", error);
        setSaveStatus("Save failed", "error");
        showNotification("Failed to save offline data", "error");
      }
    }

    function snapshotUserDataState() {
      const collections = {};
      IDB_COLLECTION_STORES.forEach((name) => {
        collections[name] = snapshotData(getCollectionArray(name));
      });
      return {
        collections,
        userClearedAllData,
        hydratedFromSeed,
        migrations: snapshotData(dataMigrations),
        bomLineSeq,
        bomSeq,
        formulaSeq,
        selectedFinishedGoodId: state.selectedFinishedGoodId,
        selectedFinishingServiceId: state.selectedFinishingServiceId,
        currentBOM: snapshotData(state.currentBOM),
        bomMaterials: snapshotData(state.bomMaterials),
        bomOtherMaterials: snapshotData(state.bomOtherMaterials),
        bomServices: snapshotData(state.bomServices),
        bomAdditionalServices: snapshotData(state.bomAdditionalServices),
        bomFinishingServices: snapshotData(state.bomFinishingServices),
        bomStyleResults: snapshotData(state.bomStyleResults),
        totalMaterialCost: state.totalMaterialCost,
        totalOtherMaterialCost: state.totalOtherMaterialCost,
        totalServiceCost: state.totalServiceCost,
        totalFinishingServiceCost: state.totalFinishingServiceCost,
        finalCostPerPiece: state.finalCostPerPiece,
        batchFinalCost: state.batchFinalCost,
        costPer1: state.costPer1,
        costPer100: state.costPer100,
        costPer500: state.costPer500,
        costPer1000: state.costPer1000,
        costPerGivenQuantity: state.costPerGivenQuantity,
        totalColorCost: state.totalColorCost,
        totalOrderCost: state.totalOrderCost,
        bomProfitPercent: state.bomProfitPercent,
        bomOverheadPercent: state.bomOverheadPercent,
        bomNumberOfColors: state.bomNumberOfColors,
        bomColorRate: state.bomColorRate,
        bomOrderQuantity: state.bomOrderQuantity,
        bomOrderQuantityUOM: state.bomOrderQuantityUOM,
        saleCost: state.saleCost,
        searches: snapshotData(state.searches),
        formulaFilter: state.formulaFilter,
        materialRateFilter: state.materialRateFilter,
        materialRateSort: state.materialRateSort,
        otherMaterialRateFilter: state.otherMaterialRateFilter,
        otherMaterialRateSort: state.otherMaterialRateSort,
        serviceRateFilter: state.serviceRateFilter,
        serviceRateSort: state.serviceRateSort,
        bomListFilter: state.bomListFilter,
        costCalculator: snapshotData(state.costCalculator)
      };
    }

    function restoreUserDataState(snap) {
      if (!snap) return;
      if (snap.collections) {
        IDB_COLLECTION_STORES.forEach((name) => {
          replaceArrayContents(getCollectionArray(name), snap.collections[name] || []);
        });
      } else {
        replaceArrayContents(finishedGoods, snap.finishedGoods);
        replaceArrayContents(finishingServices, snap.finishingServices || []);
        replaceArrayContents(rawMaterials, snap.rawMaterials);
        replaceArrayContents(otherRawMaterials, snap.otherRawMaterials || []);
        replaceArrayContents(materialRates, snap.materialRates);
        replaceArrayContents(otherMaterialRates, snap.otherMaterialRates || []);
        replaceArrayContents(services, snap.services);
        replaceArrayContents(serviceRates, snap.serviceRates);
        replaceArrayContents(boms, snap.boms);
        replaceArrayContents(serviceDimensions, snap.serviceDimensions);
        replaceArrayContents(materialDimensions, snap.materialDimensions);
        replaceArrayContents(otherMaterialDimensions, snap.otherMaterialDimensions || []);
      }
      if (typeof snap.userClearedAllData === "boolean") userClearedAllData = snap.userClearedAllData;
      if (typeof snap.hydratedFromSeed === "boolean") hydratedFromSeed = snap.hydratedFromSeed;
      bomLineSeq = snap.bomLineSeq;
      bomSeq = snap.bomSeq;
      if (Number.isFinite(snap.formulaSeq)) formulaSeq = snap.formulaSeq;
      state.selectedFinishedGoodId = snap.selectedFinishedGoodId;
      state.selectedFinishingServiceId = snap.selectedFinishingServiceId != null
        ? snap.selectedFinishingServiceId
        : (snap.currentBOM && snap.currentBOM.finishingServiceId) || null;
      state.currentBOM = snap.currentBOM;
      hydrateBomEditorMaterials(snap.bomMaterials, snap.bomOtherMaterials);
      state.bomServices = Array.isArray(snap.bomServices) ? snap.bomServices : [];
      state.bomAdditionalServices = Array.isArray(snap.bomAdditionalServices) ? snap.bomAdditionalServices : [];
      state.bomFinishingServices = Array.isArray(snap.bomFinishingServices) ? snap.bomFinishingServices : [];
      state.bomStyleResults = Array.isArray(snap.bomStyleResults) ? snap.bomStyleResults : [];
      state.totalMaterialCost = snap.totalMaterialCost;
      state.totalOtherMaterialCost = snap.totalOtherMaterialCost;
      state.totalServiceCost = snap.totalServiceCost;
      state.totalFinishingServiceCost = Number.isFinite(Number(snap.totalFinishingServiceCost))
        ? Number(snap.totalFinishingServiceCost)
        : 0;
      state.finalCostPerPiece = snap.finalCostPerPiece;
      state.batchFinalCost = Number.isFinite(Number(snap.batchFinalCost)) ? Number(snap.batchFinalCost) : 0;
      state.costPer1 = Number.isFinite(Number(snap.costPer1)) ? Number(snap.costPer1) : 0;
      state.costPer100 = snap.costPer100;
      state.costPer500 = snap.costPer500;
      state.costPer1000 = snap.costPer1000;
      state.costPerGivenQuantity = snap.costPerGivenQuantity == null || snap.costPerGivenQuantity === ""
        ? null
        : Number(snap.costPerGivenQuantity);
      state.bomProfitPercent = storedBomPercent(snap.bomProfitPercent);
      state.bomOverheadPercent = storedBomPercent(snap.bomOverheadPercent);
      applyBomCostingExtras(snap);
      state.totalColorCost = Number.isFinite(Number(snap.totalColorCost)) ? Number(snap.totalColorCost) : 0;
      state.totalOrderCost = snap.totalOrderCost == null || snap.totalOrderCost === ""
        ? null
        : Number(snap.totalOrderCost);
      state.saleCost = snap.saleCost;
      if (snap.searches) state.searches = snap.searches;
      if (snap.formulaFilter) state.formulaFilter = snap.formulaFilter;
      state.materialRateFilter = snap.materialRateFilter;
      state.materialRateSort = snap.materialRateSort;
      if (snap.otherMaterialRateFilter) state.otherMaterialRateFilter = snap.otherMaterialRateFilter;
      if (snap.otherMaterialRateSort) state.otherMaterialRateSort = snap.otherMaterialRateSort;
      state.serviceRateFilter = snap.serviceRateFilter;
      state.serviceRateSort = snap.serviceRateSort;
      state.bomListFilter = snap.bomListFilter;
      applyStoredCostCalculator(snap);
      sanitizeNumericMasters();
      applyStoredMigrations(snap.migrations);
      migrateQtyFormulaFromMaterialDimensions({ notify: false });
      migrateServiceFormulaFromServiceDimensions({ notify: false });
    }

    function applyCleanUserDataInMemory() {
      wipeWorkingDataInMemory();
      userClearedAllData = true;
      pendingCloudInit = false;
      hydratedFromSeed = false;
    }

    function setCleanUserDataBusy(busy) {
      state.cleaningUserData = Boolean(busy);
      const dashBtn = document.getElementById("btn-clean-user-data");
      if (dashBtn) {
        dashBtn.disabled = busy;
        dashBtn.setAttribute("aria-busy", busy ? "true" : "false");
        dashBtn.textContent = busy ? "Cleaning..." : "Clean My Data";
      }
      if (state.modal && state.modal.entity === "user-data") {
        const confirmBtn = document.getElementById("btn-confirm-master-delete");
        if (confirmBtn) {
          confirmBtn.disabled = busy;
          confirmBtn.setAttribute("aria-busy", busy ? "true" : "false");
          confirmBtn.textContent = busy ? "Cleaning..." : "Clean My Data";
        }
        document.querySelectorAll("#modal-dialog [data-modal-close]").forEach((btn) => {
          btn.disabled = busy;
        });
      }
    }

    function refreshViewsAfterUserDataClean() {
      try {
        renderDashboard();
        renderFinishedGoods();
        renderRawMaterials();
        renderRawMaterialRates();
        renderOtherRawMaterials();
        renderOtherRawMaterialRates();
        renderServices();
        renderServiceRates();
        renderBomList();
        renderBOMPage();
        renderCostCalculator();
        renderFormulas();
        renderFormulaVariables();
        renderDimensions();
        renderStyles();
        refreshIcons();
      } catch (error) {
        console.error("Failed to refresh views after clean", error);
      }
    }

    async function persistUserDataStores() {
      await persistAllCollections();
      await persistSequencesNow();
      await persistEditorNow();
      await persistPrefsNow();
      await persistMetaNow();
      await persistMigrationsNow();
    }

    async function deleteUserDataFromCloud() {
      const userId = getCurrentUser().uid;
      if (!userId) return { ok: false, error: "Not signed in" };
      if (!navigator.onLine) return { ok: false, error: "offline" };
      try {
        const payload = collectCloudBackupPayload();
        await setDoc(doc(db, "users", userId, "data", "backup"), payload);
        localStorage.setItem("lastSyncTime", payload.syncTimestamp);
        updateSyncStatus("Synced " + new Date(payload.syncTimestamp).toLocaleTimeString(), "success");
        return { ok: true };
      } catch (error) {
        console.error("Cloud clean error:", error);
        return { ok: false, error: error.message || "Cloud delete failed" };
      }
    }

    async function cleanUserData() {
      if (state.cleaningUserData) return;

      setCleanUserDataBusy(true);
      const previous = snapshotUserDataState();
      let localSaved = false;
      const linked = isCloudLinked();
      suppressCloudPush = true;

      try {
        applyCleanUserDataInMemory();

        if (idbReady) {
          try {
            setSaveStatus("Saving...", "saving");
            await persistUserDataStores();
            markSaved();
            localSaved = true;
          } catch (error) {
            console.error("IndexedDB clean failed", error);
            restoreUserDataState(previous);
            try {
              await persistUserDataStores();
            } catch (rollbackError) {
              console.error("IndexedDB clean rollback failed", rollbackError);
            }
            setSaveStatus("Save failed", "error");
            showNotification("Something went wrong clearing your data. Please try again.", "error");
            return;
          }
        } else {
          localSaved = true;
        }

        if (localSaved && linked) {
          const cloud = await deleteUserDataFromCloud();
          if (!cloud.ok) {
            restoreUserDataState(previous);
            if (idbReady) {
              try {
                await persistUserDataStores();
                markSaved();
              } catch (rollbackError) {
                console.error("IndexedDB clean rollback failed", rollbackError);
              }
            }
            const offline = cloud.error === "offline";
            showNotification(
              offline
                ? "Could not sync to cloud while offline. Data was not cleared. Try again when you're online."
                : "Failed to sync to cloud. Data was not cleared. Try again.",
              "error"
            );
            return;
          }
          showNotification("All data has been cleared and synced to cloud. Add your formulas, dimensions, and styles to begin setup.");
        } else if (localSaved) {
          showNotification("All data has been cleared. Add your formulas, dimensions, and styles to begin setup.");
        }
      } catch (error) {
        console.error("Clean user data failed", error);
        restoreUserDataState(previous);
        showNotification("Something went wrong clearing your data. Please try again.", "error");
      } finally {
        suppressCloudPush = false;
        clearTimeout(persistEditorTimer);
        clearTimeout(persistPrefsTimer);
        state.cleaningUserData = false;
        closeModal();
        setCleanUserDataBusy(false);
        navigateTo("dashboard");
        refreshViewsAfterUserDataClean();
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

    function fixedFormulaMark(formula, description) {
      return `<span class="formula-src" title="${escapeHtml(description)}">(Fixed: ${escapeHtml(formula)})</span>`;
    }

    function labeledFixedFormula(label, formula, description) {
      return `<span>${escapeHtml(label)} ${fixedFormulaMark(formula, description)}</span>`;
    }

    function plyLayerMappingHint() {
      return `<p class="stat-hint" style="margin:8px 0 0;">Fixed ply mapping: 1 Ply → Single Layer · 2 Ply → Top Liner / Bottom Liner · 3 Ply → Top Liner / Bottom Liner / Inner Liner</p>`;
    }

    function renderFixedVariableChip(item) {
      return `<button type="button" class="chip" data-insert="${escapeHtml(item.code)}" title="${escapeHtml(item.description || item.code)}">${escapeHtml(item.code)} <span class="formula-src">Fixed</span></button>`;
    }

    const DECIMAL_RULES = {
      dimension: { decimals: 2, min: 0.1, max: 99999, label: "Dimension" },
      rate: { decimals: 2, min: 0.01, max: 999999.99, label: "Rate", decimalError: "Rate must have maximum 2 decimal places" },
      quantity: { decimals: 4, min: 0.0001, max: 999999, label: "Quantity" },
      wastage: { decimals: 2, min: 0, max: 100, label: "Wastage" },
      percent: { decimals: 2, min: 0, max: 100, label: "Percent" },
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

    function storedBomPercent(value) {
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0) return 0;
      return roundTo(n, 2);
    }

    function storedBomOptionalNumber(value, extras) {
      if (value === "" || value == null) return null;
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0) return null;
      const places = extras && extras.places != null ? extras.places : 2;
      return roundTo(n, places);
    }

    function isCostEstimateFinishedGood(finishedGood) {
      return Boolean(finishedGood) && Number(finishedGood.id) === 0 && finishedGood.product === "Cost Estimate";
    }

    function resolveNumberOfColors(finishedGood) {
      // Number of Colors comes ONLY from the field on the screen being used:
      // Cost Calculator estimates read the calculator's own field; BOM costing reads the BOM field.
      // No cross-screen fallback and no style/Variable Master defaults.
      // Returns null when the field is empty ("value not entered").
      return isCostEstimateFinishedGood(finishedGood)
        ? storedBomColorCount(state.costCalculator && state.costCalculator.ccNumberOfColors)
        : storedBomColorCount(state.bomNumberOfColors);
    }

    function storedBomColorCount(value) {
      if (value === "" || value == null) return null;
      const n = Number(value);
      if (!Number.isFinite(n) || n < 1 || n > 8) return null;
      return Math.round(n);
    }

    function storedBomOrderQuantityUom(value) {
      const uom = String(value || "").trim();
      return FINISHED_GOOD_UOMS.includes(uom) ? uom : "pieces";
    }

    function applyBomCostingExtras(source) {
      const src = source || {};
      state.bomNumberOfColors = storedBomColorCount(src.bomNumberOfColors);
      state.bomColorRate = storedBomOptionalNumber(src.bomColorRate);
      state.bomOrderQuantity = storedBomOptionalNumber(src.bomOrderQuantity, { places: 4 });
      state.bomOrderQuantityUOM = storedBomOrderQuantityUom(src.bomOrderQuantityUOM);
    }

    function resetBomCostingExtras() {
      applyBomCostingExtras({});
      state.totalColorCost = 0;
      state.totalOrderCost = null;
    }

    function hasBomColorCost() {
      const colors = Number(state.bomNumberOfColors);
      const rate = Number(state.bomColorRate);
      return Number.isFinite(colors) && colors > 0 && Number.isFinite(rate) && rate > 0;
    }

    function hasBomOrderQuantity() {
      const qty = Number(state.bomOrderQuantity);
      return Number.isFinite(qty) && qty > 0;
    }

    const STEP6_REQUIRED_QTY = 1000;

    function formatStep6RequiredQty() {
      return formatQty(STEP6_REQUIRED_QTY);
    }

    function formatStep6LineTotal(costPerPiece, hasError) {
      if (hasError) return `<span class="calc-error-cost">Error</span>`;
      const cost = Number(costPerPiece);
      if (!Number.isFinite(cost)) return "—";
      return formatRupees(roundTo(cost * STEP6_REQUIRED_QTY, 2));
    }

    function computeExcelFinalCostPack(materialPerPiece, servicePerPiece, finishingPerPiece, orderQuantity) {
      const material = Number(materialPerPiece);
      const service = Number(servicePerPiece);
      const finishing = Number(finishingPerPiece);
      const mat = Number.isFinite(material) ? material : 0;
      const svc = Number.isFinite(service) ? service : 0;
      const fin = Number.isFinite(finishing) ? finishing : 0;
      const serviceTotal = svc * STEP6_REQUIRED_QTY;
      const costN = (n) => roundTo((mat * n + serviceTotal + fin * n) / n, 2);
      const qty = Number(orderQuantity);
      const hasQty = Number.isFinite(qty) && qty > 0;
      const given = hasQty ? costN(qty) : null;
      return {
        per1: roundTo(mat + svc + fin, 2),
        per100: costN(100),
        per500: costN(500),
        per1000: costN(1000),
        given,
        batchFinal: hasQty
          ? roundTo(mat * qty + serviceTotal + fin * qty, 2)
          : roundTo((mat + svc + fin) * STEP6_REQUIRED_QTY, 2)
      };
    }

    function formatPackGivenCost(value, hasError, formatter) {
      if (hasError) return `<span class="calc-error-cost">Error</span>`;
      if (value == null || !Number.isFinite(Number(value))) return "—";
      const format = formatter || formatRupees;
      return format(Number(value));
    }

    function renderStep6SubtotalFooter(costPerPiece, hasError) {
      const pieceSubtotal = hasError
        ? `<span class="calc-error-cost">Error</span>`
        : formatRupees(Number(costPerPiece) || 0);
      return `
        <tfoot>
          <tr class="cc-subtotal-row">
            <th colspan="6">Subtotal</th>
            <td class="cc-layer-num">${pieceSubtotal}</td>
            <td class="cc-layer-num">${formatStep6LineTotal(costPerPiece, hasError)}</td>
            <td></td>
          </tr>
        </tfoot>
      `;
    }

    function formatBomRequiredQtyFromOrder() {
      if (!hasBomOrderQuantity()) return "—";
      return formatQty(Number(state.bomOrderQuantity));
    }

    function formatCostTimesQuantity(costPerPiece, quantity, hasError) {
      if (hasError) return `<span class="calc-error-cost">Error</span>`;
      const qty = Number(quantity);
      if (!Number.isFinite(qty) || qty <= 0) return "—";
      const cost = Number(costPerPiece);
      if (!Number.isFinite(cost)) return "—";
      return formatRupees(roundTo(cost * qty, 2));
    }

    function formatBomLineOrderTotal(costPerPiece, hasError) {
      return formatCostTimesQuantity(costPerPiece, state.bomOrderQuantity, hasError);
    }

    function renderBomStepSubtotalFooter(costPerPiece, hasError) {
      const pieceSubtotal = hasError
        ? `<span class="calc-error-cost">Error</span>`
        : formatRupees(Number(costPerPiece) || 0);
      return `
        <tfoot>
          <tr class="cc-subtotal-row">
            <th colspan="6">Subtotal</th>
            <td class="cc-layer-num">${pieceSubtotal}</td>
            <td class="cc-layer-num">${formatBomLineOrderTotal(costPerPiece, hasError)}</td>
            <td></td>
          </tr>
        </tfoot>
      `;
    }

    function renderFormulaNameWithQty(formulaLabel, qtyDisplay, helpHtml) {
      return `
        <div class="formula-stack">
          <span class="formula-cell">
            ${escapeHtml(formulaLabel)}
            ${helpHtml || ""}
          </span>
          <div class="stat-hint">${qtyDisplay}</div>
        </div>
      `;
    }

    function hasCostCalculatorColorCost() {
      const colors = Number(state.costCalculator && state.costCalculator.ccNumberOfColors);
      const rate = Number(state.costCalculator && state.costCalculator.ccColorRate);
      return Number.isFinite(colors) && colors > 0 && Number.isFinite(rate) && rate > 0;
    }

    function hasCostCalculatorOrderQuantity() {
      const qty = Number(state.costCalculator && state.costCalculator.ccOrderQuantity);
      return Number.isFinite(qty) && qty > 0;
    }

    function finishedGoodUomOptions(selected) {
      return FINISHED_GOOD_UOMS.map((uom) => `
        <option value="${escapeHtml(uom)}" ${uom === selected ? "selected" : ""}>${escapeHtml(uom)}</option>
      `).join("");
    }

    function bomColorCountOptions(selected) {
      const current = selected == null || selected === "" ? "" : String(selected);
      return `<option value="">None</option>` + [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `
        <option value="${n}" ${current === String(n) ? "selected" : ""}>${n}</option>
      `).join("");
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
        item.dimensions.L = roundTo(item.dimensions?.L, 2);
        item.dimensions.W = roundTo(item.dimensions?.W, 2);
        item.dimensions.H = roundTo(item.dimensions?.H, 2);
        delete item.material;
        item.displayName = formatFinishedGoodDisplayName(item);
      });
      finishingServices.forEach((item) => {
        if (!item.dimensions) return;
        item.dimensions.L = roundTo(item.dimensions?.L, 2);
        item.dimensions.W = roundTo(item.dimensions?.W, 2);
        item.dimensions.H = roundTo(item.dimensions?.H, 2);
        item.displayName = formatFinishedGoodDisplayName(item);
      });
      rawMaterials.forEach((item) => {
        if (item.gsm != null && item.gsm !== "") item.gsm = roundTo(item.gsm, 1);
        item.qtyFormulaId = normalizeFormulaBinding(item.qtyFormulaId);
        item.dimensionIds = normalizeDimensionIds(item.dimensionIds);
        delete item.rateFormulaId;
      });
      otherRawMaterials.forEach((item) => {
        if (item.gsm != null && item.gsm !== "") item.gsm = roundTo(item.gsm, 1);
        item.qtyFormulaId = normalizeFormulaBinding(item.qtyFormulaId);
        item.dimensionIds = normalizeDimensionIds(item.dimensionIds);
        delete item.rateFormulaId;
      });
      materialRates.forEach((item) => {
        item.rate = roundTo(item.rate, 2);
        item.rateUOM = normalizeMaterialRateUom(item.rateUOM) || item.rateUOM;
        item.formulaId = normalizeFormulaBinding(item.formulaId);
        if (!item.status) item.status = "Active";
      });
      otherMaterialRates.forEach((item) => {
        item.rate = roundTo(item.rate, 2);
        item.rateUOM = normalizeMaterialRateUom(item.rateUOM) || item.rateUOM;
        item.formulaId = normalizeFormulaBinding(item.formulaId);
        if (!item.status) item.status = "Active";
      });
      services.forEach((item) => {
        item.dimensionIds = normalizeDimensionIds(item.dimensionIds);
        item.categories = normalizeServiceCategories(item.categories);
        delete item.serviceRate;
        delete item.rateUOM;
        delete item.formulaId;
      });
      serviceRates.forEach((item) => {
        item.rate = roundTo(item.rate, 2);
        item.formulaId = normalizeFormulaBinding(item.formulaId);
        item.rateUOM = normalizeServiceRateUom(item.rateUOM) || item.rateUOM;
        if (!item.status) item.status = "Active";
      });
      formulas.forEach((item) => {
        if (item.type === "Style") {
          item.purpose = null;
          return;
        }
        if (item.purpose === undefined) {
          const seed = (SEED_DATA.formulas || []).find((row) => row.code === item.code);
          item.purpose = seed ? seed.purpose : null;
        }
      });
      styleVariables.forEach((item) => {
        if (item.value != null && item.value !== "") item.value = roundTo(item.value, 4);
        item.ply = normalizeStylePly(item.ply, 3);
      });
      materialDimensions.forEach((item) => {
        item.ply = normalizeStylePly(item.ply, 3);
        delete item.rate;
        delete item.purchasingRate;
        delete item.serviceRate;
      });
      otherMaterialDimensions.forEach((item) => {
        item.ply = normalizeStylePly(item.ply, 3);
        delete item.rate;
        delete item.purchasingRate;
        delete item.serviceRate;
      });
      serviceDimensions.forEach((item) => {
        item.ply = normalizeStylePly(item.ply, 3);
        delete item.rate;
        delete item.purchasingRate;
        delete item.serviceRate;
      });
      formulaVariables.forEach((item) => {
        if (item.code === "SHEET_AREA") {
          item.defaultValue = null;
          item.description = item.description || "Calculated as SHEET_WIDTH × SHEET_LENGTH";
          return;
        }
        if (item.dataType === "numeric" && item.defaultValue != null && item.defaultValue !== "") {
          const n = Number(item.defaultValue);
          if (Number.isFinite(n)) item.defaultValue = roundTo(n, 8);
        }
      });
      ensureFixedVariables();
    }

    function migrateQtyFormulaFromMaterialDimensions(options) {
      const notify = Boolean(options && options.notify);
      if (dataMigrations[QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION]) {
        return { skipped: true, migrated: [], ambiguous: [] };
      }
      const migrated = [];
      const ambiguous = [];
      rawMaterials.forEach((material) => {
        if (normalizeFormulaBinding(material.qtyFormulaId)) return;
        const formulaIds = [];
        materialDimensions.forEach((row) => {
          if (Number(row.rawMaterialId) !== Number(material.id)) return;
          const id = normalizeFormulaBinding(row.formulaId);
          if (id != null && !formulaIds.includes(id)) formulaIds.push(id);
        });
        if (!formulaIds.length) return;
        material.qtyFormulaId = formulaIds[0];
        const formula = getFormula(formulaIds[0]);
        const entry = {
          id: material.id,
          code: material.code,
          name: material.name,
          qtyFormulaId: formulaIds[0],
          formulaCode: formula ? formula.code : null
        };
        migrated.push(entry);
        if (formulaIds.length > 1) {
          ambiguous.push({
            ...entry,
            formulaIds,
            formulaCodes: formulaIds.map((id) => {
              const item = getFormula(id);
              return item ? item.code : String(id);
            })
          });
        }
      });
      const report = {
        ranAt: new Date().toISOString(),
        migratedCount: migrated.length,
        ambiguousCount: ambiguous.length,
        migrated,
        ambiguous
      };
      dataMigrations[QTY_FORMULA_FROM_MATERIAL_DIMS_MIGRATION] = true;
      dataMigrations.qtyFormulaFromMaterialDimensionsV1Report = report;
      console.info("[migration] qtyFormulaFromMaterialDimensionsV1", report);
      if (notify && (migrated.length || ambiguous.length)) {
        pendingQtyFormulaMigrationNotice = report;
      }
      return { skipped: false, migrated, ambiguous, report };
    }

    function migrateServiceFormulaFromServiceDimensions(options) {
      const notify = Boolean(options && options.notify);
      if (dataMigrations[SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION]) {
        return { skipped: true, migrated: [], ambiguous: [] };
      }
      const migrated = [];
      const ambiguous = [];
      services.forEach((service) => {
        const rateRow = getServiceRate(service.id);
        if (!rateRow) return;
        if (normalizeFormulaBinding(rateRow.formulaId)) return;
        const formulaIds = [];
        serviceDimensions.forEach((row) => {
          if (Number(row.serviceId) !== Number(service.id)) return;
          const id = normalizeFormulaBinding(row.formulaId);
          if (id != null && !formulaIds.includes(id)) formulaIds.push(id);
        });
        if (!formulaIds.length) return;
        rateRow.formulaId = formulaIds[0];
        const formula = getFormula(formulaIds[0]);
        const entry = {
          id: service.id,
          code: service.code,
          name: service.name,
          formulaId: formulaIds[0],
          formulaCode: formula ? formula.code : null
        };
        migrated.push(entry);
        if (formulaIds.length > 1) {
          ambiguous.push({
            ...entry,
            formulaIds,
            formulaCodes: formulaIds.map((id) => {
              const item = getFormula(id);
              return item ? item.code : String(id);
            })
          });
        }
      });
      const report = {
        ranAt: new Date().toISOString(),
        migratedCount: migrated.length,
        ambiguousCount: ambiguous.length,
        migrated,
        ambiguous
      };
      dataMigrations[SERVICE_FORMULA_FROM_SERVICE_DIMS_MIGRATION] = true;
      dataMigrations.serviceFormulaFromServiceDimensionsV1Report = report;
      console.info("[migration] serviceFormulaFromServiceDimensionsV1", report);
      if (notify && (migrated.length || ambiguous.length)) {
        pendingServiceFormulaMigrationNotice = report;
      }
      return { skipped: false, migrated, ambiguous, report };
    }

    function showPendingQtyFormulaMigrationNotice() {
      const reports = [];
      if (pendingQtyFormulaMigrationNotice) reports.push({ kind: "material", report: pendingQtyFormulaMigrationNotice });
      if (pendingServiceFormulaMigrationNotice) reports.push({ kind: "service", report: pendingServiceFormulaMigrationNotice });
      pendingQtyFormulaMigrationNotice = null;
      pendingServiceFormulaMigrationNotice = null;
      if (!reports.length) return;
      const parts = [];
      let warn = false;
      reports.forEach(({ kind, report }) => {
        if (kind === "material") {
          if (report.migratedCount) {
            parts.push("Copied Default Quantity Formula onto " + report.migratedCount + " material(s): " + report.migrated.map((item) => item.code).join(", "));
          }
          if (report.ambiguousCount) {
            warn = true;
            parts.push("Review materials with multiple dimension formulas: " + report.ambiguous.map((item) => item.code).join(", "));
          }
        } else {
          if (report.migratedCount) {
            parts.push("Copied Service Rate formula onto " + report.migratedCount + " service(s): " + report.migrated.map((item) => item.code).join(", "));
          }
          if (report.ambiguousCount) {
            warn = true;
            parts.push("Review services with multiple dimension formulas: " + report.ambiguous.map((item) => item.code).join(", "));
          }
        }
      });
      if (parts.length) showNotification(parts.join(" "), warn ? "warning" : "info");
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

    const SERVICE_RATE_UOMS = ["Rs./piece", "Rs./sq.inch", "Rs./sq.meter", "Rs./meter", "Rs./kg", "Rs./hour", "Rs./job"];

    function normalizeServiceRateUom(value) {
      const raw = String(value || "").trim();
      if (!raw) return "";
      const labeled = raw.replace(/^rs\.?\s*\/\s*/i, "Rs./");
      if (SERVICE_RATE_UOMS.includes(labeled)) return labeled;
      const unit = formatRateUnit(raw) || normalizeUnit(raw);
      const mapped = {
        piece: "Rs./piece",
        pieces: "Rs./piece",
        sqin: "Rs./sq.inch",
        "sq.inch": "Rs./sq.inch",
        sqm: "Rs./sq.meter",
        "sq.meter": "Rs./sq.meter",
        m: "Rs./meter",
        meter: "Rs./meter",
        kg: "Rs./kg",
        hour: "Rs./hour",
        job: "Rs./job"
      };
      return mapped[unit] || (unit ? "Rs./" + unit : "");
    }

    const MATERIAL_RATE_UOMS = ["Rs./kg", "Rs./sheet", "Rs./piece", "Rs./gm", "Rs./sq.meter", "Rs./sq.inch", "Rs./meter"];

    function normalizeMaterialRateUom(value) {
      const raw = String(value || "").trim();
      if (!raw) return "";
      const labeled = raw.replace(/^rs\.?\s*\/\s*/i, "Rs./");
      if (MATERIAL_RATE_UOMS.includes(labeled)) return labeled;
      const unit = formatRateUnit(raw) || normalizeUnit(raw);
      const mapped = {
        kg: "Rs./kg",
        gm: "Rs./gm",
        sheet: "Rs./sheet",
        piece: "Rs./piece",
        pieces: "Rs./piece",
        sqin: "Rs./sq.inch",
        "sq.inch": "Rs./sq.inch",
        sqm: "Rs./sq.meter",
        "sq.meter": "Rs./sq.meter",
        m: "Rs./meter",
        meter: "Rs./meter"
      };
      return mapped[unit] || (unit ? "Rs./" + unit : "");
    }

    function getMaterialRate(rawMaterialId) {
      const id = Number(rawMaterialId);
      const matches = materialRates.filter((row) => Number(row.rawMaterialId) === id);
      return matches.find((row) => row.status !== "Inactive") || matches[0] || null;
    }

    function getOtherMaterialRate(otherRawMaterialId) {
      const id = Number(otherRawMaterialId);
      const matches = otherMaterialRates.filter((row) => Number(row.otherRawMaterialId) === id);
      return matches.find((row) => row.status !== "Inactive") || matches[0] || null;
    }

    function getServiceRate(serviceId) {
      const id = Number(serviceId);
      const matches = serviceRates.filter((row) => Number(row.serviceId) === id);
      return matches.find((row) => row.status !== "Inactive") || matches[0] || null;
    }

    function getServiceDefaultFormulaId(serviceId) {
      const rate = getServiceRate(serviceId);
      return rate && rate.formulaId ? Number(rate.formulaId) : null;
    }

    function formatRatePkr(rate, rateUom) {
      if (rate === null || rate === undefined || Number.isNaN(Number(rate))) return "—";
      const unit = formatRateUnit(rateUom) || "unit";
      return `${formatCurrency(rate)}/${unit}`;
    }

    function getItemDimensions(item, fallback) {
      const fb = fallback || { L: 0, W: 0, H: 0 };
      const dims = item?.dimensions ?? {};
      return {
        L: numericOrNull(dims?.L) ?? fb.L ?? 0,
        W: numericOrNull(dims?.W) ?? fb.W ?? 0,
        H: numericOrNull(dims?.H) ?? fb.H ?? 0
      };
    }

    function formatDimensions(item) {
      const dims = item?.dimensions ?? item ?? {};
      const code = formatFinishedGoodSizeCode(dims).replace(/x/g, " × ");
      return `${code} ${item?.dimensionUOM || item?.uom || ""}`.trim();
    }

    function formatRupees(value) {
      return formatCurrency(value);
    }

    function formatFinishedGoodDisplayName(item) {
      if (!item) return "missing data";
      const dims = formatFinishedGoodSizeCode(item?.dimensions);
      return [item?.product, item?.style, item?.variant, dims]
        .filter((part) => part !== null && part !== undefined && String(part).trim() !== "")
        .join(" ") || "missing data";
    }

    function formatFinishedGoodOption(item) {
      if (!item) return "missing data";
      return `${formatFinishedGoodDisplayName(item)} — ${item?.ply ?? "?"} Ply`;
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
        if (item.code === "SHEET_AREA") return;
        const numeric = numericOrNull(item.defaultValue);
        if (numeric !== null) values[item.code] = numeric;
      });
      const width = Number(values.SHEET_WIDTH);
      const length = Number(values.SHEET_LENGTH);
      if (Number.isFinite(width) && Number.isFinite(length)) {
        values.SHEET_AREA = roundTo(width * length, 4);
      }
      return values;
    }

    function findStyleByName(name) {
      const needle = String(name || "").trim().toLowerCase();
      if (!needle) return null;
      return styles.find((item) => String(item.name).trim().toLowerCase() === needle) || null;
    }

    function getStyleVariables(styleId) {
      return styleVariables
        .filter((item) => item.styleId === Number(styleId))
        .slice()
        .sort((a, b) => String(a.variableCode).localeCompare(String(b.variableCode)) || Number(a.ply) - Number(b.ply) || a.id - b.id);
    }

    function normalizeStylePly(value, fallback) {
      const n = Number(value);
      if (n === 1 || n === 2 || n === 3) return n;
      return fallback == null ? 3 : fallback;
    }

    function getFinishedGoodPly(finishedGood) {
      return normalizeStylePly(finishedGood && finishedGood.ply, 3);
    }

    function styleVariableComboKey(variableCode, ply) {
      return String(variableCode || "").trim() + "::" + Number(ply);
    }

    function findStyleVariable(styleId, variableCode, ply, excludeId) {
      return styleVariables.find((item) =>
        item.styleId === Number(styleId) &&
        item.variableCode === variableCode &&
        Number(item.ply) === Number(ply) &&
        (excludeId == null || item.id !== Number(excludeId))
      ) || null;
    }

    function getStyleVariablesForPly(styleId, ply) {
      const target = Number(ply);
      return getStyleVariables(styleId).filter((item) => Number(item.ply) === target);
    }

    function renderStylePlyOptions(selected) {
      const current = normalizeStylePly(selected, 1);
      return [1, 2, 3].map((ply) => `<option value="${ply}" ${current === ply ? "selected" : ""}>${ply}</option>`).join("");
    }

    const BOM_DIMENSION_DISPLAY = [
      { code: "L", name: "Flat Length", kind: "fg" },
      { code: "W", name: "Flat Width", kind: "fg" },
      { code: "H", name: "Height", kind: "fg" },
      { code: "AREA", name: "Covered Area", kind: "derived" },
      { code: "PERIMETER", name: "Perimeter", kind: "derived" },
      { code: "GLUE_FLAP", name: "Glue Flap", kind: "variable" },
      { code: "SHEET_WIDTH", name: "Sheet Width", kind: "variable" },
      { code: "SHEET_LENGTH", name: "Sheet Length", kind: "variable" }
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
      if (source === "covered_area") return "From COVERED_AREA formula";
      if (source === "style_covered_area") return "From style Covered Area formula";
      if (source === "style_perimeter") return "From style Area Length and Area Width";
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
      const style = finishedGood ? findStyleByName(finishedGood?.style) : null;
      if (style) {
        getStyleVariablesForPly(style.id, getFinishedGoodPly(finishedGood)).forEach((row) => {
          const n = numericOrNull(row.value);
          if (n === null) return;
          const catalog = getFormulaVariableByCode(row.variableCode);
          context[row.variableCode] = n;
          units[row.variableCode] = row.unit || (catalog && catalog.unit) || units[row.variableCode] || "";
          sources[row.variableCode] = "style";
        });
      }
      const dimUnit = String((finishedGood && finishedGood.dimensionUOM) || "").trim();
      const dims = finishedGood?.dimensions ?? {};
      const L = numericOrNull(dims?.L);
      const W = numericOrNull(dims?.W);
      const H = numericOrNull(dims?.H);
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

    function jobDimensionsFromFinishedGood(finishedGood) {
      const dims = finishedGood && finishedGood.dimensions ? finishedGood.dimensions : {};
      return {
        L: numericOrNull(dims.L),
        W: numericOrNull(dims.W),
        H: numericOrNull(dims.H)
      };
    }

    function buildFlatStyleFormulaVariables(finishedGood) {
      const { context, style } = resolveBomDimensionContext(finishedGood);
      const vars = { ...getFormulaVariableDefaults(), ...context };
      delete vars.L;
      delete vars.W;
      delete vars.H;
      if (style) {
        getStyleVariablesForPly(style.id, getFinishedGoodPly(finishedGood)).forEach((row) => {
          const n = numericOrNull(row.value);
          if (n !== null && row.variableCode !== "L" && row.variableCode !== "W" && row.variableCode !== "H") {
            vars[row.variableCode] = n;
          }
        });
      }
      const job = jobDimensionsFromFinishedGood(finishedGood);
      if (job.L !== null) vars.L = job.L;
      if (job.W !== null) vars.W = job.W;
      if (job.H !== null) vars.H = job.H;
      return vars;
    }

    function calculateBomDimensions(finishedGood) {
      if (!finishedGood) return [];
      const { context, units, sources, style, dimUnit } = resolveBomDimensionContext(finishedGood);
      const L = Number(context.L) || 0;
      const W = Number(context.W) || 0;
      const linearUnit = dimUnit || units.L || units.W || "";
      const styleMetrics = getStyleFormulaMetrics(finishedGood);
      const rows = BOM_DIMENSION_DISPLAY.map((def) => {
        if (def.kind === "derived" && def.code === "AREA") {
          const areaEval = evaluateCoveredAreaValue(finishedGood, null, styleMetrics);
          return {
            code: def.code,
            name: def.name,
            value: areaEval.success ? roundTo(areaEval.result, 2) : null,
            unit: squaredDimensionUnit(linearUnit),
            source: areaEval.source || "covered_area"
          };
        }
        if (def.kind === "derived" && def.code === "PERIMETER") {
          const perimeter = getStylePerimeterFromFormulaRows(styleMetrics.rows);
          if (perimeter.success) {
            return {
              code: def.code,
              name: def.name,
              value: roundTo(perimeter.result, 2),
              unit: linearUnit,
              source: "style_perimeter"
            };
          }
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
        getStyleVariablesForPly(style.id, getFinishedGoodPly(finishedGood)).forEach((row) => {
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

    function renderCalculatedDimensionsSection(finishedGood, options) {
      const rows = calculateBomDimensions(finishedGood);
      if (!rows.length) return "";
      const title = (options && options.title) || "Variable values for this finished good";
      const sectionId = (options && options.sectionId) || "calculatedDimensionsSection";
      const gridId = (options && options.gridId) || "dimensionsGrid";
      const visible = Boolean(state.showCalculatedDimensions);
      const toggleButton = `<button type="button" class="formula-help-btn" id="btn-toggle-calc-dims" title="${visible ? "Hide variable values" : "Show variable values"}" aria-label="${visible ? "Hide calculated dimensions" : "Show calculated dimensions"}" aria-expanded="${visible}">?</button>`;
      if (!visible) {
        return `
          <div id="${escapeHtml(sectionId)}" class="calc-dims">
            <div class="calc-dims-head">
              <div>
                <div class="section-kicker">Calculated dimensions ${toggleButton}</div>
              </div>
            </div>
          </div>
        `;
      }
      return `
        <div id="${escapeHtml(sectionId)}" class="calc-dims">
          <div class="calc-dims-head">
            <div>
              <div class="section-kicker">Calculated dimensions ${toggleButton}</div>
              <div class="section-title">${escapeHtml(title)}</div>
            </div>
            <span class="badge badge-muted">Live</span>
          </div>
          <div id="${escapeHtml(gridId)}" class="calc-dims-grid">
            ${rows.map((row) => {
              const valueText = formatDimensionDisplayValue(row.value);
              const unit = row.unit ? ` ${row.unit}` : "";
              const source = dimensionSourceLabel(row.source);
              const perimeterHint = row.code === "PERIMETER"
                ? (row.source === "style_perimeter"
                  ? ` <span class="badge badge-muted">Style</span> ${fixedFormulaMark("2 × (Area Length + Area Width)", "Perimeter uses Area Length and Area Width from style formulas.")}`
                  : ` <span class="badge badge-muted">Fixed</span> ${fixedFormulaMark("2 × (Length + Width)", "Fixed calculation. Perimeter is always calculated from Length and Width.")}`)
                : "";
              const areaHint = row.code === "AREA" && row.source === "style_covered_area"
                ? ` <span class="badge badge-muted">Style</span>`
                : "";
              return `
                <div class="calc-dims-item" title="${escapeHtml(row.code === "PERIMETER" && row.source === "style_perimeter" ? "Perimeter uses Area Length and Area Width from style formulas." : (row.code === "PERIMETER" ? "Fixed calculation. Perimeter is always calculated from Length and Width." : source))}">
                  <span class="calc-dims-name">${escapeHtml(row.name)}${perimeterHint}${areaHint}</span>
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
      return buildFlatStyleFormulaVariables(finishedGood);
    }

    function buildStyleFormulaResultRow(formula, calculated, linkId) {
      return {
        linkId: linkId,
        formulaId: formula.id,
        code: formula.code,
        name: formula.name,
        description: formula.description || formula.name,
        expression: formula.expression,
        success: calculated.success,
        result: calculated.success ? calculated.result : null,
        error: calculated.success ? null : calculated.error,
        serviceLength: Boolean(formula.serviceLength),
        serviceWidth: Boolean(formula.serviceWidth),
        coveredArea: Boolean(formula.coveredArea)
      };
    }

    function appendCoveredAreaDependencyRows(rows, variables) {
      const list = Array.isArray(rows) ? rows.slice() : [];
      const covered = list.find((row) => isCoveredAreaStyleFormula(row));
      if (!covered) return list;
      const formula = getFormula(covered.formulaId) || getFormulaByCode(covered.code);
      if (!formula) return list;
      const extra = extraFormulasFromStyleRows(list);
      const nested = collectNestedFormulas(formula, extra);
      const have = new Set(list.map((row) => row.code));
      const vars = { ...(variables || {}) };
      list.forEach((row) => {
        if (row.success && row.code && row.code !== "—") vars[row.code] = row.result;
      });
      const extras = [];
      nested.forEach((item) => {
        if (!item || !item.code || item.code === formula.code || have.has(item.code)) return;
        const calculated = evaluateFormula(item.expression, vars, [item.code], { strictJobDimensions: true });
        if (calculated.success) vars[item.code] = calculated.result;
        extras.push(buildStyleFormulaResultRow(item, calculated, "dep:" + item.id));
        have.add(item.code);
      });
      if (!extras.length) return list;
      const coveredIndex = list.findIndex((row) => isCoveredAreaStyleFormula(row));
      if (coveredIndex < 0) return list.concat(extras);
      return list.slice(0, coveredIndex).concat(extras, list.slice(coveredIndex));
    }

    function evaluateStyleFormulasForFinishedGood(finishedGood) {
      if (!finishedGood) return [];
      const style = findStyleByName(finishedGood.style);
      if (!style) return [];
      const variables = buildFlatStyleFormulaVariables(finishedGood);
      const rows = getStyleFormulaLinks(style.id).map((link) => {
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
            error: "Linked style formula no longer exists.",
            serviceLength: false,
            serviceWidth: false,
            coveredArea: false
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
            error: "This style formula is inactive.",
            serviceLength: Boolean(formula.serviceLength),
            serviceWidth: Boolean(formula.serviceWidth),
            coveredArea: Boolean(formula.coveredArea)
          };
        }
        const calculated = evaluateFormula(formula.expression, variables, [formula.code], { strictJobDimensions: true });
        if (calculated.success) variables[formula.code] = calculated.result;
        return buildStyleFormulaResultRow(formula, calculated, link.id);
      });
      return appendCoveredAreaDependencyRows(rows, variables);
    }

    function styleFormulaSearchText(row) {
      return [row && row.code, row && row.name, row && row.description]
        .map((part) => String(part || "").toUpperCase())
        .join(" ");
    }

    function isCoveredAreaStyleFormula(row) {
      if (!row) return false;
      if (row.coveredArea) return true;
      const code = String(row.code || "").toUpperCase();
      const text = styleFormulaSearchText(row);
      if (code === "AREA_CALC" || code === "COVERED_AREA") return true;
      if (code.includes("COV_AREA") || code.includes("COVERED_AREA")) return true;
      if (text.includes("COVERED AREA")) return true;
      return false;
    }

    function isAreaLengthStyleFormula(row) {
      if (!row || isCoveredAreaStyleFormula(row)) return false;
      if (row.serviceLength) return true;
      const code = String(row.code || "").toUpperCase();
      const text = styleFormulaSearchText(row);
      if (/(^|_)(LNG|LEN)(_|$)/.test(code)) return true;
      if (/\bLENGTH\b/.test(text) && !/\bWIDTH\b/.test(text)) return true;
      return false;
    }

    function isAreaWidthStyleFormula(row) {
      if (!row || isCoveredAreaStyleFormula(row)) return false;
      if (row.serviceWidth) return true;
      const code = String(row.code || "").toUpperCase();
      const text = styleFormulaSearchText(row);
      if (/(^|_)(WDT|WID)(_|$)/.test(code)) return true;
      if (/\bWIDTH\b/.test(text)) return true;
      return false;
    }

    function getStyleFormulaMetrics(finishedGood, evaluatedStyleFormulas) {
      const rows = evaluatedStyleFormulas || evaluateStyleFormulasForFinishedGood(finishedGood);
      return {
        rows,
        lengthRow: rows.find((row) => isAreaLengthStyleFormula(row)) || null,
        widthRow: rows.find((row) => isAreaWidthStyleFormula(row)) || null,
        coveredRow: rows.find((row) => isCoveredAreaStyleFormula(row)) || null
      };
    }

    function evaluateCoveredAreaValue(finishedGood, fallbackVars, metrics) {
      const snap = metrics || getStyleFormulaMetrics(finishedGood);
      if (snap.coveredRow) {
        const n = snap.coveredRow.success ? numericOrNull(snap.coveredRow.result) : null;
        return {
          success: n !== null,
          result: n,
          error: snap.coveredRow.success ? null : snap.coveredRow.error,
          source: "style_covered_area",
          code: snap.coveredRow.code
        };
      }
      const vars = fallbackVars || buildFlatStyleFormulaVariables(finishedGood);
      snap.rows.forEach((row) => {
        if (row.success && row.code && row.code !== "—") vars[row.code] = row.result;
      });
      const areaFormula = getFormulaByCode("COVERED_AREA");
      if (!areaFormula || !areaFormula.isActive) {
        return { success: false, result: null, error: "COVERED_AREA formula is not available.", source: "covered_area" };
      }
      const evaluated = evaluateFormula(areaFormula.expression, vars, ["COVERED_AREA"]);
      return {
        success: evaluated.success,
        result: evaluated.success ? evaluated.result : null,
        error: evaluated.success ? null : evaluated.error,
        source: "covered_area"
      };
    }

    function injectStyleFormulaResults(finishedGood, variables) {
      if (!finishedGood || !variables) return;
      const snap = getStyleFormulaMetrics(finishedGood);
      snap.rows.forEach((row) => {
        if (row.success && row.code && row.code !== "—") variables[row.code] = row.result;
      });
      if (snap.coveredRow && snap.coveredRow.success) {
        const n = numericOrNull(snap.coveredRow.result);
        if (n !== null) variables.COVERED_AREA = n;
      }
    }

    function styleFormulaHintKind(row) {
      if (isCoveredAreaStyleFormula(row)) return "coveredArea";
      if (isAreaLengthStyleFormula(row)) return "length";
      if (isAreaWidthStyleFormula(row)) return "width";
      return null;
    }

    function getServiceDimensionOverridesFromStyleFormulas(finishedGood, evaluatedStyleFormulas) {
      const snap = getStyleFormulaMetrics(finishedGood, evaluatedStyleFormulas);
      const lengthN = snap.lengthRow && snap.lengthRow.success ? numericOrNull(snap.lengthRow.result) : null;
      const widthN = snap.widthRow && snap.widthRow.success ? numericOrNull(snap.widthRow.result) : null;
      return {
        serviceL: lengthN,
        serviceW: widthN,
        serviceLCode: snap.lengthRow ? snap.lengthRow.code : null,
        serviceWCode: snap.widthRow ? snap.widthRow.code : null
      };
    }

    const STYLE_PERIMETER_EXPRESSION = "2 * (Area Length + Area Width)";

    function getStylePerimeterFromFormulaRows(rows) {
      const dims = getServiceDimensionOverridesFromStyleFormulas(null, Array.isArray(rows) ? rows : []);
      const length = numericOrNull(dims.serviceL);
      const width = numericOrNull(dims.serviceW);
      const hasL = isUsableStyleServiceDim(length);
      const hasW = isUsableStyleServiceDim(width);
      if (!hasL || !hasW) {
        const missing = [];
        if (!hasL) missing.push("Area Length");
        if (!hasW) missing.push("Area Width");
        return {
          success: false,
          result: null,
          areaLength: length,
          areaWidth: width,
          error: "Needs " + missing.join(" and ") + " from style formulas."
        };
      }
      return {
        success: true,
        result: 2 * (Number(length) + Number(width)),
        areaLength: length,
        areaWidth: width,
        error: null
      };
    }

    function isUsableStyleServiceDim(value) {
      const n = numericOrNull(value);
      return n !== null && n !== 0;
    }

    function resolveQuantityFormulaLW(finishedGood, dim, defaults) {
      const catalog = defaults || getFormulaVariableDefaults();
      const fgDims = finishedGood?.dimensions ?? {};
      const snap = getStyleFormulaMetrics(finishedGood);
      const warnings = [];

      function pickAxis(row, fallback, label) {
        if (!row) return { value: fallback, used: false, code: null };
        if (!row.success) {
          warnings.push("⚠️ " + label + " formula could not be evaluated. Check style formula.");
          return { value: numericOrNull(row.result), used: true, code: row.code };
        }
        const n = numericOrNull(row.result);
        if (n === 0) warnings.push("⚠️ " + label + " formula evaluated to 0. Check style formula.");
        return { value: n, used: true, code: row.code };
      }

      const lengthPick = pickAxis(snap.lengthRow, dim?.L ?? fgDims.L ?? catalog.L, "Area Length");
      const widthPick = pickAxis(snap.widthRow, dim?.W ?? fgDims.W ?? catalog.W, "Area Width");
      return {
        L: lengthPick.value,
        W: widthPick.value,
        useL: lengthPick.used,
        useW: widthPick.used,
        warnings,
        serviceL: lengthPick.used ? lengthPick.value : snap.lengthRow && snap.lengthRow.success ? numericOrNull(snap.lengthRow.result) : null,
        serviceW: widthPick.used ? widthPick.value : snap.widthRow && snap.widthRow.success ? numericOrNull(snap.widthRow.result) : null,
        serviceLCode: lengthPick.code,
        serviceWCode: widthPick.code
      };
    }

    function resolveStyleServiceDimUsage(finishedGood) {
      return resolveQuantityFormulaLW(finishedGood, null, getFormulaVariableDefaults());
    }

    function isUseCustomDimensions(source) {
      return Boolean(source && source.useCustomDimensions === true);
    }

    function getAutoQuantityLW(finishedGood, dimensionId) {
      const defaults = getFormulaVariableDefaults();
      const dim = getDimension(dimensionId);
      const resolved = resolveQuantityFormulaLW(finishedGood, dim, defaults);
      return { L: roundTo(resolved.L, 2), W: roundTo(resolved.W, 2) };
    }

    function renderLengthWidthArea(L, W) {
      const length = Number(L);
      const width = Number(W);
      if (!Number.isFinite(length) || !Number.isFinite(width) || length <= 0 || width <= 0) return "—";
      const area = roundTo(length * width, 4);
      return `
        <div class="lw-area">
          <div>Length = ${escapeHtml(formatQty(length))}</div>
          <div>Width = ${escapeHtml(formatQty(width))}</div>
          <div>Area = ${escapeHtml(formatQty(area))} inch²</div>
        </div>
      `;
    }

    function getCustomDimensionOverride(line) {
      const out = { L: null, W: null, error: null };
      if (!isUseCustomDimensions(line)) return out;
      const L = numericOrNull(line.customLength);
      const W = numericOrNull(line.customWidth);
      if (L === null || W === null || L <= 0 || W <= 0) {
        out.error = SERVICE_CUSTOM_DIM_ERROR;
        return out;
      }
      out.L = L;
      out.W = W;
      return out;
    }

    function customDimensionFields(draft) {
      return {
        useCustomDimensions: isUseCustomDimensions(draft),
        customLength: numericOrNull(draft.customLength),
        customWidth: numericOrNull(draft.customWidth)
      };
    }

    function fillCustomDimensionsFromAuto(draft) {
      const auto = getAutoQuantityLW(getServiceModalFinishedGood(), draft && draft.dimensionId);
      if (draft.customLength === "" || draft.customLength == null) draft.customLength = auto.L;
      if (draft.customWidth === "" || draft.customWidth == null) draft.customWidth = auto.W;
    }

    function validateCustomDimensionDraft(draft, errors) {
      if (!draft || draft.calculationMethod !== "formula" || !isUseCustomDimensions(draft)) return;
      const L = numericOrNull(draft.customLength);
      const W = numericOrNull(draft.customWidth);
      if (L === null || L <= 0) errors.customLength = "Length must be greater than 0.";
      if (W === null || W <= 0) errors.customWidth = "Width must be greater than 0.";
    }

    function getStyleVariableValue(styleId, variableCode, ply) {
      const row = findStyleVariable(styleId, variableCode, ply);
      return row ? numericOrNull(row.value) : null;
    }

    function resolveVariableValue(code, finishedGood, fallback) {
      const style = finishedGood ? findStyleByName(finishedGood?.style) : null;
      if (style) {
        const styled = getStyleVariableValue(style.id, code, getFinishedGoodPly(finishedGood));
        if (styled !== null) return styled;
      }
      const catalog = getFormulaVariableByCode(code);
      if (catalog) {
        const def = numericOrNull(catalog.defaultValue);
        if (def !== null) return def;
      }
      return fallback;
    }

    function getSheetDimensions(finishedGood) {
      const catalogWidth = getFormulaVariableByCode("SHEET_WIDTH");
      const catalogLength = getFormulaVariableByCode("SHEET_LENGTH");
      const defaultWidth = numericOrNull(catalogWidth && catalogWidth.defaultValue);
      const defaultLength = numericOrNull(catalogLength && catalogLength.defaultValue);
      const widthRaw = resolveVariableValue("SHEET_WIDTH", finishedGood, defaultWidth !== null ? defaultWidth : 40);
      const lengthRaw = resolveVariableValue("SHEET_LENGTH", finishedGood, defaultLength !== null ? defaultLength : 48);
      const width = Number(widthRaw);
      const length = Number(lengthRaw);
      const sheetWidth = Number.isFinite(width) && width > 0 ? width : 40;
      const sheetLength = Number.isFinite(length) && length > 0 ? length : 48;
      return {
        width: sheetWidth,
        length: sheetLength,
        area: roundTo(sheetWidth * sheetLength, 4)
      };
    }

    function formulasUsingVariable(code) {
      return formulas.filter((item) => extractIdentifiers(item.expression).includes(code));
    }

    function productsUsingStyle(styleName) {
      const needle = String(styleName || "").trim().toLowerCase();
      return finishedGoods.filter((item) => String(item.style || "").trim().toLowerCase() === needle);
    }

    function canonicalPlyLayerName(layer) {
      return String(layer || "") === "Fluting" ? "Inner Liner" : layer;
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
      const current = canonicalPlyLayerName(currentLayer);
      if (current && !layers.includes(current)) return layers.concat([current]);
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
      if (!Number.isFinite(n)) {
        throw new Error("Invalid quantity: " + qty);
      }
      const fromLabel = String(fromUnit || "").trim();
      const toLabel = String(toUnit || "").trim();
      if (!fromLabel || !toLabel) {
        throw new Error("Quantity units not specified");
      }
      const from = normalizeUnit(fromUnit);
      const to = normalizeUnit(toUnit);
      if (from === to) return n;
      if ((from === "sheet" && to === "piece") || (from === "piece" && to === "sheet")) return n;

      const meta = extras || {};
      const gsm = meta.gsm != null && meta.gsm !== "" ? Number(meta.gsm) : null;
      const sheetAreaSqIn = Number(meta.sheetArea != null ? meta.sheetArea : getSheetDimensions(getSelectedFinishedGood()).area);
      const sheetAreaSqM = sheetAreaSqIn * ENGINE_CONSTANTS.SQ_IN_TO_SQ_M;

      function requireGsm(unitLabel) {
        if (!Number.isFinite(gsm) || gsm <= 0) {
          throw new Error("Cannot convert " + unitLabel + " without GSM");
        }
      }

      function toKg(value, unit) {
        if (unit === "kg") return value;
        if (unit === "gm") return value / 1000;
        if (unit === "sqm") {
          requireGsm("sq.meter");
          return value * gsm / 1000;
        }
        if (unit === "sheet") {
          requireGsm("sheet");
          return value * sheetAreaSqM * gsm / 1000;
        }
        return null;
      }

      function fromKg(value, unit) {
        if (unit === "kg") return value;
        if (unit === "gm") return value * 1000;
        if (unit === "sqm") {
          requireGsm("sq.meter");
          return value * 1000 / gsm;
        }
        if (unit === "sheet") {
          requireGsm("sheet");
          return value / (sheetAreaSqM * gsm / 1000);
        }
        return null;
      }

      const asKg = toKg(n, from);
      if (asKg != null) {
        const converted = fromKg(asKg, to);
        if (converted != null && Number.isFinite(converted)) return roundTo(converted, 8);
      }

      if (from === "piece" && to === "1000piece") return roundTo(n / 1000, 8);
      if (from === "1000piece" && to === "piece") return roundTo(n * 1000, 8);
      if (from === "sqin" && to === "sqm") return roundTo(n * ENGINE_CONSTANTS.SQ_IN_TO_SQ_M, 8);
      if (from === "sqm" && to === "sqin") return roundTo(n / ENGINE_CONSTANTS.SQ_IN_TO_SQ_M, 8);
      if (from === "sqin" && to === "m") return roundTo(n * ENGINE_CONSTANTS.SQ_IN_TO_SQ_M, 8);

      throw new Error("Unsupported unit conversion: " + fromLabel + " to " + toLabel);
    }

    function convertRate(rate, fromUnit, toUnit, gsm = null) {
      const n = Number(rate);
      if (!Number.isFinite(n) || n <= 0) {
        throw new Error("Invalid rate: " + rate + ". Rate must be > 0.");
      }
      if (!String(fromUnit || "").trim() || !String(toUnit || "").trim()) {
        throw new Error("Rate units not specified");
      }
      const from = normalizeUnit(fromUnit);
      const to = normalizeUnit(toUnit);
      if (from === to) return roundTo(n, 6);
      const converted = roundTo(n * convertQuantity(1, toUnit, fromUnit, { gsm }), 6);
      if (!Number.isFinite(converted) || converted <= 0) {
        throw new Error("Conversion resulted in invalid rate: " + converted);
      }
      return converted;
    }

    function getSelectedFinishedGood() {
      if (state.selectedFinishedGoodId == null) return null;
      return finishedGoods.find((item) => item.id === state.selectedFinishedGoodId) || null;
    }

    function getSelectedFinishingService() {
      if (state.selectedFinishingServiceId == null) return null;
      return finishingServices.find((item) => item.id === state.selectedFinishingServiceId) || null;
    }

    function generateBomNo(item) {
      const family = String(item?.product ?? "ITEM").replace(/\s*Box$/i, "").trim().toUpperCase().replace(/\s+/g, "-") || "ITEM";
      const siblings = finishedGoods.filter((fg) => fg?.product === item?.product);
      const sequence = siblings.findIndex((fg) => fg?.id === item?.id) + 1;
      return `BOM-${family}-${String(Math.max(sequence, 1)).padStart(3, "0")}`;
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

    function uniqueBomNumbers(records) {
      const seen = new Set();
      const list = [];
      (records || []).forEach((bom) => {
        const no = String(bom && bom.bomNo ? bom.bomNo : (bom && bom.id != null ? "BOM-" + bom.id : "")).trim();
        if (!no || seen.has(no)) return;
        seen.add(no);
        list.push(no);
      });
      return list;
    }

    function getBomsUsingMaterial(rawMaterialId) {
      const id = Number(rawMaterialId);
      return boms.filter((bom) => (bom.materials || []).some((line) => Number(line.rawMaterialId) === id));
    }

    function isMaterialUsedInBoms(rawMaterialId) {
      return getBomsUsingMaterial(rawMaterialId).length > 0;
    }

    function getBomsUsingService(serviceId) {
      const id = Number(serviceId);
      return boms.filter((bom) =>
        (bom.services || []).some((line) => Number(line.serviceId) === id) ||
        (bom.additionalServices || []).some((line) => Number(line.serviceId) === id) ||
        (bom.finishingServiceLines || []).some((line) => Number(line.serviceId) === id)
      );
    }

    function isServiceUsedInBoms(serviceId) {
      return getBomsUsingService(serviceId).length > 0;
    }

    function isFGUsedInBoms(finishedGoodId) {
      return getBomsForFinishedGood(finishedGoodId).length > 0;
    }

    function materialBomUsageMessage(rawMaterialId) {
      const nos = uniqueBomNumbers(getBomsUsingMaterial(rawMaterialId));
      if (!nos.length) return "";
      return "Cannot delete. Used in " + nos.length + " BOM" + (nos.length === 1 ? "" : "s") + ": " + nos.join(", ");
    }

    function getBomsUsingOtherMaterial(otherRawMaterialId) {
      const id = Number(otherRawMaterialId);
      return boms.filter((bom) =>
        (bom.otherMaterials || []).some((line) => Number(line.otherRawMaterialId) === id) ||
        (bom.materials || []).some((line) => Number(line.otherRawMaterialId) === id)
      );
    }

    function otherMaterialBomUsageMessage(otherRawMaterialId) {
      const nos = uniqueBomNumbers(getBomsUsingOtherMaterial(otherRawMaterialId));
      if (!nos.length) return "";
      return "Cannot delete. Used in " + nos.length + " BOM" + (nos.length === 1 ? "" : "s") + ": " + nos.join(", ");
    }

    function serviceBomUsageMessage(serviceId) {
      const nos = uniqueBomNumbers(getBomsUsingService(serviceId));
      if (!nos.length) return "";
      return "Cannot delete. Used in " + nos.length + " BOM" + (nos.length === 1 ? "" : "s") + ": " + nos.join(", ");
    }

    function finishedGoodBomUsageMessage(finishedGoodId) {
      const n = getBomsForFinishedGood(finishedGoodId).length;
      if (!n) return "";
      return "Cannot delete. Has " + n + " BOM" + (n === 1 ? "" : "s") + ". Delete BOMs first.";
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
        finishingServiceId: record.finishingServiceId || state.selectedFinishingServiceId || null,
        version: record.version,
        status: record.status,
        createdAt: record.createdAt
      };
    }

    function copyLinesForEditor(record) {
      const split = splitBomRecordMaterials(record);
      return {
        materials: cloneData(split.materials).map((line) => ({
          ...line,
          layer: canonicalPlyLayerName(line.layer),
          id: nextBomLineId(),
          netQty: 0,
          grossQty: 0,
          rate: 0,
          costPerPiece: 0
        })),
        otherMaterials: cloneData(split.otherMaterials).map((line) => ({
          ...line,
          layer: canonicalPlyLayerName(line.layer),
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
        })),
        additionalServices: cloneData(record.additionalServices || []).map((line) => ({
          ...line,
          id: nextBomLineId(),
          quantity: 0,
          rate: 0,
          costPerPiece: 0
        })),
        finishingServiceLines: cloneData(record.finishingServiceLines || []).map((line) => ({
          ...line,
          id: nextBomLineId(),
          quantity: 0,
          rate: 0,
          costPerPiece: 0
        }))
      };
    }

    function splitBomRecordMaterials(record) {
      const storedOther = Array.isArray(record && record.otherMaterials) ? record.otherMaterials : [];
      const materials = [];
      const fromMain = [];
      (record && record.materials ? record.materials : []).forEach((line) => {
        if (Number(line && line.otherRawMaterialId)) fromMain.push(line);
        else materials.push(line);
      });
      return { materials, otherMaterials: storedOther.concat(fromMain) };
    }

    function hydrateBomEditorMaterials(materials, otherMaterials) {
      const split = splitBomRecordMaterials({ materials: materials || [], otherMaterials: otherMaterials || [] });
      const renameLayer = (line) => {
        if (!line || typeof line !== "object") return line;
        return { ...line, layer: canonicalPlyLayerName(line.layer) };
      };
      state.bomMaterials = (Array.isArray(split.materials) ? split.materials : []).map(renameLayer);
      state.bomOtherMaterials = (Array.isArray(split.otherMaterials) ? split.otherMaterials : []).map(renameLayer);
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
          [item?.product, item?.variant, item?.style, item?.ply, item?.dimensions?.L, item?.dimensions?.W, item?.dimensions?.H, formatDimensions(item), formatFinishedGoodDisplayName(item)],
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

    function isConsumableRawMaterial(rawMaterialId) {
      const material = getRawMaterial(rawMaterialId);
      return Boolean(material && material.category === "Consumable");
    }

    function getOtherRawMaterial(id) {
      return otherRawMaterials.find((item) => item.id === Number(id)) || null;
    }

    function getService(id) {
      return services.find((item) => item.id === Number(id)) || null;
    }

    function normalizeServiceCategories(value, options) {
      const allowEmpty = Boolean(options && options.allowEmpty);
      const raw = Array.isArray(value) ? value : (value ? [value] : []);
      const seen = new Set();
      const next = [];
      raw.forEach((item) => {
        const id = String(item || "").trim().toLowerCase();
        if (!SERVICE_CATEGORY_IDS.includes(id) || seen.has(id)) return;
        seen.add(id);
        next.push(id);
      });
      if (!next.length && !allowEmpty) return ["general"];
      return next;
    }

    function serviceCategoryLabels(categories) {
      return normalizeServiceCategories(categories).map((id) => {
        const option = SERVICE_CATEGORY_OPTIONS.find((item) => item.id === id);
        return option ? option.label : id;
      });
    }

    function formatServiceCategoryBadges(categories) {
      return serviceCategoryLabels(categories)
        .map((label) => `<span class="badge badge-info">${escapeHtml(label)}</span>`)
        .join(" ");
    }

    function serviceHasCategory(service, categoryId) {
      if (!categoryId) return true;
      return normalizeServiceCategories(service && service.categories).includes(categoryId);
    }

    function isFinishingServiceCollection(collection) {
      return collection === "finishing" || collection === "cc-finishing";
    }

    function bomCollectionToServiceCategory(collection) {
      if (isFinishingServiceCollection(collection)) return "finishing";
      if (collection === "additional") return "general";
      return "general";
    }

    function getServiceFormulas(purpose) {
      return formulas.filter((item) =>
        item.type === "Service" &&
        item.isActive &&
        (!purpose || item.purpose === purpose)
      );
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

    function renderBoundFormulaOptions(type, selectedId, purpose) {
      const selected = selectedId ? getFormula(selectedId) : null;
      const active = formulas.filter((item) =>
        item.type === type &&
        item.isActive &&
        (!purpose || item.purpose === purpose)
      );
      const selectedMatches = selected && (!purpose || selected.purpose === purpose);
      const list = selectedMatches && !active.some((item) => item.id === selected.id)
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

    function getServiceDimensionLinks(serviceId) {
      return serviceDimensions
        .filter((item) => item.serviceId === Number(serviceId))
        .slice()
        .sort((a, b) => Number(a.dimensionId) - Number(b.dimensionId) || Number(a.ply) - Number(b.ply) || a.id - b.id);
    }

    function getServiceDimensionLink(serviceId, dimensionId, ply) {
      if (serviceId == null || dimensionId == null || dimensionId === "") return null;
      const matches = serviceDimensions.filter((item) =>
        item.serviceId === Number(serviceId) &&
        Number(item.dimensionId) === Number(dimensionId)
      );
      if (!matches.length) return null;
      const targetPly = ply == null || ply === "" ? null : Number(ply);
      if (targetPly != null) {
        const exact = matches.find((item) => Number(item.ply) === targetPly);
        if (exact) return exact;
      }
      return matches[0];
    }

    function getServiceLinkedDimensionIds(service) {
      if (!service) return [];
      const fromLinks = getServiceDimensionLinks(service.id)
        .map((row) => Number(row.dimensionId))
        .filter((id) => getDimension(id));
      if (fromLinks.length) return normalizeDimensionIds(fromLinks);
      return normalizeDimensionIds(service.dimensionIds);
    }

    function serviceHasDimensionLinks(service) {
      return Boolean(service && getServiceDimensionLinks(service.id).length);
    }

    function syncServiceDimensionIds(serviceId) {
      const service = getService(serviceId);
      if (!service) return;
      service.dimensionIds = normalizeDimensionIds(
        getServiceDimensionLinks(serviceId).map((row) => Number(row.dimensionId))
      );
    }

    function formatServiceDimensionSummary(service) {
      const links = getServiceDimensionLinks(service && service.id);
      if (links.length) {
        return formatLinkedDimensionSummary(links.map((row) => Number(row.dimensionId)));
      }
      return formatLinkedDimensionSummary(service && service.dimensionIds);
    }

    function getMaterialDimensionLinks(rawMaterialId) {
      return materialDimensions
        .filter((item) => item.rawMaterialId === Number(rawMaterialId))
        .slice()
        .sort((a, b) => Number(a.dimensionId) - Number(b.dimensionId) || Number(a.ply) - Number(b.ply) || a.id - b.id);
    }

    function getMaterialDimensionLink(rawMaterialId, dimensionId, ply) {
      if (rawMaterialId == null || dimensionId == null || dimensionId === "") return null;
      const matches = materialDimensions.filter((item) =>
        item.rawMaterialId === Number(rawMaterialId) &&
        Number(item.dimensionId) === Number(dimensionId)
      );
      if (!matches.length) return null;
      const targetPly = ply == null || ply === "" ? null : Number(ply);
      if (targetPly != null) {
        const exact = matches.find((item) => Number(item.ply) === targetPly);
        if (exact) return exact;
      }
      return matches[0];
    }

    function getMaterialLinkedDimensionIds(material) {
      if (!material) return [];
      const fromLinks = getMaterialDimensionLinks(material.id)
        .map((row) => Number(row.dimensionId))
        .filter((id) => getDimension(id));
      if (fromLinks.length) return normalizeDimensionIds(fromLinks);
      return normalizeDimensionIds(material.dimensionIds);
    }

    function describeBomMaterialDimensionSelect(material) {
      const linkedIds = material ? getMaterialLinkedDimensionIds(material) : [];
      if (!material) {
        return {
          linkedIds: [],
          emptyLabel: "No dimensions linked",
          hint: ""
        };
      }
      if (linkedIds.length) {
        return {
          linkedIds,
          emptyLabel: "No dimensions linked",
          hint: "Optional. Select a dimension used for this material quantity."
        };
      }
      return {
        linkedIds,
        emptyLabel: "No dimensions linked",
        hint: "No dimension linked yet for this material. Go to Raw Material → Dimensions tab to add one."
      };
    }

    function materialHasDimensionLinks(material) {
      return Boolean(material && getMaterialDimensionLinks(material.id).length);
    }

    function materialMissingPlyFormula(material) {
      return !getMaterialQtyFormula(material);
    }

    function getMaterialQtyFormula(material) {
      return getFormula(material && material.qtyFormulaId);
    }

    function getOtherMaterialQtyFormula(material) {
      return getFormula(material && material.qtyFormulaId);
    }

    function getOtherMaterialLinkedDimensionIds(material) {
      if (!material) return [];
      const fromLinks = getOtherMaterialDimensionLinks(material.id)
        .map((row) => Number(row.dimensionId))
        .filter((id) => getDimension(id));
      if (fromLinks.length) return normalizeDimensionIds(fromLinks);
      return normalizeDimensionIds(material.dimensionIds);
    }

    function getOtherMaterialDimensionLink(otherRawMaterialId, dimensionId, ply) {
      if (otherRawMaterialId == null || dimensionId == null || dimensionId === "") return null;
      const matches = otherMaterialDimensions.filter((item) =>
        item.otherRawMaterialId === Number(otherRawMaterialId) &&
        Number(item.dimensionId) === Number(dimensionId)
      );
      if (!matches.length) return null;
      const targetPly = ply == null || ply === "" ? null : Number(ply);
      if (targetPly != null) {
        const exact = matches.find((item) => Number(item.ply) === targetPly);
        if (exact) return exact;
      }
      return matches[0];
    }

    function describeOtherMaterialDimensionSelect(material) {
      const linkedIds = material ? getOtherMaterialLinkedDimensionIds(material) : [];
      if (!material) {
        return { linkedIds: [], emptyLabel: "No dimensions linked", hint: "" };
      }
      if (linkedIds.length) {
        return {
          linkedIds,
          emptyLabel: "No dimensions linked",
          hint: "Optional. Select a dimension used for this other material quantity."
        };
      }
      return {
        linkedIds,
        emptyLabel: "No dimensions linked",
        hint: "No dimension linked yet for this other material. Go to Other Raw Material → Dimensions tab to add one."
      };
    }

    function applyOtherMaterialFormulaBindings(draft) {
      const material = getOtherRawMaterial(draft.otherRawMaterialId);
      if (!material) {
        draft.dimensionId = null;
        if (draft.calculationMethod === "formula") draft.formulaId = null;
        return;
      }
      if (draft.calculationMethod !== "formula") return;
      const linkedIds = getOtherMaterialLinkedDimensionIds(material);
      if (draft.dimensionId && !linkedIds.includes(Number(draft.dimensionId))) {
        draft.dimensionId = null;
      }
      if (!draft.dimensionId) {
        draft.dimensionId = pickBomDimensionId(linkedIds, null, getSelectedFinishedGood());
      }
      draft.formulaId = material.qtyFormulaId ? Number(material.qtyFormulaId) : null;
    }

    function syncMaterialDimensionIds(rawMaterialId) {
      const material = getRawMaterial(rawMaterialId);
      if (!material) return;
      material.dimensionIds = normalizeDimensionIds(
        getMaterialDimensionLinks(rawMaterialId).map((row) => Number(row.dimensionId))
      );
    }

    function formatMaterialDimensionSummary(material) {
      const links = getMaterialDimensionLinks(material && material.id);
      if (links.length) {
        return formatLinkedDimensionSummary(links.map((row) => Number(row.dimensionId)));
      }
      return formatLinkedDimensionSummary(material && material.dimensionIds);
    }

    function getOtherMaterialDimensionLinks(otherRawMaterialId) {
      return otherMaterialDimensions
        .filter((item) => item.otherRawMaterialId === Number(otherRawMaterialId))
        .slice()
        .sort((a, b) => Number(a.dimensionId) - Number(b.dimensionId) || Number(a.ply) - Number(b.ply) || a.id - b.id);
    }

    function syncOtherMaterialDimensionIds(otherRawMaterialId) {
      const material = getOtherRawMaterial(otherRawMaterialId);
      if (!material) return;
      material.dimensionIds = normalizeDimensionIds(
        getOtherMaterialDimensionLinks(otherRawMaterialId).map((row) => Number(row.dimensionId))
      );
    }

    function formatOtherMaterialDimensionSummary(material) {
      const links = getOtherMaterialDimensionLinks(material && material.id);
      if (links.length) {
        return formatLinkedDimensionSummary(links.map((row) => Number(row.dimensionId)));
      }
      return formatLinkedDimensionSummary(material && material.dimensionIds);
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
      if (finishedGood?.dimensions) {
        const L = roundTo(finishedGood.dimensions?.L ?? 0, 2);
        const W = roundTo(finishedGood.dimensions?.W ?? 0, 2);
        const H = roundTo(finishedGood.dimensions?.H ?? 0, 2);
        const match = linked.find((id) => {
          const dim = getDimension(id);
          return dim && roundTo(dim.L, 2) === L && roundTo(dim.W, 2) === W && roundTo(dim.H, 2) === H;
        });
        if (match) return match;
      }
      return linked.length === 1 ? linked[0] : null;
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
          <div class="dim-chip-wrap">${chips || `<span class="stat-hint">No dimensions linked. Quantity formulas will use finished-good L, W, H.</span>`}</div>
          <p class="stat-hint">Optional. Linked dimensions select which size a quantity formula uses. Rates always come from the material or service master.</p>
        </div>
      `;
    }

    function renderBomDimensionSelect(linkedIds, selectedId, selectId, error, hint, options) {
      const opts = options || {};
      const linked = normalizeDimensionIds(linkedIds);
      const locked = Boolean(opts.disabled);
      const disabled = locked || !linked.length;
      const placeholder = locked
        ? (opts.lockedLabel || "Select an item first")
        : (linked.length ? "Select a dimension..." : (opts.emptyLabel || "No dimensions linked"));
      return `
        <div>
          <label class="form-label" for="${selectId}">Dimension</label>
          <select id="${selectId}" class="full-select ${error ? "input-invalid" : ""}" ${disabled ? "disabled" : ""} aria-invalid="${error ? "true" : "false"}">
            <option value="">${escapeHtml(placeholder)}</option>
            ${linked.map((id) => {
              const dim = getDimension(id);
              return `<option value="${id}" ${Number(selectedId) === id ? "selected" : ""}>${escapeHtml(formatDimensionChipLabel(dim))}</option>`;
            }).join("")}
          </select>
          ${error ? `<div class="field-error">${escapeHtml(error)}</div>` : (hint ? `<p class="stat-hint" style="margin-top:6px;">${escapeHtml(hint)}</p>` : "")}
        </div>
      `;
    }

    function renderUseCustomDimensionBlock(draft, errors, ids) {
      if (!draft || draft.calculationMethod !== "formula") return "";
      const checked = isUseCustomDimensions(draft);
      const lengthValue = draft.customLength == null || draft.customLength === "" ? "" : String(draft.customLength);
      const widthValue = draft.customWidth == null || draft.customWidth === "" ? "" : String(draft.customWidth);
      return `
        <div>
          <label class="form-label">Dimension</label>
          <label class="custom-dim-flag">
            <input id="${ids.checkId}" type="checkbox" ${checked ? "checked" : ""} />
            <span>Use Custom Dimensions</span>
          </label>
          ${checked ? `
            <div class="dim-input-row two" style="margin-top:10px;">
              <div>
                <label class="form-label" for="${ids.lengthId}">Length (L) in.</label>
                <input id="${ids.lengthId}" class="full-search ${errors.customLength ? "input-invalid" : ""}" type="number" step="any" min="0.0001" value="${escapeHtml(lengthValue)}" aria-invalid="${errors.customLength ? "true" : "false"}" />
                ${errors.customLength ? `<div class="field-error">${escapeHtml(errors.customLength)}</div>` : ""}
              </div>
              <div>
                <label class="form-label" for="${ids.widthId}">Width (W) in.</label>
                <input id="${ids.widthId}" class="full-search ${errors.customWidth ? "input-invalid" : ""}" type="number" step="any" min="0.0001" value="${escapeHtml(widthValue)}" aria-invalid="${errors.customWidth ? "true" : "false"}" />
                ${errors.customWidth ? `<div class="field-error">${escapeHtml(errors.customWidth)}</div>` : ""}
              </div>
            </div>
          ` : ""}
        </div>
      `;
    }

    function renderPreviewCustomDimSection(draft) {
      if (isUseCustomDimensions(draft)) {
        const L = numericOrNull(draft.customLength);
        const W = numericOrNull(draft.customWidth);
        return `
          <section class="preview-section" aria-label="Selected dimension">
            <h3 class="preview-heading">Selected dimension</h3>
            ${renderPreviewField("Dimension", "Custom")}
            ${renderPreviewField("Length (L)", L === null ? "—" : escapeHtml(formatDecimal(L, 2, false) + " inch"))}
            ${renderPreviewField("Width (W)", W === null ? "—" : escapeHtml(formatDecimal(W, 2, false) + " inch"))}
          </section>
        `;
      }
      return `
        <section class="preview-section" aria-label="Selected dimension">
          <h3 class="preview-heading">Selected dimension</h3>
          <p class="stat-hint">Not selected — using formula variable defaults.</p>
        </section>
      `;
    }

    function applyMaterialFormulaBindings(draft) {
      const material = getRawMaterial(draft.rawMaterialId);
      if (!material) {
        draft.dimensionId = null;
        if (draft.calculationMethod === "formula") draft.formulaId = null;
        return;
      }
      if (draft.calculationMethod !== "formula") return;
      const linkedIds = getMaterialLinkedDimensionIds(material);
      if (draft.dimensionId && !linkedIds.includes(Number(draft.dimensionId))) {
        draft.dimensionId = null;
      }
      if (!draft.dimensionId) {
        draft.dimensionId = pickBomDimensionId(linkedIds, null, getSelectedFinishedGood());
      }
      applyMaterialDimensionFormula(draft);
    }

    function applyMaterialDimensionFormula(draft) {
      const material = getRawMaterial(draft.rawMaterialId);
      if (!material || draft.calculationMethod !== "formula") return;
      // Qty formula comes only from the material Default Quantity Formula (qtyFormulaId).
      // materialDimensions.formulaId is no longer read for costing; dimension+ply mapping is still used.
      draft.formulaId = material.qtyFormulaId ? Number(material.qtyFormulaId) : null;
    }

    function applyServiceFormulaBinding(draft) {
      const service = getService(draft.serviceId);
      if (!service) {
        draft.dimensionId = null;
        if (draft.calculationMethod === "formula") draft.formulaId = null;
        return;
      }
      const linkedIds = getServiceLinkedDimensionIds(service);
      if (draft.dimensionId && !linkedIds.includes(Number(draft.dimensionId))) {
        draft.dimensionId = null;
      }
      applyServiceDimensionFormula(draft);
    }

    function applyServiceDimensionFormula(draft) {
      const service = getService(draft.serviceId);
      if (!service || draft.calculationMethod !== "formula") return;
      // Qty formula comes only from the active Service Rate (serviceRates.formulaId via getServiceDefaultFormulaId).
      // serviceDimensions.formulaId is no longer read for costing; dimension+ply mapping is still used.
      draft.formulaId = getServiceDefaultFormulaId(service.id);
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

    function resolveIdentifier(id, provided, stack, options) {
      if (id === "SHEET_AREA") {
        const width = numericOrNull(provided ? provided.SHEET_WIDTH : null);
        const length = numericOrNull(provided ? provided.SHEET_LENGTH : null);
        if (width !== null && length !== null) return { success: true, value: roundTo(width * length, 4) };
        return { success: true, value: getSheetDimensions(getSelectedFinishedGood()).area };
      }

      if (id === "NO_OF_COLOR" && provided && Object.prototype.hasOwnProperty.call(provided, "NO_OF_COLOR")) {
        // Number of Colors must come from the user's entry on the current screen.
        // A null here means the field is empty — fail instead of using any default.
        const typedColors = numericOrNull(provided.NO_OF_COLOR);
        if (typedColors !== null) return { success: true, value: typedColors };
        return { success: false, error: "Number of Colors not entered" };
      }

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
        const nested = evaluateFormula(dependency.expression, provided, stack.concat(id), options);
        if (!nested.success) return { success: false, error: nested.error };
        return { success: true, value: nested.result };
      }

      const styled = resolveVariableValue(id, getSelectedFinishedGood(), null);
      if (styled !== null) return { success: true, value: styled };

      const catalog = getFormulaVariableByCode(id);
      if (catalog) {
        const def = numericOrNull(catalog.defaultValue);
        if (def !== null) return { success: true, value: def };
      }

      if (Object.prototype.hasOwnProperty.call(DEFAULT_TEST_VALUES, id)) {
        const hard = numericOrNull(DEFAULT_TEST_VALUES[id]);
        if (hard !== null) return { success: true, value: hard };
      }

      return { success: false, error: "Variable " + id + " not configured" };
    }

    function evaluateFormula(expression, provided, stack, options) {
      const path = stack || [];
      const syntax = validateFormulaSyntax(expression);
      if (!syntax.valid) return { success: false, result: null, error: syntax.error };

      const incoming = provided && typeof provided === "object" ? provided : {};
      const variables = { ...getFormulaVariableDefaults(), ...incoming };
      if (options && options.strictJobDimensions) {
        ["L", "W", "H"].forEach((code) => {
          if (!Object.prototype.hasOwnProperty.call(incoming, code) || numericOrNull(incoming[code]) === null) {
            delete variables[code];
          }
        });
      }
      for (const id of extractIdentifiers(expression)) {
        const resolved = resolveIdentifier(id, variables, path, options);
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

    function buildFormulaVariables(finishedGood, material, wastagePercent, dimensionId, formula, line) {
      const defaults = getFormulaVariableDefaults();
      const dim = getDimension(dimensionId);
      const styleVals = {};
      const style = finishedGood ? findStyleByName(finishedGood?.style) : null;
      if (style) {
        getStyleVariablesForPly(style.id, getFinishedGoodPly(finishedGood)).forEach((row) => {
          const n = numericOrNull(row.value);
          if (n !== null) styleVals[row.variableCode] = n;
        });
      }
      const glueFlap = resolveVariableValue("GLUE_FLAP", finishedGood, defaults.GLUE_FLAP ?? DEFAULT_GLUE_FLAP);
      const sheet = getSheetDimensions(finishedGood);
      const pieceArea = resolveVariableValue("PIECE_AREA", finishedGood, defaults.PIECE_AREA ?? DEFAULT_TEST_VALUES.PIECE_AREA);
      const fgDims = finishedGood?.dimensions ?? {};
      const resolvedDims = resolveQuantityFormulaLW(finishedGood, dim, defaults);
      const override = getCustomDimensionOverride(line);
      const L = roundTo(override.L !== null ? override.L : resolvedDims.L, 2);
      const W = roundTo(override.W !== null ? override.W : resolvedDims.W, 2);
      const H = roundTo(dim?.H ?? fgDims.H ?? defaults.H, 2);
      const vars = {
        ...defaults,
        ...styleVals,
        L,
        W,
        H,
        PLY: Number(finishedGood?.ply ?? defaults.PLY),
        GSM: material?.gsm != null ? roundTo(material.gsm, 1) : resolveVariableValue("GSM", finishedGood, defaults.GSM),
        GLUE_FLAP: glueFlap,
        WASTAGE: roundTo(wastagePercent, 2),
        MATERIAL_RATE: material ? roundTo((getMaterialRate(material.id)?.rate) ?? 0, 2) : resolveVariableValue("MATERIAL_RATE", finishedGood, defaults.MATERIAL_RATE),
        ORDER_QTY: resolveVariableValue("ORDER_QTY", finishedGood, defaults.ORDER_QTY ?? 1),
        NET_QTY: resolveVariableValue("NET_QTY", finishedGood, defaults.NET_QTY ?? 1),
        NO_OF_COLOR: resolveNumberOfColors(finishedGood),
        SHEET_LENGTH: sheet.length,
        SHEET_WIDTH: sheet.width,
        SHEET_AREA: sheet.area,
        PIECE_AREA: pieceArea,
        ...ENGINE_CONSTANTS
      };
      injectStyleFormulaResults(finishedGood, vars);
      return vars;
    }

    function buildOtherMaterialFormulaVariables(finishedGood, material, wastagePercent, dimensionId, formula) {
      const defaults = getFormulaVariableDefaults();
      const dim = getDimension(dimensionId);
      const styleVals = {};
      const style = finishedGood ? findStyleByName(finishedGood?.style) : null;
      if (style) {
        getStyleVariablesForPly(style.id, getFinishedGoodPly(finishedGood)).forEach((row) => {
          const n = numericOrNull(row.value);
          if (n !== null) styleVals[row.variableCode] = n;
        });
      }
      const glueFlap = resolveVariableValue("GLUE_FLAP", finishedGood, defaults.GLUE_FLAP ?? DEFAULT_GLUE_FLAP);
      const sheet = getSheetDimensions(finishedGood);
      const pieceArea = resolveVariableValue("PIECE_AREA", finishedGood, defaults.PIECE_AREA ?? DEFAULT_TEST_VALUES.PIECE_AREA);
      const fgDims = finishedGood?.dimensions ?? {};
      const resolvedDims = resolveQuantityFormulaLW(finishedGood, dim, defaults);
      const L = roundTo(resolvedDims.L, 2);
      const W = roundTo(resolvedDims.W, 2);
      const H = roundTo(dim?.H ?? fgDims.H ?? defaults.H, 2);
      const vars = {
        ...defaults,
        ...styleVals,
        L,
        W,
        H,
        PLY: Number(finishedGood?.ply ?? defaults.PLY),
        GSM: material?.gsm != null ? roundTo(material.gsm, 1) : resolveVariableValue("GSM", finishedGood, defaults.GSM),
        GLUE_FLAP: glueFlap,
        WASTAGE: roundTo(wastagePercent, 2),
        MATERIAL_RATE: material ? roundTo((getOtherMaterialRate(material.id)?.rate) ?? 0, 2) : resolveVariableValue("MATERIAL_RATE", finishedGood, defaults.MATERIAL_RATE),
        ORDER_QTY: resolveVariableValue("ORDER_QTY", finishedGood, defaults.ORDER_QTY ?? 1),
        NET_QTY: resolveVariableValue("NET_QTY", finishedGood, defaults.NET_QTY ?? 1),
        NO_OF_COLOR: resolveNumberOfColors(finishedGood),
        SHEET_LENGTH: sheet.length,
        SHEET_WIDTH: sheet.width,
        SHEET_AREA: sheet.area,
        PIECE_AREA: pieceArea,
        ...ENGINE_CONSTANTS
      };
      injectStyleFormulaResults(finishedGood, vars);
      return vars;
    }

    function parseOptionalManualRate(value) {
      if (value == null || value === "") return { empty: true, ok: true, value: null };
      const parsed = parseByRule(value, "rate");
      return { empty: false, ok: parsed.ok, value: parsed.ok ? parsed.value : null, error: parsed.error };
    }

    function storedManualRateFromDraft(draft) {
      if (!draft || draft.calculationMethod !== "manual") return null;
      const parsed = parseOptionalManualRate(draft.manualRate);
      return parsed.ok && !parsed.empty ? parsed.value : null;
    }

    function normalizeStoredManualRate(line) {
      if (!line || line.calculationMethod !== "manual") return null;
      const parsed = parseOptionalManualRate(line.manualRate);
      return parsed.ok && !parsed.empty ? roundTo(parsed.value, 2) : null;
    }

    function applyManualRateDraftValidation(draft, errors, masterRateRow, missingMsg, invalidMsg) {
      if (draft.calculationMethod === "manual") {
        const parsed = parseOptionalManualRate(draft.manualRate);
        if (!parsed.empty && !parsed.ok) {
          errors.manualRate = parsed.error;
          return;
        }
        if (!parsed.empty) return;
      }
      if (!masterRateRow) errors.rate = missingMsg;
      else if (!Number.isFinite(Number(masterRateRow.rate)) || Number(masterRateRow.rate) <= 0) errors.rate = invalidMsg;
    }

    function resolveLineAppliedRate(line, masterRate) {
      if (line && line.calculationMethod === "manual") {
        const parsed = parseOptionalManualRate(line.manualRate);
        if (!parsed.empty) {
          if (!parsed.ok) return { ok: false, rate: 0, source: "manual", error: parsed.error };
          return { ok: true, rate: roundTo(parsed.value, 2), source: "manual" };
        }
      }
      const n = Number(masterRate);
      if (!Number.isFinite(n) || n <= 0) {
        return { ok: false, rate: 0, source: "master", error: "Invalid rate: " + (masterRate ?? "missing") + ". Rate must be > 0." };
      }
      return { ok: true, rate: roundTo(n, 2), source: "master" };
    }

    function applyResolvedLineRate(line, rateRow, missingError) {
      const wantsManualRate = line.calculationMethod === "manual" && !parseOptionalManualRate(line.manualRate).empty;
      if (!wantsManualRate && !rateRow) {
        line.error = missingError;
        line.rate = 0;
        line.rateSource = "master";
        line.manualRate = normalizeStoredManualRate(line);
        return false;
      }
      const applied = resolveLineAppliedRate(line, rateRow?.rate);
      line.manualRate = normalizeStoredManualRate(line);
      if (!applied.ok) {
        line.error = applied.error;
        line.rate = 0;
        line.rateSource = applied.source;
        return false;
      }
      line.rate = applied.rate;
      line.rateSource = applied.source;
      return true;
    }

    function calculateMaterialCost(materialLine, context) {
      const line = { ...materialLine, error: null };
      const finishedGood = (context && context.finishedGood) || getSelectedFinishedGood();
      const material = getRawMaterial(line.rawMaterialId);
      const formulaDimensionId = (context && context.useEnteredDimensions) ? null : line.dimensionId;

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

      const rateRow = getMaterialRate(material.id);
      if (!applyResolvedLineRate(line, rateRow, "No rate configured for material " + (material.code || material.id))) {
        line.netQty = 0;
        line.grossQty = 0;
        line.costPerPiece = 0;
        return line;
      }
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
        const formula = getMaterialQtyFormula(material);
        if (formula) line.formulaId = formula.id;
        if (!formula || !formula.isActive) {
          line.error = formula && !formula.isActive
            ? "The selected material formula is inactive."
            : "A valid material formula is required. Set Default Quantity Formula on the Raw Material master.";
          line.netQty = 0;
          line.grossQty = 0;
          line.costPerPiece = 0;
          return line;
        }
        const dimOverride = getCustomDimensionOverride(line);
        if (dimOverride.error) {
          line.error = dimOverride.error;
          line.netQty = 0;
          line.grossQty = 0;
          line.costPerPiece = 0;
          return line;
        }
        const variables = buildFormulaVariables(finishedGood, material, wastage, formulaDimensionId, formula, line);
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

      const qtyFormula = line.calculationMethod === "formula" ? getMaterialQtyFormula(material) : null;
      const variables = buildFormulaVariables(finishedGood, material, wastage, formulaDimensionId, qtyFormula, line);
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
      line.dimensionVolume = null;
      try {
        const qtyForRate = convertQuantity(grossQty, material?.uom, formatRateUnit(rateRow?.rateUOM) || material?.uom, {
          gsm: material?.gsm,
          sheetArea: getSheetDimensions(finishedGood).area
        });
        if (!Number.isFinite(qtyForRate) || qtyForRate < 0) {
          throw new Error("Quantity could not be converted to the purchasing rate unit.");
        }
        line.qtyForRate = roundTo(qtyForRate, 4);
        line.costPerPiece = roundTo(qtyForRate * line.rate, 2);
      } catch (error) {
        line.error = error && error.message ? error.message : "Unsupported unit conversion";
        line.costPerPiece = 0;
        return line;
      }
      return line;
    }

    function calculateTotalMaterialCost() {
      return (state.bomMaterials || []).reduce((sum, line) => {
        if (isConsumableRawMaterial(line.rawMaterialId)) return sum;
        return sum + Number(line.costPerPiece || 0);
      }, 0);
    }

    function calculateTotalConsumableMaterialCost() {
      return (state.bomMaterials || []).reduce((sum, line) => {
        if (!isConsumableRawMaterial(line.rawMaterialId)) return sum;
        return sum + Number(line.costPerPiece || 0);
      }, 0);
    }

    function calculateOtherMaterialCost(materialLine, context) {
      const line = { ...materialLine, error: null };
      const finishedGood = (context && context.finishedGood) || getSelectedFinishedGood();
      const material = getOtherRawMaterial(line.otherRawMaterialId);
      const formulaDimensionId = (context && context.useEnteredDimensions) ? null : line.dimensionId;

      if (!finishedGood) {
        line.error = "A finished good is required before other materials can be calculated.";
        line.netQty = 0;
        line.grossQty = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      if (!material) {
        line.error = "This material does not exist in the Other Raw Material Master.";
        line.netQty = 0;
        line.grossQty = 0;
        line.rate = 0;
        line.costPerPiece = 0;
        return line;
      }

      const rateRow = getOtherMaterialRate(material.id);
      if (!applyResolvedLineRate(line, rateRow, "No rate configured for other material " + (material.code || material.id))) {
        line.netQty = 0;
        line.grossQty = 0;
        line.costPerPiece = 0;
        return line;
      }
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
        const formula = getOtherMaterialQtyFormula(material);
        if (formula) line.formulaId = formula.id;
        if (!formula || !formula.isActive) {
          line.error = formula && !formula.isActive
            ? "The selected material formula is inactive."
            : "A valid material formula is required. Set Default Quantity Formula on the Other Raw Material master.";
          line.netQty = 0;
          line.grossQty = 0;
          line.costPerPiece = 0;
          return line;
        }
        const variables = buildOtherMaterialFormulaVariables(finishedGood, material, wastage, formulaDimensionId, formula);
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

      const qtyFormula = line.calculationMethod === "formula" ? getOtherMaterialQtyFormula(material) : null;
      const variables = buildOtherMaterialFormulaVariables(finishedGood, material, wastage, formulaDimensionId, qtyFormula);
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
      line.dimensionVolume = null;
      try {
        const qtyForRate = convertQuantity(grossQty, material?.uom, formatRateUnit(rateRow?.rateUOM) || material?.uom, {
          gsm: material?.gsm,
          sheetArea: getSheetDimensions(finishedGood).area
        });
        if (!Number.isFinite(qtyForRate) || qtyForRate < 0) {
          throw new Error("Quantity could not be converted to the purchasing rate unit.");
        }
        line.qtyForRate = roundTo(qtyForRate, 4);
        line.costPerPiece = roundTo(qtyForRate * line.rate, 2);
      } catch (error) {
        line.error = error && error.message ? error.message : "Unsupported unit conversion";
        line.costPerPiece = 0;
        return line;
      }
      return line;
    }

    function calculateTotalOtherMaterialCost() {
      return (state.bomOtherMaterials || []).reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
    }

    function getServiceFormulaDimOverride(formula, service, line) {
      return getCustomDimensionOverride(line);
    }

    function buildServiceFormulaVariables(finishedGood, service, dimensionId, line, formula) {
      const defaults = getFormulaVariableDefaults();
      const dim = getDimension(dimensionId);
      const formulaRec = formula || (line && getFormula(line.formulaId)) || null;
      const override = getServiceFormulaDimOverride(formulaRec, service, line);
      const styleVals = {};
      const style = finishedGood ? findStyleByName(finishedGood?.style) : null;
      if (style) {
        getStyleVariablesForPly(style.id, getFinishedGoodPly(finishedGood)).forEach((row) => {
          const n = numericOrNull(row.value);
          if (n !== null) styleVals[row.variableCode] = n;
        });
      }
      const fgDims = finishedGood?.dimensions ?? {};
      const resolvedDims = resolveQuantityFormulaLW(finishedGood, dim, defaults);
      const L = roundTo(override.L !== null ? override.L : resolvedDims.L, 2);
      const W = roundTo(override.W !== null ? override.W : resolvedDims.W, 2);
      const H = roundTo(dim?.H ?? fgDims.H ?? defaults.H, 2);
      const glueFlap = resolveVariableValue("GLUE_FLAP", finishedGood, defaults.GLUE_FLAP ?? DEFAULT_GLUE_FLAP);
      const area = evaluateCoveredAreaValue(finishedGood);
      const vars = {
        ...defaults,
        ...styleVals,
        L,
        W,
        H,
        PLY: Number(finishedGood?.ply ?? defaults.PLY),
        GLUE_FLAP: glueFlap,
        ORDER_QTY: resolveVariableValue("ORDER_QTY", finishedGood, defaults.ORDER_QTY ?? 1),
        NO_OF_COLOR: resolveNumberOfColors(finishedGood),
        SERVICE_RATE: roundTo((getServiceRate(service && service.id)?.rate) ?? 0, 2),
        PRINT_AREA: area.success ? area.result : resolveVariableValue("PRINT_AREA", finishedGood, defaults.PRINT_AREA),
        MATERIAL_COST: Number(state.totalMaterialCost || 0),
        SERVICE_COST: 0
      };
      injectStyleFormulaResults(finishedGood, vars);
      return vars;
    }

    function calculateServiceCost(serviceLine, context) {
      const line = { ...serviceLine, error: null };
      const finishedGood = (context && context.finishedGood) || getSelectedFinishedGood();
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

      const rateRow = getServiceRate(service.id);
      if (!applyResolvedLineRate(line, rateRow, "No rate configured for service " + (service.code || service.id))) {
        line.quantity = 0;
        line.costPerPiece = 0;
        return line;
      }
      line.dimensionVolume = null;
      const serviceDimensionId = (context && context.useEnteredDimensions) ? null : line.dimensionId;
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
        const formula = getFormula(getServiceDefaultFormulaId(service.id));
        if (formula) line.formulaId = formula.id;
        if (!formula || !formula.isActive || formula.type !== "Service") {
          line.error = formula && !formula.isActive
            ? "The selected service formula is inactive."
            : "A valid service formula is required. Set a formula on the active Service Rate.";
          line.quantity = 0;
          line.costPerPiece = 0;
          return line;
        }
        const dimOverride = getServiceFormulaDimOverride(formula, service, line);
        if (dimOverride.error) {
          line.error = dimOverride.error;
          line.quantity = 0;
          line.costPerPiece = 0;
          return line;
        }
        const calculated = evaluateFormula(
          formula.expression,
          buildServiceFormulaVariables(finishedGood, service, serviceDimensionId, line, formula),
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
      try {
        const qtyForRate = convertQuantity(quantity, service?.uom, formatRateUnit(rateRow?.rateUOM) || service?.uom, {});
        if (!Number.isFinite(qtyForRate) || qtyForRate < 0) {
          throw new Error("Quantity could not be converted to the service rate unit.");
        }
        line.qtyForRate = roundTo(qtyForRate, 4);
        line.costPerPiece = roundTo(qtyForRate * line.rate, 2);
      } catch (error) {
        line.error = error && error.message ? error.message : "Unsupported unit conversion";
        line.costPerPiece = 0;
        return line;
      }
      return line;
    }

    function calculateTotalAdditionalServiceCost() {
      return (state.bomAdditionalServices || []).reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
    }

    function calculateTotalServiceCost() {
      return state.bomServices.reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
    }

    function calculateTotalFinishingServiceCost() {
      return (state.bomFinishingServices || []).reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
    }

    function recalculateBOMCosts() {
      state.bomMaterials = state.bomMaterials.map((line) => calculateMaterialCost(line));
      state.totalMaterialCost = roundTo(calculateTotalMaterialCost(), 2);
      state.bomOtherMaterials = (state.bomOtherMaterials || []).map((line) => calculateOtherMaterialCost(line));
      state.totalOtherMaterialCost = roundTo(calculateTotalOtherMaterialCost(), 2);
      state.bomServices = state.bomServices.map((line) => calculateServiceCost(line));
      state.bomAdditionalServices = (state.bomAdditionalServices || []).map((line) => {
        if (!line.serviceId) {
          return { ...line, error: null, quantity: 0, rate: 0, costPerPiece: 0 };
        }
        return calculateServiceCost(line);
      });
      state.bomFinishingServices = (state.bomFinishingServices || []).map((line) => calculateServiceCost(line));
      state.totalServiceCost = roundTo(calculateTotalServiceCost(), 2);
      state.totalFinishingServiceCost = roundTo(calculateTotalFinishingServiceCost(), 2);
      state.totalColorCost = hasBomColorCost()
        ? roundTo(Number(state.bomNumberOfColors) * Number(state.bomColorRate), 2)
        : 0;
      state.finalCostPerPiece = roundTo(
        state.totalMaterialCost + state.totalServiceCost + state.totalFinishingServiceCost + state.totalColorCost,
        2
      );
      const packCosts = computeExcelFinalCostPack(
        state.totalMaterialCost,
        state.totalServiceCost,
        state.totalFinishingServiceCost,
        state.bomOrderQuantity
      );
      state.costPer1 = packCosts.per1;
      state.costPer100 = packCosts.per100;
      state.costPer500 = packCosts.per500;
      state.costPer1000 = packCosts.per1000;
      state.costPerGivenQuantity = packCosts.given;
      state.batchFinalCost = packCosts.batchFinal;
      if (hasBomOrderQuantity()) {
        // Known simplification: box/kg are multiplied as-is (no conversion to pieces).
        state.totalOrderCost = roundTo(state.finalCostPerPiece * Number(state.bomOrderQuantity), 2);
      } else {
        state.totalOrderCost = null;
      }
      const overheadPercent = Number(state.bomOverheadPercent) || 0;
      const profitPercent = Number(state.bomProfitPercent) || 0;
      const saleIntermediate = state.finalCostPerPiece + (state.finalCostPerPiece * overheadPercent / 100);
      state.saleCost = roundTo(saleIntermediate + (saleIntermediate * profitPercent / 100), 2);
      state.bomStyleResults = evaluateStyleFormulasForFinishedGood(getSelectedFinishedGood());
    }

    function defaultCostCalculatorState() {
      return {
        styleId: "",
        L: "",
        W: "",
        H: "",
        ply: "",
        layers: [],
        otherLayers: [],
        services: [],
        finishingServices: [],
        additionalMaterials: [],
        additionalServices: [],
        removedServices: [],
        nextServiceKey: 1,
        styleFormulasOpen: false,
        ccNumberOfColors: null,
        ccColorRate: null,
        ccOrderQuantity: null,
        ccOrderQuantityUOM: "pieces"
      };
    }

    function persistCostCalculatorState() {
      persistEditorState();
    }

    function storedCostCalculatorDimension(value) {
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0) return "";
      return roundTo(n, 2);
    }

    function applyStoredCostCalculator(source) {
      const raw = source && source.costCalculator && typeof source.costCalculator === "object"
        ? source.costCalculator
        : (source && source.styleId !== undefined ? source : {});
      const merged = { ...defaultCostCalculatorState(), ...(raw || {}) };
      const styleId = Number(merged.styleId);
      merged.styleId = styles.some((item) => item.id === styleId) ? styleId : "";
      const ply = Number(merged.ply);
      merged.ply = ply === 1 || ply === 2 || ply === 3 ? ply : "";
      merged.L = storedCostCalculatorDimension(merged.L);
      merged.W = storedCostCalculatorDimension(merged.W);
      merged.H = storedCostCalculatorDimension(merged.H);
      merged.layers = (Array.isArray(merged.layers) ? merged.layers : []).map((row) => {
        const layer = canonicalPlyLayerName(row && row.layer ? String(row.layer) : "");
        const id = Number(row && row.rawMaterialId);
        return {
          layer,
          rawMaterialId: id && getRawMaterial(id) ? id : ""
        };
      }).filter((row) => row.layer);
      merged.otherLayers = (Array.isArray(merged.otherLayers) ? merged.otherLayers : []).map((row) => {
        const layer = canonicalPlyLayerName(row && row.layer ? String(row.layer) : "");
        const id = Number(row && row.otherRawMaterialId);
        return {
          layer,
          otherRawMaterialId: id && getOtherRawMaterial(id) ? id : ""
        };
      }).filter((row) => row.layer);
      let maxKey = 0;
      const hydrateServiceList = (rows) => {
        const nextRows = [];
        (Array.isArray(rows) ? rows : []).forEach((row) => {
          const next = normalizeCostCalculatorServiceRow(row);
          if (!next) return;
          const nextKey = next.id || maxKey + 1;
          next.id = nextKey;
          next.key = nextKey;
          if (nextKey > maxKey) maxKey = nextKey;
          nextRows.push(next);
        });
        return nextRows;
      };
      merged.services = hydrateServiceList(merged.services);
      merged.finishingServices = hydrateServiceList(merged.finishingServices);
      merged.additionalServices = hydrateServiceList(merged.additionalServices);
      const additionalMaterials = [];
      (Array.isArray(merged.additionalMaterials) ? merged.additionalMaterials : []).forEach((row) => {
        const next = normalizeCostCalculatorAdditionalMaterialRow(row);
        if (!next) return;
        const nextKey = next.id || maxKey + 1;
        next.id = nextKey;
        next.key = nextKey;
        if (nextKey > maxKey) maxKey = nextKey;
        additionalMaterials.push(next);
      });
      merged.additionalMaterials = additionalMaterials;
      const storedNext = Number(merged.nextServiceKey);
      merged.nextServiceKey = Math.max(1, maxKey + 1, Number.isFinite(storedNext) ? storedNext : 1);
      merged.removedServices = (Array.isArray(merged.removedServices) ? merged.removedServices : [])
        .map(Number)
        .filter((id) => Number.isFinite(id) && id > 0);
      merged.styleFormulasOpen = Boolean(merged.styleFormulasOpen);
      merged.ccNumberOfColors = storedBomColorCount(merged.ccNumberOfColors);
      merged.ccColorRate = storedBomOptionalNumber(merged.ccColorRate);
      merged.ccOrderQuantity = storedBomOptionalNumber(merged.ccOrderQuantity, { places: 4 });
      merged.ccOrderQuantityUOM = storedBomOrderQuantityUom(merged.ccOrderQuantityUOM);
      state.costCalculator = merged;
    }

    function parseCostCalculatorDimension(value) {
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0) return null;
      return n;
    }

    function applyCostCalculatorDimensionInput(input) {
      const keyById = { "calc-length": "L", "calc-width": "W", "calc-height": "H" };
      const key = keyById[input && input.id];
      if (!key) return false;
      const value = parseFloat(input.value);
      const next = Number.isFinite(value) && value > 0 ? roundTo(value, 2) : "";
      if (next === "") input.value = "";
      else input.value = String(next);
      if (state.costCalculator[key] === next) {
        updateCostCalculatorPreview();
        return true;
      }
      state.costCalculator[key] = next;
      if (!getCostCalculatorStepState().hasDims) state.costCalculator.styleFormulasOpen = false;
      updateCostCalculatorPreview();
      persistCostCalculatorState();
      return true;
    }

    function applyCostCalculatorDimensionLive(input) {
      const keyById = { "calc-length": "L", "calc-width": "W", "calc-height": "H" };
      const key = keyById[input && input.id];
      if (!key) return false;
      const parsed = parseCostCalculatorDimension(input.value);
      const next = parsed === null ? "" : parsed;
      if (state.costCalculator[key] !== next) state.costCalculator[key] = next;
      if (!getCostCalculatorStepState().hasDims) state.costCalculator.styleFormulasOpen = false;
      updateCostCalculatorPreview();
      persistCostCalculatorState();
      return true;
    }

    function openCostCalculatorStyleFormulas() {
      if (!getCostCalculatorStepState().hasDims) return false;
      state.costCalculator.styleFormulasOpen = true;
      return true;
    }

    function getCostCalculatorStyleFinishedGood() {
      const steps = getCostCalculatorStepState();
      if (!steps.hasDims) return null;
      const style = styles.find((item) => item.id === Number(state.costCalculator.styleId));
      return {
        id: 0,
        product: "Cost Estimate",
        variant: "",
        style: style?.name ?? "",
        ply: steps.hasPly ? steps.ply : normalizeStylePly(state.costCalculator.ply, 3),
        dimensions: { L: steps.L ?? 0, W: steps.W ?? 0, H: steps.H ?? 0 },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      };
    }

    function renderStylePerimeterRow(rows) {
      const perimeter = getStylePerimeterFromFormulaRows(rows);
      return `
        <div class="style-formula-row">
          <div>
            <div>Perimeter:</div>
            <div class="stat-hint mono">${escapeHtml(STYLE_PERIMETER_EXPRESSION)}</div>
          </div>
          <div class="style-formula-value">
            <span class="formula-cell">
              ${perimeter.success
                ? `<strong>= ${escapeHtml(formatFormulaResult(perimeter.result))}</strong>`
                : `<span class="field-error">${escapeHtml(perimeter.error)}</span>`}
              ${formulaHelpButton("style-perimeter", "PERIMETER", "Explain perimeter")}
            </span>
          </div>
        </div>
      `;
    }

    function renderStyleFormulaHint(row) {
      if (!row || !row.success) return "";
      const hint = styleFormulaHintKind(row);
      if (hint === "length") return `<div class="stat-hint mono">Area Length = ${escapeHtml(formatFormulaResult(row.result))}</div>`;
      if (hint === "width") return `<div class="stat-hint mono">Area Width = ${escapeHtml(formatFormulaResult(row.result))}</div>`;
      if (hint === "coveredArea") return `<div class="stat-hint mono">Covered Area = ${escapeHtml(formatFormulaResult(row.result))}</div>`;
      return "";
    }

    function renderStyleFormulaRow(row, options) {
      const opts = options || {};
      const classes = ["style-formula-row"];
      if (opts.nested) classes.push("is-nested");
      if (opts.primary) classes.push("is-primary");
      const stepLabel = opts.stepIndex != null ? `<span class="style-formula-step">Step ${opts.stepIndex}</span>` : "";
      return `
        <div class="${classes.join(" ")}">
          <div>
            <div>${stepLabel}<span class="mono">${escapeHtml(row.code)}</span>: ${escapeHtml(row.description || row.name)}</div>
            <div class="stat-hint mono">${escapeHtml(row.expression || "—")}</div>
            ${renderStyleFormulaHint(row)}
          </div>
          <div class="style-formula-value">
            <span class="formula-cell">
              ${row.success
                ? `<strong>= ${escapeHtml(formatFormulaResult(row.result))}</strong>`
                : `<span class="field-error">${escapeHtml(row.error || "Could not evaluate")}</span>`}
              ${formulaHelpButton("style", row.code, "Explain style formula")}
            </span>
          </div>
        </div>
      `;
    }

    function renderStyleFormulaResultRows(rows) {
      const list = Array.isArray(rows) ? rows : [];
      if (!list.length) {
        return `
          <div class="style-formula-results">
            <p class="stat-hint" style="margin:0;">No style formulas linked to this style.</p>
            ${renderStylePerimeterRow(list)}
          </div>
        `;
      }
      const covered = list.find((row) => isCoveredAreaStyleFormula(row));
      const nestedRows = covered ? coveredAreaDependentStyleRows(covered, list) : [];
      const nestedKeys = new Set(nestedRows.map((row) => String(row.linkId || row.code)));
      const coveredKey = covered ? String(covered.linkId || covered.code) : "";
      const independent = list.filter((row) => {
        const key = String(row.linkId || row.code);
        if (covered && key === coveredKey) return false;
        if (nestedKeys.has(key)) return false;
        return true;
      });
      const independentHtml = independent.map((row) => renderStyleFormulaRow(row)).join("");
      const coveredHtml = covered
        ? (nestedRows.length
          ? `<div class="style-formula-group">
              <div class="style-formula-group-head">Covered Area calculation</div>
              <p class="stat-hint style-formula-group-note">These formulas are used, in order, to derive Covered Area.</p>
              ${nestedRows.map((row, index) => renderStyleFormulaRow(row, { nested: true, stepIndex: index + 1 })).join("")}
              ${renderStyleFormulaRow(covered, { primary: true, stepIndex: nestedRows.length + 1 })}
            </div>`
          : renderStyleFormulaRow(covered, { primary: true }))
        : "";
      return `
        <div class="style-formula-results">
          ${independentHtml}
          ${coveredHtml}
          ${renderStylePerimeterRow(list)}
        </div>
      `;
    }

    function renderCostCalculatorStyleFormulasMarkup() {
      const fg = getCostCalculatorStyleFinishedGood();
      if (!fg) return "";
      const rows = evaluateStyleFormulasForFinishedGood(fg);
      return `
        <section class="card cc-card" id="cc-style-formulas-panel">
          <div class="card-body">
            <div class="section-head">
              <div>
                <div class="section-kicker">Style Formulas</div>
                <div class="section-title">Style Formulas (Auto-calculated)</div>
              </div>
              <div class="cc-style-formula-actions">
                <span class="badge badge-muted">Read-only</span>
                <button type="button" class="btn btn-sm btn-ghost" data-cc-toggle-style-formulas aria-expanded="true">Hide</button>
              </div>
            </div>
            <p class="stat-hint" style="margin:0 0 12px;">Linked to style <strong>${escapeHtml(fg.style || "—")}</strong>. Values update when the style variables or size inputs change.</p>
            ${renderStyleFormulaResultRows(rows)}
          </div>
        </section>
      `;
    }

    function refreshCostCalculatorStyleFormulas() {
      const root = document.getElementById("cc-style-formulas-root");
      if (!root) return;
      const show = Boolean(state.costCalculator.styleFormulasOpen && getCostCalculatorStepState().hasDims);
      root.innerHTML = show ? renderCostCalculatorStyleFormulasMarkup() : "";
    }

    function updateCostCalculatorPreview() {
      const steps = getCostCalculatorStepState();
      document.querySelectorAll("[data-cc-ply]").forEach((btn) => {
        btn.disabled = !steps.hasDims;
      });
      refreshCostCalculatorStyleFormulas();
      if (!steps.hasPly) return;
      const focusId = document.activeElement && document.activeElement.id;
      const dimFocused = focusId === "calc-length" || focusId === "calc-width" || focusId === "calc-height";
      if (dimFocused) return;
      renderCostCalculator();
      refreshIcons();
    }

    function getCostCalculatorStepState() {
      const cc = state.costCalculator;
      const hasStyle = Boolean(styles.find((item) => item.id === Number(cc.styleId)));
      const L = parseCostCalculatorDimension(cc.L);
      const W = parseCostCalculatorDimension(cc.W);
      const H = parseCostCalculatorDimension(cc.H);
      const hasDims = hasStyle && L !== null && W !== null && H !== null;
      const ply = Number(cc.ply);
      const hasPly = hasDims && (ply === 1 || ply === 2 || ply === 3);
      return { hasStyle, hasDims, hasPly, L, W, H, ply };
    }

    function getCostCalculatorFinishedGood() {
      const steps = getCostCalculatorStepState();
      if (!steps.hasPly) return null;
      const style = styles.find((item) => item.id === Number(state.costCalculator.styleId));
      return {
        id: 0,
        product: "Cost Estimate",
        variant: "",
        style: style?.name ?? "",
        ply: steps.ply,
        dimensions: { L: steps.L ?? 0, W: steps.W ?? 0, H: steps.H ?? 0 },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      };
    }

    function getCostCalculatorMaterials() {
      return rawMaterials.filter((item) => item.status !== "Inactive");
    }

    function getBomOtherMaterialsForPly() {
      return otherRawMaterials.filter((item) => item.status !== "Inactive");
    }

    function getCostCalculatorOtherMaterials(ply) {
      return getBomOtherMaterialsForPly(ply);
    }

    function getCostCalculatorOtherMaterialOptions(ply, selectedId) {
      const options = getCostCalculatorOtherMaterials(ply).slice();
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getOtherRawMaterial(id);
        if (current) options.unshift(current);
      }
      return options;
    }

    function isActiveGeneralService(service) {
      return Boolean(service && service.status === "Active" && serviceHasCategory(service, "general"));
    }

    function isActiveFinishingService(service) {
      return Boolean(service && service.status === "Active" && serviceHasCategory(service, "finishing"));
    }

    function getActiveGeneralServices() {
      return services
        .filter((item) => isActiveGeneralService(item))
        .slice()
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    }

    function defaultGeneralServiceFields(service, finishedGood) {
      const formulaId = getServiceDefaultFormulaId(service && service.id);
      const hasFormula = Boolean(formulaId && getFormula(formulaId));
      const linkedIds = getServiceLinkedDimensionIds(service);
      const dimensionId = pickBomDimensionId(linkedIds, null, finishedGood);
      return {
        serviceId: Number(service.id),
        calculationMethod: hasFormula ? "formula" : "manual",
        formulaId: hasFormula ? formulaId : null,
        dimensionId: dimensionId ? Number(dimensionId) : null,
        manualQty: hasFormula ? null : 1,
        manualRate: null,
        useCustomDimensions: false,
        customLength: null,
        customWidth: null
      };
    }

    function ensureCostCalculatorGeneralServices() {
      if (!Array.isArray(state.costCalculator.services)) state.costCalculator.services = [];
      if (!Array.isArray(state.costCalculator.removedServices)) state.costCalculator.removedServices = [];
      const removed = new Set(state.costCalculator.removedServices.map(Number));
      const existing = new Set(state.costCalculator.services.map((row) => Number(row.serviceId)));
      const finishedGood = getCostCalculatorFinishedGood();
      let changed = false;
      getActiveGeneralServices().forEach((service) => {
        const id = Number(service.id);
        if (existing.has(id) || removed.has(id)) return;
        const key = nextCostCalculatorServiceKey();
        const next = normalizeCostCalculatorServiceRow({
          id: key,
          key,
          ...defaultGeneralServiceFields(service, finishedGood)
        });
        if (!next) return;
        state.costCalculator.services.push(next);
        existing.add(id);
        changed = true;
      });
      return changed;
    }

    function seedBomGeneralServices() {
      if (!getSelectedFinishedGood()) return false;
      if ((state.bomServices || []).length) return false;
      const finishedGood = getSelectedFinishedGood();
      state.bomServices = getActiveGeneralServices().map((service) => calculateServiceCost({
        id: nextBomLineId(),
        ...defaultGeneralServiceFields(service, finishedGood),
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      }));
      return true;
    }

    function isCostCalculatorServiceModal() {
      return Boolean(state.modal && (
        state.modal.collection === "cost-calculator"
        || state.modal.collection === "cc-finishing"
        || state.modal.collection === "cc-additional-service"
      ));
    }

    function isCostCalculatorFinishingModal() {
      return Boolean(state.modal && state.modal.collection === "cc-finishing");
    }

    function getServiceModalFinishedGood() {
      return isCostCalculatorServiceModal() ? getCostCalculatorFinishedGood() : getSelectedFinishedGood();
    }

    function getServiceModalCalcContext() {
      if (!isCostCalculatorServiceModal()) return undefined;
      return { finishedGood: getCostCalculatorFinishedGood(), useEnteredDimensions: true };
    }

    function getCostCalculatorServiceOptions(selectedId) {
      const options = services.filter((item) => isActiveGeneralService(item));
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getService(id);
        if (current) options.unshift(current);
      }
      return options.slice().sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    }

    function getCostCalculatorFinishingServiceOptions(selectedId) {
      const options = services.filter((item) => isActiveFinishingService(item));
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getService(id);
        if (current) options.unshift(current);
      }
      return options.slice().sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    }

    function normalizeCostCalculatorServiceRow(row) {
      const serviceId = Number(row && row.serviceId);
      if (!serviceId || !getService(serviceId)) return null;
      const rawId = Number(row && (row.id != null ? row.id : row.key));
      const id = Number.isFinite(rawId) && rawId > 0 ? rawId : 0;
      return {
        id,
        key: id,
        serviceId,
        calculationMethod: row.calculationMethod === "manual" ? "manual" : "formula",
        formulaId: row.formulaId ? Number(row.formulaId) : null,
        dimensionId: row.dimensionId ? Number(row.dimensionId) : null,
        manualQty: row.manualQty != null && row.manualQty !== "" ? Number(row.manualQty) : null,
        manualRate: row.manualRate != null && row.manualRate !== "" ? Number(row.manualRate) : null,
        useCustomDimensions: Boolean(row && row.useCustomDimensions),
        customLength: row && row.customLength != null ? row.customLength : null,
        customWidth: row && row.customWidth != null ? row.customWidth : null
      };
    }

    function nextCostCalculatorServiceKey() {
      if (!state.costCalculator.nextServiceKey) state.costCalculator.nextServiceKey = 1;
      const key = state.costCalculator.nextServiceKey;
      state.costCalculator.nextServiceKey += 1;
      return key;
    }

    function normalizeCostCalculatorAdditionalMaterialRow(row) {
      const rawMaterialId = Number(row && row.rawMaterialId);
      if (!rawMaterialId || !getRawMaterial(rawMaterialId)) return null;
      const rawId = Number(row && (row.id != null ? row.id : row.key));
      const id = Number.isFinite(rawId) && rawId > 0 ? rawId : 0;
      const wastage = Number(row && row.wastagePercent);
      return {
        id,
        key: id,
        rawMaterialId,
        layer: row && row.layer ? String(row.layer) : "Additional",
        calculationMethod: row && row.calculationMethod === "manual" ? "manual" : "formula",
        formulaId: row && row.formulaId ? Number(row.formulaId) : null,
        dimensionId: row && row.dimensionId ? Number(row.dimensionId) : null,
        manualQty: row && row.manualQty != null && row.manualQty !== "" ? Number(row.manualQty) : null,
        manualRate: row && row.manualRate != null && row.manualRate !== "" ? Number(row.manualRate) : null,
        wastagePercent: Number.isFinite(wastage) ? wastage : DEFAULT_WASTAGE_PERCENT,
        useCustomDimensions: Boolean(row && row.useCustomDimensions),
        customLength: row && row.customLength != null ? row.customLength : null,
        customWidth: row && row.customWidth != null ? row.customWidth : null
      };
    }

    function findCostCalculatorAdditionalMaterialById(lineId) {
      const id = Number(lineId);
      return (state.costCalculator.additionalMaterials || []).find((item) => Number(item.id || item.key) === id) || null;
    }

    function findCostCalculatorAdditionalServiceById(lineId) {
      const id = Number(lineId);
      return (state.costCalculator.additionalServices || []).find((item) => Number(item.id || item.key) === id) || null;
    }

    function isCostCalculatorAdditionalModal() {
      return Boolean(state.modal && state.modal.collection === "cc-additional");
    }

    function isCostCalculatorAdditionalServiceModal() {
      return Boolean(state.modal && state.modal.collection === "cc-additional-service");
    }

    function getMaterialModalFinishedGood() {
      return isCostCalculatorAdditionalModal() ? getCostCalculatorFinishedGood() : getSelectedFinishedGood();
    }

    function getMaterialModalCalcContext() {
      if (!isCostCalculatorAdditionalModal()) return undefined;
      return { finishedGood: getCostCalculatorFinishedGood(), useEnteredDimensions: true };
    }

    function handleCostCalculatorStyleChange(styleId) {
      const id = Number(styleId);
      state.costCalculator.styleId = styles.some((item) => item.id === id) ? id : "";
      state.costCalculator.removedServices = [];
      state.costCalculator.services = [];
      state.costCalculator.finishingServices = [];
      state.costCalculator.additionalMaterials = [];
      state.costCalculator.additionalServices = [];
      state.ccStyleSelectorOpen = false;
      state.ccStyleSearch = "";
      const steps = getCostCalculatorStepState();
      if (!steps.hasDims) state.costCalculator.styleFormulasOpen = false;
      persistCostCalculatorState();
    }

    function getCostCalculatorStyleOptions() {
      const query = String(state.ccStyleSearch || "").trim().toLowerCase();
      return styles
        .slice()
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
        .filter((item) => {
          if (!query) return true;
          return [item.name, item.description].some((value) => String(value || "").toLowerCase().includes(query));
        });
    }

    function renderCostCalculatorStylePicker() {
      const root = document.getElementById("cc-style-picker-root");
      if (!root) return;
      const selected = styles.find((item) => item.id === Number(state.costCalculator.styleId)) || null;
      const options = getCostCalculatorStyleOptions();
      const open = Boolean(state.ccStyleSelectorOpen);
      const inputValue = open ? (state.ccStyleSearch || "") : (selected ? selected.name : (state.ccStyleSearch || ""));
      const list = options.length
        ? options.map((item) => `
            <button type="button" class="fg-option ${selected && selected.id === item.id ? "selected" : ""}" data-cc-style-id="${item.id}">
              <div class="cc-style-option-name">${escapeHtml(item.name)}</div>
              <div class="cc-style-option-meta">${escapeHtml(item.description || "No description")}</div>
            </button>
          `).join("")
        : `<div class="empty">No styles match this search.</div>`;
      root.innerHTML = `
        <div class="fg-combo cc-style-combo" id="cc-style-combo">
          <label class="form-label" for="cc-style-search">Style</label>
          <div class="fg-combo-control">
            <div class="fg-combo-wrap">
              <i data-lucide="search"></i>
              <input id="cc-style-search" type="search" autocomplete="off" placeholder="Search styles..." value="${escapeHtml(inputValue)}" title="${escapeHtml(inputValue)}" aria-label="Search and select style" />
            </div>
            <button type="button" class="fg-combo-toggle ${open ? "open" : ""}" id="cc-style-toggle" aria-label="Toggle style list" aria-expanded="${open ? "true" : "false"}">
              <i data-lucide="chevron-down"></i>
            </button>
          </div>
          <div class="fg-combo-list ${open ? "open" : ""}" id="cc-style-list">${list}</div>
        </div>
      `;
    }

    function findCostCalculatorServiceLineById(lineId) {
      const id = Number(lineId);
      return (state.costCalculator.services || []).find((item) => Number(item.id || item.key) === id) || null;
    }

    function findCostCalculatorFinishingServiceLineById(lineId) {
      const id = Number(lineId);
      return (state.costCalculator.finishingServices || []).find((item) => Number(item.id || item.key) === id) || null;
    }

    function renderCostCalculatorAdditionalMaterials(summary) {
      const materials = summary.additionalMaterials || [];
      const services = summary.additionalServices || [];
      const materialBody = materials.map((row, index) => {
        const material = getRawMaterial(row.rawMaterialId);
        const calc = row.calc || {};
        const formula = row.calculationMethod === "formula"
          ? getMaterialQtyFormula(material)
          : getFormula(row.formulaId);
        const methodLabel = row.calculationMethod === "manual" ? "Manual" : "Formula";
        const formulaLabel = row.calculationMethod === "formula" && formula ? formula.name : "—";
        const lineId = row.id || row.key;
        return `
          <tr>
            <td>${index + 1}</td>
            <td>
              <div>${escapeHtml(material ? material.name : "Unknown material")}</div>
              ${calc.error ? `<div class="field-error">${calc.error === SERVICE_CUSTOM_DIM_ERROR ? escapeHtml(calc.error) : "⚠ " + escapeHtml(calc.error)}</div>` : ""}
              <div class="stat-hint">${escapeHtml(material ? material.code : "")}${row.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(row.dimensionId))) : ""}</div>
            </td>
            <td>${escapeHtml(methodLabel)}</td>
            <td>
              <span class="formula-cell">
                ${escapeHtml(formulaLabel)}
                ${formulaHelpButton("cc-additional-material", lineId, "Explain quantity")}
              </span>
            </td>
            <td>${!calc.error ? formatQty(calc.netQty) : "—"}</td>
            <td>
              ${material ? formatRatePkr(calc.rate, calc.rateUOM || (getMaterialRate(material.id) && getMaterialRate(material.id).rateUOM) || "") : "—"}
              <div class="stat-hint">Material Rates</div>
            </td>
            <td>${calc.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(calc.cost)}</td>
            <td>
              <div class="row-actions">
                <button type="button" class="btn btn-sm btn-icon" data-breakdown-cc-additional-material="${lineId}" title="Calculation breakdown">
                  <i data-lucide="calculator"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon" data-edit-cc-additional-material="${lineId}" title="Edit">
                  <i data-lucide="pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-cc-additional-material="${lineId}" title="Delete">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
      const serviceBody = services.map((row, index) => {
        const service = getService(row.serviceId);
        const calc = row.calc || {};
        const formula = row.calculationMethod === "formula"
          ? getFormula(getServiceDefaultFormulaId(service && service.id))
          : getFormula(row.formulaId);
        const methodLabel = row.calculationMethod === "manual" ? "Manual" : "Formula";
        const formulaLabel = row.calculationMethod === "formula" && formula ? formula.name : "—";
        const lineId = row.id || row.key;
        return `
          <tr>
            <td>${materials.length + index + 1}</td>
            <td>
              <div>${escapeHtml(service ? service.name : "Unknown material")}</div>
              ${calc.error ? `<div class="field-error">${calc.error === SERVICE_CUSTOM_DIM_ERROR ? escapeHtml(calc.error) : "⚠ " + escapeHtml(calc.error)}</div>` : ""}
              <div class="stat-hint">${escapeHtml(service ? service.code : "")}${row.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(row.dimensionId))) : ""}</div>
            </td>
            <td>${escapeHtml(methodLabel)}</td>
            <td>
              <span class="formula-cell">
                ${escapeHtml(formulaLabel)}
                ${formulaHelpButton("cc-service", lineId, "Explain quantity")}
              </span>
            </td>
            <td>${!calc.error ? formatQty(calc.qty) : "—"}</td>
            <td>
              ${service ? formatRatePkr(calc.rate, calc.rateUOM || (getServiceRate(row.serviceId) && getServiceRate(row.serviceId).rateUOM) || "") : "—"}
              <div class="stat-hint">Material Rates</div>
            </td>
            <td>${calc.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(calc.cost)}</td>
            <td>
              <div class="row-actions">
                <button type="button" class="btn btn-sm btn-icon" data-breakdown-cc-additional-service="${lineId}" title="Calculation breakdown">
                  <i data-lucide="calculator"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon" data-edit-cc-additional-service="${lineId}" title="Edit">
                  <i data-lucide="pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-cc-additional-service="${lineId}" title="Delete">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
      const body = (materials.length || services.length)
        ? materialBody + serviceBody
        : emptyRow(8, "No materials added yet.");
      return `
        <div class="table-wrap">
          <table class="data-table cc-grid-table" style="min-width:980px;">
            <thead>
              <tr>
                <th>#</th>
                <th>Material</th>
                <th>Calculation</th>
                <th>Formula</th>
                <th>Qty / Piece</th>
                <th>Rate</th>
                <th title="${escapeHtml(FIXED_COST_FORMULAS.lineCost.description)}">Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      `;
    }

    function renderCostCalculatorServices(summary, steps) {
      const body = summary.services.length
        ? summary.services.map((row, index) => {
            const service = getService(row.serviceId);
            const calc = row.calc;
            const formula = row.calculationMethod === "formula"
              ? getFormula(getServiceDefaultFormulaId(service && service.id)) || getFormula(row.formulaId) || getFormula(calc.formulaId)
              : getFormula(row.formulaId);
            const methodLabel = row.calculationMethod === "manual" ? "Manual" : "Formula";
            const formulaLabel = row.calculationMethod === "formula" && formula ? formula.name : "—";
            const lineId = row.id || row.key;
            return `
              <tr>
                <td>${index + 1}</td>
                <td>
                  <div>${escapeHtml(service ? service.name : "Unknown service")}</div>
                  ${calc.error ? `<div class="field-error">${calc.error === SERVICE_CUSTOM_DIM_ERROR ? escapeHtml(calc.error) : "⚠ " + escapeHtml(calc.error)}</div>` : ""}
                  <div class="stat-hint">${escapeHtml(service ? service.code : "")}${!isActiveGeneralService(service) && service ? " · Not an active General service" : ""}</div>
                </td>
                <td>${escapeHtml(methodLabel)}</td>
                <td>
                  ${renderFormulaNameWithQty(formulaLabel, !calc.error ? formatQty(calc.qty) : "—", formulaHelpButton("cc-service", lineId, "Explain quantity"))}
                </td>
                <td>${formatStep6RequiredQty()}</td>
                <td>
                  ${service ? formatRatePkr(calc.rate, calc.rateUOM || (getServiceRate(row.serviceId) && getServiceRate(row.serviceId).rateUOM) || "") : "—"}
                  <div class="stat-hint">Service Rates</div>
                </td>
                <td>${calc.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(calc.cost)}</td>
                <td>${formatStep6LineTotal(calc.cost, calc.error)}</td>
                <td>
                  <div class="row-actions">
                    <button type="button" class="btn btn-sm btn-icon" data-breakdown-cc-service="${lineId}" title="Calculation breakdown">
                      <i data-lucide="calculator"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-icon" data-edit-cc-service="${lineId}" title="Edit">
                      <i data-lucide="pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-cc-service="${lineId}" title="Delete">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")
        : emptyRow(9, "No general services found.");
      const hasServiceErrors = (summary.services || []).some((row) => row.calc && row.calc.error);
      return `
        <div class="table-wrap">
          <table class="data-table cc-grid-table" style="min-width:1080px;">
            <thead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Calculation</th>
                <th>Formula</th>
                <th>Required Qty</th>
                <th>Rate</th>
                <th title="${escapeHtml(FIXED_COST_FORMULAS.lineCost.description)}">Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</th>
                <th>Total Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>${body}</tbody>
            ${summary.services.length ? renderStep6SubtotalFooter(summary.serviceCost, hasServiceErrors) : ""}
          </table>
        </div>
      `;
    }

    function renderCostCalculatorFinishingServices(summary) {
      const hasFinishingErrors = summary.finishingServices.some((row) => row.calc && row.calc.error);
      const body = summary.finishingServices.length
        ? summary.finishingServices.map((row, index) => {
            const service = getService(row.serviceId);
            const calc = row.calc;
            const formula = row.calculationMethod === "formula"
              ? getFormula(getServiceDefaultFormulaId(service && service.id)) || getFormula(row.formulaId) || getFormula(calc.formulaId)
              : getFormula(row.formulaId);
            const methodLabel = row.calculationMethod === "manual" ? "Manual" : "Formula";
            const formulaLabel = row.calculationMethod === "formula" && formula ? formula.name : "—";
            const lineId = row.id || row.key;
            return `
              <tr>
                <td>${index + 1}</td>
                <td>
                  <div>${escapeHtml(service ? service.name : "Unknown service")}</div>
                  ${calc.error ? `<div class="field-error">${calc.error === SERVICE_CUSTOM_DIM_ERROR ? escapeHtml(calc.error) : "⚠ " + escapeHtml(calc.error)}</div>` : ""}
                  <div class="stat-hint">${escapeHtml(service ? service.code : "")}${row.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(row.dimensionId))) : ""}${!isActiveFinishingService(service) && service ? " · Not an active Finishing service" : ""}</div>
                </td>
                <td>${escapeHtml(methodLabel)}</td>
                <td>
                  ${renderFormulaNameWithQty(formulaLabel, !calc.error ? formatQty(calc.qty) : "—", formulaHelpButton("cc-service", lineId, "Explain quantity"))}
                </td>
                <td>${formatCostCalculatorRequiredQty()}</td>
                <td>
                  ${service ? formatRatePkr(calc.rate, calc.rateUOM || (getServiceRate(row.serviceId) && getServiceRate(row.serviceId).rateUOM) || "") : "—"}
                  <div class="stat-hint">Service Rates</div>
                </td>
                <td>${calc.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(calc.cost)}</td>
                <td>${formatCostCalculatorLineTotal(calc.cost, calc.error)}</td>
                <td>
                  <div class="row-actions">
                    <button type="button" class="btn btn-sm btn-icon" data-breakdown-cc-finishing-service="${lineId}" title="Calculation breakdown">
                      <i data-lucide="calculator"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-icon" data-edit-cc-finishing-service="${lineId}" title="Edit">
                      <i data-lucide="pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-cc-finishing-service="${lineId}" title="Delete">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")
        : emptyRow(9, "No finishing services added yet.");
      return `
        <div class="table-wrap">
          <table class="data-table cc-grid-table" style="min-width:1080px;">
            <thead>
              <tr>
                <th>#</th>
                <th>Finishing Service</th>
                <th>Calculation</th>
                <th>Formula</th>
                <th>Required Qty</th>
                <th>Rate</th>
                <th title="${escapeHtml(FIXED_COST_FORMULAS.lineCost.description)}">Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</th>
                <th>Total Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>${body}</tbody>
            ${summary.finishingServices.length ? renderCostCalculatorOrderSubtotalFooter(summary.finishingCost, hasFinishingErrors) : ""}
          </table>
        </div>
      `;
    }

    function findCostCalculatorMaterialLink(rawMaterialId, ply, finishedGood) {
      const links = getMaterialDimensionLinks(rawMaterialId);
      if (!links.length) return null;
      const ids = links.map((row) => Number(row.dimensionId));
      const picked = pickBomDimensionId(ids, links[0].dimensionId, finishedGood);
      return getMaterialDimensionLink(rawMaterialId, picked, ply) || links[0];
    }

    function findCostCalculatorOtherMaterialLink(otherRawMaterialId, ply, finishedGood) {
      const links = getOtherMaterialDimensionLinks(otherRawMaterialId);
      if (!links.length) return null;
      const ids = links.map((row) => Number(row.dimensionId));
      const picked = pickBomDimensionId(ids, links[0].dimensionId, finishedGood);
      return getOtherMaterialDimensionLink(otherRawMaterialId, picked, ply) || links[0];
    }

    function findCostCalculatorServiceLink(serviceId, ply, finishedGood) {
      const links = getServiceDimensionLinks(serviceId);
      if (!links.length) return null;
      const ids = links.map((row) => Number(row.dimensionId));
      const picked = pickBomDimensionId(ids, links[0].dimensionId, finishedGood);
      return getServiceDimensionLink(serviceId, picked, ply) || links[0];
    }

    function formatCostCalculatorFormulaError(error) {
      const text = String(error || "");
      const configured = text.match(/Variable\s+([A-Z0-9_]+)\s+not configured/i);
      if (configured) return "Variable " + configured[1] + " not configured";
      const numeric = text.match(/Variable has no numeric value:\s*([A-Z0-9_]+)/i);
      if (numeric) return "Variable " + numeric[1] + " not configured";
      const missing = text.match(/Variable\s+([A-Z0-9_]+)\s+not found/i);
      if (missing) return "Variable " + missing[1] + " not configured";
      return text;
    }

    function loadCostCalculatorLayers(ply, options) {
      const names = getStructuralLayers(ply);
      const prev = Array.isArray(state.costCalculator.layers) ? state.costCalculator.layers : [];
      state.costCalculator.layers = names.map((layer) => {
        const existing = prev.find((row) => row.layer === layer);
        return { layer, rawMaterialId: existing && existing.rawMaterialId ? existing.rawMaterialId : "" };
      });
      if (options && options.notify && !getCostCalculatorMaterials().length) {
        showNotification("No active raw materials found.", "error");
      }
    }

    function loadCostCalculatorOtherLayers() {
      const names = getStructuralLayers(1);
      const prev = Array.isArray(state.costCalculator.otherLayers) ? state.costCalculator.otherLayers : [];
      const kept = prev.find((row) => row.otherRawMaterialId) || prev[0];
      state.costCalculator.otherLayers = names.map((layer) => {
        const existing = prev.find((row) => row.layer === layer) || kept;
        return { layer, otherRawMaterialId: existing && existing.otherRawMaterialId ? existing.otherRawMaterialId : "" };
      });
    }

    function calculateCostCalculatorOtherMaterial(layerRow) {
      const empty = {
        qty: 0,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        cost: 0,
        error: null,
        formulaId: null,
        dimensionId: null,
        wastagePercent: DEFAULT_WASTAGE_PERCENT,
        rateUOM: "",
        uom: ""
      };
      const fg = getCostCalculatorFinishedGood();
      if (!fg || !layerRow) return empty;
      if (!layerRow.otherRawMaterialId) return empty;
      const material = getOtherRawMaterial(layerRow.otherRawMaterialId);
      const ply = Number(fg?.ply);
      if (!material) {
        return { ...empty, error: "This material does not exist in the Other Raw Material Master." };
      }
      const formula = getOtherMaterialQtyFormula(material);
      if (!formula || !formula.isActive) {
        return { ...empty, error: "Formula not configured for " + material.name + ". Set Default Quantity Formula on the Other Raw Material master." };
      }
      const rateRow = getOtherMaterialRate(material.id);
      const masterRate = Number(rateRow?.rate);
      if (!rateRow) {
        return { ...empty, error: "No rate configured for other material " + (material.code || material.id) };
      }
      if (!Number.isFinite(masterRate) || masterRate <= 0) {
        return { ...empty, error: "Invalid rate: " + (rateRow?.rate ?? "missing") + ". Rate must be > 0." };
      }
      const wastageRaw = resolveVariableValue("WASTAGE", fg, DEFAULT_WASTAGE_PERCENT);
      const wastage = Number.isFinite(Number(wastageRaw)) ? Number(wastageRaw) : DEFAULT_WASTAGE_PERCENT;
      const link = findCostCalculatorOtherMaterialLink(material.id, ply, fg);
      const calcContext = { finishedGood: fg, useEnteredDimensions: true };
      const line = calculateOtherMaterialCost({
        otherRawMaterialId: material.id,
        layer: layerRow.layer,
        calculationMethod: "formula",
        formulaId: formula.id,
        dimensionId: link ? link.dimensionId : null,
        manualQty: null,
        wastagePercent: wastage,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      }, calcContext);
      if (line.error) {
        return {
          ...empty,
          error: formatCostCalculatorFormulaError(line.error),
          formulaId: formula.id,
          dimensionId: link ? link.dimensionId : null,
          wastagePercent: wastage
        };
      }
      return {
        qty: line.grossQty,
        netQty: line.netQty,
        grossQty: line.grossQty,
        rate: line.rate,
        cost: line.costPerPiece,
        error: null,
        formulaId: formula.id,
        dimensionId: link ? link.dimensionId : null,
        wastagePercent: wastage,
        rateUOM: rateRow?.rateUOM || "",
        uom: material.uom
      };
    }

    function calculateCostCalculatorMaterial(layerRow) {
      const empty = {
        qty: 0,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        cost: 0,
        coveredArea: 0,
        error: null,
        formulaId: null,
        dimensionId: null,
        wastagePercent: DEFAULT_WASTAGE_PERCENT,
        rateUOM: "",
        uom: "",
        usedServiceL: false,
        usedServiceW: false,
        serviceL: null,
        serviceW: null,
        serviceLCode: null,
        serviceWCode: null,
        dimWarnings: []
      };
      const fg = getCostCalculatorFinishedGood();
      if (!fg || !layerRow) return empty;
      if (!layerRow.rawMaterialId) return empty;
      const material = getRawMaterial(layerRow.rawMaterialId);
      const ply = Number(fg?.ply);
      if (!material) {
        return { ...empty, error: "This material does not exist in the Raw Material Master." };
      }
      const link = findCostCalculatorMaterialLink(material.id, ply, fg);
      const formula = getMaterialQtyFormula(material);
      if (!formula || !formula.isActive) {
        return { ...empty, error: "Formula not configured for " + material.name + ". Set Default Quantity Formula on the Raw Material master." };
      }
      const rateRow = getMaterialRate(material.id);
      const masterRate = Number(rateRow?.rate);
      if (!rateRow) {
        return { ...empty, error: "No rate configured for material " + (material.code || material.id) };
      }
      if (!Number.isFinite(masterRate) || masterRate <= 0) {
        return { ...empty, error: "Invalid rate: " + (rateRow?.rate ?? "missing") + ". Rate must be > 0." };
      }
      const wastageRaw = resolveVariableValue("WASTAGE", fg, DEFAULT_WASTAGE_PERCENT);
      const wastage = Number.isFinite(Number(wastageRaw)) ? Number(wastageRaw) : DEFAULT_WASTAGE_PERCENT;
      const styleUsage = resolveStyleServiceDimUsage(fg);
      const calcContext = { finishedGood: fg, useEnteredDimensions: true };
      const line = calculateMaterialCost({
        rawMaterialId: material.id,
        layer: layerRow.layer,
        calculationMethod: "formula",
        formulaId: formula.id,
        dimensionId: link ? link.dimensionId : null,
        manualQty: null,
        wastagePercent: wastage,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      }, calcContext);
      if (line.error) {
        return {
          ...empty,
          error: formatCostCalculatorFormulaError(line.error),
          formulaId: formula.id,
          dimensionId: link ? link.dimensionId : null,
          wastagePercent: wastage,
          dimWarnings: styleUsage.warnings
        };
      }
      const variables = buildFormulaVariables(fg, material, wastage, null, formula);
      const areaEval = evaluateCoveredAreaValue(fg);
      return {
        qty: line.grossQty,
        netQty: line.netQty,
        grossQty: line.grossQty,
        rate: line.rate,
        cost: line.costPerPiece,
        coveredArea: areaEval.success ? roundTo(areaEval.result, 2) : 0,
        error: null,
        formulaId: formula.id,
        dimensionId: link ? link.dimensionId : null,
        wastagePercent: wastage,
        rateUOM: rateRow?.rateUOM || "",
        uom: material.uom,
        usedServiceL: styleUsage.useL,
        usedServiceW: styleUsage.useW,
        serviceL: styleUsage.serviceL,
        serviceW: styleUsage.serviceW,
        serviceLCode: styleUsage.serviceLCode,
        serviceWCode: styleUsage.serviceWCode,
        dimWarnings: styleUsage.warnings
      };
    }

    function calculateCostCalculatorService(serviceRow) {
      const empty = {
        qty: 0,
        rate: 0,
        cost: 0,
        error: null,
        formulaId: null,
        dimensionId: null,
        rateUOM: "",
        uom: ""
      };
      const fg = getCostCalculatorFinishedGood();
      if (!fg || !serviceRow || !serviceRow.serviceId) return empty;
      const service = getService(serviceRow.serviceId);
      if (!service) {
        return { ...empty, error: "This service does not exist in the Service Master." };
      }
      const finishing = Boolean(serviceRow.finishing);
      if (finishing && !isActiveFinishingService(service)) {
        return { ...empty, error: "Only active Finishing services can be used in Cost Calculator." };
      }
      if (!finishing && !isActiveGeneralService(service)) {
        return { ...empty, error: "Only active General services can be used in Cost Calculator." };
      }
      const calcContext = { finishedGood: fg, useEnteredDimensions: true };
      const line = calculateServiceCost({
        serviceId: service.id,
        calculationMethod: serviceRow.calculationMethod === "manual" ? "manual" : "formula",
        formulaId: serviceRow.formulaId,
        dimensionId: serviceRow.dimensionId,
        manualQty: serviceRow.manualQty,
        manualRate: serviceRow.manualRate,
        useCustomDimensions: serviceRow.useCustomDimensions,
        customLength: serviceRow.customLength,
        customWidth: serviceRow.customWidth,
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      }, calcContext);
      const rateRow = getServiceRate(service.id);
      if (line.error) {
        return {
          ...empty,
          error: formatCostCalculatorFormulaError(line.error),
          formulaId: line.formulaId || serviceRow.formulaId || null,
          dimensionId: serviceRow.dimensionId || null
        };
      }
      return {
        qty: line.quantity,
        rate: line.rate,
        cost: line.costPerPiece,
        error: null,
        formulaId: line.formulaId || serviceRow.formulaId || null,
        dimensionId: serviceRow.dimensionId || null,
        rateUOM: rateRow?.rateUOM || "",
        uom: service.uom
      };
    }

    function calculateCostCalculatorAdditionalMaterial(row) {
      const empty = {
        qty: 0,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        cost: 0,
        error: null,
        formulaId: null,
        dimensionId: null,
        rateUOM: "",
        uom: "",
        wastagePercent: DEFAULT_WASTAGE_PERCENT
      };
      const fg = getCostCalculatorFinishedGood();
      if (!fg || !row || !row.rawMaterialId) return empty;
      const material = getRawMaterial(row.rawMaterialId);
      if (!material) {
        return { ...empty, error: "This material does not exist in the Raw Material Master." };
      }
      const line = calculateMaterialCost({
        rawMaterialId: material.id,
        layer: row.layer || "Additional",
        calculationMethod: row.calculationMethod === "manual" ? "manual" : "formula",
        formulaId: row.formulaId,
        dimensionId: row.dimensionId,
        manualQty: row.manualQty,
        manualRate: row.manualRate,
        wastagePercent: row.wastagePercent != null ? row.wastagePercent : DEFAULT_WASTAGE_PERCENT,
        useCustomDimensions: Boolean(row.useCustomDimensions),
        customLength: row.customLength,
        customWidth: row.customWidth,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      }, { finishedGood: fg, useEnteredDimensions: true });
      const rateRow = getMaterialRate(material.id);
      if (line.error) {
        return {
          ...empty,
          error: formatCostCalculatorFormulaError(line.error),
          formulaId: line.formulaId || row.formulaId || null,
          dimensionId: row.dimensionId || null,
          wastagePercent: row.wastagePercent != null ? row.wastagePercent : DEFAULT_WASTAGE_PERCENT
        };
      }
      return {
        qty: line.grossQty,
        netQty: line.netQty,
        grossQty: line.grossQty,
        rate: line.rate,
        cost: line.costPerPiece,
        error: null,
        formulaId: line.formulaId || row.formulaId || null,
        dimensionId: row.dimensionId || null,
        rateUOM: rateRow?.rateUOM || "",
        uom: material.uom,
        wastagePercent: line.wastagePercent
      };
    }

    function updateCostCalculatorSummary() {
      const layers = (state.costCalculator.layers || []).map((row) => {
        const calc = calculateCostCalculatorMaterial(row);
        return { ...row, calc };
      });
      const otherLayers = (state.costCalculator.otherLayers || []).map((row) => {
        const calc = calculateCostCalculatorOtherMaterial(row);
        return { ...row, calc };
      });
      const services = (state.costCalculator.services || []).map((row) => {
        const calc = calculateCostCalculatorService(row);
        return { ...row, calc };
      });
      const finishingServices = (state.costCalculator.finishingServices || []).map((row) => {
        const calc = calculateCostCalculatorService({ ...row, finishing: true });
        return { ...row, calc };
      });
      const additionalMaterials = (state.costCalculator.additionalMaterials || []).map((row) => {
        const calc = calculateCostCalculatorAdditionalMaterial(row);
        return { ...row, calc };
      });
      const additionalServices = (state.costCalculator.additionalServices || []).map((row) => {
        const calc = calculateCostCalculatorService(row);
        return { ...row, calc };
      });
      const lineCost = (row) => Number(row && row.calc && row.calc.cost || 0);
      const plyNonConsumableCost = roundTo(layers.reduce((sum, row) => {
        if (!row.rawMaterialId || isConsumableRawMaterial(row.rawMaterialId)) return sum;
        return sum + lineCost(row);
      }, 0), 2);
      const plyConsumableCost = roundTo(layers.reduce((sum, row) => {
        if (!row.rawMaterialId || !isConsumableRawMaterial(row.rawMaterialId)) return sum;
        return sum + lineCost(row);
      }, 0), 2);
      const additionalConsumableCost = roundTo(additionalMaterials.reduce((sum, row) => {
        if (!row.rawMaterialId || !isConsumableRawMaterial(row.rawMaterialId)) return sum;
        return sum + lineCost(row);
      }, 0), 2);
      const additionalNonConsumableCost = roundTo(additionalMaterials.reduce((sum, row) => {
        if (!row.rawMaterialId || isConsumableRawMaterial(row.rawMaterialId)) return sum;
        return sum + lineCost(row);
      }, 0), 2);
      const additionalServiceCost = roundTo(additionalServices.reduce((sum, row) => sum + lineCost(row), 0), 2);
      const materialCost = roundTo(plyNonConsumableCost + additionalNonConsumableCost, 2);
      const additionalMaterialCost = roundTo(plyConsumableCost + additionalConsumableCost, 2);
      const otherMaterialCost = additionalMaterialCost;
      const additionalSectionCost = roundTo(additionalMaterials.reduce((sum, row) => sum + lineCost(row), 0) + additionalServiceCost, 2);
      const serviceCost = roundTo(services.reduce((sum, row) => sum + lineCost(row), 0), 2);
      const finishingCost = roundTo(finishingServices.reduce((sum, row) => sum + lineCost(row), 0), 2);
      const colorCost = hasCostCalculatorColorCost()
        ? roundTo(Number(state.costCalculator.ccNumberOfColors) * Number(state.costCalculator.ccColorRate), 2)
        : 0;
      const perPiece = roundTo(materialCost + serviceCost + finishingCost + colorCost, 2);
      const packCosts = computeExcelFinalCostPack(
        materialCost,
        serviceCost,
        finishingCost,
        state.costCalculator.ccOrderQuantity
      );
      const totalOrderCost = hasCostCalculatorOrderQuantity()
        // Known simplification: box/kg are multiplied as-is (no conversion to pieces).
        ? roundTo(perPiece * Number(state.costCalculator.ccOrderQuantity), 2)
        : null;
      const materialsComplete = layers.length > 0 && layers.every((row) => row.rawMaterialId && !row.calc.error);
      const otherError = otherLayers.find((row) => row.otherRawMaterialId && row.calc.error);
      const serviceError = services.find((row) => row.calc.error);
      const finishingError = finishingServices.find((row) => row.calc.error);
      const additionalMaterialError = additionalMaterials.find((row) => row.calc.error);
      const additionalServiceError = additionalServices.find((row) => row.calc.error);
      return {
        layers,
        otherLayers,
        services,
        finishingServices,
        additionalMaterials,
        additionalServices,
        materialCost,
        additionalMaterialCost,
        otherMaterialCost,
        additionalSectionCost,
        additionalSectionHasErrors: Boolean(additionalMaterialError || additionalServiceError),
        serviceCost,
        finishingCost,
        colorCost,
        perPiece,
        per1: packCosts.per1,
        per100: packCosts.per100,
        per500: packCosts.per500,
        per1000: packCosts.per1000,
        given: packCosts.given,
        batchFinal: packCosts.batchFinal,
        totalOrderCost,
        materialsComplete,
        canSave: materialsComplete && !otherError && !serviceError && !finishingError && !additionalMaterialError && !additionalServiceError,
        saveError: !layers.length
          ? "Select ply and materials before saving."
          : (!materialsComplete ? "Select a valid material for each layer before saving." : (otherError ? otherError.calc.error : (serviceError ? serviceError.calc.error : (finishingError ? finishingError.calc.error : (additionalMaterialError ? additionalMaterialError.calc.error : (additionalServiceError ? additionalServiceError.calc.error : ""))))))
      };
    }

    function applyCostCalculatorCostingExtrasFromDom() {
      const colorsEl = document.getElementById("cc-number-of-colors");
      const rateEl = document.getElementById("cc-color-rate");
      const qtyEl = document.getElementById("cc-order-quantity");
      const uomEl = document.getElementById("cc-order-quantity-uom");
      if (!colorsEl && !rateEl && !qtyEl && !uomEl) return;
      if (colorsEl) {
        state.costCalculator.ccNumberOfColors = colorsEl.value
          ? storedBomColorCount(colorsEl.value)
          : null;
      }
      if (rateEl) {
        state.costCalculator.ccColorRate = rateEl.value === ""
          ? null
          : storedBomOptionalNumber(rateEl.value);
      }
      if (qtyEl) {
        state.costCalculator.ccOrderQuantity = qtyEl.value === ""
          ? null
          : storedBomOptionalNumber(qtyEl.value, { places: 4 });
      }
      if (uomEl) {
        state.costCalculator.ccOrderQuantityUOM = storedBomOrderQuantityUom(uomEl.value || "pieces");
      }
    }

    function refreshCostCalculatorFromCostingExtras(focusId, caret) {
      applyCostCalculatorCostingExtrasFromDom();
      persistCostCalculatorState();
      updateCostCalculatorSummary();
      renderCostCalculator();
      refreshIcons();
      if (focusId === "cc-color-rate" || focusId === "cc-order-quantity" || focusId === "cc-number-of-colors") {
        restoreBomSummaryFieldFocus(focusId, caret);
      } else if (focusId) {
        const next = document.getElementById(focusId);
        if (next) next.focus();
      }
    }

    function bindCostCalculatorCostingExtras() {
      const colorsEl = document.getElementById("cc-number-of-colors");
      const rateEl = document.getElementById("cc-color-rate");
      const qtyEl = document.getElementById("cc-order-quantity");
      const uomEl = document.getElementById("cc-order-quantity-uom");
      if (colorsEl) {
        colorsEl.addEventListener("input", (event) => {
          refreshCostCalculatorFromCostingExtras("cc-number-of-colors", event.target.selectionStart);
        });
      }
      if (rateEl) {
        rateEl.addEventListener("input", (event) => {
          refreshCostCalculatorFromCostingExtras("cc-color-rate", event.target.selectionStart);
        });
      }
      if (qtyEl) {
        qtyEl.addEventListener("input", (event) => {
          refreshCostCalculatorFromCostingExtras("cc-order-quantity", event.target.selectionStart);
        });
      }
      if (uomEl) {
        uomEl.addEventListener("change", () => refreshCostCalculatorFromCostingExtras("cc-order-quantity-uom"));
      }
    }

    function renderCostCalculatorMaterialDimHint(calc) {
      if (!calc) return "";
      const parts = [];
      const tips = [];
      if (calc.usedServiceL) {
        parts.push("Area Length = " + formatFormulaResult(calc.serviceL));
        tips.push("This material qty uses Area Length from style formula " + (calc.serviceLCode || ""));
      }
      if (calc.usedServiceW) {
        parts.push("Area Width = " + formatFormulaResult(calc.serviceW));
        tips.push("This material qty uses Area Width from style formula " + (calc.serviceWCode || ""));
      }
      if (!parts.length) return "";
      return `<span class="cc-dim-override" title="${escapeHtml(tips.join(" "))}">[Using ${escapeHtml(parts.join(", "))}]</span>`;
    }

    function formatCostCalculatorRequiredQty() {
      return hasCostCalculatorOrderQuantity()
        ? formatQty(Number(state.costCalculator.ccOrderQuantity))
        : "—";
    }

    function formatCostCalculatorLineTotal(costPerPiece, hasError) {
      return formatCostTimesQuantity(
        costPerPiece,
        state.costCalculator.ccOrderQuantity,
        hasError
      );
    }

    function renderCostCalculatorOrderSubtotalFooter(costPerPiece, hasError) {
      const pieceSubtotal = hasError
        ? `<span class="calc-error-cost">Error</span>`
        : formatRupees(Number(costPerPiece) || 0);
      return `
        <tfoot>
          <tr class="cc-subtotal-row">
            <th colspan="6">Subtotal</th>
            <td class="cc-layer-num">${pieceSubtotal}</td>
            <td class="cc-layer-num">${formatCostCalculatorLineTotal(costPerPiece, hasError)}</td>
            <td></td>
          </tr>
        </tfoot>
      `;
    }

    function renderCostCalculatorLayerCard(row, index, materials, steps) {
      const material = getRawMaterial(row.rawMaterialId);
      const calc = row.calc || {};
      const formula = material ? getMaterialQtyFormula(material) : null;
      const formulaLabel = formula ? formula.name : "—";
      const autoDims = getAutoQuantityLW(getCostCalculatorFinishedGood(), calc.dimensionId);
      return `
        <div class="cc-layer">
          <div class="cc-layer-head">
            <div class="cc-layer-title">${escapeHtml(row.layer)}</div>
          </div>
          <label class="form-label" for="cc-layer-mat-${index}">Material</label>
          <select id="cc-layer-mat-${index}" class="full-select" data-cc-layer-material="${escapeHtml(row.layer)}" ${steps.hasPly ? "" : "disabled"} aria-label="${escapeHtml(row.layer)} material">
            <option value="">Select Material</option>
            ${materials.map((item) => `
              <option value="${item.id}" ${Number(row.rawMaterialId) === item.id ? "selected" : ""}>${escapeHtml(item.name)} (${escapeHtml(item.code)})</option>
            `).join("")}
          </select>
          ${calc.error ? `<div class="field-error">${escapeHtml(calc.error)}</div>` : ""}
          ${(calc.dimWarnings || []).map((msg) => `<div class="field-error cc-dim-warn">${escapeHtml(msg)}</div>`).join("")}
          ${row.rawMaterialId ? `
            <div class="cc-layer-facts">
              <div><span>Dimension</span><strong>${autoDims ? renderLengthWidthArea(autoDims.L, autoDims.W) : "—"}</strong></div>
              <div><span>Covered Area</span><strong>${!calc.error ? formatQty(calc.coveredArea) + " sq.inch" : "—"}</strong></div>
            </div>
            <div class="table-wrap cc-layer-metrics-wrap">
              <table class="data-table cc-grid-table cc-layer-metrics">
                <thead>
                  <tr>
                    <th>Calculation</th>
                    <th>Formula</th>
                    <th>Net Qty</th>
                    <th>Wastage %</th>
                    <th>Gross Qty</th>
                    <th>Required Qty</th>
                    <th>Rate</th>
                    <th title="${escapeHtml(FIXED_COST_FORMULAS.lineCost.description)}">Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Formula</td>
                    <td>${renderFormulaNameWithQty(formulaLabel, calc.error ? "—" : formatQty(calc.grossQty), formulaHelpButton("cc-material", row.layer, "Explain quantity"))}</td>
                    <td class="cc-layer-num">${calc.error ? "—" : formatQty(calc.netQty)}</td>
                    <td class="cc-layer-num">${calc.error ? "—" : formatDecimal(calc.wastagePercent, 2, false)}</td>
                    <td class="cc-layer-num">${calc.error ? "—" : formatQty(calc.grossQty)}</td>
                    <td class="cc-layer-num cc-layer-emphasis">${formatCostCalculatorRequiredQty()}</td>
                    <td class="cc-layer-num">${material && !calc.error ? formatRatePkr(calc.rate, calc.rateUOM || (getMaterialRate(material.id) && getMaterialRate(material.id).rateUOM)) : "—"}</td>
                    <td class="cc-layer-num">${calc.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(calc.cost)}</td>
                    <td class="cc-layer-num cc-layer-emphasis">${formatCostCalculatorLineTotal(calc.cost, calc.error)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : `<p class="stat-hint">Select a material for this ply layer. Calculation details become available after a material is chosen.</p>`}
        </div>
      `;
    }

    function renderCostCalculator() {
      const page = document.getElementById("page-cost-calculator");
      if (!page) return;
      const cc = state.costCalculator;
      const steps = getCostCalculatorStepState();
      if (steps.hasPly) {
        loadCostCalculatorOtherLayers();
      }
      if (ensureCostCalculatorGeneralServices()) persistCostCalculatorState();
      const summary = updateCostCalculatorSummary();
      const ccHasCalcErrors = summary.layers.some((row) => row.calc.error)
        || summary.otherLayers.some((row) => row.calc.error)
        || (summary.additionalMaterials || []).some((row) => row.calc.error)
        || (summary.additionalServices || []).some((row) => row.calc.error)
        || summary.services.some((row) => row.calc.error)
        || summary.finishingServices.some((row) => row.calc.error);
      const styleOptions = styles.slice().sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
      const selectedStyle = styleOptions.find((item) => item.id === Number(cc.styleId)) || null;
      const materials = steps.hasPly ? getCostCalculatorMaterials(steps.ply) : [];
      const styleTableBody = selectedStyle
        ? `
          <tr class="cc-style-selected">
            <td>1</td>
            <td>${escapeHtml(selectedStyle.name)}</td>
            <td class="cc-style-desc">${escapeHtml(selectedStyle.description || "—")}</td>
            <td>${getStyleVariables(selectedStyle.id).length}</td>
            <td>${getStyleFormulaLinks(selectedStyle.id).length}</td>
            <td>${statusBadge(selectedStyle.status)}</td>
          </tr>
        `
        : emptyRow(6, "Select a style from the list to continue.");

      const plyDisplayOrder = ["Top Liner", "Bottom Liner", "Inner Liner"];
      const orderedLayers = Number(steps.ply) === 3
        ? plyDisplayOrder
            .map((name) => summary.layers.find((row) => row.layer === name))
            .filter(Boolean)
            .concat(summary.layers.filter((row) => !plyDisplayOrder.includes(row.layer)))
        : summary.layers;
      const layerRows = orderedLayers
        .map((row, index) => renderCostCalculatorLayerCard(row, index, materials, steps))
        .join("");

      const additionalRows = renderCostCalculatorAdditionalMaterials(summary);
      const serviceRows = renderCostCalculatorServices(summary, steps);
      const finishingRows = renderCostCalculatorFinishingServices(summary);

      page.innerHTML = `
        <div class="toolbar">
          <div>
            <div class="section-kicker">Estimate</div>
            <div class="section-title">Cost Calculator</div>
          </div>
        </div>
        <div class="cost-calc">
          <div class="cost-calc-main">
            <section class="card cc-card">
              <div class="card-body">
                <div class="section-head" style="margin-top:0;">
                  <div>
                    <div class="cc-step">Step 1: Select Style</div>
                    <div class="section-title">Designs</div>
                  </div>
                  <button type="button" class="btn btn-primary" id="btn-cc-add-style">
                    <i data-lucide="plus"></i> Add Style
                  </button>
                </div>
                <div id="cc-style-picker-root"></div>
                <div class="table-wrap" style="margin-top:14px;">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Style</th>
                        <th>Description</th>
                        <th>Variables</th>
                        <th>Formulas</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>${styleTableBody}</tbody>
                  </table>
                </div>
              </div>
            </section>

            <section class="card cc-card">
              <div class="card-body">
                <div class="cc-step">Step 2: Enter Dimensions</div>
                <div class="cc-dim-grid">
                  <div>
                    <label class="form-label" for="calc-length">Length</label>
                    <div class="cc-input-unit">
                      <input type="number" id="calc-length" class="full-search" min="0.1" max="99999" step="0.01" placeholder="Enter length" value="${cc.L === "" || cc.L == null ? "" : escapeHtml(cc.L)}" ${steps.hasStyle ? "" : "disabled"} aria-label="Length in inches" />
                      <span>inch</span>
                    </div>
                  </div>
                  <div>
                    <label class="form-label" for="calc-width">Width</label>
                    <div class="cc-input-unit">
                      <input type="number" id="calc-width" class="full-search" min="0.1" max="99999" step="0.01" placeholder="Enter width" value="${cc.W === "" || cc.W == null ? "" : escapeHtml(cc.W)}" ${steps.hasStyle ? "" : "disabled"} aria-label="Width in inches" />
                      <span>inch</span>
                    </div>
                  </div>
                  <div>
                    <label class="form-label" for="calc-height">Height</label>
                    <div class="cc-input-unit">
                      <input type="number" id="calc-height" class="full-search" min="0.1" max="99999" step="0.01" placeholder="Enter height" value="${cc.H === "" || cc.H == null ? "" : escapeHtml(cc.H)}" ${steps.hasStyle ? "" : "disabled"} aria-label="Height in inches" />
                      <span>inch</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="card cc-card">
              <div class="card-body">
                <div class="cc-step">Step 3: Select Ply</div>
                <div class="cc-ply-tabs" role="radiogroup" aria-label="Ply count">
                  ${[1, 2, 3].map((ply) => `
                    <button type="button" class="cc-ply-btn ${Number(cc.ply) === ply ? "active" : ""}" role="radio" aria-checked="${Number(cc.ply) === ply ? "true" : "false"}" data-cc-ply="${ply}" ${steps.hasDims ? "" : "disabled"}>${ply}-Ply</button>
                  `).join("")}
                </div>
                ${plyLayerMappingHint()}
              </div>
            </section>

            <div id="cc-style-formulas-root">${cc.styleFormulasOpen && steps.hasDims ? renderCostCalculatorStyleFormulasMarkup() : ""}</div>

            <section class="card cc-card">
              <div class="card-body">
                <div class="cc-step">Step 4: Select Raw Materials</div>
                <p class="stat-hint" style="margin:0 0 12px;">One material slot per ${escapeHtml(String(steps.ply || ""))}-ply structural layer.</p>
                ${steps.hasPly ? (layerRows || `<p class="stat-hint">No layers for this ply.</p>`) : `<p class="stat-hint">Complete style, dimensions, and ply to load material layers.</p>`}
                ${steps.hasPly ? `<div class="cc-total-line"><span>Total Material Cost</span><strong>${formatRupees(summary.materialCost)}</strong></div>` : ""}
              </div>
            </section>

            <section class="card cc-card">
              <div class="card-body">
                <div class="cc-step">Step 5: Additional materials</div>
                <div class="section-head" style="margin-top:0;">
                  <div>
                    <div class="section-title">Additional materials</div>
                    <p class="stat-hint" style="margin:0;">Add Block, Film, Plate, and similar items here. New lines load from Raw Material Master. Leftover raw-material lines that are not ply slots stay until you delete them.</p>
                  </div>
                  <button type="button" class="btn btn-primary" id="btn-cc-add-additional-material" ${steps.hasPly ? "" : "disabled"}>
                    <i data-lucide="plus"></i> Add Material
                  </button>
                </div>
                ${additionalRows}
                <div class="cc-total-line"><span>Total Additional Materials Cost</span><strong>${summary.additionalSectionHasErrors ? "Error" : formatRupees(summary.additionalSectionCost)}</strong></div>
              </div>
            </section>

            <section class="card cc-card">
              <div class="card-body">
                <div class="section-head" style="margin-top:0;">
                  <div>
                    <div class="cc-step">Step 6: Select Packaging Services</div>
                    <div class="section-title">Conversion steps</div>
                  </div>
                  <button type="button" class="btn btn-primary" id="btn-cc-add-service" ${steps.hasPly ? "" : "disabled"}>
                    <i data-lucide="plus"></i> Add Services
                  </button>
                </div>
                ${serviceRows}
              </div>
            </section>

            <section class="card cc-card">
              <div class="card-body">
                <div class="section-head" style="margin-top:0;">
                  <div>
                    <div class="cc-step">Step 7: Finishing Services</div>
                    <div class="section-title">Finishing steps</div>
                  </div>
                  <button type="button" class="btn btn-primary" id="btn-cc-add-finishing-service" ${steps.hasPly ? "" : "disabled"}>
                    <i data-lucide="plus"></i> Add Finishing Service
                  </button>
                </div>
                ${finishingRows}
              </div>
            </section>
          </div>

          <aside class="card cc-card cost-calc-summary" id="cost-calc-print">
            <div class="card-body">
              <div class="section-title" style="margin-bottom:12px;">Final Cost Summary</div>
              ${ccHasCalcErrors
                ? `<div class="field-error" style="margin-bottom:8px;">⚠ Error calculating cost</div>`
                : ""}
              <div class="form-grid two cost-optional-row">
                <div class="cost-optional-field">
                  <label class="form-label" for="cc-number-of-colors">Number of Colors</label>
                  <input class="wastage-input" type="text" inputmode="numeric" id="cc-number-of-colors" value="${escapeHtml(cc.ccNumberOfColors == null || cc.ccNumberOfColors === "" ? "" : String(cc.ccNumberOfColors))}" placeholder="Optional" aria-label="Number of colors" />
                </div>
                <div class="cost-optional-field">
                  <label class="form-label" for="cc-color-rate">Rate per Color (Rs.)</label>
                  <input class="wastage-input" type="number" min="0" max="999999.99" step="0.01" id="cc-color-rate" value="${escapeHtml(cc.ccColorRate == null || cc.ccColorRate === "" ? "" : formatDecimal(cc.ccColorRate, 2, false))}" placeholder="Optional" aria-label="Rate per color in rupees" />
                </div>
              </div>
              <div class="form-grid two cost-optional-row">
                <div class="cost-optional-field">
                  <label class="form-label" for="cc-order-quantity">Order Quantity</label>
                  <input class="wastage-input" type="number" min="0" max="999999" step="1" id="cc-order-quantity" value="${escapeHtml(cc.ccOrderQuantity == null || cc.ccOrderQuantity === "" ? "" : formatDecimal(cc.ccOrderQuantity, 4, false))}" placeholder="Optional" aria-label="Order quantity" />
                </div>
                <div class="cost-optional-field">
                  <label class="form-label" for="cc-order-quantity-uom">Unit</label>
                  <select id="cc-order-quantity-uom" class="full-select" aria-label="Order quantity unit">
                    ${finishedGoodUomOptions(cc.ccOrderQuantityUOM || "pieces")}
                  </select>
                </div>
              </div>
              <div class="cc-summary-line"><span>Material Per Piece Cost</span><strong>${formatRupees(summary.materialCost)}</strong></div>
              <div class="cc-summary-line">${labeledFixedFormula("Material Total Cost", FIXED_COST_FORMULAS.materialTotal.formula, FIXED_COST_FORMULAS.materialTotal.description)}<strong>${formatCostTimesQuantity(summary.materialCost, state.costCalculator.ccOrderQuantity, ccHasCalcErrors)}</strong></div>
              <div class="cc-summary-line"><span>Service Per Piece Cost</span><strong>${formatRupees(summary.serviceCost)}</strong></div>
              <div class="cc-summary-line"><span>Service Total Cost</span><strong>${formatStep6LineTotal(summary.serviceCost, ccHasCalcErrors)}</strong></div>
              <div class="cc-summary-line"><span>Finishing Services Per Piece Cost</span><strong>${formatRupees(summary.finishingCost)}</strong></div>
              <div class="cc-summary-line">${labeledFixedFormula("Finishing Services Total Cost", FIXED_COST_FORMULAS.finishingTotal.formula, FIXED_COST_FORMULAS.finishingTotal.description)}<strong>${formatCostTimesQuantity(summary.finishingCost, state.costCalculator.ccOrderQuantity, ccHasCalcErrors)}</strong></div>
              ${summary.colorCost > 0 ? `<div class="cc-summary-line">${labeledFixedFormula("Color Printing Cost", FIXED_COST_FORMULAS.colorCost.formula, FIXED_COST_FORMULAS.colorCost.description)}<strong>${formatRupees(summary.colorCost)}</strong></div>` : ""}
              <div class="cc-summary-line cc-summary-total">${labeledFixedFormula("Final Cost", FIXED_COST_FORMULAS.finalCostCalculator.formula, FIXED_COST_FORMULAS.finalCostCalculator.description)}<strong>${formatRupees(summary.batchFinal)}</strong></div>
              <div class="cc-summary-line">${labeledFixedFormula("Cost / 1 Piece", FIXED_COST_FORMULAS.per1.formula, FIXED_COST_FORMULAS.per1.description)}<strong>${formatRupees(summary.per1)}</strong></div>
              <div class="cc-summary-line">${labeledFixedFormula("Cost / 100", FIXED_COST_FORMULAS.per100.formula, FIXED_COST_FORMULAS.per100.description)}<strong>${formatRupees(summary.per100)}</strong></div>
              <div class="cc-summary-line">${labeledFixedFormula("Cost / 500", FIXED_COST_FORMULAS.per500.formula, FIXED_COST_FORMULAS.per500.description)}<strong>${formatRupees(summary.per500)}</strong></div>
              <div class="cc-summary-line">${labeledFixedFormula("Cost / 1,000", FIXED_COST_FORMULAS.per1000.formula, FIXED_COST_FORMULAS.per1000.description)}<strong>${formatRupees(summary.per1000)}</strong></div>
              <div class="cc-summary-line">${labeledFixedFormula("Cost / Given Quantity", FIXED_COST_FORMULAS.givenQuantity.formula, FIXED_COST_FORMULAS.givenQuantity.description)}<strong>${formatPackGivenCost(summary.given, ccHasCalcErrors, formatRupees)}</strong></div>
              <div class="cc-summary-line">${labeledFixedFormula("Additional Cost", FIXED_COST_FORMULAS.additionalCost.formula, FIXED_COST_FORMULAS.additionalCost.description)}<strong>${formatRupees(summary.otherMaterialCost)}</strong></div>
              <div class="cc-actions">
                <button type="button" class="btn btn-primary" id="btn-cc-save-bom" ${summary.canSave ? "" : "disabled"}>Save as BOM</button>
                <button type="button" class="btn" id="btn-cc-export-pdf">Export PDF</button>
              </div>
            </div>
          </aside>
        </div>
      `;
      bindCostCalculatorCostingExtras();
      renderCostCalculatorStylePicker();
    }

    function getBomMaterialSlotLayout(finishedGood, materials) {
      const rows = Array.isArray(materials) ? materials : [];
      const ply = getFinishedGoodPly(finishedGood);
      const layers = getStructuralLayers(ply);
      const layerSet = new Set(layers);
      const claimed = new Set();
      const slots = layers.map((layer) => ({ layer, line: null }));
      rows.forEach((item) => {
        if (!item || claimed.has(item.id)) return;
        if (!layerSet.has(item.layer)) return;
        const slot = slots.find((entry) => entry.layer === item.layer && !entry.line);
        if (!slot) return;
        slot.line = item;
        claimed.add(item.id);
      });
      const extras = rows.filter((item) => item && !claimed.has(item.id));
      return { ply, layers, slots, extras };
    }

    function getBomOtherMaterialSlotLayout(materials) {
      return getBomMaterialSlotLayout({ ply: 1 }, materials);
    }

    function warnBomMaterialSlotLayout(finishedGood, layout, source) {
      if (!layout) return;
      const emptySlots = layout.slots.filter((slot) => !slot.line).map((slot) => slot.layer);
      if (!emptySlots.length && !layout.extras.length) return;
      console.warn("BOM raw materials do not match structural ply slots", {
        source: source || "unknown",
        finishedGoodId: finishedGood && finishedGood.id,
        ply: layout.ply,
        expectedLayers: layout.layers,
        emptySlots,
        extraLines: layout.extras.map((line) => ({
          id: line.id,
          layer: line.layer,
          rawMaterialId: line.rawMaterialId
        }))
      });
    }

    function isBomPlyLinkedMaterial(rawMaterialId, ply) {
      return getCostCalculatorMaterials(ply).some((item) => item.id === Number(rawMaterialId));
    }

    function getBomSlotMaterialOptions(ply, selectedId) {
      const options = getCostCalculatorMaterials(ply).slice();
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getRawMaterial(id);
        if (current) options.unshift(current);
      }
      return options;
    }

    function getBomExtraMaterialOptions(selectedId) {
      const options = rawMaterials.filter((item) => item.status !== "Inactive");
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getRawMaterial(id);
        if (current) options.unshift(current);
      }
      return options;
    }

    function getBomAdditionalMaterialOptions(selectedId) {
      const options = rawMaterials.filter((item) => item.status !== "Inactive" && item.category === "Consumable");
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getRawMaterial(id);
        if (current) options.unshift(current);
      }
      return options;
    }

    function orderBomMaterialsBySlots(finishedGood, materials) {
      const layout = getBomMaterialSlotLayout(finishedGood, materials);
      return layout.slots.map((slot) => slot.line).filter(Boolean).concat(layout.extras);
    }

    function rebuildBomMaterialLine(prev, patch) {
      const draft = {
        rawMaterialId: patch.rawMaterialId,
        layer: patch.layer,
        calculationMethod: patch.calculationMethod != null ? patch.calculationMethod : (prev && prev.calculationMethod) || "formula",
        formulaId: patch.formulaId != null ? patch.formulaId : (prev ? prev.formulaId : null),
        dimensionId: Object.prototype.hasOwnProperty.call(patch, "dimensionId") ? patch.dimensionId : (prev ? prev.dimensionId : null),
        manualQty: Object.prototype.hasOwnProperty.call(patch, "manualQty") ? patch.manualQty : (prev ? prev.manualQty : null),
        manualRate: Object.prototype.hasOwnProperty.call(patch, "manualRate") ? patch.manualRate : (prev ? prev.manualRate : null),
        wastagePercent: patch.wastagePercent != null ? patch.wastagePercent : ((prev && prev.wastagePercent) ?? DEFAULT_WASTAGE_PERCENT),
        useCustomDimensions: Object.prototype.hasOwnProperty.call(patch, "useCustomDimensions")
          ? patch.useCustomDimensions
          : Boolean(prev && prev.useCustomDimensions),
        customLength: Object.prototype.hasOwnProperty.call(patch, "customLength")
          ? patch.customLength
          : (prev ? prev.customLength : ""),
        customWidth: Object.prototype.hasOwnProperty.call(patch, "customWidth")
          ? patch.customWidth
          : (prev ? prev.customWidth : "")
      };
      applyMaterialFormulaBindings(draft);
      return calculateMaterialCost({
        id: prev && prev.id ? prev.id : nextBomLineId(),
        rawMaterialId: Number(draft.rawMaterialId),
        layer: draft.layer,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? draft.formulaId : null,
        dimensionId: draft.dimensionId ? Number(draft.dimensionId) : null,
        manualQty: draft.calculationMethod === "manual" ? draft.manualQty : null,
        manualRate: storedManualRateFromDraft(draft),
        wastagePercent: draft.wastagePercent,
        ...customDimensionFields(draft),
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      });
    }

    function assignBomSlotMaterial(layer, rawMaterialId) {
      const fg = getSelectedFinishedGood();
      if (!fg) return;
      const layout = getBomMaterialSlotLayout(fg, state.bomMaterials);
      const slot = layout.slots.find((item) => item.layer === layer);
      if (!slot) return;
      const value = rawMaterialId ? Number(rawMaterialId) : null;
      if (!value) {
        if (slot.line) {
          state.bomMaterials = state.bomMaterials.filter((line) => line.id !== slot.line.id);
          recalculateBOMCosts();
          refreshBomViews();
          persistEditorState();
        }
        return;
      }
      const next = rebuildBomMaterialLine(slot.line, { rawMaterialId: value, layer });
      if (slot.line) {
        state.bomMaterials = state.bomMaterials.map((line) => line.id === next.id ? next : line);
      } else {
        state.bomMaterials = orderBomMaterialsBySlots(fg, state.bomMaterials.concat([next]));
      }
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
      if (next.error) showNotification(next.error, "error");
      else {
        const material = getRawMaterial(next.rawMaterialId);
        showNotification((material ? material.name : "Material") + " selected for " + layer);
      }
    }

    function assignBomExtraMaterial(lineId, rawMaterialId) {
      const line = state.bomMaterials.find((item) => item.id === Number(lineId));
      if (!line) return;
      if (!rawMaterialId) {
        refreshBomViews();
        return;
      }
      const next = rebuildBomMaterialLine(line, { rawMaterialId: Number(rawMaterialId), layer: line.layer });
      state.bomMaterials = state.bomMaterials.map((item) => item.id === next.id ? next : item);
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
      if (next.error) showNotification(next.error, "error");
    }

    function getActiveServicesForBomPicker(selectedId, categoryId) {
      const options = services.filter((item) => item.status !== "Inactive" && serviceHasCategory(item, categoryId));
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getService(id);
        if (current) options.unshift(current);
      }
      return options;
    }

    function createAdditionalServiceLine(serviceId, prev) {
      const service = getService(serviceId);
      const formulaId = getServiceDefaultFormulaId(service && service.id);
      const hasFormula = Boolean(formulaId && getFormula(formulaId));
      const linkedIds = getServiceLinkedDimensionIds(service);
      const dimensionId = prev && Object.prototype.hasOwnProperty.call(prev, "dimensionId")
        ? prev.dimensionId
        : pickBomDimensionId(linkedIds, null, getSelectedFinishedGood());
      return calculateServiceCost({
        id: prev && prev.id ? prev.id : nextBomLineId(),
        serviceId: Number(serviceId),
        layer: (prev && prev.layer) || "Additional",
        calculationMethod: hasFormula ? "formula" : "manual",
        formulaId: hasFormula ? formulaId : null,
        dimensionId: dimensionId ? Number(dimensionId) : null,
        manualQty: hasFormula ? null : ((prev && prev.manualQty) || 1),
        manualRate: hasFormula ? null : (prev ? prev.manualRate : null),
        useCustomDimensions: Boolean(prev && prev.useCustomDimensions),
        customLength: prev ? prev.customLength : null,
        customWidth: prev ? prev.customWidth : null,
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      });
    }

    function addBomAdditionalService() {
      if (!getSelectedFinishedGood()) return;
      if (!getActiveServicesForBomPicker(null, "other").length) {
        showNotification("No Other services found. Mark a service as Other in Service Master first.", "error");
        refreshBomViews();
        return;
      }
      state.bomAdditionalServices = (state.bomAdditionalServices || []).concat([{
        id: nextBomLineId(),
        serviceId: null,
        layer: "Additional",
        calculationMethod: "formula",
        formulaId: null,
        dimensionId: null,
        manualQty: null,
        quantity: 0,
        rate: 0,
        costPerPiece: 0,
        error: null
      }]);
      refreshBomViews();
      persistEditorState();
    }

    function assignBomAdditionalService(lineId, serviceId) {
      const line = (state.bomAdditionalServices || []).find((item) => item.id === Number(lineId));
      if (!line) return;
      if (!serviceId) {
        state.bomAdditionalServices = state.bomAdditionalServices.map((item) => (
          item.id === line.id
            ? { ...item, serviceId: null, error: null, quantity: 0, rate: 0, costPerPiece: 0 }
            : item
        ));
        recalculateBOMCosts();
        refreshBomViews();
        persistEditorState();
        return;
      }
      const next = createAdditionalServiceLine(serviceId, line);
      state.bomAdditionalServices = state.bomAdditionalServices.map((item) => item.id === next.id ? next : item);
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
      if (next.error) showNotification(next.error, "error");
    }

    function deleteBomAdditionalService(lineId) {
      state.bomAdditionalServices = (state.bomAdditionalServices || []).filter((item) => item.id !== Number(lineId));
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
    }

    function findBomServiceLineById(lineId) {
      const id = Number(lineId);
      return state.bomServices.find((item) => item.id === id)
        || (state.bomAdditionalServices || []).find((item) => item.id === id)
        || (state.bomFinishingServices || []).find((item) => item.id === id)
        || findCostCalculatorFinishingServiceLineById(id)
        || findCostCalculatorAdditionalServiceById(id)
        || findCostCalculatorServiceLineById(id);
    }

    function warnBomOtherMaterialPlyCatalog() {
      const catalog = getBomOtherMaterialsForPly();
      if (catalog.length) return;
      console.warn("No active other raw materials found. Catalog is empty.");
    }

    function isBomPlyLinkedOtherMaterial(otherRawMaterialId, ply) {
      return getBomOtherMaterialsForPly(ply).some((item) => item.id === Number(otherRawMaterialId));
    }

    function getBomOtherSlotMaterialOptions(ply, selectedId) {
      const options = getBomOtherMaterialsForPly(ply).slice();
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getOtherRawMaterial(id);
        if (current) options.unshift(current);
      }
      return options;
    }

    function getBomOtherExtraMaterialOptions(selectedId) {
      const options = otherRawMaterials.filter((item) => item.status !== "Inactive");
      const id = Number(selectedId);
      if (id && !options.some((item) => item.id === id)) {
        const current = getOtherRawMaterial(id);
        if (current) options.unshift(current);
      }
      return options;
    }

    function rebuildBomOtherMaterialLine(prev, patch) {
      const draft = {
        otherRawMaterialId: patch.otherRawMaterialId,
        layer: patch.layer,
        calculationMethod: patch.calculationMethod != null ? patch.calculationMethod : (prev && prev.calculationMethod) || "formula",
        formulaId: patch.formulaId != null ? patch.formulaId : (prev ? prev.formulaId : null),
        dimensionId: Object.prototype.hasOwnProperty.call(patch, "dimensionId") ? patch.dimensionId : (prev ? prev.dimensionId : null),
        manualQty: Object.prototype.hasOwnProperty.call(patch, "manualQty") ? patch.manualQty : (prev ? prev.manualQty : null),
        manualRate: Object.prototype.hasOwnProperty.call(patch, "manualRate") ? patch.manualRate : (prev ? prev.manualRate : null),
        wastagePercent: patch.wastagePercent != null ? patch.wastagePercent : ((prev && prev.wastagePercent) ?? DEFAULT_WASTAGE_PERCENT)
      };
      applyOtherMaterialFormulaBindings(draft);
      return calculateOtherMaterialCost({
        id: prev && prev.id ? prev.id : nextBomLineId(),
        otherRawMaterialId: Number(draft.otherRawMaterialId),
        layer: draft.layer,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? draft.formulaId : null,
        dimensionId: draft.dimensionId ? Number(draft.dimensionId) : null,
        manualQty: draft.calculationMethod === "manual" ? draft.manualQty : null,
        manualRate: storedManualRateFromDraft(draft),
        wastagePercent: draft.wastagePercent,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      });
    }

    function assignBomOtherSlotMaterial(layer, otherRawMaterialId) {
      const fg = getSelectedFinishedGood();
      if (!fg) return;
      const layout = getBomOtherMaterialSlotLayout(state.bomOtherMaterials);
      const slot = layout.slots.find((item) => item.layer === layer);
      if (!slot) return;
      const value = otherRawMaterialId ? Number(otherRawMaterialId) : null;
      if (!value) {
        if (slot.line) {
          state.bomOtherMaterials = state.bomOtherMaterials.filter((line) => line.id !== slot.line.id);
          recalculateBOMCosts();
          refreshBomViews();
          persistEditorState();
        }
        return;
      }
      const next = rebuildBomOtherMaterialLine(slot.line, { otherRawMaterialId: value, layer });
      if (slot.line) {
        state.bomOtherMaterials = state.bomOtherMaterials.map((line) => line.id === next.id ? next : line);
      } else {
        state.bomOtherMaterials = orderBomMaterialsBySlots({ ply: 1 }, state.bomOtherMaterials.concat([next]));
      }
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
      if (next.error) showNotification(next.error, "error");
      else {
        const material = getOtherRawMaterial(next.otherRawMaterialId);
        showNotification((material ? material.name : "Other material") + " selected for " + layer);
      }
    }

    function assignBomOtherExtraMaterial(lineId, otherRawMaterialId) {
      const line = (state.bomOtherMaterials || []).find((item) => item.id === Number(lineId));
      if (!line) return;
      if (!otherRawMaterialId) {
        refreshBomViews();
        return;
      }
      const next = rebuildBomOtherMaterialLine(line, { otherRawMaterialId: Number(otherRawMaterialId), layer: line.layer });
      state.bomOtherMaterials = state.bomOtherMaterials.map((item) => item.id === next.id ? next : item);
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
      if (next.error) showNotification(next.error, "error");
    }

    function costCalculatorOtherLayerRows(summary) {
      if (summary && Array.isArray(summary.otherLayers)) return summary.otherLayers;
      if (state.costCalculator && Array.isArray(state.costCalculator.otherLayers)) {
        return state.costCalculator.otherLayers;
      }
      return [];
    }

    function openCostCalculatorServiceModal(lineId) {
      if (!getCostCalculatorStepState().hasPly) return;
      if (!lineId && !getCostCalculatorServiceOptions().length) {
        showNotification("No active General services found. Mark a service as General and Active in Service Master first.", "error");
        return;
      }
      openServiceModal(lineId, "cost-calculator");
    }

    function openCostCalculatorFinishingServiceModal(lineId) {
      if (!getCostCalculatorStepState().hasPly) return;
      if (!lineId && !getCostCalculatorFinishingServiceOptions().length) {
        showNotification("No finishing services found. Mark a service as Finishing and Active in Service Master first.", "error");
        return;
      }
      openServiceModal(lineId, "cc-finishing");
    }

    function saveCostCalculatorAsBom() {
      const summary = updateCostCalculatorSummary();
      if (!summary.canSave) {
        showNotification(summary.saveError || "Complete the calculator before saving.", "error");
        return;
      }
      const fgTemplate = getCostCalculatorFinishedGood();
      if (!fgTemplate) {
        showNotification("Style, dimensions, and ply are required.", "error");
        return;
      }
      const fg = {
        id: nextMasterId(finishedGoods),
        product: "Cost Estimate",
        variant: formatFinishedGoodSizeCode(fgTemplate.dimensions) + " " + fgTemplate.ply + "-Ply",
        style: fgTemplate.style,
        ply: fgTemplate.ply,
        dimensions: {
          L: fgTemplate?.dimensions?.L ?? 0,
          W: fgTemplate?.dimensions?.W ?? 0,
          H: fgTemplate?.dimensions?.H ?? 0
        },
        dimensionUOM: "inch",
        uom: "pieces",
        status: "Active"
      };
      fg.displayName = formatFinishedGoodDisplayName(fg);
      finishedGoods.push(fg);
      afterDataChange("finishedGoods");
      state.selectedFinishedGoodId = fg.id;
      state.searches.bomFinishedGood = "";
      state.fgSelectorOpen = false;
      state.bomMaterials = summary.layers.map((row) => calculateMaterialCost({
        id: nextBomLineId(),
        rawMaterialId: Number(row.rawMaterialId),
        layer: row.layer,
        calculationMethod: "formula",
        formulaId: row.calc.formulaId,
        dimensionId: row.calc.dimensionId,
        manualQty: null,
        wastagePercent: row.calc.wastagePercent,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      })).concat((summary.additionalMaterials || []).map((row) => calculateMaterialCost({
        id: nextBomLineId(),
        rawMaterialId: Number(row.rawMaterialId),
        layer: row.layer || "Additional",
        calculationMethod: row.calculationMethod === "manual" ? "manual" : "formula",
        formulaId: row.calculationMethod === "formula" ? (row.formulaId || (row.calc && row.calc.formulaId)) : null,
        dimensionId: row.dimensionId || (row.calc && row.calc.dimensionId) || null,
        manualQty: row.calculationMethod === "manual" ? row.manualQty : null,
        manualRate: row.calculationMethod === "manual" ? row.manualRate : null,
        wastagePercent: row.wastagePercent != null ? row.wastagePercent : ((row.calc && row.calc.wastagePercent) ?? DEFAULT_WASTAGE_PERCENT),
        useCustomDimensions: Boolean(row.useCustomDimensions),
        customLength: row.customLength,
        customWidth: row.customWidth,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      })));
      state.bomServices = summary.services.map((row) => calculateServiceCost({
        id: nextBomLineId(),
        serviceId: Number(row.serviceId),
        calculationMethod: row.calculationMethod === "manual" ? "manual" : "formula",
        formulaId: row.calculationMethod === "formula" ? (row.formulaId || (row.calc && row.calc.formulaId)) : null,
        dimensionId: row.dimensionId || (row.calc && row.calc.dimensionId) || null,
        manualQty: row.calculationMethod === "manual" ? row.manualQty : null,
        manualRate: row.calculationMethod === "manual" ? row.manualRate : null,
        useCustomDimensions: Boolean(row.useCustomDimensions),
        customLength: row.customLength,
        customWidth: row.customWidth,
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      }));
      state.bomAdditionalServices = (summary.additionalServices || []).map((row) => calculateServiceCost({
        id: nextBomLineId(),
        serviceId: Number(row.serviceId),
        layer: "Additional",
        calculationMethod: row.calculationMethod === "manual" ? "manual" : "formula",
        formulaId: row.calculationMethod === "formula" ? (row.formulaId || (row.calc && row.calc.formulaId)) : null,
        dimensionId: row.dimensionId || (row.calc && row.calc.dimensionId) || null,
        manualQty: row.calculationMethod === "manual" ? row.manualQty : null,
        manualRate: row.calculationMethod === "manual" ? row.manualRate : null,
        useCustomDimensions: Boolean(row.useCustomDimensions),
        customLength: row.customLength,
        customWidth: row.customWidth,
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      }));
      state.bomFinishingServices = (summary.finishingServices || []).map((row) => calculateServiceCost({
        id: nextBomLineId(),
        serviceId: Number(row.serviceId),
        layer: "Finishing",
        calculationMethod: row.calculationMethod === "manual" ? "manual" : "formula",
        formulaId: row.calculationMethod === "formula" ? (row.formulaId || (row.calc && row.calc.formulaId)) : null,
        dimensionId: row.dimensionId || (row.calc && row.calc.dimensionId) || null,
        manualQty: row.calculationMethod === "manual" ? row.manualQty : null,
        manualRate: row.calculationMethod === "manual" ? row.manualRate : null,
        useCustomDimensions: Boolean(row.useCustomDimensions),
        customLength: row.customLength,
        customWidth: row.customWidth,
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      }));
      state.bomOtherMaterials = costCalculatorOtherLayerRows(summary)
        .filter((row) => row && row.otherRawMaterialId)
        .map((row) => calculateOtherMaterialCost({
          id: nextBomLineId(),
          otherRawMaterialId: Number(row.otherRawMaterialId),
          layer: row.layer,
          calculationMethod: "formula",
          formulaId: row.calc && row.calc.formulaId,
          dimensionId: row.calc && row.calc.dimensionId,
          manualQty: null,
          wastagePercent: (row.calc && row.calc.wastagePercent) ?? DEFAULT_WASTAGE_PERCENT,
          netQty: 0,
          grossQty: 0,
          rate: 0,
          costPerPiece: 0
        }));
      state.bomNumberOfColors = storedBomColorCount(state.costCalculator.ccNumberOfColors);
      state.bomColorRate = storedBomOptionalNumber(state.costCalculator.ccColorRate);
      state.bomOrderQuantity = storedBomOptionalNumber(state.costCalculator.ccOrderQuantity, { places: 4 });
      state.bomOrderQuantityUOM = storedBomOrderQuantityUom(state.costCalculator.ccOrderQuantityUOM);
      recalculateBOMCosts();
      const record = persistNewDraftFromEditor(getBomNoForFinishedGood(fg), fg.id);
      showNotification("BOM " + record.bomNo + " saved as draft from Cost Calculator");
      navigateTo("bom-costing");
    }

    function costEstimatePdfFilename(styleName, date) {
      const stamp = date instanceof Date ? date : new Date();
      const style = String(styleName || "ESTIMATE")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "ESTIMATE";
      const dd = String(stamp.getDate()).padStart(2, "0");
      const mm = String(stamp.getMonth() + 1).padStart(2, "0");
      const yyyy = stamp.getFullYear();
      return "cost-estimate-" + style + "-" + dd + "-" + mm + "-" + yyyy + ".pdf";
    }

    function buildCostCalculatorPdfElement(summary, styleName, generatedAt) {
      const steps = getCostCalculatorStepState();
      const dims = steps.hasDims
        ? steps.L + " × " + steps.W + " × " + steps.H + " inch"
        : "—";
      const plyLabel = steps.hasPly ? steps.ply + "-Ply" : "—";
      const generated = generatedAt.toLocaleString();
      const materialRows = (summary.layers || []).length
        ? summary.layers.map((row) => {
            const material = getRawMaterial(row.rawMaterialId);
            const calc = row.calc || {};
            const ok = row.rawMaterialId && !calc.error;
            return `
              <tr>
                <td>${escapeHtml(row.layer)}</td>
                <td>${escapeHtml(material ? material.name : (row.rawMaterialId ? "Missing material" : "—"))}</td>
                <td class="num">${ok ? escapeHtml(formatQty(calc.qty) + (calc.uom ? " " + calc.uom : "")) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRatePkr(calc.rate, calc.rateUOM || (getMaterialRate(material && material.id) && getMaterialRate(material && material.id).rateUOM))) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRupees(calc.cost)) : (calc.error ? "Error" : "—")}</td>
              </tr>
            `;
          }).join("")
        : `<tr><td colspan="5">No materials selected.</td></tr>`;
      const additionalMaterialRows = (summary.additionalMaterials || []).length || (summary.additionalServices || []).length
        ? (summary.additionalMaterials || []).map((row) => {
            const material = getRawMaterial(row.rawMaterialId);
            const calc = row.calc || {};
            const ok = !calc.error;
            return `
              <tr>
                <td>${escapeHtml(material ? material.name : "Material")}</td>
                <td class="num">${ok ? escapeHtml(formatQty(calc.netQty) + (calc.uom ? " " + calc.uom : "")) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRatePkr(calc.rate, calc.rateUOM || (getMaterialRate(material && material.id) && getMaterialRate(material && material.id).rateUOM))) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRupees(calc.cost)) : "Error"}</td>
              </tr>
            `;
          }).join("") + (summary.additionalServices || []).map((row) => {
            const service = getService(row.serviceId);
            const calc = row.calc || {};
            const ok = !calc.error;
            return `
              <tr>
                <td>${escapeHtml(service ? service.name : "Material")}</td>
                <td class="num">${ok ? escapeHtml(formatQty(calc.qty)) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRatePkr(calc.rate, calc.rateUOM || (getServiceRate(row.serviceId) && getServiceRate(row.serviceId).rateUOM))) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRupees(calc.cost)) : "Error"}</td>
              </tr>
            `;
          }).join("")
        : `<tr><td colspan="4">No additional materials selected.</td></tr>`;
      const serviceRows = (summary.services || []).length
        ? summary.services.map((row) => {
            const service = getService(row.serviceId);
            const calc = row.calc || {};
            const ok = !calc.error;
            return `
              <tr>
                <td>${escapeHtml(service ? service.name : "Service")}</td>
                <td class="num">${ok ? escapeHtml(formatQty(calc.qty)) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRatePkr(calc.rate, calc.rateUOM || (getServiceRate(row.serviceId) && getServiceRate(row.serviceId).rateUOM))) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRupees(calc.cost)) : "Error"}</td>
              </tr>
            `;
          }).join("")
        : `<tr><td colspan="4">No services selected.</td></tr>`;
      const finishingRows = (summary.finishingServices || []).length
        ? summary.finishingServices.map((row) => {
            const service = getService(row.serviceId);
            const calc = row.calc || {};
            const ok = !calc.error;
            return `
              <tr>
                <td>${escapeHtml(service ? service.name : "Finishing Service")}</td>
                <td class="num">${ok ? escapeHtml(formatQty(calc.qty)) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRatePkr(calc.rate, calc.rateUOM || (getServiceRate(row.serviceId) && getServiceRate(row.serviceId).rateUOM))) : "—"}</td>
                <td class="num">${ok ? escapeHtml(formatRupees(calc.cost)) : "Error"}</td>
              </tr>
            `;
          }).join("")
        : `<tr><td colspan="4">No finishing services selected.</td></tr>`;
      const root = document.createElement("div");
      root.className = "cc-pdf-root";
      root.setAttribute("aria-hidden", "true");
      root.innerHTML = `
        <h1>Cost Calculator</h1>
        <div class="cc-pdf-meta">Generated ${escapeHtml(generated)}</div>
        <section class="cc-pdf-section">
          <h2>Product details</h2>
          <div class="cc-pdf-kv">
            <div>Style</div><div>${escapeHtml(styleName || "—")}</div>
            <div>Dimensions</div><div>${escapeHtml(dims)}</div>
            <div>Ply</div><div>${escapeHtml(plyLabel)}</div>
          </div>
        </section>
        <section class="cc-pdf-section">
          <h2>Materials</h2>
          <table>
            <thead>
              <tr><th>Layer</th><th>Material</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Cost</th></tr>
            </thead>
            <tbody>${materialRows}</tbody>
          </table>
        </section>
        <section class="cc-pdf-section">
          <h2>Additional materials</h2>
          <table>
            <thead>
              <tr><th>Material</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Cost</th></tr>
            </thead>
            <tbody>${additionalMaterialRows}</tbody>
          </table>
        </section>
        <section class="cc-pdf-section">
          <h2>Services</h2>
          <table>
            <thead>
              <tr><th>Service</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Cost</th></tr>
            </thead>
            <tbody>${serviceRows}</tbody>
          </table>
        </section>
        <section class="cc-pdf-section">
          <h2>Finishing services</h2>
          <table>
            <thead>
              <tr><th>Finishing Service</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Cost</th></tr>
            </thead>
            <tbody>${finishingRows}</tbody>
          </table>
        </section>
        <section class="cc-pdf-section">
          <h2>Cost summary</h2>
          <table class="cc-pdf-totals">
            <tbody>
              <tr><td>Material Per Piece Cost</td><td class="num">${escapeHtml(formatRupees(summary.materialCost))}</td></tr>
              <tr><td>Material Total Cost</td><td class="num">${formatCostTimesQuantity(summary.materialCost, state.costCalculator.ccOrderQuantity, false)}</td></tr>
              <tr><td>Service Per Piece Cost</td><td class="num">${escapeHtml(formatRupees(summary.serviceCost))}</td></tr>
              <tr><td>Service Total Cost</td><td class="num">${escapeHtml(formatRupees(roundTo((Number(summary.serviceCost) || 0) * STEP6_REQUIRED_QTY, 2)))}</td></tr>
              <tr><td>Finishing Services Per Piece Cost</td><td class="num">${escapeHtml(formatRupees(summary.finishingCost))}</td></tr>
              <tr><td>Finishing Services Total Cost</td><td class="num">${formatCostTimesQuantity(summary.finishingCost, state.costCalculator.ccOrderQuantity, false)}</td></tr>
              ${summary.colorCost > 0 ? `<tr><td>Color Printing Cost</td><td class="num">${escapeHtml(formatRupees(summary.colorCost))}</td></tr>` : ""}
              <tr><td>Final Cost</td><td class="num">${escapeHtml(formatRupees(summary.batchFinal))}</td></tr>
              <tr><td>Cost / 1 Piece</td><td class="num">${escapeHtml(formatRupees(summary.per1))}</td></tr>
              <tr><td>Cost / 100</td><td class="num">${escapeHtml(formatRupees(summary.per100))}</td></tr>
              <tr><td>Cost / 500</td><td class="num">${escapeHtml(formatRupees(summary.per500))}</td></tr>
              <tr><td>Cost / 1,000</td><td class="num">${escapeHtml(formatRupees(summary.per1000))}</td></tr>
              ${summary.given != null ? `<tr><td>Cost / Given Quantity</td><td class="num">${escapeHtml(formatRupees(summary.given))}</td></tr>` : ""}
              <tr><td>Additional Cost</td><td class="num">${escapeHtml(formatRupees(summary.otherMaterialCost))}</td></tr>
            </tbody>
          </table>
        </section>
      `;
      return root;
    }

    function exportCostCalculatorPDF() {
      const html2pdfFn = window.html2pdf;
      if (typeof html2pdfFn !== "function") {
        showNotification("PDF library failed to load. Check your connection and try again.", "error");
        return Promise.resolve();
      }
      const style = styles.find((item) => item.id === Number(state.costCalculator.styleId));
      const styleName = (style && style.name) || "ESTIMATE";
      const generatedAt = new Date();
      const filename = costEstimatePdfFilename(styleName, generatedAt);
      const summary = updateCostCalculatorSummary();
      const source = buildCostCalculatorPdfElement(summary, styleName, generatedAt);
      source.style.position = "fixed";
      source.style.left = "0";
      source.style.top = "0";
      source.style.zIndex = "-1";
      document.body.appendChild(source);
      const options = {
        margin: 10,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] }
      };
      return html2pdfFn().set(options).from(source).save()
        .then(() => {
          showNotification("PDF exported successfully: " + filename);
        })
        .catch((error) => {
          console.error("PDF export failed", error);
          showNotification("PDF export failed. Please try again.", "error");
        })
        .finally(() => {
          source.remove();
        });
    }

    function exportCostCalculatorPdf() {
      return exportCostCalculatorPDF();
    }

    function getBomServiceLines(collection) {
      if (collection === "additional") return state.bomAdditionalServices || [];
      if (collection === "finishing") return state.bomFinishingServices || [];
      if (collection === "cc-finishing") return state.costCalculator.finishingServices || [];
      if (collection === "cc-additional-service") return state.costCalculator.additionalServices || [];
      if (collection === "cost-calculator") return state.costCalculator.services || [];
      return state.bomServices || [];
    }

    function findDuplicateService(serviceId, excludeLineId, collection) {
      return getBomServiceLines(collection).find((line) =>
        line.serviceId === Number(serviceId) && line.id !== excludeLineId
      );
    }

    function getMissingStructuralLayerError(finishedGood, materials) {
      const fg = finishedGood || getSelectedFinishedGood();
      if (!fg) return "";
      const ply = Number(fg?.ply);
      const required = getStructuralLayers(ply) || [];
      if (!required.length) return "";
      const used = new Set((materials || state.bomMaterials || []).map((line) => line.layer));
      const missing = required.filter((layer) => !used.has(layer));
      if (!missing.length) return "";
      if (ply === 1) return "1-ply requires material on Single Layer";
      if (ply === 2) return "2-ply requires materials on Top Liner and Bottom Liner";
      if (ply === 3) {
        return "3-ply requires materials on Top Liner, Inner Liner, and Bottom Liner. Missing: " + missing.join(", ");
      }
      return "BOM is missing required layers: " + missing.join(", ");
    }

    function bomCalculationErrorLineName(line, kind) {
      if (!line) return "Unnamed line";
      if (kind === "material") {
        const material = getRawMaterial(line.rawMaterialId);
        if (line.layer) return String(line.layer);
        if (material && material.name) return material.name;
        if (line.rawMaterialId) return "Missing material (ID: " + line.rawMaterialId + ")";
        return "Raw material";
      }
      if (kind === "other") {
        const material = getOtherRawMaterial(line.otherRawMaterialId);
        if (line.layer) return String(line.layer);
        if (material && material.name) return material.name;
        if (line.otherRawMaterialId) return "Missing material (ID: " + line.otherRawMaterialId + ")";
        return "Other material";
      }
      const service = getService(line.serviceId);
      if (service && service.name) return service.name;
      if (line.serviceId) return "Missing service (ID: " + line.serviceId + ")";
      if (line.layer) return String(line.layer);
      return kind === "additional" ? "Additional" : "Service";
    }

    function collectBomCalculationErrors() {
      const errors = [];
      const add = (line, section, kind) => {
        if (!line || !line.error) return;
        errors.push({
          section,
          label: bomCalculationErrorLineName(line, kind),
          error: String(line.error)
        });
      };
      (state.bomMaterials || []).forEach((line) => add(line, "Raw Materials", "material"));
      (state.bomOtherMaterials || []).forEach((line) => add(line, "Other Materials", "other"));
      (state.bomServices || []).forEach((line) => add(line, "Services", "service"));
      (state.bomAdditionalServices || []).forEach((line) => add(line, "Additional Materials", "additional"));
      (state.bomFinishingServices || []).forEach((line) => add(line, "Finishing Services", "service"));
      return errors;
    }

    function currentBomHasCalculationErrors() {
      return collectBomCalculationErrors().length > 0;
    }

    function renderBomCalculationErrorBanner(errors) {
      if (!errors || !errors.length) return "";
      const items = errors.map((item) => (
        `<li>${escapeHtml(item.label)} (${escapeHtml(item.section)}): ${escapeHtml(item.error)}</li>`
      )).join("");
      return `
        <div class="field-error cost-summary-errors">
          <div>⚠ Error calculating cost — fix these first:</div>
          <ul>${items}</ul>
        </div>
      `;
    }

    function validateCurrentBom(requirePositiveCost, options) {
      const fg = getSelectedFinishedGood();
      if (!fg) return "Select a Finished Good before saving the BOM.";
      if (!state.bomMaterials.length) return "Add at least one raw material before saving the BOM.";

      const requireLayers = !options || options.requireStructuralLayers !== false;
      if (requireLayers) {
        const layerError = getMissingStructuralLayerError(fg, state.bomMaterials);
        if (layerError) return layerError;
      }

      for (const line of state.bomMaterials) {
        if (!getRawMaterial(line.rawMaterialId)) return "A BOM material does not reference a valid raw material master record.";
        if (line.calculationMethod === "formula" && !getMaterialQtyFormula(getRawMaterial(line.rawMaterialId))) return "A BOM material formula is missing or invalid. Set Default Quantity Formula on the Raw Material master.";
      }

      for (const line of state.bomOtherMaterials || []) {
        if (!getOtherRawMaterial(line.otherRawMaterialId)) return "A BOM other material does not reference a valid Other Raw Material master record.";
        if (line.calculationMethod === "formula" && !getOtherMaterialQtyFormula(getOtherRawMaterial(line.otherRawMaterialId))) return "A BOM other material formula is missing or invalid. Set Default Quantity Formula on the Other Raw Material master.";
      }

      for (const line of state.bomServices) {
        if (!getService(line.serviceId)) return "A BOM service does not reference a valid service master record.";
        if (line.calculationMethod === "formula" && !getFormula(getServiceDefaultFormulaId(line.serviceId))) return "A BOM service formula is missing or invalid. Set a formula on the active Service Rate.";
      }

      for (const line of state.bomAdditionalServices || []) {
        if (!line.serviceId) continue;
        if (!getService(line.serviceId)) return "An additional material does not reference a valid service master record.";
        if (line.calculationMethod === "formula" && !getFormula(getServiceDefaultFormulaId(line.serviceId))) return "An additional material service formula is missing or invalid. Set a formula on the active Service Rate.";
      }

      for (const line of state.bomFinishingServices || []) {
        if (!getService(line.serviceId)) return "A finishing service does not reference a valid service master record.";
        if (line.calculationMethod === "formula" && !getFormula(getServiceDefaultFormulaId(line.serviceId))) return "A finishing service formula is missing or invalid. Set a formula on the active Service Rate.";
      }

      if (currentBomHasCalculationErrors()) {
        return "Fix calculation errors before saving";
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
        finishedGoodId: fg?.id,
        finishingServiceId: state.selectedFinishingServiceId || null,
        finishedGoodName: fg?.product ?? "missing data",
        variant: fg?.variant ?? "",
        style: fg?.style ?? "",
        ply: fg?.ply,
        uom: fg?.uom,
        dimensions: getItemDimensions(fg),
        dimensionUOM: fg?.dimensionUOM,
        version: state.currentBOM.version,
        status,
        materials: state.bomMaterials,
        otherMaterials: state.bomOtherMaterials,
        services: state.bomServices,
        additionalServices: state.bomAdditionalServices,
        finishingServiceLines: state.bomFinishingServices,
        totalMaterialCost: state.totalMaterialCost,
        totalOtherMaterialCost: state.totalOtherMaterialCost,
        totalServiceCost: state.totalServiceCost,
        totalFinishingServiceCost: state.totalFinishingServiceCost,
        finalCostPerPiece: state.finalCostPerPiece,
        batchFinalCost: state.batchFinalCost,
        costPer1: state.costPer1,
        costPer100: state.costPer100,
        costPer500: state.costPer500,
        costPer1000: state.costPer1000,
        costPerGivenQuantity: state.costPerGivenQuantity,
        totalColorCost: state.totalColorCost,
        totalOrderCost: state.totalOrderCost,
        bomProfitPercent: state.bomProfitPercent,
        bomOverheadPercent: state.bomOverheadPercent,
        bomNumberOfColors: state.bomNumberOfColors,
        bomColorRate: state.bomColorRate,
        bomOrderQuantity: state.bomOrderQuantity,
        bomOrderQuantityUOM: state.bomOrderQuantityUOM,
        saleCost: state.saleCost,
        createdAt: state.currentBOM.createdAt || now,
        updatedAt: now
      });
    }

    function applyBomRecordToEditor(record) {
      const copy = cloneData(record);
      state.selectedFinishedGoodId = copy.finishedGoodId;
      state.selectedFinishingServiceId = copy.finishingServiceId || null;
      syncEditorBomMeta(copy);
      hydrateBomEditorMaterials(copy.materials, copy.otherMaterials);
      state.bomServices = cloneData(copy.services || []);
      state.bomAdditionalServices = cloneData(copy.additionalServices || []);
      state.bomFinishingServices = cloneData(copy.finishingServiceLines || []);
      state.bomProfitPercent = storedBomPercent(copy.bomProfitPercent ?? copy.profitPercent);
      state.bomOverheadPercent = storedBomPercent(copy.bomOverheadPercent ?? copy.overheadPercent);
      applyBomCostingExtras(copy);
      state.searches.bomFinishedGood = "";
      state.searches.bomFinishingService = "";
      state.fgSelectorOpen = false;
      state.fsSelectorOpen = false;
      state.workflowError = "";
      recalculateBOMCosts();
      warnBomMaterialSlotLayout(getSelectedFinishedGood(), getBomMaterialSlotLayout(getSelectedFinishedGood(), state.bomMaterials), "saved-bom");
      warnBomMaterialSlotLayout(getSelectedFinishedGood(), getBomOtherMaterialSlotLayout(state.bomOtherMaterials), "saved-bom-other");
      warnBomOtherMaterialPlyCatalog(getFinishedGoodPly(getSelectedFinishedGood()));
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
        finishingServiceId: state.selectedFinishingServiceId || null,
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
      state.selectedFinishingServiceId = original.finishingServiceId || null;
      state.bomMaterials = lines.materials;
      state.bomOtherMaterials = lines.otherMaterials || [];
      state.bomServices = lines.services;
      state.bomAdditionalServices = lines.additionalServices || [];
      state.bomFinishingServices = lines.finishingServiceLines || [];
      state.bomProfitPercent = storedBomPercent(original.bomProfitPercent ?? original.profitPercent);
      state.bomOverheadPercent = storedBomPercent(original.bomOverheadPercent ?? original.overheadPercent);
      applyBomCostingExtras(original);
      recalculateBOMCosts();

      const now = new Date().toISOString();
      const record = cloneData({
        id: nextBomId(),
        bomNo: original.bomNo,
        finishedGoodId: original.finishedGoodId,
        finishingServiceId: original.finishingServiceId || state.selectedFinishingServiceId || null,
        finishedGoodName: original.finishedGoodName || fg?.product,
        variant: original.variant || fg?.variant,
        style: original.style || fg?.style,
        ply: original.ply || fg?.ply,
        uom: original.uom || fg?.uom,
        dimensions: original.dimensions || getItemDimensions(fg),
        dimensionUOM: original.dimensionUOM || fg?.dimensionUOM,
        version: nextVersionForBomNo(original.bomNo),
        status: "Draft",
        materials: state.bomMaterials,
        otherMaterials: state.bomOtherMaterials,
        services: state.bomServices,
        additionalServices: state.bomAdditionalServices,
        finishingServiceLines: state.bomFinishingServices,
        totalMaterialCost: state.totalMaterialCost,
        totalOtherMaterialCost: state.totalOtherMaterialCost,
        totalServiceCost: state.totalServiceCost,
        totalFinishingServiceCost: state.totalFinishingServiceCost,
        finalCostPerPiece: state.finalCostPerPiece,
        batchFinalCost: state.batchFinalCost,
        costPer1: state.costPer1,
        costPer100: state.costPer100,
        costPer500: state.costPer500,
        costPer1000: state.costPer1000,
        costPerGivenQuantity: state.costPerGivenQuantity,
        totalColorCost: state.totalColorCost,
        totalOrderCost: state.totalOrderCost,
        bomProfitPercent: state.bomProfitPercent,
        bomOverheadPercent: state.bomOverheadPercent,
        bomNumberOfColors: state.bomNumberOfColors,
        bomColorRate: state.bomColorRate,
        bomOrderQuantity: state.bomOrderQuantity,
        bomOrderQuantityUOM: state.bomOrderQuantityUOM,
        saleCost: state.saleCost,
        createdAt: now,
        updatedAt: now
      });
      boms.push(cloneData(record));
      applyBomRecordToEditor(record);
      afterDataChange("boms");
      persistEditorState();
      return record;
    }

    function notifyDraftBomSaved(message) {
      const layerError = getMissingStructuralLayerError();
      if (layerError) {
        state.workflowError = layerError;
        showNotification(message + " " + layerError, "error");
        renderBOMHeader();
        return;
      }
      state.workflowError = "";
      showNotification(message);
    }

    function saveDraftBom() {
      recalculateBOMCosts();
      const error = validateCurrentBom(false, { requireStructuralLayers: false });
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
        notifyDraftBomSaved("Active BOM was not changed. Saved as Draft version " + draft.version + ".");
        refreshBomViews();
        return;
      }

      const record = snapshotCurrentBom("Draft");
      if (!upsertDraftRecord(record)) {
        const draft = persistNewDraftFromEditor(state.currentBOM.bomNo, state.currentBOM.finishedGoodId);
        notifyDraftBomSaved("Active BOM was not changed. Saved as Draft version " + draft.version + ".");
        refreshBomViews();
        return;
      }

      notifyDraftBomSaved("Draft saved: " + record.bomNo + " version " + record.version);
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
      const list = isCostCalculatorAdditionalModal()
        ? (state.costCalculator.additionalMaterials || [])
        : state.bomMaterials;
      return list.find((line) =>
        line.rawMaterialId === Number(rawMaterialId) &&
        line.layer === layer &&
        Number(line.id || line.key) !== Number(excludeLineId)
      );
    }

    function refreshBomViews() {
      renderBOMHeader();
      renderProductInformation();
      renderStyleFormulasSection();
      renderMaterialSection();
      renderOtherMaterialSection();
      renderServiceSection();
      renderFinishingServicesSection();
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

    function prettySelect(id, options, selectedValue) {
      const current = options.find((opt) => String(opt.value) === String(selectedValue)) || options[0] || { value: "", label: "" };
      const menu = options.map((opt) => {
        const selected = String(opt.value) === String(current.value);
        return `<button type="button" class="pretty-select-option${selected ? " selected" : ""}" role="option" aria-selected="${selected}" data-pretty-select="${escapeHtml(id)}" data-pretty-value="${escapeHtml(String(opt.value))}">${escapeHtml(opt.label)}</button>`;
      }).join("");
      return `
        <div class="pretty-select">
          <button type="button" class="pretty-select-trigger" id="${escapeHtml(id)}-trigger" aria-haspopup="listbox" aria-expanded="false" aria-controls="${escapeHtml(id)}-panel">
            <span class="pretty-select-value">${escapeHtml(current.label)}</span>
            <span class="pretty-select-chevron" aria-hidden="true"></span>
          </button>
          <div class="pretty-select-panel" id="${escapeHtml(id)}-panel" role="listbox">
            ${menu}
          </div>
          <select id="${escapeHtml(id)}" class="pretty-select-native" tabindex="-1" aria-hidden="true">
            ${options.map((opt) => `<option value="${escapeHtml(String(opt.value))}" ${String(opt.value) === String(current.value) ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}
          </select>
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
          [item?.product, item?.variant, item?.style, item?.uom, item?.ply, formatDimensions(item), item?.status, formatFinishedGoodDisplayName(item)],
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
            item.gsm,
            item.status,
            formatBoundFormulaCode(item.qtyFormulaId),
            formatMaterialDimensionSummary(item)
          ],
          q
        )
      );
    }

    function filterOtherRawMaterials() {
      const q = state.searches.otherRawMaterials;
      return otherRawMaterials.filter((item) =>
        matchesQuery(
          [
            item.code,
            item.name,
            item.category,
            item.uom,
            item.gsm,
            item.status,
            formatBoundFormulaCode(item.qtyFormulaId),
            formatOtherMaterialDimensionSummary(item)
          ],
          q
        )
      );
    }

    function filterServices() {
      const q = state.searches.services;
      return services.filter((item) =>
        matchesQuery(
          [item.code, item.name, item.uom, item.status, serviceCategoryLabels(item.categories).join(" ")],
          q
        )
      );
    }

    function getServiceRateRecord(serviceId) {
      const id = Number(serviceId);
      return serviceRates.find((row) => Number(row.serviceId) === id) || null;
    }

    function serviceRateTableRows() {
      const q = state.searches.serviceRates;
      const statusFilter = state.serviceRateFilter;
      const sort = state.serviceRateSort;
      const rows = services.map((service) => {
        const rateRow = getServiceRateRecord(service.id);
        return { service, rateRow };
      }).filter(({ service, rateRow }) => {
        const formula = getFormula(rateRow && rateRow.formulaId);
        const status = rateRow ? rateRow.status : "";
        if (statusFilter === "active" && status !== "Active") return false;
        if (statusFilter === "inactive" && status !== "Inactive") return false;
        return matchesQuery(
          [service.code, service.name, rateRow && rateRow.rate, rateRow && rateRow.rateUOM, formula && formula.code, status],
          q
        );
      });
      rows.sort((a, b) => {
        if (sort === "rate") {
          const ar = Number(a.rateRow && a.rateRow.rate);
          const br = Number(b.rateRow && b.rateRow.rate);
          const av = Number.isFinite(ar) ? ar : Number.POSITIVE_INFINITY;
          const bv = Number.isFinite(br) ? br : Number.POSITIVE_INFINITY;
          if (av !== bv) return av - bv;
        }
        return String(a.service.name || "").localeCompare(String(b.service.name || ""), undefined, { sensitivity: "base" });
      });
      return rows;
    }

    function getMaterialRateRecord(rawMaterialId) {
      const id = Number(rawMaterialId);
      return materialRates.find((row) => Number(row.rawMaterialId) === id) || null;
    }

    function materialRateTableRows() {
      const q = state.searches.materialRates;
      const statusFilter = state.materialRateFilter;
      const sort = state.materialRateSort;
      const rows = rawMaterials.map((material) => {
        const rateRow = getMaterialRateRecord(material.id);
        return { material, rateRow };
      }).filter(({ material, rateRow }) => {
        const status = rateRow ? rateRow.status : "";
        if (statusFilter === "active" && status !== "Active") return false;
        if (statusFilter === "inactive" && status !== "Inactive") return false;
        return matchesQuery(
          [material.code, material.name, rateRow && rateRow.rate, rateRow && rateRow.rateUOM, formatMaterialDimensionSummary(material), status],
          q
        );
      });
      rows.sort((a, b) => {
        if (sort === "rate") {
          const ar = Number(a.rateRow && a.rateRow.rate);
          const br = Number(b.rateRow && b.rateRow.rate);
          const av = Number.isFinite(ar) ? ar : Number.POSITIVE_INFINITY;
          const bv = Number.isFinite(br) ? br : Number.POSITIVE_INFINITY;
          if (av !== bv) return av - bv;
        }
        return String(a.material.name || "").localeCompare(String(b.material.name || ""), undefined, { sensitivity: "base" });
      });
      return rows;
    }

    function getOtherMaterialRateRecord(otherRawMaterialId) {
      const id = Number(otherRawMaterialId);
      return otherMaterialRates.find((row) => Number(row.otherRawMaterialId) === id) || null;
    }

    function otherMaterialRateTableRows() {
      const q = state.searches.otherMaterialRates;
      const statusFilter = state.otherMaterialRateFilter;
      const sort = state.otherMaterialRateSort;
      const rows = otherRawMaterials.map((material) => {
        const rateRow = getOtherMaterialRateRecord(material.id);
        return { material, rateRow };
      }).filter(({ material, rateRow }) => {
        const status = rateRow ? rateRow.status : "";
        if (statusFilter === "active" && status !== "Active") return false;
        if (statusFilter === "inactive" && status !== "Inactive") return false;
        return matchesQuery(
          [material.code, material.name, rateRow && rateRow.rate, rateRow && rateRow.rateUOM, formatOtherMaterialDimensionSummary(material), status],
          q
        );
      });
      rows.sort((a, b) => {
        if (sort === "rate") {
          const ar = Number(a.rateRow && a.rateRow.rate);
          const br = Number(b.rateRow && b.rateRow.rate);
          const av = Number.isFinite(ar) ? ar : Number.POSITIVE_INFINITY;
          const bv = Number.isFinite(br) ? br : Number.POSITIVE_INFINITY;
          if (av !== bv) return av - bv;
        }
        return String(a.material.name || "").localeCompare(String(b.material.name || ""), undefined, { sensitivity: "base" });
      });
      return rows;
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
            <p id="authStatus" class="${linked ? "cloud-auth-status" : "stat-hint"}" style="margin-top:8px;">${cloudAuthStatusMarkup(linked, user)}</p>
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
        <div class="card cloud-sync-card">
          <div class="card-body">
            <div class="section-kicker">Export</div>
            <div class="section-title">Download All Data</div>
            <p style="margin-top:8px;color:var(--text-muted);line-height:1.5;">
              Save every master and BOM from this browser as an Excel workbook. Works offline.
            </p>
            <div class="cloud-sync-actions">
              <button type="button" class="btn btn-primary" id="btn-download-excel">
                <i data-lucide="download"></i> Download Excel
              </button>
            </div>
            ${auth.currentUser ? "" : `<p class="stat-hint" style="margin-top:10px;">💾 Downloading local data only. Sign in with Google to sync your data to the cloud.</p>`}
          </div>
        </div>
        <div class="stat-grid">
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="finished-goods">
            <div class="stat-label">Total Finished Goods</div>
            <div class="stat-value">${finishedGoods.length}</div>
            <div class="stat-hint">Product / variant masters</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="raw-materials">
            <div class="stat-label">Total Raw Materials</div>
            <div class="stat-value">${rawMaterials.length}</div>
            <div class="stat-hint">Purchasing rate source</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="other-raw-materials">
            <div class="stat-label">Total Other Raw Materials</div>
            <div class="stat-value">${otherRawMaterials.length}</div>
            <div class="stat-hint">Purchasing rate source</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="services">
            <div class="stat-label">Total Services</div>
            <div class="stat-value">${services.length}</div>
            <div class="stat-hint">Process rate source</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="formulas">
            <div class="stat-label">Formula Definitions</div>
            <div class="stat-value">${formulas.length}</div>
            <div class="stat-hint">${activeFormulas} active</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="bom-list">
            <div class="stat-label">Saved BOMs</div>
            <div class="stat-value">${boms.length}</div>
            <div class="stat-hint">Draft and Active versions</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="bom-list">
            <div class="stat-label">Active BOMs</div>
            <div class="stat-value">${activeBoms}</div>
            <div class="stat-hint">Only BOMs with Active status</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="formula-variables">
            <div class="stat-label">Variables</div>
            <div class="stat-value">${formulaVariables.length}</div>
            <div class="stat-hint">Shared formula variables</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="dimensions">
            <div class="stat-label">Dimension</div>
            <div class="stat-value">${dimensions.length}</div>
            <div class="stat-hint">Dimension master</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="style">
            <div class="stat-label">Style</div>
            <div class="stat-value">${styles.length}</div>
            <div class="stat-hint">Style master</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="raw-material-rates">
            <div class="stat-label">Raw Material Rates</div>
            <div class="stat-value">${materialRates.length}</div>
            <div class="stat-hint">Purchasing rates</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="other-raw-material-rates">
            <div class="stat-label">Other Raw Material Rates</div>
            <div class="stat-value">${otherMaterialRates.length}</div>
            <div class="stat-hint">Purchasing rates</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="service-rates">
            <div class="stat-label">Service Rates</div>
            <div class="stat-value">${serviceRates.length}</div>
            <div class="stat-hint">Process pricing</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="bom-costing">
            <div class="stat-label">BOM &amp; Costing</div>
            <div class="stat-value">Editor</div>
            <div class="stat-hint">Build a BOM</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="bom-list">
            <div class="stat-label">BOM List</div>
            <div class="stat-value">Open</div>
            <div class="stat-hint">View drafts and versions</div>
          </article>
          <article class="stat-card stat-card-nav" role="button" tabindex="0" data-dashboard-nav="cost-calculator">
            <div class="stat-label">Cost Calculator</div>
            <div class="stat-value">Estimate</div>
            <div class="stat-hint">Quick cost by style and size</div>
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
            <div class="cloud-sync-actions" style="margin-top:12px;">
              <button type="button" class="btn" id="btn-reset-local-data">Restore seed data</button>
              <button type="button" class="btn btn-warning-solid" id="btn-clean-user-data" ${state.cleaningUserData ? "disabled" : ""} aria-busy="${state.cleaningUserData ? "true" : "false"}" title="Delete everything, including formulas, dimensions, styles, and variables.">
                ${state.cleaningUserData ? "Cleaning..." : "Clean My Data"}
              </button>
            </div>
            <p class="stat-hint" style="margin-top:8px;">Clean My Data wipes the entire app: products, materials, services, BOMs, formulas, dimensions, styles, and variables. Use Restore seed data to bring demo data back.</p>
          </div>
        </div>
      `;
    }

    function renderFinishedGoods() {
      const rows = filterFinishedGoods();
      const body = rows.length
        ? rows.map((item, index) => `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(item?.product ?? "missing data")}</div>
              </td>
              <td>${escapeHtml(item?.style ?? "—")}</td>
              <td>${escapeHtml(item?.variant ?? "—")}</td>
              <td class="fm-expr-cell"><code class="fm-expr">${escapeHtml(formatDimensions(item) || "missing data")}</code></td>
              <td><span class="badge badge-info">${escapeHtml(item?.ply ?? "—")}</span></td>
              <td><span class="badge badge-muted">${escapeHtml(item?.uom ?? "—")}</span></td>
              <td>${statusBadge(item?.status)}</td>
              ${masterRowActions("data-edit-fg", item?.id, "data-delete-fg", item?.id)}
            </tr>
          `).join("")
        : emptyRow(9, "No finished goods match this search.");

      document.getElementById("page-finished-goods").innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Finished Good Management</div>
            <div class="fm-hero-sub">Product master</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-add-product">
            <i data-lucide="plus"></i> Add Product
          </button>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("fg-search", state.searches.finishedGoods, "Search product, variant, style...")}
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${finishedGoods.length}</span>
            </div>
          </div>
        </div>
        <div class="card fm-group is-style">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="box"></i></span>
                <div>
                  <div class="section-kicker">Product master</div>
                  <div class="section-title">Products</div>
                </div>
              </div>
              <span class="badge badge-muted">${rows.length}</span>
            </div>
            <div class="table-wrap">
              <table class="data-table fm-table" style="min-width:1100px;">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
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
        </div>
      `;
    }

    function renderRawMaterials() {
      const rows = filterRawMaterials();
      const body = rows.length
        ? rows.map((item, index) => `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(item.name)}</div>
              </td>
              <td class="mono fm-code">${escapeHtml(item.code)}</td>
              <td><span class="badge badge-info">${escapeHtml(item.category)}</span></td>
              <td class="fm-expr-cell"><code class="fm-expr">${item.gsm === null ? "—" : escapeHtml(formatDecimal(item.gsm, 1, false))}</code></td>
              <td><span class="badge badge-muted">${escapeHtml(item.uom)}</span></td>
              <td class="fm-expr-cell"><code class="fm-expr">${escapeHtml(formatBoundFormulaCode(item.qtyFormulaId))}</code></td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-rm", item.id, "data-delete-rm", item.id)}
            </tr>
          `).join("")
        : emptyRow(9, "No raw materials match this search.");

      document.getElementById("page-raw-materials").innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Raw Material Management</div>
            <div class="fm-hero-sub">Purchasing master</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-add-material-master">
            <i data-lucide="plus"></i> Add Material
          </button>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("rm-search", state.searches.rawMaterials, "Search code, material, category...")}
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${rawMaterials.length}</span>
            </div>
          </div>
        </div>
        <div class="card fm-group is-material">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="package"></i></span>
                <div>
                  <div class="section-kicker">Purchasing master</div>
                  <div class="section-title">Materials</div>
                </div>
              </div>
              <span class="badge badge-muted">${rows.length}</span>
            </div>
            <div class="table-wrap">
              <table class="data-table fm-table" style="min-width:1100px;">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
                    <th>Material</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>GSM</th>
                    <th>UOM</th>
                    <th>Qty Formula</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>${body}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    function renderRawMaterialRates() {
      const page = document.getElementById("page-raw-material-rates");
      if (!page) return;
      const rows = materialRateTableRows();
      const body = rows.length
        ? rows.map(({ material, rateRow }, index) => {
            const rateText = rateRow && Number.isFinite(Number(rateRow.rate))
              ? formatNumber(rateRow.rate, 2)
              : "—";
            return `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(material.name)}</div>
              </td>
              <td class="mono fm-code">${escapeHtml(material.code)}</td>
              <td class="fm-expr-cell"><code class="fm-expr">${rateText}</code></td>
              <td><span class="badge badge-muted">${escapeHtml((rateRow && rateRow.rateUOM) || "—")}</span></td>
              <td>${escapeHtml(formatMaterialDimensionSummary(material))}</td>
              <td>${rateRow ? statusBadge(rateRow.status) : '<span class="badge badge-muted">Unset</span>'}</td>
              <td>
                <button type="button" class="btn btn-sm" data-edit-material-rate="${material.id}">Update</button>
              </td>
            </tr>
          `;
          }).join("")
        : emptyRow(8, "No material rates match this search.");

      page.innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Raw Material Rates</div>
            <div class="fm-hero-sub">Purchasing rates for raw materials</div>
          </div>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("mrate-search", state.searches.materialRates, "Search material name, code...")}
              <select class="filter-select" id="mrate-status-filter">
                <option value="all" ${state.materialRateFilter === "all" ? "selected" : ""}>All statuses</option>
                <option value="active" ${state.materialRateFilter === "active" ? "selected" : ""}>Active</option>
                <option value="inactive" ${state.materialRateFilter === "inactive" ? "selected" : ""}>Inactive</option>
              </select>
              <select class="filter-select" id="mrate-sort">
                <option value="name" ${state.materialRateSort === "name" ? "selected" : ""}>Sort by material name</option>
                <option value="rate" ${state.materialRateSort === "rate" ? "selected" : ""}>Sort by rate</option>
              </select>
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${rawMaterials.length}</span>
            </div>
          </div>
        </div>
        <div class="card fm-group is-costing">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="banknote"></i></span>
                <div>
                  <div class="section-kicker">Purchasing rates</div>
                  <div class="section-title">Rates</div>
                </div>
              </div>
              <span class="badge badge-muted">${rows.length}</span>
            </div>
            <div class="table-wrap">
              <table class="data-table fm-table" style="min-width:1100px;">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Rate (PKR)</th>
                    <th>Rate UOM</th>
                    <th>Dimensions</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>${body}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    function renderOtherRawMaterials() {
      const page = document.getElementById("page-other-raw-materials");
      if (!page) return;
      const rows = filterOtherRawMaterials();
      const body = rows.length
        ? rows.map((item) => `
            <tr>
              <td class="mono">${escapeHtml(item.code)}</td>
              <td>${escapeHtml(item.name)}</td>
              <td><span class="badge badge-info">${escapeHtml(item.category)}</span></td>
              <td>${item.gsm === null ? "—" : escapeHtml(formatDecimal(item.gsm, 1, false))}</td>
              <td>${escapeHtml(item.uom)}</td>
              <td class="mono">${escapeHtml(formatBoundFormulaCode(item.qtyFormulaId))}</td>
              <td>${escapeHtml(formatOtherMaterialDimensionSummary(item))}</td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-orm", item.id, "data-delete-orm", item.id)}
            </tr>
          `).join("")
        : emptyRow(9, "No other raw materials match this search.");

      page.innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("orm-search", state.searches.otherRawMaterials, "Search code, material, category...")}
          </div>
          <div class="toolbar-right">
            <button type="button" class="btn btn-primary" id="btn-add-other-material-master">
              <i data-lucide="plus"></i> Add Material
            </button>
            <span class="badge badge-muted">${rows.length} of ${otherRawMaterials.length}</span>
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

    function renderOtherRawMaterialRates() {
      const page = document.getElementById("page-other-raw-material-rates");
      if (!page) return;
      const rows = otherMaterialRateTableRows();
      const body = rows.length
        ? rows.map(({ material, rateRow }) => {
            const rateText = rateRow && Number.isFinite(Number(rateRow.rate))
              ? formatNumber(rateRow.rate, 2)
              : "—";
            return `
            <tr>
              <td class="mono">${escapeHtml(material.code)}</td>
              <td>${escapeHtml(material.name)}</td>
              <td>${rateText}</td>
              <td>${escapeHtml((rateRow && rateRow.rateUOM) || "—")}</td>
              <td>${escapeHtml(formatOtherMaterialDimensionSummary(material))}</td>
              <td>${rateRow ? statusBadge(rateRow.status) : '<span class="badge badge-muted">Unset</span>'}</td>
              <td>
                <button type="button" class="btn btn-sm" data-edit-other-material-rate="${material.id}">Update</button>
              </td>
            </tr>
          `;
          }).join("")
        : emptyRow(7, "No material rates match this search.");

      page.innerHTML = `
        <div class="toolbar">
          <div class="toolbar-left">
            ${toolbarSearch("omrate-search", state.searches.otherMaterialRates, "Search material name, code...")}
            <select class="filter-select" id="omrate-status-filter">
              <option value="all" ${state.otherMaterialRateFilter === "all" ? "selected" : ""}>All statuses</option>
              <option value="active" ${state.otherMaterialRateFilter === "active" ? "selected" : ""}>Active</option>
              <option value="inactive" ${state.otherMaterialRateFilter === "inactive" ? "selected" : ""}>Inactive</option>
            </select>
            <select class="filter-select" id="omrate-sort">
              <option value="name" ${state.otherMaterialRateSort === "name" ? "selected" : ""}>Sort by material name</option>
              <option value="rate" ${state.otherMaterialRateSort === "rate" ? "selected" : ""}>Sort by rate</option>
            </select>
          </div>
          <div class="toolbar-right">
            <span class="badge badge-muted">${rows.length} of ${otherRawMaterials.length}</span>
          </div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Rate (PKR)</th>
                  <th>Rate UOM</th>
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
        ? rows.map((item, index) => `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(item.name)}</div>
              </td>
              <td class="mono fm-code">${escapeHtml(item.code)}</td>
              <td><span class="badge badge-muted">${escapeHtml(item.uom)}</span></td>
              <td>${formatServiceCategoryBadges(item.categories)}</td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-srv-master", item.id, "data-delete-srv-master", item.id)}
            </tr>
          `).join("")
        : emptyRow(7, "No services match this search.");

      document.getElementById("page-services").innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Service Management</div>
            <div class="fm-hero-sub">Conversion process master</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-add-service-master">
            <i data-lucide="plus"></i> Add Service
          </button>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("srv-search", state.searches.services, "Search code, service, UOM, category...")}
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${services.length}</span>
            </div>
          </div>
        </div>
        <div class="card fm-group is-service">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="wrench"></i></span>
                <div>
                  <div class="section-kicker">Process master</div>
                  <div class="section-title">Services</div>
                </div>
              </div>
              <span class="badge badge-muted">${rows.length}</span>
            </div>
            <div class="table-wrap">
              <table class="data-table fm-table">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
                    <th>Service</th>
                    <th>Code</th>
                    <th>UOM</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>${body}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    function renderServiceRates() {
      const page = document.getElementById("page-service-rates");
      if (!page) return;
      const rows = serviceRateTableRows();
      const body = rows.length
        ? rows.map(({ service, rateRow }, index) => {
            const formula = getFormula(rateRow && rateRow.formulaId);
            const rateText = rateRow && Number.isFinite(Number(rateRow.rate))
              ? formatNumber(rateRow.rate, 2)
              : "—";
            return `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(service.name)}</div>
              </td>
              <td class="mono fm-code">${escapeHtml(service.code)}</td>
              <td class="fm-expr-cell"><code class="fm-expr">${rateText}</code></td>
              <td><span class="badge badge-muted">${escapeHtml((rateRow && rateRow.rateUOM) || "—")}</span></td>
              <td class="fm-expr-cell"><code class="fm-expr">${escapeHtml(formula ? formula.code : "—")}</code></td>
              <td>${rateRow ? statusBadge(rateRow.status) : '<span class="badge badge-muted">Unset</span>'}</td>
              <td>
                <button type="button" class="btn btn-sm" data-edit-service-rate="${service.id}">Update</button>
              </td>
            </tr>
          `;
          }).join("")
        : emptyRow(8, "No service rates match this search.");

      page.innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Service Rates</div>
            <div class="fm-hero-sub">Pricing and formulas for services</div>
          </div>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("srate-search", state.searches.serviceRates, "Search service name, code...")}
              <select class="filter-select" id="srate-status-filter">
                <option value="all" ${state.serviceRateFilter === "all" ? "selected" : ""}>All statuses</option>
                <option value="active" ${state.serviceRateFilter === "active" ? "selected" : ""}>Active</option>
                <option value="inactive" ${state.serviceRateFilter === "inactive" ? "selected" : ""}>Inactive</option>
              </select>
              <select class="filter-select" id="srate-sort">
                <option value="name" ${state.serviceRateSort === "name" ? "selected" : ""}>Sort by service name</option>
                <option value="rate" ${state.serviceRateSort === "rate" ? "selected" : ""}>Sort by rate</option>
              </select>
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${services.length}</span>
            </div>
          </div>
        </div>
        <div class="card fm-group is-costing">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="banknote"></i></span>
                <div>
                  <div class="section-kicker">Service pricing</div>
                  <div class="section-title">Rates</div>
                </div>
              </div>
              <span class="badge badge-muted">${rows.length}</span>
            </div>
            <div class="table-wrap">
              <table class="data-table fm-table" style="min-width:1100px;">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
                    <th>Service Name</th>
                    <th>Service Code</th>
                    <th>Rate (PKR)</th>
                    <th>Rate UOM</th>
                    <th>Formula</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>${body}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    function renderStyles() {
      const rows = filterStyles();
      const body = rows.length
        ? rows.map((item, index) => `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(item.name)}</div>
              </td>
              <td>${escapeHtml(item.description || "—")}</td>
              <td><span class="badge badge-info">${getStyleVariables(item.id).length} variables</span></td>
              <td><span class="badge badge-muted">${getStyleFormulaLinks(item.id).length} formulas</span></td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-style", item.id, "data-delete-style", item.id)}
            </tr>
          `).join("")
        : emptyRow(7, "No styles match this search.");

      document.getElementById("page-style").innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Style Management</div>
            <div class="fm-hero-sub">Style master and style variables</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-add-style">
            <i data-lucide="plus"></i> Add Style
          </button>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("style-search", state.searches.style, "Search style name, description...")}
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${styles.length}</span>
            </div>
          </div>
        </div>
        <div class="card fm-group is-style">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="palette"></i></span>
                <div>
                  <div class="section-kicker">Style master</div>
                  <div class="section-title">Styles</div>
                </div>
              </div>
              <span class="badge badge-muted">${rows.length}</span>
            </div>
            <div class="table-wrap">
              <table class="data-table fm-table">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
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
        </div>
      `;
    }

    function renderDimensions() {
      const rows = filterDimensions();
      const body = rows.length
        ? rows.map((item, index) => `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(item.name || item.code)}</div>
              </td>
              <td>${escapeHtml(item.description || "—")}</td>
              <td class="fm-expr-cell"><code class="fm-expr">${escapeHtml(formatDecimal(item.L, 2, false))}</code></td>
              <td class="fm-expr-cell"><code class="fm-expr">${escapeHtml(formatDecimal(item.W, 2, false))}</code></td>
              <td><span class="badge badge-info">${escapeHtml(item.unit || item.uom)}</span></td>
              <td>${statusBadge(item.status)}</td>
              ${masterRowActions("data-edit-dim", item.id, "data-delete-dim", item.id)}
            </tr>
          `).join("")
        : emptyRow(8, "No dimensions match this search.");

      document.getElementById("page-dimensions").innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Dimension Management</div>
            <div class="fm-hero-sub">Size presets used across costing</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-add-dimension">
            <i data-lucide="plus"></i> Add Dimension
          </button>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("dim-search", state.searches.dimensions, "Search L x W, UOM...")}
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${dimensions.length}</span>
            </div>
          </div>
        </div>
        <div class="card fm-group is-dimension">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="ruler"></i></span>
                <div>
                  <div class="section-kicker">Dimension master</div>
                  <div class="section-title">Sizes</div>
                </div>
              </div>
              <span class="badge badge-muted">${rows.length}</span>
            </div>
            <div class="table-wrap">
              <table class="data-table fm-table">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
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
        </div>
      `;
    }

    function variableCategoryMeta(category) {
      const map = {
        Dimension: { icon: "ruler", cls: "is-dimension" },
        Material: { icon: "package", cls: "is-material" },
        Sheet: { icon: "layers", cls: "is-sheet" },
        Area: { icon: "square", cls: "is-area" },
        Costing: { icon: "calculator", cls: "is-costing" },
        Service: { icon: "wrench", cls: "is-service" },
        Printing: { icon: "palette", cls: "is-printing" }
      };
      return map[category] || { icon: "variable", cls: "is-other" };
    }

    function renderVariableTable(items, emptyMessage) {
      const body = items.length
        ? items.map((item, index) => {
            const sheetArea = isFixedSheetAreaCode(item.code);
            const description = sheetArea ? FIXED_SHEET_AREA.description : (item.description || "—");
            const defaultValue = sheetArea
              ? FIXED_SHEET_AREA.formula
              : (item.defaultValue === null || item.defaultValue === undefined || item.defaultValue === "" ? "—" : (item.dataType === "numeric" ? formatDecimal(item.defaultValue, 8, false) : item.defaultValue));
            return `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(item.name)}</div>
              </td>
              <td class="mono fm-code">${escapeHtml(item.code)}${sheetArea ? ` <span class="badge badge-muted">Fixed Calculation</span>` : ""}</td>
              <td>${escapeHtml(description)}</td>
              <td><span class="badge badge-info">${escapeHtml(item.category)}</span></td>
              <td>${escapeHtml(item.unit || "—")}</td>
              <td>${escapeHtml(item.dataType)}</td>
              <td class="fm-expr-cell"><code class="fm-expr">${escapeHtml(defaultValue)}</code></td>
              <td>${statusBadge(item.isActive ? "Active" : "Inactive", item.isActive)}</td>
              ${sheetArea
                ? `<td><span class="formula-src" title="${escapeHtml(FIXED_SHEET_AREA.description)}">Read only</span></td>`
                : masterRowActions("data-edit-fvar", item.id, "data-delete-fvar", item.id)}
            </tr>
          `;
          }).join("")
        : emptyRow(10, emptyMessage || "No formula variables match this search.");
      return `
        <div class="table-wrap">
          <table class="data-table fm-table" style="min-width:1100px;">
            <thead>
              <tr>
                <th class="fm-num">#</th>
                <th>Name</th>
                <th>Code</th>
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
      `;
    }

    function renderFormulaVariables() {
      const rows = filterFormulaVariables();
      const categoryOrder = ["Dimension", "Material", "Sheet", "Area", "Costing", "Service", "Printing"];
      const extras = [];
      rows.forEach((item) => {
        if (!categoryOrder.includes(item.category) && !extras.includes(item.category)) extras.push(item.category);
      });
      const groups = categoryOrder.concat(extras);
      const tables = groups.map((category) => {
        const items = rows.filter((item) => item.category === category);
        const meta = variableCategoryMeta(category);
        return `
          <div class="card fm-group ${meta.cls}" style="margin-bottom:16px;">
            <div class="card-body">
              <div class="section-head">
                <div class="fm-group-title">
                  <span class="fm-group-icon"><i data-lucide="${meta.icon}"></i></span>
                  <div>
                    <div class="section-kicker">${escapeHtml(category)} variables</div>
                    <div class="section-title">${escapeHtml(category)}</div>
                  </div>
                </div>
                <span class="badge badge-muted">${items.length}</span>
              </div>
              ${renderVariableTable(items, `No ${String(category).toLowerCase()} variables.`)}
            </div>
          </div>
        `;
      }).join("");

      const fixedRows = fixedVariables.map((item, index) => `
        <tr>
          <td class="fm-num">${index + 1}</td>
          <td class="mono fm-code">${escapeHtml(item.code)} <span class="badge badge-muted">Fixed</span></td>
          <td class="fm-expr-cell"><code class="fm-expr">${escapeHtml(isDerivedFixedVariable(item) ? CONVERSION_FACTOR_FORMULA : String(item.value))}</code></td>
          <td>${escapeHtml(item.description || "—")}</td>
          <td class="fm-name">${escapeHtml(isDerivedFixedVariable(item) ? formatDecimal(item.value, 8, false) : String(item.value))}</td>
          <td>
            <div class="row-actions">
              <button type="button" class="btn btn-sm btn-icon" data-edit-fixed-variable="${item.id}" title="Edit">
                <i data-lucide="pencil"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join("");

      document.getElementById("page-formula-variables").innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Variable Management</div>
            <div class="fm-hero-sub">Shared inputs used by formulas</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-add-formula-variable">
            <i data-lucide="plus"></i> Add Variable
          </button>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("fvar-search", state.searches.formulaVariables, "Search code, name, category...")}
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${formulaVariables.length}</span>
            </div>
          </div>
        </div>
        <div class="card fm-group is-fixed" style="margin-bottom:16px;">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="lock"></i></span>
                <div>
                  <div class="section-kicker">Fixed variables</div>
                  <div class="section-title">System</div>
                </div>
              </div>
              <div class="row-actions" style="align-items:center;gap:8px;">
                <button type="button" class="btn btn-primary btn-sm" id="btn-add-fixed-variable">
                  <i data-lucide="plus"></i> Add Fixed Variable
                </button>
                <span class="badge badge-muted">${fixedVariables.length}</span>
              </div>
            </div>
            <p class="fm-group-hint">These values are part of the calculation engine. Values can be edited but fixed variables cannot be deleted.</p>
            <div class="table-wrap">
              <table class="data-table fm-table">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
                    <th>Code</th>
                    <th>Value / Formula</th>
                    <th>Description</th>
                    <th>Current Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>${fixedRows}</tbody>
              </table>
            </div>
          </div>
        </div>
        ${tables}
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
        || otherRawMaterials.some((item) => bindingUsesFormula(item.qtyFormulaId, formula))
        || services.some((item) => bindingUsesFormula(item.formulaId, formula) || bindingUsesFormula(item.qtyFormulaId, formula))
        || materialRates.some((item) => bindingUsesFormula(item.formulaId, formula))
        || otherMaterialRates.some((item) => bindingUsesFormula(item.formulaId, formula))
        || serviceRates.some((item) => bindingUsesFormula(item.formulaId, formula))
        || styleFormulas.some((item) => bindingUsesFormula(item.formulaId, formula))
        || serviceDimensions.some((item) => bindingUsesFormula(item.formulaId, formula))
        || materialDimensions.some((item) => bindingUsesFormula(item.formulaId, formula))
        || otherMaterialDimensions.some((item) => bindingUsesFormula(item.formulaId, formula));
      const usedInEditor = state.bomMaterials.some((line) => lineUsesFormula(line, formula)) ||
        (state.bomOtherMaterials || []).some((line) => lineUsesFormula(line, formula)) ||
        state.bomServices.some((line) => lineUsesFormula(line, formula)) ||
        (state.bomAdditionalServices || []).some((line) => lineUsesFormula(line, formula)) ||
        (state.bomFinishingServices || []).some((line) => lineUsesFormula(line, formula));
      const usedInSaved = boms.some((bom) =>
        (bom.materials || []).some((line) => lineUsesFormula(line, formula)) ||
        (bom.otherMaterials || []).some((line) => lineUsesFormula(line, formula)) ||
        (bom.services || []).some((line) => lineUsesFormula(line, formula)) ||
        (bom.additionalServices || []).some((line) => lineUsesFormula(line, formula)) ||
        (bom.finishingServiceLines || []).some((line) => lineUsesFormula(line, formula))
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
        ? items.map((item, index) => `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td>
                <div class="fm-name">${escapeHtml(item.name)}</div>
              </td>
              <td class="mono fm-code">${escapeHtml(item.code)}</td>
              <td>${formulaTypeBadge(item.type)}</td>
              <td class="fm-expr-cell"><code class="fm-expr">${escapeHtml(item.expression)}</code></td>
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
        : emptyRow(8, emptyMessage || "No formulas match this search or filter.");
      return `
        <div class="table-wrap">
          <table class="data-table fm-table" style="min-width:1100px;">
            <thead>
              <tr>
                <th class="fm-num">#</th>
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

    function renderFormulaFilter() {
      const options = [
        { value: "all", label: "All", group: "View" },
        { value: "material", label: "Material", group: "Type" },
        { value: "service", label: "Service", group: "Type" },
        { value: "style", label: "Style", group: "Type" },
        { value: "active", label: "Active", group: "Status" },
        { value: "inactive", label: "Inactive", group: "Status" }
      ];
      const current = options.find((opt) => opt.value === state.formulaFilter) || options[0];
      let lastGroup = "";
      const menu = options.map((opt) => {
        const heading = opt.group !== lastGroup
          ? `<div class="fm-filter-heading">${escapeHtml(opt.group)}</div>`
          : "";
        lastGroup = opt.group;
        const selected = opt.value === current.value ? " selected" : "";
        return `${heading}<button type="button" class="fm-filter-option${selected}" role="option" aria-selected="${opt.value === current.value}" data-formula-filter="${opt.value}">${escapeHtml(opt.label)}</button>`;
      }).join("");

      return `
        <div class="fm-filter">
          <button type="button" class="fm-filter-trigger" id="formula-filter-toggle" aria-haspopup="listbox" aria-expanded="false">
            <span class="fm-filter-icon"><i data-lucide="list-filter"></i></span>
            <span class="fm-filter-copy">
              <span class="fm-filter-label">Filter</span>
              <span class="fm-filter-value">${escapeHtml(current.label)}</span>
            </span>
            <i data-lucide="chevron-down" class="fm-filter-chevron"></i>
          </button>
          <div class="fm-filter-panel" role="listbox" aria-label="Formula filter">
            ${menu}
          </div>
          <select class="fm-filter-native" id="formula-filter" tabindex="-1" aria-hidden="true">
            ${options.map((opt) => `<option value="${opt.value}" ${opt.value === current.value ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}
          </select>
        </div>
      `;
    }

    function renderFormulas() {
      const rows = filterFormulas();
      const grouped = state.formulaFilter === "all";
      const typeMeta = {
        Material: { icon: "package", cls: "is-material" },
        Service: { icon: "wrench", cls: "is-service" },
        Style: { icon: "palette", cls: "is-style" }
      };
      const tables = grouped
        ? FORMULA_TYPES.map((type) => {
            const items = rows.filter((item) => item.type === type);
            const meta = typeMeta[type] || { icon: "sigma", cls: "" };
            return `
              <div class="card fm-group ${meta.cls}" style="margin-bottom:16px;">
                <div class="card-body">
                  <div class="section-head">
                    <div class="fm-group-title">
                      <span class="fm-group-icon"><i data-lucide="${meta.icon}"></i></span>
                      <div>
                        <div class="section-kicker">${escapeHtml(type)} formulas</div>
                        <div class="section-title">${escapeHtml(type)}</div>
                      </div>
                    </div>
                    <span class="badge badge-muted">${items.length}</span>
                  </div>
                  ${renderFormulaTable(items, `No ${type.toLowerCase()} formulas.`)}
                </div>
              </div>
            `;
          }).join("")
        : `<div class="card fm-group">${renderFormulaTable(rows)}</div>`;

      document.getElementById("page-formulas").innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Library</div>
            <div class="section-title">Formula Management</div>
            <div class="fm-hero-sub">Definitions, builder, and validation</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-new-formula">
            <i data-lucide="plus"></i> New Formula
          </button>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
            <div class="toolbar-left">
              ${toolbarSearch("formula-search", state.searches.formulas, "Search formula name, code, expression...")}
              ${renderFormulaFilter()}
            </div>
            <div class="toolbar-right">
              <span class="badge badge-muted">${rows.length} of ${formulas.length}</span>
            </div>
          </div>
        </div>
        ${tables}
      `;
    }

    const BOM_FLOW_SECTIONS = [
      { id: "fg-selector-root", label: "Select Finished Good" },
      { id: "bom-product-root", label: "Product Information" },
      { id: "bom-style-formulas-root", label: "Style Formulas" },
      { id: "bom-materials-root", label: "Raw Materials" },
      { id: "bom-other-materials-root", label: "Additional materials" },
      { id: "bom-services-root", label: "Select Packaging Services" },
      { id: "bom-finishing-root", label: "Finishing Services" }
    ];

    function getBomVisibleStepNumbers() {
      const fg = getSelectedFinishedGood();
      let n = 1;
      const steps = { selectFg: n++ };
      if (fg) {
        steps.product = n++;
        steps.style = n++;
        steps.materials = n++;
        steps.otherMaterials = n++;
        steps.services = n++;
        steps.finishing = n++;
      }
      return steps;
    }

    function setActiveBomFlowSection(sectionId) {
      if (!sectionId) return;
      state.bomFlowSection = sectionId;
      document.querySelectorAll("[data-bom-section]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.bomSection === sectionId);
      });
    }

    function scrollToBomSection(sectionId) {
      const target = document.getElementById(sectionId);
      if (!target) return;
      setActiveBomFlowSection(sectionId);
      state.bomFlowScrollLock = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        state.bomFlowScrollLock = false;
      }, 700);
    }

    function updateBomFlowFromViewport() {
      if (state.currentPage !== "bom-costing" || state.bomFlowScrollLock) return;
      const buttons = document.querySelectorAll("[data-bom-section]");
      if (!buttons.length) return;
      const headerOffset = 64;
      let bestId = state.bomFlowSection || BOM_FLOW_SECTIONS[0].id;
      let bestTop = -Infinity;
      buttons.forEach((btn) => {
        const el = document.getElementById(btn.dataset.bomSection);
        if (!el) return;
        const top = el.getBoundingClientRect().top - headerOffset;
        if (top <= 12 && top >= bestTop) {
          bestTop = top;
          bestId = btn.dataset.bomSection;
        }
      });
      setActiveBomFlowSection(bestId);
    }

    function renderBOMPage() {
      const chips = BOM_FLOW_SECTIONS.map((section) => {
        const active = (state.bomFlowSection || BOM_FLOW_SECTIONS[0].id) === section.id ? " active" : "";
        return `
          <button type="button" class="bom-flow-tab${active}" data-bom-section="${section.id}">${escapeHtml(section.label)}</button>
        `;
      }).join("");
      document.getElementById("page-bom-costing").innerHTML = `
        <div class="bom-flow" role="navigation" aria-label="BOM sections">${chips}</div>
        <div class="bom-layout">
          <div class="bom-main">
            <div class="card">
              <div class="card-body">
                <div class="cc-step">Step ${getBomVisibleStepNumbers().selectFg}: Select Finished Good</div>
                <div class="section-title" style="margin:4px 0 14px;">Select a finished good to configure its BOM</div>
                <div id="fg-selector-root"></div>
              </div>
            </div>
            <div id="bom-header-root"></div>
            <div id="bom-product-root"></div>
            <div id="bom-style-formulas-root"></div>
            <div id="bom-materials-root"></div>
            <div id="bom-other-materials-root"></div>
            <div id="bom-services-root"></div>
            <div id="bom-finishing-root"></div>
          </div>
          <aside id="bom-cost-root"></aside>
        </div>
      `;
      renderFinishedGoodSelector();
      renderBOMHeader();
      renderProductInformation();
      renderStyleFormulasSection();
      renderMaterialSection();
      renderOtherMaterialSection();
      renderServiceSection();
      renderFinishingServicesSection();
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
        ? options.map((item) => {
            const name = item?.product || formatFinishedGoodDisplayName(item);
            const dims = formatFinishedGoodSizeCode(item?.dimensions);
            const meta = [item?.style, item?.variant, dims, item?.ply != null ? `${item.ply} Ply` : ""]
              .filter((part) => part !== null && part !== undefined && String(part).trim() !== "")
              .join(" · ") || "No details";
            return `
            <button type="button" class="fg-option ${item.id === state.selectedFinishedGoodId ? "selected" : ""}" data-fg-id="${item.id}">
              <div class="cc-style-option-name">${escapeHtml(name)}</div>
              <div class="cc-style-option-meta">${escapeHtml(meta)}</div>
            </button>
          `;
          }).join("")
        : `<div class="empty">No finished goods match this search.</div>`;

      root.innerHTML = `
        <div class="fg-combo cc-style-combo" id="fg-combo">
          <label class="form-label" for="fg-combo-search">Select Finished Good</label>
          <div class="fg-combo-control">
            <div class="fg-combo-wrap">
              <i data-lucide="search"></i>
              <input id="fg-combo-search" type="search" autocomplete="off" placeholder="Search product, variant, style, ply, dimensions..." value="${escapeHtml(inputValue)}" title="${escapeHtml(inputValue)}" aria-label="Search and select finished good" />
            </div>
            <button type="button" class="fg-combo-toggle ${state.fgSelectorOpen ? "open" : ""}" id="fg-combo-toggle" aria-label="Toggle finished good list" aria-expanded="${state.fgSelectorOpen ? "true" : "false"}">
              <i data-lucide="chevron-down"></i>
            </button>
          </div>
          <div class="fg-combo-list ${state.fgSelectorOpen ? "open" : ""}" id="fg-combo-list">${list}</div>
        </div>
      `;
    }

    function showFgComboList() {
      state.fgSelectorOpen = true;
      const list = document.getElementById("fg-combo-list");
      if (list) list.classList.add("open");
    }

    function resetBomEditor(options) {
      const opts = options || {};
      state.selectedFinishedGoodId = null;
      state.selectedFinishingServiceId = null;
      state.currentBOM = null;
      state.bomMaterials = [];
      state.bomOtherMaterials = [];
      state.bomServices = [];
      state.bomAdditionalServices = [];
      state.bomFinishingServices = [];
      state.bomStyleResults = [];
      state.totalMaterialCost = 0;
      state.totalOtherMaterialCost = 0;
      state.totalServiceCost = 0;
      state.totalFinishingServiceCost = 0;
      state.finalCostPerPiece = 0;
      state.batchFinalCost = 0;
      state.costPer1 = 0;
      state.costPer100 = 0;
      state.costPer500 = 0;
      state.costPer1000 = 0;
      state.costPerGivenQuantity = null;
      state.bomProfitPercent = 0;
      state.bomOverheadPercent = 0;
      resetBomCostingExtras();
      state.saleCost = 0;
      state.searches.bomFinishedGood = "";
      state.searches.bomFinishingService = "";
      state.fgSelectorOpen = false;
      state.fsSelectorOpen = false;
      state.workflowError = "";
      if (!opts.keepModal) closeModal();
      if (!opts.skipPersist) persistEditorState();
    }

    function handleFinishedGoodChange(id) {
      const nextId = Number(id);
      const item = finishedGoods.find((fg) => fg.id === nextId);
      if (!item) return;

      state.selectedFinishedGoodId = item.id;
      const existing = getBomsForFinishedGood(item.id);
      state.currentBOM = {
        id: null,
        finishedGoodId: item.id,
        finishingServiceId: null,
        bomNo: getBomNoForFinishedGood(item),
        version: existing.length ? nextVersionForBomNo(getBomNoForFinishedGood(item)) : "1.0",
        status: "Draft"
      };
      state.workflowError = "";
      state.searches.bomFinishedGood = "";
      state.searches.bomFinishingService = "";
      state.fgSelectorOpen = false;
      state.fsSelectorOpen = false;
      state.selectedFinishingServiceId = null;
      state.bomProfitPercent = 0;
      state.bomOverheadPercent = 0;
      resetBomCostingExtras();
      closeModal();
      state.bomMaterials = [];
      state.bomOtherMaterials = [];
      state.bomServices = [];
      state.bomAdditionalServices = [];
      state.bomFinishingServices = [];
      seedBomGeneralServices();
      warnBomOtherMaterialPlyCatalog(getFinishedGoodPly(item));
      recalculateBOMCosts();
      renderFinishedGoodSelector();
      refreshBomViews();
      persistEditorState();
    }

    function plyLayerClass(layer) {
      if (layer === "Single Layer") return "ply-single";
      if (layer === "Top Liner") return "ply-top";
      if (layer === "Inner Liner" || layer === "Fluting") return "ply-flute";
      if (layer === "Bottom Liner") return "ply-bottom";
      return "";
    }

    function renderPlyVisualization(ply) {
      let layers = getStructuralLayers(ply);
      if (Number(ply) === 3) {
        const displayOrder = ["Top Liner", "Bottom Liner", "Inner Liner"];
        layers = displayOrder.filter((layer) => layers.includes(layer))
          .concat(layers.filter((layer) => !displayOrder.includes(layer)));
      }
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

      const hasCalcErrors = currentBomHasCalculationErrors();
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
              <button type="button" class="btn btn-primary" id="btn-save-draft" ${hasCalcErrors ? "disabled" : ""} title="${hasCalcErrors ? "Fix calculation errors before saving" : ""}">Save Draft</button>
              <button type="button" class="btn btn-activate" id="btn-activate-bom" ${hasCalcErrors ? "disabled" : ""} title="${hasCalcErrors ? "Fix calculation errors before saving" : ""}">Activate BOM</button>
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
        ? rows.map((item, index) => `
            <tr>
              <td class="fm-num">${index + 1}</td>
              <td class="mono fm-code">${escapeHtml(item.bomNo)}</td>
              <td>
                <div class="fm-name">${escapeHtml(item.finishedGoodName)}</div>
              </td>
              <td>${escapeHtml(item.variant)}</td>
              <td><span class="badge badge-info">${escapeHtml(item.version)}</span></td>
              <td>${statusBadge(item.status, item.status === "Active")}</td>
              <td class="fm-expr-cell"><code class="fm-expr">${formatRupees(item.finalCostPerPiece)}</code></td>
              <td class="fm-code">${escapeHtml(formatDateTime(item.updatedAt))}</td>
              <td>
                <div class="row-actions">
                  <button type="button" class="btn btn-sm" data-load-bom="${item.id}">View / Edit</button>
                  <button type="button" class="btn btn-sm btn-duplicate" data-duplicate-bom="${item.id}">Duplicate</button>
                </div>
              </td>
            </tr>
          `).join("")
        : emptyRow(9, "No saved BOMs match this search.");

      document.getElementById("page-bom-list").innerHTML = `
        <div class="toolbar fm-hero">
          <div>
            <div class="section-kicker">Repository</div>
            <div class="section-title">BOM List</div>
            <div class="fm-hero-sub">Saved drafts and active versions</div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-new-bom">New BOM</button>
        </div>
        <div class="card fm-controls">
          <div class="toolbar" style="margin-bottom:0;">
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
        </div>
        <div class="card fm-group is-sheet">
          <div class="card-body">
            <div class="section-head">
              <div class="fm-group-title">
                <span class="fm-group-icon"><i data-lucide="clipboard-list"></i></span>
                <div>
                  <div class="section-kicker">Saved BOMs</div>
                  <div class="section-title">Records</div>
                </div>
              </div>
              <span class="badge badge-muted">${rows.length}</span>
            </div>
            <div class="table-wrap">
              <table class="data-table fm-table" style="min-width:1100px;">
                <thead>
                  <tr>
                    <th class="fm-num">#</th>
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
        </div>
      `;
    }

    function renderProductInformationCard(item, options) {
      const opts = options || {};
      const kicker = opts.kicker || "Finished Good";
      return `
        <div class="pi-grid">
          <div>
            <div class="section-kicker">${escapeHtml(kicker)}</div>
            <div class="pi-fields">
              <div class="product-name">${escapeHtml(item?.product ?? "missing data")}</div>
              <div>
                <div class="field-label">Variant</div>
                <div class="field-value">${escapeHtml(item?.variant ?? "—")}</div>
              </div>
              <div>
                <div class="field-label">Style</div>
                <div class="field-value">${escapeHtml(item?.style ?? "—")}</div>
              </div>
              <div>
                <div class="field-label">Ply</div>
                <div class="field-value">${escapeHtml(item?.ply ?? "—")} Ply</div>
              </div>
              <div>
                <div class="field-label">UOM</div>
                <div class="field-value">${escapeHtml(item?.uom ?? "—")}</div>
              </div>
              <div>
                <div class="field-label">Dimensions</div>
                <div class="field-value">${escapeHtml(formatDimensions(item) || "missing data")}</div>
              </div>
            </div>
          </div>
          <div>
            <div class="section-kicker" style="margin-bottom:8px;">${escapeHtml(item?.ply ?? "—")} Ply Structure</div>
            ${renderPlyVisualization(item?.ply)}
            ${plyLayerMappingHint()}
          </div>
        </div>
        ${renderCalculatedDimensionsSection(item, {
          title: opts.calculatedTitle,
          sectionId: opts.sectionId,
          gridId: opts.gridId
        })}
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
            <div class="cc-step">Step ${getBomVisibleStepNumbers().product}: Product Information</div>
            ${renderProductInformationCard(fg, {
              kicker: "Finished Good",
              calculatedTitle: "Variable values for this finished good"
            })}
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
      root.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="section-head">
              <div>
                <div class="cc-step">Step ${getBomVisibleStepNumbers().style}: Style Formulas</div>
                <div class="section-title">Style Formulas (Auto-calculated)</div>
              </div>
              <span class="badge badge-muted">Read-only</span>
            </div>
            <p class="stat-hint" style="margin:0 0 12px;">Linked to style <strong>${escapeHtml(fg?.style ?? "—")}</strong>. Values update when the finished good or style variables change.</p>
            ${renderStyleFormulaResultRows(rows)}
          </div>
        </div>
      `;
    }

    function renderBomMaterialCard(options) {
      const line = options.line;
      const layer = options.layer;
      const ply = options.ply;
      const extra = Boolean(options.extra);
      const index = options.index;
      const material = line ? getRawMaterial(line.rawMaterialId) : null;
      const missingMaterialId = line && line.rawMaterialId && !material ? line.rawMaterialId : null;
      const formula = line
        ? (line.calculationMethod === "formula" ? getMaterialQtyFormula(material) : getFormula(line.formulaId))
        : null;
      const methodLabel = line && line.calculationMethod === "manual" ? "Manual" : "Formula";
      const formulaLabel = line && line.calculationMethod === "formula" && formula ? formula.name : "—";
      const materials = extra
        ? getBomExtraMaterialOptions(line && line.rawMaterialId)
        : getBomSlotMaterialOptions(ply, line && line.rawMaterialId);
      const selectId = extra ? "bom-extra-mat-" + line.id : "bom-layer-mat-" + index;
      const selectAttr = extra
        ? `data-bom-extra-material="${line.id}"`
        : `data-bom-layer-material="${escapeHtml(layer)}"`;
      const autoDims = line ? getAutoQuantityLW(getSelectedFinishedGood(), line.dimensionId) : null;
      const customDims = line && isUseCustomDimensions(line)
        ? renderLengthWidthArea(line.customLength, line.customWidth)
        : "—";
      return `
        <div class="cc-layer">
          <div class="cc-layer-head">
            <div class="cc-layer-title">${escapeHtml(layer)}${extra ? ` <span class="badge badge-muted">Extra</span>` : ""}</div>
            ${line ? `
              <div class="row-actions">
                <button type="button" class="btn btn-sm btn-icon" data-breakdown-line="${line.id}" title="Calculation breakdown">
                  <i data-lucide="calculator"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon" data-edit-line="${line.id}" title="Edit calculation details">
                  <i data-lucide="pencil"></i>
                </button>
                ${extra ? `
                  <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-line="${line.id}" title="Delete">
                    <i data-lucide="trash-2"></i>
                  </button>
                ` : ""}
              </div>
            ` : ""}
          </div>
          <label class="form-label" for="${selectId}">Material</label>
          <select id="${selectId}" class="full-select" ${selectAttr} aria-label="${escapeHtml(layer)} material">
            <option value="">Select Material</option>
            ${missingMaterialId ? `<option value="${escapeHtml(String(missingMaterialId))}" selected>Missing material (ID: ${escapeHtml(String(missingMaterialId))})</option>` : ""}
            ${materials.map((item) => `
              <option value="${item.id}" ${line && Number(line.rawMaterialId) === item.id ? "selected" : ""}>${escapeHtml(item.name)} (${escapeHtml(item.code)})</option>
            `).join("")}
          </select>
          ${missingMaterialId ? `<p class="stat-hint">Missing material (ID: ${escapeHtml(String(missingMaterialId))}). Re-select a valid raw material to continue.</p>` : ""}
          ${line && line.error ? `<div class="field-error">⚠ ${escapeHtml(line.error)}</div>` : ""}
          ${line ? `
            <div class="cc-layer-facts">
              <div><span>Dimension</span><strong>${autoDims ? renderLengthWidthArea(autoDims.L, autoDims.W) : "—"}</strong></div>
              <div><span>Manual Dimension</span><strong>${customDims}</strong></div>
            </div>
            <div class="table-wrap cc-layer-metrics-wrap">
              <table class="data-table cc-grid-table cc-layer-metrics">
                <thead>
                  <tr>
                    <th>Calculation</th>
                    <th>Formula</th>
                    <th>Net Qty</th>
                    <th>Wastage %</th>
                    <th>Gross Qty</th>
                    <th>Required Qty</th>
                    <th>Rate</th>
                    <th title="${escapeHtml(FIXED_COST_FORMULAS.lineCost.description)}">Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${escapeHtml(methodLabel)}</td>
                    <td>${renderFormulaNameWithQty(formulaLabel, line.error ? "—" : formatQty(line.grossQty), formulaHelpButton("material", line.id, "Explain quantity"))}</td>
                    <td class="cc-layer-num">${line.error ? "—" : formatQty(line.netQty)}</td>
                    <td>
                      <input class="wastage-input" type="number" min="0" max="100" step="0.01" data-wastage-line="${line.id}" value="${escapeHtml(formatDecimal(line.wastagePercent, 2, false))}" aria-label="${escapeHtml(layer)} wastage percent" />
                    </td>
                    <td class="cc-layer-num">${line.error ? "—" : formatQty(line.grossQty)}</td>
                    <td class="cc-layer-num cc-layer-emphasis">${formatBomRequiredQtyFromOrder()}</td>
                    <td class="cc-layer-num">${material ? formatRatePkr(line.rate, (getMaterialRate(material.id) && getMaterialRate(material.id).rateUOM) || "") : "—"}</td>
                    <td class="cc-layer-num">${line.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(line.costPerPiece)}</td>
                    <td class="cc-layer-num cc-layer-emphasis">${formatBomLineOrderTotal(line.costPerPiece, line.error)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : `<p class="stat-hint">Select a material for this ply layer. Calculation details become available after a material is chosen.</p>`}
        </div>
      `;
    }

    function renderMaterialSection() {
      const root = document.getElementById("bom-materials-root");
      if (!root) return;
      const fg = getSelectedFinishedGood();
      if (!fg) {
        root.innerHTML = "";
        return;
      }
      const layout = getBomMaterialSlotLayout(fg, state.bomMaterials);
      const slotCards = layout.slots.map((slot, index) => renderBomMaterialCard({
        layer: slot.layer,
        line: slot.line,
        ply: layout.ply,
        extra: false,
        index
      })).join("");
      const hasCalcErrors = (state.bomMaterials || []).some((line) => line.error);
      root.innerHTML = `
        <section class="card cc-card">
          <div class="card-body">
            <div class="cc-step">Step ${getBomVisibleStepNumbers().materials}: Select Raw Materials</div>
            <p class="stat-hint" style="margin:0 0 12px;">One material slot per ${escapeHtml(String(layout.ply))}-ply structural layer. Totals still use every BOM material line, including leftover extras.</p>
            ${slotCards || `<p class="stat-hint">No structural layers for this ply.</p>`}
            <div class="cc-total-line"><span>Total Material Cost</span><strong>${hasCalcErrors ? "Error" : formatRupees(state.totalMaterialCost)}</strong></div>
          </div>
        </section>
      `;
    }

    function renderBomAdditionalServiceCard(line, index) {
      const service = line ? getService(line.serviceId) : null;
      const missingServiceId = line && line.serviceId && !service ? line.serviceId : null;
      const formula = line && line.calculationMethod === "formula"
        ? getFormula(getServiceDefaultFormulaId(service && service.id))
        : getFormula(line && line.formulaId);
      const methodLabel = line && line.calculationMethod === "manual" ? "Manual" : "Formula";
      const formulaLabel = line && line.calculationMethod === "formula" && formula ? formula.name : "—";
      const options = getActiveServicesForBomPicker(line && line.serviceId, "general");
      const title = service ? service.name : (line && line.layer ? line.layer : "Additional");
      const selectId = "bom-additional-svc-" + (line && line.id != null ? line.id : index);
      const dimLabel = line && line.dimensionId ? formatDimensionChipLabel(getDimension(line.dimensionId)) : "—";
      return `
        <div class="cc-layer">
          <div class="cc-layer-head">
            <div class="cc-layer-title">${escapeHtml(title)} <span class="badge badge-muted">Extra</span></div>
            ${line ? `
              <div class="row-actions">
                <button type="button" class="btn btn-sm btn-icon" data-breakdown-additional-service="${line.id}" title="Calculation breakdown">
                  <i data-lucide="calculator"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-additional-service="${line.id}" title="Delete">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            ` : ""}
          </div>
          <label class="form-label" for="${selectId}">Service</label>
          <select id="${selectId}" class="full-select" data-bom-additional-service="${line ? line.id : ""}" aria-label="Additional service">
            <option value="">Select Service</option>
            ${missingServiceId ? `<option value="${escapeHtml(String(missingServiceId))}" selected>Missing service (ID: ${escapeHtml(String(missingServiceId))})</option>` : ""}
            ${options.map((item) => `
              <option value="${item.id}" ${line && Number(line.serviceId) === item.id ? "selected" : ""}>${escapeHtml(item.name)} (${escapeHtml(item.code)})</option>
            `).join("")}
          </select>
          ${missingServiceId ? `<p class="stat-hint">Missing service (ID: ${escapeHtml(String(missingServiceId))}). Re-select a valid service to continue.</p>` : ""}
          ${line && line.error ? `<div class="field-error">⚠ ${escapeHtml(line.error)}</div>` : ""}
          ${line && line.serviceId ? `
            <div class="cc-metrics">
              <div><span>Calculation</span><strong>${escapeHtml(methodLabel)}</strong></div>
              <div><span>Formula</span><strong class="formula-cell">${escapeHtml(formulaLabel)}${formulaHelpButton("service", line.id, "Explain quantity")}</strong></div>
              <div><span>Dimension</span><strong>${escapeHtml(dimLabel)}</strong></div>
              <div><span>Qty / Piece</span><strong>${line.error ? "—" : formatQty(line.quantity)}</strong></div>
              <div>
                <span>Rate</span>
                <strong>${service ? formatRatePkr(line.rate, (getServiceRate(line.serviceId) && getServiceRate(line.serviceId).rateUOM) || "") : "—"}</strong>
              </div>
              <div><span>Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</span><strong>${line.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(line.costPerPiece)}</strong></div>
            </div>
          ` : `<p class="stat-hint">Select a service. Cost is calculated with the Services engine (no wastage).</p>`}
        </div>
      `;
    }

    function renderBomOtherMaterialCard(options) {
      const line = options.line;
      const layer = options.layer;
      const ply = options.ply;
      const extra = Boolean(options.extra);
      const index = options.index;
      const material = line ? getOtherRawMaterial(line.otherRawMaterialId) : null;
      const formula = line
        ? (line.calculationMethod === "formula" ? getOtherMaterialQtyFormula(material) : getFormula(line.formulaId))
        : null;
      const methodLabel = line && line.calculationMethod === "manual" ? "Manual" : "Formula";
      const formulaLabel = line && line.calculationMethod === "formula" && formula ? formula.name : "—";
      const materials = extra
        ? getBomOtherExtraMaterialOptions(line && line.otherRawMaterialId)
        : getBomOtherSlotMaterialOptions(ply, line && line.otherRawMaterialId);
      const selectId = extra ? "bom-other-extra-mat-" + line.id : "bom-other-layer-mat-" + index;
      const selectAttr = extra
        ? `data-bom-other-extra-material="${line.id}"`
        : `data-bom-other-layer-material="${escapeHtml(layer)}"`;
      const dimLabel = line && line.dimensionId ? formatDimensionChipLabel(getDimension(line.dimensionId)) : "—";
      return `
        <div class="cc-layer">
          <div class="cc-layer-head">
            <div class="cc-layer-title">${escapeHtml(layer)}${extra ? ` <span class="badge badge-muted">Extra</span>` : ""}</div>
            ${line ? `
              <div class="row-actions">
                <button type="button" class="btn btn-sm btn-icon" data-breakdown-other-line="${line.id}" title="Calculation breakdown">
                  <i data-lucide="calculator"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon" data-edit-other-line="${line.id}" title="Edit calculation details">
                  <i data-lucide="pencil"></i>
                </button>
                ${extra ? `
                  <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-other-line="${line.id}" title="Delete">
                    <i data-lucide="trash-2"></i>
                  </button>
                ` : ""}
              </div>
            ` : ""}
          </div>
          <label class="form-label" for="${selectId}">Other Material</label>
          <select id="${selectId}" class="full-select" ${selectAttr} aria-label="${escapeHtml(layer)} other material">
            <option value="">Select Other Material</option>
            ${materials.map((item) => `
              <option value="${item.id}" ${line && Number(line.otherRawMaterialId) === item.id ? "selected" : ""}>${escapeHtml(item.name)} (${escapeHtml(item.code)})</option>
            `).join("")}
          </select>
          ${line && line.error ? `<div class="field-error">⚠ ${escapeHtml(line.error)}</div>` : ""}
          ${line ? `
            <div class="cc-metrics">
              <div><span>Calculation</span><strong>${escapeHtml(methodLabel)}</strong></div>
              <div><span>Formula</span><strong class="formula-cell">${escapeHtml(formulaLabel)}${formulaHelpButton("other-material", line.id, "Explain quantity")}</strong></div>
              <div><span>Dimension</span><strong>${escapeHtml(dimLabel)}</strong></div>
              <div><span>Manual Qty</span><strong>${line.calculationMethod === "manual" ? formatQty(line.manualQty) : "—"}</strong></div>
              <div><span>Net Qty</span><strong>${line.error ? "—" : formatQty(line.netQty)}</strong></div>
              <div>
                <span>Wastage %</span>
                <input class="wastage-input" type="number" min="0" max="100" step="0.01" data-other-wastage-line="${line.id}" value="${escapeHtml(formatDecimal(line.wastagePercent, 2, false))}" aria-label="${escapeHtml(layer)} other material wastage percent" />
              </div>
              <div><span>Gross Qty</span><strong>${line.error ? "—" : formatQty(line.grossQty)}</strong></div>
              <div>
                <span>Rate</span>
                <strong>${material ? formatRatePkr(line.rate, (getOtherMaterialRate(material.id) && getOtherMaterialRate(material.id).rateUOM) || "") : "—"}</strong>
              </div>
              <div><span>Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</span><strong>${line.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(line.costPerPiece)}</strong></div>
            </div>
          ` : `<p class="stat-hint">Optional. Select an other raw material for this ply layer, or leave empty.</p>`}
        </div>
      `;
    }

    function renderOtherMaterialSection() {
      const root = document.getElementById("bom-other-materials-root");
      if (!root) return;
      const fg = getSelectedFinishedGood();
      if (!fg) {
        root.innerHTML = "";
        return;
      }
      const materialLayout = getBomMaterialSlotLayout(fg, state.bomMaterials);
      const extraRows = materialLayout.extras || [];
      const additionalRows = state.bomAdditionalServices || [];
      const extraMaterialCost = extraRows.reduce((sum, line) => sum + Number(line.costPerPiece || 0), 0);
      const additionalSectionCost = extraMaterialCost + calculateTotalAdditionalServiceCost();
      const additionalHasErrors = extraRows.some((line) => line.error)
        || additionalRows.some((line) => line.error);
      const extraBody = extraRows.map((line, index) => {
        const material = getRawMaterial(line.rawMaterialId);
        const formula = line.calculationMethod === "formula"
          ? getMaterialQtyFormula(material)
          : getFormula(line.formulaId);
        const methodLabel = line.calculationMethod === "manual" ? "Manual" : "Formula";
        const formulaLabel = line.calculationMethod === "formula" && formula ? formula.name : "—";
        return `
          <tr>
            <td>${index + 1}</td>
            <td>
              <div>${escapeHtml(material ? material.name : "Unknown material")}</div>
              ${line.error ? `<div class="field-error">${line.error === SERVICE_CUSTOM_DIM_ERROR ? escapeHtml(line.error) : "⚠ " + escapeHtml(line.error)}</div>` : ""}
              <div class="stat-hint">${escapeHtml(material ? material.code : "")}${line.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(line.dimensionId))) : ""}</div>
            </td>
            <td>${escapeHtml(methodLabel)}</td>
            <td>
              <span class="formula-cell">
                ${escapeHtml(formulaLabel)}
                ${formulaHelpButton("material", line.id, "Explain quantity")}
              </span>
            </td>
            <td>${formatQty(line.netQty)}</td>
            <td>
              ${material ? formatRatePkr(line.rate, (getMaterialRate(material.id) && getMaterialRate(material.id).rateUOM) || "") : "—"}
              <div class="stat-hint">Material Rates</div>
            </td>
            <td>${line.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(line.costPerPiece)}</td>
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
      }).join("");
      const serviceBody = additionalRows.map((line, index) => {
        const service = getService(line.serviceId);
        const formula = line.calculationMethod === "formula"
          ? getFormula(getServiceDefaultFormulaId(service && service.id))
          : getFormula(line.formulaId);
        const methodLabel = line.calculationMethod === "manual" ? "Manual" : "Formula";
        const formulaLabel = line.calculationMethod === "formula" && formula ? formula.name : "—";
        return `
          <tr>
            <td>${extraRows.length + index + 1}</td>
            <td>
              <div>${escapeHtml(service ? service.name : "Unknown material")}</div>
              ${line.error ? `<div class="field-error">${line.error === SERVICE_CUSTOM_DIM_ERROR ? escapeHtml(line.error) : "⚠ " + escapeHtml(line.error)}</div>` : ""}
              <div class="stat-hint">${escapeHtml(service ? service.code : "")}${line.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(line.dimensionId))) : ""}</div>
            </td>
            <td>${escapeHtml(methodLabel)}</td>
            <td>
              <span class="formula-cell">
                ${escapeHtml(formulaLabel)}
                ${formulaHelpButton("service", line.id, "Explain quantity")}
              </span>
            </td>
            <td>${formatQty(line.quantity)}</td>
            <td>
              ${service ? formatRatePkr(line.rate, (getServiceRate(line.serviceId) && getServiceRate(line.serviceId).rateUOM) || "") : "—"}
              <div class="stat-hint">Material Rates</div>
            </td>
            <td>${line.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(line.costPerPiece)}</td>
            <td>
              <div class="row-actions">
                <button type="button" class="btn btn-sm btn-icon" data-breakdown-additional-service="${line.id}" title="Calculation breakdown">
                  <i data-lucide="calculator"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon" data-edit-additional-service="${line.id}" title="Edit">
                  <i data-lucide="pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-additional-service="${line.id}" title="Delete">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
      const additionalBody = (extraRows.length || additionalRows.length)
        ? extraBody + serviceBody
        : emptyRow(8, "No materials added yet.");
      root.innerHTML = `
        <section class="card cc-card">
          <div class="card-body">
            <div class="cc-step">Step ${getBomVisibleStepNumbers().otherMaterials}: Additional materials</div>
            <div class="section-head" style="margin-top:0;">
              <div>
                <div class="section-title">Additional materials</div>
                <p class="stat-hint" style="margin:0;">Add Block, Film, Plate, and similar items here. New lines load from Raw Material Master. Leftover raw-material lines that are not ply slots stay until you delete them.</p>
              </div>
              <button type="button" class="btn btn-primary" id="btn-add-additional-service">
                <i data-lucide="plus"></i> Add Material
              </button>
            </div>
            <div class="table-wrap">
              <table class="data-table" style="min-width:980px;">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Material</th>
                    <th>Calculation</th>
                    <th>Formula</th>
                    <th>Qty / Piece</th>
                    <th>Rate</th>
                    <th title="${escapeHtml(FIXED_COST_FORMULAS.lineCost.description)}">Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>${additionalBody}</tbody>
              </table>
            </div>
            <div class="cc-total-line"><span>Total Additional Materials Cost</span><strong>${additionalHasErrors ? "Error" : formatRupees(additionalSectionCost)}</strong></div>
          </div>
        </section>
      `;
    }

    function renderServiceSection() {
      const root = document.getElementById("bom-services-root");
      if (!root) return;
      const hasFg = Boolean(getSelectedFinishedGood());
      if (!hasFg) {
        root.innerHTML = "";
        return;
      }
      if (seedBomGeneralServices()) {
        recalculateBOMCosts();
        persistEditorState();
      }
      const rows = state.bomServices;
      const hasServiceErrors = rows.some((line) => line.error);

      const body = rows.length
          ? rows.map((line, index) => {
              const service = getService(line.serviceId);
              const formula = line.calculationMethod === "formula"
                ? getFormula(getServiceDefaultFormulaId(service && service.id))
                : getFormula(line.formulaId);
              const methodLabel = line.calculationMethod === "manual" ? "Manual" : "Formula";
              const formulaLabel = line.calculationMethod === "formula" && formula ? formula.name : "—";
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <div>${escapeHtml(service ? service.name : "Unknown service")}</div>
                    ${line.error ? `<div class="field-error">${line.error === SERVICE_CUSTOM_DIM_ERROR ? escapeHtml(line.error) : "⚠ " + escapeHtml(line.error)}</div>` : ""}
                    <div class="stat-hint">${escapeHtml(service ? service.code : "")}${line.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(line.dimensionId))) : ""}</div>
                  </td>
                  <td>${escapeHtml(methodLabel)}</td>
                  <td>
                    ${renderFormulaNameWithQty(formulaLabel, line.error ? "—" : formatQty(line.quantity), formulaHelpButton("service", line.id, "Explain quantity"))}
                  </td>
                  <td>${formatStep6RequiredQty()}</td>
                  <td>
                    ${service ? formatRatePkr(line.rate, (getServiceRate(line.serviceId) && getServiceRate(line.serviceId).rateUOM) || "") : "—"}
                    <div class="stat-hint">Service Rates</div>
                  </td>
                  <td>${line.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(line.costPerPiece)}</td>
                  <td>${formatStep6LineTotal(line.costPerPiece, line.error)}</td>
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
          : emptyRow(9, "No services added yet.");

      root.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="section-head">
              <div>
                <div class="cc-step">Step ${getBomVisibleStepNumbers().services}: Select Packaging Services</div>
                <div class="section-title">Conversion steps</div>
              </div>
              <button type="button" class="btn btn-primary" id="btn-add-service" ${hasFg ? "" : "disabled"}>
                <i data-lucide="plus"></i> Add Services
              </button>
            </div>
            <div class="table-wrap">
              <table class="data-table cc-grid-table" style="min-width:1080px;">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th>Calculation</th>
                    <th>Formula</th>
                    <th>Required Qty</th>
                    <th>Rate</th>
                    <th title="${escapeHtml(FIXED_COST_FORMULAS.lineCost.description)}">Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</th>
                    <th>Total Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>${body}</tbody>
                ${rows.length ? renderStep6SubtotalFooter(state.totalServiceCost, hasServiceErrors) : ""}
              </table>
            </div>
          </div>
        </div>
      `;
    }

    function renderFinishingServicesSection() {
      const root = document.getElementById("bom-finishing-root");
      if (!root) return;
      const hasFg = Boolean(getSelectedFinishedGood());
      if (!hasFg) {
        root.innerHTML = "";
        return;
      }
      const rows = state.bomFinishingServices || [];
      const hasFinishingErrors = rows.some((line) => line.error);

      const body = rows.length
          ? rows.map((line, index) => {
              const service = getService(line.serviceId);
              const formula = line.calculationMethod === "formula"
                ? getFormula(getServiceDefaultFormulaId(service && service.id))
                : getFormula(line.formulaId);
              const methodLabel = line.calculationMethod === "manual" ? "Manual" : "Formula";
              const formulaLabel = line.calculationMethod === "formula" && formula ? formula.name : "—";
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <div>${escapeHtml(service ? service.name : "Unknown service")}</div>
                    ${line.error ? `<div class="field-error">${line.error === SERVICE_CUSTOM_DIM_ERROR ? escapeHtml(line.error) : "⚠ " + escapeHtml(line.error)}</div>` : ""}
                    <div class="stat-hint">${escapeHtml(service ? service.code : "")}${line.dimensionId ? " · " + escapeHtml(formatDimensionChipLabel(getDimension(line.dimensionId))) : ""}</div>
                  </td>
                  <td>${escapeHtml(methodLabel)}</td>
                  <td>
                    ${renderFormulaNameWithQty(formulaLabel, line.error ? "—" : formatQty(line.quantity), formulaHelpButton("service", line.id, "Explain quantity"))}
                  </td>
                  <td>${formatBomRequiredQtyFromOrder()}</td>
                  <td>
                    ${service ? formatRatePkr(line.rate, (getServiceRate(line.serviceId) && getServiceRate(line.serviceId).rateUOM) || "") : "—"}
                    <div class="stat-hint">Service Rates</div>
                  </td>
                  <td>${line.error ? `<span class="calc-error-cost">Error</span>` : formatRupees(line.costPerPiece)}</td>
                  <td>${formatBomLineOrderTotal(line.costPerPiece, line.error)}</td>
                  <td>
                    <div class="row-actions">
                      <button type="button" class="btn btn-sm btn-icon" data-breakdown-finishing-service="${line.id}" title="Calculation breakdown">
                        <i data-lucide="calculator"></i>
                      </button>
                      <button type="button" class="btn btn-sm btn-icon" data-edit-finishing-service="${line.id}" title="Edit">
                        <i data-lucide="pencil"></i>
                      </button>
                      <button type="button" class="btn btn-sm btn-icon btn-danger" data-delete-finishing-service="${line.id}" title="Delete">
                        <i data-lucide="trash-2"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")
          : emptyRow(9, "No finishing services added yet.");

      root.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="section-head">
              <div>
                <div class="cc-step">Step ${getBomVisibleStepNumbers().finishing}: Finishing Services</div>
                <div class="section-title">Finishing steps</div>
              </div>
              <button type="button" class="btn btn-primary" id="btn-add-finishing-service" ${hasFg ? "" : "disabled"}>
                <i data-lucide="plus"></i> Add Finishing Service
              </button>
            </div>
            <div class="table-wrap">
              <table class="data-table cc-grid-table" style="min-width:1080px;">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Finishing Service</th>
                    <th>Calculation</th>
                    <th>Formula</th>
                    <th>Required Qty</th>
                    <th>Rate</th>
                    <th title="${escapeHtml(FIXED_COST_FORMULAS.lineCost.description)}">Cost / Piece ${fixedFormulaMark(FIXED_COST_FORMULAS.lineCost.formula, FIXED_COST_FORMULAS.lineCost.description)}</th>
                    <th>Total Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>${body}</tbody>
                ${rows.length ? renderBomStepSubtotalFooter(state.totalFinishingServiceCost, hasFinishingErrors) : ""}
              </table>
            </div>
          </div>
        </div>
      `;
    }

    function renderCostSummary() {
      const root = document.getElementById("bom-cost-root");
      if (!root) return;
      const calcErrors = collectBomCalculationErrors();
      const hasCalcErrors = calcErrors.length > 0;
      const showColorCost = hasBomColorCost();
      const total = hasCalcErrors ? 0 : (Number(state.finalCostPerPiece) || 0);
      const materialPct = total > 0 ? roundTo((Number(state.totalMaterialCost) / total) * 100, 1) : 0;
      const servicePct = total > 0 ? roundTo((Number(state.totalServiceCost) / total) * 100, 1) : 0;
      const finishingPct = total > 0 ? roundTo((Number(state.totalFinishingServiceCost) / total) * 100, 1) : 0;
      const colorPct = showColorCost && total > 0 ? roundTo((Number(state.totalColorCost) / total) * 100, 1) : 0;
      const colorsValue = state.bomNumberOfColors == null || state.bomNumberOfColors === ""
        ? ""
        : String(state.bomNumberOfColors);
      const colorRateValue = state.bomColorRate == null || state.bomColorRate === ""
        ? ""
        : formatDecimal(state.bomColorRate, 2, false);
      const orderQtyValue = state.bomOrderQuantity == null || state.bomOrderQuantity === ""
        ? ""
        : formatDecimal(state.bomOrderQuantity, 4, false);
      root.innerHTML = `
        <div class="card cost-summary">
          <div class="card-body">
            <div class="section-kicker">Cost Summary (PKR)</div>
            <div class="section-title" style="margin-bottom:12px;">Per piece roll-up</div>
            ${renderBomCalculationErrorBanner(calcErrors)}
            <div class="cost-optional-row">
              <div class="cost-optional-field">
                <label class="form-label" for="bom-number-of-colors">Number of Colors</label>
                <input class="wastage-input" type="text" inputmode="numeric" id="bom-number-of-colors" value="${escapeHtml(colorsValue)}" placeholder="Optional" aria-label="Number of colors" />
              </div>
              <div class="cost-optional-field">
                <label class="form-label" for="bom-color-rate">Rate per Color (Rs.)</label>
                <input class="wastage-input" type="number" min="0.01" max="999999.99" step="0.01" id="bom-color-rate" value="${escapeHtml(colorRateValue)}" placeholder="Optional" aria-label="Rate per color in rupees" />
              </div>
            </div>
            <div class="cost-optional-row">
              <div class="cost-optional-field">
                <label class="form-label" for="bom-order-quantity">Order Quantity</label>
                <input class="wastage-input" type="number" min="0.0001" max="999999" step="0.0001" id="bom-order-quantity" value="${escapeHtml(orderQtyValue)}" placeholder="Optional" aria-label="Order quantity" />
              </div>
              <div class="cost-optional-field">
                <label class="form-label" for="bom-order-quantity-uom">UOM</label>
                <select id="bom-order-quantity-uom" class="full-select" aria-label="Order quantity unit">
                  ${finishedGoodUomOptions(state.bomOrderQuantityUOM || "pieces")}
                </select>
              </div>
            </div>
            <div class="cost-row">
              <span>Material Per Piece Cost</span>
              <strong>${hasCalcErrors ? "Error" : formatCurrency(state.totalMaterialCost)}</strong>
            </div>
            <div class="cost-row">
              ${labeledFixedFormula("Material Total Cost", FIXED_COST_FORMULAS.materialTotal.formula, FIXED_COST_FORMULAS.materialTotal.description)}
              <strong>${formatBomLineOrderTotal(state.totalMaterialCost, hasCalcErrors)}</strong>
            </div>
            <div class="cost-row">
              <span>Service Per Piece Cost</span>
              <strong>${hasCalcErrors ? "Error" : formatCurrency(state.totalServiceCost)}</strong>
            </div>
            <div class="cost-row">
              <span>Service Total Cost</span>
              <strong>${formatStep6LineTotal(state.totalServiceCost, hasCalcErrors)}</strong>
            </div>
            <div class="cost-row">
              <span>Finishing Services Per Piece Cost</span>
              <strong>${hasCalcErrors ? "Error" : formatCurrency(state.totalFinishingServiceCost)}</strong>
            </div>
            <div class="cost-row">
              ${labeledFixedFormula("Finishing Services Total Cost", FIXED_COST_FORMULAS.finishingTotal.formula, FIXED_COST_FORMULAS.finishingTotal.description)}
              <strong>${formatBomLineOrderTotal(state.totalFinishingServiceCost, hasCalcErrors)}</strong>
            </div>
            ${showColorCost ? `
            <div class="cost-row">
              ${labeledFixedFormula("Color Printing Cost", FIXED_COST_FORMULAS.colorCost.formula, FIXED_COST_FORMULAS.colorCost.description)}
              <strong>${hasCalcErrors ? "Error" : formatCurrency(state.totalColorCost)}</strong>
            </div>
            ` : ""}
            <div class="cost-row cost-final">
              ${labeledFixedFormula("Final Cost", FIXED_COST_FORMULAS.finalCost.formula, FIXED_COST_FORMULAS.finalCost.description)}
              <strong>${hasCalcErrors ? "Error calculating cost" : formatCurrency(state.batchFinalCost)}</strong>
            </div>
            <div class="cost-row">
              ${labeledFixedFormula("Cost / 1 Piece", FIXED_COST_FORMULAS.per1.formula, FIXED_COST_FORMULAS.per1.description)}
              <strong>${hasCalcErrors ? "Error" : formatCurrency(state.costPer1)}</strong>
            </div>
            <div class="cost-row">
              ${labeledFixedFormula("Cost / 100", FIXED_COST_FORMULAS.per100.formula, FIXED_COST_FORMULAS.per100.description)}
              <strong>${hasCalcErrors ? "Error" : formatCurrency(state.costPer100)}</strong>
            </div>
            <div class="cost-row">
              ${labeledFixedFormula("Cost / 500", FIXED_COST_FORMULAS.per500.formula, FIXED_COST_FORMULAS.per500.description)}
              <strong>${hasCalcErrors ? "Error" : formatCurrency(state.costPer500)}</strong>
            </div>
            <div class="cost-row">
              ${labeledFixedFormula("Cost / 1,000", FIXED_COST_FORMULAS.per1000.formula, FIXED_COST_FORMULAS.per1000.description)}
              <strong>${hasCalcErrors ? "Error" : formatCurrency(state.costPer1000)}</strong>
            </div>
            <div class="cost-row">
              ${labeledFixedFormula("Cost / Given Quantity", FIXED_COST_FORMULAS.givenQuantity.formula, FIXED_COST_FORMULAS.givenQuantity.description)}
              <strong>${formatPackGivenCost(state.costPerGivenQuantity, hasCalcErrors, formatCurrency)}</strong>
            </div>
            <div class="cost-row">
              ${labeledFixedFormula("Additional Cost", FIXED_COST_FORMULAS.additionalCost.formula, FIXED_COST_FORMULAS.additionalCost.description)}
              <strong>${hasCalcErrors ? "Error" : formatCurrency(calculateTotalConsumableMaterialCost())}</strong>
            </div>
            <div class="cost-row">
              <span>Profit %</span>
              <input class="wastage-input" type="number" min="0" max="100" step="0.01" id="bom-profit-percent" value="${escapeHtml(formatDecimal(state.bomProfitPercent, 2, false))}" />
            </div>
            <div class="cost-row">
              <span>Overhead %</span>
              <input class="wastage-input" type="number" min="0" max="100" step="0.01" id="bom-overhead-percent" value="${escapeHtml(formatDecimal(state.bomOverheadPercent, 2, false))}" />
            </div>
            <div class="cost-row cost-final">
              ${labeledFixedFormula("Sale Cost", FIXED_COST_FORMULAS.saleCost.formula, FIXED_COST_FORMULAS.saleCost.description)}
              <strong>${hasCalcErrors ? "Error calculating cost" : formatCurrency(state.saleCost)}</strong>
            </div>
            ${hasCalcErrors ? "" : `
            <div class="cost-bars">
              <div class="cost-bar">
                <div class="cost-bar-mat" style="width:${escapeHtml(materialPct)}%;"></div>
                <div class="cost-bar-svc" style="width:${escapeHtml(servicePct)}%;"></div>
                <div class="cost-bar-finishing" style="width:${escapeHtml(finishingPct)}%;"></div>
                ${showColorCost ? `<div class="cost-bar-color" style="width:${escapeHtml(colorPct)}%;"></div>` : ""}
              </div>
              <div class="cost-legend cost-legend-wide">
                <span>Material ${formatNumber(materialPct, 1)}%</span>
                <span>Service ${formatNumber(servicePct, 1)}%</span>
                <span>Finishing ${formatNumber(finishingPct, 1)}%</span>
                ${showColorCost ? `<span>Color ${formatNumber(colorPct, 1)}%</span>` : ""}
              </div>
            </div>
            `}
            <p class="stat-hint">Final Cost is Material Total + Service Total + Finishing Total (each per-piece × 1,000). Cost / 1 Piece is Material + Service + Finishing per piece. Consumable materials are Additional Cost and are not included. Sale Cost still uses per-piece cost. Rates come from master data after unit conversion.</p>
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
        purpose: formula ? formula.purpose : null,
        description: formula ? formula.description : "",
        expression: formula ? formula.expression : "",
        serviceLength: Boolean(formula && formula.serviceLength),
        serviceWidth: Boolean(formula && formula.serviceWidth),
        coveredArea: Boolean(formula && formula.coveredArea),
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
              ${draft.type === "Style" ? "" : `
              <div>
                <label class="form-label" for="fb-purpose">Purpose</label>
                <select id="fb-purpose" class="full-select ${errors.purpose ? "input-invalid" : ""}">
                  <option value="">Select purpose...</option>
                  <option value="Quantity" ${draft.purpose === "Quantity" ? "selected" : ""}>Quantity</option>
                  <option value="Rate" ${draft.purpose === "Rate" ? "selected" : ""}>Rate</option>
                </select>
                ${errors.purpose ? `<div class="field-error">${escapeHtml(errors.purpose)}</div>` : ""}
              </div>
              `}
              <div class="fb-desc-row">
                <div>
                  <label class="form-label" for="fb-description">Description</label>
                  <input id="fb-description" class="full-search" value="${escapeHtml(draft.description)}" />
                </div>
                <div class="fb-service-flags">
                  <label class="fb-flag">
                    <input id="fb-service-length" type="checkbox" ${draft.serviceLength ? "checked" : ""} />
                    <span>This formula uses Area Length</span>
                  </label>
                  <label class="fb-flag">
                    <input id="fb-service-width" type="checkbox" ${draft.serviceWidth ? "checked" : ""} />
                    <span>This formula uses Area Width</span>
                  </label>
                  <label class="fb-flag">
                    <input id="fb-covered-area" type="checkbox" ${draft.coveredArea ? "checked" : ""} />
                    <span>This formula uses Covered Area</span>
                  </label>
                </div>
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
                ${getActiveFormulaVariables().map((item) => {
                  const sheetArea = isFixedSheetAreaCode(item.code);
                  return `<button type="button" class="chip" data-insert="${escapeHtml(item.code)}" title="${escapeHtml(sheetArea ? FIXED_SHEET_AREA.description : item.name)}">${escapeHtml(item.code)}${sheetArea ? ` <span class="formula-src">Fixed</span>` : ""}</button>`;
                }).join("")}
              </div>
              <div class="section-kicker" style="margin-top:12px;">Fixed</div>
              <p class="stat-hint" style="margin:6px 0 8px;">System implementation values. Click to insert. Not editable.</p>
              <div class="chip-wrap">
                ${fixedVariables.map((item) => renderFixedVariableChip(item)).join("")}
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
      if (draft.type === "Material" || draft.type === "Service") {
        if (!draft.purpose) errors.purpose = "Purpose is required.";
        else if (!FORMULA_PURPOSES.includes(draft.purpose)) errors.purpose = "Purpose must be Rate or Quantity.";
      }
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
        purpose: draft.type === "Style" ? null : draft.purpose,
        description: String(draft.description || "").trim(),
        expression: String(draft.expression).trim(),
        serviceLength: Boolean(draft.serviceLength),
        serviceWidth: Boolean(draft.serviceWidth),
        coveredArea: Boolean(draft.coveredArea),
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
      if (state.cleaningUserData) return;
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
        dialog.classList.remove("formula-explainer");
        dialog.classList.remove("split-form");
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
      const isFinishing = state.modal.type === "finishing-service";
      const kicker = isFinishing ? "Finishing service" : "Product master";
      const title = isFinishing
        ? (state.modal.mode === "edit" ? "Edit Finishing Service" : "Add Finishing Service")
        : (state.modal.mode === "edit" ? "Edit Finished Good" : "Add New Finished Good");
      const saveLabel = isFinishing
        ? (state.modal.mode === "edit" ? "Update Finishing Service" : "Add Finishing Service")
        : (state.modal.mode === "edit" ? "Update Product" : "Add Product");
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">${kicker}</div>
            <strong>${title}</strong>
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
                ${finishedGoodUomOptions(draft.uom)}
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
          <button type="button" class="btn btn-primary" id="btn-save-finished-good">${saveLabel}</button>
        </div>
      `;
    }

    function finishedGoodToDraft(item) {
      const dims = getItemDimensions(item);
      return {
        id: item?.id,
        product: item?.product ?? "",
        style: item?.style ?? "",
        variant: item?.variant ?? "",
        ply: item?.ply,
        L: formatDecimal(dims.L, 2, false),
        W: formatDecimal(dims.W, 2, false),
        H: formatDecimal(dims.H, 2, false),
        dimensionUOM: item?.dimensionUOM,
        uom: item?.uom,
        status: item?.status
      };
    }

    function openFinishingServiceModal(id) {
      const item = id ? finishingServices.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "finishing-service",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        draft: item ? finishedGoodToDraft(item) : defaultFinishedGoodDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveFinishingServiceFromModal() {
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
        const index = finishingServices.findIndex((row) => row.id === draft.id);
        if (index >= 0) finishingServices[index] = { ...finishingServices[index], ...payload };
        showNotification("Finishing service updated successfully");
      } else {
        const item = { id: nextMasterId(finishingServices), ...payload };
        finishingServices.push(item);
        state.selectedFinishingServiceId = item.id;
        if (state.currentBOM) state.currentBOM.finishingServiceId = item.id;
        showNotification("Finishing service added successfully");
      }
      closeModal();
      recalculateBOMCosts();
      renderFinishingServicesSection();
      renderCostSummary();
      refreshIcons();
      afterDataChange("finishingServices");
      persistEditorState();
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
      if (!state.modal.draft || (state.modal.type !== "finished-good" && state.modal.type !== "finishing-service")) return false;
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
      const editing = state.modal.mode === "edit";
      const tab = state.modal.materialTab || "info";
      const showGsm = draft.category === "Paper" || draft.category === "Board";
      const infoForm = `
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
                ${MATERIAL_CATEGORIES.map((cat) => `<option value="${cat}" ${draft.category === cat ? "selected" : ""}>${cat}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="rm-uom">UOM</label>
              <select id="rm-uom" class="full-select">
                ${MATERIAL_UOMS.map((uom) => `<option value="${uom}" ${draft.uom === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="rm-qty-formula">Default Quantity Formula</label>
              <select id="rm-qty-formula" class="full-select">
                ${renderBoundFormulaOptions("Material", draft.qtyFormulaId, "Quantity")}
              </select>
              <p class="stat-hint" style="margin-top:6px;">Used to calculate quantity on BOM &amp; Costing and Cost Calculator.</p>
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
            <div class="form-span-2">
              <p class="stat-hint">Rates managed in Raw Material Rates page</p>
            </div>
          </div>
      `;
      const linked = editing && draft.id ? getMaterialDimensionLinks(draft.id) : [];
      const dimRows = linked.length
        ? linked.map((row) => {
            const dim = getDimension(row.dimensionId);
            return `
              <tr>
                <td>${escapeHtml(formatDimensionChipLabel(dim))}</td>
                ${masterRowActions("data-edit-material-dim", row.id, "data-delete-material-dim", row.id)}
              </tr>
            `;
          }).join("")
        : emptyRow(2, "No dimensions linked to this material yet.");
      const dimsForm = `
        <div class="section-head">
          <div>
            <div class="section-kicker">Material dimensions</div>
            <p class="stat-hint" style="margin:4px 0 0;">Link a dimension to this material. Quantity uses the Default Quantity Formula on Material Info.</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-material-dimension">
            <i data-lucide="plus"></i> Add Dimension to Material
          </button>
        </div>
        <div class="table-wrap">
          <table class="data-table" style="min-width:560px;">
            <thead>
              <tr>
                <th>Dimension Name</th>
                <!-- Formula (Qty Calculate) column hidden intentionally as of qtyFormulaId-only change; materialDimensions.formulaId is still stored. -->
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${dimRows}</tbody>
          </table>
        </div>
      `;
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Material master</div>
            <strong>${editing ? "Edit Raw Material" : "Add New Raw Material"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          ${editing ? `
            <div class="section-tabs">
              <button type="button" class="section-tab ${tab === "info" ? "active" : ""}" data-material-tab="info">Material Info</button>
              <button type="button" class="section-tab ${tab === "dimensions" ? "active" : ""}" data-material-tab="dimensions">Dimensions</button>
            </div>
            ${tab === "dimensions" ? dimsForm : infoForm}
          ` : infoForm}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          ${!editing || tab === "info" ? `<button type="button" class="btn btn-primary" id="btn-save-raw-material">${editing ? "Update Material Info" : "Add Material"}</button>` : ""}
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
        materialTab: "info",
        draft: item ? rawMaterialToDraft(item) : defaultRawMaterialDraft(),
        errors: {},
        sub: null
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
      const parsedGsm = showGsm && draft.gsm !== "" && draft.gsm != null ? parseByRule(draft.gsm, "gsm") : null;
      const payload = {
        code: String(draft.code).trim().toUpperCase(),
        name: String(draft.name).trim(),
        category: draft.category,
        uom: draft.uom,
        gsm: parsedGsm && parsedGsm.ok ? parsedGsm.value : null,
        qtyFormulaId: normalizeFormulaBinding(draft.qtyFormulaId),
        status: draft.status
      };
      if (state.modal.mode === "edit" && draft.id) {
        const index = rawMaterials.findIndex((row) => row.id === draft.id);
        if (index >= 0) {
          rawMaterials[index] = { ...rawMaterials[index], ...payload };
          delete rawMaterials[index].rateFormulaId;
          delete rawMaterials[index].purchasingRate;
          delete rawMaterials[index].rateUOM;
        }
        syncMaterialDimensionIds(draft.id);
        showNotification("Material updated successfully");
        state.modal.errors = {};
        renderModal();
        renderRawMaterials();
        refreshIcons();
        afterDataChange("rawMaterials");
        return;
      }
      rawMaterials.push({ id: nextMasterId(rawMaterials), ...payload, dimensionIds: [] });
      showNotification("Material added successfully");
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
      else if (target.id === "rm-gsm") draft.gsm = target.value;
      else if (target.id === "rm-qty-formula") draft.qtyFormulaId = normalizeFormulaBinding(target.value);
      else if (target.id === "rm-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultMaterialRateDraft(material, rateRow) {
      const inferredUom = normalizeMaterialRateUom(material && material.uom) || "Rs./kg";
      return {
        rawMaterialId: material ? material.id : null,
        rate: rateRow && rateRow.rate != null ? rateRow.rate : "",
        rateUOM: (rateRow && rateRow.rateUOM) || inferredUom,
        formulaId: rateRow && rateRow.formulaId ? Number(rateRow.formulaId) : "",
        status: (rateRow && rateRow.status) || "Active"
      };
    }

    function materialRateUomOptions(selected) {
      const values = MATERIAL_RATE_UOMS.slice();
      if (selected && !values.includes(selected)) values.push(selected);
      return `<option value="">Select rate UOM</option>` + values.map((value) => `
        <option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>
      `).join("");
    }

    function renderMaterialRateFormModal() {
      const draft = state.modal.draft || {};
      const errors = state.modal.errors || {};
      const material = getRawMaterial(draft.rawMaterialId);
      const dimSummary = material ? formatMaterialDimensionSummary(material) : "—";
      const formulaOptions = renderBoundFormulaOptions("Material", draft.formulaId, "Rate");
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Pricing</div>
            <strong>Update Material Rate</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="card" style="margin-bottom:16px;">
            <div class="card-body">
              <div class="section-kicker">Material (Read-only)</div>
              <div><strong>Material:</strong> ${escapeHtml(material ? material.name : "Material not found")}</div>
              <div><strong>Code:</strong> ${escapeHtml(material ? material.code : "—")}</div>
              <div><strong>UOM:</strong> ${escapeHtml(material ? material.uom : "—")}</div>
            </div>
          </div>
          <div class="form-grid">
            <div>
              <label class="form-label" for="mrate-rate">Rate (PKR)</label>
              <input id="mrate-rate" class="full-search ${errors.rate ? "input-invalid" : ""}" type="number" min="0.01" max="99999.99" step="0.01" value="${escapeHtml(draft.rate === "" || draft.rate == null ? "" : formatDecimal(draft.rate, 2, true))}" placeholder="165.00" />
              ${errors.rate ? `<div class="field-error">${escapeHtml(errors.rate)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="mrate-uom">Rate UOM</label>
              <select id="mrate-uom" class="full-select ${errors.rateUOM ? "input-invalid" : ""}">
                ${materialRateUomOptions(draft.rateUOM)}
              </select>
              ${errors.rateUOM ? `<div class="field-error">${escapeHtml(errors.rateUOM)}</div>` : ""}
            </div>
            <div class="form-span-2">
              <label class="form-label" for="mrate-formula">Formula</label>
              <select id="mrate-formula" class="full-select">
                ${formulaOptions}
              </select>
              <p class="stat-hint">Rate formula for this purchasing rate. Quantity formula stays on the Raw Material profile.</p>
            </div>
            <div class="form-span-2">
              <label class="form-label">Dimensions (optional)</label>
              <div class="full-search" style="min-height:38px;display:flex;align-items:center;">${escapeHtml(dimSummary || "—")}</div>
              <p class="stat-hint">Dimension links are managed on the Raw Material master</p>
            </div>
            <div class="form-span-2">
              <div class="section-kicker">Status</div>
              <label class="radio-row"><input type="radio" name="mrate-status" value="Active" ${draft.status === "Active" ? "checked" : ""} /> Active</label>
              <label class="radio-row"><input type="radio" name="mrate-status" value="Inactive" ${draft.status === "Inactive" ? "checked" : ""} /> Inactive</label>
              ${errors.status ? `<div class="field-error">${escapeHtml(errors.status)}</div>` : ""}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-material-rate">Update Material Rate</button>
        </div>
      `;
    }

    function openMaterialRateModal(rawMaterialId) {
      const material = getRawMaterial(rawMaterialId);
      if (!material) {
        showNotification("Material not found", "error");
        return;
      }
      const rateRow = getMaterialRateRecord(material.id);
      state.modal = {
        type: "material-rate",
        selectedId: material.id,
        mode: "edit",
        lineId: null,
        draft: defaultMaterialRateDraft(material, rateRow),
        errors: {}
      };
      renderModal();
    }

    function validateMaterialRateDraft(draft) {
      const errors = {};
      const material = getRawMaterial(draft.rawMaterialId);
      if (!material) {
        errors.rawMaterialId = "Material not found";
        return errors;
      }
      if (material.status === "Inactive") {
        errors.status = "Cannot update rate if material inactive";
      }
      const rate = Number(draft.rate);
      if (!Number.isFinite(rate) || rate <= 0) errors.rate = "Rate must be positive number";
      else if (rate > 99999.99) errors.rate = "Rate must be 99999.99 or less.";
      if (!draft.rateUOM) errors.rateUOM = "Rate UOM must be selected";
      return errors;
    }

    function saveMaterialRateFromModal() {
      const draft = state.modal.draft;
      const errors = validateMaterialRateDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const material = getRawMaterial(draft.rawMaterialId);
      const now = new Date().toISOString();
      const existing = getMaterialRateRecord(draft.rawMaterialId);
      const payload = {
        rawMaterialId: Number(draft.rawMaterialId),
        rate: roundTo(Number(draft.rate), 2),
        rateUOM: normalizeMaterialRateUom(draft.rateUOM) || draft.rateUOM,
        formulaId: draft.formulaId ? Number(draft.formulaId) : null,
        status: draft.status || "Active",
        updatedAt: now
      };
      if (existing) {
        const index = materialRates.findIndex((row) => row.id === existing.id);
        materialRates[index] = { ...existing, ...payload };
      } else {
        materialRates.push({
          id: nextMasterId(materialRates),
          ...payload,
          createdAt: now
        });
      }
      const unit = formatRateUnit(payload.rateUOM) || "unit";
      showNotification("Material rate updated: " + material.name + " - Rs. " + formatDecimal(payload.rate, 2, true) + "/" + unit);
      closeModal();
      renderRawMaterialRates();
      refreshIcons();
      afterDataChange("materialRates");
      refreshOpenBomCalculations();
      if (state.currentPage === "cost-calculator") renderCostCalculator();
    }

    function updateMaterialRateDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "material-rate") return false;
      const draft = state.modal.draft;
      if (target.id === "mrate-rate") draft.rate = target.value;
      else if (target.id === "mrate-uom") draft.rateUOM = target.value;
      else if (target.id === "mrate-formula") draft.formulaId = target.value ? Number(target.value) : "";
      else if (target.name === "mrate-status") draft.status = target.value;
      else return false;
      return true;
    }

    function renderMaterialDimensionLinkModal() {
      const sub = state.modal.sub;
      const draft = sub.draft;
      const errors = sub.errors || {};
      const available = dimensions.filter((item) => item.status !== "Inactive");
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Material dimension</div>
            <strong>${sub.mode === "edit" ? "Edit Dimension Link" : "Add Dimension to Material"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-back-material-edit">Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="rm-dim-select">Dimension</label>
              <select id="rm-dim-select" class="full-select ${errors.dimensionId ? "input-invalid" : ""}" ${available.length ? "" : "disabled"}>
                <option value="">${available.length ? "Select a dimension..." : "No dimensions available"}</option>
                ${available.map((item) => `
                  <option value="${item.id}" ${Number(draft.dimensionId) === item.id ? "selected" : ""}>${escapeHtml(formatDimensionChipLabel(item))}</option>
                `).join("")}
              </select>
              ${errors.dimensionId ? `<div class="field-error">${escapeHtml(errors.dimensionId)}</div>` : ""}
            </div>
            ${"" /* Formula (Qty Calculate) selector hidden intentionally — qty uses material.qtyFormulaId. Keep draft.formulaId + save path so materialDimensions.formulaId can be restored later. */}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" id="btn-back-material-edit">Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-material-dimension">${sub.mode === "edit" ? "Update Link" : "Add Dimension"}</button>
        </div>
      `;
    }

    function openMaterialDimensionLinkModal(linkId) {
      if (state.modal.type !== "raw-material-master" || state.modal.mode !== "edit" || !state.modal.draft || !state.modal.draft.id) return;
      const existing = linkId ? materialDimensions.find((row) => row.id === Number(linkId)) : null;
      const material = getRawMaterial(state.modal.draft.id);
      state.modal.sub = {
        type: "material-dimension",
        mode: existing ? "edit" : "add",
        draft: existing
          ? { id: existing.id, dimensionId: existing.dimensionId, ply: existing.ply, formulaId: existing.formulaId }
          : { dimensionId: "", formulaId: material && material.qtyFormulaId ? Number(material.qtyFormulaId) : "" },
        errors: {}
      };
      renderModal();
    }

    function backToMaterialEdit() {
      state.modal.sub = null;
      state.modal.materialTab = "dimensions";
      renderModal();
      refreshIcons();
    }

    function saveMaterialDimensionLinkFromModal() {
      const sub = state.modal.sub;
      if (!sub || !sub.draft || !state.modal.draft || !state.modal.draft.id) return;
      const draft = sub.draft;
      const errors = {};
      const rawMaterialId = Number(state.modal.draft.id);
      const dimensionId = draft.dimensionId ? Number(draft.dimensionId) : null;
      const formulaId = draft.formulaId ? Number(draft.formulaId) : normalizeFormulaBinding(getRawMaterial(rawMaterialId) && getRawMaterial(rawMaterialId).qtyFormulaId);
      if (!dimensionId || !getDimension(dimensionId)) errors.dimensionId = "Dimension is required.";
      if (dimensionId && materialDimensions.some((row) =>
        row.rawMaterialId === rawMaterialId && Number(row.dimensionId) === dimensionId && row.id !== draft.id
      )) {
        errors.dimensionId = "This dimension is already linked.";
      }
      sub.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }
      if (sub.mode === "edit" && draft.id) {
        const index = materialDimensions.findIndex((row) => row.id === Number(draft.id));
        if (index >= 0) {
          materialDimensions[index] = {
            id: materialDimensions[index].id,
            rawMaterialId: materialDimensions[index].rawMaterialId,
            dimensionId,
            ply: materialDimensions[index].ply,
            formulaId,
            createdAt: materialDimensions[index].createdAt
          };
        }
        showNotification("Dimension link updated");
      } else {
        materialDimensions.push({
          id: nextMasterId(materialDimensions),
          rawMaterialId,
          dimensionId,
          ply: 1,
          formulaId,
          createdAt: new Date().toISOString()
        });
        showNotification("Dimension linked to material");
      }
      syncMaterialDimensionIds(rawMaterialId);
      state.modal.sub = null;
      state.modal.materialTab = "dimensions";
      renderModal();
      renderRawMaterials();
      refreshIcons();
      afterDataChange("materialDimensions", "rawMaterials");
      refreshOpenBomCalculations();
    }

    function removeMaterialDimensionLink(linkId) {
      const index = materialDimensions.findIndex((row) => row.id === Number(linkId));
      if (index < 0) return;
      const rawMaterialId = materialDimensions[index].rawMaterialId;
      materialDimensions.splice(index, 1);
      syncMaterialDimensionIds(rawMaterialId);
      showNotification("Dimension removed from material");
      if (state.modal.type === "raw-material-master") {
        state.modal.sub = null;
        state.modal.materialTab = "dimensions";
        renderModal();
      }
      renderRawMaterials();
      refreshIcons();
      afterDataChange("materialDimensions", "rawMaterials");
      refreshOpenBomCalculations();
    }

    function updateMaterialDimensionLinkDraftFromEvent(target) {
      if (!state.modal.sub || state.modal.sub.type !== "material-dimension" || !state.modal.sub.draft) return false;
      const draft = state.modal.sub.draft;
      if (target.id === "rm-dim-select") {
        draft.dimensionId = target.value ? Number(target.value) : "";
        return "rerender";
      }
      if (target.id === "rm-dim-formula") {
        draft.formulaId = target.value ? Number(target.value) : "";
        return "rerender";
      }
      return false;
    }

    function defaultOtherRawMaterialDraft() {
      return {
        code: "",
        name: "",
        category: "Paper",
        uom: "kg",
        gsm: "",
        qtyFormulaId: null,
        dimensionIds: [],
        status: "Active"
      };
    }

    function validateOtherRawMaterialDraft(draft) {
      const errors = {};
      const code = String(draft.code || "").trim().toUpperCase();
      if (!code) errors.code = "Code is required.";
      else if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(code)) errors.code = "Code must be alphanumeric.";
      else if (otherRawMaterials.some((item) => item.code.toUpperCase() === code && item.id !== draft.id)) errors.code = "Code must be unique.";
      if (!String(draft.name || "").trim()) errors.name = "Name is required.";
      if (!draft.category) errors.category = "Category is required.";
      if (!draft.uom) errors.uom = "UOM is required.";
      if ((draft.category === "Paper" || draft.category === "Board") && draft.gsm !== "" && draft.gsm != null) {
        const gsm = parseByRule(draft.gsm, "gsm", { requiredError: "GSM must be greater than 0." });
        if (!gsm.ok) errors.gsm = gsm.error;
      }
      if (!draft.status) errors.status = "Status is required.";
      return errors;
    }

    function renderOtherRawMaterialFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const editing = state.modal.mode === "edit";
      const tab = state.modal.otherMaterialTab || "info";
      const showGsm = draft.category === "Paper" || draft.category === "Board";
      const infoForm = `
          <div class="form-grid">
            <div>
              <label class="form-label" for="orm-code">Code</label>
              <input id="orm-code" class="full-search ${errors.code ? "input-invalid" : ""}" value="${escapeHtml(draft.code)}" placeholder="KRAFT-PH" />
              ${errors.code ? `<div class="field-error">${escapeHtml(errors.code)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="orm-name">Name</label>
              <input id="orm-name" class="full-search ${errors.name ? "input-invalid" : ""}" value="${escapeHtml(draft.name)}" placeholder="Kraft Paper High" />
              ${errors.name ? `<div class="field-error">${escapeHtml(errors.name)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="orm-category">Category</label>
              <select id="orm-category" class="full-select">
                ${MATERIAL_CATEGORIES.map((cat) => `<option value="${cat}" ${draft.category === cat ? "selected" : ""}>${cat}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="orm-uom">UOM</label>
              <select id="orm-uom" class="full-select">
                ${MATERIAL_UOMS.map((uom) => `<option value="${uom}" ${draft.uom === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="orm-qty-formula">Default Quantity Formula</label>
              <select id="orm-qty-formula" class="full-select">
                ${renderBoundFormulaOptions("Material", draft.qtyFormulaId, "Quantity")}
              </select>
              <p class="stat-hint" style="margin-top:6px;">Used to calculate quantity on BOM &amp; Costing and Cost Calculator.</p>
            </div>
            ${showGsm ? `
              <div>
                <label class="form-label" for="orm-gsm">GSM (Basis Weight)</label>
                <input id="orm-gsm" class="full-search ${errors.gsm ? "input-invalid" : ""}" type="number" min="1" max="999" step="0.1" value="${escapeHtml(draft.gsm === "" || draft.gsm == null ? "" : formatDecimal(draft.gsm, 1, false))}" placeholder="Optional" />
                ${errors.gsm ? `<div class="field-error">${escapeHtml(errors.gsm)}</div>` : ""}
              </div>
            ` : ""}
            <div>
              <label class="form-label" for="orm-status">Status</label>
              <select id="orm-status" class="full-select">
                <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
            <div class="form-span-2">
              <p class="stat-hint">Rates managed in Other Raw Material Rates page</p>
            </div>
          </div>
      `;
      const linked = editing && draft.id ? getOtherMaterialDimensionLinks(draft.id) : [];
      const dimRows = linked.length
        ? linked.map((row) => {
            const dim = getDimension(row.dimensionId);
            return `
              <tr>
                <td>${escapeHtml(formatDimensionChipLabel(dim))}</td>
                ${masterRowActions("data-edit-other-material-dim", row.id, "data-delete-other-material-dim", row.id)}
              </tr>
            `;
          }).join("")
        : emptyRow(2, "No dimensions linked to this material yet.");
      const dimsForm = `
        <div class="section-head">
          <div>
            <div class="section-kicker">Material dimensions</div>
            <p class="stat-hint" style="margin:4px 0 0;">Link a dimension to this material. Quantity uses the Default Quantity Formula on Material Info.</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-other-material-dimension">
            <i data-lucide="plus"></i> Add Dimension to Material
          </button>
        </div>
        <div class="table-wrap">
          <table class="data-table" style="min-width:560px;">
            <thead>
              <tr>
                <th>Dimension Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${dimRows}</tbody>
          </table>
        </div>
      `;
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Material master</div>
            <strong>${editing ? "Edit Other Raw Material" : "Add New Other Raw Material"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          ${editing ? `
            <div class="section-tabs">
              <button type="button" class="section-tab ${tab === "info" ? "active" : ""}" data-other-material-tab="info">Material Info</button>
              <button type="button" class="section-tab ${tab === "dimensions" ? "active" : ""}" data-other-material-tab="dimensions">Dimensions</button>
            </div>
            ${tab === "dimensions" ? dimsForm : infoForm}
          ` : infoForm}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          ${!editing || tab === "info" ? `<button type="button" class="btn btn-primary" id="btn-save-other-raw-material">${editing ? "Update Material Info" : "Add Material"}</button>` : ""}
        </div>
      `;
    }

    function otherRawMaterialToDraft(item) {
      return {
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category,
        uom: item.uom,
        gsm: item.gsm == null ? "" : formatDecimal(item.gsm, 1, false),
        qtyFormulaId: normalizeFormulaBinding(item.qtyFormulaId),
        dimensionIds: normalizeDimensionIds(item.dimensionIds),
        status: item.status
      };
    }

    function openOtherRawMaterialMasterModal(id) {
      const item = id ? otherRawMaterials.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "other-raw-material-master",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        otherMaterialTab: "info",
        draft: item ? otherRawMaterialToDraft(item) : defaultOtherRawMaterialDraft(),
        errors: {},
        sub: null
      };
      renderModal();
    }

    function saveOtherRawMaterialFromModal() {
      const draft = state.modal.draft;
      const errors = validateOtherRawMaterialDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const showGsm = draft.category === "Paper" || draft.category === "Board";
      const parsedGsm = showGsm && draft.gsm !== "" && draft.gsm != null ? parseByRule(draft.gsm, "gsm") : null;
      const payload = {
        code: String(draft.code).trim().toUpperCase(),
        name: String(draft.name).trim(),
        category: draft.category,
        uom: draft.uom,
        gsm: parsedGsm && parsedGsm.ok ? parsedGsm.value : null,
        qtyFormulaId: normalizeFormulaBinding(draft.qtyFormulaId),
        status: draft.status
      };
      if (state.modal.mode === "edit" && draft.id) {
        const index = otherRawMaterials.findIndex((row) => row.id === draft.id);
        if (index >= 0) {
          otherRawMaterials[index] = { ...otherRawMaterials[index], ...payload };
          delete otherRawMaterials[index].rateFormulaId;
          delete otherRawMaterials[index].purchasingRate;
          delete otherRawMaterials[index].rateUOM;
        }
        syncOtherMaterialDimensionIds(draft.id);
        showNotification("Material updated successfully");
        state.modal.errors = {};
        renderModal();
        renderOtherRawMaterials();
        refreshIcons();
        afterDataChange("otherRawMaterials");
        return;
      }
      otherRawMaterials.push({ id: nextMasterId(otherRawMaterials), ...payload, dimensionIds: [] });
      showNotification("Material added successfully");
      closeModal();
      renderOtherRawMaterials();
      refreshIcons();
      afterDataChange("otherRawMaterials");
    }

    function updateOtherRawMaterialDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "other-raw-material-master") return false;
      const draft = state.modal.draft;
      if (target.id === "orm-code") draft.code = target.value.toUpperCase();
      else if (target.id === "orm-name") draft.name = target.value;
      else if (target.id === "orm-category") draft.category = target.value;
      else if (target.id === "orm-uom") draft.uom = target.value;
      else if (target.id === "orm-gsm") draft.gsm = target.value;
      else if (target.id === "orm-qty-formula") draft.qtyFormulaId = normalizeFormulaBinding(target.value);
      else if (target.id === "orm-status") draft.status = target.value;
      else return false;
      return true;
    }

    function defaultOtherMaterialRateDraft(material, rateRow) {
      const inferredUom = normalizeMaterialRateUom(material && material.uom) || "Rs./kg";
      return {
        otherRawMaterialId: material ? material.id : null,
        rate: rateRow && rateRow.rate != null ? rateRow.rate : "",
        rateUOM: (rateRow && rateRow.rateUOM) || inferredUom,
        formulaId: rateRow && rateRow.formulaId ? Number(rateRow.formulaId) : "",
        status: (rateRow && rateRow.status) || "Active"
      };
    }

    function renderOtherMaterialRateFormModal() {
      const draft = state.modal.draft || {};
      const errors = state.modal.errors || {};
      const material = getOtherRawMaterial(draft.otherRawMaterialId);
      const dimSummary = material ? formatOtherMaterialDimensionSummary(material) : "—";
      const formulaOptions = renderBoundFormulaOptions("Material", draft.formulaId, "Rate");
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Pricing</div>
            <strong>Update Material Rate</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="card" style="margin-bottom:16px;">
            <div class="card-body">
              <div class="section-kicker">Material (Read-only)</div>
              <div><strong>Material:</strong> ${escapeHtml(material ? material.name : "Material not found")}</div>
              <div><strong>Code:</strong> ${escapeHtml(material ? material.code : "—")}</div>
              <div><strong>UOM:</strong> ${escapeHtml(material ? material.uom : "—")}</div>
            </div>
          </div>
          <div class="form-grid">
            <div>
              <label class="form-label" for="omrate-rate">Rate (PKR)</label>
              <input id="omrate-rate" class="full-search ${errors.rate ? "input-invalid" : ""}" type="number" min="0.01" max="99999.99" step="0.01" value="${escapeHtml(draft.rate === "" || draft.rate == null ? "" : formatDecimal(draft.rate, 2, true))}" placeholder="165.00" />
              ${errors.rate ? `<div class="field-error">${escapeHtml(errors.rate)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="omrate-uom">Rate UOM</label>
              <select id="omrate-uom" class="full-select ${errors.rateUOM ? "input-invalid" : ""}">
                ${materialRateUomOptions(draft.rateUOM)}
              </select>
              ${errors.rateUOM ? `<div class="field-error">${escapeHtml(errors.rateUOM)}</div>` : ""}
            </div>
            <div class="form-span-2">
              <label class="form-label" for="omrate-formula">Formula</label>
              <select id="omrate-formula" class="full-select">
                ${formulaOptions}
              </select>
              <p class="stat-hint">Rate formula for this purchasing rate. Quantity formula stays on the Other Raw Material profile.</p>
            </div>
            <div class="form-span-2">
              <label class="form-label">Dimensions (optional)</label>
              <div class="full-search" style="min-height:38px;display:flex;align-items:center;">${escapeHtml(dimSummary || "—")}</div>
              <p class="stat-hint">Dimension links are managed on the Other Raw Material master</p>
            </div>
            <div class="form-span-2">
              <div class="section-kicker">Status</div>
              <label class="radio-row"><input type="radio" name="omrate-status" value="Active" ${draft.status === "Active" ? "checked" : ""} /> Active</label>
              <label class="radio-row"><input type="radio" name="omrate-status" value="Inactive" ${draft.status === "Inactive" ? "checked" : ""} /> Inactive</label>
              ${errors.status ? `<div class="field-error">${escapeHtml(errors.status)}</div>` : ""}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-other-material-rate">Update Material Rate</button>
        </div>
      `;
    }

    function openOtherMaterialRateModal(otherRawMaterialId) {
      const material = getOtherRawMaterial(otherRawMaterialId);
      if (!material) {
        showNotification("Material not found", "error");
        return;
      }
      const rateRow = getOtherMaterialRateRecord(material.id);
      state.modal = {
        type: "other-material-rate",
        selectedId: material.id,
        mode: "edit",
        lineId: null,
        draft: defaultOtherMaterialRateDraft(material, rateRow),
        errors: {}
      };
      renderModal();
    }

    function validateOtherMaterialRateDraft(draft) {
      const errors = {};
      const material = getOtherRawMaterial(draft.otherRawMaterialId);
      if (!material) {
        errors.otherRawMaterialId = "Material not found";
        return errors;
      }
      if (material.status === "Inactive") {
        errors.status = "Cannot update rate if material inactive";
      }
      const rate = Number(draft.rate);
      if (!Number.isFinite(rate) || rate <= 0) errors.rate = "Rate must be positive number";
      else if (rate > 99999.99) errors.rate = "Rate must be 99999.99 or less.";
      if (!draft.rateUOM) errors.rateUOM = "Rate UOM must be selected";
      return errors;
    }

    function saveOtherMaterialRateFromModal() {
      const draft = state.modal.draft;
      const errors = validateOtherMaterialRateDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const material = getOtherRawMaterial(draft.otherRawMaterialId);
      const now = new Date().toISOString();
      const existing = getOtherMaterialRateRecord(draft.otherRawMaterialId);
      const payload = {
        otherRawMaterialId: Number(draft.otherRawMaterialId),
        rate: roundTo(Number(draft.rate), 2),
        rateUOM: normalizeMaterialRateUom(draft.rateUOM) || draft.rateUOM,
        formulaId: draft.formulaId ? Number(draft.formulaId) : null,
        status: draft.status || "Active",
        updatedAt: now
      };
      if (existing) {
        const index = otherMaterialRates.findIndex((row) => row.id === existing.id);
        otherMaterialRates[index] = { ...existing, ...payload };
      } else {
        otherMaterialRates.push({
          id: nextMasterId(otherMaterialRates),
          ...payload,
          createdAt: now
        });
      }
      const unit = formatRateUnit(payload.rateUOM) || "unit";
      showNotification("Material rate updated: " + material.name + " - Rs. " + formatDecimal(payload.rate, 2, true) + "/" + unit);
      closeModal();
      renderOtherRawMaterialRates();
      refreshIcons();
      afterDataChange("otherMaterialRates");
    }

    function updateOtherMaterialRateDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "other-material-rate") return false;
      const draft = state.modal.draft;
      if (target.id === "omrate-rate") draft.rate = target.value;
      else if (target.id === "omrate-uom") draft.rateUOM = target.value;
      else if (target.id === "omrate-formula") draft.formulaId = target.value ? Number(target.value) : "";
      else if (target.name === "omrate-status") draft.status = target.value;
      else return false;
      return true;
    }

    function renderOtherMaterialDimensionLinkModal() {
      const sub = state.modal.sub;
      const draft = sub.draft;
      const errors = sub.errors || {};
      const available = dimensions.filter((item) => item.status !== "Inactive");
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Material dimension</div>
            <strong>${sub.mode === "edit" ? "Edit Dimension Link" : "Add Dimension to Material"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-back-other-material-edit">Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="orm-dim-select">Dimension</label>
              <select id="orm-dim-select" class="full-select ${errors.dimensionId ? "input-invalid" : ""}" ${available.length ? "" : "disabled"}>
                <option value="">${available.length ? "Select a dimension..." : "No dimensions available"}</option>
                ${available.map((item) => `
                  <option value="${item.id}" ${Number(draft.dimensionId) === item.id ? "selected" : ""}>${escapeHtml(formatDimensionChipLabel(item))}</option>
                `).join("")}
              </select>
              ${errors.dimensionId ? `<div class="field-error">${escapeHtml(errors.dimensionId)}</div>` : ""}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" id="btn-back-other-material-edit">Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-other-material-dimension">${sub.mode === "edit" ? "Update Link" : "Add Dimension"}</button>
        </div>
      `;
    }

    function openOtherMaterialDimensionLinkModal(linkId) {
      if (state.modal.type !== "other-raw-material-master" || state.modal.mode !== "edit" || !state.modal.draft || !state.modal.draft.id) return;
      const existing = linkId ? otherMaterialDimensions.find((row) => row.id === Number(linkId)) : null;
      const material = getOtherRawMaterial(state.modal.draft.id);
      state.modal.sub = {
        type: "other-material-dimension",
        mode: existing ? "edit" : "add",
        draft: existing
          ? { id: existing.id, dimensionId: existing.dimensionId, ply: existing.ply, formulaId: existing.formulaId }
          : { dimensionId: "", formulaId: material && material.qtyFormulaId ? Number(material.qtyFormulaId) : "" },
        errors: {}
      };
      renderModal();
    }

    function backToOtherMaterialEdit() {
      state.modal.sub = null;
      state.modal.otherMaterialTab = "dimensions";
      renderModal();
      refreshIcons();
    }

    function saveOtherMaterialDimensionLinkFromModal() {
      const sub = state.modal.sub;
      if (!sub || !sub.draft || !state.modal.draft || !state.modal.draft.id) return;
      const draft = sub.draft;
      const errors = {};
      const otherRawMaterialId = Number(state.modal.draft.id);
      const dimensionId = draft.dimensionId ? Number(draft.dimensionId) : null;
      const formulaId = draft.formulaId ? Number(draft.formulaId) : normalizeFormulaBinding(getOtherRawMaterial(otherRawMaterialId) && getOtherRawMaterial(otherRawMaterialId).qtyFormulaId);
      if (!dimensionId || !getDimension(dimensionId)) errors.dimensionId = "Dimension is required.";
      if (dimensionId && otherMaterialDimensions.some((row) =>
        row.otherRawMaterialId === otherRawMaterialId && Number(row.dimensionId) === dimensionId && row.id !== draft.id
      )) {
        errors.dimensionId = "This dimension is already linked.";
      }
      sub.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }
      if (sub.mode === "edit" && draft.id) {
        const index = otherMaterialDimensions.findIndex((row) => row.id === Number(draft.id));
        if (index >= 0) {
          otherMaterialDimensions[index] = {
            id: otherMaterialDimensions[index].id,
            otherRawMaterialId: otherMaterialDimensions[index].otherRawMaterialId,
            dimensionId,
            ply: otherMaterialDimensions[index].ply,
            formulaId,
            createdAt: otherMaterialDimensions[index].createdAt
          };
        }
        showNotification("Dimension link updated");
      } else {
        otherMaterialDimensions.push({
          id: nextMasterId(otherMaterialDimensions),
          otherRawMaterialId,
          dimensionId,
          ply: 1,
          formulaId,
          createdAt: new Date().toISOString()
        });
        showNotification("Dimension linked to material");
      }
      syncOtherMaterialDimensionIds(otherRawMaterialId);
      state.modal.sub = null;
      state.modal.otherMaterialTab = "dimensions";
      renderModal();
      renderOtherRawMaterials();
      refreshIcons();
      afterDataChange("otherMaterialDimensions", "otherRawMaterials");
    }

    function removeOtherMaterialDimensionLink(linkId) {
      const index = otherMaterialDimensions.findIndex((row) => row.id === Number(linkId));
      if (index < 0) return;
      const otherRawMaterialId = otherMaterialDimensions[index].otherRawMaterialId;
      otherMaterialDimensions.splice(index, 1);
      syncOtherMaterialDimensionIds(otherRawMaterialId);
      showNotification("Dimension removed from material");
      if (state.modal.type === "other-raw-material-master") {
        state.modal.sub = null;
        state.modal.otherMaterialTab = "dimensions";
        renderModal();
      }
      renderOtherRawMaterials();
      refreshIcons();
      afterDataChange("otherMaterialDimensions", "otherRawMaterials");
    }

    function updateOtherMaterialDimensionLinkDraftFromEvent(target) {
      if (!state.modal.sub || state.modal.sub.type !== "other-material-dimension" || !state.modal.sub.draft) return false;
      const draft = state.modal.sub.draft;
      if (target.id === "orm-dim-select") {
        draft.dimensionId = target.value ? Number(target.value) : "";
        return "rerender";
      }
      if (target.id === "orm-dim-formula") {
        draft.formulaId = target.value ? Number(target.value) : "";
        return "rerender";
      }
      return false;
    }

    function defaultServiceMasterDraft() {
      return {
        code: "",
        name: "",
        uom: "piece",
        dimensionIds: [],
        categories: ["general"],
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
      if (!draft.status) errors.status = "Status is required.";
      if (!normalizeServiceCategories(draft.categories, { allowEmpty: true }).length) {
        errors.categories = "Select at least one service category.";
      }
      return errors;
    }

    function renderServiceMasterFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const editing = state.modal.mode === "edit";
      const tab = state.modal.serviceTab || "info";
      const infoForm = `
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
                ${["piece", "sq.inch", "sq.meter", "meter", "kg", "hour", "pieces", "job"].map((uom) => `<option value="${uom}" ${draft.uom === uom ? "selected" : ""}>${uom}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="form-label" for="srv-status">Status</label>
              <select id="srv-status" class="full-select">
                <option value="Active" ${draft.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${draft.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
            <div class="form-span-2">
              <p class="stat-hint">Rates managed in Service Rates page</p>
            </div>
            <div class="form-span-2">
              <label class="form-label">Service Category</label>
              <div class="service-category-row">
                ${SERVICE_CATEGORY_OPTIONS.map((option) => `
                  <label class="custom-dim-flag" for="srv-cat-${option.id}">
                    <input id="srv-cat-${option.id}" type="checkbox" ${normalizeServiceCategories(draft.categories, { allowEmpty: true }).includes(option.id) ? "checked" : ""} />
                    <span>${escapeHtml(option.label)}</span>
                  </label>
                `).join("")}
              </div>
              ${errors.categories ? `<div class="field-error">${escapeHtml(errors.categories)}</div>` : ""}
            </div>
          </div>
      `;
      const canLinkDims = Boolean(editing && draft.id);
      const linked = canLinkDims ? getServiceDimensionLinks(draft.id) : [];
      const dimRows = linked.length
        ? linked.map((row) => {
            const dim = getDimension(row.dimensionId);
            return `
              <tr>
                <td>${escapeHtml(formatDimensionChipLabel(dim))}</td>
                ${masterRowActions("data-edit-service-dim", row.id, "data-delete-service-dim", row.id)}
              </tr>
            `;
          }).join("")
        : emptyRow(2, "No dimensions linked to this service yet.");
      const dimsForm = `
        <div class="section-head">
          <div>
            <div class="section-kicker">Service dimensions</div>
            <p class="stat-hint" style="margin:4px 0 0;">${canLinkDims ? "Link a dimension (and ply) to this service. Quantity uses the formula on the active Service Rate." : "Save the service first, then add dimensions."}</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-add-service-dimension" ${canLinkDims ? "" : "disabled"}>
            <i data-lucide="plus"></i> Add Dimension to Service
          </button>
        </div>
        <div class="table-wrap">
          <table class="data-table" style="min-width:560px;">
            <thead>
              <tr>
                <th>Dimension Name</th>
                <!-- Formula (Qty Calculate) column hidden intentionally as of serviceRates.formulaId-only change; serviceDimensions.formulaId is still stored. -->
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${dimRows}</tbody>
          </table>
        </div>
      `;
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Service master</div>
            <strong>${editing ? "Edit Service" : "Add New Service"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="section-tabs">
            <button type="button" class="section-tab ${tab === "info" ? "active" : ""}" data-service-tab="info">Service Info</button>
            <button type="button" class="section-tab ${tab === "dimensions" ? "active" : ""}" data-service-tab="dimensions">Dimensions</button>
          </div>
          ${tab === "dimensions" ? dimsForm : infoForm}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          ${tab === "info" ? `<button type="button" class="btn btn-primary" id="btn-save-service-master">${editing ? "Update Service Info" : "Add Service"}</button>` : ""}
        </div>
      `;
    }

    function serviceToDraft(item) {
      return {
        id: item.id,
        code: item.code,
        name: item.name,
        uom: item.uom,
        dimensionIds: normalizeDimensionIds(item.dimensionIds),
        categories: normalizeServiceCategories(item.categories),
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
        serviceTab: "info",
        draft: item ? serviceToDraft(item) : defaultServiceMasterDraft(),
        errors: {},
        sub: null
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
      const payload = {
        code: String(draft.code).trim().toUpperCase(),
        name: String(draft.name).trim(),
        uom: draft.uom,
        categories: normalizeServiceCategories(draft.categories),
        status: draft.status
      };
      if (state.modal.mode === "edit" && draft.id) {
        const index = services.findIndex((row) => row.id === draft.id);
        if (index >= 0) services[index] = { ...services[index], ...payload };
        syncServiceDimensionIds(draft.id);
        showNotification("Service updated successfully");
        state.modal.errors = {};
        renderModal();
        renderServices();
        refreshIcons();
        afterDataChange("services");
        return;
      }
      services.push({
        id: nextMasterId(services),
        ...payload,
        dimensionIds: []
      });
      showNotification("Service added successfully");
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
      else if (target.id === "srv-status") draft.status = target.value;
      else if (target.id && target.id.startsWith("srv-cat-")) {
        const categoryId = target.id.slice("srv-cat-".length);
        if (!SERVICE_CATEGORY_IDS.includes(categoryId)) return false;
        const selected = new Set(normalizeServiceCategories(draft.categories, { allowEmpty: true }));
        if (target.checked) selected.add(categoryId);
        else selected.delete(categoryId);
        draft.categories = SERVICE_CATEGORY_IDS.filter((id) => selected.has(id));
      }
      else return false;
      return true;
    }

    function defaultServiceRateDraft(service, rateRow) {
      const inferredUom = normalizeServiceRateUom(service && service.uom) || "Rs./piece";
      return {
        serviceId: service ? service.id : null,
        rate: rateRow && rateRow.rate != null ? rateRow.rate : "",
        rateUOM: (rateRow && rateRow.rateUOM) || inferredUom,
        formulaId: rateRow && rateRow.formulaId ? Number(rateRow.formulaId) : "",
        status: (rateRow && rateRow.status) || "Active"
      };
    }

    function serviceRateUomOptions(selected) {
      const labels = {
        "Rs./piece": "Rs./piece",
        "Rs./sq.inch": "Rs./sq.inch",
        "Rs./sq.meter": "Rs./sq.meter",
        "Rs./meter": "Rs./meter",
        "Rs./kg": "Rs./kg",
        "Rs./hour": "Rs./hour (Labour)",
        "Rs./job": "Rs./job"
      };
      const values = SERVICE_RATE_UOMS.slice();
      if (selected && !values.includes(selected)) values.push(selected);
      return `<option value="">Select rate UOM</option>` + values.map((value) => `
        <option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(labels[value] || value)}</option>
      `).join("");
    }

    function renderServiceRateFormModal() {
      const draft = state.modal.draft || {};
      const errors = state.modal.errors || {};
      const service = getService(draft.serviceId);
      const formulaOptions = renderBoundFormulaOptions("Service", draft.formulaId, "Quantity");
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Pricing</div>
            <strong>Update Service Rate</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="card" style="margin-bottom:16px;">
            <div class="card-body">
              <div class="section-kicker">Service (Read-only)</div>
              <div><strong>Service:</strong> ${escapeHtml(service ? service.name : "Service not found")}</div>
              <div><strong>Code:</strong> ${escapeHtml(service ? service.code : "—")}</div>
              <div><strong>UOM:</strong> ${escapeHtml(service ? service.uom : "—")}</div>
            </div>
          </div>
          <div class="form-grid">
            <div>
              <label class="form-label" for="srate-rate">Rate (PKR)</label>
              <input id="srate-rate" class="full-search ${errors.rate ? "input-invalid" : ""}" type="number" min="0.01" max="99999.99" step="0.01" value="${escapeHtml(draft.rate === "" || draft.rate == null ? "" : formatDecimal(draft.rate, 2, true))}" placeholder="3.00" />
              ${errors.rate ? `<div class="field-error">${escapeHtml(errors.rate)}</div>` : ""}
            </div>
            <div>
              <label class="form-label" for="srate-uom">Rate UOM</label>
              <select id="srate-uom" class="full-select ${errors.rateUOM ? "input-invalid" : ""}">
                ${serviceRateUomOptions(draft.rateUOM)}
              </select>
              ${errors.rateUOM ? `<div class="field-error">${escapeHtml(errors.rateUOM)}</div>` : ""}
            </div>
            <div class="form-span-2">
              <label class="form-label" for="srate-formula">Formula</label>
              <select id="srate-formula" class="full-select">
                ${formulaOptions}
              </select>
              <p class="stat-hint">Leave blank if manual qty only</p>
            </div>
            <div class="form-span-2">
              <div class="section-kicker">Status</div>
              <label class="radio-row"><input type="radio" name="srate-status" value="Active" ${draft.status === "Active" ? "checked" : ""} /> Active</label>
              <label class="radio-row"><input type="radio" name="srate-status" value="Inactive" ${draft.status === "Inactive" ? "checked" : ""} /> Inactive</label>
              ${errors.status ? `<div class="field-error">${escapeHtml(errors.status)}</div>` : ""}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-service-rate">Update Service Rate</button>
        </div>
      `;
    }

    function openServiceRateModal(serviceId) {
      const service = getService(serviceId);
      if (!service) {
        showNotification("Service not found", "error");
        return;
      }
      const rateRow = getServiceRateRecord(service.id);
      state.modal = {
        type: "service-rate",
        selectedId: service.id,
        mode: "edit",
        lineId: null,
        draft: defaultServiceRateDraft(service, rateRow),
        errors: {}
      };
      renderModal();
    }

    function validateServiceRateDraft(draft) {
      const errors = {};
      const service = getService(draft.serviceId);
      if (!service) {
        errors.serviceId = "Service not found";
        return errors;
      }
      if (service.status === "Inactive") {
        errors.status = "Cannot update rate if service inactive";
      }
      const rate = Number(draft.rate);
      if (!Number.isFinite(rate) || rate <= 0) errors.rate = "Rate must be positive number";
      else if (rate > 99999.99) errors.rate = "Rate must be 99999.99 or less.";
      if (!draft.rateUOM) errors.rateUOM = "Rate UOM must be selected";
      return errors;
    }

    function saveServiceRateFromModal() {
      const draft = state.modal.draft;
      const errors = validateServiceRateDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const service = getService(draft.serviceId);
      const now = new Date().toISOString();
      const existing = getServiceRateRecord(draft.serviceId);
      const payload = {
        serviceId: Number(draft.serviceId),
        rate: roundTo(Number(draft.rate), 2),
        rateUOM: normalizeServiceRateUom(draft.rateUOM) || draft.rateUOM,
        formulaId: draft.formulaId ? Number(draft.formulaId) : null,
        status: draft.status || "Active",
        updatedAt: now
      };
      if (existing) {
        const index = serviceRates.findIndex((row) => row.id === existing.id);
        serviceRates[index] = { ...existing, ...payload };
      } else {
        serviceRates.push({
          id: nextMasterId(serviceRates),
          ...payload,
          createdAt: now
        });
      }
      const unit = formatRateUnit(payload.rateUOM) || "unit";
      showNotification("Service rate updated: " + service.name + " - Rs. " + formatDecimal(payload.rate, 2, true) + "/" + unit);
      closeModal();
      renderServiceRates();
      refreshIcons();
      afterDataChange("serviceRates");
      refreshOpenBomCalculations();
      if (state.currentPage === "cost-calculator") renderCostCalculator();
    }

    function updateServiceRateDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "service-rate") return false;
      const draft = state.modal.draft;
      if (target.id === "srate-rate") draft.rate = target.value;
      else if (target.id === "srate-uom") draft.rateUOM = target.value;
      else if (target.id === "srate-formula") draft.formulaId = target.value ? Number(target.value) : "";
      else if (target.name === "srate-status") draft.status = target.value;
      else return false;
      return true;
    }

    function renderServiceDimensionLinkModal() {
      const sub = state.modal.sub;
      const draft = sub.draft;
      const errors = sub.errors || {};
      const available = dimensions.filter((item) => item.status !== "Inactive");
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Service dimension</div>
            <strong>${sub.mode === "edit" ? "Edit Dimension Link" : "Add Dimension to Service"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-back-service-edit">Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="form-label" for="srv-dim-select">Dimension</label>
              <select id="srv-dim-select" class="full-select ${errors.dimensionId ? "input-invalid" : ""}" ${available.length ? "" : "disabled"}>
                <option value="">${available.length ? "Select a dimension..." : "No dimensions available"}</option>
                ${available.map((item) => `
                  <option value="${item.id}" ${Number(draft.dimensionId) === item.id ? "selected" : ""}>${escapeHtml(formatDimensionChipLabel(item))}</option>
                `).join("")}
              </select>
              ${errors.dimensionId ? `<div class="field-error">${escapeHtml(errors.dimensionId)}</div>` : ""}
            </div>
            ${"" /* Formula (Qty Calculate) selector hidden intentionally — qty uses serviceRates.formulaId. Keep draft.formulaId + save path so serviceDimensions.formulaId can be restored later. */}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" id="btn-back-service-edit">Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-service-dimension">${sub.mode === "edit" ? "Update Link" : "Add Dimension"}</button>
        </div>
      `;
    }

    function openServiceDimensionLinkModal(linkId) {
      if (state.modal.type !== "service-master" || state.modal.mode !== "edit" || !state.modal.draft || !state.modal.draft.id) return;
      const existing = linkId ? serviceDimensions.find((row) => row.id === Number(linkId)) : null;
      const defaultFormulaId = getServiceDefaultFormulaId(state.modal.draft.id);
      state.modal.sub = {
        type: "service-dimension",
        mode: existing ? "edit" : "add",
        draft: existing
          ? { id: existing.id, dimensionId: existing.dimensionId, ply: existing.ply, formulaId: existing.formulaId }
          : { dimensionId: "", formulaId: defaultFormulaId || "" },
        errors: {}
      };
      renderModal();
    }

    function backToServiceEdit() {
      state.modal.sub = null;
      state.modal.serviceTab = "dimensions";
      renderModal();
      refreshIcons();
    }

    function saveServiceDimensionLinkFromModal() {
      const sub = state.modal.sub;
      if (!sub || !sub.draft || !state.modal.draft || !state.modal.draft.id) return;
      const draft = sub.draft;
      const errors = {};
      const serviceId = Number(state.modal.draft.id);
      const dimensionId = draft.dimensionId ? Number(draft.dimensionId) : null;
      const formulaId = draft.formulaId
        ? Number(draft.formulaId)
        : getServiceDefaultFormulaId(serviceId);
      if (!dimensionId || !getDimension(dimensionId)) errors.dimensionId = "Dimension is required.";
      if (dimensionId && serviceDimensions.some((row) =>
        row.serviceId === serviceId && Number(row.dimensionId) === dimensionId && row.id !== draft.id
      )) {
        errors.dimensionId = "This dimension is already linked.";
      }
      sub.errors = errors;
      if (Object.keys(errors).length) {
        renderModal();
        return;
      }
      if (sub.mode === "edit" && draft.id) {
        const index = serviceDimensions.findIndex((row) => row.id === Number(draft.id));
        if (index >= 0) {
          serviceDimensions[index] = {
            id: serviceDimensions[index].id,
            serviceId: serviceDimensions[index].serviceId,
            dimensionId,
            ply: serviceDimensions[index].ply,
            formulaId,
            createdAt: serviceDimensions[index].createdAt
          };
        }
        showNotification("Dimension link updated");
      } else {
        serviceDimensions.push({
          id: nextMasterId(serviceDimensions),
          serviceId,
          dimensionId,
          ply: 1,
          formulaId,
          createdAt: new Date().toISOString()
        });
        showNotification("Dimension linked to service");
      }
      syncServiceDimensionIds(serviceId);
      state.modal.sub = null;
      state.modal.serviceTab = "dimensions";
      renderModal();
      renderServices();
      refreshIcons();
      afterDataChange("serviceDimensions", "services");
      refreshOpenBomCalculations();
    }

    function removeServiceDimensionLink(linkId) {
      const index = serviceDimensions.findIndex((row) => row.id === Number(linkId));
      if (index < 0) return;
      const serviceId = serviceDimensions[index].serviceId;
      serviceDimensions.splice(index, 1);
      syncServiceDimensionIds(serviceId);
      showNotification("Dimension removed from service");
      if (state.modal.type === "service-master") {
        state.modal.sub = null;
        state.modal.serviceTab = "dimensions";
        renderModal();
      }
      renderServices();
      refreshIcons();
      afterDataChange("serviceDimensions", "services");
      refreshOpenBomCalculations();
    }

    function updateServiceDimensionLinkDraftFromEvent(target) {
      if (!state.modal.sub || state.modal.sub.type !== "service-dimension" || !state.modal.sub.draft) return false;
      const draft = state.modal.sub.draft;
      if (target.id === "srv-dim-select") {
        draft.dimensionId = target.value ? Number(target.value) : "";
        return "rerender";
      }
      if (target.id === "srv-dim-formula") {
        draft.formulaId = target.value ? Number(target.value) : "";
        return "rerender";
      }
      return false;
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
        ply: 1,
        value: "",
        unit: "",
        errors: {}
      };
    }

    function renderPendingStyleVariables() {
      const draft = state.modal.draft || {};
      const rows = Array.isArray(draft.pendingVariables) ? draft.pendingVariables : [];
      const catalog = getActiveFormulaVariables();
      const body = rows.length
        ? rows.map((row) => {
            const errors = row.errors || {};
            return `
              <div class="style-var-row" data-pending-var="${escapeHtml(row.key)}">
                <div>
                  <label class="form-label" for="pending-var-code-${escapeHtml(row.key)}">Variable Code</label>
                  <select id="pending-var-code-${escapeHtml(row.key)}" class="full-select ${errors.variableCode ? "input-invalid" : ""}" data-pending-var-code="${escapeHtml(row.key)}">
                    <option value="">Select a variable...</option>
                    ${catalog.map((item) => `
                      <option value="${escapeHtml(item.code)}" ${row.variableCode === item.code ? "selected" : ""}>
                        ${escapeHtml(item.code)} — ${escapeHtml(item.name)}
                      </option>
                    `).join("")}
                  </select>
                  ${errors.variableCode ? `<div class="field-error">${escapeHtml(errors.variableCode)}</div>` : ""}
                </div>
                <div>
                  <label class="form-label" for="pending-var-ply-${escapeHtml(row.key)}">Ply</label>
                  <select id="pending-var-ply-${escapeHtml(row.key)}" class="full-select ${errors.ply ? "input-invalid" : ""}" data-pending-var-ply="${escapeHtml(row.key)}">
                    ${renderStylePlyOptions(row.ply)}
                  </select>
                  ${errors.ply ? `<div class="field-error">${escapeHtml(errors.ply)}</div>` : ""}
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
              <p class="stat-hint" style="margin:4px 0 0;">Optional. Choose a formula variable, ply, and value, then save with the style.</p>
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
              <button type="button" class="section-tab active">Style Info</button>
            </div>
            ${infoForm}
            <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">
              ${formulasForm}
            </div>
          ` : `${infoForm}`}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-style">${editing ? "Update Style Info" : "Add Style"}</button>
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
            if (String(fg?.style ?? "").toLowerCase() === String(previous).toLowerCase()) fg.style = payload.name;
          });
          finishingServices.forEach((item) => {
            if (String(item?.style ?? "").toLowerCase() === String(previous).toLowerCase()) item.style = payload.name;
          });
        }
        showNotification("Style updated successfully");
        state.modal.errors = {};
        renderModal();
        renderStyles();
        renderCostCalculator();
        refreshIcons();
        afterDataChange("styles", "finishedGoods", "finishingServices");
        refreshOpenBomCalculations();
        return;
      }
      const pending = (draft.pendingVariables || []).filter((row) =>
        String(row.variableCode || "").trim() || String(row.value ?? "").trim() !== ""
      );
      let pendingInvalid = false;
      const usedCombos = new Set();
      pending.forEach((row) => {
        row.errors = {};
        if (!row.variableCode) row.errors.variableCode = "Variable is required.";
        const ply = normalizeStylePly(row.ply, NaN);
        if (![1, 2, 3].includes(ply)) row.errors.ply = "Ply must be 1, 2, or 3.";
        const parsed = parseByRule(row.value, "variable", { requiredError: "Value is required." });
        if (!parsed.ok) row.errors.value = parsed.error;
        if (row.variableCode && [1, 2, 3].includes(ply)) {
          const key = styleVariableComboKey(row.variableCode, ply);
          if (usedCombos.has(key)) row.errors.ply = "This variable is already set for this ply.";
          usedCombos.add(key);
        }
        row.parsedValue = parsed.ok ? parsed.value : null;
        row.ply = [1, 2, 3].includes(ply) ? ply : row.ply;
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
          ply: normalizeStylePly(row.ply, 1),
          value: row.parsedValue,
          unit: catalog ? catalog.unit : row.unit
        });
      });
      closeModal();
      renderStyles();
      renderCostCalculator();
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
      const plyKey = target.dataset.pendingVarPly;
      if (!codeKey && !valueKey && !plyKey) return false;
      const row = rows.find((item) => item.key === (codeKey || valueKey || plyKey));
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
      if (plyKey) {
        row.ply = Number(target.value);
        if (row.errors) row.errors.ply = "";
        return true;
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
      const options = getActiveFormulaVariables();
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
              <label class="form-label" for="svar-ply">Ply</label>
              <select id="svar-ply" class="full-select ${errors.ply ? "input-invalid" : ""}">
                ${renderStylePlyOptions(draft.ply)}
              </select>
              ${errors.ply ? `<div class="field-error">${escapeHtml(errors.ply)}</div>` : ""}
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
          ? { id: existing.id, variableCode: existing.variableCode, ply: normalizeStylePly(existing.ply, 3), value: existing.value, unit: existing.unit || (catalog && catalog.unit) || "" }
          : { variableCode: "", ply: 1, value: "", unit: "" },
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
      const ply = normalizeStylePly(draft.ply, NaN);
      if (![1, 2, 3].includes(ply)) errors.ply = "Ply must be 1, 2, or 3.";
      const parsedValue = parseByRule(draft.value, "variable", { requiredError: "Value is required." });
      if (!parsedValue.ok) errors.value = parsedValue.error;
      if (draft.variableCode && [1, 2, 3].includes(ply) && findStyleVariable(state.modal.draft.id, draft.variableCode, ply, draft.id)) {
        errors.ply = "This variable is already set for this ply.";
      }
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
          styleVariables[index] = { ...styleVariables[index], ply, value, unit };
        }
        showNotification("Variable updated");
      } else {
        styleVariables.push({
          id: nextMasterId(styleVariables),
          styleId: state.modal.draft.id,
          variableCode: draft.variableCode,
          ply,
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
      if (target.id === "svar-ply") {
        draft.ply = Number(target.value);
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
      } else if (isReservedImplementationVariableCode(code)) {
        errors.code = "This code is a fixed implementation constant and cannot be added as a variable.";
      }
      if (!String(draft.name || "").trim()) errors.name = "Name is required.";
      if (!draft.category) errors.category = "Category is required.";
      if (!draft.dataType) errors.dataType = "Data type is required.";
      if (draft.dataType === "numeric" && draft.defaultValue !== "" && draft.defaultValue != null) {
        const parsed = parseNumeric(draft.defaultValue, 8, { ...DECIMAL_RULES.variable, decimals: 8, decimalError: "Value must have maximum 8 decimal places" });
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
              ${prettySelect("fvar-category", ["Dimension", "Material", "Costing", "Sheet", "Area", "Service", "Other", "Cost", "Finishing", "Percentage", "Printing", "Quantity", "Rate", "System"].map((cat) => ({ value: cat, label: cat })), draft.category)}
            </div>
            <div>
              <label class="form-label" for="fvar-datatype">Data Type</label>
              ${prettySelect("fvar-datatype", [
                { value: "numeric", label: "numeric" },
                { value: "text", label: "text" }
              ], draft.dataType)}
            </div>
            <div>
              <label class="form-label" for="fvar-unit">Unit</label>
              ${prettySelect("fvar-unit", ["inch", "cm", "mm", "kg", "gm", "sq.m", "sq.inch", "%", "pieces", "gsm", "Rs.", "factor", "gram", "Other", "pcs", "Rs./kg", "Rs./pc", "sq.ft", "sq.in", "Type", "g/cm³", "Ply", "clr", "thd", ""].map((unit) => ({ value: unit, label: unit || "(none)" })), draft.unit)}
            </div>
            <div>
              <label class="form-label" for="fvar-default">Default Value</label>
              <input id="fvar-default" class="full-search ${errors.defaultValue ? "input-invalid" : ""}" value="${escapeHtml(draft.defaultValue)}" ${String(draft.code).toUpperCase() === "SHEET_AREA" ? "disabled" : ""} />
              ${String(draft.code).toUpperCase() === "SHEET_AREA"
                ? `<p class="stat-hint">Calculated as SHEET_WIDTH × SHEET_LENGTH.</p>`
                : (errors.defaultValue ? `<div class="field-error">${escapeHtml(errors.defaultValue)}</div>` : "")}
            </div>
            <div>
              <label class="form-label" for="fvar-status">Status</label>
              ${prettySelect("fvar-status", [
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" }
              ], draft.isActive ? "Active" : "Inactive")}
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
      if (item && isFixedSheetAreaCode(item.code)) {
        showNotification("SHEET_AREA is a fixed calculation and cannot be edited.", "error");
        return;
      }
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
      if (String(draft.code).trim().toUpperCase() === "SHEET_AREA") defaultValue = null;
      if (draft.dataType === "numeric" && defaultValue != null) {
        const parsed = parseNumeric(defaultValue, 8, { ...DECIMAL_RULES.variable, decimals: 8, decimalError: "Value must have maximum 8 decimal places" });
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
        const existing = formulaVariables.find((row) => row.id === draft.id);
        if (existing && isFixedSheetAreaCode(existing.code)) {
          showNotification("SHEET_AREA is a fixed calculation and cannot be edited.", "error");
          return;
        }
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

    function defaultFixedVariableDraft() {
      return { code: "", value: "", description: "" };
    }

    function validateFixedVariableDraft(draft) {
      const errors = {};
      const editingItem = state.modal.mode === "edit" && draft.id
        ? fixedVariables.find((row) => row.id === draft.id)
        : null;
      const code = String(draft.code || "").trim().toUpperCase();
      if (!editingItem || !editingItem.builtIn) {
        if (!code) errors.code = "Code is required.";
        else if (!/^[A-Z][A-Z0-9_]*$/.test(code)) errors.code = "Code can contain only A-Z, 0-9 and underscores.";
        else if (fixedVariables.some((item) => String(item.code || "").toUpperCase() === code && item.id !== draft.id)) {
          errors.code = "Code must be unique.";
        } else if (BASE_VARIABLES.includes(code) || isFixedSheetAreaCode(code)) {
          errors.code = "This code is a reserved base variable.";
        } else if (formulaVariables.some((item) => String(item.code || "").toUpperCase() === code)) {
          errors.code = "Code is already used by a formula variable.";
        } else if (getFormulaByCode(code)) {
          errors.code = "Code is already used by a formula.";
        }
      }
      if (!isDerivedFixedVariable(editingItem)) {
        if (draft.value === "" || draft.value == null) {
          errors.value = "Value is required.";
        } else {
          const parsed = parseNumeric(draft.value, 8, { ...DECIMAL_RULES.variable, decimals: 8, decimalError: "Value must have maximum 8 decimal places" });
          if (!parsed.ok) errors.value = parsed.error;
        }
      }
      return errors;
    }

    function renderFixedVariableFormModal() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const editing = state.modal.mode === "edit";
      const item = editing && draft.id ? fixedVariables.find((row) => row.id === draft.id) : null;
      const builtIn = Boolean(item && item.builtIn);
      const derived = isDerivedFixedVariable(item);
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Fixed variable</div>
            <strong>${editing ? "Edit Fixed Variable" : "Add New Fixed Variable"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="form-grid two">
            <div>
              <label class="form-label" for="fixedvar-code">Code</label>
              <input id="fixedvar-code" class="full-search ${errors.code ? "input-invalid" : ""}" value="${escapeHtml(draft.code)}" placeholder="MY_CONSTANT" ${builtIn ? "disabled" : ""} />
              ${builtIn
                ? `<p class="stat-hint">System code. It cannot be changed.</p>`
                : (errors.code ? `<div class="field-error">${escapeHtml(errors.code)}</div>` : "")}
            </div>
            <div>
              <label class="form-label" for="fixedvar-value">Value</label>
              <input id="fixedvar-value" class="full-search ${errors.value ? "input-invalid" : ""}" type="number" step="any" value="${escapeHtml(draft.value == null ? "" : String(draft.value))}" placeholder="0.001" ${derived ? "disabled" : ""} />
              ${derived
                ? `<p class="stat-hint">Calculated as ${escapeHtml(CONVERSION_FACTOR_FORMULA)}.</p>`
                : (errors.value ? `<div class="field-error">${escapeHtml(errors.value)}</div>` : "")}
            </div>
            <div class="form-span-2">
              <label class="form-label" for="fixedvar-description">Description</label>
              <textarea id="fixedvar-description" class="full-search">${escapeHtml(draft.description)}</textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-fixed-variable">${editing ? "Update Fixed Variable" : "Add Fixed Variable"}</button>
        </div>
      `;
    }

    function openFixedVariableModal(id) {
      const item = id ? fixedVariables.find((row) => row.id === Number(id)) : null;
      state.modal = {
        type: "fixed-variable",
        selectedId: item ? item.id : null,
        mode: item ? "edit" : "add",
        lineId: null,
        draft: item
          ? { id: item.id, code: item.code, value: item.value == null ? "" : String(item.value), description: item.description || "" }
          : defaultFixedVariableDraft(),
        errors: {}
      };
      renderModal();
    }

    function saveFixedVariableFromModal() {
      const draft = state.modal.draft;
      const errors = validateFixedVariableDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const code = String(draft.code || "").trim().toUpperCase();
      const description = String(draft.description || "").trim();
      const parsedValue = parseNumeric(draft.value, 8, { ...DECIMAL_RULES.variable, decimals: 8 });
      if (state.modal.mode === "edit" && draft.id) {
        const item = fixedVariables.find((row) => row.id === draft.id);
        if (!item) {
          closeModal();
          return;
        }
        if (!item.builtIn) item.code = code;
        if (!isDerivedFixedVariable(item) && parsedValue.ok) item.value = parsedValue.value;
        item.description = description;
        showNotification("Fixed variable updated successfully");
      } else {
        fixedVariables.push({
          id: nextMasterId(fixedVariables),
          code,
          value: parsedValue.ok ? parsedValue.value : Number(draft.value),
          description,
          builtIn: false
        });
        showNotification("Fixed variable added successfully");
      }
      syncEngineConstantsFromFixedVariables();
      if (state.selectedFinishedGoodId && getSelectedFinishedGood()) {
        try {
          recalculateBOMCosts();
        } catch (error) {
          console.error("Could not recalculate BOM after fixed variable change", error);
        }
      }
      closeModal();
      renderFormulaVariables();
      refreshIcons();
      afterDataChange("fixedVariables");
    }

    function updateFixedVariableDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "fixed-variable") return false;
      const draft = state.modal.draft;
      if (target.id === "fixedvar-code") draft.code = target.value.toUpperCase();
      else if (target.id === "fixedvar-value") draft.value = target.value;
      else if (target.id === "fixedvar-description") draft.description = target.value;
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
      const isClean = state.modal.entity === "user-data";
      const title = isReset ? "Reset local data" : (isClean ? "Clean My Data" : "Delete Confirmation");
      const body = isReset
        ? "Delete all locally saved products, materials, services, formulas, BOMs, and preferences, then restore the original seed data? This cannot be undone."
        : isClean
          ? "This will delete everything — including formulas, dimensions, styles, and variables. You will need to rebuild your setup from scratch. This cannot be undone."
          : "Are you sure you want to delete " + escapeHtml(state.modal.label) + "? This action cannot be undone.";
      const action = isReset ? "Reset data" : (isClean ? "Clean My Data" : "Delete");
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Confirm</div>
            <strong>${title}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <p>${body}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-modal-close ${isClean && state.cleaningUserData ? "disabled" : ""}>Cancel</button>
          <button type="button" class="btn ${isClean ? "btn-warning-solid" : "btn-danger-solid"}" id="btn-confirm-master-delete" ${isClean && state.cleaningUserData ? "disabled" : ""} aria-busy="${isClean && state.cleaningUserData ? "true" : "false"}">${isClean && state.cleaningUserData ? "Cleaning..." : action}</button>
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
      if (entity === "user-data") {
        if (state.cleaningUserData) return;
        cleanUserData();
        return;
      }
      if (entity === "finished-good") {
        const usage = finishedGoodBomUsageMessage(id);
        if (usage) {
          showNotification(usage, "error");
          return;
        }
        const index = finishedGoods.findIndex((item) => item.id === id);
        if (index >= 0) finishedGoods.splice(index, 1);
        closeModal();
        renderFinishedGoods();
        showNotification("Product deleted successfully");
        afterDataChange("finishedGoods");
      } else if (entity === "raw-material") {
        const usage = materialBomUsageMessage(id);
        if (usage) {
          showNotification(usage, "error");
          return;
        }
        const index = rawMaterials.findIndex((item) => item.id === id);
        if (index >= 0) rawMaterials.splice(index, 1);
        for (let i = materialDimensions.length - 1; i >= 0; i -= 1) {
          if (materialDimensions[i].rawMaterialId === id) materialDimensions.splice(i, 1);
        }
        for (let i = materialRates.length - 1; i >= 0; i -= 1) {
          if (Number(materialRates[i].rawMaterialId) === id) materialRates.splice(i, 1);
        }
        closeModal();
        renderRawMaterials();
        showNotification("Material deleted successfully");
        afterDataChange("rawMaterials", "materialDimensions", "materialRates");
      } else if (entity === "other-raw-material") {
        const usage = otherMaterialBomUsageMessage(id);
        if (usage) {
          showNotification(usage, "error");
          return;
        }
        const index = otherRawMaterials.findIndex((item) => item.id === id);
        if (index >= 0) otherRawMaterials.splice(index, 1);
        for (let i = otherMaterialDimensions.length - 1; i >= 0; i -= 1) {
          if (otherMaterialDimensions[i].otherRawMaterialId === id) otherMaterialDimensions.splice(i, 1);
        }
        for (let i = otherMaterialRates.length - 1; i >= 0; i -= 1) {
          if (Number(otherMaterialRates[i].otherRawMaterialId) === id) otherMaterialRates.splice(i, 1);
        }
        closeModal();
        renderOtherRawMaterials();
        showNotification("Material deleted successfully");
        afterDataChange("otherRawMaterials", "otherMaterialDimensions", "otherMaterialRates");
      } else if (entity === "service") {
        const usage = serviceBomUsageMessage(id);
        if (usage) {
          showNotification(usage, "error");
          return;
        }
        const index = services.findIndex((item) => item.id === id);
        if (index >= 0) services.splice(index, 1);
        for (let i = serviceDimensions.length - 1; i >= 0; i -= 1) {
          if (serviceDimensions[i].serviceId === id) serviceDimensions.splice(i, 1);
        }
        for (let i = serviceRates.length - 1; i >= 0; i -= 1) {
          if (Number(serviceRates[i].serviceId) === id) serviceRates.splice(i, 1);
        }
        closeModal();
        renderServices();
        showNotification("Service deleted successfully");
        afterDataChange("services", "serviceDimensions", "serviceRates");
      } else if (entity === "service-dimension") {
        const parent = state.modal.parentService;
        removeServiceDimensionLink(id);
        if (parent) {
          state.modal = parent;
          state.modal.sub = null;
          state.modal.serviceTab = "dimensions";
          renderModal();
        }
        refreshIcons();
        return;
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
        for (let i = serviceDimensions.length - 1; i >= 0; i -= 1) {
          if (Number(serviceDimensions[i].dimensionId) === id) serviceDimensions.splice(i, 1);
        }
        for (let i = materialDimensions.length - 1; i >= 0; i -= 1) {
          if (Number(materialDimensions[i].dimensionId) === id) materialDimensions.splice(i, 1);
        }
        for (let i = otherMaterialDimensions.length - 1; i >= 0; i -= 1) {
          if (Number(otherMaterialDimensions[i].dimensionId) === id) otherMaterialDimensions.splice(i, 1);
        }
        services.forEach((item) => syncServiceDimensionIds(item.id));
        rawMaterials.forEach((item) => syncMaterialDimensionIds(item.id));
        otherRawMaterials.forEach((item) => syncOtherMaterialDimensionIds(item.id));
        closeModal();
        renderDimensions();
        showNotification("Dimension deleted successfully");
        afterDataChange("dimensions", "serviceDimensions", "materialDimensions", "otherMaterialDimensions", "services", "rawMaterials", "otherRawMaterials");
      } else if (entity === "formula-variable") {
        const variable = formulaVariables.find((item) => item.id === id);
        if (variable && isFixedSheetAreaCode(variable.code)) {
          showNotification("SHEET_AREA is a fixed calculation and cannot be deleted.", "error");
          return;
        }
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
        return {
          rawMaterialId: line.rawMaterialId,
          layer: line.layer,
          calculationMethod: line.calculationMethod,
          formulaId: line.formulaId || (sheetWeight ? sheetWeight.id : null),
          dimensionId: line.dimensionId != null ? Number(line.dimensionId) : null,
          manualQty: line.manualQty,
          manualRate: line.manualRate,
          wastagePercent: line.wastagePercent == null ? "" : line.wastagePercent,
          useCustomDimensions: Boolean(line.useCustomDimensions),
          customLength: line.customLength != null ? line.customLength : "",
          customWidth: line.customWidth != null ? line.customWidth : ""
        };
      }
      const fg = getSelectedFinishedGood();
      const layers = getPlyLayers(fg ? fg.ply : 3);
      return {
        rawMaterialId: null,
        layer: layers[0],
        calculationMethod: "formula",
        formulaId: null,
        dimensionId: null,
        manualQty: 1,
        manualRate: null,
        wastagePercent: "",
        useCustomDimensions: false,
        customLength: "",
        customWidth: ""
      };
    }

    function validateMaterialDraft(draft, lineId) {
      const errors = {};
      applyMaterialFormulaBindings(draft);
      const finishedGood = getMaterialModalFinishedGood();
      const ply = getFinishedGoodPly(finishedGood);
      const fromAdditional = Boolean(state.modal && state.modal.fromAdditional);
      if (!finishedGood) {
        errors.finishedGood = isCostCalculatorAdditionalModal()
          ? "Complete style, dimensions, and ply before adding materials."
          : "Select a Finished Good before adding materials.";
      }
      if (!draft.rawMaterialId) errors.rawMaterialId = "Raw Material is required.";
      const material = getRawMaterial(draft.rawMaterialId);
      if (draft.rawMaterialId && !material) errors.rawMaterialId = "Material must exist in the Raw Material Master.";
      if (!fromAdditional && !draft.layer) errors.layer = "Layer is required.";
      if (!fromAdditional) {
        const allowedLayers = getLayerOptionsForEditor(draft.layer);
        if (draft.layer && !allowedLayers.includes(draft.layer)) {
          errors.layer = "Layer is not valid for this ply count.";
        }
      } else if (!draft.layer) {
        draft.layer = "Additional";
      }
      if (material) {
        applyManualRateDraftValidation(
          draft,
          errors,
          getMaterialRate(material.id),
          "No rate configured for this material.",
          "Purchasing rate from Raw Material Rates is not valid."
        );
      }
      const linkedDims = material ? getMaterialLinkedDimensionIds(material) : [];
      if (draft.dimensionId && linkedDims.length && !linkedDims.includes(Number(draft.dimensionId))) {
        errors.dimensionId = "Selected dimension is not linked to this material.";
      } else if (draft.dimensionId && !getDimension(draft.dimensionId)) {
        errors.dimensionId = "Selected dimension is not valid.";
      }
      if (draft.calculationMethod === "formula") {
        if (!errors.dimensionId && material && draft.dimensionId && materialMissingPlyFormula(material, draft.dimensionId, ply)) {
          errors.formulaId = "A valid material formula is required. Set Default Quantity Formula on the Raw Material master.";
        } else if (!errors.dimensionId) {
          const selectedFormula = getFormula(draft.formulaId);
          if (!draft.formulaId) errors.formulaId = "A valid material formula is required. Set Default Quantity Formula on the Raw Material master.";
          else if (!selectedFormula || !selectedFormula.isActive) errors.formulaId = "Selected formula is not valid or is inactive.";
        }
      } else {
        const qty = parseByRule(draft.manualQty, "quantity", { requiredError: "Manual quantity must be greater than 0." });
        if (!qty.ok) errors.manualQty = qty.error;
      }
      const wastageInput = draft.wastagePercent == null || draft.wastagePercent === ""
        ? 0
        : draft.wastagePercent;
      const wastage = parseByRule(wastageInput, "wastage", { requiredError: "Wastage cannot be negative." });
      if (!wastage.ok) errors.wastagePercent = wastage.error;
      if (draft.rawMaterialId && draft.layer && findDuplicateMaterial(draft.rawMaterialId, draft.layer, lineId)) {
        errors.duplicate = "This material is already added to the selected layer.";
      }
      validateCustomDimensionDraft(draft, errors);
      if (!errors.formulaId && !errors.rawMaterialId && !errors.manualQty && !errors.manualRate && !errors.wastagePercent && !errors.finishedGood && !errors.dimensionId && !errors.customLength && !errors.customWidth) {
        const preview = calculateMaterialCost({
          id: lineId || 0,
          rawMaterialId: draft.rawMaterialId,
          layer: draft.layer,
          calculationMethod: draft.calculationMethod,
          formulaId: draft.formulaId,
          dimensionId: draft.dimensionId,
          manualQty: draft.manualQty,
          manualRate: storedManualRateFromDraft(draft),
          wastagePercent: draft.wastagePercent,
          ...customDimensionFields(draft),
          netQty: 0,
          grossQty: 0,
          rate: 0,
          costPerPiece: 0
        }, getMaterialModalCalcContext());
        if (preview.error) errors.formula = preview.error;
      }
      return errors;
    }

    function collectLeafFormulaVariables(expression) {
      const leaves = [];
      const walk = (expr, stack) => {
        extractIdentifiers(expr).forEach((id) => {
          if (Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, id)) return;
          if (stack.includes(id)) return;
          const nested = getFormulaByCode(id);
          if (nested && nested.isActive && nested.expression) {
            walk(nested.expression, stack.concat(id));
            return;
          }
          if (!leaves.includes(id)) leaves.push(id);
        });
      };
      walk(String(expression || ""), []);
      return leaves;
    }

    function formatPreviewVariableDisplay(code, value, unitHint) {
      const catalog = getFormulaVariableByCode(code);
      const unit = unitHint || (catalog && catalog.unit) || "";
      const formatted = value === null || value === undefined || value === ""
        ? "—"
        : formatFormulaResult(value);
      if (code === "WASTAGE") {
        return Number.isFinite(Number(value)) ? formatDecimal(Number(value), 2, false) + "%" : formatted;
      }
      return unit ? formatted + " " + unit : formatted;
    }

    function getFormulaBreakdown(formula, variables, extraCodes) {
      const codes = formula && formula.expression ? collectLeafFormulaVariables(formula.expression) : [];
      (extraCodes || []).forEach((code) => {
        if (code && !codes.includes(code)) codes.push(code);
      });
      return {
        formula: formula || null,
        variables: codes.map((code) => {
          const catalog = getFormulaVariableByCode(code);
          const value = variables && Object.prototype.hasOwnProperty.call(variables, code) ? variables[code] : null;
          return {
            code,
            name: catalog ? catalog.name : code,
            value,
            display: formatPreviewVariableDisplay(code, value)
          };
        })
      };
    }

    function formatExplainNumber(value) {
      const n = Number(value);
      if (!Number.isFinite(n)) return "—";
      const abs = Math.abs(n);
      if (abs !== 0 && abs < 0.001) return formatDecimal(n, 8, false);
      if (abs !== 0 && abs < 1) return formatDecimal(n, 6, false);
      return formatDecimal(n, 4, false);
    }

    function extraFormulasFromStyleRows(rows) {
      const extra = {};
      (Array.isArray(rows) ? rows : []).forEach((row) => {
        const formula = getFormula(row.formulaId) || getFormulaByCode(row.code);
        if (formula && formula.code) extra[formula.code] = formula;
      });
      return extra;
    }

    function lookupFormulaByCode(code, extraByCode) {
      return (extraByCode && extraByCode[code]) || getFormulaByCode(code) || null;
    }

    function collectNestedFormulas(formula, extraByCode, skipCodes) {
      const ordered = [];
      const seen = new Set();
      const skip = skipCodes instanceof Set ? skipCodes : new Set(skipCodes || []);
      function visit(item) {
        if (!item || !item.expression || seen.has(item.id)) return;
        seen.add(item.id);
        extractIdentifiers(item.expression).forEach((id) => {
          if (skip.has(id)) return;
          const dep = lookupFormulaByCode(id, extraByCode);
          if (dep && dep.id !== item.id) visit(dep);
        });
        ordered.push(item);
      }
      visit(formula);
      return ordered;
    }

    function coveredAreaDependentStyleRows(coveredRow, allRows) {
      if (!coveredRow) return [];
      const formula = getFormula(coveredRow.formulaId) || getFormulaByCode(coveredRow.code);
      if (!formula) return [];
      const nested = collectNestedFormulas(formula, extraFormulasFromStyleRows(allRows));
      const byCode = new Map();
      (allRows || []).forEach((row) => {
        if (row && row.code && !byCode.has(row.code)) byCode.set(row.code, row);
      });
      return nested
        .map((item) => (item && item.code && item.code !== formula.code ? byCode.get(item.code) : null))
        .filter(Boolean);
    }

    function resolveExplainIdentifier(id, variables, computed) {
      if (computed && Object.prototype.hasOwnProperty.call(computed, id) && computed[id] != null) {
        return computed[id];
      }
      const provided = numericOrNull(variables ? variables[id] : null);
      if (provided !== null) return provided;
      if (Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, id)) return ENGINE_CONSTANTS[id];
      const dep = getFormulaByCode(id);
      if (dep) {
        const evaluated = evaluateFormula(dep.expression, variables, [dep.code]);
        if (evaluated.success) return evaluated.result;
      }
      return null;
    }

    function classifyExplainIdentifier(id, computed, tagHints) {
      if (computed && Object.prototype.hasOwnProperty.call(computed, id) && computed[id] != null) return "step";
      if (Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, id)) return "hardcoded";
      if (tagHints && tagHints[id]) return tagHints[id];
      return "input";
    }

    function explainTaggedValueHtml(shown, tag, extraTitle) {
      const labels = {
        hardcoded: "fixed implementation constant",
        manual: "manual entry",
        input: "formula input"
      };
      const titleAttr = extraTitle ? ` title="${escapeHtml(extraTitle)}"` : "";
      const val = `<strong class="formula-val"${titleAttr}>${escapeHtml(shown)}</strong>`;
      const label = labels[tag];
      if (!label) return val;
      return `${val} <span class="formula-src">(${escapeHtml(label)})</span>`;
    }

    function expressionToExplainHtml(expression, variables, computed, tagHints) {
      let tokens;
      try {
        tokens = tokenizeExpression(expression);
      } catch (error) {
        return `<span class="mono">${escapeHtml(expression || "—")}</span>`;
      }
      return tokens.map((token) => {
        if (token.type === "id") {
          const value = resolveExplainIdentifier(token.value, variables, computed);
          const shown = value == null ? token.value : formatExplainNumber(value);
          const tag = classifyExplainIdentifier(token.value, computed, tagHints);
          const extra = tag === "hardcoded" ? (ENGINE_CONSTANT_LABELS[token.value] || "") : "";
          return explainTaggedValueHtml(shown, tag, extra);
        }
        if (token.type === "num") {
          return explainTaggedValueHtml(formatExplainNumber(token.value), "hardcoded");
        }
        if (token.type === "*") return " × ";
        if (token.type === "/") return " / ";
        if (token.type === "+") return " + ";
        if (token.type === "-") return " − ";
        if (token.type === "(") return "(";
        if (token.type === ")") return ")";
        return escapeHtml(token.value || token.type);
      }).join("");
    }

    function prettyExpressionText(expression) {
      return String(expression || "")
        .replace(/\*/g, " × ")
        .replace(/\//g, " / ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function formulaHasVariableInputs(formula, extraByCode) {
      if (!formula || !formula.expression) return false;
      return collectNestedFormulas(formula, extraByCode).some((item) =>
        extractIdentifiers(item.expression).some((id) =>
          !Object.prototype.hasOwnProperty.call(ENGINE_CONSTANTS, id) && !lookupFormulaByCode(id, extraByCode)
        )
      );
    }

    function inferExplainSourceType(formula, explicit, extraByCode) {
      if (explicit) return explicit;
      if (!formula) return "manual";
      if (collectNestedFormulas(formula, extraByCode).length > 1) return "formula";
      return formulaHasVariableInputs(formula, extraByCode) ? "formula" : "formula-flat";
    }

    function buildGrossQtyExplainSteps(variables, computed, netQty, wastagePercent, grossQty, tagHints, startIndex) {
      const steps = [];
      const grossFormula = getFormulaByCode("GROSS_QTY");
      const wastage = Number(wastagePercent);
      const net = Number(netQty);
      const wastageTag = (tagHints && tagHints.WASTAGE) || "input";
      if (grossFormula && grossFormula.isActive) {
        const grossVars = { ...variables, NET_QTY: net, WASTAGE: wastage };
        const grossComputed = { ...computed, NET_QTY: net };
        const grossEval = evaluateFormula(grossFormula.expression, grossVars, [grossFormula.code]);
        steps.push({
          index: startIndex + 1,
          heading: (grossFormula.name || "Gross Quantity") + " (" + grossFormula.code + ")",
          expression: prettyExpressionText(grossFormula.expression),
          pluggedHtml: "= " + expressionToExplainHtml(grossFormula.expression, grossVars, grossComputed, { ...tagHints, NET_QTY: "step", WASTAGE: wastageTag }) +
            " = <strong class=\"formula-val\">" + escapeHtml(formatExplainNumber(grossEval.success ? grossEval.result : grossQty)) + "</strong>"
        });
      } else {
        steps.push({
          index: startIndex + 1,
          heading: "Gross Quantity",
          expression: "NET_QTY × (1 + WASTAGE / 100)",
          pluggedHtml: `= ${explainTaggedValueHtml(formatExplainNumber(net), "step")} × (${explainTaggedValueHtml("1", "hardcoded")} + ${explainTaggedValueHtml(formatExplainNumber(wastage), wastageTag)} / ${explainTaggedValueHtml("100", "hardcoded")}) = <strong class="formula-val">${escapeHtml(formatQty(grossQty))}</strong>`
        });
      }
      return steps;
    }

    function buildFormulaExplainCore(opts) {
      const formula = opts.formula || null;
      const variables = opts.variables || {};
      const tagHints = opts.tagHints || {};
      const uom = opts.uom || "";
      const title = opts.title || "Quantity";
      const extraByCode = opts.extraByCode || extraFormulasFromStyleRows(opts.styleRows);
      const sourceType = inferExplainSourceType(formula, opts.sourceType, extraByCode);
      const includeGrossQty = Boolean(opts.includeGrossQty) && !(formula && formula.code === "GROSS_QTY");
      const resultValue = opts.resultValue != null ? opts.resultValue : (opts.netQty != null ? opts.netQty : null);
      const formulaName = sourceType === "manual"
        ? "Manual entry"
        : sourceType === "hardcoded"
          ? (opts.hardcodedLabel || "Fixed implementation constant")
          : (formula ? (formula.name || formula.code) : "Formula");

      const defaultFinal = includeGrossQty
        ? `Net Qty: <strong>${escapeHtml(formatQty(opts.netQty))} ${escapeHtml(uom)}</strong> → Gross Qty: <strong>${escapeHtml(formatQty(opts.grossQty))} ${escapeHtml(uom)}</strong>`
        : (opts.resultLabel || "Qty") + `: <strong>${escapeHtml(opts.resultDisplay != null ? String(opts.resultDisplay) : formatQty(resultValue))} ${escapeHtml(uom)}</strong>`.trim();
      const finalHtml = opts.finalHtml || defaultFinal;

      if (sourceType === "manual") {
        const typed = opts.manualQty != null ? opts.manualQty : resultValue;
        const shown = formatQty(typed);
        const steps = includeGrossQty
          ? buildGrossQtyExplainSteps(variables, { NET_QTY: Number(opts.netQty) }, opts.netQty, opts.wastagePercent, opts.grossQty, tagHints, 0)
          : [];
        return {
          title,
          subtitle: opts.subtitle || "",
          formulaName,
          sourceType,
          summaryHtml: `This value was entered manually: <strong class="formula-val">${escapeHtml(shown)}</strong> <span class="formula-src">(manual entry)</span>${uom ? " " + escapeHtml(uom) : ""}. It is not calculated from a formula.`,
          steps,
          finalHtml
        };
      }

      if (sourceType === "hardcoded") {
        const shown = opts.resultDisplay != null ? String(opts.resultDisplay) : formatExplainNumber(resultValue);
        const represents = opts.hardcodedLabel ? ` (${escapeHtml(opts.hardcodedLabel)})` : "";
        return {
          title,
          subtitle: opts.subtitle || "",
          formulaName,
          sourceType,
          summaryHtml: `This value is a fixed implementation constant in the system: <strong class="formula-val">${escapeHtml(shown)}</strong>${represents}. It is not user-editable and does not change per item.`,
          steps: [],
          finalHtml
        };
      }

      if (!formula) {
        return { error: "Calculation details are unavailable." };
      }

      if (sourceType === "formula-flat") {
        const evaluated = evaluateFormula(formula.expression, variables, [formula.code]);
        const value = evaluated.success ? evaluated.result : resultValue;
        const shown = formatExplainNumber(value);
        const extraSteps = [];
        if (opts.coveredArea != null && Number.isFinite(Number(opts.coveredArea))) {
          extraSteps.push(...buildCoveredAreaExplainStep(variables, tagHints, opts.coveredArea, extraSteps.length, opts.finishedGood));
        }
        if (includeGrossQty) {
          extraSteps.push(...buildGrossQtyExplainSteps(
            variables,
            { [formula.code]: value },
            opts.netQty != null ? opts.netQty : value,
            opts.wastagePercent,
            opts.grossQty,
            tagHints,
            extraSteps.length
          ));
        }
        return {
          title,
          subtitle: opts.subtitle || "",
          formulaName,
          sourceType,
          formulaCode: formula.code,
          expression: prettyExpressionText(formula.expression),
          summaryHtml: `This uses the formula <strong>${escapeHtml(formula.name || formula.code)}</strong>, which is fixed at <strong class="formula-val">${escapeHtml(shown)}</strong> — it does not depend on size, GSM, or other inputs.`,
          steps: extraSteps,
          finalHtml
        };
      }

      const styleSnap = opts.finishedGood ? getStyleFormulaMetrics(opts.finishedGood) : null;
      const skipCodes = styleSnap && styleSnap.coveredRow ? new Set(["COVERED_AREA"]) : null;
      const nested = collectNestedFormulas(formula, extraByCode, skipCodes);
      const computed = {};
      const steps = [];
      if (styleSnap && styleSnap.coveredRow && (opts.coveredArea != null || collectNestedFormulas(formula, extraByCode).some((item) => item.code === "COVERED_AREA"))) {
        const styleSteps = buildCoveredAreaExplainStep(variables, tagHints, styleSnap.coveredRow.result, 0, opts.finishedGood);
        styleSteps.forEach((step) => steps.push(step));
        if (styleSnap.coveredRow.success) computed.COVERED_AREA = styleSnap.coveredRow.result;
        styleSnap.rows.forEach((row) => {
          if (row.success && row.code && row.code !== "—") computed[row.code] = row.result;
        });
      }
      nested.forEach((itemFormula) => {
        const evaluated = evaluateFormula(itemFormula.expression, variables, [itemFormula.code]);
        const result = evaluated.success ? evaluated.result : null;
        computed[itemFormula.code] = result;
        const role = styleFormulaHintKind({
          ...itemFormula,
          coveredArea: Boolean(itemFormula.coveredArea),
          serviceLength: Boolean(itemFormula.serviceLength),
          serviceWidth: Boolean(itemFormula.serviceWidth)
        });
        const roleLabel = role === "length" ? "Calculate Length" : role === "width" ? "Calculate Width" : role === "coveredArea" ? "Covered Area" : "";
        steps.push({
          index: steps.length + 1,
          heading: (itemFormula.name || itemFormula.code) + " (" + itemFormula.code + ")" + (roleLabel ? " — " + roleLabel : ""),
          expression: prettyExpressionText(itemFormula.expression),
          pluggedHtml: "= " + expressionToExplainHtml(itemFormula.expression, variables, computed, tagHints) +
            " = <strong class=\"formula-val\">" + escapeHtml(result == null ? (evaluated.error || "Error") : formatExplainNumber(result)) + "</strong>",
          result
        });
      });

      if (opts.coveredArea != null && Number.isFinite(Number(opts.coveredArea)) && !nested.some((item) => item.code === "COVERED_AREA") && !(styleSnap && styleSnap.coveredRow)) {
        steps.push(...buildCoveredAreaExplainStep(variables, tagHints, opts.coveredArea, steps.length, opts.finishedGood));
      }

      if (includeGrossQty) {
        steps.push(...buildGrossQtyExplainSteps(variables, computed, opts.netQty, opts.wastagePercent, opts.grossQty, tagHints, steps.length));
      }

      return {
        title,
        subtitle: opts.subtitle || "",
        formulaName,
        sourceType: "formula",
        summaryHtml: opts.summaryHtml || "",
        steps,
        finalHtml
      };
    }

    function buildCoveredAreaExplainStep(variables, tagHints, coveredArea, startIndex, finishedGood) {
      const styleSnap = finishedGood ? getStyleFormulaMetrics(finishedGood) : null;
      if (styleSnap && styleSnap.coveredRow) {
        const areaFormula = getFormula(styleSnap.coveredRow.formulaId) || getFormulaByCode(styleSnap.coveredRow.code);
        if (areaFormula) {
          const styleVars = { ...buildFlatStyleFormulaVariables(finishedGood) };
          styleSnap.rows.forEach((row) => {
            if (row.success && row.code && row.code !== "—") styleVars[row.code] = row.result;
          });
          const nested = collectNestedFormulas(areaFormula, extraFormulasFromStyleRows(styleSnap.rows));
          const computed = {};
          const steps = [];
          nested.forEach((itemFormula) => {
            const evaluated = evaluateFormula(itemFormula.expression, styleVars, [itemFormula.code], { strictJobDimensions: true });
            const result = evaluated.success ? evaluated.result : null;
            computed[itemFormula.code] = result;
            const role = styleFormulaHintKind({
              ...itemFormula,
              coveredArea: Boolean(itemFormula.coveredArea),
              serviceLength: Boolean(itemFormula.serviceLength),
              serviceWidth: Boolean(itemFormula.serviceWidth)
            });
            const roleLabel = role === "length" ? "Calculate Length" : role === "width" ? "Calculate Width" : role === "coveredArea" ? "Covered Area" : "";
            steps.push({
              index: startIndex + steps.length + 1,
              heading: (itemFormula.name || itemFormula.code) + " (" + itemFormula.code + ")" + (roleLabel ? " — " + roleLabel : ""),
              expression: prettyExpressionText(itemFormula.expression),
              pluggedHtml: "= " + expressionToExplainHtml(itemFormula.expression, styleVars, computed, tagHints) +
                " = <strong class=\"formula-val\">" + escapeHtml(result == null ? (evaluated.error || "Error") : formatExplainNumber(result)) + "</strong>",
              result
            });
          });
          return steps;
        }
      }
      const areaFormula = getFormulaByCode("COVERED_AREA");
      if (!areaFormula || !areaFormula.isActive) {
        return [{
          index: startIndex + 1,
          heading: "Covered Area",
          expression: "Displayed separately from quantity",
          pluggedHtml: `= ${explainTaggedValueHtml(formatExplainNumber(coveredArea), "input")} sq.inch`
        }];
      }
      const nested = collectNestedFormulas(areaFormula);
      const computed = {};
      const steps = [];
      nested.forEach((itemFormula) => {
        const evaluated = evaluateFormula(itemFormula.expression, variables, [itemFormula.code]);
        const result = evaluated.success ? evaluated.result : null;
        computed[itemFormula.code] = result;
        steps.push({
          index: startIndex + steps.length + 1,
          heading: (itemFormula.name || itemFormula.code) + " (" + itemFormula.code + ")",
          expression: prettyExpressionText(itemFormula.expression),
          pluggedHtml: "= " + expressionToExplainHtml(itemFormula.expression, variables, computed, tagHints) +
            " = <strong class=\"formula-val\">" + escapeHtml(result == null ? (evaluated.error || "Error") : formatExplainNumber(result)) + "</strong>",
          result
        });
      });
      return steps;
    }

    function buildFormulaExplainModel_BOMLine(kind, lineId) {
      const fg = getSelectedFinishedGood();
      const isService = kind === "service";
      const isOther = kind === "other-material";
      const line = isService
        ? findBomServiceLineById(lineId)
        : isOther
          ? (state.bomOtherMaterials || []).find((item) => item.id === Number(lineId))
          : state.bomMaterials.find((item) => item.id === Number(lineId));
      if (!line || !fg) {
        return { error: "Calculation details are unavailable." };
      }
      const item = isService
        ? getService(line.serviceId)
        : isOther
          ? getOtherRawMaterial(line.otherRawMaterialId)
          : getRawMaterial(line.rawMaterialId);
      const formula = line.calculationMethod === "formula"
        ? (isService ? getFormula(getServiceDefaultFormulaId(item && item.id)) : (isOther ? getOtherMaterialQtyFormula(item) : getMaterialQtyFormula(item)))
        : null;
      const uom = isService ? (item && item.uom) || "" : (item && item.uom) || "";
      const title = item ? item.name + " — " + item.code : (isService ? "Service" : (isOther ? "Other Material" : "Material"));
      const variables = item
        ? (isService
          ? buildServiceFormulaVariables(fg, item, line.dimensionId, line, formula)
          : isOther
            ? buildOtherMaterialFormulaVariables(fg, item, Number(line.wastagePercent) || 0, line.dimensionId, formula)
            : buildFormulaVariables(fg, item, Number(line.wastagePercent) || 0, line.dimensionId, formula, line))
        : {};
      const isManual = line.calculationMethod === "manual";
      if (!isManual && !formula) {
        return { error: line.error || "A valid formula is required." };
      }
      return buildFormulaExplainCore({
        formula: isManual ? null : formula,
        variables,
        finishedGood: fg,
        extraByCode: extraFormulasFromStyleRows(evaluateStyleFormulasForFinishedGood(fg)),
        netQty: isService ? line.quantity : line.netQty,
        grossQty: line.grossQty,
        wastagePercent: line.wastagePercent,
        manualQty: line.manualQty,
        resultValue: isService ? line.quantity : line.netQty,
        uom,
        title,
        sourceType: isManual ? "manual" : inferExplainSourceType(formula),
        includeGrossQty: !isService,
        tagHints: { WASTAGE: "manual" },
        finalHtml: isService
          ? `Qty: <strong>${escapeHtml(formatQty(line.quantity))} ${escapeHtml(uom)}</strong>`
          : `Net Qty: <strong>${escapeHtml(formatQty(line.netQty))} ${escapeHtml(uom)}</strong> → Gross Qty: <strong>${escapeHtml(formatQty(line.grossQty))} ${escapeHtml(uom)}</strong>`
      });
    }

    function buildFormulaExplainModel_CostCalcMaterial(rowId) {
      const layer = String(rowId || "");
      const fg = getCostCalculatorFinishedGood();
      const layerRow = (state.costCalculator.layers || []).find((row) => row.layer === layer);
      if (!fg || !layerRow || !layerRow.rawMaterialId) {
        return { error: "Calculation details are unavailable." };
      }
      const calc = calculateCostCalculatorMaterial(layerRow);
      const material = getRawMaterial(layerRow.rawMaterialId);
      const formula = getFormula(calc.formulaId);
      if (!formula) {
        return { error: calc.error || "Formula not configured for this material." };
      }
      const uom = calc.uom || (material && material.uom) || "";
      const title = material ? material.name + " — " + material.code : layer;
      const variables = material
        ? buildFormulaVariables(fg, material, Number(calc.wastagePercent) || 0, null, formula)
        : {};
      const coveredInQty = collectNestedFormulas(formula).some((item) => item.code === "COVERED_AREA");
      const finalCovered = Number.isFinite(Number(calc.coveredArea))
        ? `<br>Covered Area: <strong>${escapeHtml(formatQty(calc.coveredArea))} sq.inch</strong> <span class="formula-src">(style formula using this job size)</span>`
        : "";
      return buildFormulaExplainCore({
        formula,
        variables,
        finishedGood: fg,
        extraByCode: extraFormulasFromStyleRows(evaluateStyleFormulasForFinishedGood(fg)),
        netQty: calc.netQty,
        grossQty: calc.grossQty,
        wastagePercent: calc.wastagePercent,
        resultValue: calc.netQty,
        uom,
        title,
        subtitle: layer + " · dimensions typed in Cost Calculator",
        sourceType: inferExplainSourceType(formula),
        includeGrossQty: true,
        tagHints: { L: "manual", W: "manual", H: "manual" },
        coveredArea: coveredInQty ? null : calc.coveredArea,
        finalHtml: `Net Qty: <strong>${escapeHtml(formatQty(calc.netQty))} ${escapeHtml(uom)}</strong> → Gross Qty: <strong>${escapeHtml(formatQty(calc.grossQty))} ${escapeHtml(uom)}</strong>${finalCovered}`
      });
    }

    function buildFormulaExplainModel_CostCalcService(rowId) {
      const fg = getCostCalculatorFinishedGood();
      const finishingRow = findCostCalculatorFinishingServiceLineById(rowId);
      const additionalServiceRow = findCostCalculatorAdditionalServiceById(rowId);
      const row = findCostCalculatorServiceLineById(rowId) || finishingRow || additionalServiceRow;
      if (!fg || !row || !row.serviceId) {
        return { error: "Calculation details are unavailable." };
      }
      const calc = calculateCostCalculatorService(finishingRow ? { ...row, finishing: true } : row);
      const service = getService(row.serviceId);
      const formula = getFormula(calc.formulaId);
      if (!formula) {
        return { error: calc.error || "Formula not configured for this service." };
      }
      const uom = calc.uom || (service && service.uom) || "";
      const title = service ? service.name + " — " + service.code : "Service";
      const variables = service
        ? buildServiceFormulaVariables(fg, service, null, row, formula)
        : {};
      return buildFormulaExplainCore({
        formula,
        variables,
        finishedGood: fg,
        netQty: calc.qty,
        resultValue: calc.qty,
        uom,
        title,
        subtitle: "Dimensions typed in Cost Calculator",
        sourceType: inferExplainSourceType(formula),
        includeGrossQty: false,
        tagHints: { L: "manual", W: "manual", H: "manual" },
        finalHtml: `Qty: <strong>${escapeHtml(formatQty(calc.qty))} ${escapeHtml(uom)}</strong>`
      });
    }

    function buildFormulaExplainModel_StylePerimeter() {
      const fromCalculator = state.currentPage === "cost-calculator";
      const fg = fromCalculator ? getCostCalculatorStyleFinishedGood() : getSelectedFinishedGood();
      if (!fg) {
        return { error: "Calculation details are unavailable." };
      }
      const rows = evaluateStyleFormulasForFinishedGood(fg);
      const perimeter = getStylePerimeterFromFormulaRows(rows);
      if (!perimeter.success) {
        return { error: perimeter.error };
      }
      const lengthText = formatFormulaResult(perimeter.areaLength);
      const widthText = formatFormulaResult(perimeter.areaWidth);
      const resultText = formatFormulaResult(perimeter.result);
      return {
        title: "Perimeter",
        formulaName: "Perimeter",
        sourceType: "formula",
        subtitle: fromCalculator ? "Dimensions typed in Cost Calculator" : "",
        summaryHtml: "Perimeter is always 2 × (Area Length + Area Width). Area Length and Area Width come from the style formulas marked for those values.",
        steps: [{
          index: 1,
          heading: "Perimeter",
          expression: STYLE_PERIMETER_EXPRESSION,
          pluggedHtml: `2 × (${escapeHtml(lengthText)} + ${escapeHtml(widthText)}) = <strong>${escapeHtml(resultText)}</strong>`
        }],
        finalHtml: `Result: <strong>${escapeHtml(resultText)}</strong>`
      };
    }

    function buildFormulaExplainModel_StyleFormula(formulaCode) {
      const fromCalculator = state.currentPage === "cost-calculator";
      const fg = fromCalculator ? getCostCalculatorStyleFinishedGood() : getSelectedFinishedGood();
      if (!fg) {
        return { error: "Calculation details are unavailable." };
      }
      const rows = evaluateStyleFormulasForFinishedGood(fg);
      const row = rows.find((item) => item.code === formulaCode || String(item.formulaId) === String(formulaCode));
      const formula = getFormulaByCode(formulaCode) || (row ? getFormula(row.formulaId) : null);
      if (!formula) {
        return { error: "This style formula is no longer available." };
      }
      const variables = buildStyleFormulaVariables(fg);
      rows.forEach((item) => {
        if (item.success && item.code && item.code !== "—") variables[item.code] = item.result;
      });
      const result = row && row.success ? row.result : null;
      const extraByCode = extraFormulasFromStyleRows(rows);
      const isCovered = isCoveredAreaStyleFormula(row) || Boolean(formula.coveredArea);
      const nestedCount = collectNestedFormulas(formula, extraByCode).length;
      return buildFormulaExplainCore({
        formula,
        variables,
        extraByCode,
        styleRows: rows,
        finishedGood: fg,
        resultValue: result,
        resultDisplay: result == null ? "—" : formatFormulaResult(result),
        uom: "",
        title: (formula.name || formula.code) + " — " + (fg.style || "Style"),
        subtitle: fromCalculator ? "Dimensions typed in Cost Calculator" : "",
        sourceType: isCovered && nestedCount > 1 ? "formula" : inferExplainSourceType(formula, null, extraByCode),
        summaryHtml: isCovered && nestedCount > 1
          ? "Covered Area is built from the formulas below. Dependent formulas such as Calculate Length and Calculate Width are included automatically."
          : "",
        includeGrossQty: false,
        tagHints: fromCalculator ? { L: "manual", W: "manual", H: "manual" } : {},
        resultLabel: "Result",
        finalHtml: `Result: <strong>${escapeHtml(result == null ? (row && row.error ? row.error : "—") : formatFormulaResult(result))}</strong>`
      });
    }

    function buildFormulaExplainModel_CostCalcAdditionalMaterial(rowId) {
      const fg = getCostCalculatorFinishedGood();
      const row = findCostCalculatorAdditionalMaterialById(rowId);
      if (!fg || !row || !row.rawMaterialId) {
        return { error: "Calculation details are unavailable." };
      }
      const calc = calculateCostCalculatorAdditionalMaterial(row);
      const material = getRawMaterial(row.rawMaterialId);
      const formula = row.calculationMethod === "formula" ? getMaterialQtyFormula(material) : getFormula(row.formulaId || calc.formulaId);
      if (!formula && row.calculationMethod !== "manual") {
        return { error: calc.error || "Formula not configured for this material." };
      }
      const uom = calc.uom || (material && material.uom) || "";
      const title = material ? material.name + " — " + material.code : "Additional material";
      const variables = material && formula
        ? buildFormulaVariables(fg, material, Number(calc.wastagePercent) || 0, row.dimensionId, formula, row)
        : {};
      return buildFormulaExplainCore({
        formula: formula || { name: "Manual", code: "MANUAL", expression: "" },
        variables,
        finishedGood: fg,
        netQty: calc.netQty,
        grossQty: calc.grossQty,
        wastagePercent: calc.wastagePercent,
        resultValue: calc.netQty,
        uom,
        title,
        subtitle: "Additional material · dimensions typed in Cost Calculator",
        sourceType: row.calculationMethod === "manual" ? "manual" : inferExplainSourceType(formula),
        includeGrossQty: true,
        tagHints: { L: "manual", W: "manual", H: "manual" },
        finalHtml: `Net Qty: <strong>${escapeHtml(formatQty(calc.netQty))} ${escapeHtml(uom)}</strong> → Gross Qty: <strong>${escapeHtml(formatQty(calc.grossQty))} ${escapeHtml(uom)}</strong>`
      });
    }

    function buildFormulaExplainModel(kind, lineId) {
      if (kind === "cc-material") return buildFormulaExplainModel_CostCalcMaterial(lineId);
      if (kind === "cc-additional-material") return buildFormulaExplainModel_CostCalcAdditionalMaterial(lineId);
      if (kind === "cc-service") return buildFormulaExplainModel_CostCalcService(lineId);
      if (kind === "style") return buildFormulaExplainModel_StyleFormula(lineId);
      if (kind === "style-perimeter") return buildFormulaExplainModel_StylePerimeter();
      return buildFormulaExplainModel_BOMLine(kind, lineId);
    }

    function formulaExplainKicker(model) {
      if (model.sourceType === "manual") return "Manual quantity";
      if (model.sourceType === "hardcoded") return "Fixed implementation constant";
      if (model.sourceType === "formula-flat") return "Formula (fixed value): " + (model.formulaName || "");
      return "Formula: " + (model.formulaName || "");
    }

    function renderFormulaExplainerModal() {
      const model = buildFormulaExplainModel(state.modal.kind, state.modal.lineId);
      if (model.error) {
        return `
          <div class="modal-header">
            <div>
              <div class="section-kicker">Formula</div>
              <strong>How this quantity was calculated</strong>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" data-modal-close aria-label="Close">X</button>
          </div>
          <div class="modal-body"><p>${escapeHtml(model.error)}</p></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-modal-close>Got it</button>
          </div>
        `;
      }
      const steps = Array.isArray(model.steps) ? model.steps : [];
      const stepsHtml = steps.map((step) => `
        <li class="formula-explain-step">
          <div class="formula-explain-step-title">Step ${step.index}: ${escapeHtml(step.heading)}</div>
          <div class="formula-explain-expr">${escapeHtml(step.expression)}</div>
          <div class="formula-explain-plug">${step.pluggedHtml}</div>
        </li>
      `).join("");
      const showLegend = model.sourceType === "formula" || steps.length > 0;
      const flatMeta = model.sourceType === "formula-flat" && (model.formulaCode || model.expression)
        ? `<div class="formula-explain-step">
            <div class="formula-explain-step-title">${escapeHtml(model.formulaCode || model.formulaName || "Formula")}</div>
            <div class="formula-explain-expr">${escapeHtml(model.expression || "—")}</div>
          </div>`
        : "";
      return `
        <div class="modal-header">
          <div>
            <strong>${escapeHtml(model.title)}</strong>
            <div class="section-kicker" style="margin-top:4px;">${escapeHtml(formulaExplainKicker(model))}</div>
            ${model.subtitle ? `<div class="stat-hint" style="margin-top:4px;">${escapeHtml(model.subtitle)}</div>` : ""}
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close aria-label="Close">X</button>
        </div>
        <div class="modal-body">
          ${showLegend ? `<p class="stat-hint formula-explain-legend">Each number is tagged as formula input, manual entry, or fixed implementation constant.</p>` : ""}
          ${model.summaryHtml ? `<p class="formula-explain-note">${model.summaryHtml}</p>` : ""}
          ${flatMeta}
          ${steps.length ? `<ol class="formula-explain-steps">${stepsHtml}</ol>` : ""}
          <div class="formula-explain-final">${model.finalHtml}</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-modal-close>Got it</button>
        </div>
      `;
    }

    function formulaHelpButton(kind, id, ariaLabel) {
      return `<button type="button" class="formula-help-btn" data-explain-kind="${escapeHtml(String(kind))}" data-explain-line="${escapeHtml(String(id))}" title="How this value was calculated" aria-label="${escapeHtml(ariaLabel || "Explain value")}">?</button>`;
    }

    function openFormulaExplainerModal(kind, lineId) {
      const allowed = ["material", "other-material", "service", "cc-material", "cc-additional-material", "cc-service", "style", "style-perimeter"];
      const resolved = allowed.includes(kind) ? kind : "material";
      const numericId = resolved === "material" || resolved === "other-material" || resolved === "service" || resolved === "cc-service" || resolved === "cc-additional-material";
      state.modal = {
        type: "formula-explainer",
        kind: resolved,
        selectedId: null,
        mode: "view",
        lineId: numericId ? Number(lineId) : lineId,
        draft: null,
        errors: {}
      };
      renderModal();
    }

    function getPreviewDimensionContext(dimensionId) {
      const finishedGood = getSelectedFinishedGood();
      const dim = getDimension(dimensionId);
      if (dim) {
        return {
          source: "selected",
          label: formatDimensionChipLabel(dim),
          name: dim.name || dim.code || "",
          L: Number(dim.L),
          W: Number(dim.W),
          H: Number(dim.H),
          uom: dim.uom || dim.unit || (finishedGood && finishedGood.dimensionUOM) || ""
        };
      }
      if (finishedGood?.dimensions) {
        const dims = getItemDimensions(finishedGood);
        return {
          source: "fg",
          label: formatDimensions(finishedGood),
          L: Number(dims.L),
          W: Number(dims.W),
          H: Number(dims.H),
          uom: finishedGood?.dimensionUOM || ""
        };
      }
      return null;
    }

    function formatPreviewDimension(ctx) {
      if (!ctx) {
        return { size: "—", detail: "Select a dimension to use L, W, and H in the formula.", printArea: "—" };
      }
      const fromMeasures = [ctx.L, ctx.W, ctx.H].map((n) => formatDecimal(n, 2, false)).join("x");
      const name = String(ctx.name || fromMeasures).trim() || fromMeasures;
      const titled = ctx.uom ? name + " (" + ctx.uom + ")" : name;
      const area = Number(ctx.L) * Number(ctx.W);
      return {
        size: titled,
        detail: "L=" + formatDecimal(ctx.L, 2, false) + ", W=" + formatDecimal(ctx.W, 2, false) + ", H=" + formatDecimal(ctx.H, 2, false),
        printArea: Number.isFinite(area)
          ? formatDecimal(area, 2, false) + " " + squaredDimensionUnit(ctx.uom)
          : "—"
      };
    }

    function renderManualQtyAndRateFields(qtyId, rateId, draft, errors, qtyLabel) {
      return `
        <div class="form-grid two">
          <div>
            <label class="form-label" for="${qtyId}">${escapeHtml(qtyLabel)}</label>
            <input id="${qtyId}" class="full-search ${errors.manualQty ? "input-invalid" : ""}" type="number" min="0.0001" step="0.0001" value="${draft.manualQty == null || draft.manualQty === "" ? "" : escapeHtml(formatDecimal(draft.manualQty, 4, false))}" aria-invalid="${errors.manualQty ? "true" : "false"}" />
            ${errors.manualQty ? `<div class="field-error">${escapeHtml(errors.manualQty)}</div>` : ""}
          </div>
          <div>
            <label class="form-label" for="${rateId}">Rate</label>
            <input id="${rateId}" class="full-search ${errors.manualRate ? "input-invalid" : ""}" type="number" min="0.01" max="999999.99" step="0.01" value="${draft.manualRate == null || draft.manualRate === "" ? "" : escapeHtml(formatDecimal(draft.manualRate, 2, false))}" aria-invalid="${errors.manualRate ? "true" : "false"}" />
            ${errors.manualRate ? `<div class="field-error">${escapeHtml(errors.manualRate)}</div>` : ""}
          </div>
        </div>
      `;
    }

    function renderPreviewField(label, valueHtml, valueClass) {
      return `
        <div class="preview-field">
          <div class="preview-label">${escapeHtml(label)}</div>
          <div class="preview-value${valueClass ? " " + valueClass : ""}">${valueHtml}</div>
        </div>
      `;
    }

    function calculatePreviewCost(kind, draft) {
      if (kind === "material") {
        const item = getRawMaterial(draft && draft.rawMaterialId);
        if (!item) return { kind, ready: false, item: null, preview: null, error: null };
        const preview = calculateMaterialCost({
          id: (state.modal && state.modal.lineId) || 0,
          rawMaterialId: draft.rawMaterialId,
          layer: draft.layer,
          calculationMethod: draft.calculationMethod,
          formulaId: draft.formulaId,
          dimensionId: draft.dimensionId,
          manualQty: draft.manualQty,
          manualRate: storedManualRateFromDraft(draft),
          wastagePercent: draft.wastagePercent,
          ...customDimensionFields(draft),
          netQty: 0,
          grossQty: 0,
          rate: 0,
          costPerPiece: 0
        }, getMaterialModalCalcContext());
        return { kind, ready: true, item, preview, error: preview.error || null };
      }
      if (kind === "other-material") {
        const item = getOtherRawMaterial(draft && draft.otherRawMaterialId);
        if (!item) return { kind, ready: false, item: null, preview: null, error: null };
        const preview = calculateOtherMaterialCost({
          id: (state.modal && state.modal.lineId) || 0,
          otherRawMaterialId: draft.otherRawMaterialId,
          layer: draft.layer,
          calculationMethod: draft.calculationMethod,
          formulaId: draft.formulaId,
          dimensionId: draft.dimensionId,
          manualQty: draft.manualQty,
          manualRate: storedManualRateFromDraft(draft),
          wastagePercent: draft.wastagePercent,
          netQty: 0,
          grossQty: 0,
          rate: 0,
          costPerPiece: 0
        });
        return { kind, ready: true, item, preview, error: preview.error || null };
      }
      const item = getService(draft && draft.serviceId);
      if (!item) return { kind: "service", ready: false, item: null, preview: null, error: null };
      const preview = calculateServiceCost({
        id: (state.modal && state.modal.lineId) || 0,
        serviceId: draft.serviceId,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.formulaId,
        dimensionId: draft.dimensionId,
        manualQty: draft.manualQty,
        manualRate: storedManualRateFromDraft(draft),
        ...customDimensionFields(draft),
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      }, getServiceModalCalcContext());
      return { kind: "service", ready: true, item, preview, error: preview.error || null };
    }

    function formatPreviewData(kind, draft) {
      const finishedGood = kind === "service"
        ? getServiceModalFinishedGood()
        : (kind === "material" ? getMaterialModalFinishedGood() : getSelectedFinishedGood());
      const cost = calculatePreviewCost(kind, draft);
      const formula = draft && draft.calculationMethod === "formula" ? getFormula(draft.formulaId) : null;
      const dimension = getPreviewDimensionContext(draft && draft.dimensionId);
      const dimensionText = formatPreviewDimension(dimension);
      let variables = {};
      if (kind === "material" && cost.item && finishedGood) {
        variables = buildFormulaVariables(finishedGood, cost.item, Number(draft.wastagePercent) || 0, draft.dimensionId, formula, draft);
      } else if (kind === "other-material" && cost.item && finishedGood) {
        variables = buildOtherMaterialFormulaVariables(finishedGood, cost.item, Number(draft.wastagePercent) || 0, draft.dimensionId, formula);
      } else if (kind === "service" && cost.item && finishedGood) {
        variables = buildServiceFormulaVariables(finishedGood, cost.item, draft.dimensionId, draft, formula);
      }
      const extraCodes = kind === "material" || kind === "other-material"
        ? ["WASTAGE"]
        : (variables.PRINT_AREA != null ? ["PRINT_AREA"] : []);
      return {
        ...cost,
        draft,
        formula,
        dimension,
        dimensionText,
        breakdown: getFormulaBreakdown(formula, variables, extraCodes),
        variables
      };
    }

    function refreshBomLinePreview() {
      const root = document.getElementById("bom-line-preview");
      if (!root || !state.modal || !state.modal.draft) return;
      if (state.modal.type === "material") root.innerHTML = renderMaterialModalRight();
      else if (state.modal.type === "other-material") root.innerHTML = renderOtherMaterialModalRight();
      else if (state.modal.type === "service") root.innerHTML = renderServiceModalRight();
    }

    function renderBomLineModalShell(title, leftHtml, rightHtml, kicker) {
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">${escapeHtml(kicker || "BOM line")}</div>
            <strong>${escapeHtml(title)}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body bom-line-body">
          <div class="modal-content">
            <div class="modal-left">${leftHtml}</div>
            <aside id="bom-line-preview" class="modal-right" aria-live="polite" aria-label="Live cost preview">${rightHtml}</aside>
          </div>
        </div>
      `;
    }

    function renderMaterialModalLeft() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const fg = getSelectedFinishedGood();
      const ply = getFinishedGoodPly(fg);
      const slotLocked = Boolean(state.modal.slotLocked);
      const fromAdditional = Boolean(state.modal.fromAdditional);
      const material = getRawMaterial(draft.rawMaterialId);
      const formula = draft.calculationMethod === "formula" ? getMaterialQtyFormula(material) : getFormula(draft.formulaId);
      const materialOptions = slotLocked
        ? getBomSlotMaterialOptions(ply, draft.rawMaterialId)
        : (fromAdditional
          ? getBomAdditionalMaterialOptions(draft.rawMaterialId)
          : getBomExtraMaterialOptions(draft.rawMaterialId));
      return `
        <section aria-label="Material selection and inputs">
          <div class="form-grid">
            ${slotLocked ? `
              <div>
                <div class="field-label">Layer</div>
                <div class="field-value">${escapeHtml(draft.layer || "—")}</div>
              </div>
              <div>
                <div class="field-label">Raw Material</div>
                <div class="field-value">${escapeHtml(material ? material.code + " — " + material.name : "Select a material on the slot card")}</div>
                <p class="stat-hint">Change the material from the ply slot dropdown. This dialog edits calculation details only.</p>
              </div>
            ` : `
              <div>
                <label class="form-label" for="modal-material-select">${fromAdditional ? "Material" : "Raw Material"}</label>
                <select id="modal-material-select" class="full-select ${errors.rawMaterialId ? "input-invalid" : ""}" aria-invalid="${errors.rawMaterialId ? "true" : "false"}">
                  <option value="">${fromAdditional ? "Select a material..." : "Select a raw material..."}</option>
                  ${materialOptions.map((item) => `
                    <option value="${item.id}" ${Number(draft.rawMaterialId) === item.id ? "selected" : ""}>
                      ${escapeHtml(item.code)} — ${escapeHtml(item.name)}
                    </option>
                  `).join("")}
                </select>
                ${errors.rawMaterialId ? `<div class="field-error">${escapeHtml(errors.rawMaterialId)}</div>` : (fromAdditional ? `<p class="stat-hint" style="margin-top:6px;">Showing Consumable materials from Raw Material Master.</p>` : "")}
              </div>
              ${fromAdditional ? "" : `
              <div>
                <label class="form-label" for="modal-layer-select">Layer</label>
                <select id="modal-layer-select" class="full-select ${errors.layer ? "input-invalid" : ""}" aria-invalid="${errors.layer ? "true" : "false"}">
                  ${getLayerOptionsForEditor(draft.layer).map((layer) => `<option value="${escapeHtml(layer)}" ${draft.layer === layer ? "selected" : ""}>${escapeHtml(layer)}</option>`).join("")}
                </select>
                ${errors.layer ? `<div class="field-error">${escapeHtml(errors.layer)}</div>` : ""}
              </div>
              `}
            `}
            <div>
              <label class="form-label" for="modal-method-select">Calculation Method</label>
              <select id="modal-method-select" class="full-select">
                <option value="formula" ${draft.calculationMethod === "formula" ? "selected" : ""}>Formula</option>
                <option value="manual" ${draft.calculationMethod === "manual" ? "selected" : ""}>Manual</option>
              </select>
            </div>
            ${draft.calculationMethod === "formula" ? `
              ${renderUseCustomDimensionBlock(draft, errors, {
                checkId: "modal-material-use-custom-dim",
                lengthId: "modal-material-custom-length",
                widthId: "modal-material-custom-width"
              })}
              <div>
                <div class="field-label">Quantity Formula</div>
                <div class="field-value">${formula ? escapeHtml(formula.name) + " (" + escapeHtml(formula.code) + ")" : "—"}</div>
                ${formula ? `<p class="stat-hint mono" style="margin-top:8px;">${escapeHtml(formula.expression)}</p>` : ""}
              </div>
            ` : renderManualQtyAndRateFields("modal-manual-qty", "modal-manual-rate", draft, errors, "Manual quantity")}
            <div>
              <label class="form-label" for="modal-wastage">Wastage % <span class="stat-hint">(Optional)</span></label>
              <input id="modal-wastage" class="full-search ${errors.wastagePercent ? "input-invalid" : ""}" type="number" min="0" max="100" step="0.01" value="${draft.wastagePercent == null || draft.wastagePercent === "" ? "" : escapeHtml(formatDecimal(draft.wastagePercent, 2, false))}" placeholder="0" aria-invalid="${errors.wastagePercent ? "true" : "false"}" />
              ${errors.wastagePercent ? `<div class="field-error">${escapeHtml(errors.wastagePercent)}</div>` : ""}
            </div>
          </div>
          ${errors.formulaId ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.formulaId)}</div>` : ""}
          ${errors.formula ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.formula)}</div>` : ""}
          ${errors.rate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.rate)}</div>` : ""}
          ${errors.duplicate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.duplicate)}</div>` : ""}
          ${errors.finishedGood ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.finishedGood)}</div>` : ""}
        </section>
        <div class="modal-left-actions">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-material">Save</button>
        </div>
      `;
    }

    function renderMaterialModalRight() {
      const data = formatPreviewData("material", state.modal.draft);
      if (!data.ready) {
        return `<p class="preview-empty">${state.modal.fromAdditional ? "Select a material to see live quantity, formula variables, and cost." : "Select a raw material to see live quantity, formula variables, and cost."}</p>`;
      }
      const material = data.item;
      const preview = data.preview;
      const formula = data.formula;
      const wastage = Number(state.modal.draft.wastagePercent);
      const factor = Number.isFinite(wastage) ? 1 + wastage / 100 : null;
      const varsHtml = data.breakdown.variables.length
        ? `<div class="preview-vars" aria-label="Formula variables">
            ${data.breakdown.variables.map((row) => `
              <div class="preview-var">
                <span class="mono">${escapeHtml(row.code)}</span>
                <strong>${escapeHtml(row.display)}</strong>
              </div>
            `).join("")}
          </div>`
        : `<p class="stat-hint" style="margin-top:8px;">No formula variables to display.</p>`;
      return `
        <section class="preview-section" aria-label="Material details">
          <h3 class="preview-heading">Material details</h3>
          ${renderPreviewField("Code", `<span class="mono">${escapeHtml(material.code)}</span>`)}
          ${renderPreviewField("Name", escapeHtml(material.name))}
          ${renderPreviewField("UOM", escapeHtml(material.uom))}
          ${renderPreviewField("Rate", escapeHtml(formatRatePkr(getMaterialRate(material.id)?.rate, getMaterialRate(material.id)?.rateUOM)))}
        </section>
        ${renderPreviewCustomDimSection(state.modal.draft)}
        <section class="preview-section" aria-label="Formula and calculation">
          <h3 class="preview-heading">Formula &amp; calculation</h3>
          ${renderPreviewField(
            "Formula",
            state.modal.draft.calculationMethod === "manual"
              ? "Manual quantity"
              : (formula ? `<span class="mono">${escapeHtml(formula.code)}</span>` : "—")
          )}
          ${state.modal.draft.calculationMethod === "formula" ? `
            <div class="preview-field preview-field-stack">
              <div class="preview-label">Variables</div>
              ${varsHtml}
            </div>
          ` : ""}
          ${preview && !preview.error ? `
            ${renderPreviewField("Calculated qty", escapeHtml(formatQty(preview.netQty) + " " + material.uom))}
            ${renderPreviewField(
              "Gross qty (with wastage)",
              escapeHtml(
                Number.isFinite(preview.netQty) && Number.isFinite(preview.grossQty) && factor != null
                  ? formatQty(preview.netQty) + " × " + formatDecimal(factor, 4, false) + " = " + formatQty(preview.grossQty) + " " + material.uom
                  : formatQty(preview.grossQty) + " " + material.uom
              )
            )}
          ` : `<p class="preview-error">${escapeHtml((preview && preview.error) || "Quantity cannot be calculated yet.")}</p>`}
        </section>
        <section class="preview-section" aria-label="Cost summary">
          <h3 class="preview-heading">Cost summary</h3>
          ${renderPreviewField("Material", escapeHtml(material.name))}
          ${renderPreviewField("Layer", escapeHtml(state.modal.draft.layer || "—"))}
          ${preview && !preview.error ? `
            ${renderPreviewField("Gross qty", escapeHtml(formatQty(preview.grossQty) + " " + material.uom))}
            ${renderPreviewField("Rate", escapeHtml(formatRatePkr(preview.rate, getMaterialRate(material.id)?.rateUOM)))}
            ${renderPreviewField("Net cost", escapeHtml(formatCurrency(preview.costPerPiece)) + ' <span class="stat-hint">(per 1 piece)</span>')}
            <div class="summary-highlight">
              <div class="preview-label">Total</div>
              <div class="preview-value cost-display">${escapeHtml(formatCurrency(preview.costPerPiece))}</div>
            </div>
          ` : `<p class="preview-error">${escapeHtml((preview && preview.error) || "Cost cannot be calculated yet.")}</p>`}
        </section>
      `;
    }

    function renderMaterialFormModal() {
      const fromAdditional = Boolean(state.modal.fromAdditional);
      const title = fromAdditional
        ? (state.modal.mode === "edit" ? "Edit Material" : "Add Material")
        : (state.modal.mode === "edit" ? "Edit Raw Material" : "Add Raw Material");
      return renderBomLineModalShell(
        title,
        renderMaterialModalLeft(),
        renderMaterialModalRight(),
        isCostCalculatorAdditionalModal() ? "Cost Calculator" : "BOM line"
      );
    }

    function renderOtherMaterialModalLeft() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const fg = getSelectedFinishedGood();
      const ply = getFinishedGoodPly(fg);
      const slotLocked = Boolean(state.modal.slotLocked);
      const material = getOtherRawMaterial(draft.otherRawMaterialId);
      const formula = draft.calculationMethod === "formula" ? getOtherMaterialQtyFormula(material) : getFormula(draft.formulaId);
      const dimMeta = describeOtherMaterialDimensionSelect(material);
      const materialOptions = slotLocked
        ? getBomOtherSlotMaterialOptions(ply, draft.otherRawMaterialId)
        : getBomOtherExtraMaterialOptions(draft.otherRawMaterialId);
      return `
        <section aria-label="Other material selection and inputs">
          <div class="form-grid">
            ${slotLocked ? `
              <div>
                <div class="field-label">Layer</div>
                <div class="field-value">${escapeHtml(draft.layer || "—")}</div>
              </div>
              <div>
                <div class="field-label">Other Raw Material</div>
                <div class="field-value">${escapeHtml(material ? material.code + " — " + material.name : "Select a material on the slot card")}</div>
              </div>
            ` : `
              <div>
                <label class="form-label" for="modal-other-material-select">Other Raw Material</label>
                <select id="modal-other-material-select" class="full-select ${errors.otherRawMaterialId ? "input-invalid" : ""}">
                  <option value="">Select an other raw material...</option>
                  ${materialOptions.map((item) => `
                    <option value="${item.id}" ${Number(draft.otherRawMaterialId) === item.id ? "selected" : ""}>
                      ${escapeHtml(item.code)} — ${escapeHtml(item.name)}
                    </option>
                  `).join("")}
                </select>
                ${errors.otherRawMaterialId ? `<div class="field-error">${escapeHtml(errors.otherRawMaterialId)}</div>` : ""}
              </div>
              <div>
                <label class="form-label" for="modal-other-layer-select">Layer</label>
                <select id="modal-other-layer-select" class="full-select ${errors.layer ? "input-invalid" : ""}">
                  ${getLayerOptionsForEditor(draft.layer).map((layer) => `<option value="${escapeHtml(layer)}" ${draft.layer === layer ? "selected" : ""}>${escapeHtml(layer)}</option>`).join("")}
                </select>
                ${errors.layer ? `<div class="field-error">${escapeHtml(errors.layer)}</div>` : ""}
              </div>
            `}
            <div>
              <label class="form-label" for="modal-other-method-select">Calculation Method</label>
              <select id="modal-other-method-select" class="full-select">
                <option value="formula" ${draft.calculationMethod === "formula" ? "selected" : ""}>Formula</option>
                <option value="manual" ${draft.calculationMethod === "manual" ? "selected" : ""}>Manual</option>
              </select>
            </div>
            ${draft.calculationMethod === "formula" ? `
              ${renderBomDimensionSelect(
                dimMeta.linkedIds,
                draft.dimensionId,
                "modal-other-line-dimension",
                errors.dimensionId,
                dimMeta.hint,
                { emptyLabel: dimMeta.emptyLabel, disabled: !material, lockedLabel: "Select a material first" }
              )}
              <div>
                <div class="field-label">Quantity Formula</div>
                <div class="field-value">${formula ? escapeHtml(formula.name) + " (" + escapeHtml(formula.code) + ")" : "—"}</div>
              </div>
            ` : renderManualQtyAndRateFields("modal-other-manual-qty", "modal-other-manual-rate", draft, errors, "Manual quantity")}
            <div>
              <label class="form-label" for="modal-other-wastage">Wastage %</label>
              <input id="modal-other-wastage" class="full-search ${errors.wastagePercent ? "input-invalid" : ""}" type="number" min="0" max="100" step="0.01" value="${escapeHtml(formatDecimal(draft.wastagePercent, 2, false))}" />
              ${errors.wastagePercent ? `<div class="field-error">${escapeHtml(errors.wastagePercent)}</div>` : ""}
            </div>
          </div>
          ${errors.formulaId ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.formulaId)}</div>` : ""}
          ${errors.formula ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.formula)}</div>` : ""}
          ${errors.rate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.rate)}</div>` : ""}
        </section>
        <div class="modal-left-actions">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-other-material">Save</button>
        </div>
      `;
    }

    function renderOtherMaterialModalRight() {
      const data = formatPreviewData("other-material", state.modal.draft);
      if (!data.ready) {
        return `<p class="preview-empty">Select an other raw material to see live quantity, formula variables, and cost.</p>`;
      }
      const material = data.item;
      const preview = data.preview;
      const formula = data.formula;
      return `
        <section class="preview-section">
          <h3 class="preview-heading">Other material details</h3>
          ${renderPreviewField("Code", `<span class="mono">${escapeHtml(material.code)}</span>`)}
          ${renderPreviewField("Name", escapeHtml(material.name))}
          ${renderPreviewField("Rate", escapeHtml(formatRatePkr(getOtherMaterialRate(material.id)?.rate, getOtherMaterialRate(material.id)?.rateUOM)))}
        </section>
        <section class="preview-section">
          <h3 class="preview-heading">Cost summary</h3>
          ${preview && !preview.error
            ? `${renderPreviewField("Gross qty", escapeHtml(formatQty(preview.grossQty) + " " + (material.uom || "")))}
               ${renderPreviewField("Cost / Piece", escapeHtml(formatCurrency(preview.costPerPiece)))}`
            : `<p class="preview-error">${escapeHtml((preview && preview.error) || "Cost cannot be calculated yet.")}</p>`}
        </section>
      `;
    }

    function renderOtherMaterialFormModal() {
      return renderBomLineModalShell("Edit Other Raw Material", renderOtherMaterialModalLeft(), renderOtherMaterialModalRight());
    }

    function renderBreakdownModal() {
      const stored = state.bomMaterials.find((item) => item.id === state.modal.lineId)
        || findCostCalculatorAdditionalMaterialById(state.modal.lineId);
      const fromCalculator = Boolean(findCostCalculatorAdditionalMaterialById(state.modal.lineId));
      const fg = fromCalculator ? getCostCalculatorFinishedGood() : getSelectedFinishedGood();
      if (!stored || !fg) {
        return `<div class="modal-body"><p>Calculation details are unavailable.</p></div>`;
      }
      const line = fromCalculator
        ? calculateMaterialCost({ ...stored }, { finishedGood: fg, useEnteredDimensions: true })
        : stored;
      const material = getRawMaterial(line.rawMaterialId);
      const formula = line.calculationMethod === "formula" ? getMaterialQtyFormula(material) : getFormula(line.formulaId);
      const variables = material ? buildFormulaVariables(fg, material, line.wastagePercent, line.dimensionId, formula, line) : {};
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
            <div><span>Finished Good</span><strong>${escapeHtml(fg?.product ?? "missing data")} — ${escapeHtml(fg?.variant ?? "")}</strong></div>
            <div><span>Dimensions</span><strong>L = ${escapeHtml(formatDecimal(fg?.dimensions?.L, 2, false))} &nbsp; W = ${escapeHtml(formatDecimal(fg?.dimensions?.W, 2, false))} &nbsp; H = ${escapeHtml(formatDecimal(fg?.dimensions?.H, 2, false))}</strong></div>
            <div><span>GSM</span><strong>${material && material.gsm != null ? escapeHtml(formatDecimal(material.gsm, 1, false)) : "—"}</strong></div>
            <div><span>Quantity Formula</span><strong>${line.calculationMethod === "formula" && formula ? escapeHtml(formula.code) : "Manual"}</strong></div>
            <div><span>Quantity Expression</span><strong class="mono">${line.calculationMethod === "formula" && formula ? escapeHtml(formula.expression) : "—"}</strong></div>
            <div><span>Net Quantity</span><strong>${formatQty(line.netQty)} ${escapeHtml(material ? material.uom : "")}</strong></div>
            <div><span>Wastage</span><strong>${escapeHtml(formatDecimal(line.wastagePercent, 2, false))}%</strong></div>
            <div><span>Gross Quantity</span><strong>${formatQty(line.grossQty)} ${escapeHtml(material ? material.uom : "")}</strong></div>
            <div><span>Qty at rate UOM</span><strong>${formatQty(line.qtyForRate)} ${escapeHtml(material ? formatRateUnit(getMaterialRate(material.id)?.rateUOM) : "")}</strong></div>
            <div><span>Purchasing Rate</span><strong>${material ? formatRatePkr(getMaterialRate(material.id)?.rate, getMaterialRate(material.id)?.rateUOM) : "—"}</strong></div>
            <div><span>Applied Rate</span><strong>${formatRatePkr(line.rate, getMaterialRate(material && material.id)?.rateUOM || "")} (${line.rateSource === "manual" ? "manual" : "master"})</strong></div>
            ${material && normalizeUnit(material.uom) !== normalizeUnit(getMaterialRate(material.id)?.rateUOM)
              ? `<div><span>Equivalent rate in ${escapeHtml(material.uom)}</span><strong>${(() => {
                  try {
                    const rateRow = getMaterialRate(material.id);
                    return formatRatePkr(convertRate(rateRow?.rate, rateRow?.rateUOM, material?.uom, material?.gsm), material?.uom);
                  } catch (error) {
                    return escapeHtml(error.message || "Unsupported unit conversion");
                  }
                })()}</strong></div>`
              : ""}
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
            <p>${isCostCalculatorAdditionalModal() || findCostCalculatorAdditionalMaterialById(state.modal && state.modal.lineId) ? "Remove this material from the Cost Calculator?" : "Remove this raw material from the BOM?"}</p>
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

      dialog.classList.toggle("wide", state.modal.type === "formula-builder" || state.modal.type === "formula-test" || (state.modal.type === "style-master" && state.modal.mode === "edit") || (state.modal.type === "service-master" && state.modal.mode === "edit") || (state.modal.type === "raw-material-master" && state.modal.mode === "edit") || (state.modal.type === "other-raw-material-master" && state.modal.mode === "edit"));
      dialog.classList.toggle("wide-form", state.modal.type === "finished-good" || state.modal.type === "finishing-service" || state.modal.type === "formula-variable" || state.modal.type === "raw-material-master" || state.modal.type === "other-raw-material-master" || state.modal.type === "service-master" || state.modal.type === "service-rate" || state.modal.type === "material-rate" || state.modal.type === "other-material-rate" || (state.modal.type === "style-master" && state.modal.mode === "add"));
      dialog.classList.toggle("formula-explainer", state.modal.type === "formula-explainer");
      dialog.classList.toggle("split-form", state.modal.type === "material" || state.modal.type === "other-material" || state.modal.type === "service");

      if (state.modal.type === "finished-good" || state.modal.type === "finishing-service") {
        dialog.innerHTML = renderFinishedGoodFormModal();
      } else if (state.modal.type === "raw-material-master" && state.modal.sub && state.modal.sub.type === "material-dimension") {
        dialog.innerHTML = renderMaterialDimensionLinkModal();
      } else if (state.modal.type === "raw-material-master") {
        dialog.innerHTML = renderRawMaterialFormModal();
      } else if (state.modal.type === "material-rate") {
        dialog.innerHTML = renderMaterialRateFormModal();
      } else if (state.modal.type === "other-raw-material-master" && state.modal.sub && state.modal.sub.type === "other-material-dimension") {
        dialog.innerHTML = renderOtherMaterialDimensionLinkModal();
      } else if (state.modal.type === "other-raw-material-master") {
        dialog.innerHTML = renderOtherRawMaterialFormModal();
      } else if (state.modal.type === "other-material-rate") {
        dialog.innerHTML = renderOtherMaterialRateFormModal();
      } else if (state.modal.type === "service-master" && state.modal.sub && state.modal.sub.type === "service-dimension") {
        dialog.innerHTML = renderServiceDimensionLinkModal();
      } else if (state.modal.type === "service-master") {
        dialog.innerHTML = renderServiceMasterFormModal();
      } else if (state.modal.type === "service-rate") {
        dialog.innerHTML = renderServiceRateFormModal();
      } else if (state.modal.type === "style-master" && state.modal.sub && state.modal.sub.type === "style-variable") {
        dialog.innerHTML = renderStyleVariableFormModal();
      } else if (state.modal.type === "style-master") {
        dialog.innerHTML = renderStyleFormModal();
      } else if (state.modal.type === "dimension-master") {
        dialog.innerHTML = renderDimensionFormModal();
      } else if (state.modal.type === "formula-variable") {
        dialog.innerHTML = renderFormulaVariableFormModal();
      } else if (state.modal.type === "fixed-variable") {
        dialog.innerHTML = renderFixedVariableFormModal();
      } else if (state.modal.type === "confirm-delete-master") {
        dialog.innerHTML = renderMasterDeleteModal();
      } else if (state.modal.type === "material") {
        dialog.innerHTML = renderMaterialFormModal();
      } else if (state.modal.type === "other-material") {
        dialog.innerHTML = renderOtherMaterialFormModal();
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
      } else if (state.modal.type === "formula-explainer") {
        dialog.innerHTML = renderFormulaExplainerModal();
      } else if (state.modal.type === "confirm-delete") {
        dialog.innerHTML = renderConfirmDeleteModal();
      } else if (state.modal.type === "confirm-delete-other") {
        dialog.innerHTML = `
          <div class="modal-header">
            <div>
              <div class="section-kicker">BOM line</div>
              <strong>Remove other raw material</strong>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
          </div>
          <div class="modal-body">
            <p>Remove this other raw material from the BOM?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" data-modal-close>Cancel</button>
            <button type="button" class="btn btn-primary" id="btn-confirm-delete-other">Remove</button>
          </div>
        `;
      } else if (state.modal.type === "other-breakdown") {
        dialog.innerHTML = renderOtherBreakdownModal();
      } else if (state.modal.type === "service") {
        dialog.innerHTML = renderServiceFormModal();
      } else if (state.modal.type === "service-breakdown") {
        dialog.innerHTML = renderServiceBreakdownModal();
      } else if (state.modal.type === "confirm-delete-service") {
        const finishing = isFinishingServiceCollection(state.modal.collection);
        const fromCalculator = state.modal.collection === "cost-calculator" || state.modal.collection === "cc-finishing" || state.modal.collection === "cc-additional-service";
        dialog.innerHTML = `
          <div class="modal-header">
            <div>
              <div class="section-kicker">Confirm</div>
              <strong>${finishing ? "Remove finishing service" : "Remove service"}</strong>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
          </div>
          <div class="modal-body">
            <p>${finishing
              ? (fromCalculator ? "Remove this finishing service from the Cost Calculator?" : "Remove this finishing service from the BOM?")
              : (fromCalculator ? "Remove this service from the Cost Calculator?" : "Remove this service from the BOM?")}</p>
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

    function openAddAdditionalMaterialModal() {
      const fromCalculator = state.currentPage === "cost-calculator";
      if (fromCalculator) {
        if (!getCostCalculatorStepState().hasPly) return;
      } else if (!getSelectedFinishedGood()) {
        return;
      }
      if (!getBomAdditionalMaterialOptions().length) {
        showNotification("No Consumable raw materials found. Mark a material as Consumable in Raw Material Master first.", "error");
        if (!fromCalculator) refreshBomViews();
        return;
      }
      const draft = defaultMaterialDraft(null);
      draft.layer = "Additional";
      state.modal = {
        type: "material",
        collection: fromCalculator ? "cc-additional" : null,
        selectedId: null,
        mode: "add",
        lineId: null,
        slotLocked: false,
        fromAdditional: true,
        draft,
        errors: {}
      };
      renderModal();
    }

    function openMaterialModal(lineId) {
      const ccLine = findCostCalculatorAdditionalMaterialById(lineId);
      if (ccLine) {
        const draft = defaultMaterialDraft(ccLine);
        if (draft.rawMaterialId) applyMaterialFormulaBindings(draft);
        state.modal = {
          type: "material",
          collection: "cc-additional",
          selectedId: ccLine.rawMaterialId,
          mode: "edit",
          lineId: Number(ccLine.id || ccLine.key),
          slotLocked: false,
          fromAdditional: true,
          draft,
          errors: {}
        };
        renderModal();
        return;
      }
      if (!getSelectedFinishedGood() || !lineId) return;
      const line = state.bomMaterials.find((item) => item.id === Number(lineId));
      if (!line) return;
      const draft = defaultMaterialDraft(line);
      if (draft.rawMaterialId) applyMaterialFormulaBindings(draft);
      const layout = getBomMaterialSlotLayout(getSelectedFinishedGood(), state.bomMaterials);
      const slotLocked = layout.slots.some((slot) => slot.line && slot.line.id === line.id);
      const fromAdditional = !slotLocked;
      state.modal = {
        type: "material",
        selectedId: line.rawMaterialId,
        mode: "edit",
        lineId: line.id,
        slotLocked,
        fromAdditional,
        draft,
        errors: {}
      };
      renderModal();
    }

    function openBreakdownModal(lineId) {
      const fromCalculator = Boolean(findCostCalculatorAdditionalMaterialById(lineId));
      state.modal = {
        type: "breakdown",
        collection: fromCalculator ? "cc-additional" : null,
        selectedId: null,
        mode: "view",
        lineId: Number(lineId),
        draft: null,
        errors: {}
      };
      renderModal();
    }

    function openDeleteMaterialModal(lineId) {
      const fromCalculator = Boolean(findCostCalculatorAdditionalMaterialById(lineId));
      state.modal = {
        type: "confirm-delete",
        collection: fromCalculator ? "cc-additional" : null,
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
      applyMaterialFormulaBindings(draft);
      const errors = validateMaterialDraft(draft, state.modal.lineId);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }

      const nextLine = calculateMaterialCost({
        id: state.modal.lineId || (isCostCalculatorAdditionalModal() ? nextCostCalculatorServiceKey() : nextBomLineId()),
        rawMaterialId: Number(draft.rawMaterialId),
        layer: draft.layer,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? Number(draft.formulaId) : null,
        dimensionId: draft.dimensionId ? Number(draft.dimensionId) : null,
        manualQty: draft.calculationMethod === "manual" ? parseByRule(draft.manualQty, "quantity").value : null,
        manualRate: storedManualRateFromDraft(draft),
        wastagePercent: parseByRule(
          draft.wastagePercent == null || draft.wastagePercent === "" ? 0 : draft.wastagePercent,
          "wastage"
        ).value,
        ...customDimensionFields(draft),
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      }, getMaterialModalCalcContext());

      if (isCostCalculatorAdditionalModal()) {
        const editing = state.modal.mode === "edit";
        nextLine.id = nextLine.id || nextLine.key;
        nextLine.key = nextLine.id;
        if (editing) {
          state.costCalculator.additionalMaterials = (state.costCalculator.additionalMaterials || []).map((line) =>
            Number(line.id || line.key) === Number(nextLine.id) ? nextLine : line
          );
        } else {
          state.costCalculator.additionalMaterials = (state.costCalculator.additionalMaterials || []).concat([nextLine]);
        }
        closeModal();
        persistCostCalculatorState();
        renderCostCalculator();
        refreshIcons();
        const material = getRawMaterial(nextLine.rawMaterialId);
        showNotification((material ? material.name : "Material") + (editing ? " updated" : " added"));
        return;
      }

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
      if (isCostCalculatorAdditionalModal() || findCostCalculatorAdditionalMaterialById(state.modal.lineId)) {
        state.costCalculator.additionalMaterials = (state.costCalculator.additionalMaterials || []).filter((line) =>
          Number(line.id || line.key) !== Number(state.modal.lineId)
        );
        closeModal();
        persistCostCalculatorState();
        renderCostCalculator();
        refreshIcons();
        return;
      }
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

    function openOtherMaterialModal(lineId) {
      if (!getSelectedFinishedGood() || !lineId) return;
      const line = (state.bomOtherMaterials || []).find((item) => item.id === Number(lineId));
      if (!line) return;
      const draft = {
        otherRawMaterialId: line.otherRawMaterialId,
        layer: line.layer,
        calculationMethod: line.calculationMethod,
        formulaId: line.formulaId,
        dimensionId: line.dimensionId != null ? Number(line.dimensionId) : null,
        manualQty: line.manualQty,
        manualRate: line.manualRate,
        wastagePercent: line.wastagePercent
      };
      if (draft.otherRawMaterialId) applyOtherMaterialFormulaBindings(draft);
      const layout = getBomOtherMaterialSlotLayout(state.bomOtherMaterials);
      const slotLocked = layout.slots.some((slot) => slot.line && slot.line.id === line.id);
      state.modal = {
        type: "other-material",
        selectedId: line.otherRawMaterialId,
        mode: "edit",
        lineId: line.id,
        slotLocked,
        draft,
        errors: {}
      };
      renderModal();
    }

    function openOtherBreakdownModal(lineId) {
      state.modal = { type: "other-breakdown", selectedId: null, mode: "view", lineId: Number(lineId), draft: null, errors: {} };
      renderModal();
    }

    function openDeleteOtherMaterialModal(lineId) {
      state.modal = { type: "confirm-delete-other", selectedId: null, mode: "delete", lineId: Number(lineId), draft: null, errors: {} };
      renderModal();
    }

    function validateOtherMaterialDraft(draft) {
      const errors = {};
      applyOtherMaterialFormulaBindings(draft);
      if (!getSelectedFinishedGood()) errors.finishedGood = "Select a Finished Good before adding materials.";
      if (!draft.otherRawMaterialId) errors.otherRawMaterialId = "Other Raw Material is required.";
      const material = getOtherRawMaterial(draft.otherRawMaterialId);
      if (draft.otherRawMaterialId && !material) errors.otherRawMaterialId = "Material must exist in the Other Raw Material Master.";
      if (!draft.layer) errors.layer = "Layer is required.";
      if (material) {
        applyManualRateDraftValidation(
          draft,
          errors,
          getOtherMaterialRate(material.id),
          "No rate configured for this other material.",
          "Purchasing rate from Other Raw Material Rates is not valid."
        );
      }
      if (draft.calculationMethod === "formula") {
        if (!getOtherMaterialQtyFormula(material)) errors.formulaId = "A valid material formula is required. Set Default Quantity Formula on the Other Raw Material master.";
      } else {
        const qty = parseByRule(draft.manualQty, "quantity", { requiredError: "Manual quantity must be greater than 0." });
        if (!qty.ok) errors.manualQty = qty.error;
      }
      const wastage = parseByRule(draft.wastagePercent, "wastage", { requiredError: "Wastage cannot be negative." });
      if (!wastage.ok) errors.wastagePercent = wastage.error;
      return errors;
    }

    function saveOtherMaterialFromModal() {
      const draft = state.modal.draft;
      applyOtherMaterialFormulaBindings(draft);
      const errors = validateOtherMaterialDraft(draft);
      state.modal.errors = errors;
      if (Object.keys(errors).length) {
        showFirstValidationError(errors);
        renderModal();
        return;
      }
      const nextLine = calculateOtherMaterialCost({
        id: state.modal.lineId || nextBomLineId(),
        otherRawMaterialId: Number(draft.otherRawMaterialId),
        layer: draft.layer,
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? Number(draft.formulaId) : null,
        dimensionId: draft.dimensionId ? Number(draft.dimensionId) : null,
        manualQty: draft.calculationMethod === "manual" ? parseByRule(draft.manualQty, "quantity").value : null,
        manualRate: storedManualRateFromDraft(draft),
        wastagePercent: parseByRule(draft.wastagePercent, "wastage").value,
        netQty: 0,
        grossQty: 0,
        rate: 0,
        costPerPiece: 0
      });
      state.bomOtherMaterials = state.bomOtherMaterials.map((line) => line.id === nextLine.id ? nextLine : line);
      recalculateBOMCosts();
      closeModal();
      refreshBomViews();
      persistEditorState();
    }

    function confirmDeleteOtherMaterial() {
      state.bomOtherMaterials = (state.bomOtherMaterials || []).filter((line) => line.id !== state.modal.lineId);
      recalculateBOMCosts();
      closeModal();
      refreshBomViews();
      persistEditorState();
    }

    function updateOtherLineWastage(lineId, value) {
      const parsed = parseByRule(value === "" ? "0" : value, "wastage");
      if (!parsed.ok) {
        showNotification(parsed.error, "error");
        refreshBomViews();
        return;
      }
      state.bomOtherMaterials = (state.bomOtherMaterials || []).map((line) => {
        if (line.id !== Number(lineId)) return line;
        return { ...line, wastagePercent: parsed.value };
      });
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
    }

    function updateOtherMaterialDraftFromEvent(target) {
      if (!state.modal.draft || state.modal.type !== "other-material") return false;
      const draft = state.modal.draft;
      if (target.id === "modal-other-material-select") {
        draft.otherRawMaterialId = target.value ? Number(target.value) : null;
        draft.dimensionId = null;
        applyOtherMaterialFormulaBindings(draft);
      } else if (target.id === "modal-other-layer-select") draft.layer = target.value;
      else if (target.id === "modal-other-method-select") {
        draft.calculationMethod = target.value;
        if (draft.calculationMethod === "formula") applyOtherMaterialFormulaBindings(draft);
      } else if (target.id === "modal-other-line-dimension") {
        draft.dimensionId = target.value ? Number(target.value) : null;
        applyOtherMaterialFormulaBindings(draft);
      } else if (target.id === "modal-other-manual-qty") {
        draft.manualQty = target.value === "" ? null : target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-other-manual-rate") {
        draft.manualRate = target.value === "" ? null : target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-other-wastage") {
        draft.wastagePercent = target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else return false;
      state.modal.errors = {};
      renderModal();
      return true;
    }

    function renderOtherBreakdownModal() {
      const line = (state.bomOtherMaterials || []).find((item) => item.id === state.modal.lineId);
      const fg = getSelectedFinishedGood();
      if (!line || !fg) {
        return `<div class="modal-body"><p>Calculation details are unavailable.</p></div>`;
      }
      const material = getOtherRawMaterial(line.otherRawMaterialId);
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Calculation</div>
            <strong>Other Material Breakdown</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="detail-list">
            <div><span>Material</span><strong>${escapeHtml(material ? material.name : "—")}</strong></div>
            <div><span>Net Quantity</span><strong>${formatQty(line.netQty)} ${escapeHtml(material ? material.uom : "")}</strong></div>
            <div><span>Gross Quantity</span><strong>${formatQty(line.grossQty)} ${escapeHtml(material ? material.uom : "")}</strong></div>
            <div><span>Cost / Piece</span><strong>${formatCurrency(line.costPerPiece)}</strong></div>
            ${line.error ? `<div><span>Error</span><strong>${escapeHtml(line.error)}</strong></div>` : ""}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-modal-close>Close</button>
        </div>
      `;
    }

    function updateBomMarginPercent(field, value) {
      const parsed = parseByRule(value === "" ? "0" : value, "percent");
      if (!parsed.ok) {
        showNotification(parsed.error, "error");
        refreshBomViews();
        return;
      }
      if (field === "profit") state.bomProfitPercent = parsed.value;
      else state.bomOverheadPercent = parsed.value;
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
    }

    function restoreBomSummaryFieldFocus(fieldId, caret) {
      restoreFocus(fieldId, caret, caret);
    }

    function updateBomNumberOfColors(value) {
      state.bomNumberOfColors = storedBomColorCount(value);
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
    }

    function updateBomColorRate(value) {
      if (value === "") {
        state.bomColorRate = null;
      } else {
        const parsed = parseByRule(value, "rate");
        if (!parsed.ok) {
          showNotification(parsed.error, "error");
          refreshBomViews();
          return;
        }
        state.bomColorRate = parsed.value;
      }
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
    }

    function updateBomOrderQuantity(value) {
      if (value === "") {
        state.bomOrderQuantity = null;
      } else {
        const parsed = parseByRule(value, "quantity");
        if (!parsed.ok) {
          showNotification(parsed.error, "error");
          refreshBomViews();
          return;
        }
        state.bomOrderQuantity = parsed.value;
      }
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
    }

    function updateBomOrderQuantityUom(value) {
      state.bomOrderQuantityUOM = storedBomOrderQuantityUom(value);
      recalculateBOMCosts();
      refreshBomViews();
      persistEditorState();
    }

    function updateMaterialDraftFromEvent(target) {
      if (!state.modal.draft) return false;
      const draft = state.modal.draft;
      if (target.id === "modal-material-select") {
        draft.rawMaterialId = target.value ? Number(target.value) : null;
        draft.dimensionId = null;
        applyMaterialFormulaBindings(draft);
      }
      else if (target.id === "modal-layer-select") draft.layer = target.value;
      else if (target.id === "modal-method-select") {
        draft.calculationMethod = target.value;
        if (draft.calculationMethod === "formula") applyMaterialFormulaBindings(draft);
      }
      else if (target.id === "modal-formula-select") draft.formulaId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-line-dimension") {
        draft.dimensionId = target.value ? Number(target.value) : null;
        applyMaterialFormulaBindings(draft);
      }
      else if (target.id === "modal-manual-qty") {
        draft.manualQty = target.value === "" ? null : target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-manual-rate") {
        draft.manualRate = target.value === "" ? null : target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-wastage") {
        draft.wastagePercent = target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-material-use-custom-dim") {
        draft.useCustomDimensions = target.checked;
        if (target.checked) fillCustomDimensionsFromAuto(draft);
      } else if (target.id === "modal-material-custom-length") {
        draft.customLength = target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-material-custom-width") {
        draft.customWidth = target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else return false;
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
          dimensionId: line.dimensionId != null ? Number(line.dimensionId) : null,
          manualQty: line.manualQty,
          manualRate: line.manualRate,
          useCustomDimensions: Boolean(line.useCustomDimensions),
          customLength: line.customLength != null ? line.customLength : "",
          customWidth: line.customWidth != null ? line.customWidth : ""
        };
      }
      return {
        serviceId: null,
        calculationMethod: "formula",
        formulaId: null,
        dimensionId: null,
        manualQty: 1,
        manualRate: null,
        useCustomDimensions: false,
        customLength: "",
        customWidth: ""
      };
    }

    function validateServiceDraft(draft, lineId) {
      const errors = {};
      if (!getServiceModalFinishedGood()) {
        errors.finishedGood = isCostCalculatorServiceModal()
          ? (isCostCalculatorFinishingModal()
            ? "Complete style, dimensions, and ply before adding finishing services."
            : "Complete style, dimensions, and ply before adding services.")
          : (isFinishingServiceCollection(state.modal.collection)
            ? "Select a Finished Good before adding finishing services."
            : "Select a Finished Good before adding services.");
      }
      if (!draft.serviceId) errors.serviceId = "Service is required.";
      const service = getService(draft.serviceId);
      if (draft.serviceId && !service) errors.serviceId = "Service must exist in the Service Master.";
      if (service && isCostCalculatorFinishingModal() && !isActiveFinishingService(service)) {
        errors.serviceId = "Select an active Finishing service.";
      } else if (service && isCostCalculatorServiceModal() && !isCostCalculatorFinishingModal() && !isActiveGeneralService(service)) {
        errors.serviceId = "Select an active General service.";
      }
      if (service) {
        applyManualRateDraftValidation(
          draft,
          errors,
          getServiceRate(service.id),
          "No rate configured for this service.",
          "Service rate is not valid."
        );
      }
      const linkedDims = service ? getServiceLinkedDimensionIds(service) : [];
      if (draft.dimensionId && linkedDims.length && !linkedDims.includes(Number(draft.dimensionId))) {
        errors.dimensionId = "Selected dimension is not linked to this service.";
      } else if (draft.dimensionId && !getDimension(draft.dimensionId)) {
        errors.dimensionId = "Selected dimension is not valid.";
      }
      if (draft.calculationMethod === "formula") {
        const selectedFormula = getFormula(draft.formulaId) || getFormula(getServiceDefaultFormulaId(service && service.id));
        if (!selectedFormula) errors.formulaId = "A valid service formula is required. Set a formula on the active Service Rate.";
        else if (!selectedFormula.isActive || selectedFormula.type !== "Service") {
          errors.formulaId = "Selected formula is not valid or is inactive.";
        }
      } else {
        const qty = parseByRule(draft.manualQty, "quantity", { requiredError: "Quantity / Piece must be greater than 0." });
        if (!qty.ok) errors.manualQty = qty.error;
      }
      if (state.modal.collection !== "additional" && state.modal.collection !== "cc-additional-service" && draft.serviceId && findDuplicateService(draft.serviceId, lineId, state.modal.collection)) {
        errors.duplicate = isFinishingServiceCollection(state.modal.collection)
          ? (isCostCalculatorFinishingModal()
            ? "This finishing service is already added to the Cost Calculator."
            : "This finishing service is already added to the BOM.")
          : (isCostCalculatorServiceModal()
            ? "This service is already added to the Cost Calculator."
            : "This service is already added to the BOM.");
      }
      validateCustomDimensionDraft(draft, errors);
      if (!Object.keys(errors).length) {
        const preview = calculateServiceCost({
          id: lineId || 0,
          serviceId: draft.serviceId,
          calculationMethod: draft.calculationMethod,
          formulaId: draft.formulaId,
          dimensionId: draft.dimensionId,
          manualQty: draft.manualQty,
          manualRate: storedManualRateFromDraft(draft),
          ...customDimensionFields(draft),
          quantity: 0,
          rate: 0,
          costPerPiece: 0
        }, getServiceModalCalcContext());
        if (preview.error) errors.formula = preview.error;
      }
      return errors;
    }

    function renderServiceModalLeft() {
      const draft = state.modal.draft;
      const errors = state.modal.errors || {};
      const service = getService(draft.serviceId);
      const formula = getFormula(draft.formulaId);
      const categoryId = bomCollectionToServiceCategory(state.modal.collection);
      const categoryOption = SERVICE_CATEGORY_OPTIONS.find((item) => item.id === categoryId);
      const categoryLabel = categoryOption ? categoryOption.label : "General";
      const finishing = isFinishingServiceCollection(state.modal.collection);
      const options = isCostCalculatorFinishingModal()
        ? getCostCalculatorFinishingServiceOptions(draft.serviceId)
        : (isCostCalculatorServiceModal()
          ? getCostCalculatorServiceOptions(draft.serviceId)
          : getActiveServicesForBomPicker(draft.serviceId, categoryId));
      return `
        <section aria-label="Service selection and inputs">
          <div class="form-grid">
            <div>
              <label class="form-label" for="modal-service-select">${finishing ? "Finishing Service" : "Service"}</label>
              <select id="modal-service-select" class="full-select ${errors.serviceId ? "input-invalid" : ""}" aria-invalid="${errors.serviceId ? "true" : "false"}">
                <option value="">Select a service...</option>
                ${options.map((item) => `
                  <option value="${item.id}" ${Number(draft.serviceId) === item.id ? "selected" : ""}>
                    ${escapeHtml(item.code)} — ${escapeHtml(item.name)}
                  </option>
                `).join("")}
              </select>
              ${errors.serviceId ? `<div class="field-error">${escapeHtml(errors.serviceId)}</div>` : `<p class="stat-hint" style="margin-top:6px;">${isCostCalculatorFinishingModal() ? "Showing active Finishing services from Service Master." : (isCostCalculatorServiceModal() ? "Showing active General services from Service Master." : "Showing " + escapeHtml(categoryLabel) + " services from Service Master.")}</p>`}
            </div>
            ${renderUseCustomDimensionBlock(draft, errors, {
              checkId: "modal-service-use-custom-dim",
              lengthId: "modal-service-custom-length",
              widthId: "modal-service-custom-width"
            })}
            <div>
              <label class="form-label" for="modal-service-method">Calculation Method</label>
              <select id="modal-service-method" class="full-select">
                <option value="formula" ${draft.calculationMethod === "formula" ? "selected" : ""}>Formula</option>
                <option value="manual" ${draft.calculationMethod === "manual" ? "selected" : ""}>Manual</option>
              </select>
            </div>
            ${draft.calculationMethod === "formula" ? `
              <div>
                <label class="form-label" for="modal-service-formula">Quantity Formula</label>
                <select id="modal-service-formula" class="full-select ${errors.formulaId ? "input-invalid" : ""}" aria-invalid="${errors.formulaId ? "true" : "false"}">
                  <option value="">Select a formula...</option>
                  ${getServiceFormulas("Quantity").map((item) => `
                    <option value="${item.id}" ${Number(draft.formulaId) === item.id ? "selected" : ""}>
                      ${escapeHtml(item.name)} (${escapeHtml(item.code)})
                    </option>
                  `).join("")}
                </select>
                ${formula ? `<p class="stat-hint mono" style="margin-top:8px;">${escapeHtml(formula.expression)}</p>` : ""}
                ${errors.formulaId ? `<div class="field-error">${escapeHtml(errors.formulaId)}</div>` : ""}
                ${errors.formula ? `<div class="field-error">${escapeHtml(errors.formula)}</div>` : ""}
              </div>
            ` : renderManualQtyAndRateFields("modal-service-qty", "modal-service-rate", draft, errors, "Quantity / Piece")}
          </div>
          ${errors.duplicate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.duplicate)}</div>` : ""}
          ${errors.finishedGood ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.finishedGood)}</div>` : ""}
          ${errors.rate ? `<div class="field-error" style="margin-top:10px;">${escapeHtml(errors.rate)}</div>` : ""}
        </section>
        <div class="modal-left-actions">
          <button type="button" class="btn" data-modal-close>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-service">Save</button>
        </div>
      `;
    }

    function renderServiceModalRight() {
      const data = formatPreviewData("service", state.modal.draft);
      if (!data.ready) {
        return `<p class="preview-empty">${isFinishingServiceCollection(state.modal.collection) ? "Select a finishing service to see live quantity, formula variables, and cost." : "Select a service to see live quantity, formula variables, and cost."}</p>`;
      }
      const service = data.item;
      const preview = data.preview;
      const formula = data.formula;
      const varsHtml = data.breakdown.variables.length
        ? `<div class="preview-vars" aria-label="Formula variables">
            ${data.breakdown.variables.map((row) => `
              <div class="preview-var">
                <span class="mono">${escapeHtml(row.code)}</span>
                <strong>${escapeHtml(row.display)}</strong>
              </div>
            `).join("")}
          </div>`
        : `<p class="stat-hint" style="margin-top:8px;">No formula variables to display.</p>`;
      return `
        <section class="preview-section" aria-label="Service details">
          <h3 class="preview-heading">${isFinishingServiceCollection(state.modal.collection) ? "Finishing service details" : "Service details"}</h3>
          ${renderPreviewField("Code", `<span class="mono">${escapeHtml(service.code)}</span>`)}
          ${renderPreviewField("Name", escapeHtml(service.name))}
          ${renderPreviewField("UOM", escapeHtml(service.uom))}
          ${renderPreviewField("Rate", escapeHtml(formatRatePkr(getServiceRate(service.id)?.rate, getServiceRate(service.id)?.rateUOM)))}
        </section>
        ${renderPreviewCustomDimSection(state.modal.draft)}
        <section class="preview-section" aria-label="Formula and calculation">
          <h3 class="preview-heading">Formula &amp; calculation</h3>
          ${renderPreviewField(
            "Formula",
            state.modal.draft.calculationMethod === "manual"
              ? "Manual quantity"
              : (formula ? `<span class="mono">${escapeHtml(formula.code)}</span>` : "—")
          )}
          ${state.modal.draft.calculationMethod === "formula" ? `
            <div class="preview-field preview-field-stack">
              <div class="preview-label">Variables</div>
              ${varsHtml}
            </div>
          ` : ""}
          ${preview && !preview.error
            ? renderPreviewField("Calculated qty", escapeHtml(formatQty(preview.quantity) + " " + service.uom))
            : `<p class="preview-error">${escapeHtml((preview && preview.error) || "Quantity cannot be calculated yet.")}</p>`}
        </section>
        <section class="preview-section" aria-label="Cost summary">
          <h3 class="preview-heading">Cost summary</h3>
          ${renderPreviewField(isFinishingServiceCollection(state.modal.collection) ? "Finishing Service" : "Service", escapeHtml(service.name))}
          ${renderPreviewField("Dimension", isUseCustomDimensions(state.modal.draft) ? "Custom" : "Not selected")}
          ${preview && !preview.error ? `
            ${renderPreviewField("Qty", escapeHtml(formatQty(preview.quantity) + " " + service.uom))}
            ${renderPreviewField("Rate", escapeHtml(formatRatePkr(preview.rate, getServiceRate(service.id)?.rateUOM)))}
            <div class="summary-highlight">
              <div class="preview-label">Total</div>
              <div class="preview-value cost-display">${escapeHtml(formatRupees(preview.costPerPiece))}</div>
            </div>
          ` : `<p class="preview-error">${escapeHtml((preview && preview.error) || "Cost cannot be calculated yet.")}</p>`}
        </section>
      `;
    }

    function renderServiceFormModal() {
      const finishing = isFinishingServiceCollection(state.modal.collection);
      const title = state.modal.mode === "edit"
        ? (finishing ? "Edit Finishing Service" : "Edit Service")
        : (finishing ? "Add Finishing Service" : "Add Service");
      return renderBomLineModalShell(
        title,
        renderServiceModalLeft(),
        renderServiceModalRight(),
        isCostCalculatorServiceModal() ? "Cost Calculator" : "BOM line"
      );
    }

    function renderServiceBreakdownModal() {
      const line = findBomServiceLineById(state.modal.lineId);
      const fg = getServiceModalFinishedGood();
      if (!line || !fg) {
        return `<div class="modal-body"><p>Calculation details are unavailable.</p></div>`;
      }
      const service = getService(line.serviceId);
      const live = isCostCalculatorServiceModal()
        ? calculateServiceCost({ ...line }, getServiceModalCalcContext())
        : line;
      const formula = live.calculationMethod === "formula"
        ? getFormula(getServiceDefaultFormulaId(service && service.id))
        : getFormula(live.formulaId);
      const variables = service ? buildServiceFormulaVariables(fg, service, live.dimensionId, live, formula) : {};
      return `
        <div class="modal-header">
          <div>
            <div class="section-kicker">Calculation Breakdown</div>
            <strong>${isFinishingServiceCollection(getBomServiceCollection(state.modal.lineId) || state.modal.collection) ? "Finishing service calculation" : "Service calculation"}</strong>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-modal-close>Close</button>
        </div>
        <div class="modal-body">
          <div class="detail-list">
            <div><span>${isFinishingServiceCollection(getBomServiceCollection(state.modal.lineId) || state.modal.collection) ? "Finishing Service" : "Service"}</span><strong>${escapeHtml(service ? service.name : "—")}</strong></div>
            <div><span>${isCostCalculatorServiceModal() ? "Estimate" : "Finished Good"}</span><strong>${escapeHtml(fg?.product ?? "missing data")}${fg?.variant ? " — " + escapeHtml(fg.variant) : ""}${isCostCalculatorServiceModal() && fg?.style ? " · " + escapeHtml(fg.style) : ""}</strong></div>
            <div><span>Dimensions</span><strong>${escapeHtml(formatDimensions(fg))}</strong></div>
            <div><span>Calculation Method</span><strong>${escapeHtml(live.calculationMethod === "manual" ? "Manual" : "Formula")}</strong></div>
            <div><span>Formula</span><strong>${live.calculationMethod === "formula" && formula ? escapeHtml(formula.code) : "—"}</strong></div>
            <div><span>Formula Expression</span><strong class="mono">${live.calculationMethod === "formula" && formula ? escapeHtml(formula.expression) : "—"}</strong></div>
            <div><span>Quantity / Piece</span><strong>${formatQty(live.quantity)}</strong></div>
            <div><span>Service Rate</span><strong>${service ? formatRatePkr(getServiceRate(service.id)?.rate, getServiceRate(service.id)?.rateUOM) : "—"}</strong></div>
            <div><span>Master Formula</span><strong>${escapeHtml(formatBoundFormulaCode(getServiceDefaultFormulaId(service && service.id)))}</strong></div>
            <div><span>Applied Rate</span><strong>${formatRatePkr(live.rate, getServiceRate(live.serviceId)?.rateUOM || "")} (${live.rateSource === "manual" ? "manual" : "master"})</strong></div>
            <div><span>Service Cost / Piece</span><strong>${formatRupees(live.costPerPiece)}</strong></div>
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

    function getBomServiceCollection(lineId) {
      const id = Number(lineId);
      if (state.bomServices.some((item) => item.id === id)) return "services";
      if ((state.bomAdditionalServices || []).some((item) => item.id === id)) return "additional";
      if ((state.bomFinishingServices || []).some((item) => item.id === id)) return "finishing";
      if (findCostCalculatorFinishingServiceLineById(id)) return "cc-finishing";
      if (findCostCalculatorAdditionalServiceById(id)) return "cc-additional-service";
      if (findCostCalculatorServiceLineById(id)) return "cost-calculator";
      return null;
    }

    function openServiceModal(lineId, collection) {
      const resolved = collection || getBomServiceCollection(lineId) || "services";
      if (resolved === "cost-calculator" || resolved === "cc-finishing" || resolved === "cc-additional-service") {
        if (!getCostCalculatorStepState().hasPly) return;
      } else if (!getSelectedFinishedGood()) {
        return;
      }
      const list = getBomServiceLines(resolved);
      const line = lineId ? list.find((item) => Number(item.id || item.key) === Number(lineId)) : null;
      state.modal = {
        type: "service",
        collection: resolved,
        selectedId: line ? line.serviceId : null,
        mode: line ? "edit" : "add",
        lineId: line ? Number(line.id || line.key) : null,
        draft: defaultServiceDraft(line),
        errors: {}
      };
      renderModal();
    }

    function openServiceBreakdownModal(lineId, collection) {
      state.modal = {
        type: "service-breakdown",
        collection: collection || getBomServiceCollection(lineId) || "services",
        selectedId: null,
        mode: "view",
        lineId: Number(lineId),
        draft: null,
        errors: {}
      };
      renderModal();
    }

    function openDeleteServiceModal(lineId, collection) {
      state.modal = {
        type: "confirm-delete-service",
        collection: collection || getBomServiceCollection(lineId) || "services",
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

      const isAdditional = state.modal.collection === "additional" || isCostCalculatorAdditionalServiceModal();
      const isFinishing = isFinishingServiceCollection(state.modal.collection);
      const nextLine = calculateServiceCost({
        id: state.modal.lineId || (isCostCalculatorServiceModal() ? nextCostCalculatorServiceKey() : nextBomLineId()),
        serviceId: Number(draft.serviceId),
        layer: isAdditional ? "Additional" : (isFinishing ? "Finishing" : undefined),
        calculationMethod: draft.calculationMethod,
        formulaId: draft.calculationMethod === "formula" ? Number(draft.formulaId) : null,
        dimensionId: draft.dimensionId ? Number(draft.dimensionId) : null,
        manualQty: draft.calculationMethod === "manual" ? parseByRule(draft.manualQty, "quantity").value : null,
        manualRate: storedManualRateFromDraft(draft),
        ...customDimensionFields(draft),
        quantity: 0,
        rate: 0,
        costPerPiece: 0
      }, getServiceModalCalcContext());

      if (isCostCalculatorServiceModal()) {
        const editing = state.modal.mode === "edit";
        nextLine.id = nextLine.id || nextLine.key;
        nextLine.key = nextLine.id;
        if (isCostCalculatorFinishingModal()) {
          if (editing) {
            state.costCalculator.finishingServices = (state.costCalculator.finishingServices || []).map((line) =>
              Number(line.id || line.key) === Number(nextLine.id) ? nextLine : line
            );
          } else {
            state.costCalculator.finishingServices = (state.costCalculator.finishingServices || []).concat([nextLine]);
          }
        } else if (isCostCalculatorAdditionalServiceModal()) {
          if (editing) {
            state.costCalculator.additionalServices = (state.costCalculator.additionalServices || []).map((line) =>
              Number(line.id || line.key) === Number(nextLine.id) ? nextLine : line
            );
          } else {
            state.costCalculator.additionalServices = (state.costCalculator.additionalServices || []).concat([nextLine]);
          }
        } else if (editing) {
          state.costCalculator.services = (state.costCalculator.services || []).map((line) =>
            Number(line.id || line.key) === Number(nextLine.id) ? nextLine : line
          );
        } else {
          state.costCalculator.services = (state.costCalculator.services || []).concat([nextLine]);
          state.costCalculator.removedServices = (state.costCalculator.removedServices || [])
            .filter((id) => Number(id) !== Number(nextLine.serviceId));
        }
        closeModal();
        persistCostCalculatorState();
        renderCostCalculator();
        refreshIcons();
        const service = getService(nextLine.serviceId);
        showNotification((service ? service.name : (isCostCalculatorFinishingModal() ? "Finishing service" : "Service")) + (editing ? " updated" : " added"));
        return;
      }

      if (isAdditional) {
        if (state.modal.mode === "edit") {
          state.bomAdditionalServices = (state.bomAdditionalServices || []).map((line) => line.id === nextLine.id ? nextLine : line);
        } else {
          state.bomAdditionalServices = (state.bomAdditionalServices || []).concat([nextLine]);
        }
      } else if (isFinishing) {
        if (state.modal.mode === "edit") {
          state.bomFinishingServices = (state.bomFinishingServices || []).map((line) => line.id === nextLine.id ? nextLine : line);
        } else {
          state.bomFinishingServices = (state.bomFinishingServices || []).concat([nextLine]);
        }
      } else if (state.modal.mode === "edit") {
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
      if (state.modal.collection === "cc-additional-service") {
        state.costCalculator.additionalServices = (state.costCalculator.additionalServices || []).filter((line) =>
          Number(line.id || line.key) !== Number(state.modal.lineId)
        );
        closeModal();
        persistCostCalculatorState();
        renderCostCalculator();
        refreshIcons();
        return;
      }
      if (state.modal.collection === "cc-finishing") {
        state.costCalculator.finishingServices = (state.costCalculator.finishingServices || []).filter((line) =>
          Number(line.id || line.key) !== Number(state.modal.lineId)
        );
        closeModal();
        persistCostCalculatorState();
        renderCostCalculator();
        refreshIcons();
        return;
      }
      if (state.modal.collection === "cost-calculator") {
        const removed = findCostCalculatorServiceLineById(state.modal.lineId);
        const removedServiceId = removed ? Number(removed.serviceId) : 0;
        state.costCalculator.services = (state.costCalculator.services || []).filter((line) =>
          Number(line.id || line.key) !== Number(state.modal.lineId)
        );
        if (removedServiceId) {
          if (!Array.isArray(state.costCalculator.removedServices)) state.costCalculator.removedServices = [];
          if (!state.costCalculator.removedServices.some((id) => Number(id) === removedServiceId)) {
            state.costCalculator.removedServices.push(removedServiceId);
          }
        }
        closeModal();
        persistCostCalculatorState();
        renderCostCalculator();
        refreshIcons();
        return;
      }
      if (state.modal.collection === "additional") {
        state.bomAdditionalServices = (state.bomAdditionalServices || []).filter((line) => line.id !== state.modal.lineId);
      } else if (state.modal.collection === "finishing") {
        state.bomFinishingServices = (state.bomFinishingServices || []).filter((line) => line.id !== state.modal.lineId);
      } else {
        state.bomServices = state.bomServices.filter((line) => line.id !== state.modal.lineId);
      }
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
        draft.dimensionId = null;
        applyServiceFormulaBinding(draft);
      }
      else if (target.id === "modal-service-method") {
        draft.calculationMethod = target.value;
        if (draft.calculationMethod === "formula") applyServiceFormulaBinding(draft);
      }
      else if (target.id === "modal-service-formula") draft.formulaId = target.value ? Number(target.value) : null;
      else if (target.id === "modal-service-use-custom-dim") {
        draft.useCustomDimensions = target.checked;
        if (target.checked) fillCustomDimensionsFromAuto(draft);
      }
      else if (target.id === "modal-service-qty") {
        draft.manualQty = target.value === "" ? null : target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-service-rate") {
        draft.manualRate = target.value === "" ? null : target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-service-custom-length") {
        draft.customLength = target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else if (target.id === "modal-service-custom-width") {
        draft.customWidth = target.value;
        state.modal.errors = {};
        refreshBomLinePreview();
        return true;
      } else return false;
      state.modal.errors = {};
      renderModal();
      return true;
    }

    function renderCurrentPage() {
      const page = state.currentPage;
      if (page === "dashboard") renderDashboard();
      if (page === "formula-variables") renderFormulaVariables();
      if (page === "formulas") renderFormulas();
      if (page === "dimensions") renderDimensions();
      if (page === "style") renderStyles();
      if (page === "raw-materials") renderRawMaterials();
      if (page === "raw-material-rates") renderRawMaterialRates();
      if (page === "other-raw-materials") renderOtherRawMaterials();
      if (page === "other-raw-material-rates") renderOtherRawMaterialRates();
      if (page === "services") renderServices();
      if (page === "service-rates") renderServiceRates();
      if (page === "finished-goods") renderFinishedGoods();
      if (page === "bom-costing") renderBOMPage();
      if (page === "bom-list") {
        if (state.selectedFinishedGoodId) recalculateBOMCosts();
        renderBomList();
      }
      if (page === "cost-calculator") renderCostCalculator();
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

    function clampCaret(pos, len) {
      if (pos == null || pos === "" || Number.isNaN(Number(pos))) return len;
      return Math.min(Math.max(0, Number(pos)), len);
    }

    function restoreFieldSelection(field, start, end) {
      if (!field) return;
      field.focus();
      if (typeof field.setSelectionRange !== "function") return;
      try {
        const len = String(field.value ?? "").length;
        const from = clampCaret(start, len);
        const to = end == null || end === "" ? from : clampCaret(end, len);
        field.setSelectionRange(from, to);
      } catch (error) {
        /* some input types do not support selection ranges */
      }
    }

    function restoreFocus(id, start, end) {
      restoreFieldSelection(document.getElementById(id), start, end);
    }

    function applyUppercasePreservingCaret(field) {
      if (!field) return;
      const start = field.selectionStart;
      const end = field.selectionEnd;
      field.value = String(field.value || "").toUpperCase();
      restoreFieldSelection(field, start, end);
    }

    function setupEventHandlers() {
      document.querySelector(".content").addEventListener("input", (event) => {
        const id = event.target.id;
        const caretStart = event.target.selectionStart;
        const caretEnd = event.target.selectionEnd;
        if (id === "calc-length" || id === "calc-width" || id === "calc-height") {
          applyCostCalculatorDimensionLive(event.target);
          return;
        }
        if (id === "fg-search") {
          state.searches.finishedGoods = event.target.value;
          renderFinishedGoods();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "rm-search") {
          state.searches.rawMaterials = event.target.value;
          renderRawMaterials();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "orm-search") {
          state.searches.otherRawMaterials = event.target.value;
          renderOtherRawMaterials();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "mrate-search") {
          state.searches.materialRates = event.target.value;
          renderRawMaterialRates();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "omrate-search") {
          state.searches.otherMaterialRates = event.target.value;
          renderOtherRawMaterialRates();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "srv-search") {
          state.searches.services = event.target.value;
          renderServices();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "srate-search") {
          state.searches.serviceRates = event.target.value;
          renderServiceRates();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "bom-list-search") {
          state.searches.boms = event.target.value;
          renderBomList();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "style-search") {
          state.searches.style = event.target.value;
          renderStyles();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "fvar-search") {
          state.searches.formulaVariables = event.target.value;
          renderFormulaVariables();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "dim-search") {
          state.searches.dimensions = event.target.value;
          renderDimensions();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "formula-search") {
          state.searches.formulas = event.target.value;
          renderFormulas();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "fg-combo-search") {
          state.searches.bomFinishedGood = event.target.value;
          state.fgSelectorOpen = true;
          renderFinishedGoodSelector();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
          persistPrefs();
        } else if (id === "cc-style-search") {
          state.ccStyleSearch = event.target.value;
          state.ccStyleSelectorOpen = true;
          renderCostCalculatorStylePicker();
          refreshIcons();
          restoreFocus(id, caretStart, caretEnd);
        } else if (event.target.dataset.wastageLine) {
          const lineId = event.target.dataset.wastageLine;
          updateLineWastage(lineId, event.target.value);
          restoreFieldSelection(document.querySelector(`[data-wastage-line="${lineId}"]`), caretStart, caretEnd);
        } else if (event.target.dataset.otherWastageLine) {
          const lineId = event.target.dataset.otherWastageLine;
          updateOtherLineWastage(lineId, event.target.value);
          restoreFieldSelection(document.querySelector(`[data-other-wastage-line="${lineId}"]`), caretStart, caretEnd);
        } else if (event.target.id === "bom-profit-percent" || event.target.id === "bom-overhead-percent") {
          const fieldId = event.target.id;
          const caret = event.target.selectionStart;
          updateBomMarginPercent(fieldId === "bom-profit-percent" ? "profit" : "overhead", event.target.value);
          restoreBomSummaryFieldFocus(fieldId, caret);
        } else if (event.target.id === "bom-number-of-colors") {
          const caret = event.target.selectionStart;
          updateBomNumberOfColors(event.target.value);
          restoreBomSummaryFieldFocus("bom-number-of-colors", caret);
        } else if (event.target.id === "bom-color-rate") {
          const caret = event.target.selectionStart;
          updateBomColorRate(event.target.value);
          restoreBomSummaryFieldFocus("bom-color-rate", caret);
        } else if (event.target.id === "bom-order-quantity") {
          const caret = event.target.selectionStart;
          updateBomOrderQuantity(event.target.value);
          restoreBomSummaryFieldFocus("bom-order-quantity", caret);
        }
      });

      document.querySelector(".content").addEventListener("change", (event) => {
        if (event.target.id === "formula-filter") {
          state.formulaFilter = event.target.value;
          renderFormulas();
          refreshIcons();
          persistPrefs();
        }
        if (event.target.id === "mrate-status-filter") {
          state.materialRateFilter = event.target.value;
          renderRawMaterialRates();
          refreshIcons();
          persistPrefs();
        }
        if (event.target.id === "mrate-sort") {
          state.materialRateSort = event.target.value;
          renderRawMaterialRates();
          refreshIcons();
          persistPrefs();
        }
        if (event.target.id === "omrate-status-filter") {
          state.otherMaterialRateFilter = event.target.value;
          renderOtherRawMaterialRates();
          refreshIcons();
          persistPrefs();
        }
        if (event.target.id === "omrate-sort") {
          state.otherMaterialRateSort = event.target.value;
          renderOtherRawMaterialRates();
          refreshIcons();
          persistPrefs();
        }
        if (event.target.id === "srate-status-filter") {
          state.serviceRateFilter = event.target.value;
          renderServiceRates();
          refreshIcons();
          persistPrefs();
        }
        if (event.target.id === "srate-sort") {
          state.serviceRateSort = event.target.value;
          renderServiceRates();
          refreshIcons();
          persistPrefs();
        }
        if (event.target.id === "bom-list-filter") {
          state.bomListFilter = event.target.value;
          renderBomList();
          refreshIcons();
          persistPrefs();
        }
        if (event.target.id === "bom-order-quantity-uom") {
          updateBomOrderQuantityUom(event.target.value);
        }
        if (event.target.id === "calc-length" || event.target.id === "calc-width" || event.target.id === "calc-height") {
          applyCostCalculatorDimensionInput(event.target);
          return;
        }
        const layerSelect = event.target.dataset && event.target.dataset.ccLayerMaterial;
        if (layerSelect) {
          const row = (state.costCalculator.layers || []).find((item) => item.layer === layerSelect);
          if (row) row.rawMaterialId = event.target.value ? Number(event.target.value) : "";
          persistCostCalculatorState();
          renderCostCalculator();
          refreshIcons();
          if (row && row.rawMaterialId) {
            const material = getRawMaterial(row.rawMaterialId);
            const calc = calculateCostCalculatorMaterial(row);
            if (calc.error) showNotification(calc.error, "error");
            else showNotification((material ? material.name : "Material") + " selected for " + row.layer);
          }
        }
        const otherLayerSelect = event.target.dataset && event.target.dataset.ccOtherLayerMaterial;
        if (otherLayerSelect) {
          const row = (state.costCalculator.otherLayers || []).find((item) => item.layer === otherLayerSelect);
          if (row) row.otherRawMaterialId = event.target.value ? Number(event.target.value) : "";
          persistCostCalculatorState();
          renderCostCalculator();
          refreshIcons();
          if (row && row.otherRawMaterialId) {
            const material = getOtherRawMaterial(row.otherRawMaterialId);
            const calc = calculateCostCalculatorOtherMaterial(row);
            if (calc.error) showNotification(calc.error, "error");
            else showNotification((material ? material.name : "Other material") + " selected for " + row.layer);
          }
        }
        const bomLayerSelect = event.target.dataset && event.target.dataset.bomLayerMaterial;
        if (bomLayerSelect) {
          assignBomSlotMaterial(bomLayerSelect, event.target.value);
        }
        const bomExtraSelect = event.target.dataset && event.target.dataset.bomExtraMaterial;
        if (bomExtraSelect) {
          assignBomExtraMaterial(bomExtraSelect, event.target.value);
        }
        const bomAdditionalSelect = event.target.dataset && event.target.dataset.bomAdditionalService;
        if (bomAdditionalSelect) {
          assignBomAdditionalService(bomAdditionalSelect, event.target.value);
        }
        const bomOtherLayerSelect = event.target.dataset && event.target.dataset.bomOtherLayerMaterial;
        if (bomOtherLayerSelect) {
          assignBomOtherSlotMaterial(bomOtherLayerSelect, event.target.value);
        }
        const bomOtherExtraSelect = event.target.dataset && event.target.dataset.bomOtherExtraMaterial;
        if (bomOtherExtraSelect) {
          assignBomOtherExtraMaterial(bomOtherExtraSelect, event.target.value);
        }
      });

      document.querySelector(".content").addEventListener("focusout", (event) => {
        if (event.target.id === "calc-length" || event.target.id === "calc-width" || event.target.id === "calc-height") {
          applyCostCalculatorDimensionInput(event.target);
        }
      });

      document.querySelector(".content").addEventListener("click", (event) => {
        const formulaFilterOption = event.target.closest("[data-formula-filter]");
        if (formulaFilterOption) {
          const select = document.getElementById("formula-filter");
          if (select) {
            select.value = formulaFilterOption.dataset.formulaFilter;
            select.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return;
        }

        const dashboardNav = event.target.closest("[data-dashboard-nav]");
        if (dashboardNav && dashboardNav.closest("#page-dashboard")) {
          navigateTo(dashboardNav.dataset.dashboardNav);
          return;
        }

        if (event.target.closest("#fg-combo") || event.target.closest("#cc-style-combo")) {
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

        if (event.target.closest("#btn-add-finishing-service")) {
          openServiceModal(null, "finishing");
          return;
        }

        const bomSection = event.target.closest("[data-bom-section]");
        if (bomSection) {
          scrollToBomSection(bomSection.dataset.bomSection);
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
        if (event.target.closest("#cc-style-toggle")) {
          state.ccStyleSelectorOpen = !state.ccStyleSelectorOpen;
          if (!state.ccStyleSelectorOpen) state.ccStyleSearch = "";
          renderCostCalculatorStylePicker();
          refreshIcons();
          return;
        }
        const ccStyleOption = event.target.closest("[data-cc-style-id]");
        if (ccStyleOption) {
          handleCostCalculatorStyleChange(ccStyleOption.dataset.ccStyleId);
          renderCostCalculator();
          refreshIcons();
          return;
        }
        if (event.target.closest("#btn-cc-add-style")) {
          openStyleModal(null);
          return;
        }
        if (event.target.closest("[data-cc-toggle-style-formulas]")) {
          state.costCalculator.styleFormulasOpen = !state.costCalculator.styleFormulasOpen;
          persistCostCalculatorState();
          refreshCostCalculatorStyleFormulas();
          return;
        }
        const plyBtn = event.target.closest("[data-cc-ply]");
        if (plyBtn && !plyBtn.disabled) {
          const ply = Number(plyBtn.dataset.ccPly);
          state.costCalculator.ply = ply;
          openCostCalculatorStyleFormulas();
          loadCostCalculatorLayers(ply, { notify: true });
          loadCostCalculatorOtherLayers();
          persistCostCalculatorState();
          renderCostCalculator();
          refreshIcons();
          return;
        }
        if (event.target.closest("#btn-cc-add-service")) {
          openCostCalculatorServiceModal();
          return;
        }
        if (event.target.closest("#btn-cc-add-additional-material")) {
          openAddAdditionalMaterialModal();
          return;
        }
        const editCcAdditionalMaterial = event.target.closest("[data-edit-cc-additional-material]");
        if (editCcAdditionalMaterial) {
          openMaterialModal(editCcAdditionalMaterial.dataset.editCcAdditionalMaterial);
          return;
        }
        const deleteCcAdditionalMaterial = event.target.closest("[data-delete-cc-additional-material]");
        if (deleteCcAdditionalMaterial) {
          openDeleteMaterialModal(deleteCcAdditionalMaterial.dataset.deleteCcAdditionalMaterial);
          return;
        }
        const breakdownCcAdditionalMaterial = event.target.closest("[data-breakdown-cc-additional-material]");
        if (breakdownCcAdditionalMaterial) {
          openBreakdownModal(breakdownCcAdditionalMaterial.dataset.breakdownCcAdditionalMaterial);
          return;
        }
        const editCcAdditionalService = event.target.closest("[data-edit-cc-additional-service]");
        if (editCcAdditionalService) {
          openServiceModal(editCcAdditionalService.dataset.editCcAdditionalService, "cc-additional-service");
          return;
        }
        const deleteCcAdditionalService = event.target.closest("[data-delete-cc-additional-service]");
        if (deleteCcAdditionalService) {
          openDeleteServiceModal(deleteCcAdditionalService.dataset.deleteCcAdditionalService, "cc-additional-service");
          return;
        }
        const breakdownCcAdditionalService = event.target.closest("[data-breakdown-cc-additional-service]");
        if (breakdownCcAdditionalService) {
          openServiceBreakdownModal(breakdownCcAdditionalService.dataset.breakdownCcAdditionalService, "cc-additional-service");
          return;
        }
        if (event.target.closest("#btn-cc-add-finishing-service")) {
          openCostCalculatorFinishingServiceModal();
          return;
        }
        const editCcFinishing = event.target.closest("[data-edit-cc-finishing-service]");
        if (editCcFinishing) {
          openCostCalculatorFinishingServiceModal(editCcFinishing.dataset.editCcFinishingService);
          return;
        }
        const deleteCcFinishing = event.target.closest("[data-delete-cc-finishing-service]");
        if (deleteCcFinishing) {
          openDeleteServiceModal(deleteCcFinishing.dataset.deleteCcFinishingService, "cc-finishing");
          return;
        }
        const breakdownCcFinishing = event.target.closest("[data-breakdown-cc-finishing-service]");
        if (breakdownCcFinishing) {
          openServiceBreakdownModal(breakdownCcFinishing.dataset.breakdownCcFinishingService, "cc-finishing");
          return;
        }
        const editCcService = event.target.closest("[data-edit-cc-service]");
        if (editCcService) {
          openCostCalculatorServiceModal(editCcService.dataset.editCcService);
          return;
        }
        const deleteCcService = event.target.closest("[data-delete-cc-service]");
        if (deleteCcService) {
          openDeleteServiceModal(deleteCcService.dataset.deleteCcService, "cost-calculator");
          return;
        }
        const breakdownCcService = event.target.closest("[data-breakdown-cc-service]");
        if (breakdownCcService) {
          openServiceBreakdownModal(breakdownCcService.dataset.breakdownCcService, "cost-calculator");
          return;
        }
        if (event.target.closest("#btn-cc-save-bom")) {
          saveCostCalculatorAsBom();
          return;
        }
        if (event.target.closest("#btn-cc-export-pdf")) {
          exportCostCalculatorPDF();
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
        if (event.target.closest("#btn-clean-user-data")) {
          if (state.cleaningUserData) return;
          openMasterDeleteModal("user-data", 0, "your products, materials, services, and BOMs");
          return;
        }
        if (event.target.closest("#btn-download-excel")) {
          downloadAllDataAsExcel();
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
        if (event.target.closest("#btn-add-other-material-master")) {
          openOtherRawMaterialMasterModal();
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
        if (event.target.closest("#btn-add-fixed-variable")) {
          openFixedVariableModal();
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
          const usage = finishedGoodBomUsageMessage(deleteFg.dataset.deleteFg);
          if (usage) {
            showNotification(usage, "error");
            return;
          }
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
          const usage = materialBomUsageMessage(deleteRm.dataset.deleteRm);
          if (usage) {
            showNotification(usage, "error");
            return;
          }
          openMasterDeleteModal("raw-material", deleteRm.dataset.deleteRm, item ? item.name : "this material");
          return;
        }
        const editOrm = event.target.closest("[data-edit-orm]");
        if (editOrm) {
          openOtherRawMaterialMasterModal(editOrm.dataset.editOrm);
          return;
        }
        const deleteOrm = event.target.closest("[data-delete-orm]");
        if (deleteOrm) {
          const item = otherRawMaterials.find((row) => row.id === Number(deleteOrm.dataset.deleteOrm));
          const usage = otherMaterialBomUsageMessage(deleteOrm.dataset.deleteOrm);
          if (usage) {
            showNotification(usage, "error");
            return;
          }
          openMasterDeleteModal("other-raw-material", deleteOrm.dataset.deleteOrm, item ? item.name : "this material");
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
          const usage = serviceBomUsageMessage(deleteSrv.dataset.deleteSrvMaster);
          if (usage) {
            showNotification(usage, "error");
            return;
          }
          openMasterDeleteModal("service", deleteSrv.dataset.deleteSrvMaster, item ? item.name : "this service");
          return;
        }
        const editMaterialRate = event.target.closest("[data-edit-material-rate]");
        if (editMaterialRate) {
          openMaterialRateModal(editMaterialRate.dataset.editMaterialRate);
          return;
        }
        const editOtherMaterialRate = event.target.closest("[data-edit-other-material-rate]");
        if (editOtherMaterialRate) {
          openOtherMaterialRateModal(editOtherMaterialRate.dataset.editOtherMaterialRate);
          return;
        }
        const editServiceRate = event.target.closest("[data-edit-service-rate]");
        if (editServiceRate) {
          openServiceRateModal(editServiceRate.dataset.editServiceRate);
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
        const editFixedVar = event.target.closest("[data-edit-fixed-variable]");
        if (editFixedVar) {
          openFixedVariableModal(editFixedVar.dataset.editFixedVariable);
          return;
        }
        const deleteFvar = event.target.closest("[data-delete-fvar]");
        if (deleteFvar) {
          const item = formulaVariables.find((row) => row.id === Number(deleteFvar.dataset.deleteFvar));
          if (item && isFixedSheetAreaCode(item.code)) {
            showNotification("SHEET_AREA is a fixed calculation and cannot be deleted.", "error");
            return;
          }
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

        if (event.target.closest("#btn-add-service")) {
          openServiceModal();
          return;
        }

        if (event.target.closest("#btn-add-additional-service")) {
          openAddAdditionalMaterialModal();
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

        const editOtherBtn = event.target.closest("[data-edit-other-line]");
        if (editOtherBtn) {
          openOtherMaterialModal(editOtherBtn.dataset.editOtherLine);
          return;
        }

        const deleteOtherBtn = event.target.closest("[data-delete-other-line]");
        if (deleteOtherBtn) {
          openDeleteOtherMaterialModal(deleteOtherBtn.dataset.deleteOtherLine);
          return;
        }

        const breakdownOtherBtn = event.target.closest("[data-breakdown-other-line]");
        if (breakdownOtherBtn) {
          openOtherBreakdownModal(breakdownOtherBtn.dataset.breakdownOtherLine);
          return;
        }

        if (event.target.closest("#btn-toggle-calc-dims")) {
          state.showCalculatedDimensions = !state.showCalculatedDimensions;
          renderBOMHeader();
          refreshIcons();
          return;
        }
        const explainBtn = event.target.closest("[data-explain-kind]");
        if (explainBtn) {
          openFormulaExplainerModal(explainBtn.dataset.explainKind, explainBtn.dataset.explainLine);
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

        const breakdownAdditional = event.target.closest("[data-breakdown-additional-service]");
        if (breakdownAdditional) {
          openServiceBreakdownModal(breakdownAdditional.dataset.breakdownAdditionalService);
          return;
        }

        const editAdditional = event.target.closest("[data-edit-additional-service]");
        if (editAdditional) {
          openServiceModal(editAdditional.dataset.editAdditionalService, "additional");
          return;
        }

        const deleteAdditional = event.target.closest("[data-delete-additional-service]");
        if (deleteAdditional) {
          openDeleteServiceModal(deleteAdditional.dataset.deleteAdditionalService);
          return;
        }

        const editFinishing = event.target.closest("[data-edit-finishing-service]");
        if (editFinishing) {
          openServiceModal(editFinishing.dataset.editFinishingService, "finishing");
          return;
        }

        const deleteFinishing = event.target.closest("[data-delete-finishing-service]");
        if (deleteFinishing) {
          openDeleteServiceModal(deleteFinishing.dataset.deleteFinishingService);
          return;
        }

        const breakdownFinishing = event.target.closest("[data-breakdown-finishing-service]");
        if (breakdownFinishing) {
          openServiceBreakdownModal(breakdownFinishing.dataset.breakdownFinishingService);
          return;
        }
      });

      document.querySelector(".content").addEventListener("focusin", (event) => {
        if (event.target.id === "fg-combo-search" && !state.fgSelectorOpen) {
          showFgComboList();
        }
        if (event.target.id === "cc-style-search" && !state.ccStyleSelectorOpen) {
          const start = event.target.selectionStart;
          const end = event.target.selectionEnd;
          state.ccStyleSelectorOpen = true;
          renderCostCalculatorStylePicker();
          refreshIcons();
          restoreFocus("cc-style-search", start, end);
        }
        if (event.target.closest("[data-cc-ply]") && !event.target.disabled) {
          if (openCostCalculatorStyleFormulas()) refreshCostCalculatorStyleFormulas();
        }
      });

      document.addEventListener("click", (event) => {
        if (state.fgSelectorOpen && !event.target.closest("#fg-combo") && !event.target.closest("#fg-combo-toggle")) {
          state.fgSelectorOpen = false;
          if (state.currentPage === "bom-costing") {
            renderFinishedGoodSelector();
            refreshIcons();
          }
        }
        if (state.ccStyleSelectorOpen && !event.target.closest("#cc-style-combo")) {
          state.ccStyleSelectorOpen = false;
          state.ccStyleSearch = "";
          renderCostCalculatorStylePicker();
          refreshIcons();
        }
      });

      window.addEventListener("scroll", () => {
        updateBomFlowFromViewport();
      }, { passive: true });

      document.getElementById("modal-backdrop").addEventListener("click", (event) => {
        if (event.target.id === "modal-backdrop" || event.target.closest("[data-modal-close]")) {
          closeModal();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && state.modal && state.modal.type) {
          closeModal();
        }
        if (event.key === "Enter" || event.key === " ") {
          const dashboardNav = event.target.closest("[data-dashboard-nav]");
          if (dashboardNav && dashboardNav.closest("#page-dashboard")) {
            event.preventDefault();
            navigateTo(dashboardNav.dataset.dashboardNav);
          }
        }
      });

      document.getElementById("modal-dialog").addEventListener("change", (event) => {
        if (event.target.id === "fb-type") {
          state.modal.draft.type = event.target.value;
          if (event.target.value === "Style") state.modal.draft.purpose = null;
          renderModal();
          restoreFocus("fb-type");
          return;
        }
        if (event.target.id === "fb-purpose") {
          state.modal.draft.purpose = event.target.value || null;
          return;
        }
        if (event.target.id === "fb-service-length") {
          state.modal.draft.serviceLength = event.target.checked;
          if (event.target.checked) {
            state.modal.draft.serviceWidth = false;
            state.modal.draft.coveredArea = false;
            renderModal();
            restoreFocus("fb-service-length");
          }
          return;
        }
        if (event.target.id === "fb-service-width") {
          state.modal.draft.serviceWidth = event.target.checked;
          if (event.target.checked) {
            state.modal.draft.serviceLength = false;
            state.modal.draft.coveredArea = false;
            renderModal();
            restoreFocus("fb-service-width");
          }
          return;
        }
        if (event.target.id === "fb-covered-area") {
          state.modal.draft.coveredArea = event.target.checked;
          if (event.target.checked) {
            state.modal.draft.serviceLength = false;
            state.modal.draft.serviceWidth = false;
            renderModal();
            restoreFocus("fb-covered-area");
          }
          return;
        }
        if (updateFinishedGoodDraftFromEvent(event.target)) {
          if (event.target.id === "fg-dim-l") normalizeDraftNumber(event.target, "L", "dimension");
          else if (event.target.id === "fg-dim-w") normalizeDraftNumber(event.target, "W", "dimension");
          else if (event.target.id === "fg-dim-h") normalizeDraftNumber(event.target, "H", "dimension");
          return;
        }
        if (updateRawMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "rm-gsm") normalizeDraftNumber(event.target, "gsm", "gsm");
          if (event.target.id === "rm-category") renderModal();
          restoreFocus(event.target.id);
          return;
        }
        if (updateOtherRawMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "orm-gsm") normalizeDraftNumber(event.target, "gsm", "gsm");
          if (event.target.id === "orm-category") renderModal();
          restoreFocus(event.target.id);
          return;
        }
        if (updateMaterialRateDraftFromEvent(event.target)) {
          if (event.target.id === "mrate-rate") normalizeDraftNumber(event.target, "rate", "rate", true);
          return;
        }
        if (updateOtherMaterialRateDraftFromEvent(event.target)) {
          if (event.target.id === "omrate-rate") normalizeDraftNumber(event.target, "rate", "rate", true);
          return;
        }
        const materialDimChange = updateMaterialDimensionLinkDraftFromEvent(event.target);
        if (materialDimChange) {
          if (materialDimChange === "rerender") {
            renderModal();
            refreshIcons();
            restoreFocus(event.target.id);
          }
          return;
        }
        const otherMaterialDimChange = updateOtherMaterialDimensionLinkDraftFromEvent(event.target);
        if (otherMaterialDimChange) {
          if (otherMaterialDimChange === "rerender") {
            renderModal();
            refreshIcons();
            restoreFocus(event.target.id);
          }
          return;
        }
        if (updateServiceMasterDraftFromEvent(event.target)) {
          return;
        }
        if (updateServiceRateDraftFromEvent(event.target)) {
          if (event.target.id === "srate-rate") normalizeDraftNumber(event.target, "rate", "rate", true);
          return;
        }
        const serviceDimChange = updateServiceDimensionLinkDraftFromEvent(event.target);
        if (serviceDimChange) {
          if (serviceDimChange === "rerender") {
            renderModal();
            refreshIcons();
            restoreFocus(event.target.id);
          }
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
        if (updateFixedVariableDraftFromEvent(event.target)) return;
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
          if (event.target.id === "modal-service-rate") normalizeDraftNumber(event.target, "manualRate", "rate");
          restoreFocus(event.target.id);
          return;
        }
        if (updateMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "modal-manual-qty") normalizeDraftNumber(event.target, "manualQty", "quantity");
          if (event.target.id === "modal-manual-rate") normalizeDraftNumber(event.target, "manualRate", "rate");
          if (event.target.id === "modal-wastage") normalizeDraftNumber(event.target, "wastagePercent", "wastage");
          restoreFocus(event.target.id);
        }
        if (updateOtherMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "modal-other-manual-qty") normalizeDraftNumber(event.target, "manualQty", "quantity");
          if (event.target.id === "modal-other-manual-rate") normalizeDraftNumber(event.target, "manualRate", "rate");
          if (event.target.id === "modal-other-wastage") normalizeDraftNumber(event.target, "wastagePercent", "wastage");
          restoreFocus(event.target.id);
        }
      });

      document.getElementById("modal-dialog").addEventListener("input", (event) => {
        const caretStart = event.target.selectionStart;
        const caretEnd = event.target.selectionEnd;
        if (event.target.id === "modal-manual-qty" || event.target.id === "modal-manual-rate" || event.target.id === "modal-wastage" || event.target.id === "modal-material-custom-length" || event.target.id === "modal-material-custom-width") {
          updateMaterialDraftFromEvent(event.target);
          return;
        }
        if (event.target.id === "modal-other-manual-qty" || event.target.id === "modal-other-manual-rate" || event.target.id === "modal-other-wastage") {
          updateOtherMaterialDraftFromEvent(event.target);
          return;
        }
        if (event.target.id === "modal-service-qty" || event.target.id === "modal-service-rate" || event.target.id === "modal-service-custom-length" || event.target.id === "modal-service-custom-width") {
          updateServiceDraftFromEvent(event.target);
          return;
        }
        if (updateFinishedGoodDraftFromEvent(event.target)) return;
        if (updateRawMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "rm-code") applyUppercasePreservingCaret(event.target);
          return;
        }
        if (updateOtherRawMaterialDraftFromEvent(event.target)) {
          if (event.target.id === "orm-code") applyUppercasePreservingCaret(event.target);
          return;
        }
        if (updateMaterialRateDraftFromEvent(event.target)) return;
        if (updateOtherMaterialRateDraftFromEvent(event.target)) return;
        if (updateServiceMasterDraftFromEvent(event.target)) {
          if (event.target.id === "srv-code") applyUppercasePreservingCaret(event.target);
          return;
        }
        if (updateServiceRateDraftFromEvent(event.target)) return;
        if (updateStyleDraftFromEvent(event.target)) return;
        const pendingChange = updatePendingStyleVariableFromEvent(event.target);
        if (pendingChange) {
          if (pendingChange === "rerender") {
            renderModal();
            refreshIcons();
            restoreFocus(event.target.id, caretStart, caretEnd);
          }
          return;
        }
        if (updateStyleVariableDraftFromEvent(event.target)) return;
        if (updateFormulaVariableDraftFromEvent(event.target)) {
          if (event.target.id === "fvar-code") applyUppercasePreservingCaret(event.target);
          return;
        }
        if (updateFixedVariableDraftFromEvent(event.target)) {
          if (event.target.id === "fixedvar-code") applyUppercasePreservingCaret(event.target);
          return;
        }
        if (updateDimensionDraftFromEvent(event.target)) {
          if (event.target.id === "dim-l" || event.target.id === "dim-w") {
            refreshDimensionCodePreview();
          }
          return;
        }
        if (!state.modal.draft) return;
        if (event.target.id === "fb-name") state.modal.draft.name = event.target.value;
        if (event.target.id === "fb-code") {
          applyUppercasePreservingCaret(event.target);
          state.modal.draft.code = event.target.value;
        }
        if (event.target.id === "fb-description") state.modal.draft.description = event.target.value;
        if (event.target.dataset.testVar) {
          state.modal.draft.testValues[event.target.dataset.testVar] = event.target.value;
        }
        if (event.target.id === "fb-expression") {
          state.modal.draft.expression = event.target.value;
          state.modal.cursor = caretStart;
          state.modal.draft.testResult = null;
          renderModal();
          restoreFocus("fb-expression", caretStart, caretEnd);
        }
      });

      document.getElementById("modal-dialog").addEventListener("click", (event) => {
        const prettyOption = event.target.closest("[data-pretty-select]");
        if (prettyOption) {
          const select = document.getElementById(prettyOption.dataset.prettySelect);
          const wrap = prettyOption.closest(".pretty-select");
          if (select && wrap) {
            select.value = prettyOption.dataset.prettyValue;
            wrap.querySelectorAll(".pretty-select-option").forEach((btn) => {
              const selected = btn === prettyOption;
              btn.classList.toggle("selected", selected);
              btn.setAttribute("aria-selected", selected ? "true" : "false");
            });
            const valueEl = wrap.querySelector(".pretty-select-value");
            if (valueEl) valueEl.textContent = prettyOption.textContent;
            wrap.classList.remove("open");
            const trigger = wrap.querySelector(".pretty-select-trigger");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
            select.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return;
        }
        const prettyTrigger = event.target.closest(".pretty-select-trigger");
        if (prettyTrigger) {
          const wrap = prettyTrigger.closest(".pretty-select");
          const willOpen = wrap && !wrap.classList.contains("open");
          document.querySelectorAll(".pretty-select.open").forEach((el) => {
            el.classList.remove("open");
            const otherTrigger = el.querySelector(".pretty-select-trigger");
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          });
          if (wrap) {
            wrap.classList.toggle("open", willOpen);
            prettyTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
          }
          return;
        }
        document.querySelectorAll(".pretty-select.open").forEach((el) => {
          el.classList.remove("open");
          const trigger = el.querySelector(".pretty-select-trigger");
          if (trigger) trigger.setAttribute("aria-expanded", "false");
        });
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
          if (state.modal.type === "finishing-service") saveFinishingServiceFromModal();
          else saveFinishedGoodFromModal();
          return;
        }
        if (event.target.closest("#btn-save-raw-material")) {
          saveRawMaterialFromModal();
          return;
        }
        if (event.target.closest("#btn-save-material-rate")) {
          saveMaterialRateFromModal();
          return;
        }
        if (event.target.closest("#btn-add-material-dimension")) {
          openMaterialDimensionLinkModal();
          return;
        }
        if (event.target.closest("#btn-save-material-dimension")) {
          saveMaterialDimensionLinkFromModal();
          return;
        }
        if (event.target.closest("#btn-back-material-edit")) {
          backToMaterialEdit();
          return;
        }
        const materialTab = event.target.closest("[data-material-tab]");
        if (materialTab) {
          state.modal.materialTab = materialTab.dataset.materialTab;
          renderModal();
          refreshIcons();
          return;
        }
        const editMaterialDim = event.target.closest("[data-edit-material-dim]");
        if (editMaterialDim) {
          openMaterialDimensionLinkModal(editMaterialDim.dataset.editMaterialDim);
          return;
        }
        const deleteMaterialDim = event.target.closest("[data-delete-material-dim]");
        if (deleteMaterialDim) {
          removeMaterialDimensionLink(deleteMaterialDim.dataset.deleteMaterialDim);
          return;
        }
        if (event.target.closest("#btn-save-other-raw-material")) {
          saveOtherRawMaterialFromModal();
          return;
        }
        if (event.target.closest("#btn-save-other-material-rate")) {
          saveOtherMaterialRateFromModal();
          return;
        }
        if (event.target.closest("#btn-add-other-material-dimension")) {
          openOtherMaterialDimensionLinkModal();
          return;
        }
        if (event.target.closest("#btn-save-other-material-dimension")) {
          saveOtherMaterialDimensionLinkFromModal();
          return;
        }
        if (event.target.closest("#btn-back-other-material-edit")) {
          backToOtherMaterialEdit();
          return;
        }
        const otherMaterialTab = event.target.closest("[data-other-material-tab]");
        if (otherMaterialTab) {
          state.modal.otherMaterialTab = otherMaterialTab.dataset.otherMaterialTab;
          renderModal();
          refreshIcons();
          return;
        }
        const editOtherMaterialDim = event.target.closest("[data-edit-other-material-dim]");
        if (editOtherMaterialDim) {
          openOtherMaterialDimensionLinkModal(editOtherMaterialDim.dataset.editOtherMaterialDim);
          return;
        }
        const deleteOtherMaterialDim = event.target.closest("[data-delete-other-material-dim]");
        if (deleteOtherMaterialDim) {
          removeOtherMaterialDimensionLink(deleteOtherMaterialDim.dataset.deleteOtherMaterialDim);
          return;
        }
        if (event.target.closest("#btn-save-service-master")) {
          saveServiceMasterFromModal();
          return;
        }
        if (event.target.closest("#btn-save-service-rate")) {
          saveServiceRateFromModal();
          return;
        }
        if (event.target.closest("#btn-add-service-dimension")) {
          openServiceDimensionLinkModal();
          return;
        }
        if (event.target.closest("#btn-save-service-dimension")) {
          saveServiceDimensionLinkFromModal();
          return;
        }
        if (event.target.closest("#btn-back-service-edit")) {
          backToServiceEdit();
          return;
        }
        const serviceTab = event.target.closest("[data-service-tab]");
        if (serviceTab) {
          state.modal.serviceTab = serviceTab.dataset.serviceTab;
          renderModal();
          refreshIcons();
          return;
        }
        const editServiceDim = event.target.closest("[data-edit-service-dim]");
        if (editServiceDim) {
          openServiceDimensionLinkModal(editServiceDim.dataset.editServiceDim);
          return;
        }
        const deleteServiceDim = event.target.closest("[data-delete-service-dim]");
        if (deleteServiceDim) {
          removeServiceDimensionLink(deleteServiceDim.dataset.deleteServiceDim);
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
          state.modal.styleTab = styleTab.dataset.styleTab === "formulas" ? "formulas" : "info";
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
          openMasterDeleteModal("style-variable", deleteStyleVar.dataset.deleteStyleVar, row ? `${row.variableCode} (${normalizeStylePly(row.ply, 3)} ply)` : "this variable");
          state.modal.parentStyle = parent;
          return;
        }
        if (event.target.closest("#btn-save-formula-variable")) {
          saveFormulaVariableFromModal();
          return;
        }
        if (event.target.closest("#btn-save-fixed-variable")) {
          saveFixedVariableFromModal();
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
        if (event.target.closest("#btn-save-other-material")) {
          saveOtherMaterialFromModal();
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
        if (event.target.closest("#btn-confirm-delete-other")) {
          confirmDeleteOtherMaterial();
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
      try {
        if (typeof auth.authStateReady === "function") await auth.authStateReady();
      } catch (error) {
        console.error("Auth initialization failed", error);
      }
      if (auth.currentUser) {
        rememberCloudUser(auth.currentUser);
        lastReconciledUid = auth.currentUser.uid;
        try {
          await reconcileCloudOnLogin();
        } catch (error) {
          console.error("Cloud reconcile on boot failed", error);
        }
      } else if (pendingCloudInit) {
        try {
          userClearedAllData = false;
          hydratedFromSeed = false;
          pendingCloudInit = false;
          if (idbReady) await persistUserDataStores();
        } catch (error) {
          console.error("Failed to initialize empty catalog", error);
        }
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
      showPendingQtyFormulaMigrationNotice();
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
