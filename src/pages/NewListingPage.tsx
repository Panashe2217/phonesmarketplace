import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { validateListing, type ListingFormData, type ValidationErrors } from "../lib/validation";

const initialFormState: ListingFormData = {
  title: "",
  price: "",
  condition: "Used - Good",
  brand: "",
  location: "",
  contact: "",
};

export default function NewListingPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ListingFormData>(initialFormState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for images
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ListingFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files).slice(0, 4);
    setPhotos(selectedFiles);
    
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const validationErrors = validateListing(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload photos
      const uploadedPaths: string[] = [];

      for (const file of photos) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("listing-photos")
          .upload(fileName, file);

        if (uploadError) {
          throw new Error("Failed to upload image: " + uploadError.message);
        }

        uploadedPaths.push(fileName);
      }

      // 2. Insert the database row
      const { data, error: dbError } = await supabase
        .from("listings")
        .insert({
          title: formData.title.trim(),
          price: Number(formData.price),
          condition: formData.condition,
          brand: formData.brand.trim(),
          location: formData.location.trim(),
          contact: formData.contact.trim(),
          photos: uploadedPaths,
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);
      
      if (data) {
        navigate(`/listings/${data.id}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-page">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>Post a new listing</h1>
        <button 
          onClick={() => {
            localStorage.removeItem("admin_token");
            window.location.href = "/";
          }}
          style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontWeight: "bold" }}
        >
          Logout
        </button>
      </div>
      <h1>Post a new listing</h1>
      
      <form onSubmit={handleSubmit} className="listing-form" noValidate>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} placeholder="e.g. iPhone 13 Pro 128GB" />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="450" />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select id="condition" name="condition" value={formData.condition} onChange={handleChange}>
              <option value="New">New</option>
              <option value="Used - Like New">Used - Like New</option>
              <option value="Used - Good">Used - Good</option>
              <option value="Used - Fair">Used - Fair</option>
              <option value="For Parts">For Parts</option>
            </select>
            {errors.condition && <span className="error-text">{errors.condition}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input id="brand" name="brand" type="text" value={formData.brand} onChange={handleChange} placeholder="e.g. Apple, Samsung" />
          {errors.brand && <span className="error-text">{errors.brand}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} placeholder="e.g. Dublin" />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Info</label>
          <input id="contact" name="contact" type="text" value={formData.contact} onChange={handleChange} placeholder="e.g. email or phone number" />
          {errors.contact && <span className="error-text">{errors.contact}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="photos">Photos (Max 4)</label>
          <input 
            id="photos"
            type="file" 
            accept="image/*" 
            multiple 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input"
          />
          
          {previews.length > 0 && (
            <div className="preview-grid">
              {previews.map((url, i) => (
                <img key={i} src={url} alt={`Preview ${i + 1}`} className="preview-img" />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Listing"}
        </button>

      </form>
    </div>
  );
}