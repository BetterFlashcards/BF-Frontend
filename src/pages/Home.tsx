import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from 'react-icons/fa';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Flashcards App!</h1>
      <p>This is a powerful tool for efficient learning. Start creating your flashcards now!</p>
      <div className="btn-container">
        <Link to="/decks" className="btn btn-primary">
          Get Started <FaArrowRight className="icon" />
        </Link>
      </div>
      <div className="animations">
        <div className="circle one"></div>
        <div className="circle two"></div>
        <div className="circle three"></div>
      </div>
    </div>
  );
};

export default Home;
