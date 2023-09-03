/* eslint-disable node/no-unsupported-features/es-syntax */
import * as fs from 'fs'

const UseCase = {}

fs.readdirSync(new URL('./', import.meta.url)).forEach(async (fileName) => {
  if (fileName.includes('.use-case')) {
    const { default: useCaseImport } = await import(
      new URL(fileName, import.meta.url)
    )

    UseCase[fileName.split('.use-case')[0]] = useCaseImport
  }
})

export default UseCase
