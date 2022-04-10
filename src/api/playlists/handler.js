/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const { SUCCESS, ERROR } = require('../../utils/constant');

class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    this.postAddPlaylistHandler = this.postAddPlaylistHandler.bind(this);
    this.getAllPlaylistsHandler = this.getAllPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postAddSongHandler = this.postAddSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
  }

  async postAddPlaylistHandler(req, res) {
    try {
      this._validator.validatePlaylistPayload(req.payload);
      const { id } = req.auth.credentials;
      req.payload.userId = id;
      const playlistId = await this._playlistsService.addPlaylist(req.payload);

      return SUCCESS(res, 201, 'success', 'add new playlist successful', { playlistId });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async postAddSongHandler(req, res) {
    try {
      this._validator.validatePlaylistSongPayloadSchema(req.payload);
      const { id: playlistId } = req.params;
      const { id: userId } = req.auth.credentials;

      req.payload.playlistId = playlistId;
      req.payload.userId = userId;
      await this._playlistSongsService.addSong(req.payload);

      return SUCCESS(res, 201, 'success', 'add song to playlist successful');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async getAllPlaylistsHandler(req, res) {
    try {
      const { id } = req.auth.credentials;

      const playlists = await this._playlistsService.getAllPlaylists(id);

      return SUCCESS(res, 200, 'success', '', { playlists });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async getAllSongsHandler(req, res) {
    try {
      const { id } = req.params;
      const { id: userId } = req.auth.credentials;
      const data = {
        playlistId: id,
        userId,
      };
      await this._playlistsService.verifyPlaylistOwner(data);
      const playlist = await this._playlistsService.getPlaylistById(id);
      const newPlaylist = playlist[0];
      const songs = await this._playlistSongsService.getAllSongs(id);
      newPlaylist.songs = songs;
      return SUCCESS(res, 200, 'success', '', { playlist: newPlaylist });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async deletePlaylistHandler(req, res) {
    try {
      const { id: playlistId } = req.params;
      const { id: userId } = req.auth.credentials;
      const data = {
        playlistId,
        userId,
      };
      await this._playlistsService.verifyPlaylistOwner(data);
      await this._playlistsService.deletePlaylist(playlistId);

      return SUCCESS(res, 200, 'success', 'delete playlist successful');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async deleteSongHandler(req, res) {
    try {
      this._validator.validatePlaylistSongPayloadSchema(req.payload);
      const { id: userId } = req.auth.credentials;
      const { id: playlistId } = req.params;
      const data = {
        playlistId,
        userId,
        songId: req.payload.songId,
      };

      await this._playlistsService.verifyPlaylistOwner(data);
      await this._playlistSongsService.deleteSong(data);
      return SUCCESS(res, 200, 'success', 'delete song from this playlist successful');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }
}

module.exports = PlaylistsHandler;
