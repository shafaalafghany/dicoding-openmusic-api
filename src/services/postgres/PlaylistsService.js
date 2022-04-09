/* eslint-disable no-trailing-spaces */
/* eslint-disable no-underscore-dangle */
const tableName = 'playlists';
const { Pool } = require('pg');
const { nanoid } = require('nanoid')
const { mapPlaylistsDBToModel } = require('../../utils');
const ServerError = require('../../exceptions/ServerError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(data) {
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3) RETURNING playlist_id`,
      values: [id, data.name, data.userId],
    };

    const result = await this._pool.query(query);

    if (!result) { 
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows[0].playlist_id) {
      throw new InvariantError('Failed to add playlist');
    }

    return result.rows[0].playlist_id;
  }

  async getPlaylistById(id) {
    const result = await this._pool.query(`SELECT * FROM ${tableName} WHERE playlist_id = ${id}`);

    if (!result.rows.length) {
      throw new NotFoundError('playlist not found');
    }

    return result.rows[0].map(mapPlaylistsDBToModel);
  }

  async getAllPlaylists(id) {
    const query = {
      text: `SELECT * FROM ${tableName} where playlist_owner = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapPlaylistsDBToModel);
  }

  async deletePlaylist(id) {
    const query = {
      text: `DELETE FROM ${tableName} WHERE playlist_id = $1 RETURNING playlist_id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete playlist. Id not found');
    }
  }

  async verifyPlaylistOwner(data) {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE playlist_id = $1`,
      values: [data.playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('playlist not found');
    }

    const playlist = result.rows[0];

    if (playlist.playlist_owner !== data.userId) {
      throw new AuthorizationError('you are not the playlist owner');
    }
  }
}

module.exports = PlaylistsService;
