import React, { MouseEventHandler, useState } from "react";
import type { Card } from "../types";
import { Button, Card as BCard, ButtonGroup } from "react-bootstrap";

interface FlashcardProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  onEdit,
  onDelete,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDeleteCard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onDelete(card);
  };

  const handleEditCard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onEdit(card);
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <BCard
      className={[
        "flashcard-component",
        isFlipped ? "flipped" : "",
        card.draft ? "flashcard-component_draft" : "",
      ].join(" ")}
      onClick={handleClick}
    >
      <BCard.Body>
        <div className="flashcard-content">
          <div className="flashcard-front">{card.front_text}</div>
          <div className="flashcard-back">{card.back_text}</div>
        </div>
      </BCard.Body>
      <BCard.Footer className="flashcard-controls">
        <div className="d-flex justify-content-end">
          <ButtonGroup>
            <Button variant="primary" size="sm" onClick={handleEditCard}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteCard}>
              Delete
            </Button>
          </ButtonGroup>
        </div>
      </BCard.Footer>
    </BCard>
  );
};
