# HomePage
This is my personnal HomePage. I actually improve that with new feature.

## Usage

### Dist

You can use the version currently build in the folder `dist`.
Download files on `dist` and launch `index.html` on your browers.

### Building

You can rebuild the solution with npm :
```bash
    $ git clone (link of project)
    $ npm install
    $ npm run prod
```

The solution is build on the folder `dist`. Run `index.html` on your browers.

#### Personnalisation (not userfriendy)

A feature give the weather information on your prefered location.
It's necessary to config this on the file `src/components/App/App.js`, you find an attribute named `location`
Fill it with a correct name from this [link](http://www.prevision-meteo.ch/services/json/list-cities "title" target="_blank").

### Problem

Actually, i use a type of `input` that supported by a small part of browers.
Look [here](http://caniuse.com/#feat=input-datetime "title" target="_blank") what brower you can use for this App.

## Feature

### Meteo

At start the application, I block appear with the current waether information set in the file `src/components/App/App.js`.
At the future, this location can be insert by the user at the first start. Or by using location of the browers.

### Transport

A form is display to search a travel in public transport. This API support in main swiss public transport.
The autocompletion is provided by this same API.

#### Meteo

When you search a travel, a block appear with weather information of the destination at the hour of arrival by the first proposition.

#### Problem

I try to implement event listing on the destination. But i test 2 API of event without success.

The first is [api.myswitzerland](http://api.myswitzerland.com/), He didn't say how to get a apikey.

The secomnd is [eventful](http://api.eventful.com/), my problem is the documentation without good information and the necessity to use the supply library for javascript. A direct request was send without CORS headers.

## Links

1. Transport API
  * [Official website](https://transport.opendata.ch/)
2. Meteo API
  * [Official website](http://www.prevision-meteo.ch/services)
