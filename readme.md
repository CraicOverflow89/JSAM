JSAM Project
============

JavaScript Active Markdown parser converts _markdown_ format to _html_ on the clientside. There is **no release** at this moment.

### Usage

Just include the distribution code in your page with a regular script import;

```
<script src = "https://raw.githubusercontent.com/CraicOverflow89/JSAM/master/res/jsam.min.js"></script>
```

You can pass the parser a particular element to convert;

```
jsam.convert(document.getElementById("my_element"))
```

### Build Steps

It's currently very easy to get a working version.

```
$tsc src/jsam.ts
$jsmin src res
```

### Tasks

 - add support for nested lists
 - expand the `convert` method to accept _varagrs_ and maybe parse document for elements to process

### Issues

 - second ordered and unordered lists don't work correctly

### See Also

 - [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
 - [JavaScript Minifer](https://github.com/CraicOverflow89/JavaScript-Minifier)