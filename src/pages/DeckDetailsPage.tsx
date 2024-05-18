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
import { CardService, DeckService } from "../data";
import { Card } from "../types";
import { Flashcard } from "../components/Flashcard";
import { CardChangeCallback } from "../data/CardService";
import { useParams } from "react-router-dom";

const DeckDetailsPage: React.FC = () => {
  const { id } = useParams();
  const deckId = parseInt(id!);
  const deckService = DeckService.getInstance();
  const cardService = CardService.getInstance();
  const deck = deckService.getDeckById(deckId);

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
    setSortedCards([...cardService.getCards(deck.id)]);
  };

  useEffect(() => {
    cardService.subscribe(cardChangeCallback);
    return () => cardService.unsubscribe(cardChangeCallback);
  }, []);

  useEffect(() => {
    let filtered = cardService
      .getCards(deckId!)
      .filter(
        (card) =>
          card.front_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.back_text.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.front_text.localeCompare(b.front_text));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.front_text.localeCompare(a.front_text));
    }
    setSortedCards(filtered);
  }, [searchTerm, sortOrder, deck.id]);

  function handleAddCard() {
    const front = prompt("Front of card:");
    const back = prompt("Back of card:");
    if (front && back) {
      cardService.createCard(deck!, front, back);
    }
  }
  return (
    <Container fluid="lg" className="mt-5">
      <Row>
        <Col xs={8}>
          <h1>{deck.name}</h1>
        </Col>
        <Col xs={4} className="d-flex justify-content-end flex-wrap">
          <Button variant="primary" onClick={handleAddCard}>
            Add Card
          </Button>
        </Col>
      </Row>
      <BootstrapCard.Body className="mt-5">
        <p>Last Updated: </p>
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