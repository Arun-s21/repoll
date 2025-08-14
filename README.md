# RePoll 📊

> **A full-stack, real-time anonymous polling application built for live engagement.**

**Live Demo:** [https://repoll.vercel.app](https://repoll.vercel.app)

---

## About The Project

RePoll is a modern web application designed to gather instant, anonymous feedback from an audience. An admin can quickly create a poll, set a duration, and share a unique link. Anyone with the link can vote, and the results are displayed visually.


### Key Features

* **Admin Authentication:** Secure sign-up and sign-in system for poll creators.
* **Protected Admin Routes:** Middleware ensures that all admin pages are secure and require a valid login session.
* **Dynamic Poll Creation:** Admins can create polls with a variable number of options and a set duration.
* **Public Voting Pages:** Each poll has a unique, shareable URL for anonymous voting.
* **"Near Real-Time" Results:** The results page for voters automatically updates every 5 seconds
* **Visual Data Representation:** Poll results are displayed in a clean, easy-to-read bar chart using the Recharts library.

---

## Tech Stack

This project is built with a modern, scalable, and secure technology stack.

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Frontend:** [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
* **Backend:** Next.js API Routes
* **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* **Authentication:** `jose` for JWTs, `bcryptjs` for password hashing
* **Data Visualization:** [Recharts](https://recharts.org/)
* **Email Service:** [Brevo](https://www.brevo.com/) for admin account verification
* **Deployment:** [Vercel](https://vercel.com/)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm
* A free MongoDB Atlas account
* A free Brevo account

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/Arun-s21/repoll.git](https://github.com/Arun-s21/repoll.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd repoll
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Set up your environment variables**
    -   Create a file named `.env` in the root of the project.
    -   Add the following variables, replacing the placeholder values with your own keys:
        ```env
        DATABASE_URL=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_jwt_key
        BREVO_API_KEY=your_brevo_api_key
        ```
5.  **Run the development server**
    ```sh
    npm run dev
    ```
    The application should now be running at `http://localhost:3000`.

---

## Contact

Arun Singh - arunsng18@gmail.com

Project Link: [https://github.com/Arun-s21/repoll](https://github.com/Arun-s21/repoll)