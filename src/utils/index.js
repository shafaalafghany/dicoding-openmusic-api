const mapAlbumDBToModel = ({id, name, year}) => ({
  id, name, year,
});

const mapSongDBToModel = ({id, title, performer}) => ({
  id, title, performer,
});

const mapSongsDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
})

module.exports = { mapAlbumDBToModel, mapSongDBToModel, mapSongsDBToModel };
