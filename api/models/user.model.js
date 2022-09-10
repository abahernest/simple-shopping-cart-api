import bcrypt from 'bcrypt'
import { Sequelize, DataTypes, Model } from 'sequelize'

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
      type: Sequelize.STRING,
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
            throw new Error(
              'email longer than 254 characters.'
            )
          }
        },
      },
      set (value) {
        this.setDataValue('email', value.toLowerCase())
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isLongEnough (value) {
          if (value.length < 8) {
            throw new Error('Please choose a longer password')
          }
          const salt = bcrypt.genSaltSync(10)
          const hash = bcrypt.hashSync(value, salt)
          this.setDataValue('password', hash)
        },
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
    return model
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
}
