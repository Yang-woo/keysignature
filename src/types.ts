export type KeyId = string; // e.g., "KeyQ", "Space"
export interface KeyCoord {
  id: KeyId;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
}
export interface Layout {
  id: string;
  name: string;
  unit: number; // grid size in px
  keys: KeyCoord[];
  mapCharToKeyIds: (ch: string) => KeyId[]; // 1:n 지원 (한글/천지인 확장 대비)
}
