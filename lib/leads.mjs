import {createHash, timingSafeEqual} from 'node:crypto';
import {db} from './database.mjs';
import {mime} from './policy.mjs';

export const ADMIN_COOKIE='__Host-nuqte_admin';
export const LEAD_STATUSES=['new','contacted','in_progress','paid','completed'];
export const LEAD_SERVICES=['scan','trademark','bridge','consultation'];
export const LEAD_SOURCES=['hero_check','quiz','scan_page','trademark_page','bridge_page','footer','contact_page','other'];

const schema=`CREATE TABLE IF NOT EXISTS leads(
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  public_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone text NOT NULL,
  telegram text NOT NULL DEFAULT '',
  preferred_contact text NOT NULL DEFAULT 'whatsapp',
  contact_time text NOT NULL DEFAULT '',
  language text NOT NULL CHECK(language IN ('ru','kz')),
  brand text NOT NULL DEFAULT '',
  mark_type text NOT NULL DEFAULT 'unknown',
  logo_name text,
  logo_mime text,
  logo_bytes bytea CHECK(logo_bytes IS NULL OR octet_length(logo_bytes)<=5242880),
  service text NOT NULL DEFAULT 'consultation',
  stage text NOT NULL DEFAULT '',
  activity text NOT NULL DEFAULT '',
  geography text NOT NULL DEFAULT '',
  urgency text NOT NULL DEFAULT '',
  comment text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  lead_source text NOT NULL DEFAULT 'other',
  utm_source text NOT NULL DEFAULT '',
  utm_medium text NOT NULL DEFAULT '',
  utm_campaign text NOT NULL DEFAULT '',
  utm_content text NOT NULL DEFAULT '',
  utm_term text NOT NULL DEFAULT '',
  referrer text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','in_progress','paid','completed')),
  payload jsonb NOT NULL DEFAULT '{}',
  ip_hash text NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status ON leads(status,created_at DESC);
CREATE INDEX IF NOT EXISTS leads_service ON leads(service,created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source ON leads(lead_source,created_at DESC);
CREATE TABLE IF NOT EXISTS limits(
  key text PRIMARY KEY,
  count integer NOT NULL,
  expires_at timestamptz NOT NULL
);
`;
let schemaPromise;
export function ensureLeadSchema(){
  if(!process.env.DATABASE_URL)throw Object.assign(Error('Хранилище заявок не подключено'),{status:503});
  return schemaPromise||=(async()=>{await db().query(schema);return true;})().catch(e=>{schemaPromise=null;throw e;});
}
export function clean(v,max=1000){return String(v??'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,max);}
export function ipHash(req){
  const ip=(req.headers.get('x-vercel-forwarded-for')||req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();
  const salt=process.env.NUQTE_RATE_SALT||process.env.AUTH_PEPPER||'nuqte-v1-rate';
  return createHash('sha256').update(salt+':'+ip).digest('hex');
}
export async function rateLimit(req,max=8){
  await ensureLeadSchema();
  const key='lead:'+ipHash(req);
  const r=await db().query(`INSERT INTO limits(key,count,expires_at) VALUES($1,1,now()+interval '15 minutes')
    ON CONFLICT(key) DO UPDATE SET count=CASE WHEN limits.expires_at<now() THEN 1 ELSE limits.count+1 END,
    expires_at=CASE WHEN limits.expires_at<now() THEN now()+interval '15 minutes' ELSE limits.expires_at END RETURNING count`,[key]);
  if(r.rows[0].count>max)throw Object.assign(Error('Слишком много заявок. Попробуйте через 15 минут.'),{status:429});
}
export function sameOrigin(req){
  const origin=req.headers.get('origin');
  if(!origin)return true;
  return origin===new URL(req.url).origin;
}
export function phoneOk(v){const d=String(v||'').replace(/\D/g,'');return d.length>=10&&d.length<=15;}
export async function readUpload(file){
  if(!(file instanceof File)||!file.size)return null;
  if(file.size>5242880)throw Object.assign(Error('Файл должен быть не больше 5 МБ.'),{status:400});
  const bytes=Buffer.from(await file.arrayBuffer());
  const type=mime(bytes);
  if(!type)throw Object.assign(Error('Допустимы PNG, JPG/JPEG или PDF.'),{status:400});
  return {name:clean(file.name,150)||'logo',mime:type,bytes};
}
function adminSecret(){
  const p=process.env.NUQTE_ADMIN_PASSWORD||'';
  const pepper=process.env.AUTH_PEPPER||process.env.NUQTE_ADMIN_PEPPER||'';
  if(p.length<10||pepper.length<16)return '';
  return createHash('sha256').update('nuqte-admin:'+p+':'+pepper).digest('hex');
}
export const adminConfigured=()=>Boolean(adminSecret());
export function validAdminPassword(value){
  const configured=process.env.NUQTE_ADMIN_PASSWORD||'', provided=String(value||'');
  if(configured.length<10||provided.length!==configured.length)return false;
  return timingSafeEqual(Buffer.from(configured),Buffer.from(provided));
}
export function adminSession(){return adminSecret();}
export function adminRequest(req){
  const expected=adminSecret(), got=req.cookies.get(ADMIN_COOKIE)?.value||'';
  if(!expected||got.length!==expected.length)return false;
  return timingSafeEqual(Buffer.from(expected),Buffer.from(got));
}
export function adminCookieStore(store){
  const expected=adminSecret(), got=store.get(ADMIN_COOKIE)?.value||'';
  return Boolean(expected&&got===expected);
}
