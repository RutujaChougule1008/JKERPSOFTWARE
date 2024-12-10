import React, { useDebugValue } from "react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ActionButtonGroup from "../../../Common/CommonButtons/ActionButtonGroup";
import NavigationButtons from "../../../Common/CommonButtons/NavigationButtons";
import "./TenderPurchase.css";
import { HashLoader } from "react-spinners";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountMasterHelp from "../../../Helper/AccountMasterHelp";
import GSTRateMasterHelp from "../../../Helper/GSTRateMasterHelp";
import SystemHelpMaster from "../../../Helper/SystemmasterHelp";
import GradeMasterHelp from "../../../Helper/GradeMasterHelp";
import { useRecordLocking } from "../../../hooks/useRecordLocking";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Grid,
  InputLabel,
  FormControl,
} from "@mui/material";

var millCodeName;
var newMill_Code;
var gradeName;
var newGrade;
var paymentToName;
var newPayment_To;
var tenderFromName;
var newTender_From;
var tenderDOName;
var newTender_DO;
var voucherByName;
var newVoucher_By;
var brokerName;
var newBroker;
var itemName;
var newitemcode;
var gstRateName;
var gstRateCode;
var newgstratecode;
var bpAcName;
var newBp_Account;
var billToName;
var newBillToCode;
var shipToName;
var shipToCode;
var subBrokerName;
var subBrokerCode;
var newTenderId;
var selfAcCode;
var selfAcName;
var selfAccoid;
var buyerPartyCode;
var buyer_party_name;

// Common style for all table headers
const headerCellStyle = {
  fontWeight: "bold",
  backgroundColor: "#3f51b5",
  color: "white",
  "&:hover": {
    backgroundColor: "#303f9f",
    cursor: "pointer",
  },
};

