import React, { FC } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './footer.css';

interface LoginModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  article: any;
  googleLogin: () => void;
  fbLogin: () => void;
}

const LoginModal: FC<LoginModalProps> = ({
  showModal,
  setShowModal,
  article,
  googleLogin,
  fbLogin,
}: LoginModalProps): JSX.Element => {
  return (
    <Modal
      show={showModal}
      onHide={(): void => setShowModal(false)}
      backdrop="static"
      dialogClassName="modal-40w"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter align-center">
          {article != null
            ? `Hi ${article?.result?.name || ''}!`
            : 'Login via Google or Facebook to get started'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="lgBody">
        {/* <h2>Login with</h2> */}
        <Button variant="danger" className="lgBtn" onClick={googleLogin}>
          Google
        </Button>
        <Button variant="primary" className="lgBtn" onClick={fbLogin}>
          Facebook
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
