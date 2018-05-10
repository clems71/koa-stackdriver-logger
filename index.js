const { get, now } = require('lodash');
const { lookup } = require('geoip-lite');

module.exports = () => {
  return async (ctx, next) => {
    const geo = lookup(ctx.ip);

    ctx.state.requestLog = {
      requestMethod: ctx.method,
      requestUrl: ctx.url,
      requestSize: ctx.get('content-size'),
      status: null,
      responseSize: null,
      userAgent: ctx.get('user-agent'),
      remoteIp: ctx.ip,
      serverIp: null,
      referer: ctx.get('referer'),
      latency: null,
      protocol: ctx.request.protocol,

      // extra data
      origin: ctx.get('origin'),
      country: get(geo, 'country', null)
    };

    const t0 = now();
    await next();
    const t1 = now();

    // Add more details now that all middleware executed
    ctx.state.requestLog.latency = `${(t1 - t0) / 1000}s`;
    ctx.state.requestLog.status = ctx.status;
    ctx.state.requestLog.responseSize = ctx.response.length;

    console.log(JSON.stringify({ httpRequest: ctx.state.requestLog }));
  };
};
