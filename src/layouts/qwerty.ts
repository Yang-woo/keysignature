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
const yNum = 0; // 숫자 행
const yQ = unit; // QWERTYUIOP
const yA = unit * 2; // ASDFGHJKL
const yZ = unit * 3; // ZXCVBNM
const spaceY = unit * 4; // Space row
const off1 = unit * 0.5; // A-row offset
const off2 = unit * 1.0; // Z-row offset

// 행 정의
const rowNum = [
  { id: "Digit1", label: "1" },
  { id: "Digit2", label: "2" },
  { id: "Digit3", label: "3" },
  { id: "Digit4", label: "4" },
  { id: "Digit5", label: "5" },
  { id: "Digit6", label: "6" },
  { id: "Digit7", label: "7" },
  { id: "Digit8", label: "8" },
  { id: "Digit9", label: "9" },
  { id: "Digit0", label: "0" },
  { id: "Minus", label: "-" },
  { id: "Equal", label: "=" },
];

const rowQ = [
  { id: "KeyQ", label: "Q" },
  { id: "KeyW", label: "W" },
  { id: "KeyE", label: "E" },
  { id: "KeyR", label: "R" },
  { id: "KeyT", label: "T" },
  { id: "KeyY", label: "Y" },
  { id: "KeyU", label: "U" },
  { id: "KeyI", label: "I" },
  { id: "KeyO", label: "O" },
  { id: "KeyP", label: "P" },
  { id: "BracketLeft", label: "[" },
  { id: "BracketRight", label: "]" },
  { id: "Backslash", label: "\\" },
];

const rowA = [
  { id: "KeyA", label: "A" },
  { id: "KeyS", label: "S" },
  { id: "KeyD", label: "D" },
  { id: "KeyF", label: "F" },
  { id: "KeyG", label: "G" },
  { id: "KeyH", label: "H" },
  { id: "KeyJ", label: "J" },
  { id: "KeyK", label: "K" },
  { id: "KeyL", label: "L" },
  { id: "Semicolon", label: ";" },
  { id: "Quote", label: "'" },
];

const rowZ = [
  { id: "KeyZ", label: "Z" },
  { id: "KeyX", label: "X" },
  { id: "KeyC", label: "C" },
  { id: "KeyV", label: "V" },
  { id: "KeyB", label: "B" },
  { id: "KeyN", label: "N" },
  { id: "KeyM", label: "M" },
  { id: "Comma", label: "," },
  { id: "Period", label: "." },
  { id: "Slash", label: "/" },
];

// 키 좌표 생성
const keys: KeyCoord[] = [
  ...rowNum.map((k, i) => key(k.id, unit * i, yNum, unit, unit, k.label)),
  ...rowQ.map((k, i) => key(k.id, unit * i, yQ, unit, unit, k.label)),
  ...rowA.map((k, i) => key(k.id, off1 + unit * i, yA, unit, unit, k.label)),
  ...rowZ.map((k, i) => key(k.id, off2 + unit * i, yZ, unit, unit, k.label)),
  // Spacebar: start under C, end under M
  key("Space", off2 + unit * 2, spaceY, unit * 5, unit, "Space"),
];

// 문자 -> KeyId 매핑
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
  name: "QWERTY (US, extended)",
  unit,
  keys,
  mapCharToKeyIds: (ch: string) => {
    const id = charToKey[ch];
    return id ? [id] : [];
  },
};
