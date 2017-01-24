= HomePage
This is my personnal HomePage. I actually improve that with new feature.

== Usage

=== Dist

You can use the version currently build in the folder `dist`.
Download files on `dist` and launch `index.html` on your browers.

=== Building

You can rebuild the solution with npm :
```bash
    $ git clone (link of project)
    $ npm install
    $ npm run prod
```

The solution is build on the folder `dist`. Run `index.html` on your browers.

==== Personnalisation (not userfriendy)

A feature give the weather information on your prefered location.
It's necessary to config this on the file `src/components/App/App.js`, you find an attribute named `location`
Fill it with a correct name from this [link](http://www.prevision-meteo.ch/services/json/list-cities).

=== Problem

Actually, i use a type of `input` that supported by a small part of browers.
Look [here](http://caniuse.com/#feat=input-datetime) what brower you can use for this App.
