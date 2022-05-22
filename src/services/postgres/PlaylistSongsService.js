const tableName = 'playlist_songs';
const anotherTableName = 'songs';
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapSongsDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const ServerError = require('../../exceptions/ServerError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(playlistsService, songsService) {
    this._pool = new Pool();
    this._playlistsService = playlistsService;
    this._songsService = songsService;
  }

  async addSong(data) {
    await this._songsService.getSongById(data.songId);
    await this._playlistsService.verifyPlaylistOwner(data);
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3) RETURNING playlist_song_id`,
      values: [id, data.playlistId, data.songId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows[0].playlist_song_id) {
      throw new InvariantError('Failed to add song to this playlist');
    }
  }

  async getAllSongs(id) {
    const query = {
      text:
      `SELECT s.song_id, s.song_title, s.song_performer
      FROM ${anotherTableName} s
      JOIN ${tableName} ps on s.song_id = ps.song_id
      WHERE ps.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapSongsDBToModel);
  }

  async deleteSong(data) {
    const query = {
      text: `DELETE FROM ${tableName}
      WHERE playlist_id = $1 AND song_id = $2
      RETURNING playlist_song_id`,
      values: [data.playlistId, data.songId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete Song. id not found');
    }
  }
}

module.exports = PlaylistSongsService;
