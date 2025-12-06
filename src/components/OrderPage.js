import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../assets/orderpage.css";

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    axios
      .get(`${API_URL}/order/${id}`)
      .then((response) => {
        setOrders(response.data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching orders:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Fetch available products from backend
    axios.get(`${API_URL}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error("Please select a product from the list.");
      return;
    }
    const payload = {
      userId: id,
      orders: [{ productName: selectedProduct.name, quantity: Number(quantity) }],
    };

    axios
      .post(`${API_URL}/order/${id}`, payload)
      .then((response) => {
        setOrders((prevOrders) => {
          // Check if color already exists
          const index = prevOrders.findIndex(
            (order) => order.productName === selectedProduct.name
          );
          if (index > -1) {
            const updatedOrders = [...prevOrders];
            updatedOrders[index].quantity += Number(quantity);
            return updatedOrders;
          }
          return [...prevOrders, { productName: selectedProduct.name, quantity: Number(quantity) }];
        });
        toast.success("Order line created successfully.");
        setQuantity(1);
        setSelectedProduct(null);
      })
      .catch((err) => {
        console.log("Error creating order:", err);
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(`Error: ${err.response.data.error}`);
        } else {
          toast.error("Failed to add line item.");
        }
      });
  };

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this line item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/order/${id}/${itemId}`);
      setOrders((prev) => prev.filter((item) => item._id !== itemId));
      toast.info("Line item removed.");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to remove item.");
    }
  };

  // Helper to check if string is a valid hex color for display style
  const isColor = (strColor) => {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
  };

  return (
    <div className="userpage-container">
      <div className="header-section">
        <div className="title-block">
          <h2>Order Requisition</h2>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>PO #{id}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleHome} className="logout-button">Home</button>
          <button onClick={handleLogout} className="logout-button" style={{ color: '#dc2626', borderColor: '#dc2626' }}>Sign Out</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Picker */}
        <div className="picker-card">
          <h3>Product Configuration</h3>
          <form onSubmit={handleCreateOrder}>

            <div className="form-group">
              <label className="form-label">Select Pigment</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                gap: '10px',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                padding: '10px',
                borderRadius: '6px'
              }}>
                {products.map(p => (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProduct(p)}
                    title={p.name}
                    style={{
                      cursor: 'pointer',
                      border: selectedProduct?._id === p._id ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '40px', background: p.hex || (p.name.startsWith('#') ? p.name : '#ccc') }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <div className="hex-display" style={{ background: selectedProduct?.hex || '#f1f5f9' }}>
                {selectedProduct ? `${selectedProduct.name}` : "No Product Selected"}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity (Units)</label>
              <div className="quantity-wrapper">
                <button type="button" className="qty-btn" onClick={decrementQty}>-</button>
                <input type="text" className="qty-input" value={quantity} readOnly />
                <button type="button" className="qty-btn" onClick={incrementQty}>+</button>
              </div>
            </div>

            <button type="submit" className="add-btn" disabled={!selectedProduct} style={{ opacity: !selectedProduct ? 0.5 : 1, cursor: !selectedProduct ? 'not-allowed' : 'pointer' }}>
              Add to Manifest
            </button>
          </form>
        </div>

        {/* Right Column: List */}
        <div className="orders-container">
          <div className="order-header-row">
            <span>Swatch</span>
            <span>Product Code</span>
            <span>Qty</span>
            <span style={{ textAlign: 'right' }}>Action</span>
          </div>
          {orders.length > 0 ? (
            <div className="order-list">
              {orders.map((order, index) => (
                <div key={order._id || index} className="order-item">
                  <div
                    className="swatch-preview"
                    style={{ backgroundColor: (products.find(p => p.name === order.productName)?.hex) || (isColor(order.productName) ? order.productName : '#ccc') }}
                  ></div>
                  <span className="product-code">{order.productName}</span>
                  <span className="qty-badge">{order.quantity}</span>
                  <button
                    className="remove-link"
                    onClick={() => handleDelete(order._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No line items in this requisition.</p>
              <small>Use the configuration panel to add products.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
