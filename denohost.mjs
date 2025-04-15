#!/usr/bin/env -S deno --allow-all
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
import { DatabaseSync } from 'node:sqlite';
import { Buffer } from "node:buffer";

const database = new DatabaseSync('example.sqlite');
const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder();

async function sendMessage(message) {
    const ui32ar = Uint32Array.from([message.length]);
    const header = Buffer.from(ui32ar.buffer);
    await Deno.stdout.write(header);
    await Deno.stdout.write(message);
}

async function getMessage() {
    const size = new Uint8Array(4);
    const raw = await Deno.stdin.read(size);

    /* on reloading or stopping we will get NULL */
    if (raw === null) {
        Deno.exit(0)
    }

    const length = size[0]
    const content = new Uint8Array(length);
    await Deno.stdin.read(content);

    return content;
}

while (true) {

    const message = await getMessage();
    const json_in = decoder.decode(message);
    const obj_out = {};

    try {
        const obj_in = JSON.parse(json_in);

        /*
            Everything outside of [all, get, run] is 
            returned (e.g. as a reference or similar):
        */
        Object.assign(obj_out, obj_in);
        
        const stmt = database.prepare(
            obj_in.all?.sql ??
            obj_in.get?.sql ??
            obj_in.run?.sql);

        const args =
            obj_in.all?.args ??
            obj_in.get?.args ??
            obj_in.run?.args ??
            [];

        const isArray = Array.isArray(args);

        if (obj_in.all) obj_out.all = isArray
            ? stmt.all(...args)
            : stmt.all(args);

        if (obj_in.get) obj_out.get = isArray
            ? stmt.get(...args)
            : stmt.get(args);

        if (obj_in.run) obj_out.run = isArray
            ? stmt.run(...args)
            : stmt.run(args);

    } catch (ex) {
        obj_out['error'] = ex.message;
        console.error(ex.message);
    } finally {
        sendMessage(encoder.encode(JSON.stringify(obj_out)));
    }
}