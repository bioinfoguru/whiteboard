import { orderFrames } from "./frameOrdering";

export function getFrames(scene) {
  const frames = scene.elements.filter((e) => e.type === "frame");

  return orderFrames(frames);
}
