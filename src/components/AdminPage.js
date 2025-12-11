import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/adminpage.css";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", hex: "#000000" });

  const handleHome = () => {
    navigate("/");
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.isAdmin) {
      toast.error("Access denied. Admins only.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin`);
        console.log(response);
        setData(response.data);

      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  function fetchProducts() {
    axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/products`, newProduct);
      setProducts(prev => [...prev, data]);
      setNewProduct({ name: "", hex: "#000000" });
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
      await axios.delete(`${API_URL}/products/${toDelete._id}`);
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
      await axios.delete(`${API_URL}/order/${id}`);
      // await axios.delete(`${API_URL}/user/${id1}`); // Do not delete the user when completing an order
      toast.success("Order marked as complete!");
      setData(data.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to update status.");
    }
  };


  // --- Pagination Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <>
      {/* 1. Header Section */}
      <div className="header-section">
        <h1 className="header-title">Order Management</h1>
        <div className="header-buttons">
          <button onClick={handleHome} className="btn-home">Home</button>
          <button onClick={handleLogout} className="btn-logout">Sign Out</button>
        </div>
      </div>

      <div className="main-wrapper">

        {/* 2. Management Cards Section (Top) */}
        <div className="product-management-section">

          {/* Card 1: Add New Pigment */}
          <div className="admin-card">
            <h3>Add New Pigment</h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Pigment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Blue"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Color Hex Code</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="color"
                    value={newProduct.hex}
                    onChange={e => setNewProduct({ ...newProduct, hex: e.target.value })}
                    style={{ width: '40px', height: '38px', padding: 0, border: 'none', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <input
                    type="text"
                    value={newProduct.hex}
                    onChange={e => setNewProduct({ ...newProduct, hex: e.target.value })}
                    pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                    style={{ flexGrow: 1, fontFamily: 'monospace' }}
                  />
                </div>
              </div>
              <button type="submit" style={{
                background: '#0F172A', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 500, marginTop: '8px'
              }}>Add to Inventory</button>
            </form>
          </div>

          {/* Card 2: Inventory Management */}
          <div className="admin-card">
            <h3>Inventory Management</h3>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Delete Product</label>
              <form onSubmit={handleDeleteProduct} style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={deleteProduct}
                  onChange={e => setDeleteProduct(e.target.value)}
                  required
                >
                  <option value="">Select product...</option>
                  {products.map(p => (
                    <option key={p._id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <button type="submit" style={{
                  background: '#EF4444', color: 'white', border: 'none', padding: '0 16px', borderRadius: '6px', fontWeight: 500
                }}>Delete</button>
              </form>
            </div>

            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#6B7280' }}>Current Stock</h4>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '12px',
              maxHeight: '120px', overflowY: 'auto', paddingRight: '4px'
            }}>
              {products.map(p => (
                <div key={p._id} title={p.name} style={{
                  height: '40px', borderRadius: '6px',
                  background: p.hex || (p.name.startsWith('#') ? p.name : '#ccc'),
                  border: '1px solid #E5E7EB', cursor: 'help'
                }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Orders Section */}
        <div className="orders-section">
          <h2 className="section-title">Recent Orders</h2>
          <div className="table-wrapper">
            {data.length > 0 ? (
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Order Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((item, index) => (
                    <tr key={item._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                      <td>{item.userName}</td>
                      <td>{item.email}</td>
                      <td>{item.phoneNumber || "N/A"}</td>
                      <td>
                        {Array.isArray(item.orders) && item.orders.length > 0 ? (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {item.orders.map((order, idx) => (
                              <span key={idx} style={{
                                background: '#F3F4F6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #E5E7EB'
                              }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: order.productName.startsWith('#') ? order.productName : '#9CA3AF' }}></span>
                                {order.productName} <strong style={{ marginLeft: '4px' }}>x{order.quantity}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#9CA3AF' }}>No items</span>
                        )}
                      </td>
                      <td>
                        <button className="delete-button" onClick={() => handleDelete(item._id, item.userId)}>
                          Mark Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>No orders found.</div>
            )}
          </div>

          {/* 4. Pagination */}
          {data.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-controls">
                <button className="page-btn" onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="page-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
              </div>
              <div className="pagination-info">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)} of {data.length} orders
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}