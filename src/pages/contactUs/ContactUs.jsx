import React from "react";
import { BsTelephone } from "react-icons/bs";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";

const ContactTile = ({ Icon, title, data }) => {
  return (
    <div className="flex flex-col items-center gap-1 text-center md:text-left">
      <Icon size={50} />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p>{data}</p>
    </div>
  );
};

function ContactUs() {
  const [result, setResult] = React.useState("");

  const submitForm = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "d3b8b90e-c304-4a9d-82c3-11ac7fe2ee68");

    formData.append(
      "subject",
      `New Contact Query from NoobStore by ${formData.get("name")}`
    );

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData, 
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  return (
    <div className="mx-auto self-center max-w-screen-lg p-4">
      <div className="flex flex-col md:flex-row flex-wrap justify-evenly mt-5 gap-4">
        <ContactTile
          Icon={FaMapMarkedAlt}
          title={"Office"}
          data={"123 Main Street, Anytown,USA"}
        />
        <ContactTile Icon={MdMail} title={"Email"} data={"Noobie@store.com"} />
        <ContactTile Icon={BsTelephone} title={"Phone"} data={"+91938593403"} />
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-6 mt-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Message Us</h3>
          <p className="text-justify">
            We're here to assist you every step of the way. Whether you have a
            question, need technical support, or simply want to share your
            feedback, our dedicated team is ready to listen and provide prompt
            assistance.
          </p>
        </div>
        <div className=" min-w-fit flex-grow gap-4">
          <form className="flex flex-col" onSubmit={submitForm}>
            <label className="block mb-2" htmlFor="name">
              Name:
              <input
                className="border w-full rounded-md px-2 py-1 mt-1"
                type="text"
                id="name"
                name="name"
                required
                placeholder="Name"
              />
            </label>
            <label className="block mb-2" htmlFor="email">
              Email:
              <input
                className="border w-full rounded-md px-2 py-1 mt-1"
                type="email"
                id="email"
                name="email"
                required
                placeholder="Email"
              />
            </label>
            <label className="block mb-2" htmlFor="message">
              Message:
              <textarea
                required
                className="border rounded-md px-2 py-1 mt-1 w-full h-32"
                id="message"
                name="message"
                placeholder="Message"
              />
            </label>
            <button
              type="submit"
              className=" self-end bg-blue-400 px-3 py-1 rounded-md hover:shadow-md hover:bg-blue-500 font-semibold text-xl"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

