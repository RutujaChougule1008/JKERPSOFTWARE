import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ActionButtonGroup from "../../../../Common/CommonButtons/ActionButtonGroup";
import NavigationButtons from "../../../../Common/CommonButtons/NavigationButtons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GroupMasterHelp from "../../../../Helper/GroupMasterHelp";
import GSTStateMasterHelp from "../../../../Helper/GSTStateMasterHelp";
import CityMasterHelp from "../../../../Helper/CityMasterHelp";
import { HashLoader } from "react-spinners";
import CityMaster from "../CityMaster/CityMaster";
import FinicialMaster from "../FinicialMasters/FinicialMaster";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
  Typography,
  InputLabel,
  FormControl,
  IconButton,
  TextareaAutosize,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const companyCode = sessionStorage.getItem("Company_Code");
const Year_Code = sessionStorage.getItem("Year_Code");
const API_URL = process.env.REACT_APP_API;
const GST_API = process.env.GST_PORTAL_API_URL;
const GST_KEY = process.env.GST_PORTAL_API_KEY;
const GST_SECRET_KEY = process.env.GST_PORTAL_API_SECRET_KEY;

var cityName;
var newCity_Code;
var grpName;
var newGroup_Code;
var gstStateName;
var newGSTStateCode;
var newAccoid;
const AccountMaster = () => {
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
  const companyCode = sessionStorage.getItem("Company_Code");
  const [accountCode, setAccountCode] = useState("");
  const [accountData, setAccountData] = useState({});
  const [accountDetail, setAccountDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [showCityPopup, setShowCityPopup] = useState(false);
  const cityMasterRef = useRef(null);
  const [cityMasterData, setCityMasterData] = useState("");
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const groupMasterRef = useRef(null);
  const [groupMasterData, setGroupMasterData] = useState("");
  const [city_data, setCityData] = useState("");

  const navigate = useNavigate();
  //In utility page record doubleClicked that recod show for edit functionality
  const location = useLocation();
  const selectedRecord = location.state?.selectedRecord;
  const permissions = location.state?.permissionsData;
  const initialFormData = {
    Ac_Code: "",
    Ac_Name_E: "",
    Ac_Name_R: "",
    Ac_type: "P",
    Ac_rate: 0.0,
    Address_E: "",
    Address_R: "",
    City_Code: "",
    Pincode: "",
    Local_Lic_No: "",
    Tin_No: "",
    Cst_no: "",
    Gst_No: "",
    Email_Id: "",
    Email_Id_cc: "",
    Other_Narration: "",
    ECC_No: "",
    Bank_Name: "",
    Bank_Ac_No: "",
    Bank_Opening: 0.0,
    bank_Op_Drcr: "D",
    Opening_Balance: 0.0,
    Drcr: "D",
    Group_Code: "",
    Created_By: "",
    Modified_By: "",
    Short_Name: "",
    Commission: 0.0,
    carporate_party: "N",
    referBy: "",
    OffPhone: "",
    Fax: "",
    CompanyPan: "",
    AC_Pan: "",
    Mobile_No: "",
    Is_Login: "",
    IFSC: "",
    FSSAI: "",
    Branch1OB: 0.0,
    Branch2OB: 0.0,
    Branch1Drcr: "D",
    Branch2Drcr: "D",
    Locked: 0,
    GSTStateCode: "",
    UnregisterGST: 0,
    Distance: 0.0,
    Bal_Limit: 0.0,
    bsid: "",
    cityid: "",
    whatsup_no: "",
    company_code: companyCode,
    adhar_no: "",
    Limit_By: "N",
    Tan_no: "",
    TDSApplicable: "Y",
    PanLink: "",
    Insurance: 0.0,
    MsOms: "",
    loadingbyus: "N",
    payBankAc: "",
    payIfsc: "",
    PayBankName: "",
    FrieghtOrMill: "",
    BeneficiaryName: "",
    payBankAc2: "",
    payIfsc2: "",
    PayBankName2: "",
    BeneficiaryName2: "",
    payBankAc3: "",
    payIfsc3: "",
    PayBankName3: "",
    BeneficiaryName3: "",
    SelectedBank: "",
    VerifyAcNo: "",
    VerifyAcNo2: "",
    VerifyAcNo3: "",
    TransporterId: "",
    PurchaseTDSApplicable: "Y",
  };

  const acTypeRef = useRef(null);

  useEffect(() => {
    if (acTypeRef.current) {
      acTypeRef.current.focus();
    }
  }, []);

  const handleCity_Code = (code, cityId, cityName, pinCode) => {
    setAccountCode(code);
    setFormData({
      ...formData,
      City_Code: code,
      cityid: cityId,
      Pincode: pinCode,
    });
  };
  const handleGroup_Code = (code, bsId) => {
    setAccountCode(code);
    setFormData({
      ...formData,
      Group_Code: code,
      bsid: bsId,
    });
  };
  const handleGSTStateCode = (code) => {
    setAccountCode(code);
    setFormData({
      ...formData,
      GSTStateCode: code,
    });
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formDataDetail, setFormDataDetail] = useState({
    Person_Name: "",
    Person_Mobile: "",
    Person_Email: "",
    Person_Pan: "",
    Other: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      return updatedFormData;
    });
  };

  const handleDetailChange = (event) => {
    const { name, value } = event.target;
    setFormDataDetail((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      return updatedFormData;
    });
  };

  const handleCheckbox = (e, valueType = "string") => {
    const { name, checked } = e.target;
    const value =
      valueType === "numeric" ? (checked ? 1 : 0) : checked ? "Y" : "N";

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const showError = (message) => {
      toast.error(message);
      return false;
    };

    // Basic validations
    if (!formData.Ac_Name_E.trim())
      return showError("Account Name is required.");
    if (!formData.City_Code) return showError("City Code is required.");
    if (!formData.Group_Code) return showError("Group Code is required.");
    if (!formData.Address_E.trim()) return showError("Address is required.");

    // Validation for Brokers
    if (formData.Ac_type === "BR" && !formData.Short_Name.trim()) {
      return showError("Short Name is required for Brokers.");
    }

    // Validation for Party and Supplier
    if (["P", "S"].includes(formData.Ac_type)) {
      if (formData.Bank_Opening > 0) {
        return showError("Bank Opening must be zero for Party or Supplier.");
      }
      if (formData.UnregisterGST !== 1) {
        if (!formData.Gst_No) return showError("GST Number is required.");
        if (!formData.CompanyPan) return showError("Company Pan is required.");
      }
    }

    // Validation for Banks
    if (
      formData.Ac_type === "B" &&
      (!formData.Bank_Ac_No.trim() || !formData.IFSC.trim())
    ) {
      return showError(
        "Bank Account Number and IFSC Code are required for Banks."
      );
    }

    // Validation for Fixed Assets, Interest Party, and Transport
    if (["F", "I", "T"].includes(formData.Ac_type)) {
      if (!formData.Short_Name.trim()) {
        return showError(
          "Short Name is required for Fixed Assets, Interest Party, and Transport."
        );
      }
      if (formData.Ac_rate <= 0) {
        return showError(
          "Interest Rate must be greater than zero for Fixed Assets, Interest Party, and Transport."
        );
      }
      if (!formData.Ac_Name_R.trim()) {
        return showError(
          "Regional Name is required for Fixed Assets, Interest Party, and Transport."
        );
      }
    }

    return true;
  };

  const isFieldEnabled = (fieldType) => {
    const yearCode = sessionStorage.getItem("Year_Code");
    switch (fieldType) {
      case "Ac_rate":
        // Enable Interest Rate only for Interest Party and Fixed Assets
        return ["I", "F"].includes(formData.Ac_type);
      case "Ac_Name_E":
      case "Ac_Name_R":
      case "Short_Name":
      case "Group_Code":
        // Enable for all types, but with specific additional logic for 'C'
        return formData.Ac_type !== "B";
      case "Bank_Opening":
      case "bank_Op_Drcr":
        // Enable for Banks
        return formData.Ac_type === "B";
      case "Opening_Balance":
      case "Drcr":
        // Enable only for Party (P) when Year_Code is 1
        return formData.Ac_type === "P" && yearCode === "1";
      case "Limit_By":
      case "Local_Lic_No":
      case "Tan_no":
      case "FSSAI":
      case "carporate_party":
        // Disable these fields for Banks
        return formData.Ac_type !== "B" && formData.Ac_type !== "C";
      case "Limit_By":
      case "Local_Lic_No":
      case "Tan_no":
      case "FSSAI":
      case "carporate_party":
      case "Tin_No":
      case "Cst_no":
      case "Gst_No":
      case "Email_Id":
      case "Email_Id_cc":
      case "Other_Narration":
      case "ECC_No":
      case "Bank_Name":
      case "Bank_Ac_No":
      case "IFSC":
      case "Mobile_No":
      case "OffPhone":
      case "Fax":
      case "CompanyPan":
      case "AC_Pan":
      case "whatsup_no":
      case "adhar_no":
      case "PanLink":
      case "Insurance":
      case "MsOms":
      case "loadingbyus":
      case "payBankAc":
      case "payIfsc":
      case "PayBankName":
      case "FrieghtOrMill":
      case "Locked":
      case "GSTStateCode":
      case "UnregisterGST":
      case "Distance":
      case "Bal_Limit":
      case "Insurance":
      case "referBy":
      case "Pincode":
      case "TransporterId":
        // Disable these fields for Cash
        return formData.Ac_type !== "C";
      default:
        return true;
    }
  };

  const handleCheckboxAcGroups = (e, group) => {
    const { checked } = e.target;

    setSelectedGroups((prevSelected) => {
      if (checked) {
        console.log("Adding group to selectedGroups:", group.Category_Code);
        // Add the group to selectedGroups if it's checked
        return [...prevSelected, group.Category_Code];
      } else {
        console.log("Removing group from selectedGroups:", group.Category_Code);
        // Remove the group from selectedGroups if it's unchecked
        return prevSelected.filter(
          (groupCode) => groupCode !== group.Category_Code
        );
      }
    });
    console.log("Selected Groups:", selectedGroups);
  };

  const handleSearchClick = async () => {
    debugger;
    const apiUrl =
      "https://www.ewaybills.com/MVEWBAuthenticate/MVAppSCommonSearchTP";
    const cityApiUrl = `${API_URL}/get-citybyName`;
    const createCityUrl = `${API_URL}/create-city`;
    const apiKey = "bk59oPDpaGTtJa4";
    const apiSecret = "EajrxDcIWLhGfRHLej7zjw==";
    const gstNo = formData.Gst_No;

    const requestBody = {
      AppSCommonSearchTPItem: [
        {
          GSTIN: gstNo,
        },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          MVApiKey: apiKey,
          MVSecretKey: apiSecret,
          GSTIN: "27AAECJ8332R1ZV",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (
        data.Status === "1" &&
        data.lstAppSCommonSearchTPResponse.length > 0
      ) {
        const taxpayerDetails = data.lstAppSCommonSearchTPResponse[0];
        const address = taxpayerDetails.pradr.addr;
        const concatenatedAddress = `${address.bno} ${address.bnm} ${address.st} ${address.flno} ${address.loc} ${address.pncd} ${address.stcd}`;
        const ac_name = taxpayerDetails.tradeNam;
        newGSTStateCode = taxpayerDetails.RequestedGSTIN.substring(0, 2).trim();
        const pincode = address.pncd;
        const city_name = address.loc;

        try {
          const cityResponse = await fetch(
            `${cityApiUrl}?city_name_e=${city_name}`
          );

          if (!cityResponse.ok && cityResponse.status === 404) {
            // City not found, trigger creation of the city
            const newCityData = {
              city_name_e: city_name,
              pincode: pincode,
            };

            const createResponse = await fetch(
              `${createCityUrl}?company_code=${companyCode}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newCityData),
              }
            );

            if (!createResponse.ok) {
              throw new Error(
                `Failed to create city. Status: ${createResponse.status}`
              );
            }

            const createdCity = await createResponse.json();

            setCityData(createdCity);
            toast.success("City created and details updated.");
            setFormData((prevState) => ({
              ...prevState,
              Address_E: concatenatedAddress,
              Ac_Name_E: ac_name,
              GSTStateCode: newGSTStateCode,
              Pincode: pincode,
              City_Code: createdCity.city_code,
            }));
          } else {
            const cityData = await cityResponse.json();

            setCityData(cityData);

            setFormData((prevState) => ({
              ...prevState,
              Address_E: concatenatedAddress,
              Ac_Name_E: ac_name,
              GSTStateCode: newGSTStateCode,
              Pincode: pincode,
              City_Code: cityData.city_code,
            }));
          }
        } catch (cityError) {
          console.error("Error fetching city data:", cityError);
          toast.error("Error fetching city data.");
          setFormData((prevState) => ({
            ...prevState,
            Address_E: concatenatedAddress,
            Ac_Name_E: ac_name,
            GSTStateCode: newGSTStateCode,
            Pincode: pincode,
            City_Code: "",
          }));
        }
      } else {
        toast.error("No taxpayer details found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Error fetching data: ${error.message}`);
    }
  };

  const handleAddCity = (event) => {
    debugger;
    event.preventDefault();
    console.log("Clicked");
    setShowCityPopup(true);
  };

  // Function to handle closing the CityMaster popup
  const handleClosePopup = () => {
    setShowCityPopup(false);
  };

  const handleAddGroup = (event) => {
    event.preventDefault();
    setShowGroupPopup(true);
  };

  const handleCloseGroupPopup = () => {
    setShowGroupPopup(false);
  };

  const handleCitySave = async (event) => {
    event.preventDefault();
    if (cityMasterRef.current) {
      const cityData = cityMasterRef.current.getFormData();
      console.log("City Data to Save:", cityData);

      try {
        const response = await axios.post(
          `${API_URL}/create-city?company_code=${companyCode}`,
          cityData
        );
        toast.success("City created successfully!");
        console.log("City saved!", response.data);
        setCityMasterData(response.data);

        handleCity_Code(
          response.data.city.city_code,
          response.data.city.cityid,
          response.data.city.city_name_e,
          response.data.city.pincode
        );
        setShowCityPopup(false);
      } catch (error) {
        toast.error(
          "Error occurred while creating city: " +
            (error.response?.data?.error || error.message)
        );
        console.error("Error creating city:", error);
      }
    } else {
      console.error("CityMaster is not loaded yet");
    }
  };

  const handleGroupSave = async (event) => {
    event.preventDefault();
    if (groupMasterRef.current) {
      const groupData = groupMasterRef.current.getFormData();
      console.log("Group Data to Save:", groupData);

      try {
        const response = await axios.post(
          `${API_URL}/create-finicial-group?Company_Code=${companyCode}`,
          groupData
        );
        toast.success("Group created successfully!");
        console.log("Group saved!", response.data);
        setGroupMasterData(response.data);
        handleGroup_Code(
          response.data.group.group_Code,
          response.data.group.bsid
        );
        setShowGroupPopup(false); // Close the popup after saving
      } catch (error) {
        toast.error(
          "Error occurred while creating group: " +
            (error.response?.data?.error || error.message)
        );
        console.error("Error creating group:", error);
      }
    } else {
      console.error("GroupMaster is not loaded yet");
    }
  };

  //Detail Part Functionality

  const openPopup = (mode) => {
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
      Person_Name: "",
      Person_Mobile: "",
      Person_Email: "",
      Person_Pan: "",
      Other: "",
    });
  };

  useEffect(() => {
    if (selectedRecord) {
      setUsers(
        accountDetail.map((detail) => ({
          Id: detail.id,
          id: detail.id,
          Ac_Code: detail.Ac_Code,
          rowaction: "Normal",
          Person_Email: detail.Person_Email,
          Person_Mobile: detail.Person_Mobile,
          Person_Name: detail.Person_Name,
          Person_Pan: detail.Person_Pan,
          Other: detail.Other,
        }))
      );
    }
  }, [selectedRecord, accountDetail]);

  useEffect(() => {
    const updatedUsers = accountDetail.map((detail) => ({
      Id: detail.id,
      id: detail.id,
      Ac_Code: detail.Ac_Code,
      rowaction: "Normal",
      Person_Email: detail.Person_Email,
      Person_Mobile: detail.Person_Mobile,
      Person_Name: detail.Person_Name,
      Person_Pan: detail.Person_Pan,
      Other: detail.Other,
    }));
    setUsers(updatedUsers);
  }, [accountDetail]);

  const addUser = async () => {
    const newUser = {
      Id: users.length > 0 ? Math.max(...users.map((user) => user.Id)) + 1 : 1,
      ...formDataDetail,
      rowaction: "add",
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    closePopup();
  };

  const updateUser = async () => {
    const updatedUsers = users.map((user) => {
      if (user.Id === selectedUser.Id) {
        const updatedRowaction =
          user.rowaction === "Normal" ? "update" : user.rowaction;
        return {
          ...user,
          Person_Email: formDataDetail.Person_Email,
          Person_Mobile: formDataDetail.Person_Mobile,
          Person_Name: formDataDetail.Person_Name,
          Person_Pan: formDataDetail.Person_Pan,
          Other: formDataDetail.Other,
          rowaction: updatedRowaction,
        };
      } else {
        return user;
      }
    });

    setUsers(updatedUsers);
    closePopup();
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setFormDataDetail({
      Person_Email: user.Person_Email || "",
      Person_Mobile: user.Person_Mobile || "",
      Person_Name: user.Person_Name || "",
      Person_Pan: user.Person_Pan || "",
      Other: user.Other || "",
    });
    openPopup("edit");
  };

  const deleteModeHandler = async (user) => {
    let updatedUsers;
    if (isEditMode && user.rowaction === "add") {
      setDeleteMode(true);
      setSelectedUser(user);
      updatedUsers = users.map((u) =>
        u.Id === user.Id ? { ...u, rowaction: "DNU" } : u
      );
    } else if (isEditMode) {
      setDeleteMode(true);
      setSelectedUser(user);
      updatedUsers = users.map((u) =>
        u.Id === user.Id ? { ...u, rowaction: "delete" } : u
      );
    } else {
      setDeleteMode(true);
      setSelectedUser(user);
      updatedUsers = users.map((u) =>
        u.Id === user.Id ? { ...u, rowaction: "DNU" } : u
      );
    }
    setUsers(updatedUsers);
    setSelectedUser({});
  };

  const openDelete = async (user) => {
    setDeleteMode(true);
    setSelectedUser(user);
    let updatedUsers;
    if (isEditMode && user.rowaction === "delete") {
      updatedUsers = users.map((u) =>
        u.Id === user.Id ? { ...u, rowaction: "Normal" } : u
      );
    } else {
      updatedUsers = users.map((u) =>
        u.Id === user.Id ? { ...u, rowaction: "add" } : u
      );
    }
    setUsers(updatedUsers);
    setSelectedUser({});
  };

  const fetchLastRecord = () => {
    fetch(`${API_URL}/getNextAcCode_AccountMaster?Company_Code=${companyCode}`)
      .then((response) => {
        console.log("response", response);
        if (!response.ok) {
          throw new Error("Failed to fetch last record");
        }
        return response.json();
      })
      .then((data) => {
        // Set the last company code as the default value for Company_Code
        setFormData((prevState) => ({
          ...prevState,
          Ac_Code: data.next_ac_code,
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
    setAccountDetail([]);
    setSelectedGroups([]);
    setCityMasterData("");
    newCity_Code = "";
    newGSTStateCode = "";
    newGroup_Code = "";
    cityName = "";
    gstStateName = "";
    grpName = "";
  };

  const handleSaveOrUpdate = async () => {
    debugger;
    if (!validateForm()) {
      return;
    }

    setIsEditing(true);
    setIsLoading(true);

    const master_data = { ...formData };

    if (isEditMode) {
      delete master_data.accoid;
    }

    const contact_data = users.map((user) => ({
      rowaction: user.rowaction,
      Person_Name: user.Person_Name,
      Person_Mobile: user.Person_Mobile,
      Company_Code: companyCode,
      Person_Email: user.Person_Email,
      Person_Pan: user.Person_Pan,
      Other: user.Other,
      id: user.id,
    }));

    const acGroupsData = selectedGroups
      .map((groupCode) => ({
        Group_Code: groupCode,
        Company_Code: companyCode,
        Ac_Code: master_data.Ac_Code,
        accoid: master_data.accoid || newAccoid,
      }))
      .filter((group) => group.Group_Code);

    const requestData = {
      master_data,
      contact_data,
    };

    try {
      let response;

      if (isEditMode) {
        const updateApiUrl = `${API_URL}/update-accountmaster?accoid=${newAccoid}`;
        response = await axios.put(updateApiUrl, requestData);
        toast.success("Data updated successfully!");
      } else {
        response = await axios.post(
          `${API_URL}/insert-accountmaster`,
          requestData
        );
        toast.success("Data saved successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        const groupUpdateData = {
          acGroups: acGroupsData,
          Ac_Code: formData.Ac_Code,
          Company_Code: companyCode,
          accoid: newAccoid,
        };
        await axios.post(
          `${API_URL}/create-multiple-acgroups`,
          groupUpdateData
        );
        toast.success("Groups updated successfully!");
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      setIsEditMode(false);
      setAddOneButtonEnabled(true);
      setEditButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setBackButtonEnabled(true);
      setSaveButtonEnabled(false);
      setCancelButtonEnabled(false);
      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error(`Error occurred while saving data: ${error.message}`);
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
  const handleCancel = () => {
    axios
      .get(`${API_URL}/get-lastaccountdata?Company_Code=${companyCode}`)
      .then((response) => {
        const data = response.data.account_master_data;
        const labels = response.data.account_labels;
        const detailData = response.data.account_detail_data;
        const groupCodes = response.data.group_codes;
        newAccoid = data.accoid;
        newCity_Code = data.City_Code;
        cityName = labels.cityname;
        grpName = labels.groupcodename;
        newGroup_Code = data.Group_Code;
        gstStateName = labels.State_Name;
        newGSTStateCode = data.GSTStateCode;
        console.log(data);
        setFormData({
          ...formData,
          ...data,
        });
        setAccountData(data || {});
        setAccountDetail(detailData || []);

        setSelectedGroups(groupCodes || []);
      })
      .catch((error) => {
        console.error("Error fetching latest data for edit:", error);
      });
    // Reset other state variables
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

  const fetchGroupData = () => {
    axios
      .get(
        `${API_URL}/system_master_help?CompanyCode=${companyCode}&SystemType=G`
      )
      .then((response) => {
        const data = response.data;
        setGroupData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching latest data for edit:", error);
      });
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this record ${formData.Ac_Code}?`
    );

    if (isConfirmed) {
      setIsEditMode(false);
      setAddOneButtonEnabled(true);
      setEditButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setBackButtonEnabled(true);
      setSaveButtonEnabled(false);
      setCancelButtonEnabled(false);

      try {
        const deleteApiUrl = `${API_URL}/delete_accountmaster?accoid=${newAccoid}&company_code=${companyCode}&Ac_Code=${formData.Ac_Code}`;
        const response = await axios.delete(deleteApiUrl);
        toast.success("Record deleted successfully!");
        handleCancel();
      } catch (error) {
        toast.error("Deletion cancelled");
        console.error("Error during API call:", error);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, []);

  const handleBack = () => {
    navigate("/AccountMaster-utility");
  };

  //Handle Record DoubleCliked in Utility Page Show that record for Edit
  const handlerecordDoubleClicked = async () => {
    try {
      const response = await fetch(
        `${API_URL}/getaccountmasterByid?Company_Code=${companyCode}&Ac_Code=${selectedRecord.Ac_Code}`
      );
      const data = await response.json();
      // Access the first element of the array
      const acData = data.account_master_data;
      const labels = data.account_labels;
      const detailData = data.account_detail_data;
      const groupCodes = data.group_codes ?? [];
      console.log("acData", acData);
      console.log("labels", labels);
      console.log("detailData", detailData);
      newAccoid = acData.accoid;
      newCity_Code = acData.City_Code;
      cityName = labels.cityname;
      grpName = labels.groupcodename;
      newGroup_Code = acData.Group_Code;
      gstStateName = labels.State_Name;
      newGSTStateCode = acData.GSTStateCode;
      setFormData({
        ...formData,
        ...acData,
      });

      setAccountData(acData || {});
      setAccountDetail(detailData || []);
      setSelectedGroups(groupCodes || []);
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

  useEffect(() => {
    if (selectedRecord) {
      handlerecordDoubleClicked();
    } else {
      handleAddOne();
    }
  }, [selectedRecord]);

  //change No functionality to get that particular record
  const handleKeyDown = async (event) => {
    if (event.key === "Tab") {
      const changeNoValue = event.target.value;
      try {
        const response = await fetch(
          `${API_URL}/getaccountmasterByid?Company_Code=${companyCode}&Ac_Code=${changeNoValue}`
        );
        const data = await response.json();
        // Access the first element of the array
        const acData = data.account_master_data;
        const labels = data.account_labels;
        const detailData = data.account_detail_data;
        const groupCodes = data.group_codes ?? [];
        console.log("acData", acData);
        console.log("labels", labels);
        console.log("detailData", detailData);
        newAccoid = acData.accoid;
        newCity_Code = acData.City_Code;
        cityName = labels.cityname;
        grpName = labels.groupcodename;
        newGroup_Code = acData.Group_Code;
        gstStateName = labels.State_Name;
        newGSTStateCode = acData.GSTStateCode;
        setFormData({
          ...formData,
          ...acData,
        });

        setAccountData(acData || {});
        setAccountDetail(detailData || []);
        setSelectedGroups(groupCodes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  //Navigation Buttons
  const handleFirstButtonClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/get-firstaccount-navigation?Company_Code=${companyCode}`
      );
      if (response.ok) {
        const data = await response.json();
        // Access the first element of the array
        const acData = data.account_master_data;
        const labels = data.account_labels;
        const detailData = data.account_detail_data;
        const groupCodes = data.group_codes ?? [];
        console.log("acData", acData);
        console.log("labels", labels);
        console.log("detailData", detailData);
        newAccoid = acData.accoid;
        newCity_Code = acData.City_Code;
        cityName = labels.cityname;
        grpName = labels.groupcodename;
        newGroup_Code = acData.Group_Code;
        gstStateName = labels.State_Name;
        newGSTStateCode = acData.GSTStateCode;
        setFormData({
          ...formData,
          ...acData,
        });

        setAccountData(acData || {});
        setAccountDetail(detailData || []);
        setSelectedGroups(groupCodes || []);
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
      // Use formData.Company_Code as the current company code
      const response = await fetch(
        `${API_URL}/get-previousaccount-navigation?current_ac_code=${formData.Ac_Code}&Company_Code=${companyCode}`
      );

      if (response.ok) {
        const data = await response.json();

        const acData = data.account_master_data;
        const labels = data.account_labels;
        const detailData = data.account_detail_data;
        const groupCodes = data.group_codes ?? [];
        console.log("acData", acData);
        console.log("labels", labels);
        console.log("detailData", detailData);
        newAccoid = acData.accoid;
        newCity_Code = acData.City_Code;
        cityName = labels.cityname;
        grpName = labels.groupcodename;
        newGroup_Code = acData.Group_Code;
        gstStateName = labels.State_Name;
        newGSTStateCode = acData.GSTStateCode;
        setFormData({
          ...formData,
          ...acData,
        });

        setAccountData(acData || {});
        setAccountDetail(detailData || []);
        setSelectedGroups(groupCodes || []);

        console.log("Account Data:", acData);
        console.log("Group Codes:", groupCodes);
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
        `${API_URL}/get-nextaccount-navigation?current_ac_code=${formData.Ac_Code}&Company_Code=${companyCode}`
      );

      if (response.ok) {
        const data = await response.json();
        const acData = data.account_master_data;
        const labels = data.account_labels;
        const detailData = data.account_detail_data;
        const groupCodes = data.group_codes ?? [];
        console.log("acData", acData);
        console.log("labels", labels);
        console.log("detailData", detailData);
        newAccoid = acData.accoid;
        newCity_Code = acData.City_Code;
        cityName = labels.cityname;
        grpName = labels.groupcodename;
        newGroup_Code = acData.Group_Code;
        gstStateName = labels.State_Name;
        newGSTStateCode = acData.GSTStateCode;
        setFormData({
          ...formData,
          ...acData,
        });

        setAccountData(acData || {});
        setAccountDetail(detailData || []);
        setSelectedGroups(groupCodes || []);
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

  const handleEtender = () => {
    navigate("/eBuySugarian-user-utility");
  };

  return (
    <>
      <ToastContainer />
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

        {/* Navigation Buttons */}
        <NavigationButtons
          handleFirstButtonClick={handleFirstButtonClick}
          handlePreviousButtonClick={handlePreviousButtonClick}
          handleNextButtonClick={handleNextButtonClick}
          handleLastButtonClick={handleCancel}
          highlightedButton={highlightedButton}
          isEditing={isEditing}
          isFirstRecord={formData.company_code === 1}
        />
      </div>

      <Box
        sx={{
          maxWidth: "100%",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "#76D7C4",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Account Master
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            label="Change No"
            variant="outlined"
            size="small"
            disabled={!isEditing}
          />
          <TextField
            label="Account Code"
            name="Ac_Code"
            variant="outlined"
            size="small"
            value={formData.Ac_Code}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <FormControl size="small" fullWidth sx={{ width: "20vh" }}>
            <InputLabel>Type</InputLabel>
            <Select
              id="Ac_type"
              name="Ac_type"
              value={formData.Ac_type}
              onChange={handleChange}
              disabled={!isEditing && addOneButtonEnabled}
              ref={acTypeRef}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <MenuItem value="P">Party</MenuItem>
              <MenuItem value="S">Supplier</MenuItem>
              <MenuItem value="B">Bank</MenuItem>
              <MenuItem value="C">Cash</MenuItem>
              <MenuItem value="R">Relative</MenuItem>
              <MenuItem value="F">Fixed Assets</MenuItem>
              <MenuItem value="I">Interest Party</MenuItem>
              <MenuItem value="E">Income/Expenses</MenuItem>
              <MenuItem value="O">Trading</MenuItem>
              <MenuItem value="M">Mill</MenuItem>
              <MenuItem value="T">Transport</MenuItem>
              <MenuItem value="BR">Broker</MenuItem>
              <MenuItem value="RP">Retail Party</MenuItem>
              <MenuItem value="CR">Cash Retail Party</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ac_Name_E"
            variant="outlined"
            size="small"
            type="text"
            id="Ac_Name_E"
            name="Ac_Name_E"
            value={formData.Ac_Name_E}
            onChange={handleChange}
            disabled={!isEditing && addOneButtonEnabled}
          />
          <TextField
            label="Ac_Name_R"
            variant="outlined"
            size="small"
            id="Ac_Name_R"
            name="Ac_Name_R"
            value={formData.Ac_Name_R}
            onChange={handleChange}
            disabled={!isEditing && addOneButtonEnabled}
          />
          <TextField
            label={
              formData.Ac_type === "F" ? "Depreciation Rate" : "Interest Rate"
            }
            name="Ac_rate"
            variant="outlined"
            size="small"
            value={formData.Ac_rate}
            onChange={handleChange}
            disabled={!isFieldEnabled("Ac_rate")}
          />
          <TextField
            label="Address_E"
            variant="outlined"
            size="small"
            id="Address_E"
            name="Address_E"
            value={formData.Address_E}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Address_E") ||
              (!isEditing && addOneButtonEnabled)
            }
            minLength={10}
          />
          <TextField
            label="Address_R"
            variant="outlined"
            size="small"
            id="Address_R"
            name="Address_R"
            value={formData.Address_R}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Address_R") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
          <label htmlFor="City_Code">City Code:</label>
          <CityMasterHelp
            name="City_Code"
            onAcCodeClick={handleCity_Code}
            CityName={
              cityMasterData
                ? cityMasterData.city.city_name_e || ""
                : city_data
                ? city_data.city_name_e
                : cityName || ""
            }
            CityCode={
              cityMasterData
                ? cityMasterData.city.city_code
                : city_data
                ? city_data.city_code
                : newCity_Code || ""
            }
            tabIndex={8}
            disabledFeild={!isEditing && addOneButtonEnabled}
          />
          <Button
            variant="contained"
            size="small"
            onClick={(e) => handleAddCity(e)}
          >
            Add City
          </Button>
          {showCityPopup && (
            <div className="city-master-modal">
              <div className="city-master-modal-content">
                <button
                  className="city-master-close-btn"
                  onClick={handleClosePopup}
                >
                  &times;
                </button>
                <div className="city-master-popup-wrapper">
                  <CityMaster isPopup={true} ref={cityMasterRef} />{" "}
                  {/* Render CityMaster component */}
                  <div className="popup-action-buttons">
                    <button onClick={handleCitySave} className="save-btn">
                      Save
                    </button>
                    <button onClick={handleClosePopup} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overlay for the modal */}
          {showCityPopup && (
            <div
              className="city-master-modal-overlay"
              onClick={handleClosePopup}
              role="button"
            ></div>
          )}
          <TextField
            label="Pin Code"
            type="text"
            id="Pincode"
            name="Pincode"
            size="small"
            value={
              cityMasterData ? cityMasterData.city.pincode : formData.Pincode
            }
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Pincode") || (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Sugar Lic No"
            id="Local_Lic_No"
            name="Local_Lic_No"
            size="small"
            value={formData.Local_Lic_No}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Local_Lic_No") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Gst No"
            type="text"
            id="Gst_No"
            name="Gst_No"
            size="small"
            value={formData.Gst_No}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Gst_No") || (!isEditing && addOneButtonEnabled)
            }
          />

          <SearchIcon
            className="search-icon"
            onClick={handleSearchClick}
            style={{ cursor: "pointer" }}
          />
          <TextField
            label="Email"
            id="Email_Id"
            name="Email_Id"
            size="small"
            value={formData.Email_Id}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Email_Id") || (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="CC Email"
            id="Email_Id_cc"
            name="Email_Id_cc"
            size="small"
            value={formData.Email_Id_cc}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Email_Id_cc") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
          <Typography variant="outlined">Other Narration</Typography>
          <TextareaAutosize
            label="Other Narration"
            id="Other_Narration"
            name="Other_Narration"
            value={formData.Other_Narration}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Other_Narration") ||
              (!isEditing && addOneButtonEnabled)
            }
            style={{
              width: "20%",
              fontSize: "20px",
              borderRadius: "2px",
            }}
          />
          <TextField
            label="Bank Name"
            id="Bank_Name"
            name="Bank_Name"
            value={formData.Bank_Name}
            size="small"
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Bank_Name") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Bank A/c No"
            id="Bank_Ac_No"
            name="Bank_Ac_No"
            value={formData.Bank_Ac_No}
            onChange={handleChange}
            size="small"
            disabled={
              !isFieldEnabled("Bank_Ac_No") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Bank Opening Bal"
            id="Bank_Opening"
            name="Bank_Opening"
            value={formData.Bank_Opening}
            size="small"
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Bank_Opening") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <FormControl size="small" fullWidth sx={{ width: "10vh" }}>
            <InputLabel>Bank Opening Dr/Cr</InputLabel>
            <Select
              id="bank_Op_Drcr"
              name="bank_Op_Drcr"
              value={formData.bank_Op_Drcr}
              onChange={handleChange}
              disabled={
                !isFieldEnabled("bank_Op_Drcr") ||
                (!isEditing && addOneButtonEnabled)
              }
            >
              <MenuItem value="D">Debit</MenuItem>
              <MenuItem value="C">Credit</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Opening Balance"
            id="Opening_Balance"
            name="Opening_Balance"
            value={formData.Opening_Balance}
            onChange={handleChange}
            size="small"
            disabled={
              !isFieldEnabled("Opening_Balance") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <FormControl size="small" fullWidth sx={{ width: "10vh" }}>
            <InputLabel>Dr/Cr</InputLabel>
            <Select
              id="Drcr"
              name="Drcr"
              value={formData.Drcr}
              onChange={handleChange}
              disabled={
                !isFieldEnabled("Drcr") || (!isEditing && addOneButtonEnabled)
              }
            >
              <MenuItem value="D">Debit</MenuItem>
              <MenuItem value="C">Credit</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
          <label htmlFor="Group_Code">Group Code:</label>
          <GroupMasterHelp
            name="Group_Code"
            onAcCodeClick={handleGroup_Code}
            GroupName={
              groupMasterData ? groupMasterData.group.group_Name_E : grpName
            }
            GroupCode={
              groupMasterData ? groupMasterData.group.group_Code : newGroup_Code
            }
            tabIndex={24}
            disabledFeild={!isEditing && addOneButtonEnabled}
          />
          <Button
            variant="contained"
            size="small"
            onClick={(e) => handleAddGroup(e)}
          >
            Add Group
          </Button>
          {showGroupPopup && (
            <div className="group-master-modal">
              <div className="group-master-modal-content">
                <button
                  className="group-master-close-btn"
                  onClick={handleCloseGroupPopup}
                >
                  &times;
                </button>
                <div className="group-master-popup-wrapper">
                  <FinicialMaster isPopup={true} ref={groupMasterRef} />{" "}
                  {/* Render GroupMasterHelp component */}
                  <div className="popup-action-buttons">
                    <button onClick={handleGroupSave} className="save-btn">
                      Save
                    </button>
                    <button
                      onClick={handleCloseGroupPopup}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overlay for the modal */}
          {showGroupPopup && (
            <div
              className="group-master-modal-overlay"
              onClick={handleCloseGroupPopup}
              role="button"
            ></div>
          )}
          <TextField
            label="Short Name"
            id="Short_Name"
            name="Short_Name"
            value={formData.Short_Name}
            size="small"
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Short_Name") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Commission Rate"
            id="Commission"
            name="Commission"
            size="small"
            value={formData.Commission}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Commission") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <label htmlFor="carporate_party">Is Carporate Party::</label>
          <Checkbox
            sx={{
              color: "primary.main",
              "&.Mui-checked": {
                color: "secondary.main",
              },
            }}
            id="carporate_party"
            name="carporate_party"
            checked={formData.carporate_party === "Y"}
            onChange={(e) => handleCheckbox(e, "string")}
            disabled={
              !isFieldEnabled("carporate_party") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Ref By"
            id="referBy"
            name="referBy"
            value={formData.referBy}
            onChange={handleChange}
            size="small"
            disabled={
              !isFieldEnabled("referBy") || (!isEditing && addOneButtonEnabled)
            }
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
          <TextField
            label="Off. Phone"
            id="OffPhone"
            name="OffPhone"
            size="small"
            value={formData.OffPhone}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("OffPhone") || (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="TCS/TDS Link"
            id="Fax"
            name="Fax"
            size="small"
            value={formData.Fax}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Fax") || (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Company Pan"
            id="CompanyPan"
            name="CompanyPan"
            size="small"
            value={
              formData?.CompanyPan ||
              formData.Gst_No.substring(2, formData.Gst_No.length - 3).trim()
            }
            onChange={handleChange}
            disabled={
              !isFieldEnabled("CompanyPan") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Mobile No"
            id="Mobile_No"
            name="Mobile_No"
            size="small"
            value={formData.Mobile_No}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Mobile_No") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Bank IFSC Code"
            id="IFSC"
            name="IFSC"
            size="small"
            value={formData.IFSC}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("IFSC") || (!isEditing && addOneButtonEnabled)
            }
          />

          <TextField
            label="FSSAI Lic No"
            id="FSSAI"
            name="FSSAI"
            size="small"
            value={formData.FSSAI}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("FSSAI") || (!isEditing && addOneButtonEnabled)
            }
          />
          <label htmlFor="Locked">Locked::</label>
          <Checkbox
            sx={{
              color: "primary.main",
              "&.Mui-checked": {
                color: "secondary.main",
              },
            }}
            id="Locked"
            name="Locked"
            checked={formData.Locked === 1}
            onChange={(e) => handleCheckbox(e, "numeric")}
            disabled={
              !isFieldEnabled("Locked") || (!isEditing && addOneButtonEnabled)
            }
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
          <label htmlFor="GSTStateCode">GST State Code:</label>
          <GSTStateMasterHelp
            name="GSTStateCode"
            onAcCodeClick={handleGSTStateCode}
            GstStateName={gstStateName}
            GstStateCode={newGSTStateCode}
            tabIndex={44}
            disabledFeild={!isEditing && addOneButtonEnabled}
          />
          <label htmlFor="UnregisterGST">Unregister For GST::</label>
          <input
            type="checkbox"
            id="UnregisterGST"
            name="UnregisterGST"
            checked={formData.UnregisterGST === 1}
            onChange={(e) => handleCheckbox(e, "numeric")}
            disabled={
              !isFieldEnabled("UnregisterGST") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Distance"
            id="Distance"
            name="Distance"
            value={formData.Distance}
            size="small"
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Distance") || (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="whatsApp No"
            id="whatsup_no"
            name="whatsup_no"
            size="small"
            value={formData.whatsup_no}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("whatsup_no") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Adhar No"
            id="adhar_no"
            name="adhar_no"
            size="small"
            value={formData.adhar_no}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("adhar_no") || (!isEditing && addOneButtonEnabled)
            }
          />
          <FormControl size="small" fullWidth sx={{ width: "12vh" }}>
            <InputLabel>Limit</InputLabel>
            <Select
              id="Limit_By"
              name="Limit_By"
              value={formData.Limit_By}
              onChange={handleChange}
              disabled={
                !isFieldEnabled("Limit_By") ||
                (!isEditing && addOneButtonEnabled)
              }
            >
              <MenuItem value="Y">By Limit</MenuItem>
              <MenuItem value="N">No Limit</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tan No"
            id="Tan_no"
            name="Tan_no"
            value={formData.Tan_no}
            size="small"
            onChange={handleChange}
            disabled={
              !isFieldEnabled("Tan_no") || (!isEditing && addOneButtonEnabled)
            }
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
          <FormControl size="small" fullWidth sx={{ width: "25vh" }}>
            <InputLabel>TDS Applicable</InputLabel>
            <Select
              id="TDSApplicable"
              name="TDSApplicable"
              value={formData.TDSApplicable}
              onChange={handleChange}
              disabled={
                !isFieldEnabled("TDSApplicable") ||
                (!isEditing && addOneButtonEnabled)
              }
            >
              <MenuItem value="L">Lock</MenuItem>
              <MenuItem value="Y">Sale TDS By Limit</MenuItem>
              <MenuItem value="N">Sale TCS By Limit</MenuItem>
              <MenuItem value="T">TCS Bill 1 Sale</MenuItem>
              <MenuItem value="S">TDS Bill 1 Sale</MenuItem>
              <MenuItem value="U">URP</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth sx={{ width: "25vh" }}>
            <InputLabel>Purchase TDS Applicable</InputLabel>
            <Select
              id="PurchaseTDSApplicable"
              name="PurchaseTDSApplicable"
              value={formData.PurchaseTDSApplicable}
              onChange={handleChange}
              disabled={
                !isFieldEnabled("PurchaseTDSApplicable") ||
                (!isEditing && addOneButtonEnabled)
              }
            >
              <MenuItem value="L">Lock</MenuItem>
              <MenuItem value="Y">Purchase TDS By Limit</MenuItem>
              <MenuItem value="P">Purchase TDS By 1st Bill</MenuItem>
              <MenuItem value="N">Purchase TCS By Limit</MenuItem>
              <MenuItem value="B">Purchase TCS By 1st Bill</MenuItem>
              <MenuItem value="U">URP</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Pan Link"
            id="PanLink"
            name="PanLink"
            value={formData.PanLink}
            size="small"
            onChange={handleChange}
            disabled={
              !isFieldEnabled("PanLink") || (!isEditing && addOneButtonEnabled)
            }
          />

          <label htmlFor="loadingbyus">Loading by us:</label>
          <Checkbox
            sx={{
              color: "primary.main",
              "&.Mui-checked": {
                color: "secondary.main",
              },
            }}
            id="loadingbyus"
            name="loadingbyus"
            checked={formData.loadingbyus === "Y"}
            onChange={(e) => handleCheckbox(e, "string")}
            disabled={
              !isFieldEnabled("loadingbyus") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
          <TextField
            label="Transporter ID"
            id="TransporterId"
            name="TransporterId"
            size="small"
            value={formData.TransporterId}
            onChange={handleChange}
            disabled={
              !isFieldEnabled("TransporterId") ||
              (!isEditing && addOneButtonEnabled)
            }
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <TableContainer
            component={Paper}
            sx={{
              width: "50%",
              maxWidth: 400,
              ml: -160,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Group Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupData.map((group) => (
                  <TableRow key={group.Category_Code}>
                    <TableCell>{group.Category_Code}</TableCell>
                    <TableCell>{group.Category_Name}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedGroups.includes(group.Category_Code)}
                        onChange={(e) => handleCheckboxAcGroups(e, group)}
                        disabled={!isEditing && addOneButtonEnabled}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-container">
              <HashLoader color="#007bff" loading={isLoading} size={80} />
            </div>
          </div>
        )}

        {/*detail part popup functionality and Validation part Grid view */}
        <Dialog open={showPopup} onClose={closePopup} fullWidth>
          <DialogTitle>
            {selectedUser.Id ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label="Person Name"
                name="Person_Name"
                value={formDataDetail.Person_Name}
                onChange={handleDetailChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Person Mobile"
                name="Person_Mobile"
                value={formDataDetail.Person_Mobile}
                onChange={handleDetailChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Person Email"
                name="Person_Email"
                value={formDataDetail.Person_Email}
                onChange={handleDetailChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Person Pan"
                name="Person_Pan"
                value={formDataDetail.Person_Pan}
                onChange={handleDetailChange}
                fullWidth
                margin="normal"
              />
              <TextareaAutosize
                placeholder="Other"
                name="Other"
                value={formDataDetail.Other}
                onChange={handleDetailChange}
                minRows={3}
                style={{ width: "100%", marginTop: "16px", padding: "8px" }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            {selectedUser.Id ? (
              <Button variant="contained" color="primary" onClick={updateUser}>
                Update User
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={addUser}>
                Add User
              </Button>
            )}
            <Button variant="outlined" color="secondary" onClick={closePopup}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <div style={{ display: "flex", marginBottom: "16px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openPopup("add")}
            style={{ marginRight: "10px" }}
          >
            Add
          </Button>
          <Button variant="contained" color="error" disabled={!isEditing}>
            Close
          </Button>
        </div>

        {/* Table for Users */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell>A/C Code</TableCell>
                <TableCell>Person Name</TableCell>
                <TableCell>Person Mobile</TableCell>
                <TableCell>Person Email</TableCell>
                <TableCell>Person Pan</TableCell>
                <TableCell>Other</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.Id}>
                  <TableCell>
                    {user.rowaction === "add" ||
                    user.rowaction === "update" ||
                    user.rowaction === "Normal" ? (
                      <>
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => editUser(user)}
                          disabled={!isEditing}
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => deleteModeHandler(user)}
                          disabled={!isEditing}
                        >
                          Delete
                        </Button>
                      </>
                    ) : user.rowaction === "DNU" ||
                      user.rowaction === "delete" ? (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => openDelete(user)}
                      >
                        Open
                      </Button>
                    ) : null}
                  </TableCell>
                  <TableCell>{formData.Ac_Code}</TableCell>
                  <TableCell>{user.Person_Name}</TableCell>
                  <TableCell>{user.Person_Mobile}</TableCell>
                  <TableCell>{user.Person_Email}</TableCell>
                  <TableCell>{user.Person_Pan}</TableCell>
                  <TableCell>{user.Other}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
export default AccountMaster;
