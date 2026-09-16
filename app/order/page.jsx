import {redirect} from 'next/navigation';export default async function Page({searchParams}){const p=await searchParams;redirect('/workspace?new='+(p.service==='rights'?'bridge':'trademark'));}
