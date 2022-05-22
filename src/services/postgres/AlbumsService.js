const tableName = 'albums';
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapAlbumDBToModel, mapSongsDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../exceptions/ServerError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum(data) {
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO ${tableName} values($1, $2, $3) RETURNING album_id`,
      values: [id, data.name, data.year],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows[0].album_id) {
      throw new InvariantError('Failed to add album');
    }

    return result.rows[0].album_id;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM ${tableName} where album_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    return result.rows.map(mapAlbumDBToModel)[0];
  }

  async getSongsByAlbumId(id) {
    const query = {
      text: 'SELECT * FROM songs where song_album_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    return result.rows.map(mapSongsDBToModel);
  }

  async addCoverByAlbumId(id, fileName) {
    const query = {
      text: `UPDATE ${tableName} set album_cover = $1 WHERE album_id = $2 RETURNING album_id`,
      values: [fileName, id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Failed to renew album. Id not found');
    }
  }

  async editAlbumById(id, data) {
    const query = {
      text: 'UPDATE albums set album_name = $1, album_year = $2 where album_id = $3 RETURNING album_id',
      values: [data.name, data.year, id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Failed to renew album. Id not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums where album_id = $1 RETURNING album_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete album. Id not found');
    }
  }
}

module.exports = AlbumService;
