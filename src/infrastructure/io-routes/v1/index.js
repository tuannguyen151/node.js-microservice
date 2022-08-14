import * as fs from 'fs'

export default function initIoRoutes(io) {
  fs.readdirSync(new URL('./', import.meta.url)).forEach(async (fileName) => {
    if (fileName !== 'index' && fileName.includes('.io-route')) {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const { default: gateway } = await import(
        new URL(fileName, import.meta.url)
      )

      gateway(io)
    }
  })
}
