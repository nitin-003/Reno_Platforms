'use client';

import { useState, useEffect } from 'react';
import SchoolCard from '../../components/SchoolCard';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schools');
      const data = await response.json();

      if (response.ok) {
        setSchools(data.schools);
      } else {
        setError(data.error || 'Failed to fetch schools');
      }
    } catch (error) {
      setError('Error fetching schools. Please try again.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>⏳ Loading schools...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message" style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center' }}>
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Our Schools</h1>
      
      {schools.length === 0 ? (
        <div className="no-schools">
          <p>📚 No schools found. <a href="/addSchool">Add the first school</a>!</p>
        </div>
      ) : (
        <>
          <p style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            color: '#64748b',
            fontSize: '1.1rem' 
          }}>
            Found {schools.length} school{schools.length !== 1 ? 's' : ''}
          </p>
          <div className="schools-grid">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


