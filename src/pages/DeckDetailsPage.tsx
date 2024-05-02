import React, { useEffect, useState } from "react";
import {
  Button,
  Card as BootstrapCard,
  Container,
  InputGroup,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import { CardManager, DeckManager } from "../data";
import { formatDate } from "../helpers";
import { Card } from "../types";
import { Flashcard } from "../components/Flashcard";
import { CardChangeCallback } from "../data/CardManager";
import { useParams } from "react-router-dom";

const DeckDetailsPage: React.FC = () => {
  const { id: deckId } = useParams();
  const deckManager = DeckManager.getInstance();
  const cardManager = CardManager.getInstance();
  const deck = deckManager.getDeckById(deckId!);

  if (!deck)
    return (
      <Container fluid="lg" className="mt-5">
        <Row>
          <Col xs={8}>
            <h1>Oops, no deck not found with id: {deckId}</h1>
          </Col>
        </Row>
      </Container>
    );

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCards, setSortedCards] = useState<Array<Card>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const cardChangeCallback: CardChangeCallback = () => {
    setSortedCards([...cardManager.getCards(deck.id)]);
  };

  useEffect(() => {
    cardManager.subscribe(cardChangeCallback);
    return () => cardManager.unsubscribe(cardChangeCallback);
  }, []);

  useEffect(() => {
    let filtered = cardManager
      .getCards(deckId!)
      .filter(
        (card) =>
          card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.back.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.front.localeCompare(b.front));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.front.localeCompare(a.front));
    }
    setSortedCards(filtered);
  }, [searchTerm, sortOrder, deck.id]);

  function handleAddCard() {
    const front = prompt("Front of card:");
    const back = prompt("Back of card:");
    if (front && back) {
      cardManager.createCard(deck!.id, front, back);
    }
  }
  return (
    <Container fluid="lg" className="mt-5">
      <Row>
        <Col xs={8}>
          <h1>{deck.title}</h1>
        </Col>
        <Col xs={4} className="d-flex justify-content-end flex-wrap">
          <Button variant="primary" onClick={handleAddCard}>
            Add Card
          </Button>
        </Col>
      </Row>
      <BootstrapCard.Body className="mt-5">
        <p>Last Updated: {formatDate(deck.lastUpdated)}</p>
        <InputGroup className="mb-3">
          <FormControl
            type="text"
            placeholder="Search Flashcards"
            onChange={(e) => setSearchTerm(e.target.value)} // Add this line
          />
          <Button
            variant="outline-secondary"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
          </Button>
        </InputGroup>

        <Row className="gy-4">
          {sortedCards.length > 0 ? (
            sortedCards.map((card) => (
              <Col sm={12} md={6} lg={4} xl={3} key={card.id}>
                <Flashcard card={card} />
              </Col>
            ))
          ) : (
            <p>No flashcards found.</p>
          )}
        </Row>
      </BootstrapCard.Body>
    </Container>
  );
};

export default DeckDetailsPage;
