import SessionWrapper from './components/ui/SessionWrapper';
import './globals.css';

export const metadata = {
  title: 'Chakri Khujhi — Find Your Dream Job in Bangladesh',
  description: 'Bangladesh\'s modern job board platform connecting top talent with leading companies.',
  keywords: ['jobs', 'career', 'bangladesh', 'recruitment', 'hiring'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <SessionWrapper>

            {children}
          </SessionWrapper>
        </div>
      </body>
    </html>
  );
}
