export async function loadBoard(name) {
  const response = await fetch(`/boards/${name}.excalidraw`);

  if (!response.ok) {
    throw new Error("Board not found");
  }

  return response.json();
}
