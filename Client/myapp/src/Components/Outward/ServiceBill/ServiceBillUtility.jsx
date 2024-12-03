import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableUtility from "../../../Common/UtilityCommon/TableUtility";

const API_URL = process.env.REACT_APP_API;


function ServiceBillUtility() {
   

    const columns = [
        { key: "Doc_No", label: "Doc No" },
        { key: "Date", label: "Doc Date" },
        { key: "Customer_Code", label: "Customer Code" },
        { key: "partyname", label: "Account Name" },
        { key: "GstRateCode", label: "GST Rate Code" },
        { key: "Item_Code", label: "Item Code" },
        { key: "Total", label: "Amount" },
        { key: "Final_Amount", label: "Final Amount" },
        { key: "TDS_Per", label: "TDS%" },
        { key: "ackno", label: "ACK No" },
        { key: "rbid", label: "RbId" },
        { key: "IsDeleted", label: "IsDeleted" },
    ];


    return (
        <TableUtility
            title="Service Bill"
            apiUrl={`${API_URL}/getdata-servicebill`}
            columns={columns}
            rowKey="Doc_No"
            addUrl="/service-bill"
            detailUrl="/service-bill"
            permissionUrl="/ServiceBill-utility"
        />
    );
}

export default ServiceBillUtility;
