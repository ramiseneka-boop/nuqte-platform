import {NextResponse} from 'next/server';
import {db} from '@/lib/database.mjs';
import {ensureLeadSchema,adminRequest,LEAD_STATUSES,LEAD_SERVICES,LEAD_SOURCES,clean} from '@/lib/leads.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
const json=(x,s=200)=>NextResponse.json(x,{status:s,headers:{'Cache-Control':'no-store'}});
function filters(p){
 const where=[],values=[];const add=(sql,v)=>{values.push(v);where.push(sql.replace('?', '$'+values.length));};
 const q=clean(p.get('q'),120);if(q)add("(public_id ILIKE '%'||?||'%' OR name ILIKE '%'||?||'%' OR phone ILIKE '%'||?||'%' OR brand ILIKE '%'||?||'%')",q);
 // expand repeated placeholder safely below
 if(q){const v=values.pop(),idx=values.length+1;values.push(v);where[where.length-1]=`(public_id ILIKE '%'||$${idx}||'%' OR name ILIKE '%'||$${idx}||'%' OR phone ILIKE '%'||$${idx}||'%' OR brand ILIKE '%'||$${idx}||'%')`;}
 const status=clean(p.get('status'),30);if(LEAD_STATUSES.includes(status))add('status=?',status);
 const service=clean(p.get('service'),30);if(LEAD_SERVICES.includes(service))add('service=?',service);
 const language=clean(p.get('language'),2);if(['ru','kz'].includes(language))add('language=?',language);
 const source=clean(p.get('source'),40);if(LEAD_SOURCES.includes(source))add('lead_source=?',source);
 return {sql:where.length?' WHERE '+where.join(' AND '):'',values};
}
function csvCell(v){const s=String(v??'');return '"'+s.replaceAll('"','""')+'"';}
export async function GET(req){try{
 if(!adminRequest(req))return json({error:'Unauthorized'},401);await ensureLeadSchema();
 const p=new URL(req.url).searchParams;
 if(p.has('file')){const r=await db().query('SELECT logo_name,logo_mime,logo_bytes FROM leads WHERE public_id=$1',[clean(p.get('file'),40)]);if(!r.rowCount||!r.rows[0].logo_bytes)return new NextResponse('Not found',{status:404});const d=r.rows[0];return new NextResponse(d.logo_bytes,{headers:{'Content-Type':d.logo_mime,'Content-Disposition':`inline; filename*=UTF-8''${encodeURIComponent(d.logo_name||'file')}`,'Cache-Control':'private, no-store','Content-Security-Policy':"default-src 'none'; sandbox",'X-Content-Type-Options':'nosniff'}});}
 const f=filters(p);
 const select=`SELECT public_id,created_at,name,phone,telegram,preferred_contact,contact_time,language,brand,mark_type,logo_name,service,stage,activity,geography,urgency,comment,website,lead_source,utm_source,utm_medium,utm_campaign,utm_content,utm_term,referrer,status,payload FROM leads${f.sql} ORDER BY created_at DESC LIMIT 2000`;
 const r=await db().query(select,f.values);
 if(p.get('format')==='csv'){
  const cols=['public_id','created_at','name','phone','telegram','preferred_contact','contact_time','language','brand','mark_type','service','stage','activity','geography','urgency','comment','website','lead_source','utm_source','utm_medium','utm_campaign','utm_content','utm_term','referrer','status'];
  const body='\ufeff'+cols.join(',')+'\n'+r.rows.map(x=>cols.map(k=>csvCell(x[k])).join(',')).join('\n');
  return new NextResponse(body,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="nuqte-leads.csv"','Cache-Control':'no-store'}});
 }
 return json({leads:r.rows});
 }catch(e){console.error('NUQTE admin error',e.code||e.name);return json({error:'Не удалось загрузить заявки.'},500);}}
export async function POST(req){try{
 if(!adminRequest(req))return json({error:'Unauthorized'},401);await ensureLeadSchema();const b=await req.json();
 const id=clean(b.id,40),status=clean(b.status,30);if(!id||!LEAD_STATUSES.includes(status))return json({error:'Некорректные данные.'},400);
 const r=await db().query('UPDATE leads SET status=$1,updated_at=now() WHERE public_id=$2 RETURNING public_id,status',[status,id]);if(!r.rowCount)return json({error:'Заявка не найдена.'},404);return json({ok:true,lead:r.rows[0]});
 }catch{return json({error:'Не удалось обновить статус.'},500);}}
