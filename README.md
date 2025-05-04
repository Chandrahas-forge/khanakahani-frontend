# khanakahani-frontend

Vue 3 + Vite frontend for KhanaKahani (Pinia, OpenAPI client)

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a front-end application built using Vue 3 and Vite. It utilizes Pinia for state management and integrates with an OpenAPI-generated client to interact with the KhanaKahani backend services.

## Project Structure

```
├── src/
│   ├── api/               # OpenAPI generated client
│   ├── assets/           # Static assets and styles
│   ├── components/       # Reusable Vue components
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   ├── views/           # Page components
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── public/              # Public static assets
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/khanakahani-frontend.git
    cd khanakahani-frontend
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

## Development

To start the development server, run:

```sh
npm run dev
```

This will start a local development server with hot module replacement at `http://localhost:5173`.

## Building for Production

To build the project for production:

```sh
npm run build
```

This will generate optimized static files in the `dist/` directory.

To preview the production build locally:

```sh
npm run preview
```

## API Integration

The project uses an OpenAPI-generated client for backend communication. The API configuration is located in `src/api/configuration.ts`.

Key configuration points:
- Base URL: Update the API endpoint in the configuration
- Authentication: Configure API keys or tokens as needed
- Request/Response interceptors: Available in the API client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

