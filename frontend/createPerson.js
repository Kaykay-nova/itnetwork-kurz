'use strict';

function createPersonRecord() {
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  const data = {
    name: name,
    address: address,
    email: email,
    phone: phone,
  };

  const apiUrl = 'http://localhost:3000/people/';

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 200) {
        location.href = 'index.html';
      }
    })
    .catch((error) => {
      console.error('Error creating person record:', error);
    });
}

function RedirectBack() {
  location.href = 'index.html';
}
