<h1 align="center" style="border-bottom: none">Natours Application</h1>
<p align="center">🎉 The app is live, try it <a href="https://natours-app-b6xm.onrender.com" target="_blank">here</a>. </p> 
<br/>
Natours is a tour booking web app that I created as part of the <a href="https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/" target="_blank">Node.js course on Udemy by Jonas Schmedtmann</a>. The app uses Node.js, Express and MongoDB to create a RESTful API and a dynamic website. The app also implements authentication, authorization, security, payments and email features.

## ***Overview***
This web application allows it's users to book tour vacations.

A tour refers to a series of locations, specially picked to excite the adventurous spirit of the individual who books it.

A visiting user who has not yet created an account on the app can simply see all the current tours as well as detailed information about each tour.

Once signed up or logged in, they can then book any tour of their choice.

Users can write only one review for any tour they book.


## ***Demonstration***

#### Home page :

<img src="https://github.com/morelir/Natours/assets/58606266/2bc4523e-9781-4467-9109-87294bda1953" width="640">

#### Tour Details :
![Tour Detail](https://github.com/morelir/Natours/assets/58606266/1266da2d-163b-4e0d-9e83-fb12603429da)

#### Payment Process :
<img src="https://github.com/morelir/Natours/assets/58606266/733afe3b-2aee-4d48-a354-0a99f40928b6" width="640">

#### Login Page :
<img src="https://github.com/morelir/Natours/assets/58606266/3027e39d-a927-425a-90d3-35d939a9d670" width="640">

#### User Profile :
<img src="https://github.com/morelir/Natours/assets/58606266/608d0e82-8026-4ab9-8f76-c27995bdbc6e" width="640">

## Main Tools And Technologies Used

- HTML (Create the structure and content of the web pages).
- CSS (Styling of the web pages).
- PUG (Template engine for generating the web pages dynamically).
- JAVASCRIPT (Interactivity, as well as making requests to the API from the client-side).
- NODE (Run JavaScript code on the server-side).
- EXPRESS (Node framework, meant to simplify the process of building complex server-side applications).
- MONGODB (Database for data persistence).
- MONGOOSE (Interacting with mongodb).
- MAPBOX (Displaying the different locations of each tour).
- STRIPE (Making payments on the app).
- JSON WEB TOKEN (Authenticating users)
- NODEMAILER (Sending emails to users of the app)
- MAILTRAP (Trapping the emails we send in our development environment, so they don't actually get sent to the user's email address)
- SENDGRID (Sending actual emails to the users in production).

## Setting Up Your Local Environment
    * Clone this repo to your local machine.
    * Using the terminal, navigate to the cloned repo.
    * Install all the neccessary dependencies, as stipulated in the package.json file.
    * If you don't already have one, set up accounts with: MONGODB, MAPBOX, STRIPE, SENDGRID and MAILTRAP. Please ensure to have at least basic knowledge of how these services work.
    * In your .env file, set environment variables for the following:
        * DATABASE=your mongodb database url
        * DATABASE_PASSWORD=your mongodb password

        * SECRET=your json web token secret
        * JWT_EXPIRES_IN=90d
        * JWT_COOKIE_EXPIRES_IN=90

        * EMAIL_USERNAME=your mailtrap username
        * EMAIL_PASSWORD=your mailtrap password
        * EMAIL_HOST=smtp.mailtrap.io
        * EMAIL_PORT=2525
        * EMAIL_FROM=your real life email address

        * SENDGRID_USERNAME=apikey
        * SENDGRID_PASSWORD=your sendgrid password

        * STRIPE_SECRET_KEY=your stripe secret key
        * STRIPE_WEBHOOK_SECRET=your stripe web hook secret

    * Start the server.
    * Your app should be running just fine.

## Main Features

- [Users](#Users)
- [Tours](#Tours)
- [Bookings](#Bookings)
- [Reviews](#Reviews)
- [Favorite Tours](#Favorite-Tours)

## Users

- Users can sign up with the application.
- Users can log into the application.
- Users can log out of the appication.
- Users can update their password.
- Users can reset their password
- Users can update their general information.
- Users can see their profile page.
- A user can be either a regular user or an admin or a lead-guide or a guide.
- When you sign up, you are a regular user by default.

## Tours

- Tours can be created by an admin user or a lead-guide.
- Tours can be seen by every user.
- Tours can be updated by an admin user or a lead-guide.
- Tours can be deleted by an admin user or a lead-guide.

## Bookings

- Only regular users can book tours (make a payment).
- Regular users can not book the same tour twice.
- Regular users can see all the tours thay have booked.
- An admin user or a lead-guide can see every booking on the app.
- An admin user or a lead-guide can delete any booking.
- An admin user or a lead-guide can create a booking (manually, without payment).
- An admin user or a lead-guide can not create a bookng for the same user twice.
- An admin user or a lead-guide can edit any booking.

## Reviews

- Only regular users can write reviews for tours which they have booked.
- All users can see the reviews of each tour.
- Regular users can edit and delete their own reviews.
- Regular users can not review the same tour twice.
- An admin can delete any review.

## Favorite Tours

- A regular user can add any of their booked tours to their list of favorite tours.
- A regular user can remove a tour from their list of favorite tours.
- A regular user can not add a tour to their list of favorite tours, when it is already a favorite.


