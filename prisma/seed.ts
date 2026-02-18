import { PrismaClient, ConversionType, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

interface UnitDef {
  name: string;
  symbol: string;
  slug: string;
  isBaseUnit?: boolean;
  notes?: string;
  sortOrder?: number;
}

interface ConvDef {
  from: string;
  to: string;
  type: ConversionType;
  factor: number;
  offset: number;
  precision: number;
  formulaText: string;
  isPopular?: boolean;
}

const categories = [
  { name: "Length", slug: "length", description: "Convert between metric and imperial length units including meters, feet, inches, kilometers, and miles.", icon: "Ruler", featured: true, sortOrder: 1 },
  { name: "Weight & Mass", slug: "weight", description: "Convert between weight and mass units such as kilograms, pounds, ounces, grams, and stones.", icon: "Weight", featured: true, sortOrder: 2 },
  { name: "Temperature", slug: "temperature", description: "Convert between Celsius, Fahrenheit, and Kelvin temperature scales.", icon: "Thermometer", featured: true, sortOrder: 3 },
  { name: "Area", slug: "area", description: "Convert between area units including square meters, square feet, acres, and hectares.", icon: "Square", featured: true, sortOrder: 4 },
  { name: "Volume", slug: "volume", description: "Convert between volume units such as liters, gallons, cups, milliliters, and cubic meters.", icon: "Beaker", featured: true, sortOrder: 5 },
  { name: "Speed", slug: "speed", description: "Convert between speed units including km/h, mph, m/s, and knots.", icon: "Gauge", featured: true, sortOrder: 6 },
  { name: "Time", slug: "time", description: "Convert between time units including seconds, minutes, hours, days, and weeks.", icon: "Clock", featured: true, sortOrder: 7 },
  { name: "Digital Storage", slug: "data", description: "Convert between digital storage units such as bytes, kilobytes, megabytes, gigabytes, and terabytes.", icon: "HardDrive", featured: true, sortOrder: 8 },
  { name: "Pressure", slug: "pressure", description: "Convert between pressure units including Pascal, bar, psi, and atmospheres.", icon: "ArrowDownUp", featured: false, sortOrder: 9 },
  { name: "Energy", slug: "energy", description: "Convert between energy units such as joules, calories, kilowatt-hours, and BTU.", icon: "Zap", featured: false, sortOrder: 10 },
  { name: "Power", slug: "power", description: "Convert between power units including watts, kilowatts, horsepower, and BTU/hour.", icon: "Activity", featured: false, sortOrder: 11 },
  { name: "Fuel Economy", slug: "fuel", description: "Convert between fuel economy units such as MPG, L/100km, and km/L.", icon: "Fuel", featured: false, sortOrder: 12 },
];

const unitsByCategory: Record<string, UnitDef[]> = {
  length: [
    { name: "Millimeter", symbol: "mm", slug: "mm", sortOrder: 1 },
    { name: "Centimeter", symbol: "cm", slug: "cm", sortOrder: 2 },
    { name: "Meter", symbol: "m", slug: "m", isBaseUnit: true, sortOrder: 3 },
    { name: "Kilometer", symbol: "km", slug: "km", sortOrder: 4 },
    { name: "Inch", symbol: "in", slug: "inches", sortOrder: 5 },
    { name: "Foot", symbol: "ft", slug: "feet", sortOrder: 6 },
    { name: "Yard", symbol: "yd", slug: "yards", sortOrder: 7 },
    { name: "Mile", symbol: "mi", slug: "miles", sortOrder: 8 },
  ],
  weight: [
    { name: "Milligram", symbol: "mg", slug: "mg", sortOrder: 1 },
    { name: "Gram", symbol: "g", slug: "g", sortOrder: 2 },
    { name: "Kilogram", symbol: "kg", slug: "kg", isBaseUnit: true, sortOrder: 3 },
    { name: "Metric Ton", symbol: "t", slug: "metric-ton", sortOrder: 4 },
    { name: "Ounce", symbol: "oz", slug: "oz", sortOrder: 5 },
    { name: "Pound", symbol: "lb", slug: "lb", sortOrder: 6 },
    { name: "Stone", symbol: "st", slug: "stone", sortOrder: 7 },
  ],
  temperature: [
    { name: "Celsius", symbol: "°C", slug: "celsius", isBaseUnit: true, sortOrder: 1 },
    { name: "Fahrenheit", symbol: "°F", slug: "fahrenheit", sortOrder: 2 },
    { name: "Kelvin", symbol: "K", slug: "kelvin", sortOrder: 3 },
  ],
  area: [
    { name: "Square Millimeter", symbol: "mm²", slug: "sqmm", sortOrder: 1 },
    { name: "Square Centimeter", symbol: "cm²", slug: "sqcm", sortOrder: 2 },
    { name: "Square Meter", symbol: "m²", slug: "sqm", isBaseUnit: true, sortOrder: 3 },
    { name: "Square Kilometer", symbol: "km²", slug: "sqkm", sortOrder: 4 },
    { name: "Square Inch", symbol: "in²", slug: "sqin", sortOrder: 5 },
    { name: "Square Foot", symbol: "ft²", slug: "sqft", sortOrder: 6 },
    { name: "Square Yard", symbol: "yd²", slug: "sqyd", sortOrder: 7 },
    { name: "Acre", symbol: "ac", slug: "acre", sortOrder: 8 },
    { name: "Hectare", symbol: "ha", slug: "hectare", sortOrder: 9 },
    { name: "Square Mile", symbol: "mi²", slug: "sqmi", sortOrder: 10 },
  ],
  volume: [
    { name: "Milliliter", symbol: "mL", slug: "ml", sortOrder: 1 },
    { name: "Liter", symbol: "L", slug: "l", isBaseUnit: true, sortOrder: 2 },
    { name: "Cubic Meter", symbol: "m³", slug: "m3", sortOrder: 3 },
    { name: "Teaspoon", symbol: "tsp", slug: "tsp", sortOrder: 4 },
    { name: "Tablespoon", symbol: "tbsp", slug: "tbsp", sortOrder: 5 },
    { name: "Cup (US)", symbol: "cup", slug: "cup", sortOrder: 6 },
    { name: "Pint (US)", symbol: "pt", slug: "pint", sortOrder: 7 },
    { name: "Quart (US)", symbol: "qt", slug: "quart", sortOrder: 8 },
    { name: "Gallon (US)", symbol: "gal", slug: "gallon", sortOrder: 9 },
    { name: "Fluid Ounce (US)", symbol: "fl oz", slug: "floz", sortOrder: 10 },
  ],
  speed: [
    { name: "Meters per Second", symbol: "m/s", slug: "ms", isBaseUnit: true, sortOrder: 1 },
    { name: "Kilometers per Hour", symbol: "km/h", slug: "kmh", sortOrder: 2 },
    { name: "Miles per Hour", symbol: "mph", slug: "mph", sortOrder: 3 },
    { name: "Knot", symbol: "kn", slug: "knots", sortOrder: 4 },
    { name: "Feet per Second", symbol: "ft/s", slug: "fts", sortOrder: 5 },
  ],
  time: [
    { name: "Millisecond", symbol: "ms", slug: "millisecond", sortOrder: 1 },
    { name: "Second", symbol: "s", slug: "seconds", isBaseUnit: true, sortOrder: 2 },
    { name: "Minute", symbol: "min", slug: "minutes", sortOrder: 3 },
    { name: "Hour", symbol: "hr", slug: "hours", sortOrder: 4 },
    { name: "Day", symbol: "d", slug: "days", sortOrder: 5 },
    { name: "Week", symbol: "wk", slug: "weeks", sortOrder: 6 },
    { name: "Month", symbol: "mo", slug: "months", sortOrder: 7 },
    { name: "Year", symbol: "yr", slug: "years", sortOrder: 8 },
  ],
  data: [
    { name: "Bit", symbol: "b", slug: "bit", sortOrder: 1 },
    { name: "Byte", symbol: "B", slug: "byte", isBaseUnit: true, sortOrder: 2 },
    { name: "Kilobyte", symbol: "KB", slug: "kb", sortOrder: 3 },
    { name: "Megabyte", symbol: "MB", slug: "mb", sortOrder: 4 },
    { name: "Gigabyte", symbol: "GB", slug: "gb", sortOrder: 5 },
    { name: "Terabyte", symbol: "TB", slug: "tb", sortOrder: 6 },
    { name: "Petabyte", symbol: "PB", slug: "pb", sortOrder: 7 },
  ],
  pressure: [
    { name: "Pascal", symbol: "Pa", slug: "pascal", isBaseUnit: true, sortOrder: 1 },
    { name: "Kilopascal", symbol: "kPa", slug: "kpa", sortOrder: 2 },
    { name: "Bar", symbol: "bar", slug: "bar", sortOrder: 3 },
    { name: "PSI", symbol: "psi", slug: "psi", sortOrder: 4 },
    { name: "Atmosphere", symbol: "atm", slug: "atm", sortOrder: 5 },
    { name: "Torr", symbol: "Torr", slug: "torr", sortOrder: 6 },
  ],
  energy: [
    { name: "Joule", symbol: "J", slug: "joule", isBaseUnit: true, sortOrder: 1 },
    { name: "Kilojoule", symbol: "kJ", slug: "kj", sortOrder: 2 },
    { name: "Calorie", symbol: "cal", slug: "calorie", sortOrder: 3 },
    { name: "Kilocalorie", symbol: "kcal", slug: "kcal", sortOrder: 4 },
    { name: "Watt-hour", symbol: "Wh", slug: "wh", sortOrder: 5 },
    { name: "Kilowatt-hour", symbol: "kWh", slug: "kwh", sortOrder: 6 },
    { name: "BTU", symbol: "BTU", slug: "btu", sortOrder: 7 },
  ],
  power: [
    { name: "Watt", symbol: "W", slug: "watt", isBaseUnit: true, sortOrder: 1 },
    { name: "Kilowatt", symbol: "kW", slug: "kw", sortOrder: 2 },
    { name: "Megawatt", symbol: "MW", slug: "mw-power", sortOrder: 3 },
    { name: "Horsepower", symbol: "hp", slug: "hp", sortOrder: 4 },
    { name: "BTU per Hour", symbol: "BTU/h", slug: "btuh", sortOrder: 5 },
  ],
  fuel: [
    { name: "Miles per Gallon (US)", symbol: "mpg", slug: "mpg", isBaseUnit: true, sortOrder: 1 },
    { name: "Liters per 100km", symbol: "L/100km", slug: "l100km", sortOrder: 2 },
    { name: "Kilometers per Liter", symbol: "km/L", slug: "kml", sortOrder: 3 },
  ],
};

function makeConversions(catSlug: string, pairs: [string, string, number, number?, boolean?][]): ConvDef[] {
  return pairs.map(([from, to, factor, offset, popular]) => ({
    from,
    to,
    type: (offset !== undefined && offset !== 0) ? ConversionType.AFFINE : ConversionType.LINEAR,
    factor,
    offset: offset || 0,
    precision: 6,
    formulaText: (offset !== undefined && offset !== 0)
      ? `result = value × ${factor} + ${offset}`
      : `result = value × ${factor}`,
    isPopular: popular ?? false,
  }));
}

const conversionDefs: ConvDef[] = [
  // LENGTH (base: meter)
  ...makeConversions("length", [
    ["mm", "cm", 0.1, 0, true],
    ["mm", "m", 0.001, 0],
    ["mm", "inches", 0.0393701, 0],
    ["cm", "mm", 10, 0],
    ["cm", "m", 0.01, 0, true],
    ["cm", "inches", 0.393701, 0, true],
    ["cm", "feet", 0.0328084, 0, true],
    ["m", "cm", 100, 0, true],
    ["m", "mm", 1000, 0],
    ["m", "km", 0.001, 0],
    ["m", "feet", 3.28084, 0, true],
    ["m", "yards", 1.09361, 0, true],
    ["m", "inches", 39.3701, 0],
    ["m", "miles", 0.000621371, 0],
    ["km", "m", 1000, 0, true],
    ["km", "miles", 0.621371, 0, true],
    ["km", "feet", 3280.84, 0],
    ["km", "yards", 1093.61, 0],
    ["inches", "cm", 2.54, 0, true],
    ["inches", "mm", 25.4, 0, true],
    ["inches", "feet", 0.0833333, 0, true],
    ["inches", "m", 0.0254, 0],
    ["feet", "m", 0.3048, 0, true],
    ["feet", "cm", 30.48, 0, true],
    ["feet", "inches", 12, 0, true],
    ["feet", "yards", 0.333333, 0],
    ["feet", "km", 0.0003048, 0],
    ["feet", "miles", 0.000189394, 0],
    ["yards", "m", 0.9144, 0, true],
    ["yards", "feet", 3, 0, true],
    ["yards", "miles", 0.000568182, 0],
    ["miles", "km", 1.60934, 0, true],
    ["miles", "m", 1609.34, 0],
    ["miles", "feet", 5280, 0, true],
    ["miles", "yards", 1760, 0],
  ]),

  // WEIGHT (base: kg)
  ...makeConversions("weight", [
    ["mg", "g", 0.001, 0],
    ["g", "mg", 1000, 0],
    ["g", "kg", 0.001, 0, true],
    ["g", "oz", 0.035274, 0, true],
    ["g", "lb", 0.00220462, 0],
    ["kg", "g", 1000, 0, true],
    ["kg", "lb", 2.20462, 0, true],
    ["kg", "oz", 35.274, 0, true],
    ["kg", "stone", 0.157473, 0, true],
    ["kg", "metric-ton", 0.001, 0],
    ["lb", "kg", 0.453592, 0, true],
    ["lb", "g", 453.592, 0, true],
    ["lb", "oz", 16, 0, true],
    ["lb", "stone", 0.0714286, 0, true],
    ["oz", "g", 28.3495, 0, true],
    ["oz", "kg", 0.0283495, 0],
    ["oz", "lb", 0.0625, 0, true],
    ["stone", "kg", 6.35029, 0, true],
    ["stone", "lb", 14, 0, true],
    ["metric-ton", "kg", 1000, 0],
    ["metric-ton", "lb", 2204.62, 0],
  ]),

  // TEMPERATURE (affine conversions)
  {
    from: "celsius", to: "fahrenheit", type: ConversionType.AFFINE,
    factor: 1.8, offset: 32, precision: 2,
    formulaText: "°F = °C × 1.8 + 32", isPopular: true,
  },
  {
    from: "fahrenheit", to: "celsius", type: ConversionType.AFFINE,
    factor: 0.555556, offset: -17.7778, precision: 2,
    formulaText: "°C = (°F − 32) × 5/9", isPopular: true,
  },
  {
    from: "celsius", to: "kelvin", type: ConversionType.AFFINE,
    factor: 1, offset: 273.15, precision: 2,
    formulaText: "K = °C + 273.15", isPopular: true,
  },
  {
    from: "kelvin", to: "celsius", type: ConversionType.AFFINE,
    factor: 1, offset: -273.15, precision: 2,
    formulaText: "°C = K − 273.15", isPopular: true,
  },
  {
    from: "fahrenheit", to: "kelvin", type: ConversionType.AFFINE,
    factor: 0.555556, offset: 255.3722, precision: 2,
    formulaText: "K = (°F − 32) × 5/9 + 273.15", isPopular: false,
  },
  {
    from: "kelvin", to: "fahrenheit", type: ConversionType.AFFINE,
    factor: 1.8, offset: -459.67, precision: 2,
    formulaText: "°F = K × 1.8 − 459.67", isPopular: false,
  },

  // AREA (base: sqm)
  ...makeConversions("area", [
    ["sqmm", "sqcm", 0.01, 0],
    ["sqcm", "sqmm", 100, 0],
    ["sqcm", "sqm", 0.0001, 0],
    ["sqm", "sqcm", 10000, 0],
    ["sqm", "sqft", 10.7639, 0, true],
    ["sqm", "sqyd", 1.19599, 0],
    ["sqm", "sqkm", 0.000001, 0],
    ["sqm", "acre", 0.000247105, 0],
    ["sqm", "hectare", 0.0001, 0],
    ["sqft", "sqm", 0.092903, 0, true],
    ["sqft", "sqin", 144, 0],
    ["sqft", "acre", 0.0000229568, 0],
    ["sqin", "sqcm", 6.4516, 0],
    ["sqin", "sqft", 0.00694444, 0],
    ["sqyd", "sqm", 0.836127, 0],
    ["sqyd", "sqft", 9, 0],
    ["acre", "sqm", 4046.86, 0, true],
    ["acre", "sqft", 43560, 0, true],
    ["acre", "hectare", 0.404686, 0, true],
    ["acre", "sqmi", 0.0015625, 0],
    ["hectare", "sqm", 10000, 0, true],
    ["hectare", "acre", 2.47105, 0, true],
    ["hectare", "sqkm", 0.01, 0],
    ["sqkm", "sqm", 1000000, 0],
    ["sqkm", "sqmi", 0.386102, 0],
    ["sqkm", "hectare", 100, 0],
    ["sqkm", "acre", 247.105, 0],
    ["sqmi", "sqkm", 2.58999, 0],
    ["sqmi", "acre", 640, 0, true],
  ]),

  // VOLUME (base: liter)
  ...makeConversions("volume", [
    ["ml", "l", 0.001, 0, true],
    ["ml", "tsp", 0.202884, 0],
    ["ml", "tbsp", 0.067628, 0],
    ["ml", "floz", 0.033814, 0],
    ["l", "ml", 1000, 0, true],
    ["l", "m3", 0.001, 0],
    ["l", "cup", 4.22675, 0, true],
    ["l", "pint", 2.11338, 0],
    ["l", "quart", 1.05669, 0],
    ["l", "gallon", 0.264172, 0, true],
    ["l", "floz", 33.814, 0],
    ["m3", "l", 1000, 0],
    ["m3", "gallon", 264.172, 0],
    ["tsp", "ml", 4.92892, 0, true],
    ["tsp", "tbsp", 0.333333, 0],
    ["tbsp", "ml", 14.7868, 0, true],
    ["tbsp", "tsp", 3, 0],
    ["tbsp", "cup", 0.0625, 0],
    ["cup", "ml", 236.588, 0, true],
    ["cup", "l", 0.236588, 0, true],
    ["cup", "tbsp", 16, 0],
    ["cup", "floz", 8, 0],
    ["cup", "pint", 0.5, 0],
    ["pint", "ml", 473.176, 0],
    ["pint", "cup", 2, 0, true],
    ["pint", "quart", 0.5, 0],
    ["pint", "l", 0.473176, 0],
    ["quart", "l", 0.946353, 0],
    ["quart", "pint", 2, 0],
    ["quart", "gallon", 0.25, 0],
    ["gallon", "l", 3.78541, 0, true],
    ["gallon", "quart", 4, 0, true],
    ["gallon", "pint", 8, 0],
    ["gallon", "cup", 16, 0],
    ["gallon", "floz", 128, 0],
    ["gallon", "ml", 3785.41, 0],
    ["floz", "ml", 29.5735, 0, true],
    ["floz", "tbsp", 2, 0],
    ["floz", "cup", 0.125, 0],
  ]),

  // SPEED (base: m/s)
  ...makeConversions("speed", [
    ["ms", "kmh", 3.6, 0, true],
    ["ms", "mph", 2.23694, 0],
    ["ms", "knots", 1.94384, 0],
    ["ms", "fts", 3.28084, 0],
    ["kmh", "ms", 0.277778, 0],
    ["kmh", "mph", 0.621371, 0, true],
    ["kmh", "knots", 0.539957, 0],
    ["mph", "kmh", 1.60934, 0, true],
    ["mph", "ms", 0.44704, 0],
    ["mph", "knots", 0.868976, 0, true],
    ["mph", "fts", 1.46667, 0],
    ["knots", "kmh", 1.852, 0, true],
    ["knots", "mph", 1.15078, 0, true],
    ["knots", "ms", 0.514444, 0],
    ["fts", "ms", 0.3048, 0],
    ["fts", "mph", 0.681818, 0],
  ]),

  // TIME (base: seconds)
  ...makeConversions("time", [
    ["millisecond", "seconds", 0.001, 0],
    ["seconds", "millisecond", 1000, 0],
    ["seconds", "minutes", 0.0166667, 0, true],
    ["seconds", "hours", 0.000277778, 0],
    ["minutes", "seconds", 60, 0, true],
    ["minutes", "hours", 0.0166667, 0, true],
    ["minutes", "days", 0.000694444, 0],
    ["hours", "minutes", 60, 0, true],
    ["hours", "seconds", 3600, 0],
    ["hours", "days", 0.0416667, 0, true],
    ["hours", "weeks", 0.00595238, 0],
    ["days", "hours", 24, 0, true],
    ["days", "minutes", 1440, 0],
    ["days", "seconds", 86400, 0],
    ["days", "weeks", 0.142857, 0, true],
    ["weeks", "days", 7, 0, true],
    ["weeks", "hours", 168, 0],
    ["months", "days", 30.4167, 0],
    ["months", "weeks", 4.34524, 0],
    ["years", "days", 365.25, 0],
    ["years", "months", 12, 0, true],
    ["years", "weeks", 52.1775, 0],
    ["years", "hours", 8766, 0],
  ]),

  // DATA (binary: 1024-based)
  ...makeConversions("data", [
    ["bit", "byte", 0.125, 0],
    ["byte", "bit", 8, 0],
    ["byte", "kb", 0.000976563, 0],
    ["kb", "byte", 1024, 0, true],
    ["kb", "mb", 0.000976563, 0, true],
    ["mb", "kb", 1024, 0, true],
    ["mb", "gb", 0.000976563, 0, true],
    ["mb", "byte", 1048576, 0],
    ["gb", "mb", 1024, 0, true],
    ["gb", "tb", 0.000976563, 0, true],
    ["gb", "byte", 1073741824, 0],
    ["tb", "gb", 1024, 0, true],
    ["tb", "mb", 1048576, 0],
    ["tb", "pb", 0.000976563, 0],
    ["pb", "tb", 1024, 0],
    ["pb", "gb", 1048576, 0],
  ]),

  // PRESSURE (base: pascal)
  ...makeConversions("pressure", [
    ["pascal", "kpa", 0.001, 0],
    ["pascal", "bar", 0.00001, 0],
    ["pascal", "psi", 0.000145038, 0],
    ["pascal", "atm", 0.00000986923, 0],
    ["kpa", "pascal", 1000, 0],
    ["kpa", "bar", 0.01, 0, true],
    ["kpa", "psi", 0.145038, 0, true],
    ["kpa", "atm", 0.00986923, 0],
    ["bar", "pascal", 100000, 0],
    ["bar", "kpa", 100, 0, true],
    ["bar", "psi", 14.5038, 0, true],
    ["bar", "atm", 0.986923, 0],
    ["psi", "bar", 0.0689476, 0, true],
    ["psi", "kpa", 6.89476, 0, true],
    ["psi", "atm", 0.068046, 0],
    ["psi", "pascal", 6894.76, 0],
    ["atm", "pascal", 101325, 0],
    ["atm", "bar", 1.01325, 0],
    ["atm", "psi", 14.696, 0, true],
    ["atm", "kpa", 101.325, 0],
    ["torr", "pascal", 133.322, 0],
    ["torr", "atm", 0.00131579, 0],
    ["pascal", "torr", 0.00750062, 0],
  ]),

  // ENERGY (base: joule)
  ...makeConversions("energy", [
    ["joule", "kj", 0.001, 0],
    ["joule", "calorie", 0.239006, 0],
    ["joule", "wh", 0.000277778, 0],
    ["joule", "btu", 0.000947817, 0],
    ["kj", "joule", 1000, 0],
    ["kj", "kcal", 0.239006, 0, true],
    ["kj", "calorie", 239.006, 0],
    ["kj", "btu", 0.947817, 0],
    ["calorie", "joule", 4.184, 0, true],
    ["calorie", "kj", 0.004184, 0],
    ["calorie", "kcal", 0.001, 0],
    ["kcal", "calorie", 1000, 0, true],
    ["kcal", "kj", 4.184, 0, true],
    ["kcal", "joule", 4184, 0],
    ["kcal", "btu", 3.96567, 0],
    ["wh", "joule", 3600, 0],
    ["wh", "kwh", 0.001, 0],
    ["kwh", "wh", 1000, 0],
    ["kwh", "joule", 3600000, 0],
    ["kwh", "kj", 3600, 0, true],
    ["kwh", "btu", 3412.14, 0],
    ["kwh", "kcal", 860.421, 0],
    ["btu", "joule", 1055.06, 0],
    ["btu", "kj", 1.05506, 0],
    ["btu", "kwh", 0.000293071, 0],
    ["btu", "kcal", 0.251996, 0],
  ]),

  // POWER (base: watt)
  ...makeConversions("power", [
    ["watt", "kw", 0.001, 0, true],
    ["watt", "hp", 0.00134102, 0],
    ["watt", "btuh", 3.41214, 0],
    ["kw", "watt", 1000, 0, true],
    ["kw", "hp", 1.34102, 0, true],
    ["kw", "mw-power", 0.001, 0],
    ["kw", "btuh", 3412.14, 0],
    ["mw-power", "kw", 1000, 0],
    ["mw-power", "watt", 1000000, 0],
    ["mw-power", "hp", 1341.02, 0],
    ["hp", "watt", 745.7, 0, true],
    ["hp", "kw", 0.7457, 0, true],
    ["hp", "btuh", 2544.43, 0],
    ["btuh", "watt", 0.293071, 0],
    ["btuh", "kw", 0.000293071, 0],
  ]),

  // FUEL ECONOMY
  ...makeConversions("fuel", [
    ["mpg", "kml", 0.425144, 0, true],
    ["kml", "mpg", 2.35215, 0, true],
  ]),
  // Special: mpg <-> L/100km is inverse, not linear scale
  // We'll approximate with factor for typical values
  // For mpg -> l100km: 235.215 / mpg. We store as factor for a reference point.
  // Actually, this is a non-linear inverse, which doesn't fit LINEAR/AFFINE.
  // We'll note it and use a linear approximation for the seed.
  // In practice, the converter UI can handle the inverse logic.
];

const defaultFaqs = [
  // Length
  { q: "How many centimeters are in an inch?", a: "There are exactly 2.54 centimeters in one inch. This is an internationally agreed-upon standard that has been used since 1959.", cat: "length", conv: "inches-to-cm" },
  { q: "What is the difference between a mile and a kilometer?", a: "A mile is approximately 1.609 kilometers. Miles are used in the US and UK, while kilometers are the standard in most other countries.", cat: "length", conv: "miles-to-km" },
  { q: "How do I convert feet to meters?", a: "To convert feet to meters, multiply the number of feet by 0.3048. For example, 10 feet = 10 × 0.3048 = 3.048 meters.", cat: "length", conv: "feet-to-m" },
  { q: "How many feet are in a yard?", a: "There are exactly 3 feet in one yard. This relationship has been standardized for centuries in the imperial measurement system.", cat: "length", conv: "yards-to-feet" },
  { q: "How many inches are in a foot?", a: "There are exactly 12 inches in one foot. This is a fundamental relationship in the imperial/US customary measurement system.", cat: "length", conv: "feet-to-inches" },
  { q: "How many meters are in a kilometer?", a: "There are exactly 1,000 meters in one kilometer. The prefix 'kilo' means thousand in the metric system.", cat: "length", conv: "km-to-m" },

  // Weight
  { q: "How many pounds are in a kilogram?", a: "One kilogram equals approximately 2.20462 pounds. This conversion is commonly used for body weight and cooking measurements internationally.", cat: "weight", conv: "kg-to-lb" },
  { q: "What is a stone in pounds?", a: "One stone equals exactly 14 pounds. The stone is commonly used in the UK and Ireland for measuring body weight.", cat: "weight", conv: "stone-to-lb" },
  { q: "How many ounces are in a pound?", a: "There are exactly 16 ounces in one pound. This applies to avoirdupois ounces, which are used for everyday weight measurements.", cat: "weight", conv: "lb-to-oz" },
  { q: "How many grams are in a kilogram?", a: "There are exactly 1,000 grams in one kilogram. The prefix 'kilo' means thousand in the metric system.", cat: "weight", conv: "kg-to-g" },

  // Temperature
  { q: "How do I convert Celsius to Fahrenheit?", a: "To convert Celsius to Fahrenheit, multiply the Celsius temperature by 1.8 (or 9/5) and add 32. Formula: °F = °C × 1.8 + 32. For example, 100°C = 100 × 1.8 + 32 = 212°F.", cat: "temperature", conv: "celsius-to-fahrenheit" },
  { q: "What is the formula for Fahrenheit to Celsius?", a: "To convert Fahrenheit to Celsius, subtract 32 from the Fahrenheit temperature and multiply by 5/9. Formula: °C = (°F − 32) × 5/9. For example, 72°F = (72 − 32) × 5/9 = 22.22°C.", cat: "temperature", conv: "fahrenheit-to-celsius" },
  { q: "What is absolute zero in Celsius and Fahrenheit?", a: "Absolute zero is 0 Kelvin, which equals −273.15°C or −459.67°F. It is the lowest possible temperature where all molecular motion stops.", cat: "temperature" },
  { q: "What temperature is the same in Celsius and Fahrenheit?", a: "The temperature −40 degrees is the same on both scales: −40°C = −40°F. This is the only temperature where the two scales intersect.", cat: "temperature" },

  // Area
  { q: "How many square feet are in an acre?", a: "There are exactly 43,560 square feet in one acre. An acre is commonly used for measuring land area in the United States and United Kingdom.", cat: "area", conv: "acre-to-sqft" },
  { q: "How many acres are in a hectare?", a: "One hectare equals approximately 2.471 acres. Hectares are the standard unit for measuring land area in most countries outside the US.", cat: "area", conv: "hectare-to-acre" },
  { q: "How do I convert square meters to square feet?", a: "Multiply the number of square meters by 10.7639 to get square feet. For example, 100 m² = 100 × 10.7639 = 1,076.39 ft².", cat: "area", conv: "sqm-to-sqft" },

  // Volume
  { q: "How many cups are in a liter?", a: "There are approximately 4.227 US cups in one liter. This conversion is helpful for cooking and baking when translating between metric and US recipes.", cat: "volume", conv: "l-to-cup" },
  { q: "How many liters are in a gallon?", a: "One US gallon equals approximately 3.785 liters. Note that UK (imperial) gallons are larger at about 4.546 liters.", cat: "volume", conv: "gallon-to-l" },
  { q: "How many tablespoons are in a cup?", a: "There are 16 tablespoons in one US cup. This is a common cooking conversion that helps when scaling recipes.", cat: "volume", conv: "cup-to-tbsp" },

  // Speed
  { q: "How do I convert km/h to mph?", a: "To convert km/h to mph, multiply by 0.621371. For example, 100 km/h ≈ 62.14 mph. This is useful when traveling between countries with different speed measurement systems.", cat: "speed", conv: "kmh-to-mph" },
  { q: "What is a knot in mph?", a: "One knot equals approximately 1.151 mph or 1.852 km/h. Knots are the standard speed unit in maritime and aviation navigation.", cat: "speed", conv: "knots-to-mph" },

  // Data
  { q: "What is the difference between KB and MB?", a: "In binary (computing) terms, 1 MB = 1,024 KB. In decimal (storage marketing) terms, 1 MB = 1,000 KB. Most operating systems use the binary definition.", cat: "data", conv: "mb-to-kb" },
  { q: "How many GB are in a TB?", a: "There are 1,024 GB in 1 TB (binary) or 1,000 GB in 1 TB (decimal). Hard drive manufacturers typically use the decimal definition, while operating systems use binary.", cat: "data", conv: "tb-to-gb" },
];

const seoTemplates = [
  { categorySlug: null, templateType: "title", template: "Convert {fromName} to {toName} | {fromSymbol} to {toSymbol} Converter - UnitWise" },
  { categorySlug: null, templateType: "meta", template: "Free online {fromName} to {toName} converter. Instantly convert {fromSymbol} to {toSymbol} with accurate results. Easy-to-use conversion calculator with formula explanation and examples." },
  { categorySlug: null, templateType: "intro", template: "Converting {fromName} ({fromSymbol}) to {toName} ({toSymbol}) is a common {categoryName} conversion used worldwide. Whether you're working on a project, studying, or just need a quick answer, our free online converter provides instant, accurate results. Simply enter your value in {fromName} and get the equivalent in {toName} immediately. Our tool handles all the math for you, so you can focus on what matters." },
  { categorySlug: null, templateType: "h1", template: "Convert {fromName} to {toName}" },
  { categorySlug: "length", templateType: "title", template: "{fromName} to {toName} Converter | Length Conversion Calculator - UnitWise" },
  { categorySlug: "weight", templateType: "title", template: "{fromName} to {toName} Converter | Weight Conversion Calculator - UnitWise" },
  { categorySlug: "temperature", templateType: "title", template: "{fromName} to {toName} Converter | Temperature Conversion - UnitWise" },
];

async function main() {
  console.log("🌱 Starting UnitWise seed...");

  // 1. Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@unitwise.online";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeThisStrongPassword";
  const passwordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: Role.ADMIN },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user created/updated: ${adminEmail}`);

  // 2. Site settings
  const siteUrl = process.env.SITE_URL || "https://unitwise.online";
  const siteSettings: [string, string][] = [
    ["site.url", siteUrl],
    ["site.name", "UnitWise"],
    ["site.tagline", "Free Online Unit Converter Hub"],
    ["site.description", "UnitWise is a free, fast, and accurate online unit converter supporting hundreds of conversions across length, weight, temperature, area, volume, speed, time, data storage, and more."],
    ["site.logo", "/logo.svg"],
  ];

  for (const [key, value] of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log("✅ Site settings seeded");

  // 3. Default ad settings
  const adSettings: [string, string][] = [
    ["ads.provider", "custom"],
    ["ads.enabled", "false"],
    ["ads.globalHeadHtml", ""],
    ["ads.globalBodyHtml", ""],
    ["ads.slot.top.enabled", "false"],
    ["ads.slot.top.html", ""],
    ["ads.slot.sidebar.enabled", "false"],
    ["ads.slot.sidebar.html", ""],
    ["ads.slot.inContent.enabled", "false"],
    ["ads.slot.inContent.html", ""],
    ["ads.slot.footer.enabled", "false"],
    ["ads.slot.footer.html", ""],
    ["ads.slot.mobileSticky.enabled", "false"],
    ["ads.slot.mobileSticky.html", ""],
    ["ads.adsense.clientId", ""],
    ["ads.adsense.pubId", ""],
    ["ads.adsTxtContent", ""],
    ["ads.nonPersonalizedDefault", "true"],
  ];

  for (const [key, value] of adSettings) {
    await prisma.adSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log("✅ Ad settings seeded");

  // 4. Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        featured: cat.featured,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✅ ${categories.length} categories seeded`);

  // 5. Units
  const unitIdMap: Record<string, string> = {};
  for (const [catSlug, units] of Object.entries(unitsByCategory)) {
    const catId = categoryMap[catSlug];
    if (!catId) continue;
    for (const unit of units) {
      const created = await prisma.unit.upsert({
        where: { slug: unit.slug },
        update: {
          name: unit.name,
          symbol: unit.symbol,
          categoryId: catId,
          isBaseUnit: unit.isBaseUnit ?? false,
          notes: unit.notes,
          sortOrder: unit.sortOrder ?? 0,
        },
        create: {
          name: unit.name,
          symbol: unit.symbol,
          slug: unit.slug,
          categoryId: catId,
          isBaseUnit: unit.isBaseUnit ?? false,
          notes: unit.notes,
          sortOrder: unit.sortOrder ?? 0,
        },
      });
      unitIdMap[unit.slug] = created.id;
    }
  }
  const totalUnits = Object.keys(unitIdMap).length;
  console.log(`✅ ${totalUnits} units seeded`);

  // 6. Conversion rules
  let convCount = 0;
  for (const conv of conversionDefs) {
    const fromId = unitIdMap[conv.from];
    const toId = unitIdMap[conv.to];
    if (!fromId || !toId) {
      console.warn(`⚠ Skipping conversion ${conv.from} -> ${conv.to}: unit not found`);
      continue;
    }
    const slug = `${conv.from}-to-${conv.to}`;
    try {
      await prisma.conversionRule.upsert({
        where: { slug },
        update: {
          type: conv.type,
          factor: conv.factor,
          offset: conv.offset,
          precision: conv.precision,
          formulaText: conv.formulaText,
          isPopular: conv.isPopular ?? false,
        },
        create: {
          fromUnitId: fromId,
          toUnitId: toId,
          type: conv.type,
          factor: conv.factor,
          offset: conv.offset,
          precision: conv.precision,
          formulaText: conv.formulaText,
          slug,
          isPopular: conv.isPopular ?? false,
        },
      });
      convCount++;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`⚠ Skipping ${slug}: ${msg}`);
    }
  }
  console.log(`✅ ${convCount} conversion rules seeded`);

  // 7. SEO Templates
  for (const tpl of seoTemplates) {
    await prisma.seoTemplate.upsert({
      where: {
        categorySlug_templateType: {
          categorySlug: tpl.categorySlug ?? "__global__",
          templateType: tpl.templateType,
        },
      },
      update: { template: tpl.template },
      create: {
        categorySlug: tpl.categorySlug ?? "__global__",
        templateType: tpl.templateType,
        template: tpl.template,
      },
    });
  }
  console.log(`✅ ${seoTemplates.length} SEO templates seeded`);

  // 8. FAQs
  let faqCount = 0;
  for (const faq of defaultFaqs) {
    const catId = faq.cat ? categoryMap[faq.cat] : undefined;
    const existingFaq = await prisma.fAQ.findFirst({
      where: { question: faq.q },
    });
    if (!existingFaq) {
      await prisma.fAQ.create({
        data: {
          question: faq.q,
          answer: faq.a,
          categoryId: catId || null,
          conversionSlug: faq.conv || null,
          published: true,
          sortOrder: faqCount,
        },
      });
      faqCount++;
    }
  }
  console.log(`✅ ${faqCount} FAQs seeded`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
