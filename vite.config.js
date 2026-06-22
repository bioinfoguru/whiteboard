import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getBoards() {
  const boardsDir = path.resolve(__dirname, 'public/boards')
  let boards = []
  try {
    boards = fs
      .readdirSync(boardsDir)
      .filter((f) => f.endsWith('.excalidraw'))
      .map((f) => f.replace(/\.excalidraw$/, ''))
  } catch {
    // directory may not exist yet
  }
  return boards
}

function generateBoardsManifest() {
  return {
    name: 'generate-boards-manifest',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/boards.json') {
          const boards = getBoards()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ boards }))
          return
        }
        next()
      })
    },
    generateBundle() {
      const boards = getBoards()
      this.emitFile({
        type: 'asset',
        fileName: 'boards.json',
        source: JSON.stringify({ boards }, null, 2),
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), generateBoardsManifest()],
})
