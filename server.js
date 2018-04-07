const path = require('path');
const Koa = require('koa');
const render = require('koa-ejs');
const koaWebpack = require('koa-webpack');
const webpackConfig = require('./webpack.config.js');
const homeRouter = require('./routes/home');

const app = new Koa();

app.proxy = true;
app.use(koaWebpack({ config: webpackConfig, hot: false }));

render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: false,
});

app.use(homeRouter.routes());

app.listen(3200);
