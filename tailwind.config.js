// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the paths based on your project structure
  ],
  theme: {
    extend: {
      colors: {       // Customize the secondary color
        darkblue: "#14147d",         // Adjusted dark blue
        darkblue2: "#050f3c",        // Slightly darker blue
        
      },
    },
  },
  plugins: [],
};
