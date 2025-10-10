import { useMemo, useState, useRef, useEffect } from "react";
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  // 모달 열릴 때 스크롤 잠금 및 패딩 보정으로 레이아웃 출렁임 방지
  useEffect(() => {
    const body = document.body as HTMLBodyElement;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    if (showOptions) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [showOptions]);

  return (
    <div className={
      `h-[calc(100vh-32px-env(safe-area-inset-bottom))] flex flex-col selection:bg-cyan-400/20 ` +
      (isDark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]")
    }>
      <header className={
        `sticky top-0 z-20 border-b ` +
        (isDark ? "bg-[#0a0a0a] border-white/20" : "bg-white border-black/10")
      }>
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
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                title="테마 전환"
                className={
                  `px-3 py-1.5 rounded-lg text-sm ` +
                  (isDark
                    ? "bg-white/10 hover:bg-white/15 border border-white/20 text-white"
                    : "bg-black/5 hover:bg-black/10 border border-black/10 text-black")
                }
              >
                {isDark ? "라이트" : "다크"}
              </button>
              <button
                onClick={handleDownloadSVG}
                title="SVG로 다운로드"
                className={
                  `px-3 py-1.5 rounded-lg text-sm ` +
                  (isDark
                    ? "bg-cyan-500/30 hover:bg-cyan-500/40 border border-cyan-400/40 text-cyan-200"
                    : "bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-700")
                }
              >
                SVG
              </button>
              <button
                onClick={handleDownloadPNG}
                title="PNG로 다운로드"
                className={
                  `px-3 py-1.5 rounded-lg text-sm ` +
                  (isDark
                    ? "bg-emerald-500/30 hover:bg-emerald-500/40 border border-emerald-400/40 text-emerald-200"
                    : "bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700")
                }
              >
                PNG
              </button>
              <button
                onClick={handleReset}
                title="모든 옵션 초기화"
                className={
                  `px-3 py-1.5 rounded-lg text-sm ` +
                  (isDark
                    ? "bg-white/10 hover:bg-white/15 border border-white/20"
                    : "bg-black/5 hover:bg-black/10 border border-black/10")
                }
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
            <div className={
              `rounded-2xl px-[42px] py-[24px] text-[42px] md:text-[48px] ` +
              (isDark
                ? "text-rose-300 bg-rose-500/10 border border-rose-400/40"
                : "text-rose-700 bg-rose-100 border border-rose-200")
            }>
              <span className="tracking-tight">TYPE : QWERTY</span>
            </div>
            <div className={
              `rounded-2xl px:[42px] py-[24px] text-[42px] md:text-[48px] ` +
              (isDark
                ? "text-amber-300 bg-amber-500/10 border border-amber-400/40"
                : "text-amber-700 bg-amber-100 border border-amber-200")
            }>
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
              className={
                `w-[min(96vw,900px)] h-[clamp(168px,24vh,360px)] md:h-[clamp(192px,30vh,420px)] px-24 md:px-30 py-0 rounded-2xl bg-transparent outline-none border-0 ring-0 focus:border-0 focus:ring-0 appearance-none text-center font-semibold tracking-wide caret-cyan-400 ` +
                (isDark
                  ? "text-[clamp(54px,12.6vh,120px)] md:text-[clamp(60px,15vh,168px)] placeholder-white/30"
                  : "text-[clamp(54px,12.6vh,120px)] md:text-[clamp(60px,15vh,168px)] placeholder-black/30")
              }
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
              className={
                `px-4 py-2 rounded-md text-sm ` +
                (isDark
                  ? "bg-white/10 hover:bg-white/15 border border-white/20"
                  : "bg-black/5 hover:bg-black/10 border border-black/10")
              }
              title="입력 초기화"
            >
              CLEAR
            </button>
          </div>
        </section>

        {/* 3) 옵션 FAB + 모달 */}
        {/* 플로팅 옵션 버튼 (3배 확대) */}
        <button
          onClick={() => setShowOptions(true)}
          className={
            `fixed right-6 bottom-6 md:right-8 md:bottom-8 z-40 rounded-full shadow-xl backdrop-blur-sm ` +
            `h-[84px] w-[84px] md:h-[96px] md:w-[96px] ` + // 3배 크기
            (isDark
              ? "bg-white/10 hover:bg-white/15 border border-white/20 text-white"
              : "bg-black/5 hover:bg-black/10 border border-black/10 text-black")
          }
          title="옵션 열기"
          aria-label="옵션 열기"
        >
          <span className="text-[36px] leading-none">⚙️</span>
        </button>

        {/* 모달 오버레이 */}
        {showOptions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className={isDark ? "absolute inset-0 bg-black/50" : "absolute inset-0 bg-black/30"}
              onClick={() => setShowOptions(false)}
            />
            <div
              className={
                `relative z-10 w-[min(92vw,960px)] md:w-[720px] max-h-[85vh] overflow-auto rounded-2xl p-6 md:p-7 ` +
                (isDark ? "bg-white/[0.06]" : "bg-black/[0.04]")
              }
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={"text-xl font-semibold " + (isDark ? "text-white" : "text-black")}>Options</h2>
                <button
                  onClick={() => setShowOptions(false)}
                  className={
                    `h-10 w-10 grid place-items-center rounded-md ` +
                    (isDark ? "bg-white/10 hover:bg-white/15" : "bg-black/5 hover:bg-black/10")
                  }
                  aria-label="닫기"
                  title="닫기"
                >
                  ✕
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className={"text-[13px] " + (isDark ? "text-white/70" : "text-black/70")}>
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
                      className={
                        `flex-1 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm ` +
                        (isDark ? "bg-white/[0.06]" : "bg-black/[0.05]")
                      }
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
                  <label className={"text-[13px] " + (isDark ? "text-white/70" : "text-black/70")}>
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
                  <label className={"text-[13px] " + (isDark ? "text-white/70" : "text-black/70")}>
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
                  <label className={"text-[13px] " + (isDark ? "text-white/70" : "text-black/70")}>
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
                  <label className={"text-[13px] " + (isDark ? "text-white/70" : "text-black/70")}>
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
          </div>
        )}
      </main>

      <footer className={
        `mx-auto max-w-[1920px] px-4 py-6 text-xs mb-8 shrink-0 pb-[env(safe-area-inset-bottom)] ` +
        (isDark ? "text-white/40" : "text-black/50")
      }>
        © {new Date().getFullYear()} KeySignature
      </footer>
    </div>
  );
}
