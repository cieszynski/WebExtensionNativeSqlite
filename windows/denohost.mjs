#!/usr/bin/env -S deno --allow-all

import { DatabaseSync } from 'node:sqlite';
import { Buffer } from "node:buffer";
import process from "node:process";

const database = new DatabaseSync('demo.sqlite');
const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder();

while (true) {
    for await (const chunk of Deno.stdin.readable) {
        
        const json_in = decoder.decode(chunk.slice(4));

        const obj_in = JSON.parse(json_in);
        console.error(JSON.stringify(obj_in))
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
            const message = encoder.encode(JSON.stringify(obj_out));
            const header = Buffer.from(new Uint32Array([message.length]).buffer);
            Deno.stdout.write(header);
            Deno.stdout.write(message);
        }
    }

    process.exit(0)
}