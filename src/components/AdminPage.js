import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/adminpage.css";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [data, setData] = useState([]);
  const  navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState("");
  const [newProduct, setNewProduct] = useState("");

  const handleGoBack = ()=>{
    navigate("/");
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("https://athul-colors-backend-hc6a.vercel.app/api/admin");
        console.log(response);
        setData(response.data);

      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    
    fetchUserDetails();
  }, []);
  
  function fetchProducts(){
    axios.get("https://athul-colors-backend-hc6a.vercel.app/api/products").then(res=>setProducts(res.data));
  }

  useEffect(()=>{
    fetchProducts();
  },[]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://athul-colors-backend-hc6a.vercel.app/api/products", { name: newProduct });
      setProducts(prev => [...prev, data]);
      setNewProduct("");
      toast.success("Product added!");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 409) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Unexpected server error.");
      }
    }
  };  
  
  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    try {
      // Find the product object you want to delete
      const toDelete = products.find(p => p.name === deleteProduct);   
      await axios.delete(`https://athul-colors-backend-hc6a.vercel.app/api/products/${toDelete._id}`);
      toast.success("Product deleted successfully!")
      // Ideally re-fetch or update products state here
      fetchProducts();
      setNewProduct("")
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDelete = async (id, id1) => {
    try {
      await axios.delete(`https://athul-colors-backend-hc6a.vercel.app/api/order/${id}`);
      await axios.delete(`https://athul-colors-backend-hc6a.vercel.app/api/user/${id1}`);
      toast.success("Deleted the order successfully!");
      setData(data.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete the order.");
    }
  };

  return (
    <>
      <div className="table-container">
        <h2 className="table-heading">Order Information</h2>
        {data.length > 0 ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Order Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{item.userName}</td>
                  <td>{item.email}</td>
                  <td>
                    {Array.isArray(item.orders) ? (
                      <ul>
                        {item.orders.map((order, idx) => (
                          <li key={idx}>
                            {order.productName}: {order.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>{JSON.stringify(item.orders)}</span> // Handle other cases
                    )}
                  </td>
                  <td className="action-cell">
                    <button className="delete-button" onClick={() => handleDelete(item._id, item.userId)}>
                      Mark Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-orders">No orders available</p>
        )}
      </div>

      <button onClick={handleGoBack} className="go-back-button">Logout</button>

      <div className="product-table container">
        <h2>Available Products</h2>
        {products.length > 0 ?  (
            <table className="product-table">
              <thead>
                <th>Products</th>
              </thead>
              <tbody>
                {products.map(item => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )
        : <p>No products Available</p>}
      </div>
      <div className="add-product-card">
  <h3>Add New Product</h3>
  <form onSubmit={handleCreateProduct}>
    <input
      type="text"
      placeholder="Enter product name"
      value={newProduct}
      onChange={e => setNewProduct(e.target.value)}
      required
    />
    <button type="submit">Add Product</button>
  </form>
</div>

<div className="delete-product-card">
  <h3>Remove a Product</h3>
  <form onSubmit={handleDeleteProduct}>
    <select
      value={deleteProduct}
      onChange={e => setDeleteProduct(e.target.value)}
      required
    >
      <option value="">Select a product…</option>
      {products.map(p => (
        <option key={p._id} value={p.name}>{p.name}</option>
      ))}
    </select>
    <button type="submit">Delete Product</button>
  </form>
</div>


    </>
  );
}