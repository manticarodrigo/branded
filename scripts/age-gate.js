/**
 * This script wrapped in a Immediately-Invoked Function Expression (IIFE) to
 * prevent variables from leaking onto the global scope. For more information
 * on IIFE visit the link below.
 * @see http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
 */

(function() {
  'use strict';

  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length ; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // check if the age has already been verified
  var ageGateCookieName = 'age';
  var ageGateCookieValue = 'verified';
  var ageGate = document.getElementById('age-gate');
  var ageGateSubmit = document.getElementById('age-gate-submit');
  var ageGateUnknownClass = 'age-gate--unknown';

  if (getCookie(ageGateCookieName) !== ageGateCookieValue) {
    ageGate.classList.add(ageGateUnknownClass);
  }

  // if the submit button is clicked, add a cookie and hide the modal
  ageGateSubmit.onclick = function() {
    setCookie(ageGateCookieName, ageGateCookieValue, 90);
    ageGate.classList.remove(ageGateUnknownClass);
  }
}());
