/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('playlists', {
    playlist_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    playlist_owner: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"users"',
      onUpdate: 'cascade',
      onDelete: 'SET null',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('playlists');
};
