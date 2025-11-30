import type { Camera } from "./Camera";

export type CameraData = Omit<Camera, "id" | "polygon">;
