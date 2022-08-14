import * as fs from 'fs'

const useCase = {}

fs.readdirSync(new URL('./', import.meta.url)).forEach(async (fileName) => {
  if (fileName !== 'index' && fileName.includes('.use-case')) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { default: useCaseImport } = await import(
      new URL(fileName, import.meta.url)
    )

    useCase[fileName.split('.use-case')[0]] = useCaseImport
  }
})

export default useCase
