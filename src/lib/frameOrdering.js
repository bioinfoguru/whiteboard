export function getFrameNumber(frame) {
  const match = frame.name?.match(/^\[(\d+)\]/);

  return match ? parseInt(match[1], 10) : null;
}

export function orderFrames(frames) {
  const numbered = frames.filter((f) => getFrameNumber(f) !== null);
  const unnumbered = frames.filter((f) => getFrameNumber(f) === null);

  if (numbered.length > 0 && unnumbered.length === 0) {
    return numbered.sort((a, b) => getFrameNumber(a) - getFrameNumber(b));
  }

  if (unnumbered.length > 0) {
    return unnumbered.sort((a, b) => {
      if (a.y !== b.y) {
        return a.y - b.y;
      }

      return a.x - b.x;
    });
  }

  return [];
}
