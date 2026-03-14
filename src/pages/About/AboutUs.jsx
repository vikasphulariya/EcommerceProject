import React from "react";
import aboutUsImg from "../../assets/aboutUs.png";
function AboutUs({}) {
  return (
    <div className=" max-w-screen-md mt-2 w-full px-2">
      <div>
        <img src={aboutUsImg} />
      </div>
      <h1 className="text-3xl font-bold text-blue-800 mb-4 mt-4">Welcome to UniMart</h1>
      <p className="discription my-1 text-justify text-gray-700 leading-relaxed">
        <strong>UniMart</strong> is an innovative campus-based e-commerce platform built exclusively for students. We understand that college life requires constant access to books, notes, lab tools, and everyday essentials. UniMart bridges the gap by providing a trusted, centralized marketplace where students can easily <strong>buy, sell, and exchange</strong> items with their peers right on campus. Embodying our goal to make academic life more affordable and sustainable, our platform not only offers a seamless shopping experience but also fosters a dynamic community of students helping students.
      </p>
      <h3 className="text-xl font-semibold text-blue-800 mb-3 mt-6">
        UniMart's Core Features:
      </h3>
      <ul className="list-disc list-inside mb-5 flex flex-col gap-2 text-gray-700">
        <li><strong>Peer-to-Peer Marketplace:</strong> Buy and sell directly with students on your campus.</li>
        <li><strong>Academic Focused:</strong> A dedicated space for used textbooks, class notes, and lab equipment.</li>
        <li><strong>Hostel & Daily Needs:</strong> Find or sell appliances, bicycles, and furniture when moving in or out.</li>
        <li><strong>Verified Student Community:</strong> Safe transactions backed by mandatory academic profile completion.</li>
        <li><strong>Sustainable Solutions:</strong> Reduce waste by passing down educational materials to juniors.</li>
        <li><strong>Easy-to-use Interface:</strong> Designed specifically for fast, on-the-go mobile browsing between classes.</li>
      </ul>
    </div>
  );
}

export default AboutUs;

