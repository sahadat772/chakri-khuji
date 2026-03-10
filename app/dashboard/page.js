import { auth } from '../lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    if (session.user.role === 'company') {
        redirect('/dashboard/company');
    } else {
        redirect('/dashboard/candidate');
    }
}