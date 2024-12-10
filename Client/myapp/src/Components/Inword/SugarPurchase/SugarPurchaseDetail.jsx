import React from "react";
import { Grid, FormControl, InputLabel, TextField } from "@mui/material";
import SystemHelpMaster from "../../../Helper/SystemmasterHelp";
import BrandMasterHelp from "../../../Helper/BrandMasterHelp";

const SugarPurchaseDetail = ({
  show,
  onClose,
  selectedUser,
  formDataDetail,
  handleChangeDetail,
  handleItemSelect,
  handleBrandCode,
  itemNameLabel,
  itemSelect,
  brandName,
  brandCode,
  addUser,
  updateUser,
  isEditing,
  addOneButtonEnabled,
}) => {
  if (!show) return null;

  return (
    <div className="modal" role="dialog" style={{ display: "block" }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {selectedUser.id ? "Update Sugar Purchase" : "Add Sugar Purchase"}
            </h5>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{ marginLeft: "80%", width: "60px", height: "30px" }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <label htmlFor="Item Name">Item Name :</label>
                  <FormControl fullWidth variant="outlined" size="small">
                    <SystemHelpMaster
                      onAcCodeClick={handleItemSelect}
                      CategoryName={itemNameLabel}
                      CategoryCode={itemSelect}
                      name="Item_Select"
                      SystemType="I"
                      className="account-master-help"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <label htmlFor="Brand Code">Brand Code :</label>
                  <FormControl fullWidth variant="outlined" size="small">
                    <BrandMasterHelp
                      onAcCodeClick={handleBrandCode}
                      CategoryName={brandName}
                      CategoryCode={brandCode}
                      name="Brand_Code"
                      className="account-master-help"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: "16px" }}>
                <Grid item xs={4}>
                  <InputLabel htmlFor="Quantal">Quantal:</InputLabel>
                  <TextField
                    id="Quantal"
                    type="text"
                    fullWidth
                    size="small"
                    name="Quantal"
                    autoComplete="off"
                    value={formDataDetail.Quantal}
                    onChange={handleChangeDetail}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel htmlFor="Packing">Packing:</InputLabel>
                  <TextField
                    id="Packing"
                    type="text"
                    fullWidth
                    size="small"
                    name="packing"
                    autoComplete="off"
                    value={formDataDetail.packing}
                    onChange={handleChangeDetail}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel htmlFor="Bags">Bags:</InputLabel>
                  <TextField
                    id="Bags"
                    type="text"
                    fullWidth
                    size="small"
                    name="bags"
                    autoComplete="off"
                    value={formDataDetail.bags}
                    onChange={handleChangeDetail}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: "16px" }}>
                <Grid item xs={4}>
                  <InputLabel htmlFor="Rate">Rate:</InputLabel>
                  <TextField
                    id="Rate"
                    type="text"
                    fullWidth
                    size="small"
                    name="rate"
                    autoComplete="off"
                    value={formDataDetail.rate || ""}
                    onChange={handleChangeDetail}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel htmlFor="Item Amount">Item Amount:</InputLabel>
                  <TextField
                    id="Item Amount"
                    type="text"
                    fullWidth
                    size="small"
                    name="item_Amount"
                    autoComplete="off"
                    value={formDataDetail.item_Amount}
                    onChange={handleChangeDetail}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel htmlFor="Narration" style={{ fontWeight: "bold" }}>
                    Narration:
                  </InputLabel>
                  <TextField
                    id="Narration"
                    name="narration"
                    value={formDataDetail.narration}
                    onChange={handleChangeDetail}
                    autoComplete="off"
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    disabled={!isEditing && addOneButtonEnabled}
                  />
                </Grid>
              </Grid>
            </form>
          </div>
          <div className="modal-footer">
            {selectedUser.id ? (
              <button
                className="btn btn-primary"
                onClick={updateUser}
                onKeyDown={(event) => {
                  if (event.key === 13) updateUser();
                }}
              >
                Update
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={addUser}
                onKeyDown={(event) => {
                  if (event.key === 13) addUser();
                }}
              >
                Add
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              onKeyDown={(event) => {
                if (event.key === 13) onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SugarPurchaseDetail;
