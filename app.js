const express = require('express');
const app = express();

const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const methodOverride = require('method-override')
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

let lesson0 = require('./lesson0.json')
console.log(lesson0)

app.engine('html', require('hbs').__express);
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

db.one("SELECT * FROM lessons")
.then(function(data){
lesson0.id = data.id
console.log(lesson0.id)
}).then(function(){





app.get('/', function(req, res){
  if(req.session.user){
    let data = {
      "logged_in": true,
      "email": req.session.user.email
    };
    // console.log(req.session.user)

    db
    .one("SELECT * FROM users WHERE email = $1", [data.email])
    .catch(function(){
    })
    .then(function(user){

      res.render("login/index", user)
    })

    // res.render('index', data);

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
  let data = req.body;
  console.log(req.body)
  bcrypt
  .hash(data.password, 10, function(err, hash){
    db.none(
      "INSERT INTO users (email, username, password_digest, image, fname, lname, admin, current_lesson) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [data.email, data.username, hash, 'https://api.adorable.io/avatars/'+data.email+'.png', data.fname, data.lname, true, 0]
      ).catch(function(e){
        res.send('Failed to create user: ' + e);
      }).then(function(){
        res.send('User created!');
      });
    });
});


app.get('/lesson', function(req, res){
  let lessondata = lesson0.Lesson.pages.page0

  if(req.session.user){
    db
    .one("SELECT * FROM users WHERE email = $1", [req.session.user.email])
    .then(function(data){
      console.log(data.current_lesson)

      pagesetup = {
        page: 0,
        title: lessondata.title,
        subtitle: lessondata.subtitle,
        text: lessondata.text
      }
      res.render('lesson/index', pagesetup);
    })  
  }
  else
    {res.redirect('/')}
});


app.get('/quiz', function(req, res){


  let lessondata = lesson0.Lesson.quiz.question0

  if(req.session.user){
    db
    .one("SELECT * FROM users WHERE email = $1", [req.session.user.email])
    .then(function(data){
      console.log(data.current_lesson)


      pagesetup = {
        page: 0,
        data: lessondata,
        lesson_id: lesson0.id

      }

      res.render('quiz/index', pagesetup);
    })
  }
  else
    {res.redirect('/')}

});

app.post('/quiz/next/:page', function(req, res){

  last_page = req.params.page 
  next_page = Number(last_page)+1
  db
  .one("SELECT * FROM users WHERE email = $1", [req.session.user.email])
  .catch(function(e){

    console.log(e)
    res.send(e)
  })
  .then(function(data){


    console.log('page'+next_page)
    lessondata = lesson0.Lesson.quiz['question'+next_page]

    pagesetup = {
      page: next_page,
      data: lessondata,
      lesson_id: lesson0.id
    }

    res.render('quiz/index', pagesetup);
  })
});



app.post('/lesson/next/:page', function(req, res){

  last_page = req.params.page 
  next_page = Number(last_page)+1
  db
  .one("SELECT * FROM users WHERE email = $1", [req.session.user.email])
  .catch(function(e){

    console.log(e)
    res.send(e)
  })
  .then(function(data){


    console.log('page'+next_page)
    lessondata = lesson0.Lesson.pages['page'+next_page]

    pagesetup = {
      page:  next_page,
      title: lessondata.title,
      subtitle: lessondata.subtitle,
      text: lessondata.text,
      last: lessondata.last,
      lesson_id: lesson0.id
    }


    res.render('lesson/index', pagesetup);
  })
});



app.post('/lesson/prev/:page', function(req, res){
  // console.log('signup attempt')
  last_page = req.params.page 
  next_page = Number(last_page)-1
  db
  .one("SELECT * FROM users WHERE email = $1", [req.session.user.email])
  .catch(function(e){

    console.log(e)
    res.send(e)
  })
  .then(function(data){


    console.log('page'+next_page)
    lessondata = lesson0.Lesson.pages['page'+next_page]

    pagesetup = {
      page:  next_page ,
      title: lessondata.title,
      subtitle: lessondata.subtitle,
      text: lessondata.text,
      last: lessondata.last,
      number: lessondata.number
    }



    res.render('lesson/index', pagesetup);
  })
});


app.post('/quiz/prev/:page', function(req, res){

  last_page = req.params.page 
  next_page = Number(last_page)-1
  db
  .one("SELECT * FROM users WHERE email = $1", [req.session.user.email])
  .catch(function(e){

    console.log(e)
    res.send(e)
  })
  .then(function(data){


    console.log('page'+next_page)
    lessondata = lesson0.Lesson.quiz['question'+next_page]

    pagesetup = {
      page: next_page,
      data: lessondata,
      lesson_id: lesson0.id
    }

    res.render('quiz/index', pagesetup);
  })
});

app.post('/quiz/submit/:lesson_id/:question', function(req, res){

  lesson_id = req.params.lesson_id
  question_num = req.params.question
  // console.log(req.body)

  let correct = false;
  let lessondata = lesson0.Lesson.quiz.question0

  if(req.body.answer === lessondata.correct){
    correct=true
  } 

  console.log(correct)

  db
  .none("INSERT INTO user_quizes(user_id, lesson_id, question_num, answer_given, correct) VALUES($1, $2, $3, $4, $5)",
    [req.session.user.id, lesson_id, question_num, req.body.answer, correct])
  .catch(function(e){
    console.log(e)
  })
  .then(function(data){
    res.redirect('back');
    console.log("added")
  })
});


app.put('/update', function(req, res){
  db
  .none("UPDATE users SET email = $1 WHERE email = $2",
    [req.body.email, req.session.user.email]
    ).catch(function(){
      res.send('Failed to update user.');
    }).then(function(){
      console.log('User updated.')
      // res.redirect('/')
      // res.send('User updated.');
    });
  });

app.put('/updaterandimage', function(req, res){
  newimage = 'https://api.adorable.io/avatars/'+ req.body.randimage
  db
  .none("UPDATE users SET image = $1 WHERE email = $2",
    [newimage, req.session.user.email]
    ).catch(function(){
      // res.send('Failed to update user.');
    }).then(function(){
      // res.redirect('/')
      console.log('User updated.')
      // res.send('User updated.');
    });
  });

// app.get('/addlesson', function(req, res){

//  db
//   .none("INSERT INTO lessons(name, file, active), VALUES($1, $2, $3)",
//     [req.body.email, req.session.user.email, true]
//     ).catch(function(){
//       res.send('Failed to update user.');
//     }).then(function(){
//       console.log('User updated.')
//       res.redirect('/')
//       // res.send('User updated.');
//     });
//   });


app.get('/logout', function(req, res){
  req.session.user = false;
  res.redirect("/");
});

app.listen(3000, function () {
  console.log('Server running, listening on port 3000!');
});



app.get('/users', function(req, res){
  // if(req.session.user){
    db
    .any("SELECT * FROM users")
    .then(function(data){

      pagesetup = {
        title: 'Users',
        users: data
      }
      res.render('users/index', pagesetup)
      // res.render('quiz/index', data);
    })
  // }
  // else
  //   {res.redirect('/')}

});


app.get('/lessons', function(req, res){
  // if(req.session.user){
    db
    .any("SELECT * FROM lessons")
    .then(function(data){

      pagesetup = {
        title: 'Lessons',
        lessons: data
      }
      res.render('users/index', pagesetup)
      // res.render('quiz/index', data);
    })
  // }
  // else
  //   {res.redirect('/')}

});

app.get('/lessons/delete/:id', function(req, res){
  // if(req.session.user){
    id = req.params.id;
    db
    .one("DELETE FROM lessons WHERE id=$1", [id])
    .then(function(data){
      console.log('deleted')
      res.redirect("/lessons")

      // res.render('quiz/index', data);
    })
  // }
  // else
  //   {res.redirect('/')}

});

app.get('/users/delete/:id', function(req, res){
  // if(req.session.user){
    id = req.params.id;
    db
    .any("DELETE FROM users WHERE id=$1", [id])
    .then(function(data){
      console.log('deleted')
      res.redirect("/users")
      // res.render('quiz/index', data);
    })
  // }
  // else
  //   {res.redirect('/')}

});

app.put('user/update/:id', function(req, res){

  id = req.params.id;

  db
  .none("UPDATE users SET email = $1 WHERE id = $2",
    [req.body.email, id]
    ).catch(function(){
      res.send('Failed to update user.');
    }).then(function(){
      console.log('User updated.')
      res.redirect('/')
      // res.send('User updated.');
    });
  });


})