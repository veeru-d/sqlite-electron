# Using @capacitor-community/sqlite plugin in electron app with latest versions of ionic, angular and capacitor

## TLDR
`@capacitor-community/sqlite` works in `android` but throws `"CapacitorSQLite" plugin is not implemented on electron` error in `electron`.


## Create basic ionic app
```
ionic start sqlite-electron blank --type=angular-standalone --capacitor

ionic serve
```
<p>App works successfully in browser</p>

## Add Android platform
```
npm install @capacitor/android
```

```
npx cap add android
√ Adding native android project in android in 63.39ms
√ add in 64.02ms
√ Copying web assets from www to android\app\src\main\assets\public in 12.26ms
√ Creating capacitor.config.json in android\app\src\main\assets in 666.20μs
√ copy android in 30.47ms
√ Updating Android plugins in 4.49ms
[info] Found 4 Capacitor plugins for android:
       @capacitor/app@7.0.1
       @capacitor/haptics@7.0.1
       @capacitor/keyboard@7.0.1
       @capacitor/status-bar@7.0.1
√ update android in 189.33ms
√ Syncing Gradle in 370.50μs
[success] android platform added!
Follow the Developer Workflow guide to get building:
https://capacitorjs.com/docs/basics/workflow
```

```
npx cap run android
```
<p>App works successfully in android emulator based on API version 35</p>

## Add sqlite to android
`npm i @capacitor-community/sqlite`

`npx cap sync android`
```
√ Copying web assets from www to android\app\src\main\assets\public in 33.43ms
√ Creating capacitor.config.json in android\app\src\main\assets in 893.20μs
√ copy android in 55.11ms
√ Updating Android plugins in 4.94ms
[info] Found 5 Capacitor plugins for android:
       @capacitor-community/sqlite@7.0.0
       @capacitor/app@7.0.1
       @capacitor/haptics@7.0.1
       @capacitor/keyboard@7.0.1
       @capacitor/status-bar@7.0.1
√ update android in 248.07ms
[info] Sync finished in 0.35s
```

### Create table and insert rows
**`home.page.ts:`**
```
import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  async ngOnInit() {
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    console.log('sqlite=', JSON.stringify(sqlite));

    const db = await sqlite.createConnection(
      'todo',
      false,
      'no-encryption',
      0,
      false
    );
    console.log('db=', JSON.stringify(db));

    await db.open();

    const createTable = await db.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      );`);
    console.log('createTable=', JSON.stringify(createTable));

    const addTodo = await db.run(
      'INSERT INTO todos (title, completed) VALUES (?, ?);',
      [`test todo ${Math.round(Math.random() * 1000)}`, 0]
    );
    console.log('addTodo=', JSON.stringify(addTodo));

    await db.close();
    await sqlite.closeConnection('todo', false);
  }
}
```

`npm run build --configuration=development`

`npx cap sync android`

`npx cap run android`
<p>
  DB /data/data/io.ionic.starter/databases/todoSQLite.db created successfully.
  DB contains the expected table & row.
</p>

## Add Electron platform
[Ref](https://github.com/capacitor-community/sqlite)

**`capacitor.config.ts:`**
```
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'sqlite-electron',
  webDir: 'www',
  plugins: {
    CapacitorSQLite: {
      electronWindowsLocation: 'C:\\Users\\veera',
    },
  },
};

export default config;
```

[Ref](https://capacitor-community.github.io/electron/docs/gettingstarted)

`npm i @capacitor-community/electron`

`npx cap add @capacitor-community/electron`
Creates `electron` folder successfully.

output of above cmd:
```
ℹ Adding Electron platform: start �
ℹ Adding Electron platform: extracting template
ℹ Adding Electron platform: copying capacitor config file
ℹ Adding Electron platform: setting up electron project
ℹ Adding Electron platform: installing npm modules
✔ Adding Electron platform: completed in 22.67s
ℹ Copying Web App to Electron platform: start �
ℹ Copying Web App to Electron platform: Copying D:\sqlite-electron\www into D:\sqlite-electron\electron\app
✔ Copying Web App to Electron platform: completed in 34.24ms
ℹ Updating Electron plugins: start �
⠋ Updating Electron plugins: searching for plugins
Unable to find node_modules/eslint-plugin-jsdoc.
Are you sure eslint-plugin-jsdoc is installed?
ℹ Updating Electron plugins: searching for plugins
ℹ Updating Electron plugins: generating electron-plugins.js
⠋ Updating Electron plugins: installing electron plugin files

Will install: @capacitor-community/sqlite@7.0.0

ℹ Updating Electron plugins: installing electron plugin files
✔ Updating Electron plugins: completed in 4.02s
```

**not sure about `Unable to find node_modules/eslint-plugin-jsdoc` issue above**

```
npx cap open @capacitor-community/electron
```
**DOES NOT WORK**

```
ℹ Opening Electron platform: start �
ℹ Opening Electron platform: building electron app
⠹ Opening Electron platform: running electron appError: undefined
✖ Opening Electron platform:
node:internal/process/promises:392
      new UnhandledPromiseRejection(reason);
      ^

UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "
> sqlite-electron@1.0.0 electron:start-live
> node ./live-runner.js

node:internal/child_process:420
    throw new ErrnoException(err, 'spawn');
          ^

