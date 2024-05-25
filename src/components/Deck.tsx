import type { Deck as DeckType } from "../types";
import { Button, Card as BCard, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
interface DeckProps {
  deck: DeckType;
  onEdit: (deck: DeckType) => void;
  onDelete: (deckId: number) => void;
}

export const Deck: React.FC<DeckProps> = ({ deck, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <BCard className="deck-component">
      <BCard.Header>
        <div className="d-flex align-items-center justify-content-end w-100">
          <ButtonGroup>
            <Button variant="primary" size="sm" onClick={() => onEdit(deck)}>
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deck.id);
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </div>
      </BCard.Header>
      <BCard.Body onClick={() => navigate(`/decks/${deck.id}`)}>
        <BCard.Title>{deck.name}</BCard.Title>
        <BCard.Text>{deck.language}</BCard.Text>
      </BCard.Body>
      <BCard.Footer className="text-muted">
        Language Code: {deck.language}
      </BCard.Footer>
    </BCard>
  );
};
