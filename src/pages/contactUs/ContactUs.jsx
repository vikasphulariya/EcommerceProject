import React, { useState } from "react";
import { BiPhone, BiMap, BiEnvelope, BiSend, BiLoaderAlt } from "react-icons/bi";
import { toast } from "react-toastify";

const ContactTile = ({ Icon, title, data, subtitle }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm font-bold text-gray-700">{data}</p>
      {subtitle && <p className="text-xs font-medium text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};

function ContactUs() {
  const [loading, setLoading] = useState(false);

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);

    formData.append("access_key", "d3b8b90e-c304-4a9d-82c3-11ac7fe2ee68");
    formData.append(
      "subject",
      `New Contact Query from UniMart by ${formData.get("name")}`
    );

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully! We will get back to you soon.");
        event.target.reset();
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16 min-h-screen">
      {/* Hero Section */}
      <div className="relative mb-16 overflow-hidden bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl text-center flex flex-col items-center">
        <div className="relative z-10 max-w-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white rotate-3 mb-6 shadow-xl">
            <BiEnvelope size={32} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 block">Get In Touch</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">We're Here to Help</h1>
          <p className="text-gray-400 font-medium max-w-lg">
            Whether you have a question about the marketplace, need support, or just want to share feedback, our team is ready to listen.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Information */}
        <div className="flex flex-col gap-6">
          <ContactTile
            Icon={BiMap}
            title="Campus Office"
            data="Student Union Building"
            subtitle="Room 402, North Campus"
          />
          <ContactTile
            Icon={BiEnvelope}
            title="Email Support"
            data="support@unimart.edu"
            subtitle="Usually replies within 2 hours"
          />
          <ContactTile
            Icon={BiPhone}
            title="Phone line"
            data="+1 (234) 567-890"
            subtitle="Mon-Fri, 9am - 5pm"
          />
        </div>

        {/* Contact Form Container */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/30">
            <div className="mb-10">
              <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">Send a Message</h3>
              <p className="text-gray-500 font-medium">Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form className="space-y-6" onSubmit={submitForm}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 block" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-colors"
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Rahul Sharma"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 block" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-colors"
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="rahul@college.edu"
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 block" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-3xl outline-none font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-colors min-h-[200px] resize-y custom-scrollbar"
                  id="message"
                  name="message"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading ? (
                    <>
                      <BiLoaderAlt className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <BiSend size={20} className="md:group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

