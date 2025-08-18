export type Pt = { x: number; y: number };

export function buildPathFromPoints(pts: Pt[], smooth = 0): string {
  if (!pts.length) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (smooth <= 0) {
    return (
      `M ${pts[0].x} ${pts[0].y}` +
      pts
        .slice(1)
        .map((p) => ` L ${p.x} ${p.y}`)
        .join("")
    );
  }
  // 간단한 Quadratic smoothing: 인접 중점 사용
  const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const s = Math.min(Math.max(smooth, 0), 1);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const m = mid(p0, p1);
    // 제어점: p0에서 m 쪽으로 s 비율 이동
    const cx = p0.x + (m.x - p0.x) * s;
    const cy = p0.y + (m.y - p0.y) * s;
    d += ` Q ${cx} ${cy} ${p1.x} ${p1.y}`;
  }
  return d;
}
