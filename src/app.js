import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

import router from './infrastructure/routes/v1'
import initIoRoutes from './infrastructure/io-routes/v1'

import './infrastructure/rabbitmq-listeners/v1'

const SERVICE_NAME = 'orders'

const corsOptions = {
  origin(origin, callback) {
    if (process.env.CORS_WHITELIST.split(' ').indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin: process.env.CORS_WHITELIST.split(' '),
    credentials: true
  }
})

initIoRoutes(io)

app.use(cors(corsOptions))
app.use(helmet())
app.use(compression())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
)
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PATCH, DELETE'
  )

  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-type, Authorization, Cache-control, Pragma'
  )

  res.setHeader('Access-Control-Allow-Origin', '*')

  next()
})
app.use(morgan('common'))

app.use(`/api/v1/${SERVICE_NAME}`, router)

export default httpServer
