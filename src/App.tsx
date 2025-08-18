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
  // 기본값: 다크 배경에서 잘 보이는 사이언 톤
  const [text, setText] = useState("defqon");
  const [color, setColor] = useState("#22d3ee"); // cyan-400
  const [width, setWidth] = useState(6);
  const [smooth, setSmooth] = useState(0.4);
  const [showDots, setShowDots] = useState(false);
  const [showKeys, setShowKeys] = useState(true);

  // 옵션 패널은 눌러야 열림
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-400/20">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/60 border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-cyan-500/20 ring-1 ring-cyan-400/30 grid place-items-center">
              <span className="text-cyan-300 text-xs font-bold">KS</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              KeySignature
            </h1>
            <span className="ml-2 text-xs text-white/50 hidden sm:inline">
              타이핑 경로로 만드는 서명
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOptions((v) => !v)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
            >
              Options
            </button>
            <label className="hidden sm:inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer">
              <input
                type="checkbox"
                className="accent-cyan-400"
                checked={showKeys}
                onChange={(e) => setShowKeys(e.target.checked)}
              />
              Show keys
            </label>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="mx-auto max-w-5xl px-4 py-5 grid gap-4">
        {/* 입력 바 (모바일 우선) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs text-white/60 mb-1">
              Name / Nickname
            </label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="이름/닉네임을 입력하세요"
              className="w-full px-3 sm:px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none
                         placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500/60"
            />
          </div>

          {/* 모바일에서 옵션 버튼을 오른쪽에 노출 */}
          <div className="flex items-end gap-2 sm:hidden">
            <button
              onClick={() => setShowOptions((v) => !v)}
              className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
            >
              Options
            </button>
            <button
              onClick={() => setShowKeys((v) => !v)}
              className="px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
            >
              {showKeys ? "Hide keys" : "Show keys"}
            </button>
          </div>
        </div>

        {/* 옵션 패널 (토글) */}
        {showOptions && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-4 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs text-white/60">Stroke Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer bg-transparent"
                  title="색상"
                />
                <input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md bg-black border border-white/10 text-sm
                             outline-none focus:ring-2 focus:ring-cyan-500/60"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-white/60">
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
              <label className="text-xs text-white/60">
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
          </section>
        )}

        {/* 캔버스 */}
        <section>
          <CanvasStage
            ref={svgRef}
            points={points}
            color={color}
            width={width}
            smooth={smooth}
            showDots={showDots}
            showKeys={showKeys}
            keys={qwertyLayout.keys}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-white/40">
            <span>Layout: QWERTY</span>
            <span>{points.length} points</span>
          </div>

          {/* 다운로드 버튼들 */}
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={handleDownloadSVG}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 text-sm font-medium transition-colors"
            >
              SVG 다운로드
            </button>
            <button
              onClick={handleDownloadPNG}
              className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-sm font-medium transition-colors"
            >
              PNG 다운로드
            </button>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="mx-auto max-w-5xl px-4 py-6 text-xs text-white/40">
        © {new Date().getFullYear()} KeySignature
      </footer>
    </div>
  );
}
