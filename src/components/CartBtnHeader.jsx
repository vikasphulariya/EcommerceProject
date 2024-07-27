import { BiBasket } from "react-icons/bi";
import { useSelector } from "react-redux";
import { CustomProvider, Dropdown } from "rsuite";
import emptyCartAnimation from "../assets/emptyCartAnimation.json";
import Lottie from "react-lottie-player";
import CartProductCard from "./CartProductCard";
import { useNavigate } from "react-router";
function CartBtnHeader() {
  const productsFromCart = useSelector((state) => state.cart.products);
  const navigate = useNavigate();
  const cartBtnLogo = (props, ref) => (
    <button {...props} ref={ref} className="  h-full mt-2 text-3xl">
      <BiBasket />
      {productsFromCart.length > 0 && (
        <span className="text-blue-700 absolute  w-5 flex  justify-center h-5 bottom-1 font-semibold right-0 bg-orange-300  text-sm rounded-full">
          {productsFromCart.length}
        </span>
      )}
    </button>
  );
  return (
    <CustomProvider>
      <div className=" relative">
        <Dropdown
          placement="bottomEnd"
          noCaret
          menuStyle={{
            width: "15rem",
            marginTop: 5,
          }}
          renderToggle={cartBtnLogo}
        >
          {productsFromCart.length > 0 ? (
            <div className="pt-2 flex flex-col  ">
              {productsFromCart.map((item, index) => {
                return (
                  <CartProductCard key={index} product={item} from="cart" />
                );
              })}
              <Dropdown.Separator />
              <button onClick={()=>{
                navigate("/cart")
              }} className=" bg-orange-300 rounded-md py-1 mx-1 text-xl hover:bg-orange-500 text-blue-600 hover:text-blue-800 font-semibold">
                View Cart
              </button>
            </div>
          ) : (
            <div className=" p-2 flex justify-center flex-col items-center gap-2">
              <Lottie
                play
                loop
                animationData={emptyCartAnimation}
                style={{ alignSelf: "center" }}
              />
              <p>Nothing To Show</p>
            </div>
          )}
        </Dropdown>
      </div>
    </CustomProvider>
  );
}

export default CartBtnHeader;

