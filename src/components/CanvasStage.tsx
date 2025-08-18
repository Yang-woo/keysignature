import { useMemo, useRef, useEffect, forwardRef } from "react";
import { buildPathFromPoints } from "../lib/path";
import type { KeyCoord } from "../types";

export type Pt = { x: number; y: number };

interface Props {
  points: Pt[];
  color: string;
  width: number;
  smooth: number; // 0..1
  showDots?: boolean;
  showKeys?: boolean;
  keys?: KeyCoord[]; // 키보드 오버레이
}

const CanvasStage = forwardRef<SVGSVGElement, Props>(
  (
    {
      points,
      color,
      width,
      smooth,
      showDots = false,
      showKeys = true,
      keys = [],
    },
    ref
  ) => {
    const d = useMemo(
      () => buildPathFromPoints(points, smooth),
      [points, smooth]
    );

    // 키 좌표로 viewBox 추정 (키 없으면 기본값)
    const vb = useMemo(() => {
      if (!keys.length) return { w: 11 * 60, h: 4 * 60 };
      const w = Math.max(...keys.map((k) => k.x + (k.w ?? 60)));
      const h = Math.max(...keys.map((k) => k.y + (k.h ?? 60)));
      return { w, h: h + 20 };
    }, [keys]);

    // ref는 부모에서 전달받음

    useEffect(() => {
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
        event: "sign_rendered",
        points: points.length,
      });
    }, [points]);

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        className="w-full h-[50vh] sm:h-[60vh] bg-[#0a0a0a] rounded-xl ring-1 ring-white/20"
      >
        {/* 배경 */}
        <rect x={0} y={0} width={vb.w} height={vb.h} fill="#0a0a0a" />

        {/* 키보드 오버레이 */}
        {showKeys &&
          keys.map((k) => {
            const rx = 10;
            return (
              <g key={k.id}>
                <rect
                  x={k.x + 2}
                  y={k.y + 2}
                  width={(k.w ?? 60) - 4}
                  height={(k.h ?? 60) - 4}
                  rx={rx}
                  ry={rx}
                  fill="#0a0a0a"
                  stroke="#2a2a2a"
                  strokeWidth={1.5}
                />
                {k.label && (
                  <text
                    x={k.x + (k.w ?? 60) / 2}
                    y={k.y + (k.h ?? 60) / 2 + 4}
                    fontSize={12}
                    textAnchor="middle"
                    fill="#7a7a7a"
                  >
                    {k.label}
                  </text>
                )}
              </g>
            );
          })}

        {/* 서명 경로 */}
        <g>
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {showDots &&
            points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
            ))}
        </g>
      </svg>
    );
  }
);

CanvasStage.displayName = "CanvasStage";

export default CanvasStage;
