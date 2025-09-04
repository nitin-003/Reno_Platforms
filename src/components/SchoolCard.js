export default function SchoolCard({ school }) {
  const getImageSrc = () => {
    if (!school.image) {
      return '/placeholder-school.jpg';
    }

    // If image starts with 'https://', it's a Cloudinary URL
    if (school.image.startsWith('https://')) {
      return school.image;
    }

    // Otherwise, it's a local file
    return `/schoolImages/${school.image}`;
  };

  return (
    <div className="school-card">
      <img 
        src={getImageSrc()} 
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

