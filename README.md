# relay-cart
A simple shopping cart example leveraging relay &amp; GraphQL with routing and pagination

## Usage
clone this repo and run:

```shell
npm install
npm start
```
and then visit [http://localhost:3000/](http://localhost:3000/)

## Demo

View a demo here: [http://120.76.218.113/relay-cart/demo.html](http://120.76.218.113/relay-cart/demo.html).
Add items to the cart and change the quantities.

## Developing

Any changes to files in the 'js' directory the server to automatically rebuild the app and refresh your browser.
If at any time you make changes to data/schema.js, stop the server, regenerate data/schema.json, and restart the server:

```shell
npm run updateSchema
npm start
```
