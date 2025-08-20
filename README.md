# MlLibraries

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Run Application

Execute on separate cmd/bash

    npm run build ng-notification-controller
    npm start

## Development
##### Find all "ng-notification-controller"  and replace with the name of your plugin or library

Live plugin code changes development.

Execute on separate cmd/bash

    npm run watch:ng-notification-controller or ng build ng-notification-controller --watch
    npm start

Change some codes on library then wait for change to take action

## Generating library

    ng g lib library-name-here --prefix=mli-lib

## Build and publish library to artifactory

    ng build library-name-here
    npm publish dist/library-name-here

#### Prerequisites

`npm login` - npm requires authentication to publish in artifactory

`.npmrc` file for registry and scope configurations

Example `.npmrc` content:

    registry=https://artifactory.platform.manulife.io/artifactory/api/npm/npm/
    strict-ssl=false
    @mli:registry=https://artifactory.platform.manulife.io/artifactory/api/npm/npm/

Auth for `.npmrc` from artifactory

    _auth = amhlc3Bpbm86QVA12345655VzFTVmmockhUWFIz
    email = myemailhere@manulife.com
    always-auth = true

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Unit tests setup

Ensure `tsconfig.app.json` excludes mock files

    "exclude": [
        "test.ts",
        "**/*.spec.ts",
        "**/*.mock.ts"
    ]

Ensure `tsconfig.spec.json` includes mock files

    "include": [
        "**/*.spec.ts",
        "**/*.d.ts",
        "**/*.mock.ts"
    ]

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running plugin unit tests

Plugin unit tests are executed separately.

Run `ng test ng-notification-controller` or `npm run test:ng-notification-controller`(custom script on package.json) to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Cloning ng-notification-controller

Find All and replace keywords: `ng-notification-controller` to `project-module-name` and `NgNotificationSwitch` to `ProjectModuleName`
