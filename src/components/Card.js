import card1 from '../img/card1.png';
import card2 from '../img/card2.png';
import card3 from '../img/card3.png';

const images = {
  "card1.png": card1,
  "card2.png": card2,
  "card3.png": card3
};

function Card(props) {
  console.log(props.img);
  return (
    <div className="card">
      <br />

      <div className="text-center">
        <img 
          alt="card-img" 
          src={images[props.img]} // Use mapped import
          className="text-center img-fluid" 
        />
      </div>
      <div className="text-center">
        <h3 className="card-title">{props.title}</h3>
      </div>
      <div className="p-3">
        <p className="card-text">{props.text}</p>
      </div>
    </div>
  );
}

export default Card;
