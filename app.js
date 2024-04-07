const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});

app.get('/', (req, res) => {
  res.render('index', {title: 'Home'});
});

app.get('/about', (req, res) => {
  res.render('about', {title: 'About'});
});

app.get('/login', (req, res) => {
  res.render('login', {title: 'Get Started'});
});

app.use((req, res) =>  {
  res.status(404).render('404')
})

