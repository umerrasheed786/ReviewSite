import React, { useEffect, useState, useRef } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
  CContainer,
  CCardGroup,
} from "@coreui/react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { postHttpRequest } from "../../../axios/index";
import { toast } from "react-toastify";

const Comment = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [validated, setValidated] = useState(false);
  useEffect(() => {
    console.log("validated", validated);
  }, [validated]);
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
    //   setValidated(true);
      var editorContent = editorRef.current.editor.getData().trim();
      console.log("editorConten============", editorContent);
      if (editorContent === "") {
        setValidated(true);
        return;
      }
      return;
    }

    const commentData = {
      title,
      rating,
      content: editorContent,
      category,
    };

    postHttpRequest("v1/admin/review", commentData)
      .then((response) => {
        toast.success(response.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <h1>User Reviews</h1>
                    <CInputGroup className="mb-4">
                      <CFormInput
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CFormInput
                        id="title"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Enter Category"
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                      >
                        <option value="">Select rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </CInputGroup>
                    <CRow className="mb-4">
                      <CCol>
                        <CInputGroup className="mb-3">
                          <CKEditor
                            ref={editorRef}
                            editor={ClassicEditor}
                            data=""
                            // onReady={(editor) => {
                            //   // You can store the "editor" and use when it is needed.
                            //   console.log("Editor is ready to use!", editor);
                            // }}
                            // onChange={handleEditorChange}
                            // required
                            // onBlur={(event, editor) => {
                            //   console.log("Blur.", editor);
                            // }}
                            // onFocus={(event, editor) => {
                            //   console.log("Focus.", editor);
                            // }}
                          />
                        </CInputGroup>
                        {validated &&
                          editorRef.current &&
                          editorRef.current.editor.getData().trim() === "" && (
                            <div className="invalid-feedback">
                              Content is required.
                            </div>
                          )}
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs={6} className="text-right">
                        <CButton color="primary" type="submit">
                          Submit
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Comment;
