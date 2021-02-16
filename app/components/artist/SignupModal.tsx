import React, { Dispatch, FC } from 'react';
import _ from 'lodash';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import CountryCode from 'country-codes-list';
import { DummyImage } from '../common/common';
import './footer.css';
import { PendingProfileParams } from '../../../model/SearchModel';

interface SignupModalProps {
  showPendingModal: boolean;
  setPendingModal: (value: boolean) => void;
  article: any;
  setNameEmpty: (value: boolean) => void;
  setNameValid: (value: boolean) => void;
  setEmailEmpty: (value: boolean) => void;
  setEmailValid: (value: boolean) => void;
  setPhoneEmpty: (value: boolean) => void;
  setPhoneValid: (value: boolean) => void;
  setCCode: Dispatch<boolean>;
  setRCode: Dispatch<boolean>;
  isNameEmpty: boolean;
  isNameValid: boolean;
  isEmailEmpty: boolean;
  isEmailValid: boolean;
  isPhoneEmpty: boolean;
  isPhoneValid: boolean;
  emailPattern: RegExp;
  isCCodeEmpty: boolean;
  isRCodeEmpty: boolean;
  addDetails: () => void;
  isAllValid: boolean;
  pendingDetails: PendingProfileParams;
  setPendingsDetails: Dispatch<PendingProfileParams>;
}

