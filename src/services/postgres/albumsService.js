const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapAlbumDBToModel } = require('../../utils/index');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../exceptions/ServerError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }
  
}
