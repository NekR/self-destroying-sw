# `webpack-remove-servicewokrer-plugin`

Helps with ServiceWorker removal from your website. [For more details](https://medium.com/@nekrtemplar/self-destroying-serviceworker-73d62921d717)

## Usage

```
npm install webpack-remove-servicewokrer-plugin
```

Then add it to the list of plugins in `webpack.config.js`:

```js
plugins: [
  new RemoveServiceWorkerPlugin()
]
```

### Specifying ServiceWorker's filename

```
new RemoveServiceWorkerPlugin({ filename: 'sw.js' });
```

Default is: `'sw.js'`

## License

MIT