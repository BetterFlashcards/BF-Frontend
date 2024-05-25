import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import TranslationService, {
  LanguageListChangeCallback,
} from "../data/TranslationService";
import { Language } from "../types/types";

interface LanguageSelector {
  value: string;
  required?: boolean;
  onChange: (langCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelector> = ({
  value,
  onChange,
  required = false,
}) => {
  const translationService = TranslationService.getInstance();

  const [languages, setLanguages] = useState<Array<Language>>([]);

  const languageCallBack: LanguageListChangeCallback = (l) => {
    setLanguages([...l]);
    console.log("Lang: ", l);
  };

  useEffect(() => {
    setLanguages(translationService.getLanguages());
    translationService.subscribe(languageCallBack);
    return () => translationService.unsubscribe(languageCallBack);
  }, []);

  return (
    <Form.Select
      size="sm"
      required={required}
      aria-label="language selector"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    >
      <option value="">Select Language</option>
      {languages.map((lang) => (
        <option key={lang.id} value={lang.isocode}>
          {lang.name}
        </option>
      ))}
    </Form.Select>
  );
};
