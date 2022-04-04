/* eslint-disable no-underscore-dangle */
const tableName = 'users';
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
// const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewUsername(data) {
    const query = {
      text: `SELECT user_username FROM ${tableName} where user_username = $1`,
      values: [data.username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Fail to add user. Username already taken.');
    }
  }

  async addUser(data) {
    await this.verifyNewUsername(data);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3, $4) RETURNING user_id`,
      values: [id, data.username, hashedPassword, data.fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].user_id;
  }

  async getUserById(data) {
    const query = {
      text: `SELECT user_id, user_username, user_fullname FROM ${tableName} WHERE user_id = $1`,
      values: [data.userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = UsersService;
