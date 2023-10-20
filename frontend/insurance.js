let personID = '';
let insuranceID = '';

window.addEventListener('load', function () {
  const urlParams = new URLSearchParams(window.location.search);
  personID = urlParams.get('pid');
  insuranceID = urlParams.get('iid');

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    'GET',
    'http://localhost:3000/people/' + personID + '/insurance/' + insuranceID,
    false,
  ); // false pro synchronní request
  xmlHttp.send(null);
  let insurance = JSON.parse(xmlHttp.responseText);

  var nameP = document.getElementById('name');
  nameP.innerHTML = insurance.name;

  var insuranceP = document.getElementById('value');
  insuranceP.innerHTML = 'Sjednaná částka: ' + insurance.value + ' Kč';

  var descriptionP = document.getElementById('description');
  descriptionP.innerHTML = 'Předmět pojištění: ' + insurance.description;

  var dateFromP = document.getElementById('dateFrom');
  let dateFrom = new Date(insurance.dateFrom);
  dateFromP.innerHTML = 'Platnost od: ' + dateFrom.toLocaleDateString('cs-CZ');

  var dateToP = document.getElementById('dateTo');
  let dateTo = new Date(insurance.dateTo);

  dateToP.innerHTML = 'Platnost do: ' + dateTo.toLocaleDateString('cs-CZ');
});

function Redirect() {
  location.href = 'person.html?id=' + personID;
}
