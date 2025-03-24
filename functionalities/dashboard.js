import { db } from "../config";


// Event listener to the product form to handle form submission
document
  .getElementById("productForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the values from the form input
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value;
    const category = document.getElementById("productCategory").value;
    const imageInput = document.getElementById("productImage");

    // Validate all fields are filled
    if (!name || !price || !category || imageInput.files.length === 0) {
      alert("Please fill in all fields");
      return;
    }

    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(imageInput.files[0]);

    // Upload product data to Firestore
    db.collection("products")
      .add({
        name: name,
        description: description,
        price: price,
        category: category,
        imageUrl: imageUrl, // Store the image URL (or upload to Firebase Storage for full functionality)
        // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Product added with ID: ", docRef.id);

        // Add the product to the DOM
        addProductToDOM(docRef.id, name, description, price, imageUrl);

        // Reset the form after submission
        document.getElementById("productForm").reset();
      })
      .catch((error) => {
        console.error("Error adding product: ", error);
        alert("Error adding product. Please try again.");
      });
  });

// Function to add a product to the DOM
function addProductToDOM(productId, name, description, price, imageUrl) {
  const productList = document.getElementById("product-list");
  const productItem = document.createElement("div");
  productItem.classList.add("product-item");
  productItem.setAttribute("data-id", productId); // Store Firestore document ID for later reference

  // Set the inner HTML of the new product item
  productItem.innerHTML = `
      <img src="${imageUrl}" alt="${name}" class="product-image">
      <div class="details">
        <p><strong>Name:</strong> <span class="name">${name}</span></p>
        <p><strong>Price:</strong> <span class="price">KES ${price}</span></p>
        <p><strong>Description:</strong> <span class="description">${description}</span></p>
        <div class="alter">
          <button class="edit-btn">Edit</button>
          <button class="remove-btn">Remove</button>
        </div>
      </div>
    `;

  productList.appendChild(productItem);

  // Edit functionality
  productItem.querySelector(".edit-btn").addEventListener("click", function () {
    editProduct(productItem);
  });

  // Remove functionality
  productItem
    .querySelector(".remove-btn")
    .addEventListener("click", function () {
      removeProduct(productItem);
    });
}

// Function to edit a product
function editProduct(productItem) {
  const nameSpan = productItem.querySelector(".name");
  const priceSpan = productItem.querySelector(".price");
  const descriptionSpan = productItem.querySelector(".description");

  const newName = prompt("Edit Product Name:", nameSpan.textContent);
  const newPrice = prompt(
    "Edit Product Price:",
    priceSpan.textContent.replace("KES ", "")
  );
  const newDescription = prompt(
    "Edit Product Description:",
    descriptionSpan.textContent
  );

  // Update the new values in Firestore
  if (newName !== null && newName.trim() !== "") {
    db.collection("products")
      .doc(productItem.getAttribute("data-id"))
      .update({
        name: newName,
        price: newPrice,
        description: newDescription,
      })
      .then(() => {
        nameSpan.textContent = newName;
        priceSpan.textContent = `KES ${newPrice}`;
        descriptionSpan.textContent = newDescription;
        alert("Product updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating product: ", error);
        alert("Error updating product. Please try again.");
      });
  }
}

// Function to remove a product
function removeProduct(productItem) {
  const confirmDelete = confirm(
    "Are you sure you want to remove this product?"
  );
  if (confirmDelete) {
    db.collection("products")
      .doc(productItem.getAttribute("data-id"))
      .delete()
      .then(() => {
        productItem.remove(); // Remove the product from the DOM
        alert("Product removed successfully.");
      })
      .catch((error) => {
        console.error("Error removing product: ", error);
        alert("Error removing product. Please try again.");
      });
  }
}
