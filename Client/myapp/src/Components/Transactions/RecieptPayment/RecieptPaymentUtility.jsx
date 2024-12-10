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
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
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
    }, [searchTerm, fetchedData]);

    const handleTranTypeChange = (event) => {
        setTranType(event.target.value);
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
        <Grid container spacing={3} sx={{ padding: 2 }}>
            <Grid item xs={12} sm={2} display="flex" gap={2}>
                <Button variant="contained" onClick={handleClick} disabled={!tranType}>
                    Add
                </Button>
                <Button variant="contained" onClick={handleBack}>
                    Back
                </Button>
                <Grid item xs={12} sm={6}>
                <PerPageSelect value={perPage} onChange={handlePerPageChange} />
            </Grid>

            <Grid item xs={10} sm={6}>
                <FormControl >
                    <Select
                        value={tranType}
                        onChange={handleTranTypeChange}
                    >
                        <MenuItem value="CP">Cash Payment</MenuItem>
                        <MenuItem value="CR">Cash Receipt</MenuItem>
                        <MenuItem value="BP">Bank Payment</MenuItem>
                        <MenuItem value="BR">Bank Receipt</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            </Grid>
            <Grid item xs={10} sm={8}>
                <SearchBar value={searchTerm} onChange={handleSearchTermChange} />
            </Grid>

            <Grid item xs={12}>
                {isLoading ? (
                    <Grid container justifyContent="center">
                        <CircularProgress />
                    </Grid>
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
    );
}

export default RecieptPaymentUtility;
