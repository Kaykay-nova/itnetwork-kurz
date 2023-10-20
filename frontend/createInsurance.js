'use strict';

function createInsuranceRecord() {
  const name = document.getElementById('name').value;
  const value = document.getElementById('value').value;
  const description = document.getElementById('description').value;
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;

  const data = {
    name: name,
    value: value.replaceAll(' ', ''),
    description: description,
    dateFrom: dateFrom,
    dateTo: dateTo,
  };

  const urlParams = new URLSearchParams(window.location.search);
  let personID = urlParams.get('id');

  const apiUrl = 'http://localhost:3000/people/' + personID + '/insurance';

  fetch(apiUrl, {
    method: 'POST',
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
      console.error('Error creating insurance record:', error);
    });
}


