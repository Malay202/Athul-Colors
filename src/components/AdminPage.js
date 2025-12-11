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

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    const interval = setInterval(() => {
      fetchUserDetails();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
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

  const confirmAndDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await axios.delete(`${API_URL}/products/${product._id}`);
        toast.success("Product deleted successfully!");
        fetchProducts();
        if (deleteProduct === product.name) {
          setDeleteProduct("");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete product.");
      }
    }
  };



  // Mark order as Fulfilled (Completed)
  const handleFulfill = async (id) => {
    try {
      await axios.put(`${API_URL}/order/${id}/fulfill`);
      toast.success("Order fulfilled!");
      fetchUserDetails(); // Refresh data to show new status
    } catch (err) {
      console.error("Error fulfilling order:", err);
      toast.error("Failed to update status.");
    }
  };

  // Permanently Delete Order
  const handleDeletePermanently = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this order?")) {
      try {
        await axios.delete(`${API_URL}/order/${id}`);
        toast.success("Order deleted permanently.");
        setData(prev => prev.filter(item => item._id !== id));
      } catch (err) {
        console.error("Error deleting order:", err);
        toast.error("Failed to delete order.");
      }
    }
  };


  // --- Pagination Logic ---
  const [showFulfilled, setShowFulfilled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter Data
  const filteredData = data.filter(item =>
    showFulfilled ? item.status === 'Fulfilled' : item.status !== 'Fulfilled'
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
          <button
            onClick={() => { setShowFulfilled(prev => !prev); setCurrentPage(1); }}
            className="btn-home"
            style={{
              backgroundColor: showFulfilled ? '#64748b' : '#10B981',
              color: 'white',
              marginRight: '10px'
            }}
          >
            {showFulfilled ? 'Show Pending Orders' : 'Show Fulfilled Orders'}
          </button>
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
                <div
                  key={p._id}
                  title={`Select ${p.name}`}
                  onClick={() => setDeleteProduct(p.name)}
                  style={{
                    height: '40px', borderRadius: '6px',
                    background: p.hex || (p.name.startsWith('#') ? p.name : '#ccc'),
                    border: deleteProduct === p.name ? '3px solid #000' : '1px solid #E5E7EB',
                    boxShadow: deleteProduct === p.name ? '0 0 0 2px #fff inset' : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    transform: deleteProduct === p.name ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onMouseOver={(e) => { if (deleteProduct !== p.name) e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseOut={(e) => { if (deleteProduct !== p.name) e.currentTarget.style.transform = 'scale(1)' }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Orders Section */}
        <div className="orders-section">
          <h2 className="section-title">
            {showFulfilled ? 'Fulfilled Orders Archive' : 'Pending Orders'}
          </h2>
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
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {item.status === 'Fulfilled' ? (
                            <>
                              <span style={{
                                background: '#DCFCE7', color: '#166534', padding: '4px 8px',
                                borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #BBF7D0'
                              }}>
                                FULFILLED
                              </span>
                              <button
                                onClick={() => handleDeletePermanently(item._id)}
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626',
                                  padding: '4px', display: 'flex', alignItems: 'center'
                                }}
                                title="Delete Permanently"
                              >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </>
                          ) : (
                            <button
                              className="delete-button"
                              onClick={() => handleFulfill(item._id)}
                              style={{ background: '#10B981', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
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