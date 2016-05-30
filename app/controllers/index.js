module.exports = app => {

  var cs = {};
  var controllers = [
    'games',
    'pages',
  ];

  controllers.forEach(controller => {
    cs[controller] = require(`${__dirname}/${controller}`)(app);
  });

  return cs;

};
