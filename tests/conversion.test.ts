import { convert, generateExamples, ConversionParams } from "@/lib/conversion";

describe("convert()", () => {
  // ───── LINEAR conversions ─────
  describe("LINEAR conversions", () => {
    it("converts kilograms to pounds", () => {
      const params: ConversionParams = { type: "LINEAR", factor: 2.20462, offset: 0 };
      expect(convert(1, params)).toBeCloseTo(2.20462, 4);
      expect(convert(0, params)).toBe(0);
      expect(convert(100, params)).toBeCloseTo(220.462, 2);
    });

    it("converts pounds to kilograms", () => {
      const params: ConversionParams = { type: "LINEAR", factor: 0.453592, offset: 0 };
      expect(convert(1, params)).toBeCloseTo(0.453592, 4);
      expect(convert(100, params)).toBeCloseTo(45.3592, 2);
    });

    it("converts square meters to square feet", () => {
      const params: ConversionParams = { type: "LINEAR", factor: 10.7639, offset: 0 };
      expect(convert(1, params)).toBeCloseTo(10.7639, 3);
      expect(convert(10, params)).toBeCloseTo(107.639, 2);
    });

    it("converts meters to feet", () => {
      const params: ConversionParams = { type: "LINEAR", factor: 3.28084, offset: 0 };
      expect(convert(1, params)).toBeCloseTo(3.28084, 4);
    });

    it("converts kilometers to miles", () => {
      const params: ConversionParams = { type: "LINEAR", factor: 0.621371, offset: 0 };
      expect(convert(1, params)).toBeCloseTo(0.621371, 5);
      expect(convert(42.195, params)).toBeCloseTo(26.2188, 2); // marathon
    });
  });

  // ───── AFFINE conversions (temperature) ─────
  describe("AFFINE conversions", () => {
    it("converts Celsius to Fahrenheit", () => {
      const params: ConversionParams = { type: "AFFINE", factor: 1.8, offset: 32 };
      expect(convert(0, params)).toBe(32);
      expect(convert(100, params)).toBe(212);
      expect(convert(-40, params)).toBe(-40); // crossover point
      expect(convert(37, params)).toBeCloseTo(98.6, 1);
    });

    it("converts Fahrenheit to Celsius", () => {
      // F→C: (F − 32) × 5/9 = F × (5/9) + (−32 × 5/9) = F × 0.5556 + (−17.7778)
      const params: ConversionParams = { type: "AFFINE", factor: 5 / 9, offset: -32 * (5 / 9) };
      expect(convert(32, params)).toBeCloseTo(0, 4);
      expect(convert(212, params)).toBeCloseTo(100, 4);
      expect(convert(-40, params)).toBeCloseTo(-40, 4);
      expect(convert(98.6, params)).toBeCloseTo(37, 1);
    });

    it("converts Celsius to Kelvin", () => {
      const params: ConversionParams = { type: "AFFINE", factor: 1, offset: 273.15 };
      expect(convert(0, params)).toBeCloseTo(273.15, 2);
      expect(convert(100, params)).toBeCloseTo(373.15, 2);
      expect(convert(-273.15, params)).toBeCloseTo(0, 2); // absolute zero
    });
  });

  // ───── Edge cases ─────
  describe("edge cases", () => {
    it("handles zero input for LINEAR", () => {
      expect(convert(0, { type: "LINEAR", factor: 999, offset: 0 })).toBe(0);
    });

    it("handles negative input for LINEAR", () => {
      expect(convert(-5, { type: "LINEAR", factor: 2, offset: 0 })).toBe(-10);
    });

    it("handles very large numbers", () => {
      expect(convert(1e12, { type: "LINEAR", factor: 1e-3, offset: 0 })).toBe(1e9);
    });

    it("handles very small numbers", () => {
      expect(convert(0.001, { type: "LINEAR", factor: 1000, offset: 0 })).toBeCloseTo(1, 10);
    });
  });
});

describe("generateExamples()", () => {
  it("returns default 6 examples when no custom values given", () => {
    const params: ConversionParams = { type: "LINEAR", factor: 2.20462, offset: 0 };
    const examples = generateExamples(params, "kg", "lb");
    expect(examples).toHaveLength(6);
    expect(examples[0].input).toBe(1);
    expect(examples[0].output).toBeCloseTo(2.20462, 4);
    expect(examples[0].text).toContain("kg");
    expect(examples[0].text).toContain("lb");
  });

  it("uses custom example values when provided", () => {
    const params: ConversionParams = { type: "LINEAR", factor: 1, offset: 0 };
    const examples = generateExamples(params, "m", "m", [42, 99]);
    expect(examples).toHaveLength(2);
    expect(examples[0].input).toBe(42);
    expect(examples[1].input).toBe(99);
  });
});
