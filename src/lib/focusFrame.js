export function focusFrame(frame, api) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const frameWidth = frame.width;
  const frameHeight = frame.height;

  const zoom = Math.min(
    viewportWidth / frameWidth,
    viewportHeight / frameHeight
  );

  const zoomWithMargin = zoom * 0.92;

  const centerX = frame.x + frameWidth / 2;
  const centerY = frame.y + frameHeight / 2;

  const scrollX = centerX * zoomWithMargin - viewportWidth / 2;
  const scrollY = centerY * zoomWithMargin - viewportHeight / 2;

  const appState = {
    zoom: {
      value: zoomWithMargin,
    },
    scrollX,
    scrollY,
  };

  if (typeof api.setAppState === "function") {
    api.setAppState(appState);
  } else {
    api.updateScene({
      appState,
      scrollToContent: false,
      commitToHistory: false,
    });
  }
}
