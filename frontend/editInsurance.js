'use strict';

let PersonID = '';
let InsuranceID = '';

function loadInsuranceData() {
  const urlParams = new URLSearchParams(window.location.search);
  PersonID = urlParams.get('pid');
  InsuranceID = urlParams.get('iid');

  const apiUrl =
    'http://localhost:3000/people/' + PersonID + '/insurance/' + InsuranceID;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('name').innerHTML = data.name;
      document.getElementById('value').value = data.value;
      document.getElementById('description').value = data.description;
      document.getElementById('dateFrom').value = data.dateFrom;
      document.getElementById('dateTo').value = data.dateTo;
    })
    .catch((error) => {
      console.error('Error fetching Insurance data:', error);
    });
}

function updateInsuranceRecord() {
  const name = document.getElementById('name').innerHTML;
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
  const apiUrl =
    'http://localhost:3000/people/' + PersonID + '/insurance/' + InsuranceID;

  fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 200) {
        location.href =
          'insurance.html?pid=' + PersonID + '&iid=' + InsuranceID;
      }
    })
    .catch((error) => {
      console.error('Error updating Insurance record:', error);
    });
}

window.addEventListener('load', function () {
  loadInsuranceData();
});
