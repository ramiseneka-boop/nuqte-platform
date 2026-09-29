import {NextResponse} from 'next/server';import {ADMIN_COOKIE} from '@/lib/leads.mjs';
export async function POST(){const r=NextResponse.json({ok:true});r.cookies.set(ADMIN_COOKIE,'',{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:0});return r;}
