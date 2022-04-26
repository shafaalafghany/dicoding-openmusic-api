/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  album_id,
  album_name,
  album_year,
  album_cover,
  songs,
}) => ({
  id: album_id,
  name: album_name,
  year: album_year,
  coverUrl: album_cover,
  songs,
});

const mapSongsDBToModel = ({ song_id, song_title, song_performer }) => ({
  id: song_id,
  title: song_title,
  performer: song_performer,
});

const mapSongDBToModel = ({
  song_id,
  song_title,
  song_year,
  song_performer,
  song_genre,
  song_duration,
  song_album_id,
}) => ({
  id: song_id,
  title: song_title,
  year: song_year,
  performer: song_performer,
  genre: song_genre,
  duration: song_duration,
  albumId: song_album_id,
});

const mapPlaylistsDBToModel = ({
  playlist_id,
  playlist_name,
  user_username,
}) => ({
  id: playlist_id,
  name: playlist_name,
  username: user_username,
});

const mapActivitiesDBToModel = ({
  user_username,
  song_title,
  playlist_song_activity_action,
  playlist_song_activity_time,
}) => ({
  username: user_username,
  title: song_title,
  action: playlist_song_activity_action,
  time: playlist_song_activity_time,
});

module.exports = {
  mapAlbumDBToModel,
  mapSongDBToModel,
  mapSongsDBToModel,
  mapPlaylistsDBToModel,
  mapActivitiesDBToModel,
};
