import React, {
  useEffect,
  useState,
  FC,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Accordion,
  Modal,
  Button,
  Form,
  useAccordionToggle,
} from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import lookup from 'country-code-lookup';
import currencies from 'currency-codes';
import { chooseDummyImage } from '../../common/common';
import { Album, Pricing } from '../../../../model/contentModel';

interface PremiumDataProp {
  startTime: Date | null;
  endTime: Date | null;
  pricing: {
    code: string;
    country: string;
    currency: string;
    price: number;
    gateway: 'braintree' | 'razorpay';
  }[];
}

interface PremiumModalProps {
  showPremiumModal: boolean;
  setShowPremiumModal: (value: boolean) => void;
  album: Album;
  collectionFrom: 'performers' | 'sabhas' | 'venues';
  premiumData: PremiumDataProp;
  setPremiumData: Dispatch<SetStateAction<PremiumDataProp>>;
  addPremiumContent: () => void;
  isEdit?: boolean;
  changeAsRegular: (album: Album) => void;
}

const AccordionToggle = ({ eventKey, showDate, onDateChange }) => {
  const decoratedOnClick = useAccordionToggle(eventKey);
  const onToggle = (): void => {
    decoratedOnClick(eventKey);
    onDateChange();
  };
  return (
    <div className="custom-control custom-switch">
      <input
        type="checkbox"
        className="custom-control-input"
        style={{ fontSize: 14 }}
        id="date"
        checked={showDate}
        onChange={onToggle}
        readOnly
      />
      <label className="custom-control-label" htmlFor="date">
        Time Restricted
      </label>
    </div>
  );
};

