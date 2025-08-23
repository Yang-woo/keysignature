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
const numY = 0; // 숫자열
const y0 = unit; // QWERTYUIOP
const y1 = unit * 2; // ASDFGHJKL
const y2 = unit * 3; // ZXCVBNM
const spaceY = unit * 4; // Space row
const off1 = unit * 0.5; // A-row offset
const off2 = unit * 1.0; // Z-row offset

const rowNums = [
  { ch: "1", id: "Digit1" },
  { ch: "2", id: "Digit2" },
  { ch: "3", id: "Digit3" },
  { ch: "4", id: "Digit4" },
  { ch: "5", id: "Digit5" },
  { ch: "6", id: "Digit6" },
  { ch: "7", id: "Digit7" },
  { ch: "8", id: "Digit8" },
  { ch: "9", id: "Digit9" },
  { ch: "0", id: "Digit0" },
  { ch: "-", id: "Minus" },
  { ch: "=", id: "Equal" },
];
const rowQ = "QWERTYUIOP".split("");
const rowA = "ASDFGHJKL".split("");
const rowZ = "ZXCVBNM".split("");

const keys: KeyCoord[] = [
  ...rowNums.map((r, i) => key(r.id, unit * i, numY, unit, unit, r.ch)),
  ...rowQ.map((ch, i) => key(`Key${ch}`, unit * i, y0, unit, unit, ch)),
  key("BracketLeft", unit * 10, y0, unit, unit, "["),
  key("BracketRight", unit * 11, y0, unit, unit, "]"),
  key("Backslash", unit * 12, y0, unit, unit, "\\"),
  ...rowA.map((ch, i) =>
    key(`Key${ch}`, off1 + unit * i, y1, unit, unit, ch)
  ),
  key("Semicolon", off1 + unit * rowA.length, y1, unit, unit, ";"),
  key("Quote", off1 + unit * (rowA.length + 1), y1, unit, unit, "'"),
  ...rowZ.map((ch, i) => key(`Key${ch}`, off2 + unit * i, y2, unit, unit, ch)),
  key("Comma", off2 + unit * rowZ.length, y2, unit, unit, ","),
  key("Period", off2 + unit * (rowZ.length + 1), y2, unit, unit, "."),
  key("Slash", off2 + unit * (rowZ.length + 2), y2, unit, unit, "/"),
  key("Space", unit * 3, spaceY, unit * 5, unit, "Space"),
];

const charToKey: Record<string, KeyId> = {};
"abcdefghijklmnopqrstuvwxyz".split("").forEach((c) => {
  charToKey[c] = `Key${c.toUpperCase()}`;
  charToKey[c.toUpperCase()] = `Key${c.toUpperCase()}`;
});
// 숫자 및 기호
const digitIds = [
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
];
const digitChars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const shiftedDigits = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
digitIds.forEach((id, i) => {
  charToKey[digitChars[i]] = id;
  charToKey[shiftedDigits[i]] = id;
});
charToKey["-"] = "Minus";
charToKey["_"] = "Minus";
charToKey["="] = "Equal";
charToKey["+"] = "Equal";
charToKey["["] = "BracketLeft";
charToKey["{"] = "BracketLeft";
charToKey["]"] = "BracketRight";
charToKey["}"] = "BracketRight";
charToKey["\\"] = "Backslash";
charToKey["|"] = "Backslash";
charToKey[";"] = "Semicolon";
charToKey[":"] = "Semicolon";
charToKey["'"] = "Quote";
charToKey['"'] = "Quote";
charToKey[","] = "Comma";
charToKey["<"] = "Comma";
charToKey["."] = "Period";
charToKey[">"] = "Period";
charToKey["/"] = "Slash";
charToKey["?"] = "Slash";
charToKey[" "] = "Space";

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
