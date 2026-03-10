import SessionWrapper from '../components/ui/SessionWrapper';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import AIChat from '../components/ui/AIChat';

export default function PublicLayout({ children }) {
    return (
        <SessionWrapper>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <AIChat />
        </SessionWrapper>
    );
}