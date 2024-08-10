import React from "react";
import aboutUsImg from "../../assets/aboutUs.png";
function AboutUs({}) {
  return (
    <div className=" max-w-screen-md mt-2 w-full px-2">
      <div>
        <img src={aboutUsImg} />
      </div>
      <p className="discription my-1 text-justify">
        Noobie Store is an innovative online store that offers a diverse
        selection of digital gadgets, available for purchase in both cash and
        installment options. Embodying the motto &quot;Join the digital
        revolution today&quot; the website not only provides a seamless shopping
        experience but also features a captivating blog section filled with
        insightful reviews, articles, and videos about cutting-edge technology
        and digital gadgets. Users can actively engage with the content through
        comments and a question-answer section, fostering a dynamic community of
        tech enthusiasts.
      </p>
      <h3 className=" text-xl font-semibold mb-3 mt-2">
        Some of Noobie Store{"'"}s impressive features:
      </h3>
      <p className=" mb-5">

        <li>Diverse digital gadgets for purchase in cash or installments.</li>
        <li>
          A blog with reviews and articles about the latest technology and
          gadgets.
        </li>
        <li>User comments and Q&A section for community interaction.</li>
        <li>
          Represents a tech-savvy &quot;home&quot; with all necessary
          technology.
        </li>
        <li>Easy-to-use interface for a great user experience.</li>
        <li>Consistent and visually appealing design.</li>
        <li>A hub for tech enthusiasts to connect and share insights.</li>
        <li>Helps users make informed purchase decisions.</li>
      </p>
    </div>
  );
}

export default AboutUs;

