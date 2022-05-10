/* eslint-disable no-underscore-dangle */
const tableName = 'playlists';
const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlist_id, playlist_name FROM ${tableName} WHERE playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    const newQuery = {
      text: 'SELECT s.song_id, s.song_title, s.song_performer FROM songs s JOIN playlist_songs ps on s.song_id = ps.song_id WHERE ps.playlist_id = $1',
      values: [id],
    };

    const newResult = await this._pool.query(newQuery);

    result.rows[0].songs = newResult.rows;
    return result.rows[0];
  }
}

module.exports = PlaylistsService;
