(function (global) {
  var detachedDOM = {};

  function __generateId() {
    return 'wait:' + (Math.random()*1e18).toString(16).substr(0, 8);
  }

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
          var nodeId = __generateId();
          this.__waiter = document.createComment(nodeId);
          detachedDOM[nodeId] = nodes[i];
          this.replaceChild(this.__waiter, nodes[i]);
        }
      }
    });
  }

  function $start(waiter) {
    __waitFor(waiter, function () {
      var nodes = this.childNodes;
      for (var i = 0; i < this.childNodes.length; i++) {
        if (nodes[i] === this.__waiter) continue;
        var nodeId = __generateId();

        this.__content = document.createComment(nodeId);
        detachedDOM[nodeId] = nodes[i];
        this.replaceChild(this.__content, nodes[i]);
      }
      if (this.__waiter) {
        this.replaceChild(detachedDOM[this.__waiter.textContent], this.__waiter);
      }
    });
  }

  function $end(waiter) {
    __waitFor(waiter, function () {
      var nodes = this.childNodes;
      for (var i = 0; i < this.childNodes.length; i++) {
        var content = detachedDOM[nodes[i].textContent];
        if (!content) continue;
        this.replaceChild(content, nodes[i]);
        delete detachedDOM[nodes[i].textContent];
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
