import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { DataTypes, Model } from 'sequelize'

/**
 * User Model
 *
 * @export
 * @class User
 * @extends {Model}
 */
export default class User extends Model {
  static modelFields = {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z .-]{2,39}$/i,
          // eslint-disable-next-line max-len
          msg: `firstname must start with a letter, 
          can have spaces, fullstops or hyphens and 
          be 3 - 40 characters long.`,
        },
      },
      set (value) {
        this.setDataValue('firstname', value.trim())
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z .-]{2,39}$/i,
          // eslint-disable-next-line max-len
          msg: `lastname must start with a letter, 
          can have spaces, fullstops or hyphens and 
          be 3 - 40 characters long.`,
        },
      },
      set (value) {
        this.setDataValue('lastname', value.trim())
      },
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'There is an existing account with this email address.',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'The email you entered is invalid.',
        },
        isTooLong (value) {
          if (value.length > 254) {
            throw new Error('email longer than 254 characters.')
          }
        },
      },
      set (value) {
        this.setDataValue('email', value.toLowerCase())
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isLongEnough (value) {
          if (value.length < 8) {
            throw new Error('Please choose a longer password')
          }
        },
      },
      get () {
        return () => this.getDataValue('password')
      },
    },
  }

  /**
   * initializes the User Model
   *
   * @static
   * @memberof User
   *
   * @param {any} sequelize The sequelize object
   *
   * @returns {objct} the User model
   */
  static init (sequelize) {
    const model = super.init(User.modelFields, { sequelize })
    model.beforeCreate('hashPassword', this.beforeHooks)
    model.beforeBulkCreate('bulkHashPassword', this.beforeBulkHooks)
    return model
  }

  /**
   * Compare argument with Object's password field
   *
   * @memberof User
   * @param   {string} password - incoming password
   * @returns {boolean} - password match or not
   */
  comparePassword (password) {
    return bcrypt.compareSync(password, this.password())
  }

  /**
   * Generate JWT token
   *
   * @memberof User
   * @param   {null} null - nil
   * @returns {string} - JWT string
   */
  generateJWToken () {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        firstname: this.firstname,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
  }

  /**
   * Verify JWT token
   *
   * @memberof User
   * @static
   * @param   {string} authToken - jwt token
   * @returns {object} - js object (id,firstname,email)
   */
  static verifyAuthToken (authToken) {
    return jwt.verify(authToken, process.env.JWT_SECRET)
  }

  /**
   * User model associations
   *
   * @static
   * @memberof User
   *
   * @param {any} models All models in the app
   *
   * @returns {null} no return
   */
  static associate (models) {
    const { Product, Basket } = models

    User.belongsToMany(Product, {
      through: Basket,
      foreignKey: 'userId',
    })
  }

  /**
   * Product model before hooks
   *
   * @static
   * @memberof Product
   *
   * @param {Promise} user - user object
   * @returns {Promise} - user object
   */
  static async beforeHooks (user) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password(), salt)
    user.password = hash
    return Promise.resolve(user)
  }

  /**
   * Product model before all hooks
   *
   * @static
   * @memberof Product
   *
   * @param {Promise} users - user object
   * @returns {Promise} - user object
   */
  static async beforeBulkHooks (users) {
    users.forEach((user) => {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(user.password(), salt)
      user.password = hash
    })
    return Promise.resolve(users)
  }
}
