import { FaBookOpen, FaLayerGroup, FaMapSigns } from "react-icons/fa";

function AboutPage() {
  return (
    <div className="about-page">
      <h2>About Flashcards App</h2>
      <p>
        The Flashcards App is a powerful tool for efficient learning. Here are
        some of its main features:
      </p>
      <ul>
        <li>
          <FaBookOpen className="icon" />
          <strong> Interactive Flashcards:</strong> Learn and review topics
          using interactive flashcards.
        </li>
        <li>
          <FaLayerGroup className="icon" />
          <strong> Custom Decks:</strong> Create your own decks of flashcards on
          any topic.
        </li>
        <li>
          <FaMapSigns className="icon" />
          <strong> Easy Navigation:</strong> Navigate through the app with a
          user-friendly interface.
        </li>
      </ul>
      <p>
        Start learning with Flashcards App today and take your knowledge to the
        next level!
      </p>
    </div>
  );
}

export default AboutPage;
