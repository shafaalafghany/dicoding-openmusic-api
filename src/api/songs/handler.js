/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const { SUCCESS, ERROR } = require('../../utils/constant');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAddSongHandler = this.postAddSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postAddSongHandler(req, res) {
    try {
      this._validator.validateSongPayload(req.payload);
      let songId;

      if (req.payload.albumId !== undefined) {
        songId = await this._service.addSongWithAlbumId(req.payload);
      } else {
        songId = await this._service.addSong(req.payload);
      }

      return SUCCESS(res, 201, 'success', 'add song successful', { songId });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, 400, 'fail', error.message);
      }

      return ERROR(res, 500, 'error', error.message);
    }
  }

  async getSongsHandler(req, res) {
    try {
      const { title, performer } = req.query;
      let songs;
      if (title !== undefined && performer !== undefined) {
        songs = await this._service.getSongByTitleAndPerformer(req.query);
      } else if (title !== undefined) {
        songs = await this._service.getSongByTitle(req.query.title);
      } else if (performer !== undefined) {
        songs = await this._service.getSongByPerformer(req.query.performer);
      } else {
        songs = await this._service.getSongs();
      }

      return SUCCESS(res, 200, 'success', '', { songs });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, 400, 'fail', error.message);
      }

      return ERROR(res, 500, 'error', error.message);
    }
  }

  async getSongByIdHandler(req, res) {
    try {
      const { id } = req.params;
      const song = await this._service.getSongById(id);

      return SUCCESS(res, 200, 'success', '', { song });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, 500, 'error', error.message);
    }
  }

  async putSongByIdHandler(req, res) {
    try {
      this._validator.validateSongPayload(req.payload);
      const { id } = req.params;

      await this._service.editSongById(id, req.payload);

      return SUCCESS(res, 200, 'success', 'Update song successful');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, 500, 'error', error.message);
    }
  }

  async deleteSongByIdHandler(req, res) {
    try {
      const { id } = req.params;
      await this._service.deleteSongById(id);

      return SUCCESS(res, 200, 'success', 'Delete song successful');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, 500, 'error', error.message);
    }
  }
}

module.exports = SongHandler;
