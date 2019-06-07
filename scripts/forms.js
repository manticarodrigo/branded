/**
 * This script wrapped in a Immediately-Invoked Function Expression (IIFE) to
 * prevent variables from leaking onto the global scope. For more information
 * on IIFE visit the link below.
 * @see http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
 */

(function() {
  'use strict';

  var portalId = '4524310';

  var newsletterFormId = '17cf8be7-1330-485d-b001-e759d62e8936';
  var newsletterFormElement = document.querySelector('[data-form=newsletter]');

  var contactFormId = 'b824e97a-8247-4cc9-890d-7e995260b7ac';
  var contactFormElement = document.querySelector('[data-form=contact]');

  function addFormSubmissionListener(formElement, callback) {
    if (formElement.addEventListener) {
      formElement.addEventListener('submit', callback, false); // modern browsers
    } else if (newsletterForm.attachEvent) {
      formElement.attachEvent('onsubmit', callback); // old IE
    }
  }

  addFormSubmissionListener(newsletterFormElement, submitNewsletterForm);
  addFormSubmissionListener(contactFormElement, submitContactForm);

  function submitNewsletterForm(ev) {
    function getNewsletterFieldName(name) {
      switch(name) {
        case 'newsletter-email':
          return 'email';
        default:
          return name;
      }
    }

    submitForm(ev, newsletterFormId, getNewsletterFieldName, true);
  }

  function submitContactForm(ev) {
    function getContactFieldName(name) {
      switch(name) {
        case 'contact-type':
          return 'subject';
        case 'contact-name':
          return 'firstname';
        case 'contact-email':
          return 'email';
        case 'contact-dispensary':
          return 'company';
        case 'contact-message':
          return 'message';
        default:
          return name;
      }
    }

    submitForm(ev, contactFormId, getContactFieldName);
  }

  function submitForm(ev, formId, getFieldName, isAltBg) {
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
            name: getFieldName(name),
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

    fetch(
      'https://api.hsforms.com/submissions/v3/integration/submit/' + portalId + '/' + formId,
      {
        method: 'post',
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      }
    )
      .then(function(response) {
        if (response.status === 200) {
          return handleSuccess();
        }

        handleError();
      })
      .catch(handleError);
  }
})();
