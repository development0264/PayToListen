/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { FC, useEffect, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

interface Props {
  setSearch: (v: string) => void;
  toggleBtn: (v: boolean) => void;
  showListing: (v: boolean) => void;
  setListening: (v: boolean) => void;
}

const VoiceToText: FC<Props> = ({
  setSearch,
  toggleBtn,
  showListing,
  setListening,
}: Props): JSX.Element | null => {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
  } = useSpeechRecognition();
  const [isOpened, setOpened] = useState(false);
  useEffect(() => {
    SpeechRecognition.startListening();
    setOpened(true);
    return () => {
      setOpened(false);
    };
  }, []);

  useEffect(() => {
    if (listening) {
      setListening(true);
    }
    if (!listening && isOpened) {
      toggleBtn(false);
      setListening(false);
    }
  }, [listening]);

  useEffect(() => {
    if (transcript && transcript?.length > 0) {
      setSearch(transcript);
      showListing(true);
    }
  }, [transcript, interimTranscript, finalTranscript]);

  const stopVoice = (): void => {
    SpeechRecognition.stopListening();
    toggleBtn(false);
    setListening(false);
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }
  return (
    <span onClick={stopVoice}>
      <i className="fa fa-pause" />
    </span>
  );
};
export default VoiceToText;
