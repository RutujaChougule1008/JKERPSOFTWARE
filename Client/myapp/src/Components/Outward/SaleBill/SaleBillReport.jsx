import React, { useState, useEffect } from "react";
import "./invoice.css";
import logo from "../../../Assets/jklogo.png";
import Sign from "../../../Assets/jklogo.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCode from "qrcode";
import PdfPreview from "../SaleBill/EWayBillReport/PdfPreview";
import generateHeader from './Header'

const API_URL = process.env.REACT_APP_API;
const companyCode = sessionStorage.getItem("Company_Code");
const Year_Code = sessionStorage.getItem("Year_Code");

const SaleBillReport = ({ doc_no, disabledFeild }) => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const numberToWords = (num) => {
    const belowTwenty = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const scales = ["", "Thousand", "Lakh", "Crore"];

    const words = (num) => {
      if (num === 0) return "";
      if (num < 20) return belowTwenty[num];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + belowTwenty[num % 10] : "")
        );
      if (num < 1000)
        return (
          belowTwenty[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 !== 0 ? " and " + words(num % 100) : "")
        );

      if (num < 100000) {
        return (
          words(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 !== 0 ? ", " + words(num % 1000) : "")
        );
      } else if (num < 10000000) {
        return (
          words(Math.floor(num / 100000)) +
          " Lakh" +
          (num % 100000 !== 0 ? ", " + words(num % 100000) : "")
        );
      } else {
        return (
          words(Math.floor(num / 10000000)) +
          " Crore" +
          (num % 10000000 !== 0 ? ", " + words(num % 10000000) : "")
        );
      }
    };

    const convertFraction = (fraction) => {
      if (fraction === 0) return "Zero Paise";
      return words(fraction) + " Paise";
    };

    const integerPart = Math.floor(num);
    const fractionPart = Math.round((num - integerPart) * 100);

    let result = words(integerPart) + " Rupees";

    if (fractionPart > 0) {
      result += " and " + convertFraction(fractionPart);
    } else {
      result += " Only";
    }

    return result;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/generating_saleBill_report?Company_Code=${companyCode}&Year_Code=${Year_Code}&doc_no=${doc_no}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      
      setInvoiceData(data.all_data);
      generatePdf(data.all_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generatePdf = async (data) => {
    const pdf = new jsPDF({ orientation: "portrait" });
    const allData = data?.[0] || {};

    let qrCodeData = "";
    qrCodeData = ` GSTN of Supplier: ${allData.companyGSTNo || ""}\n
    GSTIN of Buyer: ${allData.billtogstno || ""}\n
    Document No: ${allData.doc_no || ""}\n
    Document Type: Tax Invoice\n
    Date Of Creation Of Invoice: ${allData.doc_date || ""}\n
    HSN Code: ${allData.HSN || ""}\n
    IRN: ${allData.einvoiceno || ""}\n
    Receipt Number:`;

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData.trim(), {
        width: 300,
        height: 300,
    });

    pdf.addImage(qrCodeDataUrl, "PNG", 170, 0, 30, 30);
    generateHeader(pdf);

    const totalAmount = parseFloat(allData.TCS_Net_Payable);
    const totalAmountWords = numberToWords(totalAmount);
    const tableData = [
        ["Reverse Charge", "No"],
        ["Invoice No:", `SB${allData.doc_no}`],
        ["Invoice Date:", allData.doc_dateConverted],
        ["DONo:", allData.DO_No],
        ["State:", allData.companyStateName],
        ["State Code:", allData.companyGSTStateCode],
        ["Buyer,"], 
        [allData.billtoname],
        [allData.billtoaddress],
        [allData.billtocitystate + ' ' + allData.billtopincode],
        ["Bill To,", , allData.billtomobileto],
        ["City:", allData.billtopin],
        [ "State:", allData.billtocitystate],
        ["Gst NO:", allData.billtogstno],
        ["State Code:", allData.billtogststatecode],
        ["PAN No:",allData.billtopanno],
        ["FSSAI No:", allData.FSSAI_BillTo],
        ["TAN No:", allData.BillToTanNo],
        ["Dispatch From:", allData.FROM_STATION],
    ];

    const buyerData = [
        ["Our GST No:", allData.companyGSTNo],
        ["Transport Mode:", "Road"],
        ["Date Of Supply:", allData.doc_dateConverted],
        ["Place Of Supply:", allData.companyCity],
        [allData.companyStateName],
        ["Consigned To,"],
        [allData.shiptoname],
        [allData.shiptoaddress],
        [allData.shiptocitystate + ' ' + allData.shiptocitypincode],
        ["Ship To,"],
        ["City:", allData.shiptocityname, "State:", allData.shiptocitystate],
        ["Gst NO:", allData.shiptogstno],
        ["FSSAI No:", allData.FSSAI_ShipTo],
        ["TAN No:", allData.ShipToTanNo],
        ["FSSAI No:"],
        ["Lorry No:", allData.LORRYNO],
    ];

    if (tableData && tableData.length > 0) {
      console.log(tableData)
        pdf.autoTable({
            startY: 45,
            margin: { left: 10, right: pdf.internal.pageSize.width / 2 + 10 },
            body: tableData,
            theme: "plain",
            styles: {
                cellPadding: 0.3,
                fontSize: 8,
            },
            didDrawCell: function (data) {
                if (data.row.index === 3) {
                    pdf.setLineWidth(0.3);
                    pdf.setDrawColor(0);
                    const startX = 10;
                    const endX = pdf.internal.pageSize.width / 2;
                    const y = data.cell.y + data.cell.height + 7.9;
                    pdf.line(startX, y, endX, y);
                }
            }
        });
    }
    pdf.setLineWidth(0.3);
    pdf.line(pdf.internal.pageSize.width / 2, 45, pdf.internal.pageSize.width / 2, 140);

    if (buyerData && buyerData.length > 0) {
        pdf.autoTable({
            startY: 45,
            margin: { left: pdf.internal.pageSize.width / 2 + 10, right: 10 },
            body: buyerData,
            theme: "plain",
            styles: {
                cellPadding: 0.8,
                fontSize: 8,
            },
            didDrawCell: function (data) {
                if (data.row.index === 3) {
                    pdf.setLineWidth(0.3);
                    pdf.setDrawColor(0);
                    const startX = pdf.internal.pageSize.width / 2;
                    const endX = pdf.internal.pageSize.width - 10;
                    const y = data.cell.y + data.cell.height+4;
                    pdf.line(startX, y, endX, y);
                }
            }
        });
    }

    pdf.setFontSize(8);
    pdf.setLineWidth(0.3);
    pdf.line(10, 140, 200, 140);
    pdf.text(`Mill Name:${allData.millname}`, 10, 143);
    pdf.text(`FSSAI No:${allData.MillFSSAI_No}`, 130, 143);
    pdf.text(`Refer By,${allData.shiptoshortname}`, 10, 148);
    pdf.text(`Season:${allData.shiptoshortname}`, 70, 148);
    pdf.text(`Dispatched From:${allData.FROM_STATION}`, 10, 153);
    pdf.text(`Lorry No:${allData.FROM_STATION}`, 80, 153);
    pdf.text(`To:${allData.TO_STATION}`, 130, 153);

    pdf.setFontSize(12);
    const particulars = [
        ["Particulars", "Brand Name", "HSN/ACS", "Quntal", "Packing(kg)", "Bags", "Rate", "Value"],
        [allData.itemname, allData.Brand_Name, allData.HSN, allData.Quantal, allData.packing, allData.bags, allData.salerate, allData.item_Amount],
    ];

    pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 20,
        head: [particulars[0]],
        body: particulars.slice(1),
    });

    const eInvoiceData = [
        ["Sale Rate:", allData.salerate],
        ["Grade:", allData.grade],
        ["Eway Bill No:", allData.EWay_Bill_No],
        ["EwayBill ValidDate:", allData.EwayBillValidDate],
        ["eInvoiceNo:", allData.einvoiceno],
        ["Ack:", allData.ackno],
        ["bank Details:", allData.bankdetail],
    ];

    pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 5,
        margin: { left: 10, right: pdf.internal.pageSize.width / 2 },
        body: eInvoiceData,
        theme: "plain",
        styles: {
            cellPadding: 0.5,
            fontSize: 8,
            halign: "left",
            valign: "middle",
        },
        columnStyles: {
            0.5: { fontStyle: 'bold' },
        }
    });

    pdf.setLineWidth(0.3);

    const summaryData = [
        ["Freight:", allData.LESS_FRT_RATE, allData.freight],
        ["Taxable Amount:", "", allData.item_Amount],
        ["CGST:", allData.CGSTRate, allData.CGSTAmount],
        ["SGST:", allData.SGSTRate, allData.SGSTAmount],
        ["IGST:", allData.IGSTRate, allData.IGSTAmount],
        ["Rate Diff:/Qntl:", "", allData.RateDiff],
        ["Other Expense:", "", allData.OTHER_AMT],
        ["Round Off:", "", allData.RoundOff],
        ["Total Amount:", "", allData.TCS_Net_Payable],
        ["TCS:", allData.TCS_Rate, allData.TCS_Amt],
        ["TCS Net Payable:", "", allData.TCS_Net_Payable],
    ];

    pdf.autoTable({
        startY: 175,
        margin: { left: pdf.internal.pageSize.width / 2 },
        body: summaryData,
        theme: "plain",
        styles: {
            cellPadding: 1,
            fontSize: 8,
            halign: "left",
            valign: "middle",
        },
        columnStyles: {
            2: { halign: "right", fontStyle: 'bold' },
        }
    });

    pdf.setFontSize(8);
    const lineY = pdf.lastAutoTable.finalY + 10;
    pdf.setLineWidth(0.3);
    pdf.line(10, lineY - 4, 200, lineY - 4);
    pdf.setFont("helvetica", "bold");

    pdf.text(`${totalAmountWords}.`, 12, lineY);

    pdf.line(10, lineY + 3, 200, lineY + 4);

    pdf.setFontSize(8);
    pdf.text("Our Tan No: JDHJ01852E", 10, pdf.lastAutoTable.finalY + 20);
    pdf.text("FSSAI No: 11516035000705", 60, pdf.lastAutoTable.finalY + 20);
    pdf.text("PAN No: AABHJ9303C", 110, pdf.lastAutoTable.finalY + 20);

    const signImg = new Image();
    signImg.src = Sign;
    signImg.onload = () => {
        pdf.setFontSize(8);
        pdf.addImage(signImg, "PNG", 160, pdf.lastAutoTable.finalY + 25, 30, 20);
        pdf.text("For, JK Sugars And Commodities Pvt. Ltd", 145, pdf.lastAutoTable.finalY + 50);
        pdf.text("Authorised Signatory", 160, pdf.lastAutoTable.finalY + 55);
        // pdf.save("JKSaleBill.pdf")
        const pdfData = pdf.output("datauristring");
        setPdfPreview(pdfData)
    }
};
  return (
    <div id="pdf-content" className="centered-container">
      <button disabled={disabledFeild} onClick={fetchData}>
        Print
      </button>
      {pdfPreview && <PdfPreview pdfData={pdfPreview} apiData={invoiceData} />}
    </div>
  );
};

export default SaleBillReport;
