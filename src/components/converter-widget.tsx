"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftRight, Copy, Check } from "lucide-react";
import { convert } from "@/lib/conversion";
import type { ConversionType } from "@prisma/client";

interface UnitInfo {
  id: string;
  name: string;
  symbol: string;
  slug: string;
}

interface Props {
  fromUnit: UnitInfo;
  toUnit: UnitInfo;
  conversionType: ConversionType;
  factor: number;
  offset: number;
  precision: number;
  reverseSlug: string;
}

export function ConverterWidget({
  fromUnit,
  toUnit,
  conversionType,
  factor,
  offset,
  precision,
  reverseSlug,
}: Props) {
  const [inputValue, setInputValue] = useState("1");
  const [currentPrecision, setCurrentPrecision] = useState(precision.toString());
  const [copied, setCopied] = useState(false);

  const numericInput = parseFloat(inputValue) || 0;
  const result = convert(numericInput, {
    type: conversionType,
    factor,
    offset,
  });
  const prec = parseInt(currentPrecision);
  const formattedResult = Number.isFinite(result)
    ? result.toFixed(prec)
    : "0";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formattedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formattedResult]);

  const handleSwap = () => {
    window.location.href = `/convert/${reverseSlug}`;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] items-end">
          {/* From */}
          <div className="space-y-2">
            <Label htmlFor="from-value" className="text-sm font-medium">
              {fromUnit.name} ({fromUnit.symbol})
            </Label>
            <Input
              id="from-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-lg tabular-nums h-12"
              placeholder="Enter value"
              autoFocus
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center sm:pb-0.5">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              aria-label="Swap units"
              className="rounded-full h-10 w-10"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label htmlFor="to-value" className="text-sm font-medium">
              {toUnit.name} ({toUnit.symbol})
            </Label>
            <div className="relative">
              <Input
                id="to-value"
                type="text"
                value={formattedResult}
                readOnly
                className="text-lg tabular-nums h-12 pr-10 bg-muted/50 font-semibold"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute right-1 top-1 h-10 w-10"
                aria-label="Copy result"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Precision selector */}
        <div className="mt-4 flex items-center gap-3">
          <Label className="text-sm text-muted-foreground">Precision:</Label>
          <Select value={currentPrecision} onValueChange={setCurrentPrecision}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 decimals</SelectItem>
              <SelectItem value="4">4 decimals</SelectItem>
              <SelectItem value="6">6 decimals</SelectItem>
              <SelectItem value="8">8 decimals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick formula */}
        <div className="mt-4 rounded-md bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {numericInput} {fromUnit.symbol}
            </span>
            {" = "}
            <span className="font-semibold text-primary tabular-nums">
              {formattedResult} {toUnit.symbol}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
