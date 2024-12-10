import React, { useEffect } from 'react';

const PdfPreview = ({ pdfData,apiData}) => {
  useEffect(() => {
    const pdfWindow = window.open('', '_blank');
    if (!pdfWindow) {
      alert("Popup blocked! Please allow popups for this website.");
      return;
    }

    pdfWindow.document.write(`
      <html>
        <head>
          <title>PDF Preview</title>
          <style>
            .top-row {
              display: flex;
              gap: 10px;
              margin: 10px;
            }
            .top-row input {
              padding: 5px;
              font-size: 14px;
            }
            .top-row button {
              padding: 6px 12px;
              font-size: 14px;
            }
            .embed-container {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="top-row">
            <input type="email" placeholder="Enter email address" id="emailInput" />
            <button id="emailButton" onClick="emailButton">Email PDF</button>
            <input type="tel" placeholder="Enter WhatsApp number" id="whatsappInput" />
            <button id="whatsappButton">WhatsApp PDF</button>
          </div>
          <div class="embed-container">
            <embed src="${pdfData}" width="100%" height="100%" />
          </div>
        </body>
      </html>
    `);
    pdfWindow.document.close();

   
    pdfWindow.onload = () => {
      const emailButton = pdfWindow.document.getElementById('emailButton');
      const emailInput = pdfWindow.document.getElementById('emailInput');
      const whatsappButton = pdfWindow.document.getElementById('whatsappButton');
      const whatsappInput = pdfWindow.document.getElementById('whatsappInput');

      emailInput.value = apiData?.Buyer_Email_Id?.trim() || "";
      emailButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (!email) {
          alert('Please enter a valid email address.');
          return;
        }

        fetch(pdfData)
          .then(res => res.blob())
          .then(pdfBlob => {
            const formData = new FormData();
            formData.append('pdf', pdfBlob, 'JKSugars.pdf');
            formData.append('email', email);

            fetch(`${process.env.REACT_APP_API_URL}/api/sugarian/send-pdf-email`, {
              method: 'POST',
              body: formData,
            })
              .then(response => response.json())
              .then(data => {
                if (pdfWindow) {
                  pdfWindow.alert(data.message || 'Email sent successfully!');
                } else {
                  alert(data.message || 'Email sent successfully!'); 
                }
           } )
              .catch(error => console.error('Error sending email:', error));
          })
          .catch(error => console.error('Failed to fetch PDF blob:', error));
      });

      whatsappButton.addEventListener('click', () => {
        const whatsappNumber = whatsappInput.value.trim();
        if (!whatsappNumber) {
          alert('Please enter a WhatsApp number.');
          return;
        }
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=Please find the attached PDF: ${pdfData}`;
        pdfWindow.open(whatsappLink, '_blank');
      });
    };
  }, [pdfData]);

  return null; 
};

export default PdfPreview;
