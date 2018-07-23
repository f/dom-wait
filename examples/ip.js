function getIP() {
  var $ip = document.getElementById('ip');
  wait.start('getting ip');
  fetch('https://ipapi.co/json')
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      $ip.innerHTML = '88.35.210.221';
      setTimeout(function () {
        wait.end('getting ip');
      }, 1000);
    });
}