import convict from 'convict'
import dotenv from 'dotenv'

dotenv.config()

export const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3001,
    env: 'PORT',
    arg: 'port'
  },
  mongo: {
    doc: 'Mongo url to connect.',
    format: String,
    default: 'mongodb://localhost:27017/test',
    env: 'MONGO_URL',
    arg: 'url'
  },
  jwt: {
    doc: 'Jwt secret key.',
    format: String,
    default: 'secret',
    env: 'JWT_SECRET',
    arg: 'secret'
  }
})
