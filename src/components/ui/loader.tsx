"use client";

import React from "react";

type LoaderProps = {
  size?: number;
  className?: string;
};

export function Loader({ size = 56, className }: LoaderProps) {
  const dotSize = Math.max(6, Math.round(size / 7));
  const gap = Math.round(dotSize * 1.25);
  return (
    <div
      className={"lpw-loader flex items-center justify-center " + (className || "")}
      style={{ gap }}
      role="status"
      aria-label="Loading"
    >
      <span
        className="lpw-loader-dot bg-primary"
        style={{ width: dotSize, height: dotSize, animationDelay: "0ms" }}
      />
      <span
        className="lpw-loader-dot bg-chart-2"
        style={{ width: dotSize, height: dotSize, animationDelay: "120ms" }}
      />
      <span
        className="lpw-loader-dot bg-chart-4"
        style={{ width: dotSize, height: dotSize, animationDelay: "240ms" }}
      />
      <span
        className="lpw-loader-dot bg-chart-5"
        style={{ width: dotSize, height: dotSize, animationDelay: "360ms" }}
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default Loader;


