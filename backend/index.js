const port = 3000;
const express = require('express');
const Joi = require('joi');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.listen(port, () => console.log('Listening on port ' + port + '...'));
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://127.0.0.1:27017/insurance', { useNewUrlParser: true })
  .then(() => console.log('Připojeno do MongoDB!'))
  .catch((error) => console.error('Nelze se připojit do MongoDB... ', error));

// schémata

const insuranceSchema = new mongoose.Schema({
  name: String,
  value: Number,
  description: String,
  dateFrom: String,
  dateTo: String,
});

const personSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  phone: String,

  insurance: [insuranceSchema],
});

// modely
const Insurance = mongoose.model('Insurance', insuranceSchema);
const Person = mongoose.model('Person', personSchema);

// Pojištěnci API
app.get('/people', (req, res) => {
  Person.find().then((people) => res.send(people));
});

app.get('/people/:id', (req, res) => {
  const id = String(req.params.id);
  Person.findById(id)
    .then((person) => res.send(person))
    .catch((_) => res.status(404).send());
});

app.delete('/people/:id', (req, res) => {
  const id = String(req.params.id);
  Person.deleteOne({ _id: id })
    .then((person) => res.send())
    .catch((err) => res.send(err));
});

app.post('/people', (req, res) => {
  const { error } = validatePerson(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    req.body.insurance = [];
    Person.create(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

app.put('/people/:id', (req, res) => {
  const id = String(req.params.id);
  const { error } = validatePerson(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    Person.findById(id)
      .then((person) => {
        person.name = req.body.name;
        person.address = req.body.address;
        person.email = req.body.email;
        person.phone = req.body.phone;
        updatePerson(id, person, res);
      })
      .catch((_) => res.status(404));
  }
});

// Pojištění API
app.post('/people/:id/insurance', (req, res) => {
  const id = String(req.params.id);
  Person.findById(id)
    .then((person) => {
      const { error } = validateInsurance(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
      } else {
        person.insurance.push(req.body);
        Person.findByIdAndUpdate(id, person)
          .then((_) => {
            res.status(200).send('');
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((_) => res.status(404));
});

app.get('/people/:pid/insurance/:id', (req, res) => {
  const personID = String(req.params.pid);
  const id = String(req.params.id);
  Person.findById(personID)
    .then((person) => {
      let insurance = person.insurance.find((i) => i._id == id);
      if (!insurance) {
        res.status(404).send();
      } else {
        res.send(insurance);
      }
    })
    .catch((_) => res.status(404).send());
});

app.delete('/people/:pid/insurance/:insuranceid', (req, res) => {
  const personID = String(req.params.pid);
  const insuranceID = String(req.params.insuranceid);
  Person.findById(personID)
    .then((person) => {
      let insurances = person.insurance.filter((i) => i._id != insuranceID);
      person.insurance = insurances;
      updatePerson(personID, person, res);
    })
    .catch((_) => res.status(404).send());
});

app.put('/people/:pid/insurance/:insuranceid', (req, res) => {
  const personID = String(req.params.pid);
  const insuranceID = String(req.params.insuranceid);
  Person.findById(personID)
    .then((person) => {
      const { error } = validateInsurance(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
      } else {
        let index = person.insurance.findIndex((i) => i._id == insuranceID);
        if (index == -1) {
          res.status(404).send();
        } else {
          person.insurance[index].name = req.body.name;
          person.insurance[index].value = req.body.value;
          person.insurance[index].description = req.body.description;
          person.insurance[index].dateFrom = req.body.dateFrom;
          person.insurance[index].dateTo = req.body.dateTo;
          updatePerson(personID, person, res);
        }
      }
    })
    .catch((_) => res.status(404));
});

// Pomocné funkce
function validatePerson(person, required = true) {
  const schema = Joi.object({
    name: Joi.string().min(1),
    address: Joi.string().min(3),
    email: Joi.string().email(),
    phone: Joi.string().min(1),
  });

  return schema.validate(person, {
    presence: required ? 'required' : 'optional',
  });
}

function validateInsurance(insurance, required = true) {
  const schema = Joi.object({
    name: Joi.string().min(1),
    value: Joi.number().min(0),
    description: Joi.string().min(0),
    dateFrom: Joi.date(),
    dateTo: Joi.date(),
  });

  return schema.validate(insurance, {
    presence: required ? 'required' : 'optional',
  });
}

function updatePerson(personID, person, res) {
  Person.findByIdAndUpdate(personID, person)
    .then((_) => {
      res.status(200).send('');
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}
