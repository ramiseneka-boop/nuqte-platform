import {NextResponse} from 'next/server';import {validAdminPassword,adminSession,adminConfigured,ADMIN_COOKIE,rateLimit,sameOrigin} from '@/lib/leads.mjs';
export const runtime='nodejs';
export async function POST(req){try{
 if(!sameOrigin(req))return NextResponse.json({error:'Недопустимый источник запроса.'},{status:403});
 await rateLimit(req,12);
 if(!adminConfigured())return NextResponse.json({error:'Админ-доступ не настроен.'},{status:503});
 const b=await req.json();if(!validAdminPassword(b.password))return NextResponse.json({error:'Неверный пароль.'},{status:401});
 const r=NextResponse.json({ok:true});r.cookies.set(ADMIN_COOKIE,adminSession(),{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:60*60*12});return r;
}catch(e){console.error('NUQTE admin login failed',e);return NextResponse.json({error:'Не удалось выполнить вход.',code:e?.code||'unknown'},{status:400});}}
