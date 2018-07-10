(function (global) {
  function $start(waiter) {
    var $loaders = document.getElementsByClassName('wait');
    for (var i = 0; i < $loaders.length; i++) {
      if ($loaders[i].getAttribute('data-for') === waiter) {
        $loaders[i].classList.add('waiting');
      }
    }
  }

  function $end(waiter) {
    var $loaders = document.getElementsByClassName('wait waiting');
    for (var i = 0; i < $loaders.length; i++) {
      if ($loaders[i].getAttribute('data-for') === waiter) {
        $loaders[i].classList.remove('waiting');
      }
    }
  }

  global.wait = {
    waitingFor: [],
    start: function (waiter) {
      this.waitingFor.push(waiter);
      $start(waiter);
    },
    end: function (waiter) {
      this.waitingFor.splice(this.waitingFor.indexOf(waiter), 1);
      $end(waiter);
    },
    is: function (waiter) {
      return this.waitingFor.indexOf(waiter) > -1;
    }
  };
})(self);
