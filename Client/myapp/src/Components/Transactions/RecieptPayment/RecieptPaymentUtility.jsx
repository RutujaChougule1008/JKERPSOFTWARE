import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Grid,
    Paper,
} from "@mui/material";
import Pagination from "../../../Common/UtilityCommon/Pagination";
import SearchBar from "../../../Common/UtilityCommon/SearchBar";
import PerPageSelect from "../../../Common/UtilityCommon/PerPageSelect";
import axios from "axios";

const API_URL = process.env.REACT_APP_API;

const Year_Code = sessionStorage.getItem("Year_Code");
const companyCode = sessionStorage.getItem("Company_Code");

function RecieptPaymentUtility() {
    const [fetchedData, setFetchedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tranType, setTranType] = useState("CP"); 
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!tranType) return; 

        const fetchData = async () => {
            setIsLoading(true); 
            try {
                const offset = (currentPage - 1) * perPage; 
                const apiUrl = `${API_URL}/getdata-receiptpayment?Company_Code=${companyCode}&Year_Code=${Year_Code}&tran_type=${tranType}&perPage=${perPage}&offset=${offset}`;
                const response = await axios.get(apiUrl);

                if (response.data && Array.isArray(response.data.all_data_receiptpayment)) {
                    setFetchedData(response.data.all_data_receiptpayment);
                    setFilteredData(response.data.all_data_receiptpayment);
                } else {
                    console.error("Unexpected response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false); 
            }
        };

        fetchData();
    }, [tranType, perPage, currentPage]);

    // Filter data based on the search term
    useEffect(() => {
        const filtered = fetchedData.filter((post) => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                String(post.doc_no || "").toLowerCase().includes(searchTermLower) ||
                String(post.tran_type || "").toLowerCase().includes(searchTermLower) ||
                String(post.doc_date || "").toLowerCase().includes(searchTermLower) ||
                String(post.bank_name || "").toLowerCase().includes(searchTermLower) ||
                String(post.amount || "").toLowerCase().includes(searchTermLower) ||
                String(post.credit_ac || "").toLowerCase().includes(searchTermLower) ||
                String(post.creditacname || "").toLowerCase().includes(searchTermLower) ||
                String(post.narration || "").toLowerCase().includes(searchTermLower)
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, fetchedData]);

    const handleTranTypeChange = (event) => {
        setTranType(event.target.value);
        setCurrentPage(1);
    };

    const handlePerPageChange = (event) => {
        setPerPage(Number(event.target.value)); 
        setCurrentPage(1);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const pageCount = Math.ceil(filteredData.length / perPage);

    const paginatedPosts = filteredData.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleClick = () => {
        navigate("/receipt-payment", { state: { tranType } });
    };

    const handleRowClick = (tranid) => {
        const selectedRecord = fetchedData.find(
            (record) => record.tranid === tranid
        );
        navigate("/receipt-payment", { state: { selectedRecord } });
    };

    const handleBack = () => {
        navigate("/DashBoard");
    };

    return (
        <div className="App container">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        style={{ marginTop: "20px" }}
                        onClick={handleClick}
                        disabled={!tranType} 
                    >
                        Add
                    </Button>
                    <Button
                        variant="contained"
                        style={{ marginTop: "20px", marginLeft: "10px" }}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <select
                        id="tran_type"
                        name="tran_type"
                        value={tranType}
                        onChange={handleTranTypeChange}
                        className="form-select mb-3"
                        style={{ marginTop: "-20px", marginLeft: "10px", width: "300px" }}
                    >
                        <option value="">Select Transaction Type</option>
                        <option value="CP">Cash Payment</option>
                        <option value="CR">Cash Receipt</option>
                        <option value="BP">Bank Payment</option>
                        <option value="BR">Bank Receipt</option>
                    </select>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <SearchBar
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <PerPageSelect value={perPage} onChange={handlePerPageChange} />
                </Grid>

                <Grid item xs={12}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <Paper elevation={3}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Doc No</TableCell>
                                            <TableCell>Tran Type</TableCell>
                                            <TableCell>Doc Date</TableCell>
                                            <TableCell>Bank Name</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Credit Code</TableCell>
                                            <TableCell>Credit Name</TableCell>
                                            <TableCell>Narration</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedPosts.map((post) => (
                                            <TableRow
                                                key={post.tranid}
                                                onDoubleClick={() => handleRowClick(post.tranid)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <TableCell>{post.doc_no || "N/A"}</TableCell>
                                                <TableCell>{post.tran_type || "N/A"}</TableCell>
                                                <TableCell>{post.doc_date || "N/A"}</TableCell>
                                                <TableCell>{post.bank_name || "N/A"}</TableCell>
                                                <TableCell>{post.amount || "N/A"}</TableCell>
                                                <TableCell>{post.credit_ac || "N/A"}</TableCell>
                                                <TableCell>{post.creditacname || "N/A"}</TableCell>
                                                <TableCell>{post.narration || "N/A"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Pagination
                        pageCount={pageCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default RecieptPaymentUtility;
