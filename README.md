
https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging

https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/developer-guide/native-messaging?tabs=v3%2Cwindows

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging

deno compile --allow-all --target x86_64-unknown-linux-gnu -o denohost.bin ./denohost.mjs

deno compile --allow-all --target x86_64-pc-windows-msvc --icon ./icons/webextension.ico -o denohost.exe ./denohost.mjs