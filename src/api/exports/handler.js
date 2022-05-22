const { SUCCESS } = require('../../utils/constant');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(req, res) {
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
  }
}

module.exports = ExportsHandler;
