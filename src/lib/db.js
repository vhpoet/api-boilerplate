import Sequelize from 'sequelize'

import Config from './config'
import Log from './log'

export default class Database extends Sequelize {
  constructor (deps) {
    const logger = deps(Log)
    const log = logger.create('sequelize')
    const config = deps(Config)

    const uri = config.data.getIn(['db', 'uri'])
    const options = { logging: log.debug.bind(log) }

    log.debug('using database ' + uri)

    super(uri, options)
  }

  sync () {
    this.log('synchronizing database schema')

    return super.sync()
  }
}