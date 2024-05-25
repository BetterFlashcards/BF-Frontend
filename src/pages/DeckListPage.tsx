import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { FaPlus, FaSort } from "react-icons/fa";
import { Deck } from "../components/Deck";
import { DeckService } from "../data";
import type { Deck as DeckType } from "../types";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { LanguageSelector } from "../components/LanguageSelector";

const DeckListLoader: React.FC = () => (
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

const DeckListPage: React.FC = () => {
  const deckService = DeckService.getInstance();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortedDecks, setSortedDecks] = useState<Array<DeckType>>([]);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [deckCount, setDeckCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [validated, setValidated] = useState(false);

  const [editedDeck, setEditedDeck] = useState<DeckType | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetDeckToDelete, setTargetDeckToDelete] = useState(0);

  const deckCallback = (decks: Array<DeckType>) => {
    setSortedDecks([...decks]);
    setDeckCount(decks.length);
    setLoading(false);
  };

  useEffect(() => {
    deckService.subscribe(deckCallback);
    deckService.fetchDecks();
    return () => deckService.unsubscribe(deckCallback);
  }, []);

  useEffect(() => {
    let filtered = deckService
      .getDecks()
      .filter((deck) =>
        deck.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedDecks(filtered);
  }, [searchTerm, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder: string | null) =>
      prevOrder === "asc" ? "desc" : "asc"
    );
  };

  async function handleCreateNewDeck(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const newDeck = await deckService.createDeck({
      name: newDeckName,
      language: language,
    });
    if (newDeck) {
      navigate(`/decks/${newDeck.id}`);
    }
    hideModal();
  }

  function openEditModal(deck: DeckType) {
    setEditedDeck(deck);
    setNewDeckName(deck.name);
    setLanguage(deck.language);
    setShow(true);
  }

  async function handleUpdateDeck(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false || !editedDeck) {
      setValidated(true);
      return;
    }
    await deckService.updateDeck({
      id: editedDeck.id,
      name: newDeckName,
      language: language,
    });
    hideModal();
  }

  function openDeleteModal(deckId: number) {
    setShowDeleteModal(true);
    setTargetDeckToDelete(deckId);
  }

  function handleDeleteDeck() {
    deckService.deleteDeck(targetDeckToDelete);
    setShowDeleteModal(false);
  }

  function hideModal() {
    setValidated(false);
    setShow(false);
    setEditedDeck(null);
    setNewDeckName("");
    setLanguage("");
  }

  return (
    <Container fluid="lg" className="deck-list-page mt-5">
      <Row>
        <div className="deck-list-page__header">
          <h1>All Decks</h1>
          <div className="deck-list-page__header__buttons">
            <Button variant="primary" size="sm" onClick={() => setShow(true)}>
              <FaPlus /> Add New Deck
            </Button>
          </div>
        </div>
      </Row>
      <div className="mt-5">
        <InputGroup className="mb-3">
          <FormControl
            type="text"
            placeholder="Search Decks"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="secondary" onClick={toggleSortOrder}>
            <FaSort /> Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
          </Button>
        </InputGroup>
        <Row className="gy-4">
          {loading ? (
            <DeckListLoader />
          ) : deckCount > 0 ? (
            sortedDecks.map((deck) => (
              <Col sm={12} md={6} lg={4} xl={3} key={deck.id}>
                <Deck
                  deck={deck}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              </Col>
            ))
          ) : (
            <p>No decks found!</p>
          )}
        </Row>
      </div>

      <Modal show={show} onHide={() => hideModal()}>
        <Form
          noValidate
          validated={validated}
          onSubmit={editedDeck ? handleUpdateDeck : handleCreateNewDeck}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editedDeck ? "Update deck details" : "Enter new deck details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group
              className="mb-3"
              controlId="deckCreateForm.titleControl"
            >
              <Form.Label>Deck title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Deck title"
                required
                autoFocus
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter title.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="deckCreateForm.language">
              <Form.Label>Deck Language</Form.Label>
              <LanguageSelector
                value={language}
                required
                onChange={(lang) => setLanguage(lang)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => hideModal()}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              {editedDeck ? "Update" : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete this deck?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={() => handleDeleteDeck()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeckListPage;
