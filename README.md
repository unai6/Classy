# Classy

### Description
This is a wonderful app which will help teachers and students to organize their classes schedule.

### User Stories
-   **homepage**  - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
-   **sign up**  - As a student I want to sign up on the webpage so that I can see all the classes that I could attend
-   **login**  - As a user I want to be able to log in on the webpage and access my account
-   **logout**  - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
-   **user account page**  - Every user can mark himself as Teacher or Student and will have access to a dedicated interface
- **class-details page** - Section with class description, rating and feedback

**As a teacher user:**

-   **Create a class**  
Being able to create new classes
-   **Read classes list** 
Display all the classes scheduled with my students 
 -  **Update a class**  
 Possibility to edit every class detail
-   **Delete a class** 
Option to delete classes 
-   **class details** 
Display class details 
-  **Post feedbacks and ratings **
In class details

**As a student user:**

-   **Read classes** 
Being able to display classes assigned by the teacher
-   **class details** 
Display class details 
-  **Post feedbacks and ratings **
In class details


## MVP

- General home page and dedicated landing for teacher and student accounts
-  Having a Sign-up and Login page working with validations + password encryption
-  User data stored in browser local storage and MongoDB
- CRUD as a teacher user (see ##User Stories above)
- Student can display classes assigned by the teacher
- students and teachers can add ratings and feedback for each class

## Backlog

### List of other features outside of the MVPs scope

- User possibility to upload a profile picture (Cloudinary)
- Add a section where the teacher and students can evaluate the class (feedback and rating) and eventually share content/notes

***Teacher User***
- display a list of students per every class

***Student User***

- display a list of available classes (dedicated search box)
- find a class and join it through a token ID 
- find a teacher through token ID
- class booking confirmation 

## Routes
-   GET /
    -   renders the homepage
    
-   GET /auth/signup
    -   redirects to / if user logged in
    -   renders the signup form
    
-   POST /auth/signup
    -   redirects to / if user logged in
    -   body:
        -   username
        -   email
        -   password
       
-   GET /auth/login
    -   redirects to / if user logged in
    -   renders the login form 
    
-   POST /auth/login
    -   redirects to / if user logged in
    -   body:
        -   email
        -   password
     
-  POST /auth/logout
    -   body: (empty)

- USE/
    - based on current user logged in, it renders the private section for teacher or student

- GET /classy
    - renders user-interface

-  GET /create-class
    -  renders the create-class 
    
-  POST /create-class
    -   redirects to / if user is registered and logged as teacher
    -   body:
        -   name
        -   description
        -   classDate
        -   Time
        -   student
        
 -   GET /:id/delete
    - class by id/remove 

 -  GET /:id/edit
    - class by Id/edit
  
-   POST /:id
    - update class and redirects to /classy/classy

-  GET /:id/class-details
   - render the class-details page

-  POST /feedback/:_id
    - enable both kind of users to post feedbacks and ratings in relation to the class attended
    - renders feedback and ratings in the same page



## Models

- 2 models with a relationship between them:

**User model:**

{
name:  String,
email:  String,
password: {type:  String, require:  true, unique:  true},
isTeacher: {type:  Boolean, default:  false},
classPrice: {type:  Number, default:  null}
},
{timestamps:  true
}

**Class Model:**

{
classDate :  Date,
name:  String,
description:  String,
time: String,
feedback: [{
  user: String,
  feedback: String,
  rating: String
}],
student: [{ type:  Schema.Types.ObjectId, ref:'User'}],
teacher: { type:  Schema.Types.ObjectId, ref:'User'}
},
{timestamps:  true
}


## Links

### Trello
https://trello.com/b/fEKSZN7Q/proyecto-2-paola-unai
  
### Slides
https://docs.google.com/presentation/d/1OpPFjo7uLVdfcGfBkB09QdRv2K45Qs5uATomqT0rjM0/edit#slide=id.gc6f90357f_0_31

### Heroku
https://classy-paola-unai.herokuapp.com/

