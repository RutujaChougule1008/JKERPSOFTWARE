from flask import Flask, jsonify, request
from app import app, db
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError 
from sqlalchemy import func
import os
import requests
from datetime import datetime
API_URL= os.getenv('API_URL')

@app.route(API_URL+"/get_eWayBill_generationData", methods=["GET"])
def get_eWayBill_generationData():
    try:
        saleId = request.args.get('saleId')
        companyCode = request.args.get('Company_Code')
        yearCode = request.args.get('Year_Code')

        if not saleId or not companyCode or not yearCode:
            return jsonify({"error": "Missing 'saleId' or 'Company_Code' or 'Year_Code' Parameter"}), 400

        query = ('''SELECT        dbo.NT_1qryEInvoice.doc_no AS Doc_No, CONVERT(varchar, dbo.NT_1qryEInvoice.doc_date, 103) AS doc_date, UPPER(dbo.NT_1qryEInvoice.BuyerGst_No) AS BuyerGst_No, UPPER(dbo.NT_1qryEInvoice.Buyer_Name) 
                         AS Buyer_Name, UPPER(dbo.NT_1qryEInvoice.Buyer_Address) AS Buyer_Address, UPPER(dbo.NT_1qryEInvoice.Buyer_City) AS Buyer_City, (CASE Buyer_Pincode WHEN 0 THEN 999999 ELSE Buyer_Pincode END) 
                         AS Buyer_Pincode, UPPER(dbo.NT_1qryEInvoice.Buyer_State_name) AS Buyer_State_name, dbo.NT_1qryEInvoice.Buyer_State_Code, dbo.NT_1qryEInvoice.Buyer_Phno, dbo.NT_1qryEInvoice.Buyer_Email_Id, 
                         UPPER(dbo.NT_1qryEInvoice.DispatchGst_No) AS DispatchGst_No, UPPER(dbo.NT_1qryEInvoice.Dispatch_Name) AS Dispatch_Name, UPPER(dbo.NT_1qryEInvoice.Dispatch_Address) AS Dispatch_Address, 
                         UPPER(dbo.NT_1qryEInvoice.DispatchCity_City) AS DispatchCity_City, dbo.NT_1qryEInvoice.Dispatch_GSTStateCode, (CASE Dispatch_Pincode WHEN 0 THEN 999999 ELSE Dispatch_Pincode END) AS Dispatch_Pincode, 
                         UPPER(dbo.NT_1qryEInvoice.ShipToGst_No) AS ShipToGst_No, UPPER(dbo.NT_1qryEInvoice.ShipTo_Name) AS ShipTo_Name, UPPER(dbo.NT_1qryEInvoice.ShipTo_Address) AS ShipTo_Address, 
                         UPPER(dbo.NT_1qryEInvoice.ShipTo_City) AS ShipTo_City, dbo.NT_1qryEInvoice.ShipTo_GSTStateCode, (CASE ShipTo_Pincode WHEN 0 THEN 999999 ELSE ShipTo_Pincode END) AS ShipTo_Pincode, 
                         dbo.NT_1qryEInvoice.NETQNTL, dbo.NT_1qryEInvoice.rate, dbo.NT_1qryEInvoice.CGSTAmount, dbo.NT_1qryEInvoice.SGSTAmount, dbo.NT_1qryEInvoice.IGSTAmount, dbo.NT_1qryEInvoice.TaxableAmount, 
                         ISNULL(dbo.NT_1qryEInvoice.CGSTRate, 0) AS CGSTRate, ISNULL(dbo.NT_1qryEInvoice.SGSTRate, 0) AS SGSTRate, ISNULL(dbo.NT_1qryEInvoice.IGSTRate, 0) AS IGSTRate, dbo.NT_1qryEInvoice.Distance, 
                         dbo.NT_1qryEInvoice.LORRYNO, dbo.NT_1qryEInvoice.System_Name_E, dbo.NT_1qryEInvoice.HSN, dbo.NT_1qryEInvoice.GSTRate, dbo.NT_1qryEInvoice.LESS_FRT_RATE, dbo.nt_1_companyparameters.GSTStateCode, 
                         dbo.company.Company_Name_E, dbo.company.Address_E, dbo.company.City_E, dbo.company.State_E, dbo.company.PIN, dbo.company.PHONE, dbo.company.GST, dbo.eway_bill.Mode_of_Payment, 
                         dbo.eway_bill.Account_Details, dbo.tbluser.EmailId, dbo.eway_bill.Branch, dbo.NT_1qryEInvoice.saleId, dbo.NT_1qryEInvoice.IsService, dbo.NT_1qryEInvoice.Bill_Amount AS billAmount
FROM            dbo.NT_1qryEInvoice INNER JOIN
                         dbo.nt_1_companyparameters ON dbo.NT_1qryEInvoice.Company_Code = dbo.nt_1_companyparameters.Company_Code AND dbo.NT_1qryEInvoice.Year_Code = dbo.nt_1_companyparameters.Year_Code INNER JOIN
                         dbo.company ON dbo.NT_1qryEInvoice.Company_Code = dbo.company.Company_Code INNER JOIN
                         dbo.eway_bill ON dbo.NT_1qryEInvoice.Company_Code = dbo.eway_bill.Company_Code INNER JOIN
                         dbo.tbluser ON dbo.nt_1_companyparameters.Created_By = dbo.tbluser.User_Name
                 where dbo.NT_1qryEInvoice.Company_Code  = :companyCode and dbo.NT_1qryEInvoice.Year_Code = :yearCode and dbo.NT_1qryEInvoice.saleId = :saleId
                                 '''
            )
        additional_data = db.session.execute(text(query), {"companyCode": companyCode, "yearCode": yearCode, "saleId": saleId})

        additional_data_rows = additional_data.fetchall()
        
        all_data = [dict(row._mapping) for row in additional_data_rows]

        for data in all_data:
            if 'doc_date' in data and data['doc_date']:
                date_obj = datetime.strptime(data['doc_date'], "%d/%m/%Y")
                data['doc_date'] = date_obj.strftime("%Y-%m-%d")
            else:
                data['doc_date'] = None

        response = {
            "all_data": all_data
        }
        return jsonify(response), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error", "message": str(e)}), 500