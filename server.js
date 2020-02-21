'use strict'

const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const routes = require('./routes')
const mongoUrl = 'mongodb+srv://root:InwN60093RBAqcG2@cna-cafz8.mongodb.net/test?retryWrites=true&w=majority'

class Server {
  constructor() {
    this.port = process.env.PORT || 3000
    this.host = 'localhost'
    this.app = express()
    this.http = http.Server(this.app)
    this.socket = socketio(this.http)
    this.db = mongoose.createConnection(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    console.log('Database connected')
  }

  appConfig() {
    this.app.use(express.json())
  }

  includeRoutes() {
    new routes(this.app, this.socket, this.db).routesConfig()
  }

  appExecute() {
    this.appConfig();
    this.includeRoutes()
    this.http.listen(this.port, this.host, () => {
      console.log(`Listening to http://${this.host}:${this.port}`)
    })
  }
}

new Server().appExecute()
