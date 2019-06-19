/**
 * This script wrapped in a Immediately-Invoked Function Expression (IIFE) to
 * prevent variables from leaking onto the global scope. For more information
 * on IIFE visit the link below.
 * @see http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
 */

(function() {
  'use strict';

  var actionBaseUrl = 'https://api.hsforms.com/submissions/v3/integration/submit/';
  var portalId = '4524310';

  var newsletterFormId = '17cf8be7-1330-485d-b001-e759d62e8936';
  var newsletterFormElement = document.querySelector('[data-form=newsletter]');

  var contactFormId = 'b824e97a-8247-4cc9-890d-7e995260b7ac';
  var contactFormElement = document.querySelector('[data-form=contact]');

  function addFormSubmissionListener(formElement, callback) {
    if (formElement && formElement.addEventListener) {
      formElement.addEventListener('submit', callback, false); // modern browsers
    } else if (formElement && formElement.attachEvent) {
      formElement.attachEvent('onsubmit', callback); // old IE
    }
  }

  addFormSubmissionListener(newsletterFormElement, submitNewsletterForm);
  addFormSubmissionListener(contactFormElement, submitContactForm);

  function submitNewsletterForm(ev) {
    submitForm(ev, newsletterFormId, true);
  }

  function submitContactForm(ev) {
    submitForm(ev, contactFormId);
  }

  function submitForm(ev, formId, isAltBg) {
    ev.preventDefault();

    var formElement = ev.target;

    function getFields() {
      var fields = [];

      for (var i = 0; i < ev.target.length; i += 1) {
        var field = ev.target[i];
        var name = field.name;
        var value = field.value;
        var type = field.type;

        if (type !== 'submit') {
          fields[i] = {
            name: name,
            value: value
          };
        }
      }

      return fields;
    }

    function handleSuccess() {
      var successNode = document.createElement('p');
      successNode.innerHTML += 'Your submission was successful.';

      if (isAltBg) {
        successNode.setAttribute('class', 'u-color-white');
      }

      formElement.parentElement.appendChild(successNode);
    }

    function handleError() {
      var errorNode = document.createElement('p');
      errorNode.innerHTML += 'An error occurred. Please fill in all the required fields and try again.';

      if (isAltBg) {
        errorNode.setAttribute('class', 'u-color-white');
      }

      formElement.parentElement.appendChild(errorNode);
    }

    var formData = {
      fields: getFields(),
      context: {
        pageUri: 'trybranded.com',
        pageName: 'BRANDED'
      }
    };

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          handleSuccess();
        } else {
          handleError();
        }
      }
    }
    xhr.open('post', actionBaseUrl + portalId + '/' + formId, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(formData));
  }
})();
