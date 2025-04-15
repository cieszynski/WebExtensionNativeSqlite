/* 
    This file is part of WebExtensionNativeSqlite by Stephan Cieszynski 2025.

    WebExtensionNativeSqlite is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebExtensionNativeSqlite is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebExtensionNativeSqlite.  If not, see <http://www.gnu.org/licenses/>.
*/
const nativeport = browser.runtime.connectNative("de.cieszynski.nativesqlite")

nativeport.onDisconnect.addListener(function (data) {
    console.error('background:nativeport Disconnected ' + JSON.stringify(data));
});

browser.runtime.onConnect.addListener((port) => {
    console.debug("background:onConnect");

    port.onDisconnect.addListener((data) => {
        console.error("background:port.onDisconnect " + JSON.stringify(data))
    })

    port.onMessage.addListener((data) => {
        nativeport.postMessage(data)
    })

    nativeport.onMessage.addListener((data) => {
        port.postMessage(data)
    });
});