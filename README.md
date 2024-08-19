
# Dashboard Management System

This is a React-based dashboard project where users can manage categories and widgets dynamically. The application supports adding and removing categories, adding and removing widgets within each category, searching for widgets, and confirming widget removal actions.


## Features

- Dynamic Category Management
    - Add and remove categories
    - Each category has its own set of widgets.
- Dynamic Widget Management
    - Add and remove widgets.
    - Widgets can be added to specific categories.
    - Widgets have a title and associated data.
- Search and Filter Widgets
    - Search for widgets based on their title within the active category.
- Confirmation Dialog for Deleting Widgets
    - A confirmation dialog appears when you attempt to remove a widget.


## Prerequisites
Before you begin, ensure you have the following installed on your local machine:

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
## Installation

Follow the steps below to set up the project locally:

- Clone the repository:

```bash
  git clone https://github.com/your-username/dashboard.git
```
- Navigate to the project directory:

```bash
  cd dashboard
```
- Install dependencies:

```bash
  npm install
```
This will install all the necessary packages listed in the package.json file.

    
## Packages Used

The project is primarily built using the following packages:

- React: 18.3.1
- React Icons: For rendering icons in the UI.
- Tailwind CSS: Utility-first CSS framework for styling.
- @testing-library/react: For testing React components.
- @testing-library/jest-dom: For DOM testing with Jest.
- web-vitals: For measuring performance metrics.
## Run Locally

To run the project locally, follow these steps:

- Navigate to the project directory:

```bash
  cd dashboard
```

- Start the development server:

```bash
  npm start
```
This will start the application and open it in your default web browser at http://localhost:3000.

- Building for production:

```bash
  npm run build
```
If you want to build the application for production, this will create a build folder with optimized assets.

- Running tests:

```bash
  npm test
```
This will execute the tests using the React testing library.
Running `npm run build` and `npm test` are optional commands and should be executed only if you need to build the application for production or run tests on your components.


## Custom Styles

The project uses Tailwind CSS for styling. Custom styles are added in the index.css file. Ensure Tailwind CSS is properly configured in tailwind.config.js.
## Code Editor
For development, it is recommended to use Visual Studio Code, which provides excellent support for JavaScript and React development. However, you can use any code editor of your choice.