const PremiumModal: FC<PremiumModalProps> = ({
  showPremiumModal,
  setShowPremiumModal,
  album,
  collectionFrom,
  premiumData,
  setPremiumData,
  addPremiumContent,
  isEdit = false,
  changeAsRegular,
}: PremiumModalProps): JSX.Element => {
  //   const [isValidSDate, setValidSDate] = useState<boolean>(true);
  //   const [isValidEDate, setValidEDate] = useState<boolean>(true);
  const [isValidDates, setValidDates] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [isPricingSelected, setIsPricingSelected] = useState<boolean>(false);
  const [isPricingAdded, setPricingAdded] = useState<boolean>(true);
  const [isPricingEdit, setPricingEdit] = useState<boolean>(false);
  const [selectedPricingIndex, setSelectedPricingIndex] = useState<
    null | number
  >(null);
  const [isOtherCountry, setIsOtherCountry] = useState<boolean>(true);
  const [showDate, setDatePicker] = useState<boolean>(false);
  const [showDateEvent, setShowDateEvent] = useState<string>('');

  useEffect(() => {
    if (cost?.length > 0 && selectedCountry.length > 0) {
      setIsPricingSelected(true);
    } else {
      setIsPricingSelected(false);
    }
  }, [cost, selectedCountry]);

  const dummyImage: string = chooseDummyImage(collectionFrom);
  const loadDummyImage = (e: any): any => {
    e.target.src = dummyImage;
  };
  //   const disableDateTime = !(
  //     moment(premiumData.startTime).valueOf() > moment().valueOf()
  //   );

  const onChangeField = (value, field): void => {
    setPremiumData((data) => ({ ...data, [field]: value }));
  };

  const onChagePricing = (
    value: string,
    field: 'country' | 'currency' | 'price'
  ): void => {
    switch (field) {
      case 'country':
        setSelectedCountry(value);
        break;
      case 'currency':
        setSelectedCurrency(value);
        break;
      case 'price':
        addCost(value);
      default:
    }
    if (isPricingEdit) {
      const regionCost = premiumData.pricing;
      regionCost.splice(selectedPricingIndex, 1, {
        ...regionCost[selectedPricingIndex],
        [field]: field === 'price' ? parseInt(value, 10) : value,
      });
      setPremiumData((data) => ({ ...data, pricing: regionCost }));
    }
  };

  const addCountry = (): void => {
    const regionCost = premiumData.pricing;
    const code = lookup.byCountry(selectedCountry)?.iso2 || 'OT';
    const pricingObj: any = {
      code,
      country: selectedCountry,
      price: parseInt(cost, 10),
      currency: selectedCurrency,
      gateway: code === 'US' ? 'braintree' : 'razorpay',
    };
    const isalreadyPresent = premiumData.pricing.findIndex(
      (price) => price.code === code
    );
    if (isPricingEdit) {
      regionCost.splice(selectedPricingIndex, 1, pricingObj);
    } else if (isalreadyPresent !== -1) {
      regionCost.splice(isalreadyPresent, 1, pricingObj);
    } else {
      regionCost.push(pricingObj);
    }
    setSelectedCountry('');
    setCost('');
    setSelectedCurrency('');
    setPricingEdit(false);
    setPremiumData((data) => ({ ...data, pricing: regionCost }));
  };

  const removeCountry = (index: number): void => {
    const regionCost = premiumData.pricing;
    regionCost.splice(index, 1);
    setPremiumData((data) => ({ ...data, pricing: regionCost }));
  };

  const submitPremium = (): void => {
    const { startTime, endTime, pricing } = premiumData;
    const validSTime = moment(startTime).isValid();
    const validETime = moment(endTime).isValid();
    const validDate =
      validSTime || validETime
        ? moment(startTime).valueOf() < moment(endTime).valueOf()
        : true;
    const pricingAdded = pricing.length > 0;
    const isOtherIndex = pricing?.findIndex((o) => o.country === 'Other');
    const isOtherAdded = isOtherIndex !== -1;
    setValidDates(validDate);
    setPricingAdded(pricingAdded);
    setIsOtherCountry(isOtherAdded);
    if (validDate && pricingAdded && isOtherAdded) {
      addPremiumContent();
      setShowPremiumModal(false);
    }
  };

  const addCost = (value: string): void => {
    const pat = /^[0-9\b]+$/;
    if (value.length === 0 || pat.test(value)) {
      setCost(value);
    }
  };

  const populatePricing = (obj: Pricing, index: number): void => {
    setSelectedCountry(obj.country);
    setCost(obj.price.toString());
    setSelectedCurrency(obj.currency);
    setSelectedPricingIndex(index);
    setPricingEdit(true);
  };

  const onDateChange = (): void => {
    setDatePicker((v) => !v);
    setShowDateEvent((v) => {
      if (v === '') {
        return '0';
      }
      setPremiumData((value) => ({ ...value, startTime: null, endTime: null }));
      return '';
    });
  };

  return (
    <Container>
      <Modal
        show={showPremiumModal}
        onHide={(): void => setShowPremiumModal(false)}
        backdrop="static"
        dialogClassName="modal-70w"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="text-center w-100"
          >
            Premium Content
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pendingBody">
          <ImageRow>
            <PremiumImage
              id="albumImage"
              src={album.image}
              alt="eventImage"
              onError={loadDummyImage}
            />
            <TextColumn>
              <UploadTxt>{album.title}</UploadTxt>
            </TextColumn>
          </ImageRow>
          <Accordion defaultActiveKey={showDateEvent} style={{ marginTop: 15 }}>
            <AccordionToggle {...{ eventKey: '0', showDate, onDateChange }} />
            <Accordion.Collapse eventKey="0">
              <FieldRow>
                <DateBlock style={{ marginRight: '0.5rem' }}>
                  <Label>Start Date & Time&nbsp;</Label>
                  <DateTimePicker
                    format="dd/MM/yyyy hh:mm a"
                    onChange={(value): void =>
                      onChangeField(value, 'startTime')
                    }
                    value={
                      premiumData.startTime !== null
                        ? new Date(premiumData.startTime)
                        : null
                    }
                  />
                </DateBlock>
                <DateBlock>
                  <Label>End Date & Time &nbsp;</Label>
                  <DateTimePicker
                    format="dd/MM/yyyy hh:mm a"
                    onChange={(value): void => onChangeField(value, 'endTime')}
                    value={
                      premiumData.endTime !== null
                        ? new Date(premiumData.endTime)
                        : null
                    }
                  />
                </DateBlock>
              </FieldRow>
            </Accordion.Collapse>
          </Accordion>

          {!isValidDates && (
            <Form.Text className="text-danger">
              Please select valid dates
            </Form.Text>
          )}
          <FieldRow>
            <Column style={{ marginRight: 10 }}>
              <Label>Country</Label>
              <Form.Control
                as="select"
                className="formInput"
                value={selectedCountry}
                onChange={({ target: { value } }): void =>
                  onChagePricing(value, 'country')
                }
              >
                <option>-Select-</option>
                {[{ iso2: 'OT', country: 'Other' }, ...lookup.countries].map(
                  (region) => {
                    return <option key={region.iso2}>{region.country}</option>;
                  }
                )}
              </Form.Control>
            </Column>
            <Column style={{ marginRight: 10 }}>
              <Label>Currency</Label>
              <Form.Control
                as="select"
                className="formInput"
                value={selectedCurrency}
                onChange={({ target: { value } }): void =>
                  onChagePricing(value, 'currency')
                }
              >
                <option>-Select-</option>
                {currencies.data.map((currency) => {
                  return <option key={currency.code}>{currency.code}</option>;
                })}
              </Form.Control>
            </Column>
            <Column>
              <FieldRow>
                <PerfomerColumn>
                  <Label>Cost</Label>
                  <Form.Control
                    className="formInput"
                    value={cost}
                    onChange={({ target: { value } }): void =>
                      onChagePricing(value, 'price')
                    }
                  />
                </PerfomerColumn>
                <ButtonColum>
                  {selectedCountry?.length !== 0 &&
                    cost?.length !== 0 &&
                    selectedCountry?.length !== 0 && (
                      <AddPerformerButton
                        isPricingEdit={isPricingEdit}
                        role="button"
                        tabIndex={0}
                        onKeyDown={addCountry}
                        onClick={addCountry}
                      >
                        <i
                          className={`fa ${
                            !isPricingEdit ? 'fa-plus-circle' : 'fa-times'
                          }`}
                        />
                      </AddPerformerButton>
                    )}
                </ButtonColum>
              </FieldRow>
            </Column>
          </FieldRow>
          <FieldRow>
            <Label>
              Added Countries
              <span className="text-danger">*</span>
            </Label>
          </FieldRow>
          {!isPricingAdded && (
            <Form.Text className="text-danger">Please add pricing.</Form.Text>
          )}
          {isPricingAdded && !isOtherCountry && (
            <Form.Text className="text-danger">
              The current definitions do not cover the entire world. Please
              define one with "OTR" (Other) as the country code.
            </Form.Text>
          )}
          {premiumData.pricing.length > 0 && (
            <RegionWithCost>
              {premiumData.pricing.map((priceObj: Pricing, index: number) => {
                return (
                  <RegionRow key={priceObj.code}>
                    <RegionCost
                      onClick={(): void => populatePricing(priceObj, index)}
                    >
                      <Title>{`${priceObj.country} - ${priceObj.currency} ${priceObj.price}`}</Title>
                    </RegionCost>
                    <RemoveCountry onClick={(): void => removeCountry(index)}>
                      <i className="fa fa-times" />
                    </RemoveCountry>
                  </RegionRow>
                );
              })}
            </RegionWithCost>
          )}
        </Modal.Body>
        <Modal.Footer className="mdFooter">
          <Footer>
            <Button onClick={submitPremium} variant="warning">
              {/* {isEdit ? 'Update' : 'Save'} */}
              Save
            </Button>
            {isEdit && (
              <Button
                style={{ margin: '0 1rem' }}
                onClick={(): void => changeAsRegular(album)}
                variant="warning"
              >
                Make album non-premium
              </Button>
            )}
          </Footer>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

PremiumModal.defaultProps = {
  isEdit: false,
};

const Container = styled.div``;
const Label = styled.label`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
`;
const ImageRow = styled.div`
  display: flex;
`;
const TextColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
`;
const PremiumImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 5px;
`;
const UploadTxt = styled.small`
  color: ${({ theme }): string => theme.black};
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
`;
const FieldRow = styled.div`
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1;
`;
const DateBlock = styled.div`
  flex: 1 1;
`;

const Footer = styled.div`
  button {
    font-weight: bold;
    padding: 0.375rem 1.5rem;
  }
`;
const Column = styled.div`
  flex: 1 1;
`;
const PerfomerColumn = styled.div`
  flex: 10 1;
  margin-right: 10px;
`;
const AddPerformerButton = styled.span<{ isPricingEdit: boolean }>`
  .fa {
    font-size: 25px;
    color: ${({ isPricingEdit, theme }) =>
      isPricingEdit ? theme?.primary : theme?.green};
    cursor: pointer;
  }
`;
const ButtonColum = styled.div`
  flex: 1 1;
  justify-content: center;
  align-items: cetner;
  display: flex;
  margin-top: 28px;
`;
const RegionWithCost = styled.div`
  max-height: 200px;
  overflow: auto;
`;
const RegionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
  cursor: pointer;
`;
const RegionCost = styled.div`
  width: 93%;
  margin-left: 1rem;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
`;
const Title = styled.span`
  font-size: 14px;
  width: 100%;
  display: -webkit-box;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
const RemoveCountry = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.3rem 0 0.5rem;
  cursor: pointer;
  color: ${({ theme }): string => theme.primary};
  height: 50px;
  i {
    font-size: 18px;
  }
`;

export default PremiumModal;
