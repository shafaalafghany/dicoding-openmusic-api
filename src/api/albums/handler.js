/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const { SUCCESS, ERROR } = require('../../utils/constant');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(req, res) {
    try {
      this._validator.validateAlbumPayload(req.payload);

      const albumId = await this._service.addAlbum(req.payload);

      return SUCCESS(res, 201, 'success', 'add album successful', { albumId });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async getAlbumByIdHandler(req, res) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);
      const songs = await this._service.getSongsByAlbumId(id);
      album.songs = songs;
      return SUCCESS(res, 200, 'success', '', { album });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async putAlbumByIdHandler(req, res) {
    try {
      this._validator.validateAlbumPayload(req.payload);
      const { id } = req.params;

      await this._service.editAlbumById(id, req.payload);

      return SUCCESS(res, 200, 'success', 'Update album successful');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async deleteAlbumByIdHandler(req, res) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);

      return SUCCESS(res, 200, 'success', 'Delete album successful');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }
}

module.exports = AlbumsHandler;
