import type { KeyCoord, KeyId } from "../types";
import type { Layout } from "../types";

const unit = 60;
const key = (
  id: KeyId,
  x: number,
  y: number,
  w = unit,
  h = unit,
  label?: string
): KeyCoord => ({ id, x, y, w, h, label });

// 행 오프셋 (전통 QWERTY 0/0.5u/1u 스태거)
const yMinus1 = -unit; // 숫자 행
const y0 = 0; // QWERTYUIOP
const y1 = unit; // ASDFGHJKL
const y2 = unit * 2; // ZXCVBNM
const spaceY = unit * 3; // Space row
const off1 = unit * 0.5; // A-row offset
const off2 = unit * 1.0; // Z-row offset

const rowNum = "1234567890-=".split("");
const rowQ = "QWERTYUIOP".split("");
const rowA = "ASDFGHJKL".split("");
const rowZ = "ZXCVBNM".split("");

const keys: KeyCoord[] = [
  // 숫자 행
  ...rowNum.map((ch, i) => {
    const id =
      ch >= "0" && ch <= "9"
        ? (`Digit${ch}` as KeyId)
        : ch === "-"
        ? "Minus"
        : "Equal";
    return key(id, unit * i, yMinus1, unit, unit, ch);
  }),
  // Q 행 + 대괄호/백슬래시
  ...rowQ.map((ch, i) => key(`Key${ch}`, unit * i, y0, unit, unit, ch)),
  key("BracketLeft", unit * rowQ.length, y0, unit, unit, "["),
  key("BracketRight", unit * (rowQ.length + 1), y0, unit, unit, "]"),
  key("Backslash", unit * (rowQ.length + 2), y0, unit, unit, "\\"),
  // A 행 + 세미콜론/따옴표
  ...rowA.map((ch, i) =>
    key(`Key${ch}`, off1 + unit * i, y1, unit, unit, ch)
  ),
  key("Semicolon", off1 + unit * rowA.length, y1, unit, unit, ";"),
  key("Quote", off1 + unit * (rowA.length + 1), y1, unit, unit, "'"),
  // Z 행 + 콤마/마침표/슬래시
  ...rowZ.map((ch, i) =>
    key(`Key${ch}`, off2 + unit * i, y2, unit, unit, ch)
  ),
  key("Comma", off2 + unit * rowZ.length, y2, unit, unit, ","),
  key("Period", off2 + unit * (rowZ.length + 1), y2, unit, unit, "."),
  key("Slash", off2 + unit * (rowZ.length + 2), y2, unit, unit, "/"),
  // Spacebar (C 아래에서 M 아래까지)
  key("Space", unit * 3, spaceY, unit * 5, unit, "Space"),
];

const charToKey: Record<string, KeyId> = {};
"abcdefghijklmnopqrstuvwxyz".split("").forEach((c) => {
  charToKey[c] = `Key${c.toUpperCase()}`;
  charToKey[c.toUpperCase()] = `Key${c.toUpperCase()}`;
});
"1234567890".split("").forEach((c) => {
  charToKey[c] = `Digit${c}`;
});
Object.assign(charToKey, {
  "-": "Minus",
  "=": "Equal",
  "[": "BracketLeft",
  "]": "BracketRight",
  "\\": "Backslash",
  ";": "Semicolon",
  "'": "Quote",
  ",": "Comma",
  ".": "Period",
  "/": "Slash",
  " ": "Space",
});

export const qwertyLayout: Layout = {
  id: "qwerty",
  name: "QWERTY (US, full)",
  unit,
  keys,
  mapCharToKeyIds: (ch: string) => {
    const id = charToKey[ch];
    return id ? [id] : [];
  },
};
