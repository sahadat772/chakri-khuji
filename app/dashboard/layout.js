import { auth } from '../lib/auth';
import { redirect } from 'next/navigation';
import SessionWrapper from '../components/ui/SessionWrapper';
import Navbar from '../components/ui/Navbar';
import AIChat from '../components/ui/AIChat';

export default async function DashboardLayout({ children }) {
    const session = await auth();
    if (!session) redirect('/login');

    return (
        <SessionWrapper>
            <Navbar />
            <main style={{ minHeight: '100vh', paddingTop: '5rem' }}>
                {children}
            </main>
            <AIChat/>
        </SessionWrapper>
    );
}