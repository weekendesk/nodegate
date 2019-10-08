const nodegate = require('nodegate');

const gate = nodegate();
const { aggregate } = nodegate.workers;

gate.route({
  method: 'get',
  path: '/weather/:city',
  workflow: [
    aggregate('get', 'https://www.metaweather.com/api/location/search/?query={params.city}', 'search'),
    aggregate('get', 'https://www.metaweather.com/api/location/{body.search.0.woeid}'),
  ],
});

gate.listen(8080);

console.log('Server started on port 8080');
