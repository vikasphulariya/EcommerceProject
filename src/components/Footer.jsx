
import { BiCopyright } from "react-icons/bi";
import {
  IoCallOutline,
  IoLocationOutline,
  IoMailOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-blue-800 w-full flex flex-col relative bottom-0 ">
      <div className="flex flex-row pt-8 flex-wrap gap-3 justify-between pb-4 px-3 min-[320px]:px-3 min-[450px]:px-5 sm:px-7 md:px-10 lg:px-14  ">
        <div>
          <h3 className="text-white text-xl">Company</h3>
          <ul className="flex flex-col items-start text-base">
            <Link className="text-gray-200 text-center ">About Us</Link>
            <Link className="text-gray-200 text-center ">Blog</Link>
            <Link className="text-gray-200 text-center ">Returns</Link>
            <Link className="text-gray-200 text-center ">Order Status</Link>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-xl">Info</h3>
          <ul className="flex flex-col items-start text-base">
            <Link className="text-gray-200 text-center ">How It Works</Link>
            <Link className="text-gray-200 text-center ">Our Promises</Link>
            <Link className="text-gray-200 text-center ">FAQ</Link>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-xl">Contact-Us</h3>
          <ul className="flex flex-col items-start text-base ">
            <Link className="text-gray-200 text-center gap-1 flex items-center ">
              <IoLocationOutline /> Address
            </Link>
            <Link className="text-gray-200 text-center gap-1 flex items-center">
              <IoCallOutline /> Our Promises
            </Link>
            <Link className="text-gray-200 text-center gap-1 flex items-center ">
              <IoMailOutline /> FAQ
            </Link>
          </ul>
        </div>
      </div>
      <div className="bg-blue-900 text-gray-200 py-2 flex justify-between  px-3 min-[320px]:px-3 min-[450px]:px-5 sm:px-7 md:px-10 lg:px-14  ">
        <div className="copyright flex items-center gap-1">
          <BiCopyright /> 2024 Vikas Phulriya
        </div>
        <div>
          <ul className="flex gap-3">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;

