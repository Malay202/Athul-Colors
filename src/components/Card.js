import { useState } from 'react';
import { motion } from 'framer-motion';
import card1 from '../img/Pigment-Fine-paste.jpg';
import card2 from '../img/Coir-Coatings.jpg';
import card3 from '../img/Artist-Paint.jpg';

const images = {
  "card1.png": card1,
  "card2.png": card2,
  "card3.png": card3,
};

function Card(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCard = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <motion.div
      className="card"
      onClick={toggleCard}
      style={{ cursor: "pointer", overflow: "hidden" }}
      initial={{ borderRadius: "10px" }}
      animate={{ borderRadius: isOpen ? "20px" : "10px" }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Section */}
      <div className="text-center">
        <img 
          alt="card-img" 
          src={images[props.img]} 
          className="text-center img-fluid" 
        />
      </div>

      {/* Title Section */}
      <div className="text-center">
        <h3 className="card-title">{props.title}</h3>
      </div>

      {/* Motion Text Section */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="p-3"
      >
        <p className="card-text">{props.text}</p>
      </motion.div>
    </motion.div>
  );
}

export default Card;
