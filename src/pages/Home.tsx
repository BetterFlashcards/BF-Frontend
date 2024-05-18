import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Flashcards App!</h1>
      <p>This is a powerful tool for efficient learning. Start creating your flashcards now!</p>
      <Link to="/decks" className="btn btn-primary">Get Started</Link>
    </div>
  );
};

export default Home;
