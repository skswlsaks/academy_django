import React from "react";
import "../../../assets/css/PDFViewer.css";
import MyPDFViewer from "../../../components/MyPDFViewer";

const Document = ({ doc }) => (
    <div className="pdf-wrapper flex-fill w-100">
        <MyPDFViewer src={doc}/>
    </div>
);

export default Document;
