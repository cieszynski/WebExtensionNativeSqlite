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
import fs from "node:fs/promises";
import { Buffer } from 'node:buffer';
import { DatabaseSync } from 'node:sqlite';

async function getMessage() {
    const header = new Uint32Array(1);
    await readFullAsync(1, header);
    const message = await readFullAsync(header[0]);
    return message;
}

async function readFullAsync(length, buffer = new Uint8Array(65536)) {
    const data = [];
    while (data.length < length) {
        const input = await fs.open("/dev/stdin");
        const { bytesRead } = await input.read({ buffer });
        await input.close();
        if (bytesRead === 0) {
            break;
        }
        data.push(...buffer.subarray(0, bytesRead));
    }
    return new Uint8Array(data);
}

async function sendMessage(message) {
    const header = Buffer.from(new Uint32Array([message.length]).buffer);
    const stdout = process.stdout;
    await stdout.write(header);
    await stdout.write(message);
}

const database = new DatabaseSync('demo.sqlite');
const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder();

while (true) {
    try {
        const message_in = await getMessage();
        const json_in = decoder.decode(message_in);
        
        // At this point host is stopped:
        if (!json_in.length) {
            console.error("Host stopped");
            break;
        }

        const obj_in = JSON.parse(json_in);
        const obj_out = { ref: obj_in.ref };

        try {

            const stmt = database.prepare(
                obj_in.all?.sql ??
                obj_in.get?.sql ??
                obj_in.run?.sql);

            const args =
                obj_in.all?.args ??
                obj_in.get?.args ??
                obj_in.run?.args ??
                []; /* fallback */

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

        } catch ({ name, message }) {
            obj_out['error'] = { message: message }
        } finally {
            await sendMessage(
                encoder.encode(
                    JSON.stringify(obj_out)
                )
            );
        }
    } catch (e) {
        console.error(e);
    }
}

if (database.open) {
    database.close();
}