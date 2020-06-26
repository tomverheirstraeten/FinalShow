// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: { // echte database
    apiKey: 'AIzaSyABvAb09DZzUPPNXyQNuk0-tDaRdoOAqzs',
    authDomain: 'finalshow.firebaseapp.com',
    databaseURL: 'https://finalshow.firebaseio.com',
    projectId: 'finalshow',
    storageBucket: 'finalshow.appspot.com',
    messagingSenderId: '853852160934',
    appId: '1:853852160934:web:fc998d0dc3e790c0270567'
  },
  // firebaseConfig: { // prototype
  //   apiKey: "AIzaSyDil2Zauz3WGZAvCKvuXXQhmiRCcdK1JPw",
  //   authDomain: "prototype-interactionroom.firebaseapp.com",
  //   databaseURL: "https://prototype-interactionroom.firebaseio.com",
  //   projectId: "prototype-interactionroom",
  //   storageBucket: "prototype-interactionroom.appspot.com",
  //   messagingSenderId: "684938562186",
  //   appId: "1:684938562186:web:60a3c13cbfbe01baa37b73"
  // },
  // firebaseConfig :{// Andres db
  //   apiKey: "AIzaSyDkgAwyClmcH_RsB3ODGNH6Vy30RGQcNK0",
  //   authDomain: "chat-b0dc5.firebaseapp.com",
  //   databaseURL: "https://chat-b0dc5.firebaseio.com",
  //   projectId: "chat-b0dc5",
  //   storageBucket: "chat-b0dc5.appspot.com",
  //   messagingSenderId: "944554094446",
  //   appId: "1:944554094446:web:dd18bfe41555c1e0039b7f"
  // },
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
