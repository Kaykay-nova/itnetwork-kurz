window.addEventListener('load', function () {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', 'http://localhost:3000/people', false); // false pro synchronní request
  xmlHttp.send(null);
  let data = JSON.parse(xmlHttp.responseText);

  const table = document.getElementById('table-body');

  for (let person of data) {
    table.innerHTML += `
      <tr>
        <td><a href='person.html?id=${person._id}'>${person.name}</a></td>
        <td>${person.address}</td>
        <td>
          <button type="button" class="btn btn-danger" onclick="Delete('${person._id}');">Smazat</button>
          <button type="button" class="btn btn-primary" onclick="location.href='editPerson.html?id=${person._id}'">Upravit</button>
        </td>
      </tr>`;
  }
});

function Delete(id) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('DELETE', 'http://localhost:3000/people/' + id, false); // false for synchronous request
  xmlHttp.send(null);
  location.reload();
}
