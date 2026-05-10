import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import Committee from "./pages/Committee";
import Members from "./pages/Members";
import { NewsPage, EventsPage } from "./pages/NewsEvents";
import Gallery from "./pages/Gallery";
import Donation from "./pages/Donation";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function PublicRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/members" element={<Members />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/*" element={<PublicRoutes />} />
              </Routes>
              <ThemeSwitcher />
              <Toaster position="top-right" richColors />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
