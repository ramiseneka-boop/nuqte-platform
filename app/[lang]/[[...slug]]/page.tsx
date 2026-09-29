import type {Metadata} from 'next';import {notFound} from 'next/navigation';import PublicSite from '@/app/public-site';
const langs=['ru','kz'];const serviceSlugs=['scan','trademark','bridge'];const simple=['services','quiz','process','about','contacts','privacy','consent'];
function valid(slug:string[]){if(!slug.length)return true;if(slug.length===1&&simple.includes(slug[0]))return true;return slug.length===2&&slug[0]==='services'&&serviceSlugs.includes(slug[1]);}
function title(lang:string,slug:string[]){const kz=lang==='kz';if(!slug.length)return kz?'Қазақстанда тауар белгісін тіркеу — NUQTE':'Регистрация товарного знака в Казахстане — NUQTE';const k=slug.join('/');const map:any={
 'services':kz?'NUQTE қызметтері — тауар белгілері':'Услуги NUQTE — товарные знаки',
 'services/scan':kz?'Тауар белгісін алдын ала тексеру — NUQTE Scan':'Проверка товарного знака — NUQTE Scan',
 'services/trademark':kz?'Тауар белгісін тіркеу — NUQTE Trade Mark':'Регистрация товарного знака — NUQTE Trade Mark',
 'services/bridge':kz?'Тауар белгісіне құқықтарды беру — NUQTE Bridge':'Передача прав на товарный знак — NUQTE Bridge',
 'quiz':kz?'Қай қызмет қажет екенін анықтаңыз — NUQTE':'Подберите следующий шаг — квиз NUQTE',
 'process':kz?'NUQTE қалай жұмыс істейді':'Как работает NUQTE',
 'about':kz?'NUQTE туралы':'О NUQTE',
 'contacts':kz?'NUQTE байланыстары':'Контакты NUQTE',
 'privacy':kz?'Құпиялық саясаты — NUQTE':'Политика конфиденциальности — NUQTE',
 'consent':kz?'Дербес деректерді өңдеуге келісім — NUQTE':'Согласие на обработку персональных данных — NUQTE'};
 return map[k]||'NUQTE';
}
export async function generateMetadata({params}:{params:Promise<{lang:string;slug?:string[]}>}):Promise<Metadata>{const {lang,slug=[]}=await params;if(!langs.includes(lang)||!valid(slug))return {};const base='https://nuqte-platform-i28p.vercel.app';const path='/'+lang+(slug.length?'/'+slug.join('/'):'');const desc=lang==='kz'?'Қазақстанда тауар белгілерін тексеру, тіркеу және құқықтарды беру. NUQTE маманы өтінімді қарап, келесі қадамды түсіндіреді.':'Проверка, регистрация и передача прав на товарные знаки в Казахстане. Специалист NUQTE изучит заявку и подскажет следующий шаг.';return{title:title(lang,slug),description:desc,alternates:{canonical:base+path,languages:{'ru-KZ':base+'/ru/'+slug.join('/'),'kk-KZ':base+'/kz/'+slug.join('/')}},openGraph:{title:title(lang,slug),description:desc,url:base+path,siteName:'NUQTE',locale:lang==='kz'?'kk_KZ':'ru_KZ',type:'website',images:[{url:base+'/panorama-color.webp',width:2048,height:682,alt:'NUQTE'}]},twitter:{card:'summary_large_image',title:title(lang,slug),description:desc,images:[base+'/panorama-color.webp']}}}
export default async function Page({params}:{params:Promise<{lang:string;slug?:string[]}>}){const {lang,slug=[]}=await params;if(!langs.includes(lang)||!valid(slug))notFound();return <PublicSite lang={lang as 'ru'|'kz'} slug={slug}/>;}
