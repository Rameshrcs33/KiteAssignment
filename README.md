## Kite – Sports Event Finder (FE Assignment)

Kite is a React Native (Expo) application that allows sports enthusiasts to discover, create, and join nearby sports events. The app focuses on clean frontend architecture, reusable components, and smooth user experience — no backend required.

### Overview

With Kite, users can:

Sign up and log in using email and password

Browse upcoming sports events

Create sports events as an organizer

Request to join events created by others

Accept or reject join requests (organizer-only)

View participants for each event

Automatically expire pending requests once the event starts

All data is stored locally (in-memory / localStorage / AsyncStorage).

### Features
### Authentication

User must sign up first before logging in

Login using email & password

Authentication state persisted locally

### Events

Create a sports event with:

Event name

Sport type

Start time

Player limit

Event creator becomes the Organizer

View all future events, sorted by start time (ascending)

### Joining Events

Any user can request to join an event (if slots are available)

Event organizers can:

Accept join requests

Reject join requests

Users can cancel join requests before event start time

Once the event starts:

All pending requests are automatically expired

### Participants

View list of players who have joined an event

Organizer can see request statuses:

Pending

Accepted

Rejected

Expired
