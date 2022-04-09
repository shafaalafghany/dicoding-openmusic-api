/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('playlist_songs', {
    playlist_song_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"playlists"',
      onUpdate: 'cascade',
      onDelete: 'SET null',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
      references: '"songs"',
      onUpdate: 'cascade',
      onDelete: 'SET null',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('playlist_songs');
};
