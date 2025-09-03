'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('state', data.state);
      formData.append('contact', data.contact);
      formData.append('email_id', data.email_id);
      
      // Add image if selected
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('School added successfully! 🎉');
        reset(); // Clear form
      } else {
        setSubmitMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setSubmitMessage('Failed to add school. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="form-title">Add New School</h1>
        
        {submitMessage && (
          <div className={submitMessage.includes('successfully') ? 'success-message' : 'error-message'}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">School Name *</label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter school name"
              {...register('name', { 
                required: 'School name is required',
                minLength: { 
                  value: 2, 
                  message: 'School name must be at least 2 characters' 
                },
                maxLength: {
                  value: 100,
                  message: 'School name must not exceed 100 characters'
                }
              })}
            />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Address *</label>
            <textarea
              className={`form-input ${errors.address ? 'error' : ''}`}
              rows="3"
              placeholder="Enter complete address"
              {...register('address', { 
                required: 'Address is required',
                minLength: { 
                  value: 10, 
                  message: 'Address must be at least 10 characters' 
                }
              })}
            />
            {errors.address && <p className="error-message">{errors.address.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">City *</label>
            <input
              type="text"
              className={`form-input ${errors.city ? 'error' : ''}`}
              placeholder="Enter city name"
              {...register('city', { 
                required: 'City is required',
                minLength: { 
                  value: 2, 
                  message: 'City must be at least 2 characters' 
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'City should only contain letters and spaces'
                }
              })}
            />
            {errors.city && <p className="error-message">{errors.city.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">State *</label>
            <input
              type="text"
              className={`form-input ${errors.state ? 'error' : ''}`}
              placeholder="Enter state name"
              {...register('state', { 
                required: 'State is required',
                minLength: { 
                  value: 2, 
                  message: 'State must be at least 2 characters' 
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'State should only contain letters and spaces'
                }
              })}
            />
            {errors.state && <p className="error-message">{errors.state.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number *</label>
            <input
              type="tel"
              className={`form-input ${errors.contact ? 'error' : ''}`}
              placeholder="Enter 10-digit contact number"
              {...register('contact', { 
                required: 'Contact number is required',
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Please enter a valid 10-digit Indian mobile number'
                }
              })}
            />
            {errors.contact && <p className="error-message">{errors.contact.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className={`form-input ${errors.email_id ? 'error' : ''}`}
              placeholder="Enter email address"
              {...register('email_id', { 
                required: 'Email address is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email address'
                }
              })}
            />
            {errors.email_id && <p className="error-message">{errors.email_id.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">School Image (Optional)</label>
            <input
              type="file"
              className={`form-input ${errors.image ? 'error' : ''}`}
              accept="image/jpeg,image/jpg,image/png,image/gif"
              {...register('image', {
                validate: {
                  fileSize: (files) => {
                    if (files[0] && files[0].size > 5000000) {
                      return 'Image size must be less than 5MB';
                    }
                    return true;
                  },
                  fileType: (files) => {
                    if (files[0] && !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(files[0].type)) {
                      return 'Only JPEG, PNG, and GIF images are allowed';
                    }
                    return true;
                  }
                }
              })}
            />
            {errors.image && <p className="error-message">{errors.image.message}</p>}
            <small style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Supported formats: JPEG, PNG, GIF (Max size: 5MB)
            </small>
          </div>

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? '⏳ Adding School...' : '✅ Add School'}
          </button>
        </form>
      </div>
    </div>
  );
}



