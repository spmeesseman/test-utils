# TEST-UTILS CHANGE LOG

## Version 0.1.0 (July 5th, 2023)

### Bug Fixes

- **Runner:** nyc libraries are included in production  bundle
- **Tracker:** rolling count does not work in teardown suite
- **Coverage:** dynamically required modules dont load in production env
- **Runner:** dynamic module resolution not working in production build installed in node_modules

### Features

- apply command line args to runner and tracker options object at runtime

### Refactoring

- add plural labels in console writes when necessary

## Version 0.0.5 (July 3rd, 2023)

### Refactoring

- convert to full ecmascript es2020 module

## Version 0.0.4 (July 2nd, 2023)

### Refactoring

- covert back to commonjs module

## Version 0.0.3 (July 2nd, 2023)

### Refactoring

- start conversion to es2020 module / imports

## Version 0.0.2 (July 2nd, 2023)

### Build System

- move to webpack build

## Version 0.0.1 (July 2nd, 2023)

### Features

- first release
