import _ from 'lodash'
import Sequelize from 'sequelize'

import Db from '../lib/db'
import Model from '../lib/model'
import PersistentModelMixin from '../lib/persistentModelMixin'

export default class User {
  constructor(deps) {
    this.database = deps(Db)

    class User extends Model {
      static tableName = 'user'

      static convertFromExternal (data) {
        return data
      }

      static convertToExternal (data) {
        delete data.password
        delete data.created_at
        delete data.updated_at

        return data
      }

      static convertFromPersistent (data) {
        data = _.omit(data, _.isNull)
        return data
      }

      static convertToPersistent (data) {
        return data
      }
    }

    PersistentModelMixin(User, this.database, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      email_verified: {
        type: Sequelize.BOOLEAN
      }
    })

    return User
  }
}