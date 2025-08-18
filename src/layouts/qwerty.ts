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
const y0 = 0; // QWERTYUIOP
const y1 = unit; // ASDFGHJKL
const y2 = unit * 2; // ZXCVBNM
const spaceY = unit * 3; // Space row
const off1 = unit * 0.5; // A-row offset
const off2 = unit * 1.0; // Z-row offset

const rowQ = "QWERTYUIOP".split("");
const rowA = "ASDFGHJKL".split("");
const rowZ = "ZXCVBNM".split("");

const keys: KeyCoord[] = [
  ...rowQ.map((ch, i) => key(`Key${ch}`, unit * i, y0, unit, unit, ch)),
  ...rowA.map((ch, i) => key(`Key${ch}`, off1 + unit * i, y1, unit, unit, ch)),
  ...rowZ.map((ch, i) => key(`Key${ch}`, off2 + unit * i, y2, unit, unit, ch)),
  key("Space", unit * 2, spaceY, unit * 5, unit, "Space"),
];

const charToKey: Record<string, KeyId> = {};
"abcdefghijklmnopqrstuvwxyz".split("").forEach((c) => {
  charToKey[c] = `Key${c.toUpperCase()}`;
  charToKey[c.toUpperCase()] = `Key${c.toUpperCase()}`;
});
charToKey[" "] = "Space";

export const qwertyLayout: Layout = {
  id: "qwerty",
  name: "QWERTY (US, letters+space)",
  unit,
  keys,
  mapCharToKeyIds: (ch: string) => {
    const id = charToKey[ch];
    return id ? [id] : [];
  },
};
