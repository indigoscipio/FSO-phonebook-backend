const express = require("express");
const app = express();
app.use(express.json());
var morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const Note = require("./models/note");

app.use(cors());

app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Root!</h1>");
});

app.get("/api/persons", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

app.get("/info", (request, response) => {
  let currentDate = new Date();
  response.send(
    `<p>Phonebook has info for 2 people. <br/> ${currentDate} </p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
  response.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;

  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const personExists = persons.find((person) => person.name === name);
  if (personExists) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: name,
    number: number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
