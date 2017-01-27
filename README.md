# Neighborhood Map #

This project implements a simple interactive map, where users can see the 
surroundings of my home address and the restaurants nearby.

## Intallation ##

In order to install the application, the user should download and unzip the 
project's contents (or clone it's repository) of a directory. And, in this 
directory:

- Type `npm install` (or `yarn`) to download the NodeJS requirements;
- Type `bower install` to download the client dependencies.

## Running ##

To install the application, the user should type, inside the project's 
directory:

- `npm start` (or `yarn start`) to start the server;
- Open the `http://localhost:3000` on any browser.

## Using the Neighborhood Map ##

This is the Neighborhood Map interface:

HERE_COMES_THE_PICURE

It is pretty intuitive. But, here comes some instructions:

- On the left side of the screen there's a list of points of intereset 
  (restaurants nearby my house) and a little form to filter these points;
- You may click on a point of intereset or on a marker on the map:
  - A cool gallery with pictures will be displayed (it's fetched from the 
  restaurant's Instagram feed);
  - If you click on ony one of those pictures, it will be displayed larger, with
  a legend below it.

HERE_COMES_ANOTHER_PICTURES

## Disclaimer ##

I had to implement a server because the Instagram API got a little big 
overcomplicated. It now requires that you perform an OAUTH authentication prior
to make API requests (this authentication returns a token, that should be used 
by ani API calls, and this token expires). Still well, there's a way to retrieve
JSON data from Instagram using the URL: `https://www.instagram.com/USERNAME/media/`.
Unfortunately, their server does not handle CORS (Cross-Origin Resource Sharing),
so, I've implemented a simple Express server (`index.js`) to act as a proxy 
between Instagram and my app.