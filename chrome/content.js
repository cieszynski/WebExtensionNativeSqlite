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

// show, that the extension was loaded ...
document.body.style.border = "5px solid blue";
document.getElementById('out1').value = ('runtime found');

const backport = chrome.runtime.connect({ name: "backport" });

backport.onMessage.addListener((data) => {
    document.dispatchEvent(new CustomEvent("from-nsc", {
        //  detail must be a string -
        //  see https://stackoverflow.com/a/79246157
        detail: JSON.stringify(data)
    }))
});

document.addEventListener("to-nsc", (event) => {
    backport.postMessage((typeof event.detail!=='object') 
        ? JSON.parse(event.detail) 
        : event.detail
    );
});