import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Accordion } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie } from "recharts";
import { useLocation } from "react-router-dom";
const Result = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id || 1;
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [resumeData, setResumeData] = useState("");
    const [jobData, setJobData] = useState("");
    const fetchResults = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/results/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
            setResumeData(result.result.clean_resume)
            setJobData(result.result.clean_job)
        } catch (err) {
            setError(err.message);
        }
    };
    useEffect(() => {
        fetchResults();
    }, [id]);
    const skillChart = data?.result?.matched_skills?.map((skill) => ({
        skill: skill,
        value: Math.floor(Math.random() * 100) + 10, // Generate random values for bars (replace this with actual data)
    }));
    const matchScore = data?.result?.job_skill_match_score
        ? parseFloat(data.result.job_skill_match_score.replace("%", ""))
        : null;
    const skillAccuracy = matchScore !== null ? [{ name: "Match Score", score: matchScore }] : [];
    const educationChart = data?.result?.resume_skills?.education?.Study?.map((education) => ({
        education: education,
        value: Math.floor(Math.random() * 100) + 10, // Generate random values for bars (replace this with actual data)
    }));
    const educationScore = data?.result?.job_education_match_score
        ? parseFloat(data.result.job_education_match_score.replace("%", ""))
        : null;
    const jobAccuracy = educationScore !== null ? [{ name: "Match Score", score: educationScore }] : [];
    const ResumeScore = data?.result?.job_resume_match_score
        ? parseFloat(data.result.job_resume_match_score.replace("%", ""))
        : null;
    const ResumeAccuracy = ResumeScore !== null ? [{ name: "Match Score", score: ResumeScore }] : [];
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
                        <Button className="me-1 main-nav-button-1" onClick={() => navigate("/")}>Home</Button>
                        <Button className=" main-nav-button">Login</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container fluid>
                <Row className="justify-content-center">
                    {/* Left Column - Resume Screening */}
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4 text-left">
                        <div className="result-resume-1">
                            <Accordion alwaysOpen defaultActiveKey={['0']}>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header className=''>
                                        <h1 className="main-heading-2 ">Resume Screening</h1>
                                    </Accordion.Header>
                                    <Accordion.Body className='according-body'>
                                        <p className="main-text">
                                            {resumeData}
                                        </p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </Col>
                    {/* Right Column - Job Screening */}
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4 text-left">
                        <div className="result-resume-1">
                            <Accordion defaultActiveKey={['1']}>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>
                                        <h1 className="main-heading-2 ">Job Screening</h1>
                                    </Accordion.Header>
                                    <Accordion.Body className='according-body'>
                                        <p className="main-text">
                                            {jobData}
                                        </p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Skill Matching  */}
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4   text-left  " style={{ border: "none !important" }}>
                        <div className='result-resume'>
                            <h1 className="main-heading-2 mt-4">Skill's Matched</h1>
                            <br />
                            {data && skillChart && (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={skillChart}>
                                        <XAxis dataKey="skill" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#007bff" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4 text-left" style={{ border: "none !important" }}>
                        <div className='result-resume'>
                            <h1 className="main-heading-2 mt-3">Matching Score </h1>
                            <br />
                            <br />
                            {data && skillAccuracy.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={skillAccuracy} dataKey="score" startAngle={180} endAngle={0}
                                            cx="50%" cy="90%" innerRadius="70%" outerRadius="100%" fill="#007bff" />
                                        <Tooltip />
                                        {/* Default value display */}
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={24} fill="#FFFFFF">
                                            {skillAccuracy[0].score}%
                                        </text>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>Loading chart...</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4   text-left  " style={{ border: "none !important" }}>
                        <div className='result-resume'>
                            <h1 className="main-heading-2 mt-4">Education (Field of study)</h1>
                            <br />
                            {data && educationChart && (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={educationChart}>
                                        <XAxis dataKey="education" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#007bff" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4 text-left" style={{ border: "none !important" }}>
                        <div className='result-resume'>
                            <h1 className="main-heading-2 mt-3">Matching Score </h1>
                            <br />
                            <br />
                            {data && jobAccuracy.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={jobAccuracy} dataKey="score" startAngle={180} endAngle={0}
                                            cx="50%" cy="90%" innerRadius="70%" outerRadius="100%" fill="#007bff" />
                                        <Tooltip />
                                        {/* Default value display */}
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={24} fill="#FFFFFF">
                                            {jobAccuracy[0].score}%
                                        </text>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>Loading chart...</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(data.result.job_resume_match_score, null, 2)}</pre> */}
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4   text-left  " style={{ border: "none !important" }}>
                        <div className='result-resume'>
                            <h1 className="main-heading-2 mt-4">Experience </h1>
                            <br />
                            {data && educationChart && (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={educationChart}>
                                        <XAxis dataKey="education" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#007bff" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4 text-left" style={{ border: "none !important" }}>
                        <div className='result-resume'>
                            <h1 className="main-heading-2 mt-3">Matching Score </h1>
                            <br />
                            <br />
                            {data && ResumeAccuracy.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={ResumeAccuracy} dataKey="score" startAngle={180} endAngle={0}
                                            cx="50%" cy="90%" innerRadius="70%" outerRadius="100%" fill="#007bff" />
                                        <Tooltip />
                                        {/* Default value display */}
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={24} fill="#FFFFFF">
                                            {ResumeAccuracy[0].score}%
                                        </text>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>Loading chart...</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Result