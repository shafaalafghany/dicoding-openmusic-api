/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const { SUCCESS, ERROR } = require('../../utils/constant');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(req, res) {
    try {
      this._validator.validateExportPlaylistsPayload(req.payload);
      const { targetEmail } = req.payload;
      const { playlistId } = req.params;
      const { id: userId } = req.auth.credentials;

      const data = {
        targetEmail,
        playlistId,
        userId,
      };

      await this._playlistsService.verifyPlaylistOwner(data);
      await this._producerService.sendMessage('export:playlists', JSON.stringify(data));

      return SUCCESS(res, 201, 'success', 'Permintaan Anda sedang kami proses');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, 500, 'error', error.message);
    }
  }
}

module.exports = ExportsHandler;
