import Navbar from 'react-bootstrap/Navbar';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Result = () => {

    const navigate = useNavigate();


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
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4   text-left " style={{ border: "none !important" }}>
                        <div className='result-resume'>

                            <h1 className="main-heading mt-4">Resume Screening </h1>
                            <p className="main-text">Automated AI Resume Screening & Job Matching SaaS is designed to
                                streamline the hiring process for HR departments and recruitment
                                agencies.By leveraging machine learning models, the system
                                automatically scans resumes, extracts relevant information, and matches
                                candidates to job descriptions based on skill relevance.
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias atque similique libero omnis error sapiente aliquam vero itaque beatae dicta, tempore recusandae fugiat aliquid doloribus dolor expedita minus numquam minima?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis temporibus harum maxime veritatis ex delectus, dignissimos sapiente a mollitia excepturi aperiam dolore, sunt voluptates placeat molestias laboriosam porro eius dolor?Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum labore eius aperiam at nam ut nulla. Quo ullam illo fuga quidem atque minus voluptates commodi non adipisci, distinctio nesciunt suscipit!Lorem</p>
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4 text-left" style={{ border: "none !important" }}>
                        <div className='result-resume'>
                            <h1 className="main-heading mt-3">Job Screening </h1>
                            <p className="main-text">Automated AI Resume Screening & Job Matching SaaS is designed to
                                streamline the hiring process for HR departments and recruitment
                                agencies.By leveraging machine learning models, the system
                                automatically scans resumes, extracts relevant information, and matches
                                candidates to job descriptions based on skill relevance</p>
                        </div>
                    </Col>
                </Row>
            </Container>



            {/* Skill Matching  */}

            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4   text-left  " style={{ border: "none !important" }}>
                        <div className='result-resume'>

                            <h1 className="main-heading mt-4">Skill's Matched</h1>
                            <p className="main-text">Automated AI Resume Screening & Job Matching SaaS is designed to
                                streamline the hiring process for HR departments and recruitment
                                agencies.By leveraging machine learning models, the system
                                automatically scans resumes, extracts relevant information, and matches
                                candidates to job descriptions based on skill relevance.
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias atque similique libero omnis error sapiente aliquam vero itaque beatae dicta, tempore recusandae fugiat aliquid doloribus dolor expedita minus numquam minima?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis temporibus harum maxime veritatis ex delectus, dignissimos sapiente a mollitia excepturi aperiam dolore, sunt voluptates placeat molestias laboriosam porro eius dolor?Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum labore eius aperiam at nam ut nulla. Quo ullam illo fuga quidem atque minus voluptates commodi non adipisci, distinctio nesciunt suscipit!Lorem</p>
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} className="p-4 text-left" style={{ border: "none !important" }}>
                        <div className='result-resume'>
                            <h1 className="main-heading mt-3">Job Screening </h1>
                            <p className="main-text">Automated AI Resume Screening & Job Matching SaaS is designed to
                                streamline the hiring process for HR departments and recruitment
                                agencies.By leveraging machine learning models, the system
                                automatically scans resumes, extracts relevant information, and matches
                                candidates to job descriptions based on skill relevance</p>
                        </div>
                    </Col>
                </Row>
            </Container>


        </>
    )
}

export default Result