const nodegate = require('nodegate');

const gate = nodegate();
const { aggregate } = nodegate.modifiers;

gate.route({
  method: 'get',
  path: '/weather/:city',
  pipeline: [
    aggregate('get', 'http://www.metaweather.com/api/location/search/?query={params.city}', 'search'),
    aggregate('get', 'http://www.metaweather.com/api/location/{body.search.0.woeid}'),
  ],
});

gate.listen(8080);
