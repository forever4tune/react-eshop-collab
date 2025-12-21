// import {useState } from 'react'
// import { Provider } from "react-redux";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MoveToTop from "./components/MoveToTop";
import Cart from "./components/Cart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllProducts from "./pages/AllProducts";
import AllCategories from "./pages/AllCategories";
import SingleProduct from "./pages/SingleProduct";
import SingleCategory from "./pages/SingleCategory";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/product/:productID" element={<SingleProduct />} />
        <Route path="/category/:slug" element={<SingleCategory />} />
      </Routes>
      <MoveToTop />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
