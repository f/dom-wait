## DOM-wait

Multiple Process Loader Management for vanilla JavaScript.

**Read the [Medium post "Managing Complex Waiting Experiences on Web UIs"](https://medium.com/@fkadev/managing-complex-waiting-experiences-on-web-uis-29534d2d92a8).**

> DOM wait is a vanilla implementation of [vue-wait](https://github.com/f/vue-wait).

**DOM-wait** helps to manage multiple loading states on the page without any conflict. It's based on a **very simple idea** that manages an array with multiple loading states.

<img src="./resources/dom-wait.gif?v1" width="600">

# Key Features

 - Zero-dependency. Requires nothing to work.
 - No CSS. Attaches and detaches elements instead of showing and hiding them.
 - Very simple API.

# Quick Start

Add `dom-wait.js` to `head`.

```html
<html>
  <head>
    <script src="dom-wait.js"></script>
  </head>
  <body>
  </body>
</html>
```

# Usage

## 1. Write your HTML

`dom-wait` is very easy to use and migrate your current projects. Assume you have some API calls `ipapi.co` to get client IP.

```html
<div>
  <h2>Your IP is:</h2>
  <div id='ip'>#.#.#.#</div>

  <script>
    var $ip = document.getElementById('ip');
    fetch('https://ipapi.co/json')
      .then(response => response.json())
      .then(response => {
        $ip.innerHTML = response.ip;
      });
  </script>
</div>
```

## 2. Add `data-wait-for` attribute

`dom-wait` watches elements with `data-wait-for` attribute with loading message.

```html
<div data-wait-for='getting ip'>
  <h2>Your IP is:</h2>
  <div id='ip'>#.#.#.#</div>
</div>
```

## 2. Add `.waiting` element

This element will be **attached** when loading starts and **detached** when loading ends.

```html
<div data-wait-for='getting ip'>

  <div class='waiting'>Getting IP...</div>

  <h2>Your IP is:</h2>
  <div id='ip'>#.#.#.#</div>
</div>
```

## 3. Start and stop waiters with `wait.start` and `wait.end`

```js
var $ip = document.getElementById('ip');

// start waiting
wait.start('getting ip');

fetch('https://ipapi.co/json')
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    $ip.innerHTML = response.ip;
    // end waiting
    wait.end('getting ip');
  });
```

# Attach/Detach Based DOM Management

**DOM-Wait** doesn't make **`hide/show`** on elements. Instead, attaches and detaches elements to DOM. This makes **DOM cleaner and lighter** on waiting process.

```html
<div data-wait-for="getting ip">
  <!--wait:8ef4c4e7-->
  <div id="ip">#.#.#.#</div>
</div>
```

DOM-Wait detaches `.waiting` elements from DOM and inserts a comment node instead. When loading starts it attaches back and detaches rest of the siblings:

```html
<div data-wait-for="getting ip">
  <div class="waiting">Loading...</div>
  <!--wait:c9169aa9-->
</div>
```

# License

MIT.
