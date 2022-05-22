const { SUCCESS } = require('../../utils/constant');

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
    this._validator.validateSongPayload(req.payload);
    let songId;

    if (req.payload.albumId !== undefined) {
      songId = await this._service.addSongWithAlbumId(req.payload);
    } else {
      songId = await this._service.addSong(req.payload);
    }

    return SUCCESS(res, 201, 'success', 'add song successful', { songId });
  }

  async getSongsHandler(req, res) {
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
  }

  async getSongByIdHandler(req, res) {
    const { id } = req.params;

    const song = await this._service.getSongById(id);

    return SUCCESS(res, 200, 'success', '', { song });
  }

  async putSongByIdHandler(req, res) {
    this._validator.validateSongPayload(req.payload);
    const { id } = req.params;

    await this._service.editSongById(id, req.payload);

    return SUCCESS(res, 200, 'success', 'Update song successful');
  }

  async deleteSongByIdHandler(req, res) {
    const { id } = req.params;

    await this._service.deleteSongById(id);

    return SUCCESS(res, 200, 'success', 'Delete song successful');
  }
}

module.exports = SongHandler;
