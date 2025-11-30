import type { Settings } from "./Settings";

export interface Camera {
  id: string;
  name: string;
  lat: number;
  lng: number;
  settings: Settings;
  polygon: number[][];
}
