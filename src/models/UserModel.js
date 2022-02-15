const { Model } = require("objection")

class UserModel extends Model {
  static tableName = "user"
}

module.exports = UserModel
