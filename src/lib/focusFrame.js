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

  const scrollX = viewportWidth / 2 - centerX * zoomWithMargin;
  const scrollY = viewportHeight / 2 - centerY * zoomWithMargin;

  api.updateScene({
    appState: {
      zoom: {
        value: zoomWithMargin,
      },
      scrollX,
      scrollY,
    },
  });
}
