import User from '../models/user'

export default class Users {
  constructor(deps) {
    this.user = deps(User)
  }

  getResource = async (ctx) => {
    ctx.body = await this.user.findAll()
  }
}