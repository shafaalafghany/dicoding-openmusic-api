require('dotenv').config();

const hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/albumsService');
const AlbumsValidator = require('./validator/albums');
const songs = require('./api/songs');
const SongService = require('./services/postgres/songsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();
  console.log('app listen to port 5000');
};

init();
