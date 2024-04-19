# CreditPlay (creditplay.json)

Adapt your credit to your needs

## Install the dependencies

```bash
yarn
# or
npm install
npm install --save vue3-apexcharts
https://cordova.apache.org/docs/en/10.x/guide/platforms/android/#setting-environment-variables


Pour contrer l'erreur dans cprdova requirements :
Requirements check results for android:
Java JDK: installed 22.0.1
Android SDK: installed true
Android target: not installed
Command failed with exit code 1: avdmanager list target
Exception in thread "main" java.lang.NoClassDefFoundError: javax/xml/bind/annotation/XmlSchema
        at com.android.repository.api.SchemaModule$SchemaModuleVersion.<init>(SchemaModule.java:156)
        at com.android.repository.api.SchemaModule.<init>(SchemaModule.java:75)
        at com.android.sdklib.repository.AndroidSdkHandler.<clinit>(AndroidSdkHandler.java:81)
        at com.android.sdklib.tool.AvdManagerCli.run(AvdManagerCli.java:213)
        ...
        ...
        ...

https://stackoverflow.com/questions/46402772/failed-to-install-android-sdk-java-lang-noclassdeffounderror-javax-xml-bind-a
cela télécharge les tools dans C:\Users\fmoun\AppData\Local\Android\Sdk\cmdline-tools\latest\bin avdmanager qui normalement est dans
C:\Users\fmoun\AppData\Local\Android\Sdk\tools\bin
IL FAUT donc changer le path

```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
