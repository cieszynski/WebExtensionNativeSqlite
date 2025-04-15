# Troubleshooting:
## Access to the specified native messaging host is forbidden:

const port = chrome.runtime.connect(
    /* TODO: change th ID */
    "pclabbnfkafcnbidmpijlenbofbldenh"
)

"allowed_origins": [ "chrome-extension://pclabbnfkafcnbidmpijlenbofbldenh/" ]

## Unchecked runtime.lastError: Specified native messaging host not found.

~/.config/chromium/NativeMessagingHosts/de.cieszynski.nativesqlite.json: linkname musst be the same as the {"name": "de.cieszynski.nativesqlite"} in that file.