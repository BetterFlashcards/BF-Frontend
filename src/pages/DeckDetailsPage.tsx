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
import { CardService, DeckService } from "../data";
import { Card } from "../types";
import { Flashcard } from "../components/Flashcard";
import { CardChangeCallback } from "../data/CardService";
import { useParams } from "react-router-dom";
import { FaPlay, FaPlus, FaSort } from "react-icons/fa";
import ContentLoader from "react-content-loader";
import { toast } from "sonner";
import { PracticeModal } from "../components/PracticeModal";
import PracticeCardService from "../data/PracticeCardService";
import { LanguageSelector } from "../components/LanguageSelector";
import TranslationService from "../data/TranslationService";

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
  const deckService = DeckService.getInstance();
  const cardService = CardService.getInstance();
  const practiceCardService = PracticeCardService.getInstance();
  const translationService = TranslationService.getInstance();

  const [deckName, setDeckName] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCards, setSortedCards] = useState<Array<Card>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalValidated, setCreateModalValidated] = useState(false);
  const [newCardFrontText, setNewCardFrontText] = useState("");
  const [newCardBackText, setNewCardBackText] = useState("");
  const [isDraft, setDraft] = useState(false);
  const [targetLang, setTargetLang] = useState("");

  const [targetCardToEdit, setTargetCardToEdit] = useState<Card | null>(null);
  const [targetCardToDelete, setTargetCardToDelete] = useState<Card | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);

  const cardChangeCallback: CardChangeCallback = () => {
    setSortedCards([...cardService.getCards()]);
    setLoading(false);
  };

  const fetchDeckData = async () => {
    const deck = await deckService.fetchDeckById(deckId);
    setDeckName(deck?.name || deckId.toString());
  };

  useEffect(() => {
    fetchDeckData();
    cardService.resetCards();
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
      newCardBackText,
      isDraft
    );
    if (card) {
      toast.success("Card created successfully!");
    }
    hideCreateModal();
    practiceCardService.fetchDueCards(deckId);
  }

  async function handleUpdateCard(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false || !targetCardToEdit) {
      setCreateModalValidated(true);
      return;
    }

    const card = await cardService.updateCard(
      deckId,
      targetCardToEdit.id,
      newCardFrontText,
      newCardBackText,
      isDraft
    );
    if (card) {
      toast.success("Card updated successfully!");
    }
    hideCreateModal();
    practiceCardService.fetchDueCards(deckId);
  }

  async function handleTranslate() {
    const res = await translationService.translateWord(
      newCardFrontText,
      targetLang
    );
    if (!res) {
      toast.error("Failed to translate the word. Please try again.");
      return;
    }
    setNewCardBackText(res.translation);
  }

  function handleOpenEditModal(card: Card) {
    setTargetCardToEdit(card);
    setNewCardFrontText(card.front_text);
    setNewCardBackText(card.back_text);
    setDraft(card.draft);
    setShowCreateModal(true);
  }

  function hideCreateModal() {
    setCreateModalValidated(false);
    setShowCreateModal(false);
    setNewCardFrontText("");
    setNewCardBackText("");
    setDraft(false);
    setTargetCardToEdit(null);
  }

  function handleOpenDeleteModal(card: Card) {
    setTargetCardToDelete(card);
    setShowDeleteModal(true);
  }

  async function handleDeleteCard() {
    const success = await cardService.deleteCard(targetCardToDelete!.id);
    if (success) {
      setTargetCardToDelete(null);
      setShowDeleteModal(false);
      practiceCardService.fetchDueCards(deckId);
    }
  }

  return (
    <Container fluid="lg" className="deck-details-page mt-5">
      <div className="deck-details-page__header">
        <h1 className="mb-0">{deckName}</h1>
        <div className="deck-details-page__header__buttons">
          <Button
            variant="success"
            size="sm"
            onClick={() => setShowPracticeModal(true)}
          >
            <FaPlay className="me-2" /> Start Practice
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus /> Add Card
          </Button>
        </div>
      </div>
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
          {loading ? (
            <CardListLoader />
          ) : sortedCards.length > 0 ? (
            sortedCards.map((card) => (
              <Col sm={12} md={6} lg={4} xl={3} key={card.id}>
                <Flashcard
                  card={card}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              </Col>
            ))
          ) : (
            <p>No flashcards found.</p>
          )}
        </Row>
      </BootstrapCard.Body>

      <Modal show={showCreateModal} onHide={() => hideCreateModal()}>
        <Form
          noValidate
          validated={createModalValidated}
          onSubmit={targetCardToEdit ? handleUpdateCard : handleCreateCard}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {targetCardToEdit ? "Update Flashcard" : "New Flashcard"}
            </Modal.Title>
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
            <Form.Group className="mb-3" controlId="cardCreateForm.language">
              <Form.Label>Language for translation</Form.Label>
              <InputGroup className="mb-3">
                <LanguageSelector
                  value={targetLang}
                  onChange={(lang) => setTargetLang(lang)}
                />
                <Button variant="secondary" onClick={handleTranslate}>
                  Translate
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="deckCreateForm.descriptionControl"
            >
              <Form.Label>Translation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Provide the translation here"
                value={newCardBackText}
                onChange={(e) => setNewCardBackText(e.target.value)}
              />
            </Form.Group>
            <Form.Check
              checked={isDraft}
              onChange={() => setDraft(!isDraft)}
              type="switch"
              label="Save as draft"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => hideCreateModal()}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              {targetCardToEdit ? "Update" : "Submit"}
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
      <PracticeModal
        show={showPracticeModal}
        deckId={deckId}
        onClose={() => setShowPracticeModal(false)}
        onPracticeFinished={() => console.log("Practice Finished")}
      />
    </Container>
  );
};

export default DeckDetailsPage;