const TenderPurchase = () => {
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
  const [accountCode, setAccountCode] = useState("");
  const [millCode, setMillCode] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [grade, setGrade] = useState("");
  const [bpAcCode, setBpAcCode] = useState("");
  const [paymentTo, setPaymentTo] = useState("");
  const [tdsApplicable, setTdsApplicalbe] = useState("");
  const [tenderFrom, setTenderFrom] = useState("");
  const [tenderDO, setTenderDO] = useState("");
  const [voucherBy, setVoucherBy] = useState("");
  const [broker, setBroker] = useState("");
  const [GstRate, setGSTRate] = useState("");
  const [lastTenderDetails, setLastTenderDetails] = useState([]);
  const [lastTenderData, setLastTenderData] = useState({});
  const [gstCode, setGstCode] = useState("");
  const [billtoName, setBillToName] = useState("");
  const [brokerDetail, setBrokerDetail] = useState("");
  const [shiptoName, setShipToName] = useState("");
  const [isGstRateChanged, setIsGstRateChanged] = useState(false);
  const [tenderFrName, setTenderFrName] = useState("");
  const [tenderDONm, setTenderDOName] = useState("");
  const [voucherbyName, setVoucherByName] = useState("");
  const [dispatchType, setDispatchType] = useState(null);
  const [buyerParty, setBuyerParty] = useState(selfAcCode);
  const [buyerPartyAccoid, setBuyerPartyAccoid] = useState(selfAccoid);
  const [buyerPartyName, setBuyerPartyName] = useState(selfAcName);
  const [errors, setErrors] = useState({});

  const companyCode = sessionStorage.getItem("Company_Code");
  const Year_Code = sessionStorage.getItem("Year_Code");
  const API_URL = process.env.REACT_APP_API;

  const drpType = useRef(null);

  const navigate = useNavigate();
  //In utility page record doubleClicked that recod show for edit functionality
  const location = useLocation();
  const selectedRecord = location.state?.selectedRecord;
  const permissions = location.state?.permissionsData;

  const selectedTenderNo = location.state?.selectedTenderNo;
  const initialFormData = {
    Tender_No: 0,
    Company_Code: companyCode,
    Tender_Date: new Date().toISOString().split("T")[0],
    Lifting_Date: new Date().toISOString().split("T")[0],
    Mill_Code: 0,
    Grade: "",
    Quantal: 0.0,
    Packing: 50,
    Bags: 0,
    Payment_To: 0,
    Tender_From: 0,
    Tender_DO: 0,
    Voucher_By: 0,
    Broker: selfAcCode,
    Excise_Rate: 0.0,
    Narration: "",
    Mill_Rate: 0.0,
    Created_By: "",
    Modified_By: "",
    Year_Code: Year_Code,
    Purc_Rate: 0.0,
    type: "M",
    Branch_Id: 0,
    Voucher_No: 0,
    Sell_Note_No: "",
    Brokrage: 0.0,
    mc: 0,
    itemcode: 0,
    season: "",
    pt: 0,
    tf: 0,
    td: 0,
    vb: 0,
    bk: selfAccoid,
    ic: 0,
    gstratecode: 0,
    CashDiff: 0.0,
    TCS_Rate: 0.0,
    TCS_Amt: 0.0,
    commissionid: 0,
    Voucher_Type: "",
    Party_Bill_Rate: 0.0,
    TDS_Rate: 0.0,
    TDS_Amt: 0.0,
    Temptender: "N",
    AutoPurchaseBill: "Y",
    Bp_Account: 0,
    bp: 0,
    groupTenderNo: 0,
    groupTenderId: 0,
    tenderid: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Deatil
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [billTo, setBillTo] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [detailBroker, setDetailBroker] = useState("");
  const [subBroker, setSubBroker] = useState("");
  const [billToAccoid, setBillToAccoid] = useState("");
  const [shipToAccoid, setShipToAccoid] = useState("");
  const [subBrokerAccoid, setSubBrokerAccoid] = useState("");
  const [self_ac_Code, setSelf_ac_code] = useState("");
  const [self_accoid, set_self_accoid] = useState("");
  const [self_acName, set_self_acName] = useState("");

  const [formDataDetail, setFormDataDetail] = useState({
    Buyer_Quantal: 0.0,
    Sale_Rate: 0.0,
    Commission_Rate: 0.0,
    Sauda_Date: new Date().toISOString().split("T")[0],
    Lifting_Date: formData?.Lifting_Date || "",
    Narration: "",
    tcs_rate: 0.0,
    gst_rate: 0.0,
    tcs_amt: 0.0,
    gst_amt: 0.0,
    CashDiff: 0.0,
    BP_Detail: 0,
    loding_by_us: "",
    DetailBrokrage: 0.0,
    Delivery_Type: dispatchType,
    sub_broker: 2,
    DetailBrokrage: 0.0,
  });

  //lock mechanism
  const { isRecordLockedByUser, lockRecord, unlockRecord } = useRecordLocking(
    formData.Tender_No,
    undefined,
    companyCode,
    Year_Code,
    "tender_purchase"
  );

  useEffect(() => {
    const fetchDispatchType = async () => {
      try {
        const response = await fetch(
          `${API_URL}/get_dispatch_type/${companyCode}`
        );
        const data = await response.json();
        setDispatchType(data.dispatchType);
      } catch (error) {
        console.error("Error fetching dispatch type:", error);
      }
    };

    fetchDispatchType();
  }, [companyCode]);

  //calculations
  const calculateValues = (
    updatedFormData,
    updatedFormDataDetail,
    tdsApplicable,
    gstCode
  ) => {
    debugger;
    const {
      Quantal = 0,
      Packing = 50,
      Mill_Rate = 0,
      Purc_Rate = 0,
      Excise_Rate = 0,
      TCS_Rate = 0,
      TDS_Rate = 0,
      type = "M",
    } = updatedFormData;

    const quantal = parseFloat(Quantal) || 0;
    const packing = parseFloat(Packing) || 50;
    const millRate = parseFloat(Mill_Rate) || 0;
    const purchaseRate = parseFloat(Purc_Rate) || 0;
    const exciseRate = (millRate * gstCode) / 100;
    const tcsRate = parseFloat(TCS_Rate) || 0;
    const tdsRate = parseFloat(TDS_Rate) || 0;

    const bags = (quantal / packing) * 100;
    const diff = type === "M" ? 0 : millRate - purchaseRate;
    const exciseAmount = exciseRate;
    const gstAmt = exciseAmount + millRate;
    const amount = quantal * (type === "M" ? millRate + exciseRate : diff);

    let tcsAmt = 0;
    let tdsAmt = 0;

    if (tdsApplicable === "Y") {
      tdsAmt = quantal * millRate * (tdsRate / 100);
    } else {
      tcsAmt =
      (((quantal * gstAmt) * tcsRate)/100);
    }

    // Calculate both regardless of TDS applicability
    const calculatedTcsAmt = (((quantal * gstAmt) * tcsRate)/100);
    const calculatedTdsAmt = quantal * millRate * (tdsRate / 100);
    const {
      Buyer_Quantal = 0,
      Sale_Rate = 0,
      BP_Detail = 0,
      tcs_rate = 0,
      gst_rate = 0,
    } = updatedFormDataDetail;

    const buyerQuantalNum = parseFloat(Buyer_Quantal) || 0;
    const saleRateNum = parseFloat(Sale_Rate) || 0;
    const bpDetailNum = parseFloat(BP_Detail) || 0;
    const tcsRateNum =
      parseFloat(tcs_rate) || parseFloat(formData.TCS_Rate) || 0;

    const gstRateNum = parseFloat(gst_rate) || gstCode || 0;

    const lblRate = buyerQuantalNum * saleRateNum;
    const gstAmtDetail = lblRate * (gstRateNum / 100);
    const tcsAmtDetail = (((buyerQuantalNum * saleRateNum) + gstAmtDetail) * tcsRateNum) / 100;
    const lblNetAmount = lblRate + gstAmtDetail + tcsAmtDetail / buyerQuantalNum;
    const lblValue = quantal * (millRate + exciseRate);

    return {
      bags,
      diff,
      exciseAmount: exciseRate,
      gstAmt,
      amount,
      lblValue,
      tcsAmt,
      tdsAmt,
      calculatedTcsAmt,
      calculatedTdsAmt,
      lblRate,
      gstAmtDetail,
      TCSAmt: tcsAmtDetail,
      lblNetAmount,
    };
  };

  useEffect(() => {
    const effectiveGstCode = gstCode || gstRateCode;
    const calculated = calculateValues(
      formData,
      formDataDetail,
      tdsApplicable,
      effectiveGstCode
    );
    setCalculatedValues(calculated);
  }, [formData, formDataDetail, tdsApplicable, gstCode, gstRateCode]);

  const [calculatedValues, setCalculatedValues] = useState({
    lblRate: 0,
    amount: 0,
    tdsAmt: 0,
    diff: 0,
    gstAmtDetail: 0,
    exciseAmount: 0,
    lblValue: 0,
    TCSAmt: 0.0,
    lblNetAmount: 0,
    bags: 0,
    gstAmt: 0,
    tcsAmt: 0,
  });

  const cleanFormData = (data) => {
    const {
      lblRate,
      amount,
      tdsAmt,
      diff,
      gstAmtDetail,
      exciseAmount,
      lblValue,
      TCSAmt,
      lblNetAmount,
      bags,
      gstAmt,
      tcsAmt,
      ...cleanedData
    } = data;
    return cleanedData;
  };

  const handleMill_Code = (code, accoid) => {
    setMillCode(code);
    setFormData({
      ...formData,
      Mill_Code: code,
      mc: accoid,
    });
  };
  const handleGrade = (name) => {
    setGrade(name);
    setFormData({
      ...formData,
      Grade: name,
    });
  };
  const handlePayment_To = (
    code,
    accoid,
    name,
    mobileNo,
    gstNo,
    TdsApplicable
  ) => {
    setPaymentTo(code);
    setTenderFrName(name);
    setVoucherByName(name);
    setTenderDOName(name);

    setFormData((prevFormData) => {
      const shouldUpdateTenderFrom =
        prevFormData.Tender_From === prevFormData.Payment_To;
      const shouldUpdateVoucherBy =
        prevFormData.Voucher_By === prevFormData.Payment_To;
      const shouldUpdateTenderDO =
        prevFormData.Tender_DO === prevFormData.Payment_To;

      const updatedFormData = {
        ...prevFormData,
        Payment_To: code,
        pt: accoid,
        Tender_From: shouldUpdateTenderFrom ? code : prevFormData.Tender_From,
        tf: shouldUpdateTenderFrom ? accoid : prevFormData.tf,
        Voucher_By: shouldUpdateVoucherBy ? code : prevFormData.Voucher_By,
        vb: shouldUpdateVoucherBy ? accoid : prevFormData.vb,
        Tender_DO: shouldUpdateTenderDO ? code : prevFormData.Tender_DO,
        td: shouldUpdateTenderDO ? accoid : prevFormData.td,
      };
      const calculated = calculateValues(
        updatedFormData,
        formDataDetail,
        TdsApplicable,
        gstCode
      );

      setCalculatedValues(calculated);
      return updatedFormData;
    });

    // Update any other related state
    setTenderFrom(code);
    setVoucherBy(code);
    setTenderDO(code);
  };

  const handleTender_From = (code, accoid) => {
    setTenderFrName("");
    setTenderFrom(code);
    setFormData({
      ...formData,
      Tender_From: code,
      tf: accoid,
    });
  };
  const handleTender_DO = (code, accoid) => {
    setTenderDOName("");
    setTenderDO(code);
    setFormData({
      ...formData,
      Tender_DO: code,
      td: accoid,
    });
  };
  const handleVoucher_By = (code, accoid) => {
    setVoucherByName("");
    setVoucherBy(code);
    setFormData({
      ...formData,
      Voucher_By: code,
      vb: accoid,
    });
  };
  const handleBroker = (code, accoid) => {
    setBroker(code);
    setFormData({
      ...formData,
      Broker: code,
      bk: accoid,
    });
  };
  const handleitemcode = (code, accoid, HSN, CategoryName, gst_code) => {
    setItemCode(code);
    setFormData({
      ...formData,
      itemcode: code,
      ic: accoid,
    });
  };

  const handlegstratecode = (code, Rate) => {
    const rate = parseFloat(Rate);
    setGSTRate(code);
    setGstCode(rate);

    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        gstratecode: code,
      };

      const calculatedValues = calculateValues(
        updatedFormData,
        formDataDetail,
        tdsApplicable,
        rate
      );
      setCalculatedValues(calculatedValues);

      return updatedFormData;
    });
  };

  const handleBp_Account = (code, accoid) => {
    setBpAcCode(code);
    setFormData({
      ...formData,
      Bp_Account: code,
      bp: accoid,
    });
  };

  const handleBillTo = (code, accoid, name) => {
    setBillTo(code);
    setBillToName(name);
    setBillToAccoid(accoid);
    setFormDataDetail({
      ...formDataDetail,
      Buyer: code,
      buyerid: accoid,
    });
  };

  const handleShipTo = (code, accoid, name) => {
    setShipTo(code);
    setShipToAccoid(accoid);
    setShipToName(name);
    setFormDataDetail({
      ...formDataDetail,
      ShipTo: code,
      shiptoid: accoid,
    });
  };

  const handleBuyerParty = (code, accoid, name) => {
    setBuyerParty(code);
    setBuyerPartyAccoid(accoid);
    setBuyerPartyName(name);
    setFormDataDetail({
      ...formDataDetail,
      Buyer_Party: code,
      buyerpartyid: accoid,
    });
  };

  const handleDetailSubBroker = (code, accoid, name) => {
    setSubBroker(code);
    setBrokerDetail(name);
    setSubBrokerAccoid(accoid);
    setFormDataDetail({
      ...formDataDetail,
      sub_broker: code,
      sbr: accoid,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value,
      };

      if (name === "Mill_Rate" && prevFormData.type === "M") {
        updatedFormData.Party_Bill_Rate = parseFloat(value) || 0;
      } else if (name === "Purc_Rate" && prevFormData.type !== "M") {
        updatedFormData.Party_Bill_Rate = parseFloat(value) || 0;
      }

      return {
        ...updatedFormData,
        Excise_Rate: calculatedValues.exciseAmount,
      };
    });

    setFormDataDetail((prevFormDataDetail) => {
      const updatedFormDataDetail = {
        ...prevFormDataDetail,
        gst_rate:
          name === "gstratecode"
            ? parseFloat(value) || 0
            : prevFormDataDetail.gst_rate,
        tcs_rate:
          name === "TCS_Rate"
            ? parseFloat(value) || 0
            : prevFormDataDetail.tcs_rate,
      };

      const calculatedValues = calculateValues(
        { ...formData, [name]: value },
        updatedFormDataDetail,
        tdsApplicable,
        name === "gstratecode" ? parseFloat(value) : gstCode
      );

      return {
        ...updatedFormDataDetail,
        tcs_amt: calculatedValues.TCSAmt,
      };
    });

    if (name === "TCS_Rate" || name === "gstratecode") {
      const updatedRate = parseFloat(value) || 0;

      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          tcs_rate: name === "TCS_Rate" ? updatedRate : user.tcs_rate,
          tcs_amt:
            name === "TCS_Rate"
              ? (user.Buyer_Quantal * user.Sale_Rate * updatedRate) / 100
              : user.tcs_amt,
          gst_rate: name === "gstratecode" ? updatedRate : user.gst_rate,
          gst_amt:
            name === "gstratecode"
              ? (user.Buyer_Quantal * user.Sale_Rate * updatedRate) / 100
              : user.gst_amt,
        }))
      );
    }
  };

  const handleGradeUpdate = (grade) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Grade: grade,
    }));
  };

  const handleChangeDetail = (e) => {
    const { name, value } = e.target;

    setFormDataDetail((prevFormDataDetail) => {
      const updatedFormDataDetail = {
        ...prevFormDataDetail,
        [name]: name === "tcs_rate" ? parseFloat(value) || 0 : value,
      };

      const calculatedValues = calculateValues(
        formData,
        updatedFormDataDetail,
        tdsApplicable,
        gstCode
      );

      return {
        ...updatedFormDataDetail,
        tcs_amt: calculatedValues.TCSAmt,
      };
    });
  };

  const validateNumericInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
  };

  const handleDetailDateChange = (event, fieldName) => {
    setFormDataDetail((prevFormDetailData) => ({
      ...prevFormDetailData,
      [fieldName]: event.target.value,
    }));
  };

  const handleCheckbox = (e, valueType = "string") => {
    const { name, checked } = e.target;
    const value =
      valueType === "numeric" ? (checked ? 1 : 0) : checked ? "Y" : "N";

    setFormDataDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchLastRecord = () => {
    fetch(
      `${API_URL}/getNextTenderNo_SugarTenderPurchase?Company_Code=${companyCode}&Year_Code=${Year_Code}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch last record");
        }
        return response.json();
      })
      .then((data) => {
        setFormData((prevState) => ({
          ...prevState,
          Tender_No: data.next_doc_no,
          Lifting_Date: data.lifting_date,
        }));
      })
      .catch((error) => {
        console.error("Error fetching last record:", error);
      });
  };

  let isProcessing = false;

  const handleAddOne = async () => {
    setAddOneButtonEnabled(false);
    setSaveButtonEnabled(true);
    setCancelButtonEnabled(true);
    setEditButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setIsEditMode(false);
    setIsEditing(true);
    setFormData(initialFormData);
    fetchLastRecord();
    setLastTenderDetails([]);
    setLastTenderData({});
    setUsers([]);
    millCodeName = "";
    newMill_Code = "";
    gradeName = "";
    newGrade = "";
    paymentToName = "";
    newPayment_To = "";
    tenderFromName = "";
    newTender_From = "";
    tenderDOName = "";
    newTender_DO = "";
    voucherByName = "";
    newVoucher_By = "";
    brokerName = "";
    newBroker = "";
    itemName = "";
    newitemcode = "";
    gstRateName = "";
    gstRateCode = "";
    newgstratecode = "";
    bpAcName = "";
    newBp_Account = "";
    billToName = "";
    newBillToCode = "";
    shipToName = "";
    shipToCode = "";
    subBrokerName = "";
    subBrokerCode = "";
    newTenderId = "";
    selfAcCode = "";
    selfAcName = "";
    selfAccoid = "";
    buyerPartyCode = "";
    buyer_party_name = "";
    setTimeout(() => {
      drpType.current?.focus();
    }, 0);

    if (isProcessing) return;

    isProcessing = true;

    try {
      await fetchSelfAcData();
    } catch (error) {
      console.error("Error adding record:", error);
    } finally {
      isProcessing = false;
    }
  };

  const handleSaveOrUpdate = async (event) => {
    debugger;
    event.preventDefault();

    setIsEditing(true);
    setIsLoading(true);

    const calculated = calculateValues(
      formData,
      formDataDetail,
      tdsApplicable,
      gstCode
    );


    const updatedFormData = {
      ...formData,
      Bags: calculated.bags,
      CashDiff: calculated.diff,
      TCS_Amt: calculated.tcsAmt,
      TDS_Amt: calculated.tdsAmt,
      Excise_Rate: calculated.exciseAmount,
    };

    const cleanedHeadData = cleanFormData(updatedFormData);

    if (isEditMode) {
      delete cleanedHeadData.tenderid;
    }


    const detailData = users.map((user) => {
      return {
        rowaction: user.rowaction,
        Buyer: user.Buyer || 0,
        Buyer_Quantal: user.Buyer_Quantal || 0.0,
        Sale_Rate: user.Sale_Rate || 0.0,
        Commission_Rate: user.Commission_Rate || 0.0,
        Sauda_Date: user.Sauda_Date || "",
        Lifting_Date: user.Lifting_Date || "",
        Narration: user.Narration || "",
        ID: user.ID || 0,
        ShipTo: user.ShipTo || 0,
        AutoID: user.AutoID || 0,
        IsActive: user.IsActive || "",
        year_code: Year_Code,
        Branch_Id: user.Branch_Id || 0,
        Delivery_Type: user.Delivery_Type || "",
        tenderdetailid: user.tenderdetailid,
        buyerid: user.buyerid,
        buyerpartyid: user.buyerpartyid,
        sub_broker: user.sub_broker,
        sbr: user.sbr || 0,
        tcs_rate: user.tcs_rate || 0.0,
        gst_rate: user.gst_rate || 0.0,
        tcs_amt: user.tcs_amt || 0.0,
        gst_amt: user.gst_amt || 0.0,
        ShipTo: user.ShipTo || 0,
        CashDiff: user.CashDiff || 0.0,
        shiptoid: user.shiptoid,
        BP_Detail: user.BP_Detail || 0,
        bpid: user.bpid || 0,
        loding_by_us: user.loding_by_us || "",
        DetailBrokrage: user.DetailBrokrage || 0.0,
        Company_Code: companyCode,
        Buyer_Party: user.Buyer_Party,
      };
    });

    const requestData = {
      headData: cleanedHeadData,
      detailData,
    };
    try {
      if (isEditMode) {
        const updateApiUrl = `${API_URL}/update_tender_purchase?tenderid=${newTenderId}`;
        const response = await axios.put(updateApiUrl, requestData);

        toast.success("Data updated successfully!");
      } else {
        const response = await axios.post(
          `${API_URL}/insert_tender_head_detail`,
          requestData
        );

        toast.success("Data saved successfully!");
      }
      setIsEditMode(false);
      setAddOneButtonEnabled(true);
      setEditButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setBackButtonEnabled(true);
      setSaveButtonEnabled(false);
      setCancelButtonEnabled(false);
      setIsEditing(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during API call:", error.response || error);
      toast.error("Error occurred while saving data");
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    axios
      .get(
        `${API_URL}/getTenderByTenderNo?Company_Code=${companyCode}&Tender_No=${formData.Tender_No}&Year_Code=${Year_Code}`
      )
      .then((response) => {
        const data = response.data;
        const isLockedNew = data.last_tender_head_data.LockedRecord;
        const isLockedByUserNew = data.last_tender_head_data.LockedUser;

        if (isLockedNew) {
          window.alert(`This record is locked by ${isLockedByUserNew}`);
          return;
        } else {
          lockRecord();
        }
        setFormData({
          ...formData,
          ...data.last_tender_head_data,
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

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this Task No ${formData.Tender_No}?`
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
        const deleteApiUrl = `${API_URL}/delete_TenderBytenderid?tenderid=${newTenderId}`;
        const response = await axios.delete(deleteApiUrl);

        if (response.status === 200) {
          const commissionDelete = `${API_URL}/delete-CommissionBill?doc_no=${formData.Voucher_No}&Company_Code=${companyCode}&Year_Code=${Year_Code}&Tran_Type=${formData.Voucher_Type}`;
          const result = await axios.delete(commissionDelete);
          if (result.status === 200 || result.status === 201) {
            toast.success("Data delete successfully!!");
            handleCancel();
          }
        } else {
          console.error(
            "Failed to delete tender:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  const handleCancel = async () => {
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);

    try {
      const endpoint = `${API_URL}/getlasttender_record_navigation?Company_Code=${companyCode}&Year_Code=${Year_Code}`;

      await fetchTenderData(endpoint, "last");

      unlockRecord();
    } catch (error) {
      console.error("Error during handleCancel API call:", error);
    }
  };

  const handleBack = () => {
    navigate("/tender-purchaseutility");
  };

  const handlerecordDoubleClicked = async () => {
    try {
      const tenderNo = selectedTenderNo || selectedRecord?.Tender_No;

      if (!tenderNo) {
        console.error("No Tender No. provided.");
        return;
      }

      const endpoint = `${API_URL}/getTenderByTenderNo?Company_Code=${companyCode}&Tender_No=${tenderNo}&Year_Code=${Year_Code}`;

      await fetchTenderData(endpoint, "last");

      setIsEditMode(false);
      setAddOneButtonEnabled(true);
      setEditButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setBackButtonEnabled(true);
      setSaveButtonEnabled(false);
      setCancelButtonEnabled(false);
      setUpdateButtonClicked(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching data during double-click:", error);
    }
  };

  useEffect(() => {
    if (selectedRecord || selectedTenderNo) {
      handlerecordDoubleClicked();
    } else {
      handleAddOne();
    }
    document.getElementById("type").focus();
  }, [selectedRecord, selectedTenderNo]);

  const handleKeyDown = async (event) => {
    if (event.key === "Tab") {
      const changeNoValue = event.target.value;

      if (!changeNoValue) {
        console.error("No value provided for Tender No.");
        return;
      }

      try {
        const endpoint = `${API_URL}/getTenderByTenderNo?Company_Code=${companyCode}&Tender_No=${changeNoValue}&Year_Code=${Year_Code}`;

        await fetchTenderData(endpoint, "last");

        setIsEditing(false);
      } catch (error) {
        console.error("Error fetching data on Tab key press:", error);
      }
    }
  };

  const fetchSelfAcData = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_SelfAc`, {
        params: { Company_Code: companyCode },
      });
  
      const selfAcCode = response.data.SELF_AC;
      const selfAccoid = response.data.Self_acid;
      const selfAcName = response.data.Self_acName;

      setSelf_ac_code(selfAcCode);
      set_self_accoid(selfAccoid);
      set_self_acName(selfAcName);

      setFormData((prevData) => ({
        ...prevData,
        Broker: selfAcCode,
        bk: selfAccoid,
      }));

      setUsers((prevUsers) => [
        {
          ...formDataDetail,
          rowaction: "add",
          id: prevUsers.length > 0 ? Math.max(...prevUsers.map((user) => user.id)) + 1 : 1,
          Buyer: selfAcCode,
          billtoName: selfAcName,
          buyerid: selfAccoid,
          ShipTo: selfAcCode,
          shiptoName: selfAcName,
          shiptoid: selfAccoid,
          buyerpartyid: selfAccoid,
          sub_broker: selfAcCode,
          brokerDetail: selfAcName,
          sbr: selfAccoid,
          Buyer_Party: selfAcCode,
          buyerPartyName: selfAcName,
          buyerpartyid: selfAccoid,
          Lifting_Date: formData.Lifting_Date,
          gst_rate: formData.gstratecode,
          tcs_rate: parseFloat(formData.TCS_Rate),
          Delivery_Type: dispatchType,
          ID: 1,
        },
        ...prevUsers,
      ]);
    } catch (error) {
      console.log(error.response?.data?.error || "An error occurred");
    }
  };
  

  const handleVoucherClick = () => {
    navigate("/commission-bill", {
      state: {
        selectedVoucherNo: formData.Voucher_No,
        selectedVoucherType: formData.Voucher_Type,
      },
    });
  };

  //detail part
  const addUser = async (e) => {
    debugger;
    const newUser = {
      ...formDataDetail,
      id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      Buyer: billTo,
      billtoName: billtoName,
      buyerid: billToAccoid,
      ShipTo: shipTo,
      shiptoName: shiptoName,
      shiptoid: shipToAccoid,
      sub_broker: subBroker || selfAcCode || self_ac_Code,
      brokerDetail: brokerDetail || selfAcName || self_acName,
      sbr: subBrokerAccoid || selfAccoid || self_accoid,
      Buyer_Party: buyerParty || self_ac_Code || selfAcCode,
      buyerPartyName: buyerPartyName || selfAcName || self_acName,
      buyerpartyid: buyerPartyAccoid || selfAccoid || self_accoid,
      gst_rate: gstCode || formDataDetail.gst_rate,
      gst_amt:
        calculatedValues.gstAmtDetail ||
        (formDataDetail.Buyer_Quantal * formDataDetail.Sale_Rate * gstCode) /
          100 ||
        0.0,
      tcs_rate: formData.TCS_Rate || formDataDetail.tcs_rate,
      tcs_amt: formDataDetail.tcs_amt || 0.0,
      rowaction: "add",
      Lifting_Date: formData.Lifting_Date || "",
    };
    const updatedUsers = [...users];
    if (updatedUsers.length > 0) {
      const firstUser = updatedUsers[0];
      updatedUsers[0] = {
        ...firstUser,
        Buyer_Quantal:
          firstUser.Buyer_Quantal - (formDataDetail.Buyer_Quantal || 0),
      };
    }
    updatedUsers.push(newUser);
    setUsers(updatedUsers);
    closePopup();
  };

  const updateUser = async () => {
    const selectedUserOriginalQuantal =
      users.find((user) => user.id === selectedUser.id)?.Buyer_Quantal || 0;
    const newBuyerQuantal = formDataDetail.Buyer_Quantal || 0;
    const quantalDifference = newBuyerQuantal - selectedUserOriginalQuantal;
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        const updatedRowaction =
          user.rowaction === "Normal" ? "update" : user.rowaction;

        return {
          ...user,
          Buyer: billTo || selfAcCode,
          billtoName: billtoName || selfAcName,
          ShipTo: shipTo || selfAcCode,
          shiptoName: shiptoName || selfAcName,
          sub_broker: subBroker || selfAcCode,
          brokerDetail: brokerDetail || selfAcName,
          BP_Detail: formDataDetail.BP_Detail,
          Buyer_Party: buyerParty || selfAcCode,
          buyerPartyName: buyerPartyName || selfAcName,
          Buyer_Quantal: newBuyerQuantal,
          CashDiff: formDataDetail.CashDiff,
          Commission_Rate: formDataDetail.Commission_Rate,
          DetailBrokrage: formDataDetail.DetailBrokrage,
          Lifting_Date: formDataDetail.Lifting_Date,
          Narration: formDataDetail.Narration,
          Sale_Rate: formDataDetail.Sale_Rate,
          Sauda_Date: formDataDetail.Sauda_Date,
          gst_amt:
            calculatedValues.gstAmtDetail ||
            (newBuyerQuantal * formDataDetail.Sale_Rate * gstCode) / 100 ||
            0.0,
          gst_rate: formDataDetail.gst_rate || 0.0,
          loding_by_us: formDataDetail.loding_by_us,
          Delivery_Type: formDataDetail.Delivery_Type,
          tcs_amt: formDataDetail.tcs_amt,
          tcs_rate: formDataDetail.tcs_rate || 0.0,
          Broker: newBroker || selfAcCode,
          brokerName: brokerName || selfAcName,
          rowaction: updatedRowaction,
        };
      } else {
        return user;
      }
    });
    if (updatedUsers.length > 0 && updatedUsers[0]) {
      updatedUsers[0] = {
        ...updatedUsers[0],
        Buyer_Quantal: updatedUsers[0].Buyer_Quantal - quantalDifference,
      };
    }
    setUsers(updatedUsers);

    closePopup();
  };

  const deleteModeHandler = (user) => {
    let updatedUsers = [...users];
    const userQuantal = parseFloat(user.Buyer_Quantal) || 0;

    if (isEditMode && user.rowaction === "add") {
      setDeleteMode(true);
      setSelectedUser(user);

      if (updatedUsers.length > 0) {
        updatedUsers[0] = {
          ...updatedUsers[0],
          Buyer_Quantal: updatedUsers[0].Buyer_Quantal + userQuantal,
        };
      }

      updatedUsers = updatedUsers.map((u) =>
        u.id === user.id ? { ...u, rowaction: "DNU" } : u
      );
    } else if (isEditMode) {
      setDeleteMode(true);
      setSelectedUser(user);

      if (updatedUsers.length > 0) {
        updatedUsers[0] = {
          ...updatedUsers[0],
          Buyer_Quantal: updatedUsers[0].Buyer_Quantal + userQuantal,
        };
      }

      updatedUsers = updatedUsers.map((u) =>
        u.id === user.id ? { ...u, rowaction: "delete" } : u
      );
    } else {
      setDeleteMode(true);
      setSelectedUser(user);

      if (updatedUsers.length > 0) {
        updatedUsers[0] = {
          ...updatedUsers[0],
          Buyer_Quantal: updatedUsers[0].Buyer_Quantal + userQuantal,
        };
      }

      updatedUsers = updatedUsers.map((u) =>
        u.id === user.id ? { ...u, rowaction: "DNU" } : u
      );
    }

    setUsers(updatedUsers);
    setSelectedUser({});
  };

  const openDelete = async (user) => {
    setDeleteMode(true);
    setSelectedUser(user);
    let updatedUsers = [...users];
    const userQuantal = parseFloat(user.Buyer_Quantal) || 0;

    if (isEditMode && user.rowaction === "delete") {
      if (updatedUsers.length > 0) {
        updatedUsers[0] = {
          ...updatedUsers[0],
          Buyer_Quantal: updatedUsers[0].Buyer_Quantal - userQuantal,
        };
      }

      updatedUsers = updatedUsers.map((u) =>
        u.id === user.id ? { ...u, rowaction: "Normal" } : u
      );
    } else {
      if (updatedUsers.length > 0) {
        updatedUsers[0] = {
          ...updatedUsers[0],
          Buyer_Quantal: updatedUsers[0].Buyer_Quantal - userQuantal,
        };
      }

      updatedUsers = updatedUsers.map((u) =>
        u.id === user.id ? { ...u, rowaction: "add" } : u
      );
    }

    setUsers(updatedUsers);
    setSelectedUser({});
  };

  const openPopup = (mode) => {
    debugger;
    setPopupMode(mode);
    setShowPopup(true);
    if (mode === "add") {
      clearForm();
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser({});
    clearForm();
  };

  const clearForm = () => {
    setFormDataDetail({
      Buyer_Quantal: "",
      Sale_Rate: 0.0,
      Commission_Rate: 0.0,
      Sauda_Date: new Date().toISOString().split("T")[0],
      Lifting_Date: formData.Lifting_Date,
      Narration: "",
      tcs_rate: 0.0,
      gst_rate: 0.0,
      tcs_amt: 0.0,
      gst_amt: 0.0,
      CashDiff: 0.0,
      BP_Detail: "",
      loding_by_us: "",
      DetailBrokrage: "",
      Delivery_Type: "",
    });
    setBillTo("");
    setShipTo("");
    setSubBroker("");
    setBillToAccoid("");
    setShipToAccoid("");
    setSubBrokerAccoid("");
    setBillToName("");
    setShipToName("");
    setBrokerDetail("");
    setDetailBroker("");
    setBuyerParty("");
    setBuyerPartyAccoid("");
    setBuyerPartyName("");

    selfAcCode = "";
    selfAcName = "";
    selfAccoid = "";
  };

  const editUser = (user) => {
    setSelectedUser(user);

    setBillTo(user.Buyer);
    setShipTo(user.ShipTo);
    setSubBroker(user.sub_broker);
    setBillToName(user.billtoName);
    setShipToName(user.shiptoName);
    setBrokerDetail(user.subBrokerName);
    setBuyerParty(user.Buyer_Party);
    setBuyerPartyName(user.buyerPartyName);

    setFormDataDetail({
      Buyer_Quantal: user.Buyer_Quantal || 0.0,
      Sale_Rate: user.Sale_Rate || 0.0,
      Commission_Rate: user.Commission_Rate || 0.0,
      Sauda_Date: user.Sauda_Date || 0.0,
      Lifting_Date: user.Lifting_Date || 0.0,
      Narration: user.Narration || 0.0,
      tcs_rate: user.tcs_rate || 0.0,
      gst_rate: user.gst_rate || 0.0,
      tcs_amt: user.tcs_amt || 0.0,
      gst_amt: parseFloat(user.gst_amt).toFixed(2) || 0.0,
      CashDiff: user.CashDiff || 0.0,
      BP_Detail: user.BP_Detail || 0.0,
      loding_by_us: user.loding_by_us || 0.0,
      DetailBrokrage: user.DetailBrokrage || 0.0,
    });
    openPopup("edit");
  };

  useEffect(() => {
    if (selectedRecord) {
      setUsers(
        lastTenderDetails.map((detail) => ({
          Buyer: detail.Buyer,
          billtoName: detail.billtoName,
          ShipTo: detail.ShipTo,
          shiptoName: detail.shiptoName,
          Buyer_Party: detail.Buyer_Party,
          buyerPartyName: detail.buyerPartyName,
          sub_broker: detail.sub_broker,
          brokerDetail: detail.brokerDetail,
          BP_Detail: detail.BP_Detail,
          Buyer_Quantal: detail.Buyer_Quantal !== undefined ? detail.Buyer_Quantal : 0,
          CashDiff: detail.CashDiff,
          Commission_Rate: detail.Commission_Rate,
          DetailBrokrage: detail.DetailBrokrage,
          Lifting_Date: detail.Lifting_Date,
          Narration: detail.Narration,
          Sale_Rate: detail.Sale_Rate,
          Sauda_Date: detail.Sauda_Date,
          gst_amt: detail.gst_amt,
          gst_rate: detail.gst_rate,
          loding_by_us: detail.loding_by_us,
          Delivery_Type: detail.Delivery_Type,
          tenderdetailid: detail.tenderdetailid,
          id: detail.ID,
          tcs_rate: detail.tcs_rate,
          tcs_amt: detail.tcs_amt,
          buyerid: detail.buyerid,
          buyerpartyid: detail.buyerpartyid,
          sbr: detail.sbr,
          gst_rate: detail.gst_rate,

          rowaction: "Normal",
        }))
      );
    }
  }, [selectedRecord, lastTenderDetails]);

  useEffect(() => {
    const updatedUsers = lastTenderDetails.map((detail) => ({
      Buyer: detail.Buyer,
      billtoName: detail.buyername,
      ShipTo: detail.ShipTo,
      shiptoName: detail.ShipToname,
      Buyer_Party: detail.Buyer_Party,
      buyerPartyName: detail.buyerpartyname,
      sub_broker: detail.sub_broker,
      brokerDetail: detail.subbrokername,
      BP_Detail: detail.BP_Detail,
      Buyer_Quantal: detail.Buyer_Quantal !== undefined ? detail.Buyer_Quantal : 0,
      CashDiff: detail.CashDiff,
      Commission_Rate: detail.Commission_Rate,
      DetailBrokrage: detail.DetailBrokrage,
      Lifting_Date: detail.payment_date,
      Narration: detail.Narration || "",
      Sale_Rate: detail.Sale_Rate,
      Sauda_Date: detail.Sauda_Date,
      gst_amt: detail.gst_amt,
      gst_rate: detail.gst_rate,
      loding_by_us: detail.loding_by_us,
      Delivery_Type: detail.Delivery_Type,
      tenderdetailid: detail.tenderdetailid,
      id: detail.tenderdetailid,
      tcs_rate: detail.tcs_rate,
      tcs_amt: detail.tcs_amt,
      buyerid: detail.buyerid,
      buyerpartyid: detail.buyerpartyid,
      sbr: detail.sbr,

      rowaction: "Normal",
    }));
    setUsers(updatedUsers);
  }, [lastTenderDetails]);

  useEffect(() => {
    if (users.length > 0) {
      const updatedUsers = [...users];

      if (formData.Quantal !== undefined) {
        const firstUser = updatedUsers[0];
        const newBuyerQuantal = parseFloat(formData.Quantal) || 0;
        const newGstRate = gstCode || firstUser.gst_rate;
        const newGstAmt =
          (newBuyerQuantal * newGstRate * (firstUser.Sale_Rate || 0)) / 100 ||
          0.0;

        updatedUsers[0] = {
          ...firstUser,
          Buyer_Quantal: newBuyerQuantal,
          gst_rate: newGstRate,
          gst_amt: newGstAmt,
          rowaction: firstUser.rowaction === "add" ? "add" : "update",
        };
      }

      if (updatedUsers.length > 1) {
        let remainingQuantal = updatedUsers[0].Buyer_Quantal;

        for (let i = 1; i < updatedUsers.length; i++) {
          const currentUser = updatedUsers[i];
          const userQuantal = currentUser.Buyer_Quantal || 0;

          remainingQuantal -= userQuantal;

          updatedUsers[0].Buyer_Quantal = remainingQuantal;
        }
      }

      setUsers(updatedUsers);
    }
  }, [formData.Quantal, gstCode]);


  const handleBuyerQuantalUpdate = () => {
      if (users.length > 0) {
      const updatedUsers = [...users];

      if (formData.Quantal !== undefined) {
        const firstUser = updatedUsers[0];
        const newBuyerQuantal = parseFloat(formData.Quantal) || 0;
        const newGstRate = gstCode || firstUser.gst_rate;
        const newGstAmt =
          (newBuyerQuantal * newGstRate * (firstUser.Sale_Rate || 0)) / 100 ||
          0.0;

        updatedUsers[0] = {
          ...firstUser,
          Buyer_Quantal: newBuyerQuantal,
          gst_rate: newGstRate,
          gst_amt: newGstAmt,
          rowaction: firstUser.rowaction === "add" ? "add" : "update",
        };
      }

      if (updatedUsers.length > 1) {
        let remainingQuantal = updatedUsers[0].Buyer_Quantal;

        for (let i = 1; i < updatedUsers.length; i++) {
          const currentUser = updatedUsers[i];
          const userQuantal = currentUser.Buyer_Quantal || 0;

          remainingQuantal -= userQuantal;
          updatedUsers[0].Buyer_Quantal = remainingQuantal;
        }
      }
      setUsers(updatedUsers);
    }
      

   };
  
  //  const handleKeyDownCalBuyerQuantal = (e) => {
  //   if (e.key === "Tab") {
  //     handleBuyerQuantalUpdate();
  //   }
  // }

  const TCSCalculationDetail = (e) => {
    if (e.key === "Tab") {
      debugger;
      const updatedCalculatedValues = calculateValues(
        formData,
        formDataDetail,
        tdsApplicable,
        gstCode
      );
      setFormDataDetail((prevFormDataDetail) => ({
        ...prevFormDataDetail,
        tcs_amt:
          updatedCalculatedValues.TCSAmt ||
          0,
      }));
    }
  };

  //common function for navigation and fetching perticular record
  const fetchTenderData = async (endpoint, action) => {
    try {
      const response = await fetch(endpoint);

      if (response.ok) {
        const data = await response.json();

        const headData = data[`${action}_tender_head_data`] || {};
        const detailsData = data[`${action}_tender_details_data`] || [];

        newTenderId = headData.tenderid;
        millCodeName = detailsData[0]?.MillName || "";
        newMill_Code = headData.Mill_Code;
        gradeName = headData.Grade;
        paymentToName = detailsData[0]?.PaymentToAcName || "";
        newPayment_To = headData.Payment_To;
        tenderFromName = detailsData[0]?.TenderFromAcName || "";
        newTender_From = headData.Tender_From;
        tenderDOName = detailsData[0]?.TenderDoAcName || "";
        newTender_DO = headData.Tender_DO;
        voucherByName = detailsData[0]?.VoucherByAcName || "";
        newVoucher_By = headData.Voucher_By;
        brokerName = detailsData[0]?.BrokerAcName || "";
        newBroker = headData.Broker;
        itemName = detailsData[0]?.ItemName || "";
        newitemcode = headData.itemcode;
        gstRateName = detailsData[0]?.GST_Name || "";
        gstRateCode = detailsData[0]?.GSTRate || 0;
        newgstratecode = headData.gstratecode;
        bpAcName = detailsData[0]?.BPAcName || "";
        newBp_Account = headData.Bp_Account;
        billToName = detailsData[0]?.buyername || "";
        newBillToCode = detailsData[0]?.Buyer || 0;
        shipToName = detailsData[0]?.ShipToname || "";
        shipToCode = detailsData[0]?.ShipTo || 0;
        subBrokerName = detailsData[0]?.subbrokername || "";
        subBrokerCode = detailsData[0]?.sub_broker || 0;
        buyerPartyCode = detailsData[0]?.Buyer_Party || 0;
        buyer_party_name = detailsData[0]?.buyerpartyname || "";

        // const updatedTenderDetailsData = detailsData.map((item, index) => ({
        //   ...item,
        //   Buyer_Quantal:
        //   index === 0
        //     ? parseFloat(detailsData[0].Buyer_Quantal || 0)
        //     : parseFloat(item.Buyer_Quantal || 0),
        
        // }));

        setFormData((prevData) => ({
          ...prevData,
          ...headData,
        }));

        setLastTenderData(headData || {});
        setLastTenderDetails(detailsData || []);
        setUsers(
          detailsData.map((detail) => ({
            Buyer: detail.Buyer,
            billtoName: detail.buyername,
            ShipTo: detail.ShipTo,
            shiptoName: detail.ShipToname,
            Buyer_Party: detail.Buyer_Party,
            buyerPartyName: detail.buyerpartyname,
            sub_broker: detail.sub_broker,
            brokerDetail: detail.subbrokername,
            BP_Detail: detail.BP_Detail,
            Buyer_Quantal: detail.Buyer_Quantal !== undefined ? detail.Buyer_Quantal : 0,
            CashDiff: detail.CashDiff,
            Commission_Rate: detail.Commission_Rate,
            DetailBrokrage: detail.DetailBrokrage,
            Lifting_Date: detail.payment_date,
            Narration: detail.Narration || "",
            Sale_Rate: detail.Sale_Rate,
            Sauda_Date: detail.Sauda_Date,
            gst_amt: detail.gst_amt,
            gst_rate: detail.gst_rate,
            loding_by_us: detail.loding_by_us,
            Delivery_Type: detail.Delivery_Type,
            tenderdetailid: detail.tenderdetailid,
            id: detail.tenderdetailid,
            tcs_rate: detail.tcs_rate,
            tcs_amt: detail.tcs_amt,
            buyerid: detail.buyerid,
            buyerpartyid: detail.buyerpartyid,
            sbr: detail.sbr,
            rowaction: "Normal",
          }))
        );
      } else {
        console.error(
          `Failed to fetch ${action} record:`,
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error during API call for ${action}:`, error);
    }
  };

  // Handle the "First" button
  const handleFirstButtonClick = async () => {
    const endpoint = `${API_URL}/getfirsttender_record_navigation?Company_Code=${companyCode}&Year_Code=${Year_Code}`;
    await fetchTenderData(endpoint, "first");
  };

  // Handle the "Previous" button
  const handlePreviousButtonClick = async () => {
    const endpoint = `${API_URL}/getprevioustender_navigation?CurrenttenderNo=${formData.Tender_No}&Company_Code=${companyCode}&Year_Code=${Year_Code}`;
    await fetchTenderData(endpoint, "previous");
  };

  // Handle the "Next" button
  const handleNextButtonClick = async () => {
    const endpoint = `${API_URL}/getnexttender_navigation?CurrenttenderNo=${formData.Tender_No}&Company_Code=${companyCode}&Year_Code=${Year_Code}`;
    await fetchTenderData(endpoint, "next");
  };

  return (
    <>
      <ToastContainer autoClose={500} />
      <form className="SugarTenderPurchase-container" onSubmit={handleSubmit}>
        <h6 className="Heading">Tender Purchase</h6>
        <div>
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
            permissions={permissions}
          />
          <NavigationButtons
            handleFirstButtonClick={handleFirstButtonClick}
            handlePreviousButtonClick={handlePreviousButtonClick}
            handleNextButtonClick={handleNextButtonClick}
            handleLastButtonClick={handleCancel}
            highlightedButton={highlightedButton}
            isEditing={isEditing}
          />
        </div>

        <div className="SugarTenderPurchase-row"></div>
        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Tender_No"
              className="SugarTenderPurchase-form-label"
            >
              Change No
            </label>
            <input
              type="text"
              className="SugarTenderPurchase-form-control"
              name="changeNo"
              autoComplete="off"
              onKeyDown={handleKeyDown}
              disabled={!addOneButtonEnabled}
              tabIndex={1}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Tender_No"
              className="SugarTenderPurchase-form-label"
            >
              Tender No:
            </label>
            <input
              type="text"
              id="Tender_No"
              name="Tender_No"
              className="SugarTenderPurchase-form-control"
              value={formData.Tender_No}
              onChange={handleChange}
              disabled
              tabIndex={2}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label htmlFor="type" className="SugarTenderPurchase-form-label">
              Resale/Mill:
            </label>
            <select
              type="text"
              id="type"
              name="type"
              className="SugarTenderPurchase-form-control"
              value={formData.type}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={3}
              ref={drpType}
            >
              <option value="R">Resale</option>
              <option value="M">Mill</option>
              <option value="W">With Payment</option>
              <option value="P">Party Bill Rate</option>
            </select>
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="AutoPurchaseBill"
              className="SugarTenderPurchase-form-label"
            >
              Auto Purchase Bill:
            </label>
            <select
              type="text"
              id="AutoPurchaseBill"
              name="AutoPurchaseBill"
              className="SugarTenderPurchase-form-control"
              value={formData.AutoPurchaseBill}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={5}
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div className="SugarTenderPurchase-col" onClick={handleVoucherClick}>
            <label
              htmlFor="Voucher_No"
              className="SugarTenderPurchase-form-label"
            >
              Voucher No:
            </label>
            <input
              type="text"
              id="Voucher_No"
              name="Voucher_No"
              className="SugarTenderPurchase-form-control"
              value={formData.Voucher_No}
              onChange={handleChange}
              disabled
              tabIndex={6}
            />
            <label>{formData.Voucher_Type}</label>
          </div>
        </div>

        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Tender_Date"
              className="SugarTenderPurchase-form-label"
            >
              Date:
            </label>
            <input
              type="date"
              id="Tender_Date"
              name="Tender_Date"
              className="SugarTenderPurchase-form-control"
              value={formData.Tender_Date}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={7}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Lifting_Date"
              className="SugarTenderPurchase-form-label"
            >
              Payment Date:
            </label>
            <input
              type="date"
              id="Lifting_Date"
              name="Lifting_Date"
              className="SugarTenderPurchase-form-control"
              value={formData.Lifting_Date}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={8}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="groupTenderNo"
              className="SugarTenderPurchase-form-label"
            >
              Group Tender No:
            </label>
            <input
              type="text"
              id="groupTenderNo"
              name="groupTenderNo"
              className="SugarTenderPurchase-form-control"
              value={formData.groupTenderNo}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={9}
            />
          </div>
        </div>

        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Mill_Code"
              className="SugarTenderPurchase-form-label"
            >
              Mill Code:
            </label>
            <AccountMasterHelp
              name="Mill_Code"
              onAcCodeClick={handleMill_Code}
              CategoryName={millCodeName}
              CategoryCode={newMill_Code}
              Ac_type="M"
              tabIndexHelp={10}
              disabledFeild={!isEditing && addOneButtonEnabled}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label htmlFor="season" className="SugarTenderPurchase-form-label">
              Season:
            </label>
            <input
              type="text"
              id="season"
              name="season"
              className="SugarTenderPurchase-form-control"
              value={formData.season}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={11}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="itemcode"
              className="SugarTenderPurchase-form-label"
            >
              Item Code:
            </label>
            <SystemHelpMaster
              name="itemcode"
              onAcCodeClick={handleitemcode}
              CategoryName={itemName}
              CategoryCode={newitemcode}
              tabIndexHelp={12}
              disabledField={!isEditing && addOneButtonEnabled}
              SystemType="I"
            />
          </div>
        </div>
        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label htmlFor="Grade" className="SugarTenderPurchase-form-label">
              Grade:
            </label>
            <GradeMasterHelp
              name="Grade"
              onAcCodeClick={handleGrade}
              CategoryName={formData.Grade || newGrade}
              tabIndexHelp={13}
              disabledField={!isEditing && addOneButtonEnabled}
              onCategoryChange={handleGradeUpdate}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label htmlFor="Quantal" className="SugarTenderPurchase-form-label">
              Quintal:
            </label>
            <input
              type="text"
              id="Quantal"
              name="Quantal"
              className="SugarTenderPurchase-form-control"
              value={formData.Quantal}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
             
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={14}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label htmlFor="Packing" className="SugarTenderPurchase-form-label">
              Packing:
            </label>
            <input
              type="text"
              id="Packing"
              name="Packing"
              className="SugarTenderPurchase-form-control"
              value={formData.Packing}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={15}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label htmlFor="Bags" className="SugarTenderPurchase-form-label">
              Bags:
            </label>
            <input
              type="text"
              id="Bags"
              name="Bags"
              className="SugarTenderPurchase-form-control"
              value={formData.Bags || calculatedValues.bags}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={16}
            />
          </div>
        </div>

        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Mill_Rate"
              className="SugarTenderPurchase-form-label"
            >
              Mill Rate:
            </label>
            <input
              type="text"
              id="Mill_Rate"
              name="Mill_Rate"
              className="SugarTenderPurchase-form-control"
              value={formData.Mill_Rate}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={17}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Purc_Rate"
              className="SugarTenderPurchase-form-label"
            >
              Purchase Rate:
            </label>
            <input
              type="text"
              id="Purc_Rate"
              name="Purc_Rate"
              className="SugarTenderPurchase-form-control"
              value={formData.Purc_Rate}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={
                (!isEditing && addOneButtonEnabled) || formData.type === "M"
              }
              tabIndex={18}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Party_Bill_Rate"
              className="SugarTenderPurchase-form-label"
            >
              Party Bill Rate:
            </label>
            <input
              type="text"
              id="Party_Bill_Rate"
              name="Party_Bill_Rate"
              className="SugarTenderPurchase-form-control"
              value={formData.Party_Bill_Rate}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={19}
            />
          </div>
        </div>

        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Bp_Account"
              className="SugarTenderPurchase-form-label"
            >
              BP A/C:
            </label>
            <AccountMasterHelp
              name="Bp_Account"
              onAcCodeClick={handleBp_Account}
              CategoryName={bpAcName}
              CategoryCode={newBp_Account}
              Ac_type=""
              tabIndexHelp={20}
              disabledFeild={!isEditing && addOneButtonEnabled}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="CashDiff"
              className="SugarTenderPurchase-form-label"
            >
              Diff:
            </label>
            <input
              type="text"
              id="CashDiff"
              name="CashDiff"
              className="SugarTenderPurchase-form-control"
              value={calculatedValues.diff || formData.CashDiff}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={21}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label>{calculatedValues.amount}</label>
          </div>
        </div>
        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Payment_To"
              className="SugarTenderPurchase-form-label"
            >
              Payment To:
            </label>
            <AccountMasterHelp
              name="Payment_To"
              onAcCodeClick={handlePayment_To}
              CategoryName={paymentToName}
              CategoryCode={newPayment_To}
              Ac_type=""
              tabIndexHelp={22}
              disabledFeild={!isEditing && addOneButtonEnabled}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Tender_From"
              className="SugarTenderPurchase-form-label"
            >
              Tender From:
            </label>
            <AccountMasterHelp
              name="Tender_From"
              onAcCodeClick={handleTender_From}
              CategoryName={tenderFromName || paymentToName || tenderFrName}
              CategoryCode={
                newTender_From || newPayment_To || formData.Tender_From
              }
              Ac_type=""
              tabIndexHelp={23}
              disabledFeild={!isEditing && addOneButtonEnabled}
            />
          </div>
        </div>
        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Tender_DO"
              className="SugarTenderPurchase-form-label"
            >
              Tender D.O.:
            </label>
            <AccountMasterHelp
              name="Tender_DO"
              onAcCodeClick={handleTender_DO}
              CategoryName={tenderDOName !== "" ? tenderDOName : tenderDONm}
              CategoryCode={newTender_DO || formData.Tender_DO}
              Ac_type=""
              tabIndexHelp={24}
              disabledFeild={!isEditing && addOneButtonEnabled}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Voucher_By"
              className="SugarTenderPurchase-form-label"
            >
              Voucher By:
            </label>
            <AccountMasterHelp
              name="Voucher_By"
              onAcCodeClick={handleVoucher_By}
              CategoryName={voucherByName || voucherbyName}
              CategoryCode={newVoucher_By || formData.Voucher_By}
              Ac_type=""
              tabIndexHelp={25}
              disabledFeild={!isEditing && addOneButtonEnabled}
            />
          </div>
        </div>
        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label htmlFor="Broker" className="SugarTenderPurchase-form-label">
              Broker:
            </label>
            <AccountMasterHelp
              name="Broker"
              onAcCodeClick={handleBroker}
              CategoryName={
                formData.Broker === self_ac_Code ? self_acName : brokerName
              }
              CategoryCode={newBroker || self_ac_Code}
              Ac_type=""
              tabIndexHelp={26}
              disabledFeild={!isEditing && addOneButtonEnabled}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Brokrage"
              className="SugarTenderPurchase-form-label"
            >
              Brokrage:
            </label>
            <input
              type="text"
              id="Brokrage"
              name="Brokrage"
              value={formData.Brokrage}
              className="SugarTenderPurchase-form-control"
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={27}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="gstratecode"
              className="SugarTenderPurchase-form-label"
            >
              GST Rate Code:
            </label>
            <GSTRateMasterHelp
              onAcCodeClick={handlegstratecode}
              GstRateName={gstRateName}
              GstRateCode={newgstratecode}
              name="gstratecode"
              tabIndexHelp={28}
              disabledFeild={!isEditing && addOneButtonEnabled}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Excise_Rate"
              className="SugarTenderPurchase-form-label"
            >
              GST Rate:
            </label>
            <input
              type="text"
              id="Excise_Rate"
              name="Excise_Rate"
              className="SugarTenderPurchase-form-control"
              value={calculatedValues.exciseAmount}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={29}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label htmlFor="GSTAmt" className="SugarTenderPurchase-form-label">
              GST Amount
            </label>
            <input
              type="text"
              id="GSTAmt"
              name="GSTAmt"
              className="SugarTenderPurchase-form-control"
              value={calculatedValues.gstAmt || ""}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={30}
            />
          </div>

          <div className="SugarTenderPurchase-col">
            <label>{calculatedValues.lblValue}</label>
          </div>

          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Sell_Note_No"
              className="SugarTenderPurchase-form-label"
            >
              Sell Note No:
            </label>
            <input
              type="text"
              id="Sell_Note_No"
              name="Sell_Note_No"
              className="SugarTenderPurchase-form-control"
              value={formData.Sell_Note_No}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={31}
            />
          </div>
        </div>
        <div className="SugarTenderPurchase-row">
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="Narration"
              className="SugarTenderPurchase-form-label"
            >
              Narration:
            </label>
            <textarea
              type="text"
              id="Narration"
              name="Narration"
              className="SugarTenderPurchase-form-control"
              value={formData.Narration}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={32}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="TCS_Rate"
              className="SugarTenderPurchase-form-label"
            >
              TCS%:
            </label>
            <input
              type="text"
              id="TCS_Rate"
              name="TCS_Rate"
              className="SugarTenderPurchase-form-control"
              value={formData.TCS_Rate}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={33}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label htmlFor="TCS_Amt" className="SugarTenderPurchase-form-label">
              TCS Amount:
            </label>
            <input
              type="text"
              id="TCS_Amt"
              name="TCS_Amt"
              className="SugarTenderPurchase-form-control"
              value={
                calculatedValues.tcsAmt || calculatedValues.calculatedTcsAmt
              }
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={34}
            />
          </div>

          <div className="SugarTenderPurchase-col">
            <label
              htmlFor="TDS_Rate"
              className="SugarTenderPurchase-form-label"
            >
              TDS Rate:
            </label>
            <input
              type="text"
              id="TDS_Rate"
              name="TDS_Rate"
              className="SugarTenderPurchase-form-control"
              value={formData.TDS_Rate}
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={35}
            />
          </div>
          <div className="SugarTenderPurchase-col">
            <label htmlFor="TDS_Amt" className="SugarTenderPurchase-form-label">
              TDS Amount:
            </label>
            <input
              type="text"
              id="TDS_Amt"
              name="TDS_Amt"
              className="SugarTenderPurchase-form-control"
              value={
                calculatedValues.tdsAmt || calculatedValues.calculatedTdsAmt
              }
              onChange={(e) => {
                validateNumericInput(e);
                handleChange(e);
              }}
              disabled={!isEditing && addOneButtonEnabled}
              tabIndex={36}
            />
          </div>
        </div>

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-container">
              <HashLoader color="#007bff" loading={isLoading} size={80} />
            </div>
          </div>
        )}

        {/*detail part popup functionality and Validation part Grid view */}
        <div className="">
          {showPopup && (
            <div className="custom-modal" role="dialog">
              <div className="custom-modal-large-dialog" role="document">
                <div className="custom-modal-content">
                  <div className="custom-modal-header">
                    <h5 className="custom-modal-title">
                      {selectedUser.id
                        ? "Edit Tender Detail"
                        : "Add Tender Detail"}
                    </h5>
                    <button
                      type="button"
                      onClick={closePopup}
                      aria-label="Close"
                      className="close-btn"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="custom-modal-body">
                    <form>
                      <div className="form-row">
                        <label>Bill To</label>
                        <div className="form-element">
                          <AccountMasterHelp
                            key={billTo}
                            onAcCodeClick={handleBillTo}
                            CategoryName={selfAcCode ? selfAcName : billtoName}
                            CategoryCode={billTo || selfAcCode}
                            name="Buyer"
                            Ac_type=""
                            className="account-master-help"
                            disabledFeild={!isEditing && addOneButtonEnabled}
                          />
                        </div>
                        <label>Ship To</label>
                        <div className="form-element">
                          <AccountMasterHelp
                            key={shipTo}
                            onAcCodeClick={handleShipTo}
                            CategoryName={selfAcCode ? selfAcName : shiptoName}
                            CategoryCode={shipTo || selfAcCode}
                            name="ShipTo"
                            Ac_type=""
                            className="account-master-help"
                            disabledFeild={!isEditing && addOneButtonEnabled}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <label htmlFor="Delivery_Type">Delivery Type:</label>
                        <select
                          id="Delivery_Type"
                          name="Delivery_Type"
                          value={formDataDetail.Delivery_Type || dispatchType}
                          onChange={handleChangeDetail}
                          disabled={!isEditing && addOneButtonEnabled}
                        >
                          <option value="N">With GST Naka Delivery</option>
                          <option value="A">
                            Naka Delivery without GST Rate
                          </option>
                          <option value="C">Commission</option>
                          <option value="D">DO</option>
                        </select>
                        <label>Broker</label>
                        <div className="form-element">
                          <AccountMasterHelp
                            key={buyerParty}
                            onAcCodeClick={handleBuyerParty}
                            CategoryName={
                              self_ac_Code ? self_acName : buyerPartyName
                            }
                            CategoryCode={
                              buyerParty || selfAcCode || self_ac_Code || 2
                            }
                            name="Buyer_Party"
                            Ac_type=""
                            className="account-master-help"
                            disabledFeild={!isEditing && addOneButtonEnabled}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <label>Brokrage</label>
                        <input
                          type="text"
                          className="form-control"
                          name="DetailBrokrage"
                          autoComplete="off"
                          value={formDataDetail.DetailBrokrage}
                          onChange={handleChangeDetail}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label>Sub Broker:</label>
                        <AccountMasterHelp
                          onAcCodeClick={handleDetailSubBroker}
                          CategoryName={
                            self_ac_Code ? self_acName : brokerDetail
                          }
                          CategoryCode={
                            formDataDetail.sub_broker ||
                            subBroker ||
                            selfAcCode ||
                            self_ac_Code ||
                            2
                          }
                          name="sub_broker"
                          Ac_type=""
                          className="account-master-help"
                          disabledFeild={!isEditing && addOneButtonEnabled}
                        />
                        <label>Buyer Quantal:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Buyer_Quantal"
                          autoComplete="off"
                          value={formDataDetail.Buyer_Quantal}
                          onChange={(e) => {
                            handleChangeDetail(e);
                          }}
                          // onKeyDown={(e) => {handleKeyDownCalBuyerQuantal(e)}}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                      </div>

                      <div className="form-row">
                        <label>Sale Rate</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Sale_Rate"
                          autoComplete="off"
                          value={formDataDetail.Sale_Rate}
                          onChange={(e) => {
                            validateNumericInput(e);
                            handleChangeDetail(e);
                          }}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label>B.P.</label>
                        <input
                          type="text"
                          className="form-control"
                          name="BP_Detail"
                          autoComplete="off"
                          value={formDataDetail.BP_Detail}
                          onChange={handleChangeDetail}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label>Commission</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Commission_Rate"
                          autoComplete="off"
                          value={formDataDetail.Commission_Rate}
                          onChange={(e) => {
                            validateNumericInput(e);
                            handleChangeDetail(e);
                          }}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                      </div>

                      <div className="form-row">
                        <label>Sauda Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="datePicker"
                          name="Sauda_Date"
                          value={formDataDetail.Sauda_Date}
                          onChange={(e) =>
                            handleDetailDateChange(e, "Sauda_Date")
                          }
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label>Payment Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="datePicker"
                          name="Lifting_Date"
                          value={formDataDetail.Lifting_Date}
                          onChange={(e) =>
                            handleDetailDateChange(e, "Lifting_Date")
                          }
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                      </div>

                      <div className="form-row">
                        <label>Narration:</label>
                        <textarea
                          className="form-control"
                          name="Narration"
                          autoComplete="off"
                          value={formDataDetail.Narration}
                          onChange={handleChangeDetail}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label>Loading By Us</label>
                        <input
                          type="checkbox"
                          id="loding_by_us"
                          Name="loding_by_us"
                          checked={formDataDetail.loding_by_us === "Y"}
                          onChange={(e) => handleCheckbox(e, "string")}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                      </div>

                      <div className="form-row">
                        <label>GST Amount</label>
                        <input
                          type="text"
                          className="form-control"
                          name="gst_rate"
                          autoComplete="off"
                          value={formDataDetail.gst_rate || gstCode || gstRateCode}
                          onChange={(e) => {
                            validateNumericInput(e); 
                            handleChangeDetail(e);
                          }}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                        <input
                          type="text"
                          className="form-control"
                          name="gst_amt"
                          autoComplete="off"
                          value={
                            calculatedValues.gstAmtDetail ||
                            (formDataDetail.Buyer_Quantal *
                              formDataDetail.Sale_Rate *
                              gstCode) /
                              100
                          }
                          onChange={(e) => {
                            validateNumericInput(e);
                            handleChangeDetail(e);
                          }}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                      </div>

                      <div className="form-row">
                        <label>TCS Amount</label>
                        <input
                          type="text"
                          className="form-control"
                          name="tcs_rate"
                          autoComplete="off"
                          value={
                            formDataDetail.tcs_rate || formData.TCS_Rate || ""
                          }
                          onChange={(e) => {
                           
                            handleChangeDetail(e);
                          }}
                          onKeyDown={TCSCalculationDetail}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                        <input
                          type="text"
                          className="form-control"
                          name="tcs_amt"
                          autoComplete="off"
                          value={formDataDetail.tcs_amt}
                          onChange={(e) => {
                            // validateNumericInput(e);
                            handleChangeDetail(e);
                          }}
                          // onKeyDown={TCSCalculationDetail}
                          disabled={!isEditing && addOneButtonEnabled}
                        />
                      </div>

                      <label>{calculatedValues.lblNetAmount}</label>
                    </form>
                  </div>
                  <div className="custom-modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closePopup}
                      style={{ marginLeft: "950px" }}
                    >
                      Cancel
                    </button>
                    {selectedUser.id ? (
                      <button
                        className="btn btn-primary"
                        onClick={updateUser}
                        tabIndex="55"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            updateUser();
                          }
                        }}
                      >
                        Update
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
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              marginTop: "25px",
              marginRight: "10px",
            }}
          >
            <button
              className="btn btn-primary btn-lg"
              style={{
                padding: "5px 20px",
                fontSize: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => openPopup("add")}
              tabIndex="37"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  openPopup("add");
                }
              }}
            >
              Add
            </button>

            <button
              className="btn btn-danger btn-lg"
              style={{
                marginLeft: "15px",
                padding: "5px 20px",
                fontSize: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              disabled={!isEditing}
              tabIndex="38"
            >
              Close
            </button>
          </div>
          <br></br>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellStyle}>Actions</TableCell>
                  <TableCell sx={headerCellStyle}>ID</TableCell>
                  <TableCell sx={headerCellStyle}>Party</TableCell>
                  <TableCell sx={headerCellStyle}>Party Name</TableCell>
                  <TableCell sx={headerCellStyle}>Broker</TableCell>
                  <TableCell sx={headerCellStyle}>Broker Name</TableCell>
                  <TableCell sx={headerCellStyle}>ShipTo</TableCell>
                  <TableCell sx={headerCellStyle}>ShipTo Name</TableCell>
                  <TableCell sx={headerCellStyle}>Quintal</TableCell>
                  <TableCell sx={headerCellStyle}>Sale Rate</TableCell>
                  <TableCell sx={headerCellStyle}>Cash Difference</TableCell>
                  <TableCell sx={headerCellStyle}>Commission</TableCell>
                  <TableCell sx={headerCellStyle}>Sauda Date</TableCell>
                  <TableCell sx={headerCellStyle}>Lifting Date</TableCell>
                  <TableCell sx={headerCellStyle}>Sauda Narration</TableCell>
                  <TableCell sx={headerCellStyle}>Delivery Type</TableCell>
                  <TableCell sx={headerCellStyle}>GSTRate</TableCell>
                  <TableCell sx={headerCellStyle}>GSTAmt</TableCell>
                  <TableCell sx={headerCellStyle}>TCSRate</TableCell>
                  <TableCell sx={headerCellStyle}>TCSAmount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Stack spacing={1}>
                        {(user.rowaction === "add" ||
                          user.rowaction === "update" ||
                          user.rowaction === "Normal") && (
                          <>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => editUser(user)}
                              disabled={!isEditing || index === 0}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => deleteModeHandler(user)}
                              disabled={!isEditing || index === 0}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                        {(user.rowaction === "DNU" ||
                          user.rowaction === "delete") && (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => openDelete(user)}
                          >
                            Open
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.Buyer}</TableCell>
                    <TableCell>{user.billtoName}</TableCell>
                    <TableCell>{user.Buyer_Party}</TableCell>
                    <TableCell>{user.buyerPartyName}</TableCell>
                    <TableCell>{user.ShipTo}</TableCell>
                    <TableCell>{user.shiptoName}</TableCell>
                    <TableCell>{user.Buyer_Quantal}</TableCell>
                    <TableCell>{user.Sale_Rate}</TableCell>
                    <TableCell>{user.CashDiff}</TableCell>
                    <TableCell>{user.Commission_Rate}</TableCell>
                    <TableCell>{user.Sauda_Date}</TableCell>
                    <TableCell>{user.Lifting_Date}</TableCell>
                    <TableCell>{user.Narration}</TableCell>
                    <TableCell>{user.Delivery_Type || dispatchType}</TableCell>
                    <TableCell>{user.gst_rate || gstCode}</TableCell>
                    <TableCell>{user.gst_amt}</TableCell>
                    <TableCell>{user.tcs_rate || formData.TCS_Rate}</TableCell>
                    <TableCell>{user.tcs_amt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </form>
    </>
  );
};
export default TenderPurchase;
