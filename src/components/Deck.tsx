import { useEffect, useState } from "react";
import { Flashcard } from "./Flashcard";
import type { Card, Deck as DeckType } from "../types";
import { CardManager, DeckManager } from "../data";
import { CardChangeCallback } from "../data/CardManager";
import { formatDate } from "../helpers";
import { Button, Card as BootstrapCard, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';


interface DeckProps {
  deck: DeckType;
}

export const Deck: React.FC<DeckProps> = ({ deck }) => {
  const deckManager = DeckManager.getInstance();
  const cardManager = CardManager.getInstance();

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCards, setSortedCards] = useState<Array<Card>>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const cardChangeCallback: CardChangeCallback = () => {
    setSortedCards([...cardManager.getCards(deck.id)]);
  };

  useEffect(() => {
    let filtered = cardManager
      .getCards(deck.id)
      .filter((card) =>
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.front.localeCompare(b.front));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.front.localeCompare(a.front));
    }

    setSortedCards(filtered);
  }, [searchTerm, sortOrder]);

  const handleDeleteDeck = () => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      deckManager.deleteDeck(deck.id);
    }
  };

  const handleUpdateDeckTitle = () => {
    const newTitle = prompt("New title for this deck:", deck.title);
    if (newTitle) {
      deckManager.updateDeckTitle(deck.id, newTitle);
    }
  };

  function handleAddCard() {
    const front = prompt("Front of card:");
    const back = prompt("Back of card:");
    if (front && back) {
      cardManager.createCard(deck.id, front, back);
    }
  }

return (
  <BootstrapCard className="deck-component">
    <BootstrapCard.Header>
      <Row>
        <Col>{deck.title} - Cards: {sortedCards.length}</Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleUpdateDeckTitle}>Edit</Button>
          <Button variant="danger" onClick={handleDeleteDeck}>Delete</Button>
        </Col>
      </Row>
    </BootstrapCard.Header>
    <BootstrapCard.Body>
      <p>Last Updated: {formatDate(deck.lastUpdated)}</p>
      <InputGroup className="mb-3">
        <FormControl
          type="text"
          placeholder="Search Flashcards"
          onChange={(e) => setSearchTerm(e.target.value)} // Add this line
        />
        <Button variant="outline-secondary" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </Button>
      </InputGroup>
      <Button variant="primary" onClick={handleAddCard}>Add Card</Button>
      <Container className="deck-component__card-container">
        {sortedCards.length > 0 ? (
          sortedCards.map((card) => <Flashcard key={card.id} card={card} />)
        ) : (
          <p>No flashcards found.</p>
        )}
      </Container>
    </BootstrapCard.Body>
  </BootstrapCard>
);
};