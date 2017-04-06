const express = require('express');
const app = express();

const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const methodOverride = require('method-override')
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

app.use(session({
  secret: 'super_secred_string',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

let db = pgp(
{
  host: 'localhost',
  port: 5432,
  database: 'Lessonsdb',
  user: 'khem',
  password: 'password'
})


app.get('/', function(req, res){
  if(req.session.user){
    let data = {
      "logged_in": true,
      "email": req.session.user.email
    };

    // res.render('index', data);
    res.render("login/index")

  } else {
    res.render('index');
  }


  // res.render('index');
});

app.post('/login', function(req, res){
  let data = req.body;
  let auth_error = "Authorization Failed: Invalid email/password";
  console.log(req)
  console.log(res.body)

  db
  .one("SELECT * FROM users WHERE email = $1", [data.email])
  .catch(function(){
    res.send(auth_error);
  })
  .then(function(user){
    console.log(user)
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.redirect("/");
      } else {
        res.send(auth_error);
      }
    });
  });
});

app.get('/signup', function(req, res){
  res.render('signup/index');
});

app.post('/signup', function(req, res){
  // console.log('signup attempt')
  let data = req.body;
  bcrypt
  .hash(data.password, 10, function(err, hash){
    db.none(
      "INSERT INTO users (email, username, password_digest, image, fname, lname, admin, currnt_lesson) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [data.email, data.username, hash, "image", data.fname, data.lname, true, 0]
      ).catch(function(e){
        res.send('Failed to create user: ' + e);
      }).then(function(){
        res.send('User created!');
      });
    });
});


app.get('/lesson', function(req, res){
  res.render('lesson/index');
});

app.get('/quiz', function(req, res){
  res.render('quiz/index');
});

app.put('/update', function(req, res){
  db
  .none("UPDATE users SET email = $1 WHERE email = $2",
    [req.body.email, req.session.user.email]
    ).catch(function(){
      res.send('Failed to update user.');
    }).then(function(){
      console.log('User updated.')
      res.redirect('/')
      // res.send('User updated.');
    });
  });

// app.get('/logout', function(req, res){
//   req.session.user = false;
//   res.redirect("/");
// });

app.listen(3000, function () {
  console.log('Server running, listening on port 3000!');
});
