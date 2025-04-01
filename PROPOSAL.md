# Project Description

## Load Ledger

Load Ledger is a web-based, full-stack CRUD application designed for trucking and logistics companies to track broker payments and driver pay with accuracy and ease. The platform aims to streamline financial record-keeping by offering a centralized dashboard where users can log, view, edit, and delete records related to loads, broker invoices, and driver pay statuses. Whether you're an owner-operator or managing a fleet, Load Ledger makes it easy to stay on top of outstanding payments and ensure timely compensation for drivers.

This tool not only replaces manual spreadsheets but provides real-time visibility into cash flow, payment deadlines, and job profitability—helping small and mid-sized trucking businesses stay organized and financially healthy.


## MVP (Minimum Viable Product) User Stories

These are the core features:

1. Load & Broker Management
   - As a user, I want to create a new load entry with details like broker name, load number, rate, and delivery date.
   - As a user, I want to view a list of all my loads, so I can quickly find recent hauls.
   - As a user, I want to edit or delete a load, in case something changes or was entered incorrectly.
   - As a user, I want to mark a load as paid or unpaid to keep tabs on broker payment status.

2. Driver Pay Tracking
   - As a user, I want to assign a driver to a load, so I know who was responsible for the haul.
   - As a user, I want to record payment status for each driver, including payment amount and date paid.
   - As a user, I want to filter or sort by unpaid drivers or brokers, so I can follow up accordingly.

3. User Interface
   - As a user, I want to see a clean dashboard layout with tables, buttons, and clear navigation.
   - As a user, I want to easily identify which loads are still unpaid or need attention using visual indicators.
   - As a user, I want the ability to login in and authenticate the users to protect sensitive information.

## Stretch Goals (Future Enhancements)

1. Reporting & Analytics

   - Generate monthly or quarterly financial reports showing broker payments received and driver payouts.
   - Display graphs and charts for visual summaries of outstanding balances and cash flow.

2. Authentication & Multi-User Access

   - Support multiple user roles (admin, dispatcher, accountant) with different access levels.

3. Notifications & Reminders
   - Send email or in-app reminders for upcoming broker payment due dates.
   - Notify users of driver payment deadlines..

4. Mobile-Friendly Design
   - Optimize layout for smartphones and tablets so users can manage pay while on the go.

5. Load Document Upload
   - Add functionality for uploading Rate Confirmations, BOLs (Bill of Lading), and invoices to each load entry.

## Main Wire Frame

![image](https://i.postimg.cc/6pTkX2Hv/temp-Image6o-ERCt.avif)

## Drivers Wire Frame

![image](https://i.postimg.cc/SxZwxJmc/temp-Image-Yuqs-VD.avif)

## Brokders Wire Frame

![image](https://i.postimg.cc/xTfxNnx5/temp-Image-Muy-BG3.avif)

## ERD

![image](https://i.postimg.cc/02Fyhwxz/temp-Imagea5lqdh.avif)

## Pseudocode

```js
// Load Ledger – Pseudocode Overview

// When a user visits the site:
    // If not logged in → redirect to login page.
    // If logged in → show dashboard with Load summary table.

// Dashboard shows:
    // All Loads created by the current user
    // Status (Paid/Unpaid), Broker, Driver info
    // Option to Add/Edit/Delete a load

// On Add Load Page:
    // Show form to input loadNumber, rate, deliveryDate
    // Dropdown to select Broker and Driver
    // On submit → save new Load (linked to logged-in User)

// On Edit Load Page:
    // Pre-fill form with existing load details
    // Allow user to update payment status, rate, or assigned driver

// When viewing a Broker or Driver:
    // Show all Loads linked to them
    // Display payment summaries (how many paid/unpaid, total amounts)

// Authorization:
    // Guests cannot view dashboard or interact with loads
    // Only the user who created a load can edit/delete it

// Sessions:
    // Login stores user in session
    // Middleware checks for session before protected routes

// When user logs out:
    // Session is destroyed, redirect to login page

## Routes (RESTful)

Method  Path             Action
GET     /                → dashboardController.home
GET     /login           → authController.showLogin
POST    /login           → authController.login
GET     /register        → authController.showRegister
POST    /register        → authController.register
POST    /logout          → authController.logout

GET     /loads           → loadController.index
GET     /loads/new       → loadController.new
POST    /loads           → loadController.create
GET     /loads/:id       → loadController.show
GET     /loads/:id/edit  → loadController.edit
PUT     /loads/:id       → loadController.update
DELETE  /loads/:id       → loadController.delete


## Drivers Routes (RESTful)

Method	Path	            Description	                    Controller Action
GET	    /drivers	        Show all drivers	            driverController.index
GET 	/drivers/new	    Show form to add a new driver	driverController.new
POST	/drivers	        Create a new driver	            driverController.create
GET	    /drivers/:id	    Show a single driver detail	    driverController.show
GET	    /drivers/:id/edit	Show form to edit a driver	    driverController.edit
PUT	    /drivers/:id	    Update driver info	            driverController.update
DELETE	/drivers/:id	    Delete a driver	                driverController.delete

## Brokers Routes (RESTful)
Method	Path	            Description	                    Controller Action
GET	    /brokers	        Show all brokers	            brokerController.index
GET	    /brokers/new	    Show form to add a new broker	brokerController.new
POST	/brokers	        Create a new broker	            brokerController.create
GET	    /brokers/:id	    Show a single broker detail	    brokerController.show
GET	    /brokers/:id/edit	Show form to edit a broker	    brokerController.edit
PUT	    /brokers/:id	    Update broker info	            brokerController.update
DELETE	/brokers/:id	    Delete a broker	                brokerController.delete



## Timeline - Daily Accountability

| Day        |   | Task                                             | Blockers | Notes/ Thoughts |
|------------|---|--------------------------------------------------|----------|-----------------|
| Tuesday    |   | create timeline, ERD, proposal, wirefram, US     |          |                 |
| Wednesday  |   | Work on coding, connections, functionality       |          |                 |
| Thursday   |   | work on functionality                            |          |                 |
| Friday     |   | Work on CSS                                      |          |                 |
| Saturday   |   | Add one or two stretch goals                     |          |                 |
| Sunday     |   | Improve CSS, work with Alex during OO on errors  |          |                 |
| Monay      |   | Present Project to class                         |          |                 |
```
