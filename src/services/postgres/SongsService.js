const tableName = 'songs';
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapSongDBToModel, mapSongsDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../exceptions/ServerError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong(data) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO ${tableName} values ($1, $2, $3, $4, $5, $6, $7) RETURNING song_id`,
      values: [id, data.title, data.year, data.performer, data.genre, data.duration, data.albumId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows[0].song_id) {
      throw new InvariantError('Failed to add song');
    }

    return result.rows[0].song_id;
  }

  async addSongWithAlbumId(data) {
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO ${tableName} values ($1, $2, $3, $4, $5, $6, $7) RETURNING song_id`,
      values: [id, data.title, data.year, data.performer, data.genre, data.duration, data.albumId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows[0].song_id) {
      throw new InvariantError('Failed to add song');
    }

    return result.rows[0].song_id;
  }

  async getSongs() {
    const result = await this._pool.query(`SELECT song_id, song_title, song_performer FROM ${tableName}`);

    return result.rows.map(mapSongsDBToModel);
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * FROM ${tableName} where song_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Id song not found');
    }

    return result.rows.map(mapSongDBToModel)[0];
  }

  async getSongByAlbumId(id) {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE song_album_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Id album not found');
    }

    return result.rows.map(mapSongsDBToModel);
  }

  async getSongByTitle(title) {
    const query = {
      text: "SELECT * FROM songs where LOWER(song_title) LIKE '%' || $1 || '%'",
      values: [title],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Song title not found');
    }

    return result.rows.map(mapSongsDBToModel);
  }

  async getSongByPerformer(performer) {
    const query = {
      text: "SELECT * FROM songs where LOWER(song_performer) LIKE '%' || $1 || '%'",
      values: [performer],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Song performer not found');
    }

    return result.rows.map(mapSongsDBToModel);
  }

  async getSongByTitleAndPerformer(data) {
    const query = {
      text: "SELECT * FROM songs where LOWER(song_title) LIKE '%' || $1 || '%' and LOWER(song_performer) LIKE '%' || $2 || '%'",
      values: [data.title, data.performer],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Song title and song performer not found');
    }

    return result.rows.map(mapSongsDBToModel);
  }

  async editSongByIdWithAlbumId(id, data) {
    const query = {
      text: `UPDATE ${tableName}
      SET song_title = $1, song_year = $2, song_performer = $3, song_genre = $4, song_duration = $5,
      song_album_id = $6
      WHERE song_id = $7 RETURNING song_id`,
      values: [data.title, data.year, data.performer, data.genre, data.duration, data.albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Fail to update song. Id song not found');
    }
  }

  async editSongById(id, data) {
    const query = {
      text: `UPDATE ${tableName}
      SET song_title = $1, song_year = $2, song_performer = $3, song_genre = $4, song_duration = $5
      WHERE song_id = $6 RETURNING song_id`,
      values: [data.title, data.year, data.performer, data.genre, data.duration, id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Fail to update song. Id song not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM ${tableName} WHERE song_id = $1 RETURNING song_id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Fail to delete song.Id Song not found');
    }
  }
}

module.exports = SongService;