const SignupModal: FC<SignupModalProps> = ({
  showPendingModal,
  setPendingModal,
  article,
  setNameEmpty,
  setNameValid,
  setEmailEmpty,
  setEmailValid,
  setPhoneEmpty,
  setPhoneValid,
  setCCode,
  setRCode,
  emailPattern,
  isNameEmpty,
  isNameValid,
  isEmailEmpty,
  isEmailValid,
  isPhoneEmpty,
  isPhoneValid,
  isCCodeEmpty,
  isRCodeEmpty,
  addDetails,
  isAllValid,
  pendingDetails,
  setPendingsDetails,
}: SignupModalProps): JSX.Element => {
  const loadDummyImage = (e: any): any => {
    e.target.src = DummyImage;
  };

  const updateValidation = (value: string, key: string): void => {
    switch (key) {
      case 'name':
        if (value === '') {
          setNameEmpty(true);
          setNameValid(true);
        } else if (value?.length < 2) {
          setNameValid(false);
          setNameEmpty(false);
        } else {
          setNameEmpty(false);
          setNameValid(true);
        }
        break;

      case 'email':
        if (value === '') {
          setEmailEmpty(true);
          setEmailValid(true);
        } else if (!emailPattern.test(value)) {
          setEmailValid(false);
          setEmailEmpty(false);
        } else {
          setEmailEmpty(false);
          setEmailValid(true);
        }
        break;
      case 'phoneNumber':
        if (value === '') {
          setPhoneEmpty(true);
          setPhoneValid(true);
        } else if (!/^\+?$|^\+?\d{10}$/.test(value)) {
          setPhoneValid(false);
          setPhoneEmpty(false);
        } else {
          setPhoneEmpty(false);
          setPhoneValid(true);
          if (pendingDetails?.countryCode !== '') {
            setCCode(false);
          } else {
            setCCode(true);
          }
        }
        break;
      case 'countryCode':
        if (value === '') {
          setCCode(true);
        } else {
          setCCode(false);
        }
        break;
      case 'rCountryCode':
        if (pendingDetails?.referrerPhoneNumber !== '' && value?.length === 0) {
          setRCode(true);
        } else {
          setRCode(false);
        }
        break;
      case 'referrerPhoneNumber':
        if (pendingDetails?.rCountryCode !== '') {
          setRCode(false);
        } else {
          setRCode(true);
        }
        break;
      default:
    }
  };

  const onChangeField = (value: string, key: string): void => {
    updateValidation(value, key);
    if (key.match(/phoneNumber|referrerPhoneNumber/)) {
      if (/^[0-9\b]+$/.test(value) || value?.length === 0) {
        setPendingsDetails({ ...pendingDetails, [key]: value });
      }
    } else {
      setPendingsDetails({ ...pendingDetails, [key]: value });
    }
  };

  return (
    <Modal
      show={showPendingModal}
      onHide={(): void => setPendingModal(false)}
      backdrop="static"
      dialogClassName="modal-70w"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text-center w-100"
        >
          <h3>{`Hi ${article?.result?.name || ''}!`}</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pendingBody">
        <div className="justify-content-center text-center">
          <Image
            className="pmuImage img img-responsive"
            src={article?.result?.image || DummyImage}
            alt="user-image"
            onError={loadDummyImage}
          />
        </div>
        <Form.Label className="labelSt">Name</Form.Label>
        <Form.Control
          className="formInput w-100"
          value={pendingDetails.name}
          onChange={({ target: { value } }): void =>
            onChangeField(value, 'name')
          }
        />
        {isNameEmpty && (
          <Form.Text className="text-danger">Required *</Form.Text>
        )}
        {!isNameValid && (
          <Form.Text className="text-danger">Atleast two character *</Form.Text>
        )}
        <Row>
          <Col>
            <Form.Label className="labelSt">Email</Form.Label>
            <Form.Control
              type="email"
              readOnly
              className="formInput"
              value={pendingDetails.email}
              onChange={({ target: { value } }): void =>
                onChangeField(value, 'email')
              }
            />
            {isEmailEmpty && (
              <Form.Text className="text-danger">Required *</Form.Text>
            )}
            {!isEmailValid && (
              <Form.Text className="text-danger">
                Please enter valid email *
              </Form.Text>
            )}
          </Col>
          <Col>
            <Row>
              <Col md={5}>
                <Form.Label className="labelSt">Code</Form.Label>
                <Form.Control
                  as="select"
                  className="formInput"
                  value={pendingDetails.countryCode}
                  onChange={({ target: { value } }): void =>
                    onChangeField(value, 'countryCode')
                  }
                >
                  <option>-Select-</option>
                  {_.chain(
                    CountryCode.customList(
                      'countryCode',
                      '+{countryCallingCode}'
                    )
                  )
                    .sortBy()
                    .uniq()
                    .map((code) => {
                      return <option key={code}>{code}</option>;
                    })
                    .value()}
                </Form.Control>
                {isCCodeEmpty && (
                  <Form.Text className="text-danger">Required *</Form.Text>
                )}
              </Col>
              <Col md={7}>
                <Form.Label className="labelSt">Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  className="formInput"
                  value={pendingDetails.phoneNumber}
                  onChange={({ target: { value } }): void =>
                    onChangeField(value, 'phoneNumber')
                  }
                />
                {isPhoneEmpty && (
                  <Form.Text className="text-danger">Required *</Form.Text>
                )}
                {!isPhoneValid && (
                  <Form.Text className="text-danger">
                    Enter valid mobile number (10 digits) *
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label className="labelSt">Referrer Email</Form.Label>
            <Form.Control
              type="email"
              className="formInput"
              value={pendingDetails.referrerEmail}
              onChange={({ target: { value } }): void =>
                onChangeField(value, 'referrerEmail')
              }
            />
          </Col>
          <Col>
            <Row>
              <Col md={5}>
                <Form.Label className="labelSt">Code</Form.Label>
                <Form.Control
                  as="select"
                  className="formInput"
                  value={pendingDetails.rCountryCode}
                  onChange={({ target: { value } }): void =>
                    onChangeField(value, 'rCountryCode')
                  }
                >
                  <option>-Select-</option>
                  {_.chain(
                    CountryCode.customList(
                      'countryCode',
                      '+{countryCallingCode}'
                    )
                  )
                    .sortBy()
                    .uniq()
                    .map((code) => {
                      return <option key={code}>{code}</option>;
                    })
                    .value()}
                </Form.Control>
                {isRCodeEmpty && (
                  <Form.Text className="text-danger">Required *</Form.Text>
                )}
              </Col>
              <Col md={7}>
                <Form.Label className="labelSt">Referrer Mobile No</Form.Label>
                <Form.Control
                  type="text"
                  className="formInput"
                  value={pendingDetails.referrerPhoneNumber}
                  onChange={({ target: { value } }): void =>
                    onChangeField(value, 'referrerPhoneNumber')
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="mdFooter">
        <Button
          onClick={addDetails}
          disabled={!isAllValid}
          className={`${!isAllValid && ' normalCursor'}`}
        >
          Register
        </Button>
        <Form.Text className="footerTxt">
          Note: Please enter email or phone no. It’ll help us to verify your
          identity.
        </Form.Text>
      </Modal.Footer>
    </Modal>
  );
};

export default SignupModal;
