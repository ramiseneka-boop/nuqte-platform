import {NextResponse} from 'next/server';import {validAdminPassword,adminSession,adminConfigured,ADMIN_COOKIE} from '@/lib/leads.mjs';
export const runtime='nodejs';
export async function POST(req){try{
 if(!adminConfigured())return NextResponse.json({error:'Админ-доступ не настроен.'},{status:503});
 const b=await req.json();if(!validAdminPassword(b.password))return NextResponse.json({error:'Неверный пароль.'},{status:401});
 const r=NextResponse.json({ok:true});r.cookies.set(ADMIN_COOKIE,adminSession(),{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:60*60*12});return r;
}catch{return NextResponse.json({error:'Не удалось выполнить вход.'},{status:400});}}
