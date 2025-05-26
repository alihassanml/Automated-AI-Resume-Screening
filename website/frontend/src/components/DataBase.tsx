import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import { useNavigate } from "react-router-dom";

const DataBase = () => {

    const navigate = useNavigate();

    const [results, setResults] = useState([]);

   useEffect(() => {
    fetch("http://127.0.0.1:8000/all_result", {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch results");
            }
            return response.json();
        })
        .then((data) => {
            setResults(data);
        })
        .catch((err) => {
            alert(err.message);
        });
}, []);




    return (
        <>
            <Navbar className=" main-navbar">
                <Container>
                    <Navbar.Brand className="main-navbar-brand">
                        <i className="fa-brands fa-hive pe-1"></i>
                        <span style={{ fontWeight: "bold" }}>Resume Screening</span>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Button className="me-1 main-nav-button" onClick={() => navigate("/")}>Home</Button>
                        <Button className="main-nav-button-1" onClick={() => navigate("/")} >Get a Demo</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <h1 className="main-heading" style={{ width: "50%", marginLeft: "40px" }}>AI Resume Screening & Job
                Matching SaaS</h1>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} sm={12} md={12} lg={12} className="p-4 text-center  main-1" style={{ border: "none !important" }}>
                        <Table className="mt-5">
                            <tbody>
                                <tr className="table-heading">
                                    <td className="table-heading-color"> <li className="">Resume </li></td>
                                    <td className="table-heading-color"> <li className="">Name </li></td>
                                    <td className="table-heading-color"> <li className="">Skill Score </li></td>
                                    <td className="table-heading-color"> <li className="">Education Score</li></td>
                                    <td className="table-heading-color"> <li className="">Experience Score</li></td>
                                    <td className="table-heading-color"> <li className="">Rank </li></td>
                                    <td className="table-heading-color"> <li className="">Predicting </li></td>
                                </tr>
                                {results.map((result) => {
                                    const rankPercentage = parseFloat(result.rank); // Convert "75%" -> 75
                                    const parsedResult = JSON.parse(result.result_json);
                                    return (
                                        <tr key={result.id}>
                                            <td>
                                                <li className="space-icon-3">{result.id}</li>
                                            </td>
                                            <td>
                                                <li className="space-icon-3">{result.name}</li>
                                            </td>
                                            <td>
                                                <li className="space-icon-3">{parsedResult.job_skill_match_score}</li>
                                            </td>
                                            <td>
                                                <li className="space-icon-3">{parsedResult.job_education_match_score}</li>
                                            </td>
                                            <td>
                                                <li className="space-icon-3">{parsedResult.job_experience_match_score}</li>
                                            </td>
                                            <td>
                                                <li className="space-icon-3">
                                                    <div className="relative w-full bg-gray-200 rounded-md h-3">
                                                        <div
                                                            className="bg-dark-500  rounded-md text-center text-white text-xs"
                                                            style={{ backgroundColor: " rgb(42, 163, 102)", color: "white", borderRadius: "20px", height: "20px", }}
                                                        >
                                                            {result.rank}
                                                        </div>
                                                    </div>
                                                </li>
                                            </td>

                                            <td>
                                                <li className="space-icon-2">{parsedResult.resume_related_to}</li>
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            {/* <tr  className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{result.id}</td>
              <td className="border border-gray-300 px-4 py-2">{result.name}</td>
              <td className="border border-gray-300 px-4 py-2">{result.rank}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => alert(JSON.stringify(result, null, 2))}
                >
                  View Details
                </button>
              </td>
            </tr> */}

        </>
    )
}

export default DataBase