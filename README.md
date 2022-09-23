# CS3216 Assignment 3 Group 5 Frontend Source Code

# Application Title: Mod With Me

## This application is a PWA built with [Ionic Framework](https://ionicframework.com)

## Dev Notes

The following linting/styling tools are set up as pre-commit hook, meaning they will run on all staged files each time you make a git commit:

- eslint - to lint .ts and .tsx files
- stylelint - to lint css files
- prettier - overall standardisation of code style for js,ts,tsx,json...

### How to build and deploy

This project has been configured to be deployed on firebase.
Simply run `yarn run deploy` in terminal. The ionic application will be built into the /build folder, then deployed to firebase.
