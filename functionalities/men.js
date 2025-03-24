import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { db } from "../config";

// Function to fetch products by category
async function fetchProductsByCategory() {
  try {
    // Reference to the "products" collection
    const productsCollection = collection(db, "products");

    // Create a query to filter products by category
    const productsQuery = query(
      productsCollection,
      where("category", "==", "men")
    );

    // Execute the query
    const querySnapshot = await getDocs(productsQuery);

    // Array to store fetched products
    const products = [];

    // Loop through the query snapshot and add products to the array
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Get the product grid container from the DOM
    const productGrid = document.getElementById("product-grid");

    // Clear the grid before adding new products
    productGrid.innerHTML = "";

    // Loop through the products and create HTML cards for each product
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="image">
        <h3>${product.name}</h3>
        <h3>KES ${product.price}</h3>
        <button class="view-product-btn" data-id="${product.id}">More Info</button>
      `;
      productGrid.appendChild(card);
    });

    // Add event listener for "More Info" buttons
    productGrid.addEventListener("click", async (event) => {
      if (event.target.classList.contains("view-product-btn")) {
        const productId = event.target.getAttribute("data-id");
        const product = products.find((p) => p.id === productId);
        if (product) {
          await showProductModal(product);
        }
      }
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to fetch seller's WhatsApp number
async function fetchSellerWhatsAppNumber(sellerId) {
  try {
    const userDocRef = doc(db, "users", sellerId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data().whatsappNumber; // Return the seller's WhatsApp number
    } else {
      console.error("Seller not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching seller's WhatsApp number:", error);
    return null;
  }
}

// Function to show product details in a modal
async function showProductModal(product) {
  const modal = document.getElementById("productModal");
  const modalBody = document.querySelector(".modal-body");

  // Fetch the seller's WhatsApp number
  const sellerWhatsAppNumber = await fetchSellerWhatsAppNumber(
    product.sellerId
  );

  // Populate the modal with product details
  modalBody.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
    <h1 class="product-title">${product.name}</h1>
    <p class="product-price">KES ${product.price}</p>
    <p class="product-description">${
      product.description || "No description available."
    }</p>
    <button class="contact-seller-btn" ${
      sellerWhatsAppNumber
        ? `onclick="window.location.href='https://wa.me/${sellerWhatsAppNumber}?text=I+am+interested+in+*${encodeURIComponent(
            product.name
          )}*+ of cost *KES+${product.price}* + posted on _ShopIt_'"`
        : "disabled"
    }>Contact Seller</button>
  `;

  modal.style.display = "block";

  // Close the modal when the close button is clicked
  const closeModal = document.querySelector(".close-modal");
  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  // Close the modal when clicking outside the modal
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

// Call the function to fetch and display products
fetchProductsByCategory();
