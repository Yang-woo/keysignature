import { useMemo, useState, useRef } from "react";
import CanvasStage from "./components/CanvasStage";
import { qwertyLayout } from "./layouts/qwerty";
import { downloadSVG, downloadPNG } from "./utils/export";
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
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [width, setWidth] = useState(6);
  const [smooth, setSmooth] = useState(0.4);
  const [showDots, setShowDots] = useState(false);
  const [showKeys, setShowKeys] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    setText("");
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
    <div className="h-[calc(100vh-32px-env(safe-area-inset-bottom))] flex flex-col bg-[#0a0a0a] text-white selection:bg-cyan-400/20">
      <header className="sticky top-0 z-20 bg-[#0a0a0a] border-b border-white/20">
        <div className="mx-auto max-w-[1920px] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-cyan-500/20 ring-1 ring-cyan-400/30 grid place-items-center">
              <span className="text-cyan-300 text-xs font-bold">KS</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-emerald-300">
              KeySignature
            </h1>
            <span className="ml-2 text-xs text-white/50 sm:inline">
              타이핑 경로로 만드는 서명
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="sm:flex items-center gap-2">
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

      <main className="flex-1 w-full mx-auto max-w-[1920px] px-4 py-5 flex flex-col gap-6 min-h-0 overflow-hidden">
        {/* 1) 상단 정보/입력 섹션 - absolute 제거 */}
        <section className="w-full min-h-[15vh] flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-md px-3.5 py-2 text-sm md:text-base text-rose-300 bg-rose-500/10 border border-rose-400/40">
              <span className="tracking-tight">TYPE : QWERTY</span>
            </div>
            <div className="rounded-md px-3.5 py-2 text-sm md:text-base text-amber-300 bg-amber-500/10 border border-amber-400/40">
              <span className="tabular-nums">POINTS : {points.length}</span>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <input
              ref={inputRef}
              autoFocus
              onBlur={() => inputRef.current?.focus()}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-[min(96vw,900px)] h-[clamp(56px,8vh,120px)] md:h-[clamp(64px,10vh,140px)] px-8 md:px-10 py-0 rounded-2xl bg-transparent outline-none border-0 ring-0 focus:border-0 focus:ring-0 appearance-none text-center text-[clamp(18px,4.2vh,40px)] md:text-[clamp(20px,5vh,56px)] font-semibold tracking-wide caret-cyan-400 placeholder-white/30"
            />
          </div>
        </section>

        {/* 2) 키보드 섹션 */}
        <section className="relative w-full flex-1 min-h-[640px] overflow-hidden rounded-2xl">
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
          {/* 키보드 우측 상단 Clear */}
          <div className="absolute right-3 top-3 z-10">
            <button
              onClick={() => setText("")}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/20 text-sm"
              title="입력 초기화"
            >
              CLEAR
            </button>
          </div>
        </section>

        {/* 3) 옵션 섹션 */}
        <section className="w-full">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setShowOptions((v) => !v)}
              className="px-4 md:px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-sm md:text-[15px] backdrop-blur-sm shadow-sm"
              title="옵션 열기"
            >
              ⚙️ Options
            </button>
            {showOptions && (
              <div className="w-[min(92vw,720px)] md:w-[520px] rounded-2xl bg-white/[0.06] backdrop-blur-md shadow-2xl p-4 md:p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-[13px] text-white/70">
                      Stroke Color
                    </label>
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
                        className="flex-1 px-3 py-2 rounded-md bg-white/[0.06] outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
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
                          className="h-7 w-7 rounded-md hover:brightness-110 ring-1 ring-white/10"
                          style={{ backgroundColor: c }}
                          aria-label={`pick ${c}`}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-[13px] text-white/70">
                      Stroke Width: {width}px
                    </label>
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
                    <label className="text-[13px] text-white/70">
                      Smoothing: {smooth}
                    </label>
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
                    <label className="text-[13px] text-white/70">
                      Show Dots
                    </label>
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
                    <label className="text-[13px] text-white/70">
                      Show Keys
                    </label>
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
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1920px] px-4 py-6 text-xs text-white/40 mb-8 shrink-0 pb-[env(safe-area-inset-bottom)]">
        © {new Date().getFullYear()} KeySignature
      </footer>
    </div>
  );
}
