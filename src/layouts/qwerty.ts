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
const yNum = 0; // 숫자열
const y0 = unit; // QWERTYUIOP[]\
const y1 = unit * 2; // ASDFGHJKL;'
const y2 = unit * 3; // ZXCVBNM,./
const spaceY = unit * 4; // Space row
const off1 = unit * 0.5; // A-row offset
const off2 = unit * 1.0; // Z-row offset

const rowNum: [KeyId, string][] = [
  ["Digit1", "1"],
  ["Digit2", "2"],
  ["Digit3", "3"],
  ["Digit4", "4"],
  ["Digit5", "5"],
  ["Digit6", "6"],
  ["Digit7", "7"],
  ["Digit8", "8"],
  ["Digit9", "9"],
  ["Digit0", "0"],
  ["Minus", "-"],
  ["Equal", "="],
];

const rowQ: [KeyId, string][] = [
  ..."QWERTYUIOP".split("").map((ch) => [`Key${ch}`, ch] as [KeyId, string]),
  ["BracketLeft", "["],
  ["BracketRight", "]"],
  ["Backslash", "\\"],
];

const rowA: [KeyId, string][] = [
  ..."ASDFGHJKL".split("").map((ch) => [`Key${ch}`, ch] as [KeyId, string]),
  ["Semicolon", ";"],
  ["Quote", "'"],
];

const rowZ: [KeyId, string][] = [
  ..."ZXCVBNM".split("").map((ch) => [`Key${ch}`, ch] as [KeyId, string]),
  ["Comma", ","],
  ["Period", "."],
  ["Slash", "/"],
];

const keys: KeyCoord[] = [
  ...rowNum.map(([id, label], i) => key(id, unit * i, yNum, unit, unit, label)),
  ...rowQ.map(([id, label], i) => key(id, unit * i, y0, unit, unit, label)),
  ...rowA.map(([id, label], i) =>
    key(id, off1 + unit * i, y1, unit, unit, label)
  ),
  ...rowZ.map(([id, label], i) =>
    key(id, off2 + unit * i, y2, unit, unit, label)
  ),
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
charToKey["-"] = "Minus";
charToKey["="] = "Equal";
charToKey["["] = "BracketLeft";
charToKey["]"] = "BracketRight";
charToKey["\\"] = "Backslash";
charToKey[";"] = "Semicolon";
charToKey["'"] = "Quote";
charToKey[","] = "Comma";
charToKey["."] = "Period";
charToKey["/"] = "Slash";
charToKey[" "] = "Space";

export const qwertyLayout: Layout = {
  id: "qwerty",
  name: "QWERTY (US)",
  unit,
  keys,
  mapCharToKeyIds: (ch: string) => {
    const id = charToKey[ch];
    return id ? [id] : [];
  },
};
