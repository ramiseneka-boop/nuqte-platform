import {readFile} from 'node:fs/promises';import {db,tx} from '../lib/database.mjs';
const names=['001_core','002_leads'];
await tx(async c=>{
  await c.query('SELECT pg_advisory_xact_lock(78219410)');
  await c.query('CREATE TABLE IF NOT EXISTS migrations(name text PRIMARY KEY,applied_at timestamptz DEFAULT now())');
  for(const name of names){
    if(!(await c.query('SELECT 1 FROM migrations WHERE name=$1',[name])).rowCount){
      await c.query(await readFile(new URL('../db/'+name+'.sql',import.meta.url),'utf8'));
      await c.query('INSERT INTO migrations(name) VALUES($1)',[name]);
    }
  }
});await db().end();console.log('Migration complete');
