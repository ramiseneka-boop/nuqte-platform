import pg from 'pg';
let pool;
export const db=()=>{if(!process.env.DATABASE_URL)throw Object.assign(Error('База данных не подключена'),{status:503});return pool||=new pg.Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:5000,idleTimeoutMillis:20000});};
export async function tx(fn){const c=await db().connect();try{await c.query('BEGIN');const x=await fn(c);await c.query('COMMIT');return x;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}
export const audit=(c,u,id,action,details={})=>c.query('INSERT INTO audit_events(actor_id,case_id,action,details) VALUES($1,$2,$3,$4)',[u?.id||null,id,action,JSON.stringify(details)]);
