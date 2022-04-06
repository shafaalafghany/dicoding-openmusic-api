/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('albums', {
    album_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_year: {
      type: 'integer',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('albums');
};
