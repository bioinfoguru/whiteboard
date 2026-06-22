export function focusFrame(frame, api, container) {
  const viewportWidth = container ? container.clientWidth : window.innerWidth;
  const viewportHeight = container ? container.clientHeight : window.innerHeight;

  const frameWidth = frame.width;
  const frameHeight = frame.height;

  const zoom = Math.min(
    viewportWidth / frameWidth,
    viewportHeight / frameHeight
  );

  const zoomWithMargin = zoom * 0.92;

  const centerX = frame.x + frameWidth / 2;
  const centerY = frame.y + frameHeight / 2;

  const scrollX = viewportWidth / 2 - centerX;
  const scrollY = viewportHeight / 2 - centerY;

  const appState = {
    zoom: {
      value: zoomWithMargin,
    },
    scrollX,
    scrollY,
  };

  console.log({
    frame: {
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: frame.height,
    },
    centerX,
    centerY,
    zoomWithMargin,
    computedAppState: appState,
    actualAppStateBefore: api.getAppState?.(),
  });

  if (typeof api.setAppState === "function") {
    api.setAppState(appState);
  } else {
    api.updateScene({
      appState,
      scrollToContent: false,
      commitToHistory: false,
    });
  }

  console.log({
    actualAppStateAfter: api.getAppState?.(),
  });
}
