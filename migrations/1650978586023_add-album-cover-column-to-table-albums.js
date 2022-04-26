/* eslint-disable camelcase */
/* eslint-disable arrow-parens */

exports.up = pgm => {
  pgm.addColumn('albums', {
    album_cover: {
      type: 'VARCHAR(100)',
      default: null,
    },
  });
};

exports.down = pgm => {
  pgm.dropColumn('albums', 'album_cover');
};
