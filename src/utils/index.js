/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  album_id,
  album_name,
  album_year,
  songs,
}) => ({
  id: album_id,
  name: album_name,
  year: album_year,
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

const mapPlaylistDBToModel = ({
  playlist_id,
  playlist_name,
  playlist_owner,
}) => ({
  id: playlist_id,
  name: playlist_name,
  owner: playlist_owner,
});

module.exports = { mapAlbumDBToModel, mapSongDBToModel, mapSongsDBToModel, mapPlaylistDBToModel };
