import amqp from 'amqplib'
import { rabbitMQInfoLogger } from '../../logger'

async function createRabbitMQConnection() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL)
  const channel = await connection.createChannel()

  return { connection, channel }
}

async function closeRabbitMQConnection(connection, channel) {
  await channel.close()
  await connection.close()
}

async function sendToQueue(queue, message) {
  const messageString = JSON.stringify(message)
  const { connection, channel } = await createRabbitMQConnection()

  await channel.assertQueue(queue, { durable: true })

  channel.sendToQueue(queue, Buffer.from(messageString))

  rabbitMQInfoLogger.info(
    `🚀 RabbitMQ::QUEUE '${queue}': Sent message: ${messageString}`
  )

  await closeRabbitMQConnection(connection, channel)
}

async function publishToExchange(exchange, routingKey, message) {
  const messageString = JSON.stringify(message)
  const { connection, channel } = await createRabbitMQConnection()

  await channel.assertExchange(exchange, 'topic', { durable: true })

  channel.publish(exchange, routingKey, Buffer.from(messageString))

  rabbitMQInfoLogger.info(
    `🚀 RabbitMQ::EXCHANGE '${exchange}':ROUTING_KEY '${routingKey}': Sent message: ${messageString}`
  )

  await closeRabbitMQConnection(connection, channel)
}

const RabbitMQService = {
  sendToQueue,
  publishToExchange
}

export default RabbitMQService
