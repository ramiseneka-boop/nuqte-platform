import Nuqte from '../nuqte';
import { notFound } from 'next/navigation';
const routes = ['check', 'services', 'pricing', 'process', 'about', 'cabinet', 'order', 'privacy'];
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
 const { section } = await params;
 if (!routes.includes(section)) notFound();
 return <Nuqte view={section} />;
}