Error: spawn EINVAL
    at ChildProcess.spawn (node:internal/child_process:420:11)
    at Object.spawn (node:child_process:753:9)
    at D:\sqlite-electron\electron\live-runner.js:19:24
    at new Promise (<anonymous>)
    at runBuild (D:\sqlite-electron\electron\live-runner.js:18:10)
    at D:\sqlite-electron\electron\live-runner.js:72:9
    at Object.<anonymous> (D:\sqlite-electron\electron\live-runner.js:75:3)
    at Module._compile (node:internal/modules/cjs/loader:1562:14)
    at Object..js (node:internal/modules/cjs/loader:1699:10)
    at Module.load (node:internal/modules/cjs/loader:1313:32) {
  errno: -4071,
  code: 'EINVAL',
  syscall: 'spawn'
}

Node.js v22.13.0
".
    at throwUnhandledRejectionsMode (node:internal/process/promises:392:7)
    at processPromiseRejections (node:internal/process/promises:475:17)
    at process.processTicksAndRejections (node:internal/process/task_queues:106:32) {
  code: 'ERR_UNHANDLED_REJECTION'
}

Node.js v22.13.0
```

So, tried the following based on [Ref](https://github.com/capacitor-community/sqlite)
```
cd electron
npm install --save better-sqlite3-multiple-ciphers
npm install --save electron-json-storage
npm install --save jszip
npm install --save node-fetch@2.6.7
npm install --save crypto
npm install --save crypto-js
npm install --save-dev @types/better-sqlite3
npm install --save-dev @types/electron-json-storage
npm install --save-dev @types/crypto-js

npm install --save-dev electron@25.8.4
npm uninstall --save-dev electron-rebuild
npm install --save-dev @electron/rebuild
npm install --save-dev electron-builder@24.6.4
```

Added this to `electron/tsconfig.json`:
```
"skipLibCheck": true
```

Run the app
```
cd <root>
npx cap open @capacitor-community/electron
```
**DOES NOT WORK***
```
ℹ Opening Electron platform: start �
ℹ Opening Electron platform: building electron app
⠼ Opening Electron platform: running electron appError: undefined
✖ Opening Electron platform:
node:internal/process/promises:392
      new UnhandledPromiseRejection(reason);
      ^

UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "
> sqlite-electron@1.0.0 electron:start-live
> node ./live-runner.js

node:internal/child_process:420
    throw new ErrnoException(err, 'spawn');
          ^

Error: spawn EINVAL
    at ChildProcess.spawn (node:internal/child_process:420:11)
    at Object.spawn (node:child_process:753:9)
    at D:\sqlite-electron\electron\live-runner.js:19:24
    at new Promise (<anonymous>)
    at runBuild (D:\sqlite-electron\electron\live-runner.js:18:10)
    at D:\sqlite-electron\electron\live-runner.js:72:9
    at Object.<anonymous> (D:\sqlite-electron\electron\live-runner.js:75:3)
    at Module._compile (node:internal/modules/cjs/loader:1562:14)
    at Object..js (node:internal/modules/cjs/loader:1699:10)
    at Module.load (node:internal/modules/cjs/loader:1313:32) {
  errno: -4071,
  code: 'EINVAL',
  syscall: 'spawn'
}

Node.js v22.13.0
".
    at throwUnhandledRejectionsMode (node:internal/process/promises:392:7)
    at processPromiseRejections (node:internal/process/promises:475:17)
    at process.processTicksAndRejections (node:internal/process/task_queues:106:32) {
  code: 'ERR_UNHANDLED_REJECTION'
}

Node.js v22.13.0
```

## Alternate way tried to run the electron project
`cd electron`

`npm run electron:start`

**DOES NOT WORK**

cmd-line error
```
> sqlite-electron@1.0.0 electron:start
> npm run build && electron --inspect=5858 ./

> sqlite-electron@1.0.0 build
> tsc && electron-rebuild

✔ Rebuild Complete

Debugger listening on ws://127.0.0.1:5858/5b02afc7-0b16-4b8b-af40-17ffd48f71bb
For help, see: https://nodejs.org/en/docs/inspector
in setupCapacitorElectronPlugins
{
  CapacitorCommunitySqlite: { default: { CapacitorSQLite: [class CapacitorSQLite] } }
}
CapacitorCommunitySqlite
Skip checkForUpdates because application is not packed and dev update config is not forced
checkForUpdatesAndNotify called, downloadPromise is null
```

electron dev tools console logs
```
ERROR Error: "CapacitorSQLite" plugin is not implemented on electron
    at B (chunk-XR2CIPKH.js:1:1374)
    at chunk-XR2CIPKH.js:1:1490
    at f.invoke (polyfills-4BK4MXU4.js:1:6511)
    at Object.onInvoke (chunk-DIB2G2IA.js:7:23687)
    at f.invoke (polyfills-4BK4MXU4.js:1:6451)
    at _.run (polyfills-4BK4MXU4.js:1:1767)
    at polyfills-4BK4MXU4.js:2:553
    at f.invokeTask (polyfills-4BK4MXU4.js:1:7136)
    at Object.onInvokeTask (chunk-DIB2G2IA.js:7:23503)
    at f.invokeTask (polyfills-4BK4MXU4.js:1:7057)
```

So, in summary, android app works as expected.

Electron app launches and displays the home page, but throws this error in dev tools console tab.
```
"CapacitorSQLite" plugin is not implemented on electron
```
