WebExtensionNativeSqlite
========================
An example WebWebExtension (BrowserExtension) showing the use of native messaging to connect a sqlite database.

Introdution
-----------

Extensions or add-ons can change and improve the functions of a browser. In addition to customising or modifying the websites that are called up, *native-messaging* also offers the option of communicating with conventional (native) applications on the computer.

The following is an example of the implementation of an extension that uses *native-messaging* to access a sqlite database.

The following goals should be realised:

1. All common browsers are supported.
2. The extension can be run under both Microsoft Windows and Linux.
3. As JavaScript is the client-side language in the browser, the native application should also be created in JavaScript.

Usage
-----

The browsers use similar, but not identical, concepts for integrating web extensions. A distinction is made between Mozilla's Firefox and Google's Chromium and the browsers based on them, such as Chrome or Edge.

An extension is a simple collection of files that change the appearance and/or behaviour of the browser.

The only file that must be present in each extension is 

    manifest.json

    [...]
    
    "content_scripts": [
        {
            "matches": [
                "file:///*"
            ],
            "js": [
                "content.js"
            ]
        }
    ],
    "permissions": [
        "nativeMessaging"
    ],

    [...]
    
    /* Chromium/Chrome/Edge */
    "background": {
        "service_worker": "background.js",
        "type": "module"
    }

    /* Firefox */
    "background": {
        "scripts":[
            "background.js"
        ]
    },
    "browser_specific_settings": {
        "gecko": {
            /* a custom id like an e-mail-address */
            "id": "nativesqlite@cieszynski.de"
        }
    },

It contains basic metadata such as the name, the version and the required authorisations. It also provides references to other files in the extension. As the required information is not standardised, the most important differences are listed.

An additional manifest file is required for *native-messaging*. It specifies where the native application is located on the computer and which extension(s) are authorised to access it.

    de.cieszynski.nativesqlite.json

    {
        /* the name has to be lowercase and only dot-separated */
        "name": "de.cieszynski.nativesqlite",
        "description": "YOUR DESCRIPTION",
        "path": "/path/to/ths/native/app",
        "type": "stdio",

        /* Chromium/Chrome/Edge */
        "allowed_origins": [
            "chrome-extension:/abcdefghijklmnopqrstuvwxyz/
        ]

        /* Firefox */
        "allowed_extensions": [
            "nativesqlite@cieszynski.de"
        ]
    }

The path to this manifest file is stored in the Windows registry:

    \\HKEY_CURRENT_USER\\Software\\Mozilla\\NativeMessagingHosts\\de.cieszynski.nativesqlite\\de.cieszynski.nativesqlite-windows-firefox

    \\HKEY_CURRENT_USER\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\de.cieszynski.nativesqlite

    \\HKEY_CURRENT_USER\\Software\\Google\\Chrome\\NativeMessagingHosts\\de.cieszynski.nativesqlite

Under Linux, the file or a link to it is stored in a directory. It is important that the assigned name and the file name are identical!

    ~/.config/chromium/NativeMessagingHosts/de.cieszynski.nativesqlite.json

    ~/.mozilla/native-messaging-hosts/de.cieszynski.nativesqlite.json

Deno is used here to create a native application. Deno makes it possible to programme in JavaScript (and TypeScript) and compile an application that can then be executed under Windows or Linux without the additional installation of a runtime environment.

    # Linux
    deno compile --allow-all --target x86_64-unknown-linux-gnu -o denohost.bin ./denohost.mjs

    deno compile --allow-all --target x86_64-pc-windows-msvc --icon ./icons/webextension.ico -o denohost.exe ./denohost.mjs

    # Windows
    deno.exe compile --allow-all -o .\denohost.exe --icon .\icons\webextension.ico .\denohost.mjs

How to load the extension for debugging in the individual browsers is described in the links at the end.

### Troubleshooting:
#### Debugging:
    start edge --enable-logging=stderr (all instances have to be stopped before)

    start chrome --enable-logging=stderr
    
    chromium --enable-logging=stderr

    in firefox: CTRL+SHIFT+J for browser-console

#### Access to the specified native messaging host is forbidden:

const port = chrome.runtime.connect(
    /* TODO: change th ID */
    "abcdefghijklmnopqrstuvwxyz"
)

"allowed_origins": [ "chrome-extension://abcdefghijklmnopqrstuvwxyz/" ]

#### Unchecked runtime.lastError: Specified native messaging host not found.

~/.config/chromium/NativeMessagingHosts/de.cieszynski.nativesqlite.json: linkname must be the same as the {"name": "de.cieszynski.nativesqlite"} in that file.

#### ExtensionError: No such native application de.cieszynski.nativesqlite

 ~/.mozilla/native-messaging-hosts/de.cieszynski.nativesqlite.json: linkname must be the same as the {"name": "de.cieszynski.nativesqlite"} in that file.

### Webpage-all

To test the extension, the file "webpage-all.html" is opened locally in a browser. Three methods are available to query the example database "example.sqlite". All calls are made in JSON format. Parameters can be passed anonymously (as an array) or by name (as an object):

#### all (SELECT - Returns all matches)
    {
        "ref": "ref1",
        "all": {
            "sql": "SELECT *FROM user WHERE id < ?;",
            "args": [
                10
            ]
        }
    }

#### get (SELECT - Returns the first match)
    {
        "ref": "ref2",
        "get": {
            "sql": "SELECT *FROM user WHERE firstname=:firstname AND lastname=:lastname;",
            "args": {
                "firstname": "Stephan",
                "lastname": "Cieszynski"
            }
        }
    }

### run (Executes INSERT, UPDATE or DELETE)
    {
        "ref": "ref3",
        "run": {
            "sql": "INSERT INTO user (firstname, lastname) VALUES (:firstname, :lastname)",
            "args": {
                "firstname": "Walt",
                "lastname": "Disney"
            }
        }
    }

In addition to [all/get/run], further keys can be passed, e.g. to include a reference to the calling function.

The result is also output in JSON format.

### Useful links:
[developer.chrome.com](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)

[developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging)

[learn.microsoft.com](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/developer-guide/native-messaging)

[docs.deno.com](https://docs.deno.com)
