(function (global) {
  function $ready(f, d, e) {
    d = document
    e = 'addEventListener'
    d[e] ? d[e]('DOMContentLoaded', f) : window.attachEvent('onload', f)
  }

  function __waitFor(waiter, fn) {
    var $loaders = document.querySelectorAll('[data-wait-for]');
    for (var i = 0; i < $loaders.length; i++) {
      if (waiter) {
        if ($loaders[i].getAttribute('data-wait-for') === waiter) {
          fn.call($loaders[i]);
        }
      } else {
        fn.call($loaders[i]);
      }
    }
  }

  function $init(waiter) {
    __waitFor(waiter, function () {
      var nodes = this.childNodes;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].classList && nodes[i].classList.contains('waiting')) {
          this.__waiterPlaceholder = document.createComment('WAITER: ' + this.getAttribute('data-wait-for'));
          this.__waiterPlaceholder.__isWaiter = true;
          this.__waiter = nodes[i];
          this.replaceChild(this.__waiterPlaceholder, this.__waiter);
        }
      }
    });
  }

  function $start(waiter) {
    __waitFor(waiter, function () {
      var nodes = this.childNodes;
      for (var i = 0; i < this.childNodes.length; i++) {
        if (nodes[i] === this.__waiterPlaceholder) continue;
        var content;
        if (nodes[i].nodeType === 1 /*ELEMENT_NODE*/) {
          content = '<' + nodes[i].tagName + '... />';
        } else {
          content = nodes[i].textContent.trim();
        }

        this.__contentPlaceholder = document.createComment(content ? 'LOADING: ' + content.toLowerCase() : '');
        this.__contentPlaceholder.__originalContent = nodes[i];
        this.replaceChild(this.__contentPlaceholder, nodes[i]);
      }
      if (this.__waiterPlaceholder) {
        this.replaceChild(this.__waiter, this.__waiterPlaceholder);
      }
    });
  }

  function $end(waiter) {
    __waitFor(waiter, function () {
      var nodes = this.childNodes;
      for (var i = 0; i < this.childNodes.length; i++) {
        if (!nodes[i].__originalContent) continue;
        this.replaceChild(nodes[i].__originalContent, nodes[i]);
      }
    });
    $init(waiter);
  }

  global.wait = {
    waitingFor: [],
    start: function (waiter) {
      if (this.waitingFor.indexOf(waiter) >= 0) return;
      this.waitingFor.push(waiter);
      $start(waiter);
    },
    end: function (waiter) {
      if (this.waitingFor.indexOf(waiter) < 0) return;
      this.waitingFor.splice(this.waitingFor.indexOf(waiter), 1);
      $end(waiter);
    },
    ready: function (fn) {
      $ready(fn);
    },
    is: function (waiter) {
      return this.waitingFor.indexOf(waiter) > -1;
    }
  };

  $ready(function () {
    $init();
  });
})(self);
