import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Spinner } from "react-bootstrap";
import axios from "axios";



const Main = () => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedJob, setUploadedJob] = useState(null);
  const [useDefaultJob, setUseDefaultJob] = useState(false); // New state for default job

  // Handle resume file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please Upload a Valid PDF!");
      setUploadedFile(null);
    }
  };

  // Handle job file upload
  const handleFileJob = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedJob(file);
    } else {
      alert("Please Upload a Valid PDF!");
      setUploadedJob(null);
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    setUseDefaultJob(!useDefaultJob);
    setUploadedJob(null); // Clear uploaded job if using default
  };

  // Handle file submission
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("resume", uploadedFile);
    if (useDefaultJob) {
      try {
        const response = await fetch("/job.pdf"); // Path in 'public' folder
        const blob = await response.blob();
        const defaultFile = new File([blob], "job.pdf", { type: "application/pdf" });
  
        formData.append("job", defaultFile);
      } catch (error) {
        alert("Error loading default job file!");
        return;
      }
    } else {
      formData.append("job", uploadedJob);
    }
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false);
      alert(response.data);
      console.log(response.data)
      handleClose(); // Close modal after success
    } catch (error) {
      setLoading(false);
      alert("Error! Try Again.");
    }
  };



  return (
    <>
      <Navbar className=" main-navbar">
        <Container>
          <Navbar.Brand  className="main-navbar-brand">
            <i className="fa-brands fa-hive pe-1"></i>
            <span style={{ fontWeight: "bold" }}>Resume Screening</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button className="me-1 main-nav-button">Login</Button>
            <Button className="main-nav-button-1" onClick={handleShow}>Get a Demo</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} sm={12} md={6} lg={6} className="p-4  text-left  main-1" style={{ border: "none !important" }}>
            <h1 className="main-heading">AI Resume Screening & Job
              Matching SaaS</h1>
            <p className="main-text">Automated AI Resume Screening & Job Matching SaaS is designed to
              streamline the hiring process for HR departments and recruitment
              agencies.By leveraging machine learning models, the system
              automatically scans resumes, extracts relevant information, and matches
              candidates to job descriptions based on skill relevance</p>
            <Button onClick={handleShow} className="main-nav-button-2"><i className="fa-solid fa-rocket me-1"></i>Get a Demo</Button>

          </Col>
          <Col xs={12} sm={12} md={6} lg={6} className="p-4 text-center  main-1" style={{ border: "none !important" }}>
            <Table className="mt-5">
              <tbody>
                <tr className="table-heading">
                  <td className="table-heading-color"> <li className="">Resume </li></td>
                  <td className="table-heading-color"> <li className="">Matching </li></td>
                  <td className="table-heading-color"> <li className="">Skill Score</li></td>
                  <td className="table-heading-color"> <li className="">Education </li></td>
                  <td className="table-heading-color"> <li className="">Predicting </li></td>

                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">Data Science</li></td>

                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">Data Science</li></td>


                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">HR</li></td>

                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">Hacking</li></td>

                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">HR</li></td>

                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">Java Dev</li></td>

                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">Python Dev</li></td>


                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">Machine Learning</li></td>

                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">Data Science</li></td>


                </tr>
                <tr>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon">a</li></td>
                  <td> <li className="space-icon-1">a</li></td>
                  <td> <li className="space-icon-2">Data Science</li></td>

                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose} centered >
      <Modal.Header closeButton className="me-2 pt-3">
        <h1 className="modal-title">Upload Resume & Job</h1>
      </Modal.Header>
      <Modal.Body>
        <div className="mt-3">
          {/* Resume Upload */}
          <Form.Group controlId="formFile">
            <Form.Label>Upload Resume file</Form.Label>
            <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
          </Form.Group>

          

          {/* Job Upload (Disabled if using Default Job) */}
          <Form.Group controlId="formFile" className="mt-4">
            <Form.Label className="form-label">Upload Job file</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={handleFileJob}
              disabled={useDefaultJob}
            />
          </Form.Group>


          {/* Checkbox for Default Job */}
          <Form.Group controlId="defaultJobCheckbox" className="mt-3">
            <Form.Check
              type="checkbox"
              label="Use Default Job"
              checked={useDefaultJob}
              onChange={handleCheckboxChange}
            />
          </Form.Group>

          {/* Upload Button */}
          <Button
            className="mt-3 upload-button"
            onClick={handleSave}
            disabled={!uploadedFile || (!useDefaultJob && !uploadedJob) || loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
    </>
  )
}

export default Main