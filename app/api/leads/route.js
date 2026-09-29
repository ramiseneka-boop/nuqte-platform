import {NextResponse} from 'next/server';
import {tx} from '@/lib/database.mjs';
import {ensureLeadSchema,rateLimit,sameOrigin,clean,phoneOk,readUpload,LEAD_SERVICES,LEAD_SOURCES,ipHash} from '@/lib/leads.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
const json=(x,s=200)=>NextResponse.json(x,{status:s,headers:{'Cache-Control':'no-store'}});
const fail=(m,s=400)=>{throw Object.assign(Error(m),{status:s});};
const pick=(v,a,f)=>a.includes(v)?v:f;
function parsePayload(v){try{const x=JSON.parse(String(v||'{}'));return x&&typeof x==='object'&&!Array.isArray(x)?x:{};}catch{return {};}}
export async function GET(){return json({ready:Boolean(process.env.DATABASE_URL)});}
export async function POST(req){try{
 if(!sameOrigin(req))fail('Недопустимый источник запроса.',403);
 if(Number(req.headers.get('content-length')||0)>6500000)fail('Слишком большой запрос.',413);
 await rateLimit(req,8);await ensureLeadSchema();
 const f=await req.formData();
 const consent=String(f.get('consent'))==='true';if(!consent)fail('Подтвердите согласие на обработку данных.');
 const language=pick(clean(f.get('language'),2),['ru','kz'],'ru');
 const name=clean(f.get('name'),100);if(!name)fail(language==='kz'?'Атыңызды көрсетіңіз.':'Укажите имя.');
 const phone=clean(f.get('phone'),40);if(!phoneOk(phone))fail(language==='kz'?'Телефон нөмірін дұрыс енгізіңіз.':'Введите корректный номер телефона.');
 const markType=pick(clean(f.get('mark_type'),20),['name','logo','combined','unknown'],'unknown');
 const brand=clean(f.get('brand'),160);
 const requireBrand=String(f.get('require_brand'))==='true';
 if(requireBrand&&['name','combined'].includes(markType)&&!brand)fail(language==='kz'?'Бренд атауын енгізіңіз.':'Введите название бренда.');
 const upload=await readUpload(f.get('logo'));
 if(String(f.get('require_logo'))==='true'&&['logo','combined'].includes(markType)&&!upload)fail(language==='kz'?'Логотипті жүктеңіз.':'Загрузите логотип.');
 const service=pick(clean(f.get('service'),30),LEAD_SERVICES,'consultation');
 const source=pick(clean(f.get('lead_source'),40),LEAD_SOURCES,'other');
 const preferred=pick(clean(f.get('preferred_contact'),20),['whatsapp','telegram','call'],'whatsapp');
 const payload=parsePayload(f.get('payload'));
 const values={
  name,phone,telegram:clean(f.get('telegram'),100),preferred,contactTime:clean(f.get('contact_time'),80),language,brand,markType,
  service,stage:clean(f.get('stage'),120),activity:clean(f.get('activity'),2500),geography:clean(f.get('geography'),500),
  urgency:clean(f.get('urgency'),120),comment:clean(f.get('comment'),3000),website:clean(f.get('website'),300),
  source,utmSource:clean(f.get('utm_source'),300),utmMedium:clean(f.get('utm_medium'),300),utmCampaign:clean(f.get('utm_campaign'),300),
  utmContent:clean(f.get('utm_content'),300),utmTerm:clean(f.get('utm_term'),300),referrer:clean(f.get('referrer'),1000),payload,ip:ipHash(req)
 };
 const publicId=await tx(async c=>{
  const r=await c.query(`INSERT INTO leads(name,phone,telegram,preferred_contact,contact_time,language,brand,mark_type,logo_name,logo_mime,logo_bytes,service,stage,activity,geography,urgency,comment,website,lead_source,utm_source,utm_medium,utm_campaign,utm_content,utm_term,referrer,payload,ip_hash)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27) RETURNING id`,
  [values.name,values.phone,values.telegram,values.preferred,values.contactTime,values.language,values.brand,values.markType,upload?.name||null,upload?.mime||null,upload?.bytes||null,values.service,values.stage,values.activity,values.geography,values.urgency,values.comment,values.website,values.source,values.utmSource,values.utmMedium,values.utmCampaign,values.utmContent,values.utmTerm,values.referrer,JSON.stringify(values.payload),values.ip]);
  const id=r.rows[0].id;
  const u=await c.query(`UPDATE leads SET public_id='NQ-'||to_char(created_at AT TIME ZONE 'Asia/Almaty','YYMMDD')||'-'||lpad(id::text,3,'0') WHERE id=$1 RETURNING public_id`,[id]);
  return u.rows[0].public_id;
 });
 return json({ok:true,id:publicId},201);
 }catch(e){console.error('NUQTE lead error',e.code||e.name);return json({error:e.status?e.message:'Не удалось отправить заявку. Попробуйте позже.'},e.status||500);}}
