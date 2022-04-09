/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('collaborations', {
    collaboration_id: {
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
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onUpdate: 'cascade',
      onDelete: 'SET null',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('collaborations');
};
