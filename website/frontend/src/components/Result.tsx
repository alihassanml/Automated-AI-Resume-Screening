import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Accordion } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
        const response = await fetch(`https://cafd-103-125-177-86.ngrok-free.app/results/${id}`, {
            method: "GET",
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setResumeData(result.result.clean_resume);
        setJobData(result.result.clean_job);
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

    const colors = ['#ADD8E6', '#87CEFA', '#00BFFF', '#1E90FF', '#4682B4'];
    const getColor = (index) => colors[index % colors.length];

    const lightColors = ['#AED6F1', '#A9DFBF', '#F9E79F', '#F5B7B1', '#D7BDE2'];
    const getLightColor = (index) => lightColors[index % lightColors.length];


    function formatResumeText(text: string) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const sections: { [key: string]: string[] } = {};

    let currentSection = 'General';
    lines.forEach(line => {
        if (/education/i.test(line)) currentSection = 'Education';
        else if (/experience|professional/i.test(line)) currentSection = 'Experience';
        else if (/skills?/i.test(line)) currentSection = 'Skills';
        else if (/projects?/i.test(line)) currentSection = 'Projects';
        else if (/summary/i.test(line)) currentSection = 'Summary';
        else if (/contact/i.test(line)) currentSection = 'Contact';

        if (!sections[currentSection]) sections[currentSection] = [];
        sections[currentSection].push(line);
    });

    return sections;
    }

    const formattedResume = formatResumeText(resumeData);




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
                                    <Accordion.Body className="according-body resume-text">
                                        {Object.entries(formattedResume).map(([section, content], idx) => (
                                            <div key={idx}>
                                            <h2 className="section-heading">📌 {section}</h2>
                                            <ul>
                                                {content.map((line, i) => (
                                                <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                            </div>
                                        ))}
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
                                        <Bar dataKey="value" barSize={70}>
                                            {skillChart.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getLightColor(index)} />
                                            ))}
                                        </Bar>
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
                                        <Pie
                                            data={skillAccuracy}
                                            dataKey="score"
                                            startAngle={180}
                                            endAngle={0}
                                            cx="50%"
                                            cy="90%"
                                            innerRadius="70%"
                                            outerRadius="100%"
                                        >
                                            {skillAccuracy.map((entry, index) => (
                                                <Cell key={`cell-pie-${index}`} fill={getLightColor(index)} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize={24}
                                            fill="#000000"
                                        >
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
                                        <XAxis dataKey="education" tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '…' : value} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" barSize={70}>
                                            {educationChart.map((entry, index) => (
                                                <Cell key={`cell-edu-${index}`} fill={getLightColor(index)} />
                                            ))}
                                        </Bar>
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
                                        <Pie
                                            data={jobAccuracy}
                                            dataKey="score"
                                            startAngle={180}
                                            endAngle={0}
                                            cx="50%"
                                            cy="90%"
                                            innerRadius="70%"
                                            outerRadius="100%"
                                            fill="#AED6F1" // light blue
                                        />
                                        <Tooltip />
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize={24}
                                            fill="#000000"
                                        >
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
                                        <XAxis dataKey="education" tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '…' : value} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" barSize={70} >
                                            {educationChart.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                            ))}
                                        </Bar>
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
                                        <Pie
                                            data={ResumeAccuracy}
                                            dataKey="score"
                                            startAngle={180}
                                            endAngle={0}
                                            cx="50%"
                                            cy="90%"
                                            innerRadius="70%"
                                            outerRadius="100%"
                                            fill="#ADD8E6" // light blue
                                        />
                                        <Tooltip />
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize={24}
                                            fill="#FFFFFF"
                                        >
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