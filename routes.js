'use strict'

const { CustomerSchema } = require('./schema')

class Routes {
  constructor(app, socket, db) {
    this.app = app
    this.io = socket
    this.db = db

    this.models = {
      Customer: this.db.model('Customer', CustomerSchema)
    }
    this.users = [
      { name: 'Kit Keat', online: false, id: null },
      { name: 'Boyle', online: false, id: null },
      { name: 'Shamsudeen', online: false, id: null }
    ]
  }

  appRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({ message: 'Application is healthy'})
    })
  }

  socketEvents() {
    this.io.on('connection', socket => {
      socket.on('username', user => {
        console.log(`User connected, socket id: ${socket.id}, user name: ${user}`)
        const currentUser = this.users.find(u => u.name === user)
        this.users = [
          ...this.users.filter(u => u.name !== user),
          { ...currentUser, online: true, id: socket.id }
        ]
        this.io.emit('recipient-list', this.users, socket.id)
        this.io.emit('get-share-data', user)
      })

      socket.on('send-share-data', async (data, fn) => {
        if (!data || !data.profiles || !data.profiles.uuid) {
          return this.io.emit('error', { message: 'Invalid profile data' })
        }

        if (!data.sharedFrom) {
          return this.io.emit('error', { message: 'Undefined sender' })
        }

        if (!data.sharedTo) {
          return this.io.emit('error', { message: 'Undefined recipient' })
        }

        try {
          const existing = await this.models.Customer.findOne({ 'profiles.uuid': data.profiles.uuid, sharedTo: data.sharedTo }).exec()
          if (existing) {
            return this.io.emit('error', { message: `Profile already shared to ${data.sharedTo}` })
          }
        } catch (e) {
          console.log(e) // log this
          return this.io.emit('error', { message: `Error validating profile with database` })
        }

        try {
          const sent = await this.models.Customer.create({ ...data, shared: false, sharedOn: new Date() })
          const receipent = this.users.find(u => u.name === sent.sharedTo)
          if (receipent && receipent.online) {
            this.emit('get-share-data', sent.sharedTo)
          }

          fn({ error: false })
        } catch (e) {
          fn({ error: true })
          console.log(e)
        }
      })

      socket.on('get-share-data', async name => {
        console.log('Received polling from', name)
        const user = this.users.find(u => u.name === name)
        console.log('user', user)
        const profiles = await this.models.Customer.find({ sharedTo: name })
        if (profiles.length) {
          console.log('emitting to user', user.id)
          this.io.to(user.id).emit('send-share-data', profiles)
        }
      })

      socket.on('disconnect', () => {
        console.log('User disconnected')
      })
    })
  }

  routesConfig() {
    this.appRoutes()
    this.socketEvents()
  }
}

module.exports = Routes

