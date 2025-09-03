import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'School Management System',
  description: 'Add and manage schools with ease',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <Link href="/" className="nav-brand">
              🏫 School Management
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/addSchool">Add School</Link>
              </li>
              <li>
                <Link href="/showSchools">View Schools</Link>
              </li>
            </ul>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}


