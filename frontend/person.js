let personID = '';

window.addEventListener('load', function () {
  const urlParams = new URLSearchParams(window.location.search);
  personID = urlParams.get('id');

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', 'http://localhost:3000/people/' + personID, false); // false for synchronous request
  xmlHttp.send(null);
  let person = JSON.parse(xmlHttp.responseText);

  var nameP = document.getElementById('name');
  nameP.innerHTML = person.name;

  var addressP = document.getElementById('address');
  addressP.innerHTML = 'Adresa: ' + person.address;

  var emailP = document.getElementById('email');
  emailP.innerHTML = 'Email: ' + person.email;

  var phoneP = document.getElementById('phone');
  phoneP.innerHTML = 'Telefon: ' + person.phone;

  for (let insurance of person.insurance) {
    const tableBody = document.getElementById('insurance-body');
    tableBody.innerHTML += `
      <tr>
        <td><a href='insurance.html?pid=${person._id}&iid=${insurance._id}'>${insurance.name}</a></td>
        <td>${insurance.value}</td>
        <td>
          <button type="button" class="btn btn-danger" onclick="Delete('${insurance._id}');">Smazat</button>
          <button type="button" class="btn btn-primary" onclick="location.href='editInsurance.html?pid=${person._id}&iid=${insurance._id}'">Upravit</button>
        </td>
      </tr>`;
  }
});

function Delete(id) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    'DELETE',
    'http://localhost:3000/people/' + personID + '/insurance/' + id,
    false,
  ); // false for synchronous request
  xmlHttp.send(null);
  location.reload();
}

function Redirect() {
  location.href = 'createInsurance.html?id=' + personID;
}

function RedirectBack() {
  location.href = 'index.html';
}
