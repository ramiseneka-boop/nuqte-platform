'use client';
import Link from 'next/link';
import {useState} from 'react';
import {FolderOpen,FileText,Bell,Wallet,Settings,LayoutDashboard,Users,ArrowUpRight,Plus} from 'lucide-react';
import './cabinet.css';

const cases=[
 {name:'NUQTE',service:'Проверка товарного знака',status:'На проверке'},
 {name:'Pabliki.kz',service:'Регистрация товарного знака',status:'Подготовка заявки'},
 {name:'SENEKA GROUP',service:'Передача прав',status:'Нужны документы'},
];

export default function Cabinet(){
 const [view,setView]=useState('overview');
 const nav=[['overview','Обзор',LayoutDashboard],['cases','Мои дела',FolderOpen],['documents','Документы',FileText],['notifications','Уведомления',Bell],['finance','Оплаты',Wallet],['profile','Профиль',Settings]];
 return <div className="nq-cabinet">
  <aside>
   <Link href="/" className="logo">NUQTE</Link>
   <div className="role">Личный кабинет</div>
   <nav>{nav.map(([key,label,Icon])=><button key={key} className={view===key?'active':''} onClick={()=>setView(key)}><Icon size={17}/>{label}</button>)}</nav>
   <Link href="/workspace" className="back"><Users size={17}/>CRM NUQTE</Link>
   <Link href="/" className="back">← На сайт</Link>
  </aside>
  <main>
   <header><strong>Рабочее пространство NUQTE</strong><span className="status">Предпросмотр кабинета</span></header>
   {view==='overview'&&<>
    <h1>Все дела бренда<br/>в одном месте.</h1><p className="lead">Заявки, документы, статусы и коммуникация со специалистом NUQTE.</p>
    <div className="stats"><div className="panel stat"><small>Всего дел</small><strong>3</strong></div><div className="panel stat"><small>В работе</small><strong>3</strong></div><div className="panel stat"><small>Нужны действия</small><strong>1</strong></div></div>
    <div className="grid"><section className="panel"><h2>Последние дела</h2>{cases.map(c=><div className="case" key={c.name}><strong>{c.name}</strong><span>{c.service}</span><span className="badge">{c.status}</span></div>)}</section><section className="panel"><h2>Быстрые действия</h2><div className="quick"><Link href="/check"><Plus size={17}/> Новая проверка</Link><Link href="/order?service=registration">Регистрация знака</Link><Link href="/order?service=rights">Передача прав</Link><Link href="/workspace">Открыть CRM</Link></div></section></div>
    <section className="panel crm"><h2>CRM NUQTE</h2><p>Отдельная рабочая зона для сотрудников: дела, ответственные, задачи, переписка, документы, статусы и управление заявками.</p><Link href="/workspace">Открыть CRM <ArrowUpRight size={17}/></Link></section>
    <div className="note">Боевой вход, постоянное хранение данных и реальные роли пользователей подключаются после настройки защищённой базы и почтовой авторизации. Интерфейс кабинета и CRM уже доступен для просмотра.</div>
   </>}
   {view==='cases'&&<><h2 className="section-title">Мои дела</h2><div className="list">{cases.map(c=><div className="panel" key={c.name}><div><strong>{c.name}</strong><div className="muted">{c.service}</div></div><span className="badge">{c.status}</span></div>)}</div></>}
   {view==='documents'&&<><h2 className="section-title">Документы</h2><div className="list"><div className="panel"><div><strong>Черновик заявки NUQTE</strong><div className="muted">PDF · подготовлен</div></div><span>Открыть ↗</span></div><div className="panel"><div><strong>Логотип Pabliki.kz</strong><div className="muted">PNG · приложен</div></div><span>Открыть ↗</span></div></div></>}
   {view==='notifications'&&<><h2 className="section-title">Уведомления</h2><div className="list"><div className="panel"><div><strong>По делу Pabliki.kz требуется уточнение перечня услуг</strong><div className="muted">Сегодня</div></div></div><div className="panel"><div><strong>Проверка NUQTE принята в работу</strong><div className="muted">Вчера</div></div></div></div></>}
   {view==='finance'&&<><h2 className="section-title">Оплаты</h2><div className="panel"><strong>Онлайн-оплата пока не подключена</strong><p className="muted">После подключения платёжного шлюза здесь появятся счета, платежи и история операций.</p></div></>}
   {view==='profile'&&<><h2 className="section-title">Профиль</h2><div className="panel"><strong>Профиль клиента</strong><p className="muted">Имя, компания, email и настройки уведомлений будут привязаны после подключения авторизации.</p></div></>}
  </main>
 </div>;
}
