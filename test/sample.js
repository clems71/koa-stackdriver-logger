const Koa = require('koa');
const route = require('koa-route');

const app = new Koa();

const koaStackdriverLogger = require('..');

// logger setup
app.use(koaStackdriverLogger());

app.use(
  route.get('/', ctx => {
    ctx.body = {
      status: 'up',
      info: 'sample server to test koa-stackdriver-logger'
    };
  })
);

app.listen(8080);
console.log('listening on port 8080');
