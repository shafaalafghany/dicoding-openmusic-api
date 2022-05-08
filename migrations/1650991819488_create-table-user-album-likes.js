/* eslint-disable camelcase */
/* eslint-disable arrow-parens */

exports.up = pgm => {
  pgm.createTable('user_album_likes', {
    user_album_like_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"users"',
      onUpdate: 'cascade',
      onDelete: 'SET null',
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"albums"',
      onUpdate: 'cascade',
      onDelete: 'SET null',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('user_album_likes');
};
