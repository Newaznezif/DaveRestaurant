"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
  className?: string;
}

export function BarChart({
  data,
  title,
  height = 200,
  className,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("w-full", className)}>
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <div className="flex items-end justify-between" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full mx-1 rounded-t transition-all duration-300"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || "hsl(var(--primary))",
              }}
            />
            <span className="text-xs text-muted-foreground mt-2 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold">{value}</p>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : ""}{trend.value}% from last period
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  title?: string;
  height?: number;
  className?: string;
}

export function LineChart({
  data,
  title,
  height = 200,
  className,
}: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1 || 1)) * 100,
    y: 100 - (d.value / maxValue) * 100,
  }));

  const pathD = points.reduce((acc, point, i) => {
    return acc + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
  }, "");

  return (
    <div className={cn("w-full", className)}>
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <svg viewBox="0 0 100 100" className="w-full" style={{ height }}>
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        <path
          d={`${pathD} V 100 H 0 V 0 Z`}
          fill="hsl(var(--primary) / 0.1)"
        />
      </svg>
    </div>
  );
}