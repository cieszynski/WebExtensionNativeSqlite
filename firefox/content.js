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
document.body.style.border = "5px solid red";

const out1 = document.getElementById('out1');
const text2 = document.getElementById('text2');
out1.value = "runtime found"

const myPort = browser.runtime.connect({ name: "port-from-cs" });

myPort.onMessage.addListener((msg) => {
    console.log("content:myPort.onMessage");
    text2.value = JSON.stringify(msg)
   // self.postMessage(msg)
});

self.addEventListener("message", (event) => {
    console.log("content:self.addEventListener");
    console.debug(event)
    myPort.postMessage(event.data);
});
