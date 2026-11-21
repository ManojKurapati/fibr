"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LadderWeek } from "@/lib/aggregate";
import { FACILITY_TYPES } from "@/lib/aggregate";
import { compact } from "@/lib/format";
import type { FacilityType } from "@/lib/types";
import { useElementWidth } from "../useElementWidth";

/**
 * SVG presentation attributes cannot read CSS variables, so the charts resolve the Wayfind tokens
 * at render time. Charts only render after mount (width > 0), so the document is always there.
 */
function tokenColour(name: string): string {
  if (typeof document === "undefined") return "currentColor";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "currentColor";
}
function palette() {
  return {
    ink: tokenColour("--color-ink"),
    ink2: tokenColour("--color-ink-2"),
    muted: tokenColour("--color-muted"),
    rule: tokenColour("--color-rule"),
    paper2: tokenColour("--color-paper-2"),
    amber: tokenColour("--color-accent-2"),
    cobalt: tokenColour("--color-accent"),
  };
}
type Palette = ReturnType<typeof palette>;
const tickStyle = (c: Palette) => ({ fill: c.muted, fontSize: 11, fontFamily: "var(--font-body)" });

export interface BarDatum {
  name: string;
  value: number;
  highlight?: "ink" | "amber" | "emerald" | "muted";
}

const colorFor = (c: Palette, h: BarDatum["highlight"]) =>
  h === "amber" ? c.amber : h === "emerald" ? c.cobalt : h === "muted" ? c.rule : c.ink;

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: ReadonlyArray<{ value?: unknown; name?: unknown; color?: string }>; label?: unknown }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-hairline bg-paper-3 px-2.5 py-1.5 text-[11px]">
      <p className="mb-0.5 font-extrabold text-ink">{String(label ?? "")}</p>
      {payload.map((p, i) =>
        typeof p.value === "number" && p.value !== 0 ? (
          <p key={i} className="flex items-center justify-between gap-3 text-ink-muted">
            <span className="flex items-center gap-1">
              <span className="size-2" style={{ background: p.color }} />
              {String(p.name ?? "")}
            </span>
            <span className="num text-ink">AED {compact(p.value, 2)}</span>
          </p>
        ) : null,
      )}
    </div>
  );
}

