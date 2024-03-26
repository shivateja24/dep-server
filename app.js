const express = require('express');
const cors = require('cors');  
const odbc = require('odbc');    

const app = express();
const port = process.env.PORT || 3090;

// Connection string
const connectionString = 'Driver={ODBC Driver 18 for SQL Server};Server=tcp:link-to-database.database.windows.net,1433;Database=link-to;Uid=root1;Pwd=Shiva242004;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;';
app.get('/', (req, res) => {
  res.send('Hello World!');
})
   odbc.connect(connectionString, (error, connection) => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Connected to MySQL database successfully!');
  app.use(cors());
app.use(express.json());

// Route to create a user
app.post('/create_user', (req, res) => {
  console.log("in the create user")
  console.log("req.body", req.body)
  const { rollno, username, password } = req.body;
  const query = 'INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)';
  connection.query(query, [rollno, username, password], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Error creating user' });
    }
    res.status(201).json({ message: 'User created successfully' });
  });
});

// Route to handle login
app.post('/login', (req, res) => {
  console.log("in the login")
  console.log("req.body", req.body)
  const { rollno, password } = req.body;
  const query = 'SELECT * FROM users WHERE user_id = ? AND password = ?';
  connection.query(query, [rollno, password], (err, result) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Error during login' });
    }
    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid user_id or password' });
    }
    res.json({ message: 'Login successful' });
  });
});

// Route to fetch messages
app.get('/messages', (req, res) => {
  console.log("in the messages");
  const query = 'SELECT * FROM messages';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Error fetching messages' });
    }
    console.log('Messages fetched successfully:', result);
    res.json(result);
  });
});

// Route to post a message
app.post('/post_message', (req, res) => {
  console.log("in the post message");
  const { message } = req.body;
  const query = 'INSERT INTO messages (message) VALUES (?)';
  connection.query(query, [message], (err, result) => {
    if (err) {
      console.error('Error posting message:', err);
      return res.status(500).json({ error: 'Error posting message' });
    }
    res.status(201).json({ message: 'Message posted successfully' });
  });
});

// Route to fetch events
app.get('/events', (req, res) => {
  const selectedDate = req.query.date;
  console.log("selected date:", selectedDate);
  const query = "SELECT events.event_type, events.event_time, subjects.subject_name FROM events LEFT JOIN subjects ON events.subject_id = subjects.subject_id WHERE DATE(events.event_date) = ?"
  connection.query(query, [selectedDate], (err, result) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Error fetching events' });
    }
    res.json(result);
  });
});

// Start the server


 
});    


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
