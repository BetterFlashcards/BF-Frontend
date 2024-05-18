import React, { MouseEventHandler, useState } from "react";
import type { Card } from "../types";
import { CardService } from "../data";
import { Button, Card as BCard, ButtonGroup } from "react-bootstrap";

interface FlashcardProps {
  card: Card;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const cardService = CardService.getInstance();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDeleteCard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (card.id) cardService.deleteCard(card.id);
  };

  const handleUpdateCard: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    const front = prompt("New front text:", card.front_text);
    const back = prompt("New back text:", card.back_text);
    if (front && back) {
      cardService.updateCard(card.id, front, back);
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <BCard className={`flashcard-component ${isFlipped ? "flipped" : ""}`} onClick={handleClick}>
      <BCard.Body>
        <div
          className={`flashcard-component__content ${
            isFlipped ? "flashcard-component__content_flipped" : ""
          }`}
          onClick={handleClick}
        >
          <div className="flashcard-component__content__front">
            {card.front_text}
          </div>
          <div className="flashcard-component__content__back">
            {card.back_text}
          </div>
        </div>
      </BCard.Body>
      <BCard.Footer className="flashcard-controls">
        <div className="d-flex justify-content-end">
          <ButtonGroup>
            <Button variant="primary" size="sm" onClick={handleUpdateCard}>
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
