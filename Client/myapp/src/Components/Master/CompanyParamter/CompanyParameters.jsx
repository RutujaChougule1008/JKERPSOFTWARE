import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./CompanyParameters.css";
import "react-toastify/dist/ReactToastify.css";
import AccountMasterHelp from "../../../Helper/AccountMasterHelp";
import { Grid, Typography } from "@mui/material";

const API_URL = process.env.REACT_APP_API;

var CommissionAcName;
var newCOMMISSION_AC;
var InterestAcName;
var newINTEREST_AC;
var TransportAcName;
var newTRANSPORT_AC;
var PostageAcName;
var newPOSTAGE_AC;
var SelfAc;
var newSELF_AC;
var GSTStateCodeName;
var newGSTStateCode;
var SaleCGSTAcName;
var newCGSTAc;
var SaleSGSTAcName;
var newSGSTAc;
var SaleIGSTAcName;
var newIGSTAc;
var PurchaseCGSTAcName;
var newPurchaseCGSTAc;
var PurchaseSGSTAcName;
var newPurchaseSGSTAc;
var PurchaseIGSTAcName;
var newPurchaseIGSTAc;
var RoundOffAcName;
var newRoundOff;
var TransportRCMGSTAcName;
var newTransport_RCM_GSTRate;
var CGST_RCMAcName;
var newCGST_RCM_Ac;
var SGST_RCMAcName;
var newSGST_RCM_Ac;
var IGST_RCMAcName;
var newIGST_RCM_Ac;
var FreightAcName;
var newFreight_Ac;
var PurchaseTCS_AcName;
var newPurchaseTCSAc;
var SaleTCS_AcName;
var newSaleTCSAc;
var OtherAcName;
var newOTHER_AMOUNT_AC;
var MarketSaseAcName;
var newMarketSase;
var SupercostAcName;
var newSuperCost;
var PackingAcName;
var newPacking;
var HamaliAcName;
var newHamali;
var TransportTDS_AcName;
var newTransportTDS_Ac;
var TransportTDS_CutAcName;
var newTransportTDS_AcCut;
var ReturnSaleCGST_AcName;
var newReturnSaleCGST;
var ReturnSaleSGSTAc_Name;
var newReturnSaleSGST;
var ReturnSaleIGSTName;
var newReturnSaleIGST;
var ReturnPurchaseCGSTName;
var newReturnPurchaseCGST;
var ReturnPurchaseSGST;
var newReturnPurchaseSGST;
var ReturnPurchaseIGSTName;
var newReturnPurchaseIGST;
var SaleTDSAcName;
var newSaleTDSAc;
var PurchaseTDSAcName;
var newPurchaseTDSAc;
var RateDiffAcName;
var newRateDiffAc;
var DepreciationAcName;
var newDepreciationAC;
var InterestTDS_AcName;
var newInterestTDSAc;
var BankPaymentAcName;
var newBankPaymentAc;
const CompanyParameters = () => {

  //GET Company Code and year code from the session
  const companyCode = sessionStorage.getItem("Company_Code");
  const Year_Code = sessionStorage.getItem("Year_Code");

  const [accountCode, setAccountCode] = useState("");
  const initialFormData = {
    COMMISSION_AC: "",
    INTEREST_AC: "",
    TRANSPORT_AC: "",
    POSTAGE_AC: "",
    SELF_AC: "",
    Company_Code: "",
    Year_Code: "",
    Created_By: "",
    Modified_By: "",
    AutoVoucher: "",
    tblPrefix: "",
    GSTStateCode: "",
    CGSTAc: "",
    SGSTAc: "",
    IGSTAc: "",
    PurchaseCGSTAc: "",
    PurchaseSGSTAc: "",
    PurchaseIGSTAc: "",
    RoundOff: "",
    Transport_RCM_GSTRate: "",
    CGST_RCM_Ac: "",
    SGST_RCM_Ac: "",
    IGST_RCM_Ac: "",
    Freight_Ac: "",
    TCS: "",
    PurchaseTCSAc: "",
    SaleTCSAc: "",
    filename: "",
    OTHER_AMOUNT_AC: "",
    MarketSase: "",
    SuperCost: "",
    Packing: "",
    Hamali: "",
    TransportTDS_Ac: "",
    TransportTDS_AcCut: "",
    Mill_Payment_date: "",
    dispatchType: "",
    ReturnSaleCGST: "",
    ReturnSaleSGST: "",
    ReturnSaleIGST: "",
    ReturnPurchaseCGST: "",
    ReturnPurchaseSGST: "",
    ReturnPurchaseIGST: "",
    SaleTDSAc: "",
    PurchaseTDSAc: "",
    PurchaseTDSRate: "",
    SaleTDSRate: "",
    BalanceLimit: "",
    RateDiffAc: "",
    customisesb: "",
    customisedo: "",
    DODate: "",
    DOPages: "",
    TCSPurchaseBalanceLimit: "",
    TDSPurchaseBalanceLimit: "",
    PurchaseSaleTcs: "",
    TCSTDSSaleBalanceLimit: "",
    DepreciationAC: "",
    InterestRate: "",
    InterestTDSAc: "",
    BankPaymentAc: "",
    bpid: "",
    Edit_Sale_Rate: "",
  };

  //Common Function to set the record Data
  const handleAccountCodeChange = (key, code) => {
    setAccountCode(code);
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: code,
    }));
  };

  //Handle individual function to manage the account master
  const handleCOMMISSION_AC = (code) => handleAccountCodeChange('COMMISSION_AC', code);
  const handleINTEREST_AC = (code) => handleAccountCodeChange('INTEREST_AC', code);
  const handleTRANSPORT_AC = (code) => handleAccountCodeChange('TRANSPORT_AC', code);
  const handlePOSTAGE_AC = (code) => handleAccountCodeChange('POSTAGE_AC', code);
  const handleSELF_AC = (code) => handleAccountCodeChange('SELF_AC', code);
  const handleGSTStateCode = (code) => handleAccountCodeChange('GSTStateCode', code);
  const handleCGSTAc = (code) => handleAccountCodeChange('CGSTAc', code);
  const handleSGSTAc = (code) => handleAccountCodeChange('SGSTAc', code);
  const handleIGSTAc = (code) => handleAccountCodeChange('IGSTAc', code);
  const handlePurchaseCGSTAc = (code) => handleAccountCodeChange('PurchaseCGSTAc', code);
  const handlePurchaseSGSTAc = (code) => handleAccountCodeChange('PurchaseSGSTAc', code);
  const handlePurchaseIGSTAc = (code) => handleAccountCodeChange('PurchaseIGSTAc', code);
  const handleRoundOff = (code) => handleAccountCodeChange('RoundOff', code);
  const handleTransport_RCM_GSTRate = (code) => handleAccountCodeChange('Transport_RCM_GSTRate', code);
  const handleCGST_RCM_Ac = (code) => handleAccountCodeChange('CGST_RCM_Ac', code);
  const handleSGST_RCM_Ac = (code) => handleAccountCodeChange('SGST_RCM_Ac', code);
  const handleIGST_RCM_Ac = (code) => handleAccountCodeChange('IGST_RCM_Ac', code);
  const handleFreight_Ac = (code) => handleAccountCodeChange('Freight_Ac', code);
  const handlePurchaseTCSAc = (code) => handleAccountCodeChange('PurchaseTCSAc', code);
  const handleSaleTCSAc = (code) => handleAccountCodeChange('SaleTCSAc', code);
  const handleOTHER_AMOUNT_AC = (code) => handleAccountCodeChange('OTHER_AMOUNT_AC', code);
  const handleMarketSase = (code) => handleAccountCodeChange('MarketSase', code);
  const handleSuperCost = (code) => handleAccountCodeChange('SuperCost', code);
  const handlePacking = (code) => handleAccountCodeChange('Packing', code);
  const handleHamali = (code) => handleAccountCodeChange('Hamali', code);
  const handleTransportTDS_Ac = (code) => handleAccountCodeChange('TransportTDS_Ac', code);
  const handleTransportTDS_AcCut = (code) => handleAccountCodeChange('TransportTDS_AcCut', code);
  const handleReturnSaleCGST = (code) => handleAccountCodeChange('ReturnSaleCGST', code);
  const handleReturnSaleSGST = (code) => handleAccountCodeChange('ReturnSaleSGST', code);
  const handleReturnSaleIGST = (code) => handleAccountCodeChange('ReturnSaleIGST', code);
  const handleReturnPurchaseCGST = (code) => handleAccountCodeChange('ReturnPurchaseCGST', code);
  const handleReturnPurchaseSGST = (code) => handleAccountCodeChange('ReturnPurchaseSGST', code);
  const handleReturnPurchaseIGST = (code) => handleAccountCodeChange('ReturnPurchaseIGST', code);
  const handleSaleTDSAc = (code) => handleAccountCodeChange('SaleTDSAc', code);
  const handlePurchaseTDSAc = (code) => handleAccountCodeChange('PurchaseTDSAc', code);
  const handleRateDiffAc = (code) => handleAccountCodeChange('RateDiffAc', code);
  const handleDepreciationAC = (code) => handleAccountCodeChange('DepreciationAC', code);
  const handleInterestTDSAc = (code) => handleAccountCodeChange('InterestTDSAc', code);
  const handleBankPaymentAc = (code) => handleAccountCodeChange('BankPaymentAc', code);

  const [formData, setFormData] = useState(initialFormData);

  // Handle change for all inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [name]: value };
      return updatedFormData;
    });
  };

  const handleSaveOrUpdate = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/create-or-update-CompanyParameters`,
        formData
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update data");
    }
  };

  useEffect(() => {
    handleCancel();
  }, []);

  const handleCancel = () => {
    axios
      .get(
        `${API_URL}/get-CompanyParameters-Record?Company_Code=${companyCode}&Year_Code=${Year_Code}`
      )
      .then((response) => {
        const data = response.data.CompanyParameters_data;
        const additionalData = response.data.additional_data[0];
        CommissionAcName = additionalData.commissionAcName;
        newCOMMISSION_AC = data.COMMISSION_AC;
        InterestAcName = additionalData.interestAcName;
        newINTEREST_AC = data.INTEREST_AC;
        TransportAcName = additionalData.transportAcName;
        newTRANSPORT_AC = data.TRANSPORT_AC;
        PostageAcName = additionalData.postageAcName;
        newPOSTAGE_AC = data.POSTAGE_AC;
        SelfAc = additionalData.selfAcName;
        newSELF_AC = data.SELF_AC;
        GSTStateCodeName = additionalData.State_Name;
        newGSTStateCode = data.GSTStateCode;
        SaleCGSTAcName = additionalData.CGSTAcName;
        newCGSTAc = data.CGSTAc;
        SaleSGSTAcName = additionalData.SGSTAcName;
        newSGSTAc = data.SGSTAc;
        SaleIGSTAcName = additionalData.IGSTAcName;
        newIGSTAc = data.IGSTAc;
        PurchaseCGSTAcName = additionalData.PurchaseCGSTAcName;
        newPurchaseCGSTAc = data.PurchaseCGSTAc;
        PurchaseSGSTAcName = additionalData.PurchaseSGSTAcName;
        newPurchaseSGSTAc = data.PurchaseSGSTAc;
        PurchaseIGSTAcName = additionalData.PurchaseIGSTAcName;
        newPurchaseIGSTAc = data.PurchaseIGSTAc;
        RoundOffAcName = additionalData.interestAcName;
        newRoundOff = data.RoundOff;
        TransportRCMGSTAcName = additionalData.TransportRCMGSTRateAcName;
        newTransport_RCM_GSTRate = data.Transport_RCM_GSTRate;
        CGST_RCMAcName = additionalData.CGSTRCMAcName;
        newCGST_RCM_Ac = data.CGST_RCM_Ac;
        SGST_RCMAcName = additionalData.SGSTRCMAcName;
        newSGST_RCM_Ac = data.SGST_RCM_Ac;
        IGST_RCMAcName = additionalData.IGSTRCMAcName;
        newIGST_RCM_Ac = data.IGST_RCM_Ac;
        FreightAcName = additionalData.FreightAcName;
        newFreight_Ac = data.Freight_Ac;
        PurchaseTCS_AcName = additionalData.PurchaseTCSAcName;
        newPurchaseTCSAc = data.PurchaseTCSAc;
        SaleTCS_AcName = additionalData.SaleTCSAcName;
        newSaleTCSAc = data.SaleTCSAc;
        OtherAcName = additionalData.OtherAmountAcName;
        newOTHER_AMOUNT_AC = data.OTHER_AMOUNT_AC;
        MarketSaseAcName = additionalData.MarketSaseAcName;
        newMarketSase = data.MarketSase;
        SupercostAcName = additionalData.SuperCostAcName;
        newSuperCost = data.SuperCost;
        PackingAcName = additionalData.PackingAcName;
        newPacking = data.Packing;
        HamaliAcName = additionalData.HamaliAcName;
        newHamali = data.Hamali;
        TransportTDS_AcName = additionalData.TransportTDSAcName;
        newTransportTDS_Ac = data.TransportTDS_Ac;
        TransportTDS_CutAcName = additionalData.TransportTDSAcCutAcName;
        newTransportTDS_AcCut = data.TransportTDS_AcCut;
        ReturnSaleCGST_AcName = additionalData.ReturnSaleCGSTAcAcName;
        newReturnSaleCGST = data.ReturnSaleCGST;
        ReturnSaleSGSTAc_Name = additionalData.ReturnSaleSGSTAcName;
        newReturnSaleSGST = data.ReturnSaleSGST;
        ReturnSaleIGSTName = additionalData.ReturnSaleIGSTAcName;
        newReturnSaleIGST = data.ReturnSaleIGST;
        ReturnPurchaseCGSTName = additionalData.ReturnPurchaseCGSTAcName;
        newReturnPurchaseCGST = data.ReturnPurchaseCGST;
        ReturnPurchaseSGST = additionalData.ReturnPurchaseSGSTAcName;
        newReturnPurchaseSGST = data.ReturnPurchaseSGST;
        ReturnPurchaseIGSTName = additionalData.ReturnPurchaseIGSTAcName;
        newReturnPurchaseIGST = data.ReturnPurchaseIGST;
        SaleTDSAcName = additionalData.SaleTDSAcName;
        newSaleTDSAc = data.SaleTDSAc;
        PurchaseTDSAcName = additionalData.PurchaseTDSAcName;
        newPurchaseTDSAc = data.PurchaseTDSAc;
        RateDiffAcName = additionalData.RateDiffAcName;
        newRateDiffAc = data.RateDiffAc;
        DepreciationAcName = additionalData.DepreciationAcName;
        newDepreciationAC = data.DepreciationAC;
        InterestTDS_AcName = additionalData.InterestTDSAcName;
        newInterestTDSAc = data.InterestTDSAc;
        BankPaymentAcName = additionalData.BankPaymentAcName;
        newBankPaymentAc = data.BankPaymentAc;

        console.log(data);
        setFormData({
          ...formData,
          ...data,
        });
      })
      .catch((error) => {
        console.error("Error fetching latest data for edit:", error);
      });
  };

  return (
    <>
      <div>
        <ToastContainer autoClose={500}/>
        <form onSubmit={handleSaveOrUpdate}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Company Parameter
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="COMMISSION_AC" style={{ marginRight: "10px" }}>Commission A/c</label>
              <AccountMasterHelp
                name="COMMISSION_AC"
                Ac_type=""
                onAcCodeClick={handleCOMMISSION_AC}
                CategoryName={CommissionAcName}
                CategoryCode={newCOMMISSION_AC}
                tabIndex={1}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="INTEREST_AC" style={{ marginRight: "10px" }}>Interest A/c</label>
              <AccountMasterHelp
                name="INTEREST_AC"
                Ac_type=""
                onAcCodeClick={handleINTEREST_AC}
                CategoryName={InterestAcName}
                CategoryCode={newINTEREST_AC}
                tabIndex={2}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="TRANSPORT_AC" style={{ marginRight: "10px" }}>Transport A/c</label>
              <AccountMasterHelp
                name="TRANSPORT_AC"
                Ac_type=""
                onAcCodeClick={handleTRANSPORT_AC}
                CategoryName={TransportAcName}
                CategoryCode={newTRANSPORT_AC}
                tabIndex={3}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="POSTAGE_AC" style={{ marginRight: "10px" }}>Postage A/c</label>
              <AccountMasterHelp
                name="POSTAGE_AC"
                Ac_type=""
                onAcCodeClick={handlePOSTAGE_AC}
                CategoryName={PostageAcName}
                CategoryCode={newPOSTAGE_AC}
                tabIndex={4}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="SELF_AC" style={{ marginRight: "10px" }}>Self A/c</label>
              <AccountMasterHelp
                name="SELF_AC"
                Ac_type=""
                onAcCodeClick={handleSELF_AC}
                CategoryName={SelfAc}
                CategoryCode={newSELF_AC}
                tabIndex={5}
              />
            </Grid>

            <Grid item xs={12} sm={3} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="AutoVoucher" style={{ marginRight: "10px" }}>
                Auto Generate Voucher:
              </label>
              <div>
                <select
                  id="AutoVoucher"
                  name="AutoVoucher"
                  value={formData.AutoVoucher}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "8px", fontSize: "14px" }}
                >
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
            </Grid>

          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="GSTStateCode" style={{ marginRight: "10px" }}>GST State Code</label>
              <AccountMasterHelp
                name="GSTStateCode"
                Ac_type=""
                onAcCodeClick={handleGSTStateCode}
                CategoryName={GSTStateCodeName}
                CategoryCode={newGSTStateCode}
                tabIndex={12}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="CGSTAc" style={{ marginRight: "10px" }}>Sale CGST A/c</label>
              <AccountMasterHelp
                name="CGSTAc"
                Ac_type=""
                onAcCodeClick={handleCGSTAc}
                CategoryName={SaleCGSTAcName}
                CategoryCode={newCGSTAc}
                tabIndex={13}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="SGSTAc" style={{ marginRight: "10px" }}>Sale SGST A/c</label>
              <AccountMasterHelp
                name="SGSTAc"
                Ac_type=""
                onAcCodeClick={handleSGSTAc}
                CategoryName={SaleSGSTAcName}
                CategoryCode={newSGSTAc}
                tabIndex={14}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="IGSTAc" style={{ marginRight: "10px" }}>Sale IGST A/c</label>
              <AccountMasterHelp
                name="IGSTAc"
                Ac_type=""
                onAcCodeClick={handleIGSTAc}
                CategoryName={SaleIGSTAcName}
                CategoryCode={newIGSTAc}
                tabIndex={15}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="PurchaseCGSTAc" style={{ marginRight: "10px" }}>Purchase CGST A/c</label>
              <AccountMasterHelp
                name="PurchaseCGSTAc"
                Ac_type=""
                onAcCodeClick={handlePurchaseCGSTAc}
                CategoryName={PurchaseCGSTAcName}
                CategoryCode={newPurchaseCGSTAc}
                tabIndex={16}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="PurchaseSGSTAc" style={{ marginRight: "10px" }}>Purchase SGST A/c</label>
              <AccountMasterHelp
                name="PurchaseSGSTAc"
                Ac_type=""
                onAcCodeClick={handlePurchaseSGSTAc}
                CategoryName={PurchaseSGSTAcName}
                CategoryCode={newPurchaseSGSTAc}
                tabIndex={17}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="PurchaseIGSTAc" style={{ marginRight: "10px" }}>Purchase IGST A/c</label>
              <AccountMasterHelp
                name="PurchaseIGSTAc"
                Ac_type=""
                onAcCodeClick={handlePurchaseIGSTAc}
                CategoryName={PurchaseIGSTAcName}
                CategoryCode={newPurchaseIGSTAc}
                tabIndex={18}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="RoundOff" style={{ marginRight: "10px" }}>Round off</label>
              <AccountMasterHelp
                name="RoundOff"
                Ac_type=""
                onAcCodeClick={handleRoundOff}
                CategoryName={RoundOffAcName}
                CategoryCode={newRoundOff}
                tabIndex={19}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="Transport_RCM_GSTRate" style={{ marginRight: "10px" }}>Transport RCM GSTRate</label>
              <AccountMasterHelp
                name="Transport_RCM_GSTRate"
                Ac_type=""
                onAcCodeClick={handleTransport_RCM_GSTRate}
                CategoryName={TransportRCMGSTAcName}
                CategoryCode={newTransport_RCM_GSTRate}
                tabIndex={20}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="CGST_RCM_Ac" style={{ marginRight: "10px" }}>CGST RCM Ac</label>
              <AccountMasterHelp
                name="CGST_RCM_Ac"
                Ac_type=""
                onAcCodeClick={handleCGST_RCM_Ac}
                CategoryName={CGST_RCMAcName}
                CategoryCode={newCGST_RCM_Ac}
                tabIndex={21}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="SGST_RCM_Ac" style={{ marginRight: "10px" }}>SGST RCM Ac</label>
              <AccountMasterHelp
                name="SGST_RCM_Ac"
                Ac_type=""
                onAcCodeClick={handleSGST_RCM_Ac}
                CategoryName={SGST_RCMAcName}
                CategoryCode={newSGST_RCM_Ac}
                tabIndex={22}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="IGST_RCM_Ac" style={{ marginRight: "10px" }}>IGST RCM Ac</label>
              <AccountMasterHelp
                name="IGST_RCM_Ac"
                Ac_type=""
                onAcCodeClick={handleIGST_RCM_Ac}
                CategoryName={IGST_RCMAcName}
                CategoryCode={newIGST_RCM_Ac}
                tabIndex={23}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="Freight_Ac" style={{ marginRight: "10px" }}>Freight A/C</label>
              <AccountMasterHelp
                name="Freight_Ac"
                Ac_type=""
                onAcCodeClick={handleFreight_Ac}
                CategoryName={FreightAcName}
                CategoryCode={newFreight_Ac}
                tabIndex={24}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="TCS" style={{ marginRight: "10px" }}>SALE TCS %:</label>
              <input
                type="text"
                id="TCS"
                name="TCS"
                value={formData.TCS}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="PurchaseTCSAc" style={{ marginRight: "10px" }}>Purchase TCS A/c</label>
              <AccountMasterHelp
                name="PurchaseTCSAc"
                Ac_type=""
                onAcCodeClick={handlePurchaseTCSAc}
                CategoryName={PurchaseTCS_AcName}
                CategoryCode={newPurchaseTCSAc}
                tabIndex={26}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="SaleTCSAc" style={{ marginRight: "10px" }}>Sale TCS A/c</label>
              <AccountMasterHelp
                name="SaleTCSAc"
                Ac_type=""
                onAcCodeClick={handleSaleTCSAc}
                CategoryName={SaleTCS_AcName}
                CategoryCode={newSaleTCSAc}
                tabIndex={27}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="OTHER_AMOUNT_AC" style={{ marginRight: "10px" }}>Other A/c</label>
              <AccountMasterHelp
                name="OTHER_AMOUNT_AC"
                Ac_type=""
                onAcCodeClick={handleOTHER_AMOUNT_AC}
                CategoryName={OtherAcName}
                CategoryCode={newOTHER_AMOUNT_AC}
                tabIndex={29}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="MarketSase" style={{ marginRight: "10px" }}>Market Sase A/c</label>
              <AccountMasterHelp
                name="MarketSase"
                Ac_type=""
                onAcCodeClick={handleMarketSase}
                CategoryName={MarketSaseAcName}
                CategoryCode={newMarketSase}
                tabIndex={30}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="SuperCost" style={{ marginRight: "10px" }}>Supercost A/c</label>
              <AccountMasterHelp
                name="SuperCost"
                Ac_type=""
                onAcCodeClick={handleSuperCost}
                CategoryName={SupercostAcName}
                CategoryCode={newSuperCost}
                tabIndex={31}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="Packing" style={{ marginRight: "10px" }}>Packing A/c</label>
              <AccountMasterHelp
                Name="Packing"
                Ac_type=""
                onAcCodeClick={handlePacking}
                CategoryName={PackingAcName}
                CategoryCode={newPacking}
                tabIndex={32}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="Hamali" style={{ marginRight: "10px" }}>Hamali A/c</label>
              <AccountMasterHelp
                name="Hamali"
                Ac_type=""
                onAcCodeClick={handleHamali}
                CategoryName={HamaliAcName}
                CategoryCode={newHamali}
                tabIndex={33}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="TransportTDS_Ac" style={{ marginRight: "10px" }}>Transport TDS A/c</label>
              <AccountMasterHelp
                name="TransportTDS_Ac"
                Ac_type=""
                onAcCodeClick={handleTransportTDS_Ac}
                CategoryName={TransportTDS_AcName}
                CategoryCode={newTransportTDS_Ac}
                tabIndex={34}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="TransportTDS_AcCut" style={{ marginRight: "10px" }}>
                Transport TDS Cut by Us A/c
              </label>
              <AccountMasterHelp
                name="TransportTDS_AcCut"
                Ac_type=""
                onAcCodeClick={handleTransportTDS_AcCut}
                CategoryName={TransportTDS_CutAcName}
                CategoryCode={newTransportTDS_AcCut}
                tabIndex={35}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="Mill_Payment_date" style={{ marginRight: "10px" }}>Mill Payment Date:</label>
              <input
                type="text"
                id="Mill_Payment_date"
                name="Mill_Payment_date"
                value={formData.Mill_Payment_date}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="dispatchType" style={{ marginRight: "10px" }}>Dispatch Type:</label>
              <select
                id="dispatchType"
                name="dispatchType"
                value={formData.dispatchType}
                onChange={handleChange}
              >
                <option value="C">Commission</option>
                <option value="N">With GST Naka Delivery</option>
                <option value="A">Naka Delivery without GST Rate</option>
                <option value="D">DO</option>
              </select>
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="ReturnSaleCGST" style={{ marginRight: "10px" }}>Return Sale CGST</label>
              <AccountMasterHelp
                name="ReturnSaleCGST"
                Ac_type=""
                onAcCodeClick={handleReturnSaleCGST}
                CategoryName={ReturnSaleCGST_AcName}
                CategoryCode={newReturnSaleCGST}
                tabIndex={38}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="ReturnSaleSGST" style={{ marginRight: "10px" }}>Return Sale SGST</label>
              <AccountMasterHelp
                name="ReturnSaleSGST"
                Ac_type=""
                onAcCodeClick={handleReturnSaleSGST}
                CategoryName={ReturnSaleSGSTAc_Name}
                CategoryCode={newReturnSaleSGST}
                tabIndex={39}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="ReturnSaleIGST" style={{ marginRight: "10px" }}>Return Sale IGST</label>
              <AccountMasterHelp
                name="ReturnSaleIGST"
                Ac_type=""
                onAcCodeClick={handleReturnSaleIGST}
                CategoryName={ReturnSaleIGSTName}
                CategoryCode={newReturnSaleIGST}
                tabIndex={40}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="ReturnPurchaseCGST" style={{ marginRight: "10px" }}>Return Purchase CGST</label>
              <AccountMasterHelp
                name="ReturnPurchaseCGST"
                Ac_type=""
                onAcCodeClick={handleReturnPurchaseCGST}
                CategoryName={ReturnPurchaseCGSTName}
                CategoryCode={newReturnPurchaseCGST}
                tabIndex={41}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="ReturnPurchaseSGST" style={{ marginRight: "10px" }}>Return Purchase SGST</label>
              <AccountMasterHelp
                name="ReturnPurchaseSGST"
                Ac_type=""
                onAcCodeClick={handleReturnPurchaseSGST}
                CategoryName={ReturnPurchaseSGST}
                CategoryCode={newReturnPurchaseSGST}
                tabIndex={42}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="ReturnPurchaseIGST" style={{ marginRight: "10px" }}>Return Purchase IGST</label>
              <AccountMasterHelp
                name="ReturnPurchaseIGST"
                Ac_type=""
                onAcCodeClick={handleReturnPurchaseIGST}
                CategoryName={ReturnPurchaseIGSTName}
                CategoryCode={newReturnPurchaseIGST}
                tabIndex={43}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="SaleTDSAc" style={{ marginRight: "10px" }}>Sale TDS Ac</label>
              <AccountMasterHelp
                name="SaleTDSAc"
                Ac_type=""
                onAcCodeClick={handleSaleTDSAc}
                CategoryName={SaleTDSAcName}
                CategoryCode={newSaleTDSAc}
                tabIndex={44}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="PurchaseTDSAc" style={{ marginRight: "10px" }}>Purchase TDS Ac</label>
              <AccountMasterHelp
                name="PurchaseTDSAc"
                Ac_type=""
                onAcCodeClick={handlePurchaseTDSAc}
                CategoryName={PurchaseTDSAcName}
                CategoryCode={newPurchaseTDSAc}
                tabIndex={45}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="PurchaseTDSRate" style={{ marginRight: "10px" }}>Purchase TDS Rate:</label>
              <input
                type="text"
                id="PurchaseTDSRate"
                name="PurchaseTDSRate"
                value={formData.PurchaseTDSRate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="SaleTDSRate" style={{ marginRight: "10px" }}>Sale TDS Rate:</label>
              <input
                type="text"
                id="SaleTDSRate"
                name="SaleTDSRate"
                value={formData.SaleTDSRate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="BalanceLimit" style={{ marginRight: "10px" }}>TCS SALE Balance Limit:</label>
              <input
                type="text"
                id="BalanceLimit"
                name="BalanceLimit"
                value={formData.BalanceLimit}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="RateDiffAc" style={{ marginRight: "10px" }}>Rate Diff Ac</label>
              <AccountMasterHelp
                name="RateDiffAc"
                Ac_type=""
                onAcCodeClick={handleRateDiffAc}
                CategoryName={RateDiffAcName}
                CategoryCode={newRateDiffAc}
                tabIndex={49}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="DODate" style={{ marginRight: "10px" }}>Do Date:</label>
              <input
                type="date"
                id="DODate"
                name="DODate"
                value={formData.DODate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="DOPages" style={{ marginRight: "10px" }}>DOPages:</label>
              <input
                type="text"
                id="DOPages"
                name="DOPages"
                value={formData.DOPages}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="TCSPurchaseBalanceLimit" style={{ marginRight: "10px" }}>TCS Purchase Balance Limit:</label>
              <input
                type="text"
                id="TCSPurchaseBalanceLimit"
                name="TCSPurchaseBalanceLimit"
                value={formData.TCSPurchaseBalanceLimit}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="TDSPurchaseBalanceLimit" style={{ marginRight: "10px" }}>TDS Purchase Balance Limit:</label>
              <input
                type="text"
                id="TDSPurchaseBalanceLimit"
                name="TDSPurchaseBalanceLimit"
                value={formData.TDSPurchaseBalanceLimit}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="PurchaseSaleTcs" style={{ marginRight: "10px" }}>Purchase TCS %:</label>
              <input
                type="text"
                id="PurchaseSaleTcs"
                name="PurchaseSaleTcs"
                value={formData.PurchaseSaleTcs}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="TCSTDSSaleBalanceLimit" style={{ marginRight: "10px" }}>TDS SALE Balance Limit:</label>
              <input
                type="text"
                id="TCSTDSSaleBalanceLimit"
                name="TCSTDSSaleBalanceLimit"
                value={formData.TCSTDSSaleBalanceLimit}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="DepreciationAC" style={{ marginRight: "10px" }}>Depreciation A/c</label>
              <AccountMasterHelp
                name="DepreciationAC"
                Ac_type=""
                onAcCodeClick={handleDepreciationAC}
                CategoryName={DepreciationAcName}
                CategoryCode={newDepreciationAC}
                tabIndex={58}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="InterestRate" style={{ marginRight: "10px" }}>Interest TDS Rate:</label>
              <input
                type="text"
                id="InterestRate"
                name="InterestRate"
                value={formData.InterestRate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="InterestTDSAc" style={{ marginRight: "10px" }}>Interest TDS Ac</label>
              <AccountMasterHelp
                name="InterestTDSAc"
                Ac_type=""
                onAcCodeClick={handleInterestTDSAc}
                CategoryName={InterestTDS_AcName}
                CategoryCode={newInterestTDSAc}
                tabIndex={60}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" alignItems="center" sx={{ mb: 2 }}>
              <label htmlFor="BankPaymentAc" style={{ marginRight: "10px" }}>Bank Payment Ac</label>
              <AccountMasterHelp
                name="BankPaymentAc"
                Ac_type=""
                onAcCodeClick={handleBankPaymentAc}
                CategoryName={BankPaymentAcName}
                CategoryCode={newBankPaymentAc}
                tabIndex={61}
              />
            </Grid>
          </Grid>
          <div className="button-container">
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </>
  );
};
export default CompanyParameters;
