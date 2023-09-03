import * as fs from 'fs'

import amqp from 'amqplib'
import { rabbitMQInfoLogger } from '../../../logger'

async function createRabbitMQConnection() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL)
  const channel = await connection.createChannel()

  return { connection, channel }
}

async function startListeningToQueue(queue, callback) {
  const { channel } = await createRabbitMQConnection()

  await channel.assertQueue(queue, { durable: true })

  channel.consume(queue, async (msg) => {
    try {
      const data = JSON.parse(msg.content.toString())

      await callback(data)

      rabbitMQInfoLogger.info(
        `RabbitMQ::${queue}: Received data from queue '${queue}': ${JSON.stringify(
          data
        )}`
      )

      channel.ack(msg)
    } catch (e) {
      rabbitMQInfoLogger.info(
        `RabbitMQ::${queue}: Error while receiving data from queue '${queue}': ${e.message}`
      )
    }
  })
}

async function startListeningToExchange(
  exchangeName,
  routingKey,
  queueName,
  callback
) {
  const { channel } = await createRabbitMQConnection()

  await channel.assertExchange(exchangeName, 'topic', { durable: true })
  const { queue } = await channel.assertQueue(queueName)
  await channel.bindQueue(queue, exchangeName, routingKey)

  channel.consume(queue, async (msg) => {
    try {
      const data = JSON.parse(msg.content.toString())

      await callback(data)

      rabbitMQInfoLogger.info(
        `RabbitMQ::${queue}: Received data from queue '${queue}': ${JSON.stringify(
          data
        )}`
      )

      channel.ack(msg)
    } catch (e) {
      rabbitMQInfoLogger.info(
        `RabbitMQ::${queue}: Error while receiving data from queue '${queue}': ${e.message}`
      )
    }
  })
}

fs.readdirSync(new URL('./', import.meta.url)).forEach(async (fileName) => {
  if (fileName !== 'index' && fileName.includes('.listener')) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { default: listListener } = await import(
      new URL(fileName, import.meta.url)
    )

    listListener.map(async (listener) => {
      if (listener.exchange)
        await startListeningToExchange(
          listener.exchange,
          listener.routingKey,
          listener.queue,
          listener.handler
        )
      else await startListeningToQueue(listener.queue, listener.handler)
    })
  }
})
