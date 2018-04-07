<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Refine Webpack Plugin</h1>
  <p>Plugin make HTML files based on template with simple syntax.</p>
</div>

<h2 align="center">Install</h2>

 <p><b>Note: This plugin only works on Webpack 4.x with new hook events</b></p>

```bash
  npm i --save-dev refine-webpack-plugin
```

```bash
  yarn add --dev refine-webpack-plugin
```



If you usually create HTML files with the similar components, this plugin is for you. This is a Webpack[webpack](http://webpack.js.org/) plugin that let you generate completely HTML files by using some simple Blade syntaxes inspired from Laravel. This makes an HTML file as the entry in a child compiler. It means it will be independent of other entries in `webpack`.



<h2 align="center">Usage</h2>

The plugin will generate an HTML file for you that includes all your `webpack` as a child compiler. Just add the plugin to your `webpack`
config as follows:

**webpack.config.js**
```js
const RefineWebpackPlugin = require('refine-webpack-plugin')

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  plugins: [
    new RefineWebpackPlugin({
      template: './src/view/index.html'
    })
  ]
}
```

This will generate a file `dist/index.html` which following your template:

![alt text](https://www.dropbox.com/s/tsp7kl3l1ti2i6o/default.png?dl=1)

<h2 align="center">Options</h2>

You can pass a set of configuration options to `refine-webpack-plugin`.
Allowed values are as follows

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`template`](#)**|`{String}`|``|`webpack` require path to the template. If this value is not set, the plugin will use a default page from source.|
|**[`filename`](#)**|`{String}`|``|Output filename. If this value is not set, the plugin will use the filename of temmplate as default.|
|**[`data`](#)**|`{Object}`|``| This hold all data which will be used in the template. |
|**[`minify`](#)**|`{Boolean\|Object}`|`{Object}`| As default, I prepared some settings for [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference). You will be free to pass your options as object to minify the output. If you don't want to minify the result page. Just set this to `false` |

Let check a use case as follows:

**webpack.config.js**
```js
{
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './src/index.html',
      data: {
        name: 'Alice'
      }
    })
  ]
}
```

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Set anything you want by passing data -->
    <title>Example page</title>
</head>
<body>
    <!-- NAVBAR -->
    @include(./blocks/navbar.html)

    <!-- CHILD 1 -->
    @include(./blocks/child1.html)

    <!-- The plugin don't touch this part -->
    <script src="app.js"></script>
</body>

</html>
```

**./blocks/child1.html**
```html
<div class="child1">
  Child 1 here
</div>
```

**./blocks/child2.html**
```html
<div class="child2">
  Ok, I'm child2
  @include(./child3.html)
</div>
```

**./blocks/child3.html**
```html
<p class="child3">Are you find me, {{ name }}?</p>
```
This is result page

**./dist/index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Set anything you want by passing data -->
    <title>Example page</title>
</head>
<body>
    <!-- NAVBAR -->
    <div class="child1">
      Child 1 here
    </div>

    <!-- CHILD 1 -->
    <div class="child2">
      Ok, I'm child2
      <p class="child3">Are you find me, Alice?</p>
    </div>

    <!-- The plugin don't touch this part -->
    <script src="app.js"></script>
</body>

</html>
```

Please check example folder for the working example.

### `Generating Multiple HTML Files`

To generate more than one HTML file, declare the plugin more than once in your plugins array. Each instance of plugin will be a child compiler of the main `webpack` process

**webpack.config.js**
```js
{
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  plugins: [
    // Generates default index.html
    new RefineWebpackPlugin({
      template: 'src/views/index.html'
    }),
    // Also generate a second.html
    new RefineWebpackPlugin({  
      filename: 'test.html',
      template: 'src/views/second.html'
    })
  ]
}
```

### `Syntax`

As I said before, I write this plugin to help those who work with HTML files. I provide some simple syntax to make our life easier.

I will add new helpers in the next version soon.

**Include a subview**
```php
@include(./blocks/partial.html)
```

**Print a variable**
```html
{{ name }} 
<!-- Alice -->
{{ fullname }} 
<!-- if this variable is undefined, result is empty. -->
```

**Conditional statement (soon)**
```php
@if (number % 2 == 0)
  Even
@else
  Odd
@endif
```

**Loop statement (soon)**
```html
@each (user in users)
  <li>{{ user.name }}</li>
@endeach
```
Contributing
---

I open a bug report to creating a pull request: **every contribution is appreciated and welcome**. If you're planing to implement a new feature or change the api please create an issue first. This way we can ensure that your precious work is not in vain.

License
---
MIT
