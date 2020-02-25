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
    this.users = [ // epp list goes here
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

  async getShareData(name) {
    const user = this.users.find(u => u.name === name)
    const profiles = await this.models.Customer.find({ shared: false, sharedTo: name })
    if (profiles.length) {
      const ids = profiles.map(p => p._id)
      try {
        await this.models.Customer.updateMany({ _id: { $in: ids }}, { shared: true, sharedOn: new Date() })
        this.io.to(user.id).emit('send-share-data', profiles)
      } catch (e) {
        console.log(e) // Log this
        return this.io.emit('error', { message: `Error updating profiles status` })
      }
    }
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
        this.getShareData(user)
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
          const sent = await this.models.Customer.create({ ...data, shared: false, createdAt: new Date() })
          const recipient = this.users.find(u => u.name === sent.sharedTo)
          if (recipient && recipient.online) {
            this.getShareData(sent.sharedTo)
          }

          fn({ error: false })
        } catch (e) {
          fn({ error: true })
          console.log(e)
        }
      })

      socket.on('get-share-data', name => this.getShareData(name))

      socket.on('disconnect', user => {
        console.log(`User ${user} disconnected`)
        const currentUser = this.users.find(u => u.name === user)
        this.users = [
          ...this.users.filter(u => u.name !== user),
          { ...currentUser, online: false, id: null }
        ]
      })
    })
  }

  routesConfig() {
    this.appRoutes()
    this.socketEvents()
  }
}

module.exports = Routes

