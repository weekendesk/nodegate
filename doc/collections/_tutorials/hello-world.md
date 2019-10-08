---
layout: content
title: Hello world
---

# Hello world!

Displaying "Hello world!" is a nonsense for this kind of plugin.
We gather the weather data from a plugin API: [MetaWeather](https://www.metaweather.com/).

**We will create a route allowing us to fetch the weather for any city in the world.**

Let's check the [API documentation](https://www.metaweather.com/api/) first:

The route `/api/location/search/?query=(query)` allows us to fetch metadata about a city,
containing the `woeid` property, needed to fetch the weather of the city with the route
`/api/location/(woeid)`.

**Two API calls are needed: perfect example!**

After installing **nodegate**, let's create a file `index.js`. We will require `nodegate` and
initialize it. We will also need the aggregator worker, let's import it as well.

```js
const nodegate = require('nodegate');

const gate = nodegate();
const { aggregate } = nodegate.workers;
```

Now we will create our first route, `GET`, with the name of the city on the path. The route object
needs three attributes: the method, the path, and the workflow. The workflow will then be processed
synchronously, using on each step a *container* generated from the request, and containing the
parameters and the body of the request.

```js
gate.route({
  method: 'get',
  path: '/weather/:city',
  workflow: [
  ],
});
```

Now we have to set the workflow of our route. The process is simple: we need to fetch the `woeid`
from the first route of the API, then to fetch the weather from the second one. On this example, we
will return all the collected data by using the `aggregate` worker twice.

```js
gate.route({
  method: 'get',
  path: '/weather/:city',
  workflow: [
    aggregate('get', 'https://www.metaweather.com/api/location/search/?query={params.city}', 'search'),
    aggregate('get', 'https://www.metaweather.com/api/location/{body.search.0.woeid}'),
  ],
});
```

**Note that all the data contained on the container is accessible on the urls.**

We finally just have to listen a port:

```js
gate.listen(8080);
```

And to start our server by using your terminal:

```bash
$ node index.js
```

**That's it!** Open your brower and try it out by typing on the url: http://localhost:8080/weather/paris

You should have a JSON with all the data we wanted!

[You can find this complete example here.](../examples/hello-world)
