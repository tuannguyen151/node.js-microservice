/* eslint-disable node/no-unsupported-features/es-syntax */
import * as fs from 'fs'
import sequelize from '../connection'

const createTransaction = async (transactionOptions) => {
  const transaction = await sequelize.transaction(transactionOptions)

  return transaction
}

const models = { createTransaction }

// import all models
await Promise.all(
  fs
    .readdirSync(new URL('./', import.meta.url))
    .filter((fileName) => fileName.includes('.model'))
    .map(async (fileName) => {
      const { default: model } = await import(
        new URL(fileName, import.meta.url)
      )

      models[model.name] = model
    })
)

// import all associations
await Promise.all(
  fs
    .readdirSync(new URL('./associations', import.meta.url))
    .filter((fileName) => fileName.includes('.association'))
    .map(async (fileName) => {
      await import(new URL(`./associations/${fileName}`, import.meta.url))
    })
)

export default models
