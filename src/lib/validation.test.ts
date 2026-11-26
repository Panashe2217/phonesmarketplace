import { describe, it, expect } from "vitest";
import { validateListing } from "./validation";

describe("validateListing", () => {
  it("returns errors if required fields are missing", () => {
    const errors = validateListing({
      title: "",
      price: "",
      condition: "",
      brand: "",
      location: "",
      contact: "",
    });

    // Expect errors for all required fields
    expect(errors.title).toBe("Title is required");
    expect(errors.brand).toBe("Brand is required");
    expect(errors.location).toBe("Location is required");
    expect(errors.contact).toBe("Contact info is required");
    expect(errors.price).toBe("Price is required");
    expect(errors.condition).toBe("Please select a condition");
  });

  it("returns an error if price is not a valid number", () => {
    const errors = validateListing({
      title: "iPhone 13",
      price: "abc", // Not a number!
      condition: "Used",
      brand: "Apple",
      location: "Dublin",
      contact: "email@test.com",
    });

    expect(errors.price).toBe("Price must be a valid positive number");
    expect(errors.title).toBeUndefined(); // Title is valid, so no error
  });

  it("returns NO errors for a perfectly valid submission", () => {
    const errors = validateListing({
      title: "iPhone 13 Pro",
      price: "450.00",
      condition: "Used - Good",
      brand: "Apple",
      location: "Harare",
      contact: "0771234567",
    });

    // The errors object should be completely empty
    expect(Object.keys(errors).length).toBe(0);
  });
});