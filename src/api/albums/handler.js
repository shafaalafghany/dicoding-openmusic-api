/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const { SUCCESS, ERROR } = require('../../utils/constant');

class AlbumsHandler {
  constructor(AlbumsService, StorageService, UserAlbumLikesService, validator) {
    this._albumsService = AlbumsService;
    this._storageService = StorageService;
    this._userAlbumLikesService = UserAlbumLikesService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.getAlbumLikeHandler = this.getAlbumLikeHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(req, res) {
    try {
      this._validator.validateAlbumPayload(req.payload);

      const albumId = await this._albumsService.addAlbum(req.payload);

      return SUCCESS(res, 201, 'success', 'add album successful', { albumId });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async postUploadCoverHandler(req, res) {
    try {
      const { cover } = req.payload;
      const { id } = req.params;
      this._validator.validateImageHeaders(cover.hapi.headers);
      const newData = {
        cover,
        meta: cover.hapi,
      };

      const filename = await this._storageService.writeFile(newData);
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;

      await this._albumsService.addCoverByAlbumId(id, fileLocation);

      return SUCCESS(res, 201, 'success', 'Sampul berhasil diunggah');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async postAlbumLikeHandler(req, res) {
    try {
      const { id: userId } = req.auth.credentials;
      const { id: albumId } = req.params;
      const data = {
        userId,
        albumId,
      };

      await this._albumsService.getAlbumById(albumId);
      const checkLike = await this._userAlbumLikesService.checkLike(data);

      if (checkLike > 0) {
        await this._userAlbumLikesService.deleteLike(data);
      } else {
        await this._userAlbumLikesService.addLike(data);
      }

      return SUCCESS(res, 201, 'success', 'Permintaan anda sedang diproses');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async getAlbumLikeHandler(req, res) {
    try {
      const { id } = req.params;
      const { likes, cache } = await this._userAlbumLikesService.getLikesByAlbumId(id);
      const like = parseInt(likes, 10);

      return SUCCESS(res, 200, 'success', '', { likes: like }, cache);
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
      const album = await this._albumsService.getAlbumById(id);
      const songs = await this._albumsService.getSongsByAlbumId(id);
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

      await this._albumsService.editAlbumById(id, req.payload);

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
      await this._albumsService.deleteAlbumById(id);

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
