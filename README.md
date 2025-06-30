# RuleMaster AI Frontend

A modern web application for managing and interacting with AI-powered business rules. RuleMaster AI enables users to create, modify, and deploy intelligent rule systems through an intuitive interface.

## Features

- Interactive dashboard for rule management
- Real-time chat interface with AI assistant
- Rule creation and modification
- User authentication and profile management
- Responsive design for desktop and mobile devices

## Technology Stack

- React 
- TypeScript
- Tailwind CSS
- Context API for state management
- RESTful API integration

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/rule-master-ai-frontend.git
   cd rule-master-ai-frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with required environment variables
   (Contact your system administrator for the correct environment settings)

4. Start the development server
   ```
   npm start
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Main application pages
- `src/context`: React context providers
- `src/services`: API service integration
- `src/routes`: Application routing
- `src/guards`: Authentication guards
- `src/types`: TypeScript type definitions