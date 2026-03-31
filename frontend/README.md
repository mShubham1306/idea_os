# IdeaOS Frontend

This directory contains a React-based frontend built with [Vite](https://vitejs.dev/). It implements a card-based UI that communicates with the backend API to submit ideas and display history.

## Features

- **Card layout**: Each idea is shown as a glassmorphic card, matching the IdeaOS design.
- **Responsive**: CSS grid and media queries ensure the layout adapts to smaller viewports.
- **API integration**: Uses Axios (through a lightweight wrapper) to call `/api/idea/analyze` and `/api/idea/history`.
- **Dark theme & colors**: Custom CSS variables follow the purple/neon palette from the design mockups.

## Getting started

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`. The Vite config proxies `/api` requests to `http://localhost:5000`, so make sure the backend is running on port 5000.

3. Build for production:

   ```bash
   npm run build
   ```

## Adding new cards

The `<Card />` component displays data returned from the backend. It automatically handles both history entries and full analysis responses. To extend it, modify `src/components/Card.jsx`.

## Styling

All global styles are in `src/styles/globals.css`. Individual components maintain their own CSS files (e.g. `Card.css`). Feel free to add more color variables or themes.
