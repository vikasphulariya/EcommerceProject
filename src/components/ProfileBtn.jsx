import { BiUser } from "react-icons/bi";
import { CustomProvider, Dropdown, IconButton } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

import { auth } from "../app/firebase/firebase";
import {  Link } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";
import { LiaShippingFastSolid } from "react-icons/lia";
import { IoMdLogOut } from "react-icons/io";
import { BsCart3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../app/store/userSlice";
import { toast } from "react-toastify";
function ProfileBtn() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const logout = async () => {
    await auth.signOut().then(() => {
      dispatch(removeUser());
      toast("Log Out Successfull");
    });
  };

  const renderIconButton = (props, ref) => {
    return <IconButton {...props} ref={ref} icon={<BiUser />} circle />;
  };

  return (
    <CustomProvider theme="light">
      <Dropdown
        noCaret
        menuStyle={{
          width: "10rem",
          marginTop: 5,
          flex: "display",
          gap: "3px",
        }}
        renderToggle={renderIconButton}
        placement="bottomEnd"
      >
        {user ? (
          <>
            <Dropdown.Item eventKey="1" icon={<BiUser />}>
              <Link to="/profile"> Profile</Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="1" icon={<GoHeartFill color="red" />}>
              <Link to="/profile">WishList</Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="1" icon={<LiaShippingFastSolid />}>
              <Link to="/profile">Orders</Link>
            </Dropdown.Item>
            <Dropdown.Item eventKey="1" icon={<BsCart3 />}>
              <Link to="/profile">Cart</Link>
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item
              className=" text-red-800"
              icon={<IoMdLogOut />}
              eventKey="1"
              onClick={logout}
            >
              LogOut
            </Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item panel={true}>
              <Link
                className=" block  my-1 items-center text-center bg-blue-500 hover:text-white font-semibold  hover:bg-blue-800 px-3 rounded-md mx-2 "
                to="/login"
              >
                Login
              </Link>
            </Dropdown.Item>
            <Dropdown.Item panel={true}>
              <Link
                className=" block my-1  items-center text-center bg-orange-500 hover:text-white font-semibold  hover:bg-orange-800 px-3 rounded-md mx-2 "
                to="/register"
              >
                Register
              </Link>
            </Dropdown.Item>
          </>
        )}
      </Dropdown>
    </CustomProvider>
  );
}

export default ProfileBtn;

