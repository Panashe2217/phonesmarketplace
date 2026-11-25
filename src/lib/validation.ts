export type ListingFormData = {
  title: string;
  price: string; // keeping as string for the input, will parse to number
  condition: string;
  brand: string;
  location: string;
  contact: string;
};

export type ValidationErrors = Partial<Record<keyof ListingFormData, string>>;

export function validateListing(data: ListingFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.title.trim()) errors.title = "Title is required";
  if (!data.brand.trim()) errors.brand = "Brand is required";
  if (!data.location.trim()) errors.location = "Location is required";
  if (!data.contact.trim()) errors.contact = "Contact info is required";

  if (!data.price.trim()) {
    errors.price = "Price is required";
  } else if (isNaN(Number(data.price)) || Number(data.price) < 0) {
    errors.price = "Price must be a valid positive number";
  }

  if (!data.condition) {
    errors.condition = "Please select a condition";
  }

  return errors;
}