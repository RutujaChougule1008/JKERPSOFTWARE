import React, { useState } from 'react';
import EWayBillNEInvoiceGen from './EWayBillNEInvoiceGen';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const EwayBills = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClicked = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={handleClicked}>Generate</button>
      {isOpen && (
        <>
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxHeight: '90%',
            overflow: 'auto',
            backgroundColor: 'white',
            padding: '20px',
            zIndex: 1000,
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxSizing: 'border-box'
          }}>
            <IconButton onClick={handleClose} style={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: 'gray' // Customize color as needed
            }}>
              <CloseIcon />
            </IconButton>
            <EWayBillNEInvoiceGen saleId="18163"/>
          </div>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }} onClick={handleClose} />
        </>
      )}
    </div>
  );
}

export default EwayBills;
