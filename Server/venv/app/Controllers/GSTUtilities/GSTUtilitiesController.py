from app import app, db
from sqlalchemy.exc import SQLAlchemyError 
from sqlalchemy import text
from flask import jsonify, request
import os

API_URL = os.getenv('API_URL')

@app.route(API_URL+'/sales-gst-report', methods=['GET'])
def sales_gst_report():
    try:
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')

        if not from_date or not to_date:
            return jsonify({'error': 'from_date and to_date are required'}), 400

        with db.session.begin_nested():
            query = db.session.execute(text('''
                SELECT 
                    (CASE WHEN ISNULL(Carporate_Sale_No, 0) = 0 THEN Ac_Code ELSE carporate_ac END) AS Ac_Code,
                    (CASE WHEN ISNULL(Carporate_Sale_No, 0) = 0 THEN PartyName ELSE Ac_Name_E END) AS PartyName,
                    (CASE WHEN ISNULL(Carporate_Sale_No, 0) = 0 THEN [GSTIN/UIN of Recipient] ELSE LTRIM(RTRIM(Gst_No)) END) AS [GSTIN/UIN of Recipient],
                    (CASE WHEN ISNULL(Carporate_Sale_No, 0) = 0 THEN PartyStateCode ELSE ISNULL(NULLIF(CA_GSTStateCode, ''), 0) END) AS PartyStateCode,
                    'SB2024-25-' + CONVERT(NVARCHAR, doc_no) AS [Invoice Number],
                    REPLACE(CONVERT(CHAR(11), doc_date, 106), ' ', '-') AS [Invoice date],
                    [Invoice Value],
                    (CASE WHEN ISNULL(Carporate_Sale_No, 0) = 0 THEN [Place Of Supply] ELSE RIGHT('0' + CONVERT(NVARCHAR, CA_GSTStateCode), 2) + '-' + LTRIM(RTRIM(state_name)) END) AS [Place Of Supply],
                    'N' AS [Reverse Charge],
                    'Regular' AS [Invoice Type],
                    '' AS [E-Commerce GSTIN],
                    Rate,
                    [Taxable Value],
                    '' AS [Cess Amount]
                FROM qrysaleheadfor_GSTReturn
                WHERE doc_date >= '2017-07-01'
                    AND doc_date BETWEEN :from_date AND :to_date
                    AND IsDeleted != 0
                    AND Company_Code = 1
                    AND Year_Code = 3
                    AND UnregisterGST = 0
                    AND doc_no != 0
            '''), {'from_date': from_date, 'to_date': to_date})

            result = query.fetchall()

        response = [dict(row._asdict()) for row in result]

        return jsonify(response)

    except SQLAlchemyError as error:
        print("Error fetching data:", error)
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

#Sale Summary GST Report 
@app.route(API_URL+'/salebill-summary', methods=['GET'])
def SaleBill_Summary():
    try:
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        Company_Code = request.args.get('Company_Code')
        Year_Code = request.args.get('Year_Code')

        # Validate required parameters
        if not from_date or not to_date:
            return jsonify({'error': 'from_date and to_date are required'}), 400
        if not Company_Code or not Year_Code:
            return jsonify({'error': 'Company_Code and Year_Code are required'}), 400

        # Begin a nested transaction session
        with db.session.begin_nested():
            query = db.session.execute(text('''
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY doc_date) AS SR_No,
                    'SB' + CONVERT(NVARCHAR, doc_no) AS Invoice_No,
                    billtogstno AS PartyGSTNo,
                    Ac_Code AS PartyCode,
                    billtoname AS PartyName,
                    millshortname AS Mill_Name,
                    partygststatecode AS billtogststatecode,
                    CONVERT(VARCHAR(10), doc_date, 103) AS Invoice_Date,
                    LORRYNO AS Vehicle_No,
                    SUM(Quantal) AS Quintal,
                    CASE WHEN SUM(Quantal) <> 0 THEN SUM(item_Amount) / SUM(Quantal) ELSE 0 END AS Rate,
                    SUM(TaxableAmount) AS TaxableAmount,
                    SUM(CGSTAmount) AS CGST,
                    SUM(SGSTAmount) AS SGST,
                    SUM(IGSTAmount) AS IGST,
                    SUM(Bill_Amount) AS Payable_Amount,
                    DO_No,
                    ackno AS ACKNo
                FROM qrysalebillresgistersummary
                WHERE 
                    doc_no != 0 
                    AND doc_date BETWEEN :from_date AND :to_date
                    AND Company_Code = :Company_Code
                    AND Year_Code = :Year_Code
                    AND IsDeleted != 0
                GROUP BY 
                    doc_no, billtogstno, Ac_Code, billtoname, millshortname,
                    partygststatecode, doc_date, LORRYNO, DO_No, ackno
                ORDER BY doc_date
            '''), {
                'from_date': from_date,
                'to_date': to_date,
                'Company_Code': Company_Code,
                'Year_Code': Year_Code
            })

            # Fetch all results and map to dictionaries
            results = query.mappings().all()
            response_data = [dict(row) for row in results]

            return jsonify(response_data)

    except SQLAlchemyError as e:
        print(f"Error occurred: {e}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500