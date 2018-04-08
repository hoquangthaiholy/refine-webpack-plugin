<img style="width:100%; margin: 0 auto" width="200" height="200"   src="https://webpack.js.org/assets/icon-square-big.svg">
<h1 style="text-align: center;">Refine Webpack Plugin</h1>
<h2 style="text-align: center;">Refine Asset Plugin for Webpack 4.x</h2>

If you must to create HTML files with the similar parts, work with SCSS/SASS everyday but you coun't find [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin) is enough for you and you love [Laravel-Mix](https://github.com/JeffreyWay/laravel-mix), this plugin is for you. This is not a replacement of them but provides a simpler way to do that easier with Webpack 4.x which is faster and significantly smaller result. This is a [webpack](http://webpack.js.org/) plugin that let you generate assets (HTML/SCSS/SASS and so on) by using a child compiler. It means it will be independent of other entries in `webpack`.

Install
==

**Note: As I said, this plugin only works on Webpack 4.x with new hook events**

```bash
  npm i --save-dev refine-webpack-plugin
```

Usage
=

The plugin will generate assets for you that includes all your `webpack` as a child compiler. Just add the plugin to your `webpack`
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
    new RefineWebpackPlugin()
  ]
}
```

It's simple, right? As default, the plugin will detect the extension of input file to make proper output. You're always free to set `type` to change it. In this example. it will generate a file `dist/index.html` with default template I prepared in my source code:

![alt text](https://github.com/hoquangthaiholy/refine-webpack-plugin/raw/master/default.png)

Options
=

You can pass a set of configuration options to `refine-webpack-plugin`. You can only pass a `{String}` as input filename or a `{Object}`.
Allowed values are as follows

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`input`](#)**|`{String}`|`~index.html`|`webpack` require path to the input file. If this value is not set, the plugin will use a default HTML page from source.|
|**[`type`](#)**|`{String}`|``|Output filetype. If this value is not set, the plugin will use input file extension.|
|**[`output`](#)**|`{String}`|``|Output filename. If this value is not set, the plugin will use the input filename.|
|**[`data`](#)**|`{Object}`|`{}`| This hold all data which will be used in the template. |
|**[`htmlOptions`](#)**|`{Boolean\|Object}`|`{Object}`| I prepared some settings for [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference). You will be free to pass your options as object to minify the output. If you don't want to minify the result page. Just set this to `false` |
|**[`sassOptions`](#)**|`{Object}`|`{Object}`| You can pass [node-sass](https://github.com/sass/node-sass)'s options here |

In the first time, I tried to integrate [js-beautify](https://github.com/beautify-web/js-beautify) to generate better-looking HTML, but I found this is not neccesary. You can use your IDE's auto formatting for this.

Example
=
Let check an example:

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
      input: './src/index.html',
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

### `Generating Multiple Asset Files`

To generate more than one asset file, declare the plugin more than once in your plugins array. Each instance of plugin will be a child compiler of the main `webpack` process

**webpack.config.js**
```js
{
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  plugins: [
    // Pass just a string for input filepath
    new RefineWebpackPlugin('./src/views/index.html'),
    // Generate a second.html as test.html
    new RefineWebpackPlugin({  
      input: './src/views/second.html',
      output: 'test.html',
    }),
    // Also generate a SCSS/SASS file
    new RefineWebpackPlugin('./src/scss/app.scss'), 
  ]
}
```

Syntax
=
HTML
-

I provide some simple heplers. More helper will come soon.

**Include a subview**
```php
@include(./blocks/partial.html)
```

**Print a variable**
```html
{{ name }} 
<!-- Alice -->
{{ 1 + 1 }}
<!-- 2 -->
{{ '1' + '1' }}
<!-- '11' -->
{{ 'Hello ' + name }}
<!-- Hello Alice -->
{{ fullname }} 
<!-- if this variable is undefined, result is empty. -->
```

**Conditional statement (coming soon)**
```php
@if (number % 2 == 0)
  Even
@else
  Odd
@endif
```

**Loop statement (coming soon)**
```html
@each (user in users)
  <li>{{ user.name }}</li>
@endeach
```
Contributing
---

I open a bug report to creating a pull request: **every contribution is appreciated and welcome**. If you're planing to implement a new feature or change the api please create an issue first. This way we can ensure that your precious work is not in vain.

If you like my work and want to distibute your skill with this project. Give me a hand to make this better. 

License
---
MIT
