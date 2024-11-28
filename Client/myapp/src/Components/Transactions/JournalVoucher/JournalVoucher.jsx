import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ActionButtonGroup from "../../../Common/CommonButtons/ActionButtonGroup";
import NavigationButtons from "../../../Common/CommonButtons/NavigationButtons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountMasterHelp from "../../../Helper/AccountMasterHelp";
import { HashLoader } from "react-spinners";
import { TextField, Box, Typography } from "@mui/material";
import { useRecordLocking } from "../../../hooks/useRecordLocking";

var newDebit_ac;
var lblacname;
var globalTotalAmount = 0.0;
var globalCreditTotalAmount = 0.0;
var globalDebitTotalAmount = 0.0;

const JournalVoucher = () => {
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
  const [Debitcode, setDebitcode] = useState("");
  const [Debitcodeid, setDebitcodeid] = useState("");
  const [Debitcodename, setCreditcodecodename] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [users, setUsers] = useState([]);
  const [tenderDetails, setTenderDetails] = useState({});
  const [lastTenderDetails, setLastTenderDetails] = useState([]);
  const [lastTenderData, setLastTenderData] = useState({});
  const docDateRef = useRef(null);

  const [creditTotal, setCreditTotal] = useState(0);
  const [debitTotal, setDebitTotal] = useState(0);
  const [diff, setDiff] = useState(0);

  const initialFormData = {
    tran_type: "",
    doc_no: "",
    doc_date: new Date().toISOString().split("T")[0],
    total: 0,
    company_code: companyCode,
    year_code: YearCode,
    Created_By: "",
    Modified_By: "",
  };

  const [formDataDetail, setFormDataDetail] = useState({
    credit_ac: 0,
    amount: 0,
    narration: 0,
    narration2: "",
    detail_id: 1,
    debit_ac: 0,
    da: 0,
    drcr: "C",
    Unit_Code: 0,
    Voucher_No: 0,
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

  const navigate = useNavigate();
  const location = useLocation();
  const selectedRecord = location.state?.selectedRecord;

  const [formData, setFormData] = useState(initialFormData);

  // Manage the lock-unlock record at the same time multiple users edit the same record.
  const { isRecordLockedByUser, lockRecord, unlockRecord } = useRecordLocking(
    formData.doc_no,
    formData.tran_type
  );

  //handleChange For Input Fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      return updatedFormData;
    });
  };

  //get Next Doc No
  const fetchLastRecord = () => {
    let TranType = "JV";
    fetch(
      `${API_URL}/get_next_paymentRecord_docNo?Company_Code=${companyCode}&tran_type=${TranType}&Year_Code=${YearCode}`
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
    globalCreditTotalAmount = "";
    globalDebitTotalAmount = "";
    let tran_type = "JV";
    setDiff(0);
    setDebitTotal(0);
    setCreditTotal(0);
    console.log("tran_type", tran_type);
    setFormData((prevData) => ({
      ...prevData,
      tran_type: "JV",
    }));
    setTimeout(() => {
      docDateRef.current?.focus();
    }, 0);
  };

  const handleSaveOrUpdate = async () => {
    setIsEditing(true);
    setIsLoading(true);

    const Total = parseFloat(creditTotal) - parseFloat(debitTotal);
    if (Total !== 0) {
      alert("Difference must be zero!!!");
      setIsLoading(false);
      return;
    }

    const head_data = { ...formData };
    const detail_data = users.map((user) => ({
      rowaction: user.rowaction,
      detail_id: user.detail_id,
      debit_ac: user.debit_ac,
      credit_ac: user.debit_ac,
      drcr: user.drcr,
      amount: user.amount,
      narration: user.narration,
      trandetailid: user.trandetailid,
      da: user.da,
      ca: user.ca,
      Company_Code: companyCode,
      Year_Code: YearCode,
      Tran_Type: "JV",
      tranid: formData.tranid,
    }));

    const requestData = {
      head_data,
      detail_data,
    };

    if (isEditMode) delete head_data.tranid;

    try {
      const apiUrl = isEditMode
        ? `${API_URL}/update-receiptpayment?tranid=${formData.tranid}`
        : `${API_URL}/insert-receiptpayment`;

      const apiCall = isEditMode
        ? axios.put(apiUrl, requestData)
        : axios.post(apiUrl, requestData);

      const response = await apiCall;

      toast.success(
        isEditMode
          ? "Record updated successfully!"
          : "Data created successfully!"
      );
      console.log(
        isEditMode ? "Data updated successfully:" : "Data saved successfully:",
        response.data
      );

      unlockRecord();
      setIsEditMode(false);
      setAddOneButtonEnabled(true);
      setEditButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setBackButtonEnabled(true);
      setSaveButtonEnabled(false);
      setCancelButtonEnabled(false);
      setUpdateButtonClicked(true);
      setIsEditing(false);
      setIsLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during save/update:", error);
      toast.error("An error occurred during save/update.");
      setIsLoading(false);
    }
  };

  //handle Edit record functionality.
  const handleEdit = async () => {
    axios
      .get(
        `${API_URL}/getreceiptpaymentByid?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}&doc_no=${formData.doc_no}`
      )
      .then((response) => {
        const data = response.data;
        const isLockedNew = data.receipt_payment_head.LockedRecord;
        const isLockedByUserNew = data.receipt_payment_head.LockedUser;
        console.log("isLockedNew", isLockedNew);
        if (isLockedNew) {
          console.log("isLockedNew", isLockedNew);
          window.alert(`This record is locked by ${isLockedByUserNew}`);
          return;
        } else {
          lockRecord();
        }
        setFormData({
          ...formData,
          ...data.receipt_payment_head,
        });
        setIsEditMode(true);
        setAddOneButtonEnabled(false);
        setSaveButtonEnabled(true);
        setCancelButtonEnabled(true);
        setEditButtonEnabled(false);
        setDeleteButtonEnabled(false);
        setBackButtonEnabled(true);
        setIsEditing(true);
      })
      .catch((error) => {
        window.alert(
          "This record is already deleted! Showing the previous record."
        );
      });
  };

  const handleCancel = async () => {
    const response = await axios.get(
      `${API_URL}/get-lastreceiptpayment-navigation?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}`
    );
    if (response.status === 200) {
      const data = response.data;
      const { last_head_data, last_details_data, labels } = data;
      const detailsArray = Array.isArray(last_details_data)
        ? last_details_data
        : [];
      console.log("detailsArray", detailsArray);

      const itemNameMap = labels.reduce((map, label) => {
        if (label.debit_ac !== undefined && label.debitacname) {
          map[label.debit_ac] = label.debitacname;
        }
        return map;
      }, {});

      const enrichedDetails = detailsArray.map((detail) => ({
        ...detail,
        AcName: itemNameMap[detail.debit_ac] || "",
      }));
      let creditTotal = 0;
      let debitTotal = 0;

      enrichedDetails.forEach((user) => {
        const amount = parseFloat(user.amount || 0);
        if (user.drcr === "C") {
          creditTotal += amount;
        } else if (user.drcr === "D") {
          debitTotal += amount;
        }
      });

      const total = creditTotal + debitTotal;

      globalCreditTotalAmount = creditTotal.toFixed(2);
      globalDebitTotalAmount = debitTotal.toFixed(2);
      globalTotalAmount = total.toFixed(2);

      setCreditTotal(creditTotal.toFixed(2));
      setDebitTotal(debitTotal.toFixed(2));

      setFormData((prevData) => ({
        ...prevData,
        ...last_head_data,
        total: total.toFixed(2),
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
    unlockRecord();
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
    const Total =
      parseFloat(globalCreditTotalAmount) - parseFloat(globalDebitTotalAmount);
    if (Total !== 0) {
      alert("Difference must be zero!!!");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/getreceiptpaymentByid?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}&doc_no=${formData.doc_no}`
      );
      const data = response.data;
      const isLockedNew = data.receipt_payment_head.LockedRecord;
      const isLockedByUserNew = data.receipt_payment_head.LockedUser;

      if (isLockedNew) {
        window.alert(`This record is locked by ${isLockedByUserNew}`);
        return;
      }

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
        const deleteApiUrl = `${API_URL}/delete_data_by_tranid?tranid=${formData.tranid}&company_code=${companyCode}&year_code=${YearCode}&doc_no=${formData.doc_no}&Tran_Type=${formData.tran_type}`;
        await axios.delete(deleteApiUrl);

        toast.success("Record deleted successfully!");
        handleCancel();
      } else {
        console.log("Deletion cancelled");
      }
    } catch (error) {
      toast.error("Deletion cancelled");
      console.error("Error during API call:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/JournalVoucher_Utility");
  };

  useEffect(() => {
    if (selectedRecord) {
      setUsers(
        lastTenderDetails.map((detail) => ({
          rowaction: "Normal",
          Company_Code: companyCode,
          Year_Code: YearCode,
          Tran_Type: "JV",
          debit_ac: detail.debit_ac,
          AcName: detail.AcName,
          drcr: detail.drcr || "C",
          amount: detail.amount,
          narration: detail.narration,
          detail_id: detail.detail_id,
          da: detail.da || "",
          trandetailid: detail.trandetailid,
          id: detail.trandetailid,
        }))
      );
      console.log(lastTenderDetails);
    }
  }, [selectedRecord, lastTenderDetails]);

  useEffect(() => {
    setUsers(
      lastTenderDetails.map((detail) => ({
        rowaction: "Normal",

        Company_Code: companyCode,
        Year_Code: YearCode,
        Tran_Type: "JV",
        debit_ac: detail.debit_ac,
        AcName: detail.AcName,
        drcr: detail.drcr || "C",
        amount: detail.amount,
        narration: detail.narration,
        detail_id: detail.detail_id,
        da: detail.da || "",
        trandetailid: detail.trandetailid,
        id: detail.trandetailid,
      }))
    );
    console.log("lastTenderDetails", lastTenderDetails);
  }, [lastTenderDetails]);

  const handleAccode = (code, accoid, name) => {
    setDebitcode(code);
    setDebitcodeid(accoid);
    setCreditcodecodename(name);

    setFormDataDetail({
      ...formDataDetail,
      debit_ac: code,
      da: accoid,

      lblacname: name,
    });
  };

  //calculation For Handling Total, CreditTotal, DebitTotal
  const calculateTotals = (details) => {
    let creditTotal = 0;
    let debitTotal = 0;

    details.forEach((user) => {
      const amount = parseFloat(user.amount || 0);
      if (user.drcr === "C") {
        creditTotal += amount;
      } else if (user.drcr === "D") {
        debitTotal += amount;
      }
    });

    const total = creditTotal + debitTotal;

    globalCreditTotalAmount = creditTotal.toFixed(2);
    globalDebitTotalAmount = debitTotal.toFixed(2);
    globalTotalAmount = total.toFixed(2);

    return { creditTotal, debitTotal, total };
  };

  const handleChangeDetail = (event) => {
    const { name, value } = event.target;
    let updatedFormDataDetail = { ...formDataDetail, [name]: value };

    setFormDataDetail(updatedFormDataDetail);
  };

  const openPopup = () => {
    setShowPopup(true);
    const selectedValue = formData.tran_type;
  };

  const clearForm = () => {
    setFormDataDetail({
      debit_ac: "",
      credit_ac: "",
      Unit_Code: 0,
      amount: 0,
      narration: "",
      narration2: "",
      detail_id: 1,
      Voucher_No: 0,
      Voucher_Type: "",
      Adjusted_Amount: 0.0,
      Tender_No: 0,
      TenderDetail_ID: 0,
      drpFilterValue: "",
      ca: 0,
      uc: 0,
      da: 0,
      tenderdetailid: 0,
      AcadjAccode: 0,
      AcadjAmt: 0.0,
      ac: 0,
      TDS_Rate: 0.0,
      TDS_Amt: 0.0,
      GRN: "",
      TReceipt: "",
    });
    setCreditcodecodename("");
    lblacname = "";
  };

  const addUser = () => {
    const maxDetailId =
      users.length > 0
        ? Math.max(...users.map((user) => user.detail_id)) + 1
        : 1;

    const nextUserId =
      users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

    const newUser = {
      id: nextUserId,
      AcName: Debitcodename,
      ...formDataDetail,
      detail_id: maxDetailId,
      drcr: formDataDetail.drcr || "C",
      rowaction: "add",
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    const updatedCreditTotal = updatedUsers
      .filter((user) => user.drcr === "C")
      .reduce((total, user) => total + parseFloat(user.amount || 0), 0);

    const updatedDebitTotal = updatedUsers
      .filter((user) => user.drcr === "D")
      .reduce((total, user) => total + parseFloat(user.amount || 0), 0);

    const diff = updatedCreditTotal - updatedDebitTotal;

    setCreditTotal(updatedCreditTotal.toFixed(2));
    setDebitTotal(updatedDebitTotal.toFixed(2));
    setDiff(diff.toFixed(2));

    setFormData((prevFormData) => ({
      ...prevFormData,
      total: (updatedCreditTotal + updatedDebitTotal).toFixed(2),
    }));
    closePopup();
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setDebitcode(user.debit_ac);
    setDebitcodeid(user.da);
    setCreditcodecodename(user.AcName);
    setFormDataDetail({
      debit_ac: user.debit_ac || "",
      lblacname: user.AcName,
      drcr: user.drcr || "C",
      amount: user.amount || "",
      narration: user.narration || "",
      detail_id: user.trandetailid,
      da: user.da || "",
      trandetailid: user.trandetailid,
      id: user.trandetailid,
    });

    openPopup();
  };

  const updateUser = async () => {
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        const updatedRowaction =
          user.rowaction === "Normal" ? "update" : user.rowaction;

        return {
          ...user,

          rowaction: updatedRowaction,
          debit_ac: Debitcode,
          AcName: Debitcodename,
          drcr: formDataDetail.drcr || "C",

          amount: formDataDetail.amount,
          narration: formDataDetail.narration,
          detail_id: user.detail_id,
          da: Debitcodeid || "",
        };
      } else {
        return user;
      }
    });

    let creditTotal = 0;
    let debitTotal = 0;

    updatedUsers.forEach((user) => {
      const amount = parseFloat(user.amount || 0);
      if (user.drcr === "C") {
        creditTotal += amount;
      } else if (user.drcr === "D") {
        debitTotal += amount;
      }
    });

    const diff = creditTotal - debitTotal;

    setCreditTotal(creditTotal.toFixed(2));
    setDebitTotal(debitTotal.toFixed(2));
    setDiff(diff.toFixed(2));

    setFormData((prevFormData) => ({
      ...prevFormData,
      total: (creditTotal + debitTotal).toFixed(2),
    }));

    setUsers(updatedUsers);

    closePopup();
  };

  const openDelete = async (user) => {
    let updatedUsers;
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

    setFormDataDetail({
      ...formDataDetail,
    });

    const amountToAdd = parseFloat(user.amount || 0);
    const isCredit = user.drcr === "C";
    const updatedCreditTotal = isCredit
      ? parseFloat(creditTotal || 0) + amountToAdd
      : parseFloat(creditTotal || 0);

    const updatedDebitTotal = !isCredit
      ? parseFloat(debitTotal || 0) + amountToAdd
      : parseFloat(debitTotal || 0);

    const total = updatedCreditTotal + updatedDebitTotal;
    const diff = updatedCreditTotal - updatedDebitTotal;

    setCreditTotal(updatedCreditTotal.toFixed(2));
    setDebitTotal(updatedDebitTotal.toFixed(2));
    setDiff(diff.toFixed(2));
    setFormData((prevFormData) => ({
      ...prevFormData,
      total: total.toFixed(2),
    }));

    setUsers(updatedUsers);
    setSelectedUser({});
  };
  useEffect(() => {
    console.log("Updated Users:", users);
  }, [users]);

  const deleteModeHandler = async (userToDelete) => {
    let updatedUsers;
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

    setFormDataDetail({
      ...formDataDetail,
      ...updatedUsers.find((u) => u.id === userToDelete.id),
    });

    const amountToDeduct = parseFloat(userToDelete.amount || 0);
    const isCredit = userToDelete.drcr === "C";

    let updatedCreditTotal = parseFloat(creditTotal || 0);
    let updatedDebitTotal = parseFloat(debitTotal || 0);

    if (isCredit) {
      updatedCreditTotal -= amountToDeduct;
      setCreditTotal(updatedCreditTotal.toFixed(2));
    } else {
      updatedDebitTotal -= amountToDeduct;
      setDebitTotal(updatedDebitTotal.toFixed(2));
    }

    const diff = updatedCreditTotal - updatedDebitTotal;
    const total = updatedCreditTotal + updatedDebitTotal;
    setDiff(diff.toFixed(2));
    setFormData((prevData) => ({
      ...prevData,
      total: total.toFixed(2),
    }));
    setUsers(updatedUsers);
    setDeleteMode(true);
    setSelectedUser(userToDelete);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser({});
    clearForm();
  };

  //Navigation Buttons
  const handleNavigation = async (url, headKey, detailsKey) => {
    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const { labels, [headKey]: headData, [detailsKey]: detailsData } = data;

        const DetailsArray = Array.isArray(detailsData) ? detailsData : [];

        const itemNameMap = labels.reduce((map, label) => {
          if (label.debit_ac !== undefined && label.debitacname) {
            map[label.debit_ac] = label.debitacname;
          }
          return map;
        }, {});

        const enrichedDetails = DetailsArray.map((detail) => ({
          ...detail,
          AcName: itemNameMap[detail.debit_ac] || "",
        }));

        const { creditTotal, debitTotal, total } =
          calculateTotals(enrichedDetails);

        setCreditTotal(creditTotal.toFixed(2));
        setDebitTotal(debitTotal.toFixed(2));
        setFormData((prevData) => ({
          ...prevData,
          ...headData,
          total: total.toFixed(2),
        }));

        setLastTenderData(headData || {});
        setLastTenderDetails([]);
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

    try {
      await handleNavigation(
        url,
        "receipt_payment_head",
        "receipt_payment_details"
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching data on double click:", error);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Tab") {
      const changeNoValue = event.target.value;
      const url = `${API_URL}/getreceiptpaymentByid?Company_Code=${companyCode}&Year_Code=${YearCode}&tran_type=${formData.tran_type}&doc_no=${changeNoValue}`;

      try {
        await handleNavigation(
          url,
          "receipt_payment_head",
          "receipt_payment_details"
        );
        setIsEditing(false);
      } catch (error) {
        console.error("Error fetching data on Tab keydown:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedRecord) {
      handleRecordDoubleClicked();
    } else {
      handleAddOne();
    }
  }, [selectedRecord]);

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

  return (
    <>
      <div className="container">
        <ToastContainer />
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
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Journal Voucher
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 3, marginBottom: 2 }}>
            <TextField
              label="Change No"
              id="changeNo"
              name="changeNo"
              onKeyDown={handleKeyDown}
              disabled={!addOneButtonEnabled}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 3, marginBottom: 2 }}>
            <TextField
              label="Doc No"
              id="doc_no"
              name="doc_no"
              value={formData.doc_no}
              onChange={handleChange}
              disabled
              variant="outlined"
              size="small"
            />
            <TextField
              label="Doc Date"
              type="date"
              id="doc_date"
              name="doc_date"
              value={formData.doc_date}
              onChange={handleChange}
              inputRef={docDateRef}
              disabled={!isEditing && addOneButtonEnabled}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-container">
              <HashLoader color="#007bff" loading={isLoading} size={80} />
            </div>
          </div>
        )}

        <div style={{ alignItems: "center" }}>
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
            <div className="modal" role="dialog">
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
                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <label className="debitCreditNote-form-label">
                            Ac_ac:
                          </label>
                          <AccountMasterHelp
                            name="debit_ac"
                            onAcCodeClick={handleAccode}
                            CategoryName={lblacname ? lblacname : Debitcodename}
                            CategoryCode={
                              newDebit_ac || formDataDetail.debit_ac
                            }
                            Ac_type={""}
                            tabIndex={4}
                            disabledFeild={!isEditing && addOneButtonEnabled}
                          />
                        </div>
                      </div>

                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <label htmlFor="drcr">drcr:</label>
                          <select
                            id="drcr"
                            name="drcr"
                            value={formDataDetail.drcr}
                            onChange={handleChangeDetail}
                            disabled={!isEditing && addOneButtonEnabled}
                          >
                            <option value="C">Credit</option>
                            <option value="D">Debit</option>
                          </select>
                        </div>
                      </div>

                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <label className="debitCreditNote-form-label">
                            Amount:
                          </label>
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

                      <div className="debitCreditNote-col-Ewaybillno">
                        <div className="debitCreditNote-form-group">
                          <label className="debitCreditNote-form-label">
                            Narration:
                          </label>

                          <textarea
                            name="narration"
                            value={formDataDetail.narration}
                            onChange={handleChangeDetail}
                            autoComplete="off"
                            disabled={!isEditing && addOneButtonEnabled}
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

          <table className="table mt-4 table-bordered">
            <thead>
              <tr>
                <th>Actions</th>
                <th>ID</th>
                <th>AcCode</th>
                <th>AcName</th>
                <th>DRCR</th>
                <th>amount</th>
                <th>narration</th>
                <th>trandetailid</th>
                <th>Debitid</th>
                <th>Rowaction</th>
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
                  <td>{user.debit_ac}</td>
                  <td>{user.AcName}</td>
                  <td>{user.drcr || "C"}</td>
                  <td>{user.amount}</td>
                  <td>{user.narration}</td>
                  <td>{user.trandetailid}</td>
                  <td>{user.da}</td>
                  <td>{user.rowaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            marginTop: 2,
            justifyContent: "center",
          }}
        >
          <TextField
            label="Total"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            disabled={!isEditing && addOneButtonEnabled}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Credit Total"
            id="creditTotal"
            name="creditTotal"
            value={creditTotal}
            onChange={handleChange}
            disabled={!isEditing && addOneButtonEnabled}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Debit Total"
            id="debitTotal"
            name="debitTotal"
            value={debitTotal}
            onChange={handleChange}
            disabled={!isEditing && addOneButtonEnabled}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Difference"
            id="diff"
            name="diff"
            value={diff}
            disabled
            variant="outlined"
            size="small"
          />
        </Box>
      </div>
    </>
  );
};
export default JournalVoucher;