/** Horizontal or vertical bar chart used in Ask fibr answers and the entity drawer. */
export function AnswerBars({
  data,
  height = 180,
  layout = "vertical",
  refLine,
  valueLabels = true,
}: {
  data: BarDatum[];
  height?: number;
  layout?: "vertical" | "horizontal";
  refLine?: { value: number; label: string };
  valueLabels?: boolean;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const c = width > 0 ? palette() : null;
  const tick = c ? tickStyle(c) : undefined;
  const horizontalBars = layout === "vertical"; // recharts: layout="vertical" => horizontal bars
  return (
    <div ref={ref} style={{ height }} className="w-full">
      {c ? (
        <BarChart
          width={width}
          height={height}
          data={data}
          layout={layout}
          margin={horizontalBars ? { top: 0, right: 52, bottom: 0, left: 0 } : { top: 14, right: 4, bottom: 0, left: -18 }}
          barCategoryGap={horizontalBars ? 3 : "22%"}
          accessibilityLayer
        >
          {horizontalBars ? (
            <>
              <XAxis type="number" hide domain={[0, "dataMax"]} />
              <YAxis
                type="category"
                dataKey="name"
                width={Math.min(150, Math.max(96, width * 0.36))}
                tickLine={false}
                axisLine={false}
                tick={{ ...tick, fill: c.ink }}
                interval={0}
              />
            </>
          ) : (
            <>
              <CartesianGrid vertical={false} stroke={c.rule} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={tick} interval={0} />
              <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={(v: number) => compact(v, 0)} width={48} />
            </>
          )}
          {refLine ? (
            <ReferenceLine
              {...(horizontalBars ? { x: refLine.value } : { y: refLine.value })}
              stroke={c.ink}
              strokeDasharray="3 3"
              label={{ value: refLine.label, position: horizontalBars ? "top" : "insideTopRight", fill: c.ink, fontSize: 11 }}
            />
          ) : null}
          <Tooltip cursor={{ fill: c.paper2 }} content={<ChartTooltip />} />
          <Bar dataKey="value" name="AED" radius={horizontalBars ? [0, 4, 4, 0] : [4, 4, 0, 0]} isAnimationActive animationDuration={500}>
            {data.map((d) => (
              <Cell key={d.name} fill={colorFor(c, d.highlight)} />
            ))}
            {valueLabels ? (
              <LabelList
                dataKey="value"
                position={horizontalBars ? "right" : "top"}
                formatter={(v: unknown) => (typeof v === "number" ? compact(v, v >= 10_000_000 ? 1 : 2) : "")}
                style={{ fill: c.ink, fontSize: 11, fontFamily: "var(--font-body)" }}
              />
            ) : null}
          </Bar>
        </BarChart>
      ) : null}
    </div>
  );
}

/** Facility series: the ink ramp, as CSS variables for HTML legends and token names for the SVG. */
const TYPE_TOKEN: Record<FacilityType, string> = {
  "Trust receipts": "--color-ink",
  "Letters of credit": "--color-ink-2",
  Revolving: "--color-muted",
  "Term loan": "--color-rule",
  Overdraft: "--color-paper-2",
};
export const TYPE_COLORS: Record<FacilityType, string> = Object.fromEntries(
  Object.entries(TYPE_TOKEN).map(([k, v]) => [k, `var(${v})`]),
) as Record<FacilityType, string>;

/** 13-week maturity ladder: stacked maturities by facility type + projected group cash line. */
export function MaturityLadder({
  weeks,
  selected,
  onSelect,
  height = 230,
}: {
  weeks: LadderWeek[];
  selected: number | null;
  onSelect: (week: number) => void;
  height?: number;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const c = width > 0 ? palette() : null;
  const tick = c ? tickStyle(c) : undefined;
  const data = weeks.map((w) => ({ ...w.byType, label: w.label, week: w.week, cash: w.projectedCash, flagged: w.flagged }));
  const maxCash = Math.max(...weeks.map((w) => w.projectedCash));
  const step = 4_000_000;
  const niceMax = Math.ceil(Math.max(...weeks.map((w) => w.maturities)) / step) * step;
  const ticks = Array.from({ length: niceMax / step + 1 }, (_, i) => i * step);
  const selectedLabel = weeks.find((w) => w.week === selected)?.label;
  return (
    <div ref={ref} style={{ height }} className="w-full">
      {c ? (
        <ComposedChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 16, right: 0, bottom: 0, left: -14 }}
          barCategoryGap="24%"
          onClick={(state) => {
            const idx = typeof state?.activeTooltipIndex === "number" ? state.activeTooltipIndex : Number(state?.activeTooltipIndex);
            const w = Number.isFinite(idx) ? weeks[idx] : undefined;
            if (w) onSelect(w.week);
          }}
          accessibilityLayer
          style={{ cursor: "pointer" }}
        >
          <CartesianGrid vertical={false} stroke={c.rule} />
          {weeks
            .filter((w) => w.flagged)
            .map((w) => (
              <ReferenceArea key={w.week} yAxisId="m" x1={w.label} x2={w.label} fill={c.amber} fillOpacity={0.35} />
            ))}
          {selectedLabel ? <ReferenceArea yAxisId="m" x1={selectedLabel} x2={selectedLabel} fill="none" stroke={c.ink} strokeWidth={2} /> : null}
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={tick} interval={width < 760 ? 1 : 0} />
          <YAxis yAxisId="m" tickLine={false} axisLine={false} tick={tick} domain={[0, niceMax]} ticks={ticks} tickFormatter={(v: number) => (v ? `${v / 1_000_000}m` : "0")} width={46} />
          <YAxis yAxisId="c" orientation="right" hide domain={[0, Math.ceil(maxCash * 1.15)]} />
          <Tooltip cursor={{ fill: c.paper2 }} content={<ChartTooltip />} />
          {FACILITY_TYPES.map((t, i) => (
            <Bar
              key={t}
              yAxisId="m"
              dataKey={t}
              name={t}
              stackId="m"
              fill={tokenColour(TYPE_TOKEN[t])}
              radius={i === FACILITY_TYPES.length - 1 ? [3, 3, 0, 0] : 0}
              animationDuration={600}
            >
            </Bar>
          ))}
          <Line
            yAxisId="c"
            dataKey="cash"
            name="Projected cash"
            type="monotone"
            stroke={c.cobalt}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: c.cobalt }}
            animationDuration={700}
          />
        </ComposedChart>
      ) : null}
    </div>
  );
}
