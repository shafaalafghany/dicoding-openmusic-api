/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const { ERROR } = require('./utils/constant');
//  Albums
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumsService');
const UserAlbumLikesService = require('./services/postgres/UserAlbumLikesService');
const StorageService = require('./services/storage/StorageService');
const AlbumsValidator = require('./validator/albums');
//  Songs
const songs = require('./api/songs');
const SongService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
//  Users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
//  Authentications
const authentications = require('./api/authentications');
const AuthenticationService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
//  Playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivities');
const PlaylistsValidator = require('./validator/playlists');
// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');
// Cache
const CacheService = require('./services/redis/CacheService');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumService();
  const songsService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationService();
  const playlistsService = new PlaylistsService();
  const playlistActivities = new PlaylistActivitiesService();
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);
  const playlistSongsService = new PlaylistSongsService(playlistsService, songsService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/images'));
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
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.userId,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        storageService,
        userAlbumLikesService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        playlistSongsService,
        playlistActivities,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (req, res) => {
    const { response } = req;

    if (response instanceof ClientError) return ERROR(res, response.statusCode, 'fail', response.message);

    return response.continue || response;
  });

  await server.start();
  console.log('app listen to port 5000');
};

init();
