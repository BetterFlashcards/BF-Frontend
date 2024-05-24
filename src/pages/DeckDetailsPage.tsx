import React, { useEffect, useState } from "react";
import {
  Button,
  Card as BootstrapCard,
  Container,
  InputGroup,
  FormControl,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import { CardService } from "../data";
import { Card } from "../types";
import { Flashcard } from "../components/Flashcard";
import { CardChangeCallback } from "../data/CardService";
import { useParams } from "react-router-dom";
import { FaPlus, FaSort } from "react-icons/fa";
import ContentLoader from "react-content-loader";

const CardListLoader: React.FC = () => (
  <>
    {[...Array(12).keys()].map((item) => (
      <Col key={item} sm={12} md={6} lg={4} xl={3}>
        <ContentLoader viewBox="0 0 10 7">
          <rect x="0" y="0" rx="1" ry="1" width="10" height="7" />
        </ContentLoader>
      </Col>
    ))}
  </>
);

const DeckDetailsPage: React.FC = () => {
  const { id } = useParams();
  const deckId = parseInt(id!);
  const cardService = CardService.getInstance();
  cardService.resetCards();

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCards, setSortedCards] = useState<Array<Card>>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [createModalValidated, setCreateModalValidated] = useState(false);
  const [newCardFrontText, setNewCardFrontText] = useState("");
  const [newCardBackText, setNewCardBackText] = useState("");

  const [targetCardToDelete, setTargetCardToDelete] = useState<Card | null>(
    null
  );

  const cardChangeCallback: CardChangeCallback = () => {
    setSortedCards([...cardService.getCards()]);
  };

  useEffect(() => {
    cardService.subscribe(cardChangeCallback);
    cardService.fetchCards(deckId);
    return () => cardService.unsubscribe(cardChangeCallback);
  }, []);

  useEffect(() => {
    let filtered = cardService
      .getCards()
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
  }, [searchTerm, sortOrder]);

  async function handleCreateCard(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setCreateModalValidated(true);
      return;
    }
    const card = await cardService.createCard(
      deckId,
      newCardFrontText,
      newCardBackText
    );
    if (card) {
    }
    setCreateModalValidated(false);
    setShowCreateModal(false);
    setNewCardFrontText("");
    setNewCardBackText("");
  }

  function handleOpenDeleteModal(card: Card) {
    setTargetCardToDelete(card);
    setShowDeleteModal(true);
  }

  async function handleDeleteCard() {
    await cardService.deleteCard(targetCardToDelete!.id);
  }

  return (
    <Container fluid="lg" className="deck-details-page mt-5">
      <Row>
        <Col xs={8}>
          <h1>{deckId}</h1>
        </Col>
        <Col xs={4} className="d-flex justify-content-end flex-wrap">
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Add Card
          </Button>
        </Col>
      </Row>
      <BootstrapCard.Body className="mt-5">
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
        <InputGroup className="mb-3">
          <FormControl
            type="text"
            placeholder="Search Flashcards"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <FaSort /> Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
          </Button>
        </InputGroup>

        <Row className="gy-4">
          {sortedCards.length > 0 ? (
            sortedCards.map((card) => (
              <Col sm={12} md={6} lg={4} xl={3} key={card.id}>
                <Flashcard
                  card={card}
                  onDelete={(card) => handleOpenDeleteModal(card)}
                />
              </Col>
            ))
          ) : (
            <p>No flashcards found.</p>
          )}
        </Row>
      </BootstrapCard.Body>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Form
          noValidate
          validated={createModalValidated}
          onSubmit={handleCreateCard}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Flashcard</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group
              className="mb-3"
              controlId="deckCreateForm.titleControl"
            >
              <Form.Label>Word context</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your word here"
                required
                autoFocus
                value={newCardFrontText}
                onChange={(e) => setNewCardFrontText(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter the word.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="deckCreateForm.descriptionControl"
            >
              <Form.Label>Translation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Provide the translation here"
                required
                value={newCardBackText}
                onChange={(e) => setNewCardBackText(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Close
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete this card?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={() => handleDeleteCard()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeckDetailsPage;
