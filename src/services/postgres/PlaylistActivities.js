const tableName = 'playlist_song_activities';
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { getCurrentTime } = require('../../utils/constant');
const { mapActivitiesDBToModel } = require('../../utils/index');
const InvariantError = require('../../exceptions/InvariantError');
const ServerError = require('../../exceptions/ServerError');

class PlayListActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivities(data) {
    const id = nanoid(16);
    const time = getCurrentTime();
    const query = {
      text: `INSERT INTO ${tableName} VALUES ($1, $2, $3, $4, $5, $6) RETURNING playlist_song_activity_id`,
      values: [id, data.playlistId, data.songId, data.userId, data.action, time],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new ServerError('There is something happen on server :D');
    }

    if (!result.rows[0].playlist_song_activity_id) {
      throw new InvariantError('Failed to add song to this playlist');
    }
  }

  async getAllActivities(data) {
    const query = {
      text: `SELECT u.user_username, s.song_title, pa.playlist_song_activity_action, pa.playlist_song_activity_time
      FROM ${tableName} pa
      JOIN users u ON u.user_id = pa.user_id
      JOIN songs s ON s.song_id = pa.song_id
      WHERE playlist_id = $1`,
      values: [data.playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapActivitiesDBToModel);
  }
}

module.exports = PlayListActivitiesService;
