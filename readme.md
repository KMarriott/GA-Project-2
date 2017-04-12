# Lesson/Quiz Website


## What it does
This is a website that stores users, lessons, and quizes to interact with. Data is stored within a postgreSQL database and associating it with the user for later use. Users can be stored as an admin and given extra privledges.

From the front page, users can either sign up and sign into website.

#### Users can
- view lessons
- view quizes (submitting does not work)
- pick a randomized avatar
- Update Email/Password
- Logout

#### Admin can
- view list of users
- add, update, and delete users
- add, update, and delete lessons and quizes
- all User features


## Technologies used
- Express
- Mustache + Handlebars
- Bcrypt
- PostgreSQL Database
- Bootstrap
- adorable.io 

## Installation Instructions
- Include a Lessonsdb database
    - If you want a different name, change the database name in `app.js` file:
    
```javascript
let db = pgp(
{
  host: 'localhost',
  port: 5432,
  database: 'Lessonsdb',
  user: 'khem',
  password: 'password'
})
```

- Run `db/schema.sql` on database
- `npm install` to install dependences

## Unsolved Problems
- Quiz pages need to be reworked
    - Stores results in database but currently does nothing with it.
    - Quiz pages go on forever
- Currently doesn't save last page for quizes lessons.
- All accounts are admin by default
- Both account types have admin features
- Cannot update account as an admin
- The admin side does not check for session (intentional for testing)
- Other undocumented issues.