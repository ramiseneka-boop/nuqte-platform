export const services={scan:'Проверка товарного знака',trademark:'Регистрация товарного знака',bridge:'Передача прав на товарный знак'};
export const statuses={new:'Новая заявка',review:'Проверка специалистом',documents:'Документы',ready:'Готово к подаче',submitted:'Подано в Казпатент',formal:'Предварительная экспертиза',publication:'Публикация',examination:'Полная экспертиза',approved:'Положительное решение',completed:'Завершено',action_required:'Нужны уточнения',cancelled:'Отменено'};
export const roles={client:'Клиент',partner:'Партнёр',sales:'Менеджер',legal:'Юрист',admin:'Администратор'};
export const staff=r=>['admin','legal','sales'].includes(r);
export const canRead=(u,c)=>u.role==='admin'||c.owner_id===u.id||(staff(u.role)&&c.assignee_id===u.id);
const paths={scan:['new','review','completed'],trademark:['new','review','documents','ready','submitted','formal','publication','examination','approved','completed'],bridge:['new','review','documents','ready','submitted','examination','approved','completed']};
export function nextStatuses(service,status){if(['completed','cancelled'].includes(status))return [];if(status==='action_required')return ['review','documents','cancelled'];const p=paths[service]||[],i=p.indexOf(status);return [...(i>=0&&i<p.length-1?[p[i+1]]:[]),'action_required','cancelled'];}
export function transition(u,c,next,evidence,filing){
 if(!staff(u.role)||!canRead(u,c))throw Error('Недостаточно прав');
 if(!nextStatuses(c.service,c.status).includes(next))throw Error('Недопустимая смена стадии');
 const official=['submitted','formal','publication','examination','approved','completed'].includes(next);
 if(official&&(!['legal','admin'].includes(u.role)||!evidence||evidence.internal))throw Error('Требуются юрист и подтверждающий документ, доступный клиенту');
 if(next==='submitted'&&(!filing||evidence.kind!=='filing'))throw Error('Укажите официальный номер и подтверждение подачи');
 if(next==='completed'&&evidence.kind!==(c.service==='scan'?'report':'certificate'))throw Error('Требуется итоговый отчёт, свидетельство или выписка');
}
export const validClasses=a=>Array.isArray(a)&&a.length<=45&&a.every(x=>Number.isInteger(x)&&x>=1&&x<=45)&&new Set(a).size===a.length;
export function mime(b){if(b.subarray(0,5).toString()==='%PDF-')return 'application/pdf';if(b.subarray(0,8).toString('hex')==='89504e470d0a1a0a')return 'image/png';if(b[0]===255&&b[1]===216&&b[2]===255)return 'image/jpeg';return null;}
