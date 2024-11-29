import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountMasterHelp from "../../../Helper/AccountMasterHelp";
import UTRLotnoHelp from "../../../Helper/UTRLotnoHelp";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ActionButtonGroup from "../../../Common/CommonButtons/ActionButtonGroup";
import NavigationButtons from "../../../Common/CommonButtons/NavigationButtons";
import { ToastContainer, toast } from "react-toastify";
import { TextField, Grid, Checkbox, Box, Container } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { HashLoader } from "react-spinners";
import UTRReport from "./UTRReport";
import {useRecordLocking} from "../../../hooks/useRecordLocking"

var lblBankname;
var newbank_ac;
var lblmillname;
var newmill_code;
var newLot_no;

const API_URL = process.env.REACT_APP_API;

const UTREntry = () => {
  const docDateRef = useRef(null);

  const companyCode = sessionStorage.getItem("Company_Code");
  const Year_Code = sessionStorage.getItem("Year_Code");

  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
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
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [users, setUsers] = useState([]);
  const [tenderDetails, setTenderDetails] = useState({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [Tenderno, setTenderno] = useState("");
  const [bancode, setBankCode] = useState("");
  const [bankid, setBankId] = useState("");
  const [millcode, setMillCode] = useState("");
  const [millid, setMillId] = useState("");
  const [lastTenderDetails, setLastTenderDetails] = useState([]);
  const [lastTenderData, setLastTenderData] = useState({});
  const [globalTotalAmount, setGlobalTotalAmount] = useState(0.0);
  const [diff, setDiff] = useState(0.0);
  const [popupMode, setPopupMode] = useState("add");

  const navigate = useNavigate();

  //In utility page record doubleClicked that recod show for edit functionality
  const location = useLocation();
  const selectedRecord = location.state?.selectedRecord;

  const initialFormData = {
    doc_no: "",
    doc_date: new Date().toISOString().split("T")[0],
    bank_ac: 0,
    mill_code: 0,
    amount: 0.0,
    utr_no: "",
    narration_header: "",
    narration_footer: "",
    Company_Code: companyCode,
    Year_Code: Year_Code,
    Branch_Code: "",
    Created_By: "",
    Modified_By: "",
    IsSave: "",
    Lott_No: 0,
    utrid: 0,
    ba: 0,
    mc: 0,
    Processed: 0,
    SelectedBank: "",
    messageId: "",
    bankTransactionId: "",
    isPaymentDone: "",
    EntryType: "",
    PaymentType: "",
    paymentData: "",
    IsDeleted: 0,
  };

  const [formDataDetail, setFormDataDetail] = useState({
    grade_no: "",
    amount: 0.0,
    lotCompany_Code: 0,
    lotYear_Code: 0,
    Adjusted_Amt: 0.0,
    Detail_Id: 1,
    ln: null,
  });

  const [formData, setFormData] = useState(initialFormData);

   // Manage the lock-unlock record at the same time multiple users edit the same record.
   const { isRecordLockedByUser, lockRecord, unlockRecord } = useRecordLocking(formData.doc_no,"",companyCode,Year_Code,"utr_entry");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      return updatedFormData;
    });
  };

  //Handling Bank Code Help
  const handleBankCode = (code, accoid) => {
    setBankCode(code);
    setBankId(accoid);

    setFormData({
      ...formData,
      bank_ac: code,
      ba: accoid,
    });
  };

  //Handling MillCode Help
  const handleMillCode = (code, accoid) => {
    setMillCode(code);
    setMillId(accoid);

    setFormData({
      ...formData,
      mill_code: code,
      mc: accoid,
    });
  };

  const fetchLastRecord = () => {
    fetch(
      `${API_URL}/get-lastutrdata?Company_Code=${companyCode}&Year_Code=${Year_Code}`
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
          doc_no: data.last_head_data.doc_no + 1,
        }));
      })
      .catch((error) => {
        console.error("Error fetching last record:", error);
      });
  };

  const handleAddOne = () => {
    setAddOneButtonEnabled(false);
    setSaveButtonEnabled(true);
    setCancelButtonEnabled(true);
    setEditButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setIsEditing(true);
    fetchLastRecord();
    setFormData(initialFormData);
    setLastTenderDetails([]);
    setGlobalTotalAmount(0.0);
    setDiff(0.0);
    lblBankname = "";
    newbank_ac = "";
    lblmillname = "";
    newmill_code = "";
    setTimeout(() => {
      docDateRef.current?.focus();
    }, 0);
  };

  const handleSaveOrUpdate = () => {
    setIsLoading(true);

    const head_data = { ...formData };
    const detail_data = users.map((user) => ({
      rowaction: user.rowaction,
      utrdetailid: user.utrdetailid,
      lot_no: user.lot_no,
      grade_no: user.grade_no,
      amount: parseFloat(user.amount) || 0,
      lotCompany_Code: user.lotCompany_Code,
      Detail_Id: 1,
      Company_Code: companyCode,
      Year_Code: Year_Code,
      lotYear_Code: user.lotYear_Code,
      LTNo: 0,
      Adjusted_Amt: parseFloat(user.Adjusted_Amt) || 0,
      ln: user.ln,
    }));

    const HeadAmount = parseFloat(head_data.amount) || 0;
    if (Math.abs(HeadAmount - globalTotalAmount) > 0.01) {
      alert("Difference must be zero");
      setIsLoading(false);
      return;
    }

    const requestData = { head_data, detail_data };
    delete head_data.lot_no;
    delete head_data.utrid;

    const apiEndpoint = isEditMode
      ? `${API_URL}/update-utr?utrid=${formData.utrid}`
      : `${API_URL}/insert-utr`;
    const apiMethod = isEditMode ? axios.put : axios.post;

    apiMethod(apiEndpoint, requestData)
      .then((response) => {
        const successMessage = isEditMode
          ?   unlockRecord() && "Record updated successfully!"
          : "Record created successfully!";
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
        setIsLoading(false);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toast.error("Error saving or updating record");
        setIsLoading(false);
      });
  };

    //handle Edit record functionality.
    const handleEdit = async () => {
      axios.get(`${API_URL}/getutrByid?Company_Code=${companyCode}&doc_no=${formData.doc_no}&Year_Code=${Year_Code}`)
        .then((response) => {
          const data = response.data;
          const isLockedNew = data.utr_head.LockedRecord;
          const isLockedByUserNew = data.utr_head.LockedUser;
  
          if (isLockedNew) {
            console.log("isLockedNew",isLockedNew)
            window.alert(`This record is locked by ${isLockedByUserNew}`);
            return;
          } else {
            lockRecord()
          }
          setFormData({
            ...formData,
            ...data.utr_head
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
          window.alert("This record is already deleted! Showing the previous record.");
        });
    };

  const handleCancel = async () => {
    const response = await axios.get(
      `${API_URL}/get-lastutrdata?Company_Code=${companyCode}&Year_Code=${Year_Code}`
    );
    if (response.status === 200) {
      const data = response.data;
      const { last_head_data, last_details_data, labels } = data;
      const detailsArray = Array.isArray(last_details_data)
        ? last_details_data
        : [];

      lblBankname = data.labels.bankAcName;
      lblmillname = data.labels.millName;
      newbank_ac = data.last_head_data.bank_ac;
      newmill_code = data.last_head_data.mill_code;
      newLot_no = data.last_details_data.lot_no;

      setFormData((prevData) => ({
        ...prevData,
        ...data.last_head_data,
      }));
      unlockRecord();
      setUsers([...users, data.last_details_data]);
      const totalItemAmount = detailsArray.reduce(
        (total, user) => total + parseFloat(user.amount),
        0
      );
      setGlobalTotalAmount(totalItemAmount.toFixed(2));
      const totalDiff =
        (parseFloat(data.last_head_data.amount) || 0) - totalItemAmount;
      setDiff(totalDiff.toFixed(2));
      setLastTenderData(data.last_head_data || {});
      setLastTenderDetails(detailsArray);
      
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
    axios.get(`${API_URL}/getutrByid?Company_Code=${companyCode}&doc_no=${formData.doc_no}&Year_Code=${Year_Code}`)
        .then(async (response) => {
            const data = response.data;
            const isLockedNew = data.utr_head.LockedRecord;
            const isLockedByUserNew = data.utr_head.LockedUser;
  
            if (isLockedNew) {
                console.log("isLockedNew", isLockedNew);
                window.alert(`This record is locked by ${isLockedByUserNew}`);
                return;
            }

            const isConfirmed = window.confirm(`Are you sure you want to delete this UtrEntry ${formData.doc_no}?`);

            if (isConfirmed) {
                setIsEditMode(false);
                setAddOneButtonEnabled(true);
                setEditButtonEnabled(true);
                setDeleteButtonEnabled(true);
                setBackButtonEnabled(true);
                setSaveButtonEnabled(false);
                setCancelButtonEnabled(false);

                try {
                    const deleteApiUrl = `${API_URL}/delete_data_by_utrid?utrid=${formData.utrid}&Company_Code=${companyCode}&Year_Code=${Year_Code}&doc_no=${formData.doc_no}`;
                    const response = await axios.delete(deleteApiUrl);
                    toast.success("Record deleted successfully!");
                    handleCancel();
                } catch (error) {
                    toast.error("Deletion failed");
                    console.error("Error during API call:", error);
                }
            } else {
                console.log("Deletion cancelled");
            }
        })
        .catch((error) => {
            console.error("Error fetching record lock status:", error);
            toast.error("Error fetching record status");
        });
};

useEffect(() => {
  const totalDiff = (parseFloat(formData.amount) || 0) - parseFloat(globalTotalAmount);
  setDiff(totalDiff.toFixed(2));
}, [formData.amount, globalTotalAmount]);


  const handleBack = () => {
    navigate("/utrentry-Utility");
  };

  const handleChangeDetail = (event) => {
    const { name, value } = event.target;
    setFormDataDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  //Detail Part Functionality
  const openPopup = (mode) => {
    const initialAmount = users.length === 0 ? formData.amount : diff;

    setFormDataDetail((prevDetail) => ({
      ...prevDetail,
      amount: initialAmount,
    }));

    setPopupMode(mode);
    setShowPopup(true);
    if (mode === "add") {
      clearForm();
    }
  };

  //close popup function
  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser({});
    clearForm();
  };

  //Handling PurchaseNumber Help
  const handlePurcno = (Tenderno, Tenderid) => {
    setTenderno(Tenderno);

    setFormData({
      ...formData,
      lot_no: Tenderno,
    });
  };

  //Fetching Details Of Selected PurchaseNo
  const handleTenderDetailsFetched = (details) => {
    setTenderDetails(details.last_details_data[0]);

    const newData = {
      grade_no: details.last_details_data[0].Grade,

      lotCompany_Code: details.last_details_data[0].Company_Code,
      lotYear_Code: details.last_details_data[0].Year_Code,
      ln: details.last_details_data[0].tenderid,
      Adjusted_Amt: details.last_details_data[0].Packing,
      lot_no: details.last_details_data[0].Tender_No,
    };

    setFormDataDetail((prevState) => ({
      ...prevState,
      ...newData,
    }));

    return newData;
  };

  //Add Records In Detail
  const addUser = async () => {
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      lot_no: newLot_no,
      amount: users.length === 0 ? formData.amount : diff,
      ...formDataDetail,

      rowaction: "add",
    };

    const newUsers = [...users, newUser];

    const totalItemAmount = newUsers.reduce(
      (total, user) => total + parseFloat(user.amount),
      0
    );
    setGlobalTotalAmount(totalItemAmount.toFixed(2));

    const totalDiff = (parseFloat(formData.amount) || 0) - totalItemAmount;
    setDiff(totalDiff.toFixed(2));
    setUsers(newUsers);
    closePopup();
  };

  const clearForm = () => {
    setFormDataDetail({
      lot_no: 0,
      grade_no: "",
      amount: null,
      lotCompany_Code: 0,
      lotYear_Code: 0,
      Adjusted_Amt: null,
      ln: null,
    });
  };

  //Edit Record In Detail
  const editUser = (user) => {
    setSelectedUser(user);
    setTenderno(user.lot_no);
    setFormDataDetail({
      grade_no: user.grade_no || "",
      amount: user.amount || "",
      lotCompany_Code: user.lotCompany_Code || "",
      lotYear_Code: user.lotYear_Code || "",
      Adjusted_Amt: user.Adjusted_Amt || "",
      ln: user.ln || "",
    });

    openPopup("edit");
  };

  useEffect(() => {
    setTenderno(Tenderno);
  }, [Tenderno]);

  //Setting Calculations For Amount and Diff
  useEffect(() => {
    if (showPopup) {
      const initialAmount =
        selectedUser && selectedUser.id
          ? selectedUser.amount
          : users.length === 0
          ? formData.amount
          : diff;

      setFormDataDetail({
        ...formDataDetail,
        amount: initialAmount,
        grade_no: selectedUser?.grade_no || "",
        lotCompany_Code: selectedUser?.lotCompany_Code || 0,
        lotYear_Code: selectedUser?.lotYear_Code || 0,
        Adjusted_Amt: selectedUser?.Adjusted_Amt || 0,
        ln: selectedUser?.ln || null,
      });
    }
  }, [showPopup, selectedUser, users, formData, diff]);

  //Update Record In Detail
  const updateUser = async () => {
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        const updatedRowaction =
          user.rowaction === "Normal" ? "update" : user.rowaction;

        return {
          ...user,
          ...formDataDetail,
          rowaction: updatedRowaction,
        };
      } else {
        return user;
      }
    });
    setFormDataDetail({
      ...updatedUsers,
      lot_no: Tenderno,
    });

    setUsers(updatedUsers);

    const totalItemAmount = updatedUsers.reduce(
      (total, user) => total + parseFloat(user.amount || 0),
      0
    );
    setGlobalTotalAmount(totalItemAmount.toFixed(2));
    const totalDiff = (parseFloat(formData.amount) || 0) - totalItemAmount;
    setDiff(totalDiff.toFixed(2));

    closePopup();
  };

  //Delete Records In Detail
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

    setDiff((prevDiff) =>
      (parseFloat(prevDiff) + parseFloat(userToDelete.amount)).toFixed(2)
    );

    setGlobalTotalAmount((prevTotal) =>
      (parseFloat(prevTotal) - parseFloat(userToDelete.amount)).toFixed(2)
    );

    setUsers(updatedUsers);

    setFormDataDetail({
      ...formDataDetail,
      ...updatedUsers.find((u) => u.id === u.id),
    });

    setUsers(updatedUsers);
    setDeleteMode(true);
    setSelectedUser(userToDelete);
  };

  //Open Records In Detail
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

    setDiff((prevDiff) =>
      (parseFloat(prevDiff) - parseFloat(user.amount)).toFixed(2)
    );

    setGlobalTotalAmount((prevTotal) =>
      (parseFloat(prevTotal) + parseFloat(user.amount)).toFixed(2)
    );

    setFormDataDetail({
      ...formDataDetail,
    });

    setUsers(updatedUsers);

    setSelectedUser({});
  };

  useEffect(() => {
    if (selectedRecord) {
      handlerecordDoubleClicked();
    } else {
      handleAddOne();
    }
  }, [selectedRecord]);

  useEffect(() => {
    if (selectedRecord) {
      setUsers(
        lastTenderDetails.map((detail) => ({
          rowaction: "Normal",

          utrdetailid: detail.utrdetailid,
          lot_no: detail.lot_no || Tenderno,
          grade_no: detail.grade_no,
          amount: detail.amount,
          lotCompany_Code: detail.lotCompany_Code,
          Detail_Id: detail.Detail_Id,
          Company_Code: companyCode,
          Year_Code: Year_Code,
          lotYear_Code: detail.lotYear_Code,
          LTNo: 0,
          Adjusted_Amt: detail.Adjusted_Amt,
          ln: detail.ln,
          id: detail.utrdetailid,
        }))
      );
    }
  }, [selectedRecord, lastTenderDetails]);

  useEffect(() => {
    setUsers(
      lastTenderDetails.map((detail) => ({
        rowaction: "Normal",
        utrdetailid: detail.utrdetailid,
        lot_no: detail.lot_no,
        grade_no: detail.grade_no,
        amount: detail.amount,
        lotCompany_Code: detail.lotCompany_Code,
        Detail_Id: detail.Detail_Id,
        Company_Code: companyCode,
        Year_Code: Year_Code,
        lotYear_Code: detail.lotYear_Code,
        LTNo: 0,
        Adjusted_Amt: detail.Adjusted_Amt,
        ln: detail.ln,
        id: detail.utrdetailid,
      }))
    );
  }, [lastTenderDetails]);

  //get a particular record
  const handlerecordDoubleClicked = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/getutrByid?Company_Code=${companyCode}&Year_Code=${Year_Code}&doc_no=${selectedRecord.utr_head_data.doc_no}`
      );
      const data = response.data;
      lblBankname = data.labels.bankAcName;
      lblmillname = data.labels.millName;
      newbank_ac = data.utr_head.bank_ac;
      newmill_code = data.utr_head.mill_code;

      setFormData((prevData) => ({
        ...prevData,
        ...data.utr_head,
      }));
      setLastTenderData(data.utr_head || {});
      setLastTenderDetails(data.utr_details || []);

      const totalItemAmount = data.utr_details.reduce(
        (total, user) => total + parseFloat(user.amount),
        0
      );
      setGlobalTotalAmount(totalItemAmount.toFixed(2));

      const totalDiff =
        (parseFloat(data.utr_head.amount) || 0) - totalItemAmount;
      setDiff(totalDiff.toFixed(2));

      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setUpdateButtonClicked(true);
    setIsEditing(false);
  };

  //change No functionality to get that particular record
  const handleKeyDown = async (event) => {
    if (event.key === "Tab") {
      const changeNoValue = event.target.value;
      try {
        const response = await axios.get(
          `${API_URL}/getutrByid?Company_Code=${companyCode}&doc_no=${changeNoValue}&Year_Code=${Year_Code}`
        );
        const data = response.data;
        lblBankname = data.labels.bankAcName;
        lblmillname = data.labels.millName;
        newbank_ac = data.utr_head.bank_ac;
        newmill_code = data.utr_head.mill_code;

        setFormData((prevData) => ({
          ...prevData,
          ...data.utr_head,
        }));
        setLastTenderData(data.utr_head || {});
        setLastTenderDetails(data.utr_details || []);

        const totalItemAmount = data.utr_details.reduce(
          (total, user) => total + parseFloat(user.amount),
          0
        );
        setGlobalTotalAmount(totalItemAmount.toFixed(2));
        const totalDiff =
          (parseFloat(data.utr_head.amount) || 0) - totalItemAmount;
        setDiff(totalDiff.toFixed(2));
        setIsEditing(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  //Navigation Buttons
  const handleFirstButtonClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/get-firstutr-navigation?Company_Code=${companyCode}&Year_Code=${Year_Code}`
      );
      if (response.ok) {
        const data = await response.json();
        // Access the first element of the array
        lblBankname = data.labels.bankAcName;
        lblmillname = data.labels.millName;
        newbank_ac = data.first_head_data.bank_ac;
        newmill_code = data.first_head_data.mill_code;

        setFormData((prevData) => ({
          ...prevData,
          ...data.first_head_data,
        }));
        setLastTenderData(data.first_head_data || {});
        setLastTenderDetails(data.first_details_data || []);

        const totalItemAmount = data.first_details_data.reduce(
          (total, user) => total + parseFloat(user.amount),
          0
        );
        setGlobalTotalAmount(totalItemAmount.toFixed(2));
        const totalDiff =
          (parseFloat(data.first_head_data.amount) || 0) - totalItemAmount;
        setDiff(totalDiff.toFixed(2));
      } else {
        console.error(
          "Failed to fetch first record:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handlePreviousButtonClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/get-previousutr-navigation?Company_Code=${companyCode}&Year_Code=${Year_Code}&currentDocNo=${formData.doc_no}`
      );

      if (response.ok) {
        const data = await response.json();

        lblBankname = data.labels.bankAcName;
        lblmillname = data.labels.millName;
        newbank_ac = data.previous_head_data.bank_ac;
        newmill_code = data.previous_head_data.mill_code;

        setFormData((prevData) => ({
          ...prevData,
          ...data.previous_head_data,
        }));
        setLastTenderData(data.previous_head_data || {});
        setLastTenderDetails(data.previous_details_data || []);

        const totalItemAmount = data.previous_details_data.reduce(
          (total, user) => total + parseFloat(user.amount),
          0
        );
        setGlobalTotalAmount(totalItemAmount.toFixed(2));
        const totalDiff =
          (parseFloat(data.previous_head_data.amount) || 0) - totalItemAmount;
        setDiff(totalDiff.toFixed(2));
      } else {
        console.error(
          "Failed to fetch previous record:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleNextButtonClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/get-nextutr-navigation?currentDocNo=${formData.doc_no}&Company_Code=${companyCode}&Year_Code=${Year_Code}`
      );

      if (response.ok) {
        const data = await response.json();
        lblBankname = data.labels.bankAcName;
        lblmillname = data.labels.millName;
        newbank_ac = data.next_head_data.bank_ac;
        newmill_code = data.next_head_data.mill_code;

        setFormData((prevData) => ({
          ...prevData,
          ...data.next_head_data,
        }));
        setLastTenderData(data.next_head_data || {});
        setLastTenderDetails(data.next_details_data || []);

        const totalItemAmount = data.next_details_data.reduce(
          (total, user) => total + parseFloat(user.amount),
          0
        );
        setGlobalTotalAmount(totalItemAmount.toFixed(2));
        const totalDiff =
          (parseFloat(data.next_head_data.amount) || 0) - totalItemAmount;
        setDiff(totalDiff.toFixed(2));
      } else {
        console.error(
          "Failed to fetch next record:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleLastButtonClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/get-lastutrdata?Company_Code=${companyCode}&Year_Code=${Year_Code}`
      );
      if (response.ok) {
        const data = await response.json();
        lblBankname = data.labels.bankAcName;
        lblmillname = data.labels.millName;
        newbank_ac = data.last_head_data.bank_ac;
        newmill_code = data.last_head_data.mill_code;

        setFormData((prevData) => ({
          ...prevData,
          ...data.last_head_data,
        }));
        setLastTenderData(data.last_head_data || {});
        setLastTenderDetails(data.last_details_data || []);

        const totalItemAmount = data.last_details_data.reduce(
          (total, user) => total + parseFloat(user.amount),
          0
        );
        setGlobalTotalAmount(totalItemAmount.toFixed(2));
        const totalDiff =
          (parseFloat(data.last_head_data.amount) || 0) - totalItemAmount;
        setDiff(totalDiff.toFixed(2));
      } else {
        console.error(
          "Failed to fetch last record:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <>
      <div>
        <h2>UTR Entry</h2>
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
        <div style={{ marginBottom: "10px", marginRight: "10px" }}>
          <UTRReport
            doc_no={formData.doc_no}
            disabledFeild={!addOneButtonEnabled}
          />
        </div>
      </div>

      <div>
        <form>
          <br />
          <div className="form-group ">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                width: "1500px",
                margin: "auto",
                padding: "24px",
                backgroundColor: "#fff",
              }}
            >
              <Grid item xs={12} sm={1}>
                <TextField
                  label="Change No"
                  name="changeNo"
                  variant="outlined"
                  fullWidth
                  onKeyDown={handleKeyDown}
                  disabled={!addOneButtonEnabled}
                  size="small"
                  style={{ width: "150px" }}
                />
              </Grid>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Entry No"
                    name="doc_no"
                    variant="outlined"
                    fullWidth
                    value={formData.doc_no}
                    onChange={handleChange}
                    disabled
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Doc Date"
                    type="date"
                    name="doc_date"
                    variant="outlined"
                    fullWidth
                    value={formData.doc_date}
                    ref={docDateRef}
                    onChange={handleChange}
                    disabled={!isEditing && addOneButtonEnabled}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ display: "flex", alignItems: "center" }}
              >
                <label
                  htmlFor="bank_ac"
                  style={{ marginRight: "10px", whiteSpace: "nowrap" }}
                >
                  Bank Code:
                </label>
                <AccountMasterHelp
                  name="bank_ac"
                  onAcCodeClick={handleBankCode}
                  CategoryName={lblBankname}
                  CategoryCode={newbank_ac}
                  Ac_type="B"
                  tabIndex={3}
                  disabledFeild={!isEditing && addOneButtonEnabled}
                />
              </Grid>

              {/* Mill Code Field */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ display: "flex", alignItems: "center" }}
              >
                <label
                  htmlFor="mill_code"
                  style={{ marginRight: "10px", whiteSpace: "nowrap" }}
                >
                  Mill Code:
                </label>
                <AccountMasterHelp
                  name="mill_code"
                  onAcCodeClick={handleMillCode}
                  CategoryName={lblmillname}
                  CategoryCode={newmill_code}
                  Ac_type=""
                  tabIndex={4}
                  disabledFeild={!isEditing && addOneButtonEnabled}
                />
              </Grid>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Amount:"
                    name="amount"
                    variant="outlined"
                    fullWidth
                    value={formData.amount}
                    onChange={handleChange}
                    disabled={!isEditing && addOneButtonEnabled}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <TextField
                    label="UTR NO:"
                    name="utr_no"
                    variant="outlined"
                    fullWidth
                    value={formData.utr_no}
                    onChange={handleChange}
                    disabled={!isEditing && addOneButtonEnabled}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  label="Narration Header:"
                  name="narration_header"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.narration_header}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={!isEditing && addOneButtonEnabled}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Narration Footer:"
                  name="narration_footer"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.narration_footer}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={!isEditing && addOneButtonEnabled}
                  size="small"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={1}
                style={{ display: "flex", alignItems: "center" }}
              ></Grid>

              <Grid item xs={12} sm={1}>
                <TextField
                  label="Payment Detail:"
                  name="paymentData"
                  variant="outlined"
                  fullWidth
                  value={formData.paymentData}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            </div>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-container">
            <HashLoader color="#007bff" loading={isLoading} size={80} />
          </div>
        </div>
      )}

      <div className="">
        <button
          className="btn btn-primary"
          onClick={() => openPopup("add")}
          disabled={!isEditing}
          tabIndex="16"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              openPopup("add");
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
                    style={{ marginLeft: "80%", width: "60px", height: "30px" }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <label className="debitCreditNote-form-label">
                      lot_no:
                    </label>
                    <div className="debitCreditNote-col-Ewaybillno">
                      <div className="debitCreditNote-form-group">
                        <UTRLotnoHelp
                          onAcCodeClick={handlePurcno}
                          name="lot_no"
                          Tenderno={
                            newLot_no || tenderDetails.Tender_No || Tenderno
                          }
                          tabIndexHelp={98}
                          disabledFeild={!isEditing && addOneButtonEnabled}
                          Millcode={formData.mill_code}
                          onTenderDetailsFetched={handleTenderDetailsFetched}
                        />
                      </div>
                    </div>
                    <div className="debitCreditNote-col-Ewaybillno">
                      <div className="debitCreditNote-form-group">
                        <input
                          type="text"
                          tabIndex="5"
                          className="debitCreditNote-form-control"
                          name="lotCompany_Code"
                          autoComplete="off"
                          value={
                            formDataDetail.lotCompany_Code ||
                            tenderDetails.Company_Code
                          }
                          onChange={handleChangeDetail}
                        />
                        <input
                          type="text"
                          tabIndex="5"
                          className="debitCreditNote-form-control"
                          name="lotYear_Code"
                          autoComplete="off"
                          value={
                            formDataDetail.lotYear_Code ||
                            tenderDetails.Year_Code
                          }
                          onChange={handleChangeDetail}
                        />
                      </div>
                    </div>

                    <label className="debitCreditNote-form-label">
                      lot_no:
                    </label>
                    <div className="debitCreditNote-col-Ewaybillno">
                      <div className="debitCreditNote-form-group">
                        <input
                          type="text"
                          tabIndex="5"
                          className="debitCreditNote-form-control"
                          name="grade_no"
                          autoComplete="off"
                          value={formDataDetail.grade_no}
                          onChange={handleChangeDetail}
                        />
                      </div>
                    </div>
                    <label className="debitCreditNote-form-label">
                      amount:
                    </label>
                    <div className="debitCreditNote-col-Ewaybillno">
                      <div className="debitCreditNote-form-group">
                        <input
                          type="text"
                          tabIndex="5"
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
                          tabIndex="5"
                          className="debitCreditNote-form-control"
                          name="Adjusted_Amt"
                          autoComplete="off"
                          value={formDataDetail.Adjusted_Amt}
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

        <table className="table mt-4 table-bordered">
          <thead>
            <tr>
              <th>Actions</th>
              <th>ID</th>
              <th>lot_no</th>
              <th>grade no</th>
              <th>amount</th>
              <th>lotCompany_Code</th>
              <th>lotYear_Code</th>
              <th>Adjusted_Amt</th>
              <th>Tenderid</th>
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
                <td>{user.id}</td>
                <td>{user.lot_no}</td>
                <td>{user.grade_no}</td>
                <td>{user.amount}</td>
                <td>{user.lotCompany_Code}</td>
                <td>{user.lotYear_Code}</td>
                <td>{user.Adjusted_Amt}</td>
                <td>{user.ln}</td>
                <td>{user.rowaction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <label htmlFor="globalTotalAmount">Total Amount:</label>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            id="globalTotalAmount"
            name="globalTotalAmount"
            variant="outlined"
            fullWidth
            size="small"
            value={globalTotalAmount}
            onChange={handleChangeDetail}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item>
          <label htmlFor="diff">Diff:</label>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            id="diff"
            name="diff"
            variant="outlined"
            fullWidth
            size="small"
            value={diff}
            onChange={handleChangeDetail}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default UTREntry;
