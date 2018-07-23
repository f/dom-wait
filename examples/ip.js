function getIP() {
  var $ip = document.getElementById('ip');
  wait.start('getting ip');
  fetch('https://ipapi.co/json')
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      $ip.innerHTML = response.ip;
      wait.end('getting ip');
    });
}