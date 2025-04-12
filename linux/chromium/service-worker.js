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

chrome.runtime.onConnectExternal.addListener((port) => {

    let nativeport = chrome.runtime.connectNative("de.cieszynski.nativesqlite");

    nativeport.onDisconnect.addListener(function () {
        console.log('nativeport Disconnected');
    });

    nativeport.onMessage.addListener((msg) => {
        port.postMessage(msg);
    });

    port.onMessage.addListener((msg, port) => {
        nativeport.postMessage(msg);
    });

    port.onDisconnect.addListener(() => {
        console.log('port Disconnected');
    });
})