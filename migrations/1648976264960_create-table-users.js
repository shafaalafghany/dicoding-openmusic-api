/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('users', {
    user_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_username: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    user_password: {
      type: 'TEXT',
      notNull: true,
    },
    user_fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('users');
};
