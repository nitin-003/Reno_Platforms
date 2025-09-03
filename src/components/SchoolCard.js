export default function SchoolCard({ school }) {
  const imageSrc = school.image 
    ? `/schoolImages/${school.image}` 
    : '/placeholder-school.jpg';

  return (
    <div className="school-card">
      <img 
        src={imageSrc} 
        alt={school.name}
        className="school-image"
        onError={(e) => {
          e.target.src = '/placeholder-school.jpg';
        }}
      />
      <div className="school-info">
        <h3 className="school-name">{school.name}</h3>
        <p className="school-address">{school.address}</p>
        <p className="school-city">{school.city}, {school.state}</p>
      </div>
    </div>
  );
}

