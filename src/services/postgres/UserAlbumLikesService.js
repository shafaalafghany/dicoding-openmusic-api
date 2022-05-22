const tableName = 'user_album_likes';
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../exceptions/ServerError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(data) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO ${tableName} VALUES ($1, $2, $3) RETURNING user_album_like_id`,
      values: [id, data.userId, data.albumId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows[0].user_album_like_id) {
      throw new InvariantError('failed to like an album');
    }

    await this._cacheService.delete(`likes:${data.albumId}`);
    return result.rows[0].user_album_like_id;
  }

  async checkLike(data) {
    const query = {
      text: `SELECT COUNT(user_album_like_id) FROM ${tableName} WHERE user_id = $1 AND album_id = $2`,
      values: [data.userId, data.albumId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    return result.rows[0].count;
  }

  async getLikesByAlbumId(id) {
    try {
      const result = await this._cacheService.get(`likes:${id}`);
      return { likes: JSON.parse(result), cache: true };
    } catch (error) {
      const query = {
        text: `SELECT COUNT(user_album_like_id) FROM ${tableName} WHERE album_id = $1`,
        values: [id],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`likes:${id}`, JSON.stringify(result.rows[0].count));

      return { likes: result.rows[0].count, cache: false };
    }
  }

  async deleteLike(data) {
    const query = {
      text: `DELETE FROM ${tableName} WHERE user_id = $1 AND album_id = $2 RETURNING user_album_like_id`,
      values: [data.userId, data.albumId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete like. Id not found');
    }

    await this._cacheService.delete(`likes:${data.albumId}`);
  }
}

module.exports = UserAlbumLikesService;
