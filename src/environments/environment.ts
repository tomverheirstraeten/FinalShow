// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: 'AIzaSyABvAb09DZzUPPNXyQNuk0-tDaRdoOAqzs',
    authDomain: 'finalshow.firebaseapp.com',
    databaseURL: 'https://finalshow.firebaseio.com',
    projectId: 'finalshow',
    storageBucket: 'finalshow.appspot.com',
    messagingSenderId: '853852160934',
    appId: '1:853852160934:web:fc998d0dc3e790c0270567'
  },
  credentials: {
    username: 'admin',
    password: 'ehbfinalshowadminpanel'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
