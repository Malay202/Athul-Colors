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
      await axios.delete(`${API_URL}/user/${id1}`);
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
                <th>Phone</th>
                <th>Order Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{item.userName}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber || "N/A"}</td>
                  <td>
                    {Array.isArray(item.orders) ? (
                      <ul>
                        {item.orders.map((order, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: order.productName.startsWith('#') ? order.productName : '#ccc',
                                border: '1px solid #ddd'
                              }}
                            ></span>
                            <span style={{ fontFamily: 'monospace' }}>{order.productName}</span>
                            <span style={{ fontWeight: 'bold' }}>x{order.quantity}</span>
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

      <div className="header-section" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'flex-end', padding: '0 20px', gap: '10px' }}>
        <button onClick={handleHome} style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 500
        }}>Home</button>
        <button onClick={handleLogout} style={{
          background: '#fff',
          border: '1px solid #dc2626',
          color: '#dc2626',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 500
        }}>Sign Out</button>
      </div>

      {/* Product Management Section */}
      <div className="product-management-section" style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px'
      }}>

        {/* Left Column: Create Product */}
        <div className="admin-card" style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>Add New Pigment</h3>
          <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Pigment Name</label>
              <input
                type="text"
                placeholder="e.g. Royal Blue"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Color Hex Code</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="color"
                  value={newProduct.hex}
                  onChange={e => setNewProduct({ ...newProduct, hex: e.target.value })}
                  style={{ width: '60px', height: '40px', padding: 0, border: 'none', cursor: 'pointer', flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={newProduct.hex}
                  onChange={e => setNewProduct({ ...newProduct, hex: e.target.value })}
                  pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                  style={{
                    flexGrow: 1,
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
            </div>

            <button type="submit" style={{
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>Add to Inventory</button>
          </form>
        </div>

        {/* Right Column: Existing Products & Delete */}
        <div className="admin-card" style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>Inventory Management</h3>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>Delete Product</label>
            <form onSubmit={handleDeleteProduct} style={{ display: 'flex', gap: '10px' }}>
              <select
                value={deleteProduct}
                onChange={e => setDeleteProduct(e.target.value)}
                required
                style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              >
                <option value="">Select a product to remove...</option>
                {products.map(p => (
                  <option key={p._id} value={p.name}>{p.name}</option>
                ))}
              </select>
              <button type="submit" style={{
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>Delete</button>
            </form>
          </div>

          <h4 style={{ marginBottom: '10px', color: '#475569' }}>Current Stock List</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '15px',
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '5px'
          }}>
            {products.map(p => (
              <div key={p._id} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: p.hex || (p.name.startsWith('#') ? p.name : '#ccc'),
                  border: '1px solid #ddd'
                }}></div>
                <span style={{ fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}>{p.name}</span>
                {p.hex && <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{p.hex}</span>}
              </div>
            ))}
          </div>

        </div>
      </div>


    </>
  );
}