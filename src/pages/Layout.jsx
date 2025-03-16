import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// Base component that maintains the navbar and footer throughout the page
export const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="mb-4">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};
