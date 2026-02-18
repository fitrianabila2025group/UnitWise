import type { ConversionType } from "@prisma/client";

export interface ConversionParams {
  type: ConversionType;
  factor: number;
  offset: number;
}

/**
 * Perform a unit conversion.
 * LINEAR: result = value * factor
 * AFFINE: result = value * factor + offset
 */
export function convert(value: number, params: ConversionParams): number {
  const { type, factor, offset } = params;
  if (type === "LINEAR") {
    return value * factor;
  }
  // AFFINE
  return value * factor + offset;
}

/**
 * Generate example conversions for a conversion rule
 */
export function generateExamples(
  params: ConversionParams,
  fromSymbol: string,
  toSymbol: string,
  exampleValues?: number[]
): { input: number; output: number; text: string }[] {
  const defaults = [1, 5, 10, 25, 50, 100];
  const values = exampleValues || defaults;

  return values.map((val) => {
    const result = convert(val, params);
    return {
      input: val,
      output: result,
      text: `${val} ${fromSymbol} = ${formatResult(result)} ${toSymbol}`,
    };
  });
}

function formatResult(num: number): string {
  if (Number.isInteger(num)) return num.toLocaleString("en-US");
  if (Math.abs(num) >= 0.01) return parseFloat(num.toFixed(6)).toString();
  return num.toExponential(4);
}
