# Pantrify

Welcome to Pantrify! This project is all about making your life in the kitchen a little easier. It helps you keep track of what's in your pantry, discover new recipes, and cut down on food waste.

## Features

- **Pantry Management:** Easily add, edit, and remove items from your virtual pantry
- **Recipe Suggestions:** Get recipe ideas based on the ingredients you already have
- **AI-Powered Scanning:** Use your camera to automatically add items to your pantry
- **PWA & Offline Support:** Access your pantry list even when you're not connected to the internet

## Getting Started

Want to run this on your own machine? Here's how:

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
    Create a `.env` file in the root of the project and add the following environment variables:

    ```bash
    # Database Configuration
    DATABASE_URL="postgresql://username:password@localhost:5432/pantrify"
    DIRECT_URL="postgresql://username:password@localhost:5432/pantrify"

    # NextAuth Configuration (HTTPS Security)
    NEXTAUTH_SECRET="your-super-secret-jwt-secret-key-here"
    NEXTAUTH_URL="https://your-domain.com"

    # API Keys
    SPOONACULAR_API_KEY="your-spoonacular-api-key"

    # Google Vision API
    GOOGLE_APPLICATION_CREDENTIALS="./google_vision_service.json"

    # Security Configuration
    NODE_ENV="production"  # Set to production for HTTPS enforcement
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Now you can open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action

## Security Features

This application implements several security best practices:

- **HTTPS Enforcement**: Automatic HTTP to HTTPS redirects in production
- **HTTP-Only Cookies**: JWT tokens stored in secure, HTTP-only cookies
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **CSRF Protection**: Built-in CSRF protection via NextAuth.js
- **Password Security**: Bcrypt hashing for password storage

## Tech Stack

This project is built with some modern web technologies:

- [Next.js](https://nextjs.org/) - A React framework for building full-stack web applications
- [Tailwind CSS](https://tailwindcss.com/) - For styling the user interface
- [Prisma](https://www.prisma.io/) - As the ORM for database access
- [NextAuth.js](https://next-auth.js.org/) - For handling authentication

---
