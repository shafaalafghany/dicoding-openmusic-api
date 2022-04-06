/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('songs', {
    song_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    song_title: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_year: {
      type: 'integer',
      notNull: true,
    },
    song_performer: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_genre: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_duration: {
      type: 'integer',
      notNull: false,
    },
    song_album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"albums"',
      onUpdate: 'cascade',
    },
  });

  pgm.createIndex('songs', 'song_album_id');
};

exports.down = pgm => {
  pgm.dropTable('songs');
};
