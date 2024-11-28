from flask import request, jsonify
from app import db, app
from app.models.Inword.PurchaseBill.PurchaseBillModels import SugarPurchase
from app.models.Outword.SaleBill.SaleBillModels import SaleBillHead
from app.models.Transactions.UTR.UTREntryModels import UTRHead
from app.models.Transactions.ReceiptPayment.ReceiptPaymentModels import ReceiptPaymentHead
from sqlalchemy import and_ 

import os

API_URL = os.getenv('API_URL')

# Define model information for record locking.
MODEL_INFO = {
    "sugar_purchase": {"model": SugarPurchase, "filter_field": "doc_no"},
    "sugar_sale": {"model": SaleBillHead, "filter_field": "doc_no"},
    "utr_entry": {"model": UTRHead, "filter_field": "doc_no"},
    "journal_voucher": {"model": ReceiptPaymentHead, "filter_field": ["doc_no","tran_type"]},
}

#Locked-UnLocked record at the time of the multiple users edit the same record.
@app.route(API_URL + "/record-lock", methods=["PUT"])
def record_lock():
    try:
        record_id = request.args.get('id')  
        tran_type = request.args.get('tran_type')  

        if not record_id:
            return jsonify({"error": "Bad Request", "message": "ID is a required parameter"}), 400

        
        if tran_type:
            model_info = MODEL_INFO.get("journal_voucher")  
        else:
            
            model_info = MODEL_INFO.get("sugar_purchase")
            model_info = MODEL_INFO.get("sugar_sale")
            model_info = MODEL_INFO.get("utr_entry")  
            if not model_info:
                return jsonify({"error": "Internal Server Error", "message": "Model configuration missing"}), 500

        model_class = model_info["model"]
        filter_fields = model_info["filter_field"]

        query_conditions = []
        if isinstance(filter_fields, str):  
            query_conditions.append(getattr(model_class, filter_fields) == record_id)
        elif isinstance(filter_fields, list): 
            if "doc_no" in filter_fields:
                query_conditions.append(getattr(model_class, "doc_no") == record_id)
            if "tran_type" in filter_fields and tran_type:
                query_conditions.append(getattr(model_class, "tran_type") == tran_type)

        record = model_class.query.filter(and_(*query_conditions)).first()

        if not record:
            return jsonify({"error": "Not Found", "message": "Record not found"}), 404

        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Bad Request", "message": "Invalid or missing JSON data"}), 400

        # Update the record
        for key, value in data.items():
            setattr(record, key, value)

        db.session.commit()
        return jsonify({"message": "Record updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500