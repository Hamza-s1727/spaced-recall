# Reviewing Made Easy

The following program provides support for knowledge retention using spaced repetition. As you add new concepts and topics overtime, the program will automatically tell you which topics are up for review, allow you to mark them as reviewed, and automatically
set the next review date. If a review date is missed, the concept will continue to be due until reviewed. The review dates will gradually increase, up to a maximum of 30 days apart, and there is support for a maximum number of repetitions and setting a custom initial review
date.

## Prerequisites

* Node.js
* Git
* npm
* any hosted Postgres (Supabase recomennded)

# Setup

## 1. Clone the repo

``` git clone https://github.com/Hamza-s1727/spaced-recall```

## 2. Backend and Environment Setup

Install dependencies for both the frontend and backend
```
cd spaced-recall
cd backend
npm install
cd ../frontend
npm install
```

Next, create two `.env` files, one in the frontend and backend folders

The backend `.env` will have this format

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3000 # optional, default 3000
```

It's recommended to use supabase for the  `DATABASE_URL`, once you have created an account and made a table, tap "Connect", then copy the __Session Pooler__ connection string and paste it
into the `DATABASE_URL`. If you are having issues, try setting the port to 6543. 

__Create the database table__

In supabase (or the Postgres host of your choice), run the following SQL query
```
create table if not exists concepts (
  id bigserial primary key,
  concept text not null,
  topic text not null,
  initial_date date not null,
  last_reviewed date null,
  next_review_date date not null,
  interval_days int not null default 1,
  repetitions_left int null,      -- null = infinite repetitions
  total_reviews int not null default 0,
  created_at timestamptz not null default now()
);
```

Finally, run the backend
```
npm run dev
```

## 3. Frontend Setup

Create a `.env` file in the `frontend` folder, pointing to your backend (or localhost),

the frontend `.env` will have this format
```
API_URL="http://localhost:3000" # or backend URL of your own setup.
```

Finally, Run the frontend, the default port is 5173

``` npm run dev ```

The frontend should run on `https://localhost:5173`, accessible by any browser

