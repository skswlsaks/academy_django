import React from "react";

import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Footer from "../components/Footer";

const Dashboard = ({ children }) => (
    <React.Fragment>
        <div className="wrapper">
            <Sidebar />
            <Main>
                <Navbar />
                <Content>{children}</Content>
                <Footer />
            </Main>
        </div>
    </React.Fragment>
);

export default Dashboard;