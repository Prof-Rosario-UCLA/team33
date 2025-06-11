# Pantrify

Welcome to Pantrify! This project is all about making your life in the kitchen a little easier. It helps you keep track of what's in your pantry, discover new recipes, and cut down on food waste.

## Features

- **Pantry Management:** Easily add, edit, and remove items from your virtual pantry
- **Recipe Suggestions:** Get recipe ideas based on the ingredients you already have
- **AI-Powered Scanning:** Use your camera to automatically add items to your pantry
- **PWA & Offline Support:** Access your pantry list even when you're not connected to the internet

## Getting Started

Here's how to run this repo

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Prof-Rosario-UCLA/team33.git
    cd pantrify
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env.` file in the root of the project and add the following environment variables:

    ```
    # PostgreSQL
    DATABASE_URL=""
    DIRECT_URL=""

    # NextAuth
    NEXTAUTH_SECRET=""
    NEXTAUTH_URL=""

    # Spoonacular API
    SPOONACULAR_API_KEY = ""
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Now you can open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action

## Tech Stack

This project is built with some modern web technologies:

- [Next.js](https://nextjs.org/) - A React framework for building full-stack web applications
- [Tailwind CSS](https://tailwindcss.com/) - For styling the user interface
- [Prisma](https://www.prisma.io/) - As the ORM for database access
- [NextAuth.js](https://next-auth.js.org/) - For handling authentication

---
