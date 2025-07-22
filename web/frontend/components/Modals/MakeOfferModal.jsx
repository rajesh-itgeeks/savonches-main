import React, { useEffect, useState } from 'react';
import {
  Modal,
  TextField,
  Button,
  FormLayout,
  Text,
  Spinner,
} from '@shopify/polaris';

const MakeOfferModal = ({ open, onClose, onSubmit ,quoteData}) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  console.log("---------------------quoteDtaaaa",quoteData?.quoteId)
  const [quoteNumber, setQuoteNumber] = useState('');

  const handleSubmit = () => {
    onSubmit({ quoteNumber, offerPrice, expirationDate });
    onClose();
  };
  useEffect(() => {
  if (quoteData?.quoteId) {
    setQuoteNumber(quoteData.quoteId);
  }
}, [quoteData?.quoteId]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Make Offer"
      primaryAction={{
        content: 'Send Offer',
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Quote number"
            value={quoteNumber ? quoteNumber : <Spinner/>}
            onChange={setQuoteNumber}
            autoComplete="off"
            disabled
          />
          <TextField
            label="Offer price"
            type="number"
            value={offerPrice}
            onChange={setOfferPrice}
            autoComplete="off"
            prefix="$"
          />
          <TextField
            label="Expiration date"
            value={expirationDate}
            onChange={setExpirationDate}
            autoComplete="off"
            placeholder="dd/mm/yyyy"
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
};

export default MakeOfferModal;