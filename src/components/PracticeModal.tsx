import React, { useEffect, useState } from "react";
import type { Card } from "../types";
import { Button, Modal } from "react-bootstrap";
import TinderCard from "react-tinder-card";
import PracticeCardService, {
  PracticeCardChangeCallback,
} from "../data/PracticeCardService";
import { toast } from "sonner";
import { FaBan, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";

interface PracticeModalProps {
  deckId: number;
  show: boolean;
  onClose: () => void;
  onPracticeFinished: () => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  deckId,
  show,
  onClose,
  onPracticeFinished,
}) => {
  const practiceCardService = PracticeCardService.getInstance();
  const [isFlipped, setIsFlipped] = useState(false);
  const [practiceCards, setPracticeCards] = useState<Array<Card>>([]);
  const [cardsCount, setCardsCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const childRefs = Array(cardsCount)
    .fill(0)
    .map(() => React.createRef<any>());

  const practiceCardChangeCallback: PracticeCardChangeCallback = () => {
    setPracticeCards([...practiceCardService.getCards()]);
    setCurrentIndex(practiceCardService.getCards().length - 1);
    setCardsCount(practiceCardService.getCards().length);
  };

  useEffect(() => {
    practiceCardService.subscribe(practiceCardChangeCallback);
    practiceCardService.fetchDueCards(deckId);
    return () => {
      practiceCardService.unsubscribe(practiceCardChangeCallback);
    };
  }, []);

  async function swipe(dir: string) {
    if (currentIndex >= 0 && currentIndex < cardsCount) {
      await childRefs[currentIndex]?.current?.swipe(dir); // Swipe the card!
    }
  }

  function swiped(
    index: number,
    card_id: number,
    direction: "left" | "right" | "up" | "down"
  ) {
    if (direction === "left") {
      practiceCardService.setCardState(card_id, false);
    } else if (direction === "right") {
      practiceCardService.setCardState(card_id, true);
    }
    setIsFlipped(false);
    setCurrentIndex(index - 1);
  }

  function handleSessionEnd(index: number) {
    if (index === 0) {
      practiceCardService.resetCards();
      onPracticeFinished();
      onClose();
      toast.success("Practice Finished");
    }
  }

  return (
    <Modal size="xl" centered show={show} onHide={() => onClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Practice</Modal.Title>
      </Modal.Header>
      {cardsCount > 0 ? (
        <Modal.Body className="practice-modal__body">
          <div className="swiper__container">
            {practiceCards.map((card, index) => (
              <TinderCard
                ref={childRefs[index]}
                key={card.id}
                onSwipe={(direction) => swiped(index, card.id, direction)}
                onCardLeftScreen={() => handleSessionEnd(index)}
                className="swiper"
                preventSwipe={["up", "down"]}
              >
                <div className="swiper__card__container">
                  <div
                    className={`swiper__card ${
                      currentIndex === index && isFlipped
                        ? "swiper__card_flipped"
                        : ""
                    }`}
                  >
                    <div className="swiper__card__front">{card.front_text}</div>
                    <div className="swiper__card__back">{card.back_text}</div>
                  </div>
                </div>
              </TinderCard>
            ))}
          </div>
          {currentIndex >= 0 ? (
            <div className="practice-modal__actions">
              <Button variant="danger" onClick={() => swipe("left")}>
                <FaBan />
              </Button>
              <Button
                type="submit"
                variant="success"
                onClickCapture={() => setIsFlipped(!isFlipped)}
              >
                {isFlipped ? <FaEye /> : <FaEyeSlash />}
              </Button>
              <Button
                type="submit"
                variant="success"
                onClick={() => swipe("right")}
              >
                <FaCheck />
              </Button>
            </div>
          ) : null}
        </Modal.Body>
      ) : (
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <p>No cards to practice</p>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
};
