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

const INK = "#0B1221";
const MUTED = "#667085";
const GRID = "#E6E4DD";
const AMBER = "#C27803";
const EMERALD = "#0E9F6E";

const tick = { fill: MUTED, fontSize: 10, fontFamily: "var(--font-mono)" };

export interface BarDatum {
  name: string;
  value: number;
  highlight?: "ink" | "amber" | "emerald" | "muted";
}

const colorFor = (h: BarDatum["highlight"]) =>
  h === "amber" ? AMBER : h === "emerald" ? EMERALD : h === "muted" ? "#C9C5BB" : INK;

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: ReadonlyArray<{ value?: unknown; name?: unknown; color?: string }>; label?: unknown }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[10.5px] shadow-[0_8px_24px_-12px_rgba(11,18,33,0.35)]">
      <p className="mb-0.5 font-semibold text-ink">{String(label ?? "")}</p>
      {payload.map((p, i) =>
        typeof p.value === "number" && p.value !== 0 ? (
          <p key={i} className="flex items-center justify-between gap-3 text-ink-muted">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full" style={{ background: p.color }} />
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
  const horizontalBars = layout === "vertical"; // recharts: layout="vertical" => horizontal bars
  return (
    <div ref={ref} style={{ height }} className="w-full">
      {width > 0 ? (
        <BarChart
          width={width}
          height={height}
          data={data}
          layout={layout}
          margin={horizontalBars ? { top: 0, right: 44, bottom: 0, left: 0 } : { top: 14, right: 4, bottom: 0, left: -18 }}
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
                tick={{ ...tick, fill: INK, fontFamily: "var(--font-jakarta)", fontSize: 10.5 }}
                interval={0}
              />
            </>
          ) : (
            <>
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={tick} interval={0} />
              <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={(v: number) => compact(v, 0)} width={48} />
            </>
          )}
          {refLine ? (
            <ReferenceLine
              {...(horizontalBars ? { x: refLine.value } : { y: refLine.value })}
              stroke={AMBER}
              strokeDasharray="3 3"
              label={{ value: refLine.label, position: horizontalBars ? "top" : "insideTopRight", fill: "#8f5602", fontSize: 10 }}
            />
          ) : null}
          <Tooltip cursor={{ fill: "rgba(11,18,33,0.04)" }} content={<ChartTooltip />} />
          <Bar dataKey="value" name="AED" radius={horizontalBars ? [0, 4, 4, 0] : [4, 4, 0, 0]} isAnimationActive animationDuration={500}>
            {data.map((d) => (
              <Cell key={d.name} fill={colorFor(d.highlight)} />
            ))}
            {valueLabels ? (
              <LabelList
                dataKey="value"
                position={horizontalBars ? "right" : "top"}
                formatter={(v: unknown) => (typeof v === "number" ? compact(v, v >= 10_000_000 ? 1 : 2) : "")}
                style={{ fill: INK, fontSize: 10, fontFamily: "var(--font-mono)" }}
              />
            ) : null}
          </Bar>
        </BarChart>
      ) : null}
    </div>
  );
}

export const TYPE_COLORS: Record<FacilityType, string> = {
  "Trust receipts": "#0B1221",
  "Letters of credit": "#3E4A5D",
  Revolving: "#7B8596",
  "Term loan": "#B8BDC5",
  Overdraft: "#D6D3CA",
};

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
  const data = weeks.map((w) => ({ ...w.byType, label: w.label, week: w.week, cash: w.projectedCash, flagged: w.flagged }));
  const maxCash = Math.max(...weeks.map((w) => w.projectedCash));
  return (
    <div ref={ref} style={{ height }} className="w-full">
      {width > 0 ? (
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
          <CartesianGrid vertical={false} stroke={GRID} />
          {weeks
            .filter((w) => w.flagged)
            .map((w) => (
              <ReferenceArea key={w.week} yAxisId="m" x1={w.label} x2={w.label} fill={AMBER} fillOpacity={0.09} ifOverflow="extendDomain" />
            ))}
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={tick} interval={width < 520 ? 1 : 0} />
          <YAxis yAxisId="m" tickLine={false} axisLine={false} tick={tick} tickFormatter={(v: number) => compact(v, 0)} width={46} />
          <YAxis yAxisId="c" orientation="right" hide domain={[0, Math.ceil(maxCash * 1.15)]} />
          <Tooltip cursor={{ fill: "rgba(11,18,33,0.04)" }} content={<ChartTooltip />} />
          {FACILITY_TYPES.map((t, i) => (
            <Bar
              key={t}
              yAxisId="m"
              dataKey={t}
              name={t}
              stackId="m"
              fill={TYPE_COLORS[t]}
              radius={i === FACILITY_TYPES.length - 1 ? [3, 3, 0, 0] : 0}
              animationDuration={600}
            >
              {data.map((d) => (
                <Cell
                  key={`${t}-${d.week}`}
                  fill={TYPE_COLORS[t]}
                  fillOpacity={selected === null || selected === d.week ? 1 : 0.35}
                />
              ))}
            </Bar>
          ))}
          <Line
            yAxisId="c"
            dataKey="cash"
            name="Projected cash"
            type="monotone"
            stroke={EMERALD}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: EMERALD }}
            animationDuration={700}
          />
        </ComposedChart>
      ) : null}
    </div>
  );
}
