import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero-section">
      <div className="container">
        <h1 className="hero-title">
          School Management System
        </h1>
        <p className="hero-description">
          Easily manage and organize school information with our comprehensive system. 
          Add new schools with detailed information and browse through all registered schools.
        </p>
        <div className="hero-buttons">
          <Link href="/addSchool">
            <button className="btn">
              ➕ Add New School
            </button>
          </Link>
          <Link href="/showSchools">
            <button className="btn">
              👁️ View All Schools
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}


