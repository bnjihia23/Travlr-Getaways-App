**Travlr Getaways – CS-499 Category 1 Artifact**



This submission contains both the original Travlr Getaways full-stack web application and the enhanced mobile application built for Milestone Two.





**Project Structure**



travlr  (Original full-stack web app)

travlr-mobile (Mobile companion app)





**Requirements:**



Before running either project, you will need:



\- Node.js (v16+)

\- NPM

\- MongoDB (local or cloud, e.g., MongoDB Atlas)

\- Expo Go app (for mobile testing on a physical device)





**1. Backend (Express API)**



How to Start the Backend:



&nbsp;   cd travlr

&nbsp;   npm install

&nbsp;   npm start



The Express server will start on the configured port (typically http://localhost:3000).







**2. Consumer-Facing Angular Web App**



How to Start the Angular App:



&nbsp;   cd travlr/app_admin

&nbsp;   npm install

&nbsp;   npm start



The consumer-facing site will run at:

&nbsp;   http://localhost:4200





**3. Admin Dashboard (Angular)**



The admin interface is part of the same Angular project.



Access it at:

&nbsp;   http://localhost:4200/admin



Default Admin Login:



&nbsp;   username: admin

&nbsp;   password: admin





**4. Mobile App (React Native + Expo)**



How to Start the Mobile App:



&nbsp;   cd travlr-mobile

&nbsp;   npm install

&nbsp;   npx expo start



This will display a QR code in your terminal.



How to View the Mobile App:

\- Install the Expo Go app (iOS or Android).

\- Open Expo Go and scan the QR code.





**5. Mobile App Features**



The mobile app includes:



\- Trip list pulled from the Express API

\- Dynamic trip detail screen

\- Favorites stored locally on the device

\- Real-time search bar

\- JWT login and registration

\- Persistent authentication with AsyncStorage

\- Bottom tab navigation + stack navigation





**6. Notes**



\- node\_modules folders have been removed to reduce file size.

\- After downloading and unzipping, run 'npm install' in both travlr and travlr-mobile before starting.

\- The backend must be running before starting the web or mobile apps.







