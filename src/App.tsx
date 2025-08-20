import { useMemo, useState, useRef } from "react";
import CanvasStage from "./components/CanvasStage";
import { qwertyLayout } from "./layouts/qwerty";
import { downloadSVG, downloadPNG } from "./lib/export";
import type { KeyCoord } from "./types";

function toPoints(text: string, keys: KeyCoord[]) {
  const lookup = new Map(keys.map((k) => [k.id, k]));
  const ids = text.split("").flatMap((ch) => qwertyLayout.mapCharToKeyIds(ch));
  const pts = ids
    .map((id) => {
      const k = lookup.get(id);
      if (!k) return null;
      const x = k.x + (k.w ?? 60) / 2;
      const y = k.y + (k.h ?? 60) / 2;
      return { x, y };
    })
    .filter(Boolean) as { x: number; y: number }[];
  return pts;
}

export default function App() {
  const [text, setText] = useState("defqon");
  const [color, setColor] = useState("#ffffff");
  const [width, setWidth] = useState(6);
  const [smooth, setSmooth] = useState(0.4);
  const [showDots, setShowDots] = useState(false);
  const [showKeys, setShowKeys] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const points = useMemo(() => toPoints(text, qwertyLayout.keys), [text]);

  const handleDownloadSVG = () => {
    if (svgRef.current) {
      downloadSVG(svgRef.current, `${text || "signature"}.svg`);
    }
  };

  const handleDownloadPNG = async () => {
    if (svgRef.current) {
      await downloadPNG(svgRef.current, `${text || "signature"}.png`, 2);
    }
  };

  const handleReset = () => {
    setText("defqon");
    setColor("#ffffff");
    setWidth(6);
    setSmooth(0.4);
    setShowDots(false);
    setShowKeys(true);
  };

  const handleKeyClick = (label: string) => {
    setText((t) => t + (label === "Space" ? " " : label));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-cyan-400/20">
      <header className="sticky top-0 z-20 bg-[#0a0a0a] border-b border-white/20">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-white/10 ring-1 ring-white/20 grid place-items-center">
              <span className="text-white text-xs font-bold">KS</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-emerald-300">
              KeySignature
            </h1>
            <span className="ml-2 text-xs text-white/50 hidden sm:inline">
              타이핑 경로로 만드는 서명
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handleDownloadSVG}
                title="SVG로 다운로드"
                className="px-3 py-1.5 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/40 border border-cyan-400/40 text-cyan-200 text-sm"
              >
                SVG
              </button>
              <button
                onClick={handleDownloadPNG}
                title="PNG로 다운로드"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/40 border border-emerald-400/40 text-emerald-200 text-sm"
              >
                PNG
              </button>
              <button
                onClick={handleReset}
                title="모든 옵션 초기화"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-5xl px-4 py-5 flex flex-col items-center gap-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full max-w-md px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-center text-lg outline-none focus:ring-2 focus:ring-cyan-500/60"
        />

        <section className="w-full">
          <CanvasStage
            ref={svgRef}
            points={points}
            color={color}
            width={width}
            smooth={smooth}
            showDots={showDots}
            showKeys={showKeys}
            keys={qwertyLayout.keys}
            onKeyClick={handleKeyClick}
          />
        </section>

        <section className="mt-auto w-full">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>Layout: QWERTY</span>
            <span>{points.length} points</span>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowOptions((v) => !v)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-medium shadow-lg hover:opacity-90 focus:outline-none"
            >
              Options
            </button>
          </div>
          {showOptions && (
            <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-xs text-white/60">Stroke Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer bg-transparent rounded-md overflow-hidden"
                    title="색상"
                  />
                  <input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md bg-black border border-white/10 text-sm outline-none focus:ring-2 focus:ring-cyan-500/60"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "#22d3ee",
                    "#38bdf8",
                    "#60a5fa",
                    "#a78bfa",
                    "#f472b6",
                    "#34d399",
                    "#f59e0b",
                    "#ef4444",
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="h-7 w-7 rounded-md border border-white/10 hover:brightness-110"
                      style={{ backgroundColor: c }}
                      aria-label={`pick ${c}`}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Stroke Width: {width}px</label>
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={width}
                  onChange={(e) => setWidth(+e.target.value)}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Smoothing: {smooth}</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={smooth}
                  onChange={(e) => setSmooth(+e.target.value)}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Show Dots</label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-cyan-400"
                    checked={showDots}
                    onChange={(e) => setShowDots(e.target.checked)}
                  />
                  입력 지점 표시
                </label>
              </div>

              <div className="grid gap-2">
                <label className="text-xs text-white/60">Show Keys</label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-cyan-400"
                    checked={showKeys}
                    onChange={(e) => setShowKeys(e.target.checked)}
                  />
                  키보드 표시
                </label>
              </div>
            </section>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-6 text-xs text-white/40">
        © {new Date().getFullYear()} KeySignature
      </footer>
    </div>
  );
}

