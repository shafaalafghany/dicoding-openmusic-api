const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postAddUserHandler,
  },
];

module.exports = routes;