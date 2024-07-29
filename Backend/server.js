const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Define the Employee model
const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// Route to add a new employee
app.post('/api/employees', async (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  try {
    const employee = new Employee({ firstName, lastName, email, phone, address });
    await employee.save();
    res.status(201).send('Employee added successfully');
  } catch (error) {
    res.status(400).send('Error adding employee: ' + error.message);
  }
});

// Route to get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).send('Error fetching employees: ' + error.message);
  }
});

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the Employee API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
