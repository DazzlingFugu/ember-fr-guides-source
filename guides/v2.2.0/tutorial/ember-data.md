Currently, our app is using hard-coded data for _rentals_ in the `index` route handler to set the model.
As our application grows, we will want to be able to create new rentals,
make updates to them, delete them, and save these changes to a backend server.
Ember integrates with a data management library called Ember Data to help solve this problem.

Let's generate our first Ember Data model called `rental`:

```bash
ember g model rental
```

This results in the creation of a model file and a test file:

```bash
installing model
  create app/models/rental.js
installing model-test
  create tests/unit/models/rental-test.js
```

When we open the model file, we see:

```javascript {data-filename=app/models/rental.js}
import DS from 'ember-data';

export default DS.Model.extend({

});
```

Let's add the same attributes for our rental that we used in our hard-coded array of JavaScript objects -
_owner_, _city_, _type_, _image_, and _bedrooms_:

```javascript {data-filename=app/models/rental.js}
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  owner: DS.attr(),
  city: DS.attr(),
  type: DS.attr(),
  image: DS.attr(),
  bedrooms: DS.attr()
});
```

Now we have a model in our Ember Data store.

## Using Mirage with Ember Data

Ember Data can be configured to save data in a variety of ways, but often it is setup to work with a backend API server.
For this tutorial, we will use [Mirage](http://www.ember-cli-mirage.com).
This will allow us to create fake data to work with while developing our app and mimic a running backend server.

Let's start by installing Mirage:

```bash
ember install ember-cli-mirage
```

Let's now configure Mirage to send back our rentals that we had defined above by updating `app/mirage/config.js`:

```javascript {data-filename=app/mirage/config.js}
export default function() {
  this.get('/rentals', function() {
    return {
      data: [{
        type: 'rentals',
        id: 1,
        attributes: {
          title: 'Grand Old Mansion',
          owner: 'Veruca Salt',
          city: 'San Francisco',
          type: 'Estate',
          bedrooms: 15,
          image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg'
        }
      }, {
        type: 'rentals',
        id: 2,
        attributes: {
          title: 'Urban Living',
          owner: 'Mike Teavee',
          city: 'Seattle',
          type: 'Condo',
          bedrooms: 1,
          image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg'
        }
      }, {
        type: 'rentals',
        id: 3,
        attributes: {
          title: 'Downtown Charm',
          owner: 'Violet Beauregarde',
          city: 'Portland',
          type: 'Apartment',
          bedrooms: 3,
          image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg'
        }
      }]
    }
  });
}
```

This configures Mirage so that whenever Ember Data makes a GET request to `/rentals`,
Mirage will return this JavaScript object as JSON.

### Updating the Model Hook

To use our new data store, we need to update the `model` hook in our route handler.

```javascript {data-filename=app/routes/index.js}
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('rental');
  },
});
```

When we call `this.store.findAll('rental')`, Ember Data will make a GET request to `/rentals`.
Since we're using Mirage in our development environment, Mirage will return the data we've provided.
When we deploy our app to a production server, we will need to provide a backend for Ember Data to communicate with.
