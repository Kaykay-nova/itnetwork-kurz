'use strict';

let personID = '';
function loadPersonData() {
  const urlParams = new URLSearchParams(window.location.search);
  personID = urlParams.get('id');

  const apiUrl = 'http://localhost:3000/people/' + personID;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('name').value = data.name;
      document.getElementById('address').value = data.address;
      document.getElementById('email').value = data.email;
      document.getElementById('phone').value = data.phone;
    })
    .catch((error) => {
      console.error('Error fetching person data:', error);
    });
}

function updatePersonRecord() {
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

  const updateApiUrl = 'http://localhost:3000/people/' + personID;

  fetch(updateApiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 200) {
        location.href = 'person.html?id=' + personID;
      }
    })
    .catch((error) => {
      console.error('Error updating person record:', error);
    });
}

window.addEventListener('load', function () {
  loadPersonData();
});
