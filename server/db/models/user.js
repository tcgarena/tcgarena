const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true
    },
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.ENUM,
    values: [
        'user', 
        'judge1', 'judge2', 'judge3',
        'moderator', 'tc', 'admin'
    ],
    defaultValue: 'user'
  },
  cockatriceName: {
    type: Sequelize.STRING,
  },
  ELO: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1600
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

User.prototype.getPerms = function() {
  switch (this.role) {
      case 'user':
          return 0
      case 'judge1':
          return 1
      case 'judge2':
          return 2
      case 'judge3':
          return 3
      case 'moderator':
          return 5
      case 'tc':
          return 7
      case 'admin':
          return 10
      default:
          return -1
  }
}

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

User.setUserRole = async function(userId, targetUserId, role) {
  try {
    const {
      [0]: requestingUser,
      [1]: targetUser
    } = await Promise.all([
      User.findById(userId), User.findById(targetUserId)
    ])
  
    if (targetUser.dataValues.role === 'admin')
      return 'cannot change an admins role'
    else {
      await targetUser.update({role})
      return 'success'
    }
    
  } catch (e) {
    console.error(e)
    return 'internal server error'
  }

}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    
    if (user.password() === '')
      throw new Error('password cannot be null')
    else if (user.password().length < 5 )
      throw new Error('password must be at least 5 characters')

    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
