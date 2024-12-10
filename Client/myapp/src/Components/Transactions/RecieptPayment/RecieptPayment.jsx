import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ActionButtonGroup from "../../../Common/CommonButtons/ActionButtonGroup";
import NavigationButtons from "../../../Common/CommonButtons/NavigationButtons";
import axios from "axios";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountMasterHelp from "../../../Helper/AccountMasterHelp";
import RecieptVoucherNoHelp from "../../../Helper/RecieptVoucherNoHelp";
import { HashLoader } from "react-spinners";
import "./RecieptPayment.css";

var lblbankname;
var newcashbank;
var newcredit_ac;
var lblacname;
var newUnitCode;
var lblUnitname;
var newAcadjAccode;
var lblAcadjAccodename;
var newVoucher_No;
var globalTotalAmount = 0.0;
const RecieptPayment = () => {
  const API_URL = process.env.REACT_APP_API;
  const companyCode = sessionStorage.getItem("Company_Code");
  const YearCode = sessionStorage.getItem("Year_Code");

  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [addOneButtonEnabled, setAddOneButtonEnabled] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);
  const [cancelButtonEnabled, setCancelButtonEnabled] = useState(true);
  const [editButtonEnabled, setEditButtonEnabled] = useState(false);
  const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);
  const [backButtonEnabled, setBackButtonEnabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState(null);
  const [cancelButtonClicked, setCancelButtonClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [accountCode, setAccountCode] = useState("");
  const [cashbankcode, setcashbankcode] = useState("");
  const [cashbankcodeid, setcashbankcodeid] = useState("");
  const [Creditcodecode, setCreditcodecode] = useState("");
  const [Creditcodecodeid, setCreditcodecodeid] = useState("");
  const [Creditcodecodename, setCreditcodecodename] = useState("");

  const [unitcodestate, setunitcodestate] = useState("");
  const [unitcodestateid, setunitcodestateid] = useState("");
  const [unitcodestatename, setunitcodestatename] = useState("");

  const [AcadjAccodenamecode, setAcadjAccodenamecode] = useState("");
  const [AcadjAccodenameid, setAcadjAccodenameid] = useState("");
  const [AcadjAccodenamename, setAcadjAccodenamename] = useState("");

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [users, setUsers] = useState([]);
  let [TyanTypeState, setTyanTypeState] = useState("");
  const [secondSelectOptions, setSecondSelectOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("CP");
  const [VoucherNoState, setVoucherNoState] = useState("");
  const [tenderDetails, setTenderDetails] = useState({});
  const [lastTenderDetails, setLastTenderDetails] = useState([]);
  const [lastTenderData, setLastTenderData] = useState({});
  const inputRef= useRef(null)

  const options = {
    CP: [
      { value: "A", text: "--Select--" },
      { value: "T", text: "Against Transport Advance" },
      { value: "N", text: "Against Manualy Purchase" },
      { value: "O", text: "Against OnAc" },
      { value: "Z", text: "Advance Payment" },
      { value: "Q", text: "Other Payment" },
    ],
    BP: [
      { value: "A", text: "--Select--" },
      { value: "T", text: "Against Transport Advance" },
      { value: "N", text: "Against Manualy Purchase" },
      { value: "O", text: "Against OnAc" },
      { value: "Z", text: "Advance Payment" },
      { value: "Q", text: "Other Payment" },
    ],
    CR: [
      { value: "X", text: "Against RetailSale Bill" },
      { value: "Y", text: "Against SaleBill" },
      { value: "Q", text: "Other Payment" },
    ],
    BR: [
      { value: "S", text: "Against Sauda" },
      { value: "B", text: "Against SaleBill" },
      { value: "D", text: "Against Debit Note" },
      { value: "P", text: "Against Credit Bill" },
      { value: "O", text: "Against OnAc" },
      { value: "R", text: "OAgainst RetailSale Bill" },
      { value: "Q", text: "Other Payment" },
    ],
  };

  const [formDataDetail, setFormDataDetail] = useState({
    credit_ac: "",
    Unit_Code: 0,
    amount: 0,
    narration: 0,
    narration2: "",
    detail_id: 1,
    Voucher_No: 0,
    Voucher_Type: "",
    Adjusted_Amount: 0.0,
    Tender_No: 0,
    TenderDetail_ID: 0,
    drpFilterValue: "O",
    ca: 0,
    uc: 0,
    tenderdetailid: null,
    AcadjAccode: 0,
    AcadjAmt: 0.0,
    ac: 0,
    TDS_Rate: 0.0,
    TDS_Amt: 0.0,
    GRN: "",
    TReceipt: "",

    debit_ac: 0,
    ad: 0,
    narration2: "",
    TDS_Rate: 0.0,
    TDS_Amt: 0.0,
    da: 0,
  });

  const navigate = useNavigate();

  const location = useLocation();
  const selectedRecord = location.state?.selectedRecord;
  const tranType = location.state?.tranType;
  const initialFormData = {
    tran_type: tranType ? tranType : "CP",
    doc_no: "",
    doc_date: new Date().toISOString().split("T")[0],
    cashbank: 0,
    total: 0,
    company_code: companyCode,
    year_code: YearCode,
    cb: 0,
    Created_By: "",
    Modified_By: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      return updatedFormData;
    });
  };

  const handleCashBank = (code, accoid) => {
    setcashbankcode(code);
    setcashbankcodeid(accoid);

    setFormData({
      ...formData,
      cashbank: code,
      cb: accoid,
    });
  };

  const handleAcadjAccodename = (code, accoid, name) => {
    setAcadjAccodenamecode(code);
    setAcadjAccodenameid(accoid);
    setAcadjAccodenamename(name);

    setFormDataDetail({
      ...formDataDetail,
      AcadjAccode: code,
      ac: accoid,
      AcadjAcname: name,
    });
  };

  const handleUnitCode = (code, accoid, name) => {
    setunitcodestate(code);
    setunitcodestateid(accoid);
    setunitcodestatename(name);

    setFormDataDetail({
      ...formDataDetail,
      Unit_Code: code,
      uc: accoid,
      Unitname: name,
    });
  };
  const handleAccode = (code, accoid, name) => {
    setCreditcodecode(code);
    setCreditcodecodeid(accoid);
    setCreditcodecodename(name);

    setFormDataDetail({
      ...formDataDetail,
      credit_ac: code,
      ca: accoid,
      AcName: name,
    });
  };
  const handleDropdownvalueChange = (event) => {
    const { name, value } = event.target;
    setFormDataDetail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchLastRecord = () => {
    fetch(
      `${API_URL}/get_next_paymentRecord_docNo?Company_Code=${companyCode}&tran_type=${
        formData.tran_type || tranType
      }&Year_Code=${YearCode}`
    )
      .then((response) => {
        console.log("response", response);
        if (!response.ok) {
          throw new Error("Failed to fetch last record");
        }
        return response.json();
      })
      .then((data) => {
        setFormData((prevState) => ({
          ...prevState,
          doc_no: data.next_doc_no,
        }));
      })
      .catch((error) => {
        console.error("Error fetching last record:", error);
      });
  };

  const handleDetailDropdownChange = (selectedValue) => {
    console.log("selecttype", selectedValue);
    updateSecondSelect(selectedValue);
  };

  const updateSecondSelect = (selectedValue) => {
    setSelectedCategory(selectedValue);
    setSecondSelectOptions(options[selectedValue] || []);
  };

  const handleDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    console.log(`Selected Value: ${selectedValue}`);
    setTyanTypeState(selectedValue || tranType);

    setFormData((prevData) => ({
      ...prevData,
      tran_type: selectedValue || tranType,
    }));
    const response = await axios.get(
      `${API_URL}/get-lastreceiptpayment-navigation?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${selectedValue}`
    );
    if (response.status === 200) {
      const data = response.data;
      const { last_head_data, last_details_data, labels } = data;
      const detailsArray = Array.isArray(last_details_data)
        ? last_details_data
        : [];
      console.log("detailsArray", detailsArray);

      lblbankname = data.labels[0].cashbankname;

      newcashbank = data.last_head_data.cashbank;
      const itemNameMap = labels.reduce((map, label) => {
        if (label.credit_ac !== undefined && label.creditacname) {
          map[label.credit_ac] = label.creditacname;
          map[label.Unit_Code] = label.unitacname;
          map[label.AcadjAccode] = label.adjustedacname;
        }
        return map;
      }, {});

      const enrichedDetails = detailsArray.map((detail) => ({
        ...detail,
        AcName: itemNameMap[detail.credit_ac] || "",
        Unitname: itemNameMap[detail.Unit_Code] || "",
        AcadjAcname: itemNameMap[detail.AcadjAccode] || "",
      }));

      const totalItemAmount = enrichedDetails.reduce((total, user) => {
        return total + parseFloat(user.amount);
      }, 0);
      globalTotalAmount = totalItemAmount.toFixed(2);

      setFormData((prevData) => ({
        ...prevData,
        ...data.last_head_data,
      }));

      setLastTenderData(data.last_head_data || {});
      setLastTenderDetails(enrichedDetails || []);
    } else {
      toast.error(
        "Failed to fetch last data:",
        response.status,
        response.statusText
      );
    }
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);
  };

  const handleAddOne = async () => {
    setAddOneButtonEnabled(false);
    setSaveButtonEnabled(true);
    setCancelButtonEnabled(true);
    setEditButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setIsEditing(true);
    fetchLastRecord();
    setFormData(initialFormData);
    setLastTenderDetails([]);
    globalTotalAmount = "";
    lblbankname = "";
    newcashbank = "";
    newcredit_ac = "";
    lblacname = "";
    newUnitCode = "";
    lblUnitname = "";
    newAcadjAccode = "";
    lblAcadjAccodename = "";
    setCreditcodecodename("");
    let tran_type = TyanTypeState || tranType;

    if (tran_type === "") {
      TyanTypeState = "CP";
    }
    setFormData((prevData) => ({
      ...prevData,
      tran_type: TyanTypeState || tranType,
    }));
    handleDetailDropdownChange(TyanTypeState || tranType);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSaveOrUpdate = async () => {
    setIsLoading(true);
    try {
      const head_data = { ...formData };

      const detail_data = users.map((user) => ({
        rowaction: user.rowaction,
        detail_id: user.detail_id,
        credit_ac: user.credit_ac,
        Unit_Code: user.Unit_Code,
        Voucher_No: user.Voucher_No,
        Voucher_Type: user.Voucher_Type,
        Tender_No: user.Tender_No,
        tenderdetailid: user.tenderdetailid,
        amount: user.amount,
        Adjusted_Amount: user.Adjusted_Amount,
        narration: user.narration,
        narration2: user.narration2,
        drpFilterValue: user.drpFilterValue,
        YearCodeDetail: user.YearCodeDetail,
        trandetailid: user.trandetailid,
        AcadjAmt: user.AcadjAmt,
        AcadjAccode: user.AcadjAccode,
        ca: user.ca,
        uc: user.uc,
        ac: user.ac,
        TDS_Rate: user.TDS_Rate,
        TDS_Amt: user.TDS_Amt,
        GRN: user.GRN,
        TReceipt: user.TReceipt,
        Company_Code: companyCode,
        Year_Code: YearCode,
        Tran_Type: formData.tran_type || tranType,
        debit_ac: formData.cashbank,
        da: formData.da,
        tranid: formData.tranid,
      }));

      const requestData = {
        head_data: {
          ...head_data,
          tranid: isEditMode ? undefined : head_data.tranid,
        },
        detail_data,
      };

      const apiUrl = isEditMode
        ? `${API_URL}/update-receiptpayment?tranid=${formData.tranid}`
        : `${API_URL}/insert-receiptpayment`;

      const response = await axios[isEditMode ? "put" : "post"](
        apiUrl,
        requestData
      );

      if (response.status === 200) {
        const successMessage = isEditMode
          ? "Record updated successfully!"
          : "Data created successfully!";
        console.log(successMessage, response.data);
        toast.success(successMessage);
        setIsEditMode(false);
        setAddOneButtonEnabled(true);
        setEditButtonEnabled(true);
        setDeleteButtonEnabled(true);
        setBackButtonEnabled(true);
        setSaveButtonEnabled(false);
        setCancelButtonEnabled(false);
        setUpdateButtonClicked(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving or updating data:", error);
      toast.error("An error occurred while saving or updating data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setAddOneButtonEnabled(false);
    setSaveButtonEnabled(true);
    setCancelButtonEnabled(true);
    setEditButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setBackButtonEnabled(true);
    setIsEditing(true);
  };
  const handleCancel = async () => {
    debugger;

    const response = await axios.get(
      `${API_URL}/get-lastreceiptpayment-navigation?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${
        formData.tran_type || tranType
      }`
    );
    if (response.status === 200) {
      const data = response.data;
      const { last_head_data, last_details_data, labels } = data;
      const detailsArray = Array.isArray(last_details_data)
        ? last_details_data
        : [];
      console.log("detailsArray", detailsArray);

      lblbankname = data.labels[0].cashbankname;

      newcashbank = data.last_head_data.cashbank;

      const itemNameMap = labels.reduce((map, label) => {
        if (label.credit_ac !== undefined && label.creditacname) {
          map[label.credit_ac] = label.creditacname;
          map[label.Unit_Code] = label.unitacname;
          map[label.AcadjAccode] = label.adjustedacname;
        }
        return map;
      }, {});

      const enrichedDetails = detailsArray.map((detail) => ({
        ...detail,
        AcName: itemNameMap[detail.credit_ac] || "",
        Unitname: itemNameMap[detail.Unit_Code] || "",
        AcadjAcname: itemNameMap[detail.AcadjAccode] || "",
      }));
      const totalItemAmount = enrichedDetails.reduce((total, user) => {
        return total + parseFloat(user.amount);
      }, 0);
      globalTotalAmount = totalItemAmount.toFixed(2);
      setFormData((prevData) => ({
        ...prevData,
        ...data.last_head_data,
        total: globalTotalAmount,
      }));

      setLastTenderData(data.last_head_data || {});
      setLastTenderDetails(enrichedDetails || []);
    } else {
      toast.error(
        "Failed to fetch last data:",
        response.status,
        response.statusText
      );
    }
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this Entry NO ${formData.doc_no}?`
    );

    if (isConfirmed) {
      setIsEditMode(false);
      setAddOneButtonEnabled(true);
      setEditButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setBackButtonEnabled(true);
      setSaveButtonEnabled(false);
      setCancelButtonEnabled(false);
      setIsLoading(true);
      try {
        const deleteApiUrl = `${API_URL}/delete_data_by_tranid?tranid=${
          formData.tranid
        }&company_code=${companyCode}&year_code=${YearCode}&doc_no=${
          formData.doc_no
        }&Tran_Type=${formData.tran_type || tranType}`;
        const response = await axios.delete(deleteApiUrl);
        toast.success("Record deleted successfully!");
        handleCancel();
      } catch (error) {
        toast.error("Deletion cancelled");
        console.error("Error during API call:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  const handleBack = () => {
    navigate("/RecieptPaymentUtility");
  };

  useEffect(() => {
    if (selectedRecord) {
      handleRecordDoubleClicked();
    } else {
      handleAddOne();
    }
  }, [selectedRecord]);

  useEffect(() => {
    const { amount, TDS_Rate } = formDataDetail;
    const TDS_Amt = (amount * TDS_Rate) / 100;
    setFormDataDetail((prevData) => ({
      ...prevData,
      TDS_Amt: TDS_Amt.toFixed(2),
    }));
  }, [formDataDetail.amount, formDataDetail.TDS_Rate]);

  useEffect(() => {
    if (selectedRecord) {
      setUsers(
        lastTenderDetails.map((detail) => ({
          rowaction: "Normal",
          Company_Code: companyCode,
          Year_Code: YearCode,
          Tran_Type: TyanTypeState || tranType,
          credit_ac: detail.credit_ac,
          AcName: detail.AcName,
          Unit_Code: detail.Unit_Code,
          Unitname: detail.Unitname,
          amount: detail.amount,
          narration: detail.narration,
          narration2: detail.narration2,
          detail_id: detail.detail_id,
          Voucher_No: detail.Voucher_No,
          Voucher_Type: detail.Voucher_Type,
          Adjusted_Amount: detail.Adjusted_Amount,
          Tender_No: detail.Tender_No,
          TenderDetail_ID: detail.TenderDetail_ID,
          drpFilterValue: detail.drpFilterValue,
          ca: detail.ca || "",
          uc: detail.uc || "",
          tenderdetailid: detail.tenderdetailid,
          AcadjAccode: detail.AcadjAccode,
          AcadjAcname: detail.adjustedacname,
          AcadjAmt: detail.AcadjAmt,
          ac: detail.ac,
          TDS_Rate: detail.TDS_Rate,
          TDS_Amt: detail.TDS_Amt,
          GRN: detail.GRN,
          TReceipt: detail.TReceipt,
          trandetailid: detail.trandetailid,
          id: detail.trandetailid,
        }))
      );
      console.log(lastTenderDetails);
    }
  }, [selectedRecord, lastTenderDetails]);

  useEffect(() => {
    debugger;
    setUsers(
      lastTenderDetails.map((detail) => ({
        rowaction: "Normal",
        Company_Code: companyCode,
        Year_Code: YearCode,
        Tran_Type: TyanTypeState || tranType,
        credit_ac: detail.credit_ac,
        AcName: detail.AcName,
        Unit_Code: detail.Unit_Code,
        Unitname: detail.Unitname,
        amount: detail.amount,
        narration: detail.narration,
        narration2: detail.narration2,
        detail_id: detail.detail_id,
        Voucher_No: detail.Voucher_No,
        Voucher_Type: detail.Voucher_Type,
        Adjusted_Amount: detail.Adjusted_Amount,
        Tender_No: detail.Tender_No,
        TenderDetail_ID: detail.TenderDetail_ID,
        drpFilterValue: detail.drpFilterValue,
        ca: detail.ca || "",
        uc: detail.uc || "",
        tenderdetailid: detail.tenderdetailid,
        AcadjAccode: detail.AcadjAccode,
        AcadjAcname: detail.adjustedacname,
        AcadjAmt: detail.AcadjAmt,
        ac: detail.ac,
        TDS_Rate: detail.TDS_Rate,
        TDS_Amt: detail.TDS_Amt,
        GRN: detail.GRN,
        TReceipt: detail.TReceipt,
        trandetailid: detail.trandetailid,
        id: detail.trandetailid,
      }))
    );
    console.log("lastTenderDetails", lastTenderDetails);
  }, [lastTenderDetails]);

  const handleNavigation = async (url, headKey, detailsKey) => {
    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const { labels, [headKey]: headData, [detailsKey]: detailsData } = data;

        const DetailsArray = Array.isArray(detailsData) ? detailsData : [];

        const itemNameMap = labels.reduce((map, label) => {
          if (label.credit_ac !== undefined && label.creditacname) {
            map[label.credit_ac] = label.creditacname;
            map[label.Unit_Code] = label.unitacname;
            map[label.AcadjAccode] = label.adjustedacname;
          }
          return map;
        }, {});

        const enrichedDetails = DetailsArray.map((detail) => ({
          ...detail,
          AcName: itemNameMap[detail.credit_ac] || "",
          Unitname: itemNameMap[detail.Unit_Code] || "",
          AcadjAcname: itemNameMap[detail.AcadjAccode] || "",
        }));

        const totalItemAmount = enrichedDetails.reduce(
          (total, user) => total + parseFloat(user.amount),
          0
        );
        globalTotalAmount = totalItemAmount.toFixed(2);

        setFormData((prevData) => ({
          ...prevData,
          ...headData,
          total: globalTotalAmount,
        }));

        setLastTenderData(headData || {});
        setLastTenderDetails(enrichedDetails);
      } else {
        console.error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  // Function to handle the double-click action
  const handleRecordDoubleClicked = async () => {
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);

    const url = `${API_URL}/getreceiptpaymentByid?Company_Code=${companyCode}&tranid=${selectedRecord.tranid}&tran_type=${selectedRecord.tran_type}&doc_no=${selectedRecord.doc_no}&Year_Code=${YearCode}`;

    await handleNavigation(
      url,
      "receipt_payment_head",
      "receipt_payment_details"
    );
  };

  // Navigation Button Handlers
  const handleFirstButtonClick = async () => {
    const url = `${API_URL}/get-firstreceiptpayment-navigation?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}`;
    await handleNavigation(url, "first_head_data", "first_details_data");
  };

  const handlePreviousButtonClick = async () => {
    const url = `${API_URL}/get-previousreceiptpayment-navigation?currentDocNo=${formData.doc_no}&Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}`;
    await handleNavigation(url, "previous_head_data", "previous_details_data");
  };

  const handleNextButtonClick = async () => {
    const url = `${API_URL}/get-nextreceiptpayment-navigation?currentDocNo=${formData.doc_no}&Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}`;
    await handleNavigation(url, "next_head_data", "next_details_data");
  };

  const handleLastButtonClick = async () => {
    const url = `${API_URL}/get-lastreceiptpayment-navigation?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}`;
    await handleNavigation(url, "last_head_data", "last_details_data");
  };

  // Tab Key Down Handler
  const handleKeyDown = async (event) => {
    if (event.key === "Tab") {
      const changeNoValue = event.target.value;
      const url = `${API_URL}/getreceiptpaymentByid?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}&doc_no=${changeNoValue}`;

      await handleNavigation(
        url,
        "receipt_payment_head",
        "receipt_payment_details"
      );
    }
  };

  //Detail Part
  //declaring details function
  const handleChangeDetail = (event) => {
    const { name, value } = event.target;
    let updatedFormDataDetail = { ...formDataDetail, [name]: value };

    setFormDataDetail(updatedFormDataDetail);
  };

  const openPopup = () => {
    setShowPopup(true);
    const selectedValue = formData.tran_type || tranType;

    handleDetailDropdownChange(selectedValue);
  };

  const clearForm = () => {
    setFormDataDetail({
      credit_ac: "",
      Unit_Code: null,
      amount: 0,
      narration: "",
      narration2: null,
      detail_id: 1,
      Voucher_No: null,
      Voucher_Type: "",
      Adjusted_Amount: 0.0,
      Tender_No: 0,
      TenderDetail_ID: 0,
      drpFilterValue: "",
      ca: 0,
      uc: 0,
      tenderdetailid: 0,
      AcadjAccode: 0,
      AcadjAmt: 0.0,
      ac: 0,
      TDS_Rate: 0.0,
      TDS_Amt: 0.0,
      GRN: "",
      TReceipt: "",
    });
  };

  const deleteModeHandler = async (userToDelete) => {
    let updatedUsers;
    const amountToDeduct = parseFloat(userToDelete.amount || 0);

    if (isEditMode && userToDelete.rowaction === "add") {
      updatedUsers = users.map((u) =>
        u.id === userToDelete.id ? { ...u, rowaction: "DNU" } : u
      );
    } else if (isEditMode) {
      updatedUsers = users.map((u) =>
        u.id === userToDelete.id ? { ...u, rowaction: "delete" } : u
      );
    } else {
      updatedUsers = users.map((u) =>
        u.id === userToDelete.id ? { ...u, rowaction: "DNU" } : u
      );
    }

    setFormData((prevData) => ({
      ...prevData,
      total: (parseFloat(prevData.total || 0) - amountToDeduct).toFixed(2),
    }));

    setFormDataDetail({
      ...formDataDetail,
      ...updatedUsers.find((u) => u.id === u.id),
    });
    setUsers(updatedUsers);
    setDeleteMode(true);
    setSelectedUser(userToDelete);
  };

  //close popup function
  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser({});
    clearForm();
  };

  const handleRecieptvoucher = (Tenderno) => {
    setVoucherNoState(Tenderno);

    setFormDataDetail({
      ...formDataDetail,
      Voucher_No: Tenderno,
    });
  };

  const handleTenderDetailsFetched = (details) => {
    console.log("data", details.last_details_data[0]);

    setTenderDetails(details.last_details_data[0]);
    const newData = {
      Voucher_Type: details.last_details_data[0].Tran_Type,
      tenderdetailid: details.last_details_data[0].autoId,
      narration: details.last_details_data[0].Narration,
      YearCodeDetail: details.last_details_data[0].EntryYearCode,
    };

    setFormDataDetail((prevState) => ({
      ...prevState,
      ...newData,
      Tran_Type: TyanTypeState || tranType,
      debit_ac: formData.cashbank,
      da: formData.ca,
    }));

    return newData;
  };
  const updateUser = async () => {
    debugger;
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        const updatedRowaction =
          user.rowaction === "Normal" ? "update" : user.rowaction;

        return {
          ...user,
          rowaction: updatedRowaction,
          credit_ac: Creditcodecode,
          AcName: Creditcodecodename,
          Unit_Code: unitcodestate,
          Unitname: unitcodestatename,
          amount: formDataDetail.amount,
          narration: formDataDetail.narration,
          narration2: formDataDetail.narration2,
          detail_id: user.detail_id,
          Voucher_No: user.Voucher_No,
          Voucher_Type: user.Voucher_Type,
          Adjusted_Amount: user.Adjusted_Amount,
          Tender_No: user.Tender_No,
          TenderDetail_ID: user.TenderDetail_ID,
          drpFilterValue: user.drpFilterValue,
          ca: Creditcodecodeid || "",
          uc: unitcodestateid || "",
          tenderdetailid: user.tenderdetailid,
          AcadjAccode: AcadjAccodenamecode,
          AcadjAmt: formDataDetail.AcadjAmt,
          ac: AcadjAccodenameid,
          TDS_Rate: formDataDetail.TDS_Rate,
          TDS_Amt: user.TDS_Amt,
          GRN: formDataDetail.GRN,
          TReceipt: user.TReceipt,
        };
      } else {
        return user;
      }
    });

    const totalItemAmount = updatedUsers.reduce((total, user) => {
      return total + parseFloat(user.amount);
    }, 0);
    globalTotalAmount = totalItemAmount.toFixed(2);
    setFormData((prevData) => ({
      ...prevData,
      total: globalTotalAmount,
    }));

    setUsers(updatedUsers);

    closePopup();
  };

  const addUser = async () => {
    const nextUserId =
      users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

    const maxDetailId =
      users.length > 0
        ? Math.max(...users.map((user) => user.detail_id)) + 1
        : 1;
    const newUser = {
      id: nextUserId,
      ...formDataDetail,
      detail_id: maxDetailId,
      Voucher_No: tenderDetails.doc_no || newVoucher_No || "",

      rowaction: "add",
    };
    console.log("newuser", newUser);
    const newUsers = [...users, newUser];

    const totalItemAmount = newUsers.reduce((total, user) => {
      return total + parseFloat(user.amount);
    }, 0);
    globalTotalAmount = totalItemAmount.toFixed(2);
    setUsers([...users, newUser]);
    setFormData((prevData) => ({
      ...prevData,

      total: globalTotalAmount,
    }));
    closePopup();
  };

  const editUser = (user) => {
    debugger;

    setSelectedUser(user);
    setFormDataDetail({
      credit_ac: user.credit_ac || "",
      lblacname: user.AcName,
      Unit_Code: user.Unit_Code || "",
      Unitname: user.Unitname,
      amount: user.amount || "",
      narration: user.narration || "",
      narration2: user.narration2 || "",
      detail_id: user.trandetailid,
      Voucher_No: user.Voucher_No || "",
      Voucher_Type: user.Voucher_Type || "",
      Adjusted_Amount: user.Adjusted_Amount || "",
      Tender_No: user.Tender_No || "",
      TenderDetail_ID: user.TenderDetail_ID || "",
      drpFilterValue: user.drpFilterValue || "",
      ca: user.ca || "",
      uc: user.uc || "",
      tenderdetailid: user.tenderdetailid || "",
      AcadjAccode: user.AcadjAccode || "",
      AcadjAcname: user.AcadjAcname,
      AcadjAmt: user.AcadjAmt || "",
      ac: user.ac || "",
      TDS_Rate: user.TDS_Rate || "",
      TDS_Amt: user.TDS_Amt || "",
      GRN: user.GRN || "",
      TReceipt: user.TReceipt || "",
      trandetailid: user.trandetailid,
      id: user.trandetailid,
    });
    setVoucherNoState(user.Voucher_No);
    setCreditcodecodename(user.AcName);
    openPopup();
  };
  const openDelete = async (user) => {
    let updatedUsers;
    const amountToAdd = parseFloat(user.amount || 0);
    setDeleteMode(true);
    setSelectedUser(user);
    if (isEditMode && user.rowaction === "delete") {
      updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, rowaction: "Normal" } : u
      );
    } else {
      updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, rowaction: "add" } : u
      );
    }
    setFormData((prevData) => ({
      ...prevData,
      total: (parseFloat(prevData.total || 0) + amountToAdd).toFixed(2),
    }));
    setFormDataDetail({
      ...formDataDetail,
    });
    setUsers(updatedUsers);
    setSelectedUser({});
  };

  return (
    <>
      <div>
        <ToastContainer autoClose={500}/>
        <h4>Receipt Payment</h4>
        <ActionButtonGroup
          handleAddOne={handleAddOne}
          addOneButtonEnabled={addOneButtonEnabled}
          handleSaveOrUpdate={handleSaveOrUpdate}
          saveButtonEnabled={saveButtonEnabled}
          isEditMode={isEditMode}
          handleEdit={handleEdit}
          editButtonEnabled={editButtonEnabled}
          handleDelete={handleDelete}
          deleteButtonEnabled={deleteButtonEnabled}
          handleCancel={handleCancel}
          cancelButtonEnabled={cancelButtonEnabled}
          handleBack={handleBack}
          backButtonEnabled={backButtonEnabled}
        />
      
        <div>
          {/* Navigation Buttons */}
          <NavigationButtons
            handleFirstButtonClick={handleFirstButtonClick}
            handlePreviousButtonClick={handlePreviousButtonClick}
            handleNextButtonClick={handleNextButtonClick}
            handleLastButtonClick={handleLastButtonClick}
            highlightedButton={highlightedButton}
            isEditing={isEditing}
            isFirstRecord={formData.Company_Code === 1}
          />
        </div>
      </div>
      
      <div>
     
      <form>
      
      <Grid container spacing={2} alignItems="center" sx={{ justifyContent: 'flex-start' }}>
        <Grid item xs={12} sm={2} sx={{ textAlign: 'left' }}>
  <TextField
    label="Change No"
    id="changeNo"
    name="changeNo"
    onKeyDown={handleKeyDown}
    disabled={!addOneButtonEnabled}
    size="small"
  />
</Grid>
</Grid>
<Grid container spacing={2} alignItems="center" sx={{  marginTop: 0.5 }}>
        <Grid item xs={12} sm={1.2}>
          <FormControl fullWidth>
            <InputLabel id="tran_type_label">Tran Type</InputLabel>
            <Select
              labelId="tran_type_label"
              id="tran_type"
              name="tran_type"
              value={formData.tran_type}
              onChange={handleDropdownChange}
              disabled={!addOneButtonEnabled}
              size="small"
            >
              <MenuItem value="CP">Cash Payment</MenuItem>
              <MenuItem value="CR">Cash Receipt</MenuItem>
              <MenuItem value="BP">Bank Payment</MenuItem>
              <MenuItem value="BR">Bank Receipt</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={1}>
          <TextField
            label="Doc No"
            id="doc_no"
            name="doc_no"
            value={formData.doc_no}
            onChange={handleChange}
            disabled={true}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <TextField
            label="Doc Date"
            id="doc_date"
            name="doc_date"
            type="date"
            value={formData.doc_date}
            inputRef={inputRef}
            onChange={handleChange}
            disabled={!isEditing && addOneButtonEnabled}
            fullWidth
            InputLabelProps={{
              shrink: true, // Ensures the label stays above the input
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <AccountMasterHelp
              name="cashbank"
              onAcCodeClick={handleCashBank}
              CategoryName={lblbankname}
              CategoryCode={newcashbank || formData.cb}
              Ac_type=""
              tabIndex={4}
              disabledFeild={!isEditing && addOneButtonEnabled}
              size="small"
            />
          </FormControl>
        </Grid>
      </Grid>
      
    </form>
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-container">
              <HashLoader color="#007bff" loading={isLoading} size={80} />
            </div>
          </div>
        )}

        <div>
          <button
            className="btn btn-primary"
            onClick={openPopup}
            disabled={!isEditing}
            tabIndex="16"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                openPopup();
              }
            }}
          >
            Add
          </button>
          <button
            className="btn btn-danger"
            disabled={!isEditing}
            style={{ marginLeft: "10px" }}
            tabIndex="17"
          >
            Close
          </button>
          {showPopup && (
            <div className="modal" role="dialog" style={{ display: "block" }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {selectedUser.id ? "Edit User" : "Add User"}
                    </h5>
                    <button
                      type="button"
                      onClick={closePopup}
                      aria-label="Close"
                      style={{
                        marginLeft: "80%",
                        width: "60px",
                        height: "30px",
                      }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <label className="debitCreditNote-form-label">
                        Ac_ac:
                      </label>

                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <AccountMasterHelp
                            name="credit_ac"
                            onAcCodeClick={handleAccode}
                            CategoryName={
                              lblacname &&
                              lblacname.trim() &&
                              lblacname !== Creditcodecodename
                                ? lblacname
                                : Creditcodecodename
                            }
                            CategoryCode={
                              newcredit_ac
                                ? newcredit_ac
                                : formDataDetail.credit_ac
                            }
                            Ac_type=""
                            disabledFeild={!isEditing && addOneButtonEnabled}
                          />
                        </div>
                      </div>

                      <label className="debitCreditNote-form-label">
                        Unit_ac:
                      </label>
                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <AccountMasterHelp
                            name="Unit_Code"
                            onAcCodeClick={handleUnitCode}
                            CategoryName={lblUnitname}
                            CategoryCode={
                              newUnitCode || formDataDetail.Unit_Code
                            }
                            Ac_type=""
                            disabledFeild={!isEditing && addOneButtonEnabled}
                          />
                        </div>
                      </div>

                      <label className="debitCreditNote-form-label">
                        Select:
                      </label>

                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <select
                            id="drpFilterValue"
                            name="drpFilterValue"
                            value={formDataDetail.drpFilterValue}
                            onChange={handleDropdownvalueChange}
                            disabled={!isEditing && !addOneButtonEnabled}
                          >
                            {secondSelectOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.text}
                              </option>
                            ))}
                          </select>

                          <label className="debitCreditNote-form-label">
                            Voucher_No:
                          </label>

                          <RecieptVoucherNoHelp
                            onAcCodeClick={handleRecieptvoucher}
                            name="Voucher_No"
                            VoucherNo={
                              newVoucher_No ||
                              VoucherNoState ||
                              formDataDetail.Voucher_No
                            }
                            tabIndexHelp={98}
                            disabledFeild={
                              (!isEditing && addOneButtonEnabled) ||
                              formDataDetail.drpFilterValue === "O"
                            }
                            Accode={formDataDetail.credit_ac}
                            onTenderDetailsFetched={handleTenderDetailsFetched}
                            FilterType={formDataDetail.drpFilterValue}
                            Tran_Type={
                              formData.tran_type || TyanTypeState || tranType
                            }
                          />

                          <label className="debitCreditNote-form-label">
                            Type:
                          </label>

                          <input
                            type="text"
                            tabIndex="5"
                            className="debitCreditNote-form-control"
                            name="Voucher_Type"
                            autoComplete="off"
                            value={formDataDetail.Voucher_Type}
                            disabled={
                              (!isEditing && addOneButtonEnabled) ||
                              formDataDetail.drpFilterValue === "O"
                            }
                            onChange={handleChangeDetail}
                            style={{ maxWidth: 100 }}
                          />
                          <input
                            type="text"
                            className="debitCreditNote-form-control"
                            name="tenderdetailid"
                            autoComplete="off"
                            value={formDataDetail.tenderdetailid}
                            disabled={
                              (!isEditing && addOneButtonEnabled) ||
                              formDataDetail.drpFilterValue === "O"
                            }
                            onChange={handleChangeDetail}
                            style={{ maxWidth: 100 }}
                          />
                        </div>
                      </div>
                      <label className="debitCreditNote-form-label">
                        Amount:
                      </label>
                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <input
                            type="text"
                            className="debitCreditNote-form-control"
                            name="amount"
                            autoComplete="off"
                            value={formDataDetail.amount}
                            onChange={handleChangeDetail}
                          />
                        </div>
                      </div>

                      <label className="debitCreditNote-form-label">
                        Adjusted Amount:
                      </label>
                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <input
                            type="text"
                            className="debitCreditNote-form-control"
                            name="Adjusted_Amount"
                            autoComplete="off"
                            value={formDataDetail.Adjusted_Amount}
                            onChange={handleChangeDetail}
                          />
                        </div>
                      </div>
                      <label className="debitCreditNote-form-label">
                        Adjusted Ac code:
                      </label>
                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <AccountMasterHelp
                            name="AcadjAccode"
                            onAcCodeClick={handleAcadjAccodename}
                            CategoryName={lblAcadjAccodename}
                            CategoryCode={newAcadjAccode}
                            Ac_type=""
                            disabledFeild={!isEditing && addOneButtonEnabled}
                          />

                          <label className="debitCreditNote-form-label">
                            TDS %:
                          </label>

                          <input
                            type="text"
                            className="debitCreditNote-form-control"
                            name="TDS_Rate"
                            autoComplete="off"
                            value={formDataDetail.TDS_Rate}
                            onChange={handleChangeDetail}
                            style={{ maxWidth: 100 }}
                          />
                          <input
                            type="text"
                            className="debitCreditNote-form-control"
                            name="TDS_Amt"
                            autoComplete="off"
                            value={formDataDetail.TDS_Amt}
                            onChange={handleChangeDetail}
                            style={{ maxWidth: 100 }}
                          />
                        </div>
                      </div>
                      <label className="debitCreditNote-form-label">
                        Narration:
                      </label>
                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <textarea
                            className="debitCreditNote-form-control"
                            name="narration"
                            autoComplete="off"
                            value={formDataDetail.narration}
                            onChange={handleChangeDetail}
                          />

                          <label className="debitCreditNote-form-label">
                            narration 2:
                          </label>

                          <textarea
                            className="debitCreditNote-form-control"
                            name="narration2"
                            autoComplete="off"
                            value={formDataDetail.narration2}
                            onChange={handleChangeDetail}
                          />
                        </div>
                      </div>
                      <label className="debitCreditNote-form-label">GRN:</label>
                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <input
                            type="text"
                            className="debitCreditNote-form-control"
                            name="GRN"
                            autoComplete="off"
                            value={formDataDetail.GRN}
                            onChange={handleChangeDetail}
                          />
                        </div>
                      </div>
                      <label className="debitCreditNote-form-label">
                        TReceipt:
                      </label>
                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <input
                            type="text"
                            className="debitCreditNote-form-control"
                            name="TReceipt"
                            autoComplete="off"
                            value={formDataDetail.TReceipt}
                            onChange={handleChangeDetail}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    {selectedUser.id ? (
                      <button
                        className="btn btn-primary"
                        onClick={updateUser}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            updateUser();
                          }
                        }}
                      >
                        Update User
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={addUser}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            addUser();
                          }
                        }}
                      >
                        Add User
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closePopup}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <table className="table mt-4 table-bordered  ">
            <thead>
              <tr>
                <th>Actions</th>
                <th>ID</th>
                <th>AcCode</th>
                <th>A/C Name</th>
                {/* <th>UnitCOde</th>
                <th>Unitname</th>
                <th>VoucherNo</th>
                <th>VoucherType</th>
                <th>TenderNo</th>
                <th>DetailID</th> */}
                <th> Amount </th>
                {/* <th>Adjusted_Amount</th> */}
                <th>  Narration  </th>
                {/* <th>narration2</th>
                <th>drpFilterValue</th>
                <th>YearCodeDetail</th>
                <th>trandetailid</th>
                <th>AcadjAmt</th>
                <th>AcadjAccode</th>
                <th>AcadjAcname</th>
                <th>AC</th>
                <th>UC</th>
                <th>AD</th>
                <th>TDS Rate</th>
                <th>TDSAmt</th>
                <th>GRN</th>
                <th>TReceipt</th>
                <th>Rowaction</th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.rowaction === "add" ||
                    user.rowaction === "update" ||
                    user.rowaction === "Normal" ? (
                      <>
                        <button
                          className="btn btn-warning"
                          onClick={() => editUser(user)}
                          disabled={!isEditing}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              editUser(user);
                            }
                          }}
                          tabIndex="18"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => deleteModeHandler(user)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              deleteModeHandler(user);
                            }
                          }}
                          disabled={!isEditing}
                          tabIndex="19"
                        >
                          Delete
                        </button>
                      </>
                    ) : user.rowaction === "DNU" ||
                      user.rowaction === "delete" ? (
                      <button
                        className="btn btn-secondary"
                        onClick={() => openDelete(user)}
                      >
                        Open
                      </button>
                    ) : null}
                  </td>

                  <td>{user.detail_id}</td>
                  <td>{user.credit_ac}</td>
                  <td>{user.AcName}</td>
                  {/* <td>{user.Unit_Code}</td>
                  <td>{user.Unitname}</td>
                  <td>{user.Voucher_No}</td>
                  <td>{user.Voucher_Type}</td>
                  <td>{user.Tender_No}</td>
                  <td>{user.tenderdetailid}</td> */}
                  <td>{user.amount}</td>
                  {/* <td>{user.Adjusted_Amount}</td> */}
                  <td>{user.narration}</td>
                  {/* <td>{user.narration2}</td>
                  <td>{user.drpFilterValue}</td>
                  <td>{user.YearCodeDetail}</td>
                  <td>{user.trandetailid}</td>
                  <td>{user.AcadjAmt}</td>
                  <td>{user.AcadjAccode}</td>
                  <td>{user.AcadjAcname}</td>
                  <td>{user.ca}</td>
                  <td>{user.uc}</td>
                  <td>{user.ad}</td>
                  <td>{user.TDS_Rate}</td>
                  <td>{user.TDS_Amt}</td>
                  <td>{user.GRN}</td>
                  <td>{user.TReceipt}</td>
                  <td>{user.rowaction}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="form-group " style={{ maxWidth: "100px" }}>
          <label htmlFor="total">Total:</label>
          <input
            type="text"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            disabled={!isEditing && addOneButtonEnabled}
          />
        </div>
      </div>
    </>
  );
};
export default RecieptPayment;
