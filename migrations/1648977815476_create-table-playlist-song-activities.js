/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('playlist_song_activities', {
    playlist_song_activity_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"playlists"',
      onUpdate: 'cascade',
      onDelete: 'SET null',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    playlist_song_activity_action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    playlist_song_activity_time: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('playlist_song_activities');
};
