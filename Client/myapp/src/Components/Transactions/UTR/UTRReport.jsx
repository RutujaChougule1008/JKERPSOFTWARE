import React, { useState } from "react";
import logo from "../../../Assets/jklogo.png";
import Sign from "../../../Assets/jklogo.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

const UTRReport = ({ doc_no, disabledFeild }) => {
    const API_URL = process.env.REACT_APP_API;
    const apikey = process.env.REACT_APP_API_URL;
    const companyCode = sessionStorage.getItem("Company_Code");
    const Year_Code = sessionStorage.getItem("Year_Code");
    
    const [pdfBlob, setPdfBlob] = useState(null);

    const fetchDataAndPreview = async () => {
        try {
            const response = await fetch(
                `${API_URL}/getUTRReport?Company_Code=${companyCode}&Year_Code=${Year_Code}&doc_no=${doc_no}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            generatePdf(data.all_data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const generatePdf = (data) => {
        const pdf = new jsPDF({ orientation: "portrait" });
        const logoImg = new Image();
        logoImg.src = logo;
        const allData = data[0];
        const totalAmount = parseFloat(allData.amount).toFixed(2);

        logoImg.onload = () => {
            pdf.addImage(logoImg, "PNG", 5, 5, 30, 30);
            pdf.setFontSize(14);
            pdf.text("JK Sugars And Commodities Pvt. Ltd.", 40, 10);
            pdf.setFontSize(8);
            pdf.text("(Formerly known as JK eBuySugar Pvt. Ltd.)", 40, 15);
            pdf.text("DABHOLKAR CORNER, 4TH FLOOR, AMATYA TOWER, NEW SHAHUPURI, 329, E-WARD,", 40, 20);
            pdf.text("Kolhapur-416002 (Maharashtra)", 40, 25);
            pdf.text("Tel: (0231) 6688888 / 6688889 / 6688890", 40, 30);
            pdf.text("Email: lnfo@ebuysugars.com .GST NO 27AAECJ8332R1ZV / PAN .AAECJ8332R", 40, 35);
            pdf.setFontSize(12);
            pdf.setLineWidth(0.3);
            pdf.line(10, 38, 200, 38);
            pdf.setFontSize(7);
            pdf.text("Ref No:", 10, 43);
            pdf.text(`${allData.doc_no}`, 18, 43);
            pdf.text("Date:", 180, 43);
            pdf.text(`${allData.doc_date}`, 188, 43);
            pdf.line(10, 45, 200, 45);
            pdf.setFontSize(8);
            pdf.text("Subject:Payment Details", 70, 50);
            // Set font size to ensure consistency
// Set font size for consistency
pdf.setFontSize(8);

// Add text with normal font
pdf.setFont("helvetica", "normal");
pdf.text("To,", 10, 55);

// Bold the account name
pdf.setFont("helvetica", "bold");
pdf.text(`${allData.Ac_Name_E}`, 10, 60);

// Normal font for labels
pdf.setFont("helvetica", "normal");
pdf.text("Address:", 10, 65);

// Bold the address
pdf.setFont("helvetica", "bold");
pdf.text(allData.Address_E, 10, 70);

// Continue with normal font for labels and bold for data fields
pdf.setFont("helvetica", "normal");
pdf.text("City:", 10, 75);

pdf.setFont("helvetica", "bold");
pdf.text(allData.city_name_e, 16, 75);

pdf.setFont("helvetica", "normal");
pdf.text("Pin:", 10, 80);

pdf.setFont("helvetica", "bold");
pdf.text(allData.Pincode, 16, 80);

pdf.setFont("helvetica", "normal");
pdf.text("State:", 10, 85);

pdf.setFont("helvetica", "bold");
pdf.text(allData.state || "Maharashtra", 18, 85);

pdf.setFont("helvetica", "normal");
pdf.text("Respected Sir,", 10, 95);

// Check if the deposit text fits in one line
const depositText = `Here with we deposited Rs: ${totalAmount} In Your Account By Ref.No/Utr No.: ${allData.utr_no}`;
const maxWidth = 180;
const textWidth = pdf.getTextWidth(depositText);

if (textWidth <= maxWidth) {
    pdf.setFont("helvetica", "bold");
    pdf.text(depositText, 10, 100);
} else {
    // Split the text and apply bold formatting
    const firstPart = `Herewith we deposited Rs: ${totalAmount}`;
    const secondPart = `In Your Account By Ref.No/Utr No.: ${allData.utr_no}`;
    
    pdf.setFont("helvetica", "bold");
    pdf.text(firstPart, 10, 100);
    pdf.text(secondPart, 10, 105);
}

// Normal font for remaining message
pdf.setFont("helvetica", "normal");
pdf.text("Please credit the same.", 10, 110);


            const signImg = new Image();
            signImg.src = Sign;
            signImg.onload = () => {
                pdf.addImage(signImg, "PNG", 160, 135, 30, 20);
                pdf.text("For, JK Sugars And Commodities Pvt. Ltd", 140, 160);
                pdf.text("Authorised Signatory", 160, 165);

                const generatedPdfBlob = pdf.output("blob");
                setPdfBlob(generatedPdfBlob);

                // Open PDF and options in a new tab
                openPreviewInNewTab(generatedPdfBlob);
            };
        };
    };

    const openPreviewInNewTab = (pdfBlob) => {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const newWindow = window.open();

        newWindow.document.write(`
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
                    </style>
                </head>
                <body>
                    <div class="top-row">
                        <input type="email" placeholder="Enter email address" id="emailInput" />
                        <button onclick="sendEmail()">Email PDF</button>
                        <input type="tel" placeholder="Enter WhatsApp number" id="whatsappInput" />
                        <button onclick="sendWhatsApp()">WhatsApp PDF</button>
                    </div>
                    <embed src="${pdfUrl}" width="100%" height="80%" />

                    <script>
                       function sendEmail() {
    const email = document.getElementById("emailInput").value.trim();
    if (!email) {
        alert("Please enter a valid email address.");
        return;
    }

    fetch("${pdfUrl}")
        .then(res => res.blob())
        .then(pdfBlob => {
            const formData = new FormData();
            formData.append("pdf", pdfBlob, "JKSugars_${doc_no}.pdf");
            formData.append("email", email);

            fetch("${apikey}/api/sugarian/send-pdf-email", {
                method: "POST",
                body: formData,
            })
            .then(response => {
                // Try to parse JSON, handle if response is not JSON
                return response.json().catch(() => {
                    return { message: "Email sent, but response was not JSON." };
                });
            })
            .then(data => alert(data.message || "Email sent successfully!"))
            .catch(error => console.error("Error sending email:", error));
        })
        .catch(error => console.error("Failed to fetch PDF blob:", error));
}

                        function sendWhatsApp() {
                            const whatsappNumber = document.getElementById("whatsappInput").value.trim();
                            if (!whatsappNumber) {
                                alert("Please enter a WhatsApp number.");
                                return;
                            }
                            const whatsappLink = \`https://wa.me/\${whatsappNumber}?text=Please find the attached PDF: ${pdfUrl}\`;
                            window.open(whatsappLink, "_blank");
                        }
                    </script>
                </body>
            </html>
        `);

        newWindow.document.close();
    };

    return (
        <div id="pdf-content" className="centered-container">
            <button disabled={disabledFeild} onClick={fetchDataAndPreview}>
                Print
            </button>
        </div>
    );
};

export default UTRReport;
