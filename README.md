# Reviewing Made Easy

The following program provides support for knowledge retention using spaced repetition. As you add new concepts and topics overtime, the program will automatically tell you which topics are up for review, allow you to mark them as reviewed, and automatically
set the next review date. If a review date is missed, the concept will continue to be due until reviewed. The review dates will gradually increase, up to a maximum of 30 days apart, and there is support for a maximum number of repetitions and setting a custom initial review
date.

## Prerequisites

* Docker Desktop
* Git
* any hosted Postgres (Supabase recomennded)

# Setup

## 1. Clone the repo

``` git clone https://github.com/Hamza-s1727/spaced-recall```

## 2. Backend and Environment Setup

in the project root, create a `.env` folder, with the following format

```
BACKEND_PORT=3000
FRONTEND_PORT=5173

DATABASE_URL=my_database_url_here

API_URL=http://localhost:3000 # or host of your choice
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

Finally, make sure you have docker desktop installed. Verify that docker is running by running the following command

```docker --version```

If everything is running, in the project root:

``` docker compose up --build ```

All dependencies should install automatically. Finally, open `https://localhost:5173` (or port of your choice) and enjoy the program!

