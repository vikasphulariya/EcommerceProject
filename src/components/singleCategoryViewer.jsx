/* eslint-disable react/prop-types */

import { MdArrowForwardIos } from "react-icons/md";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../app/firebase/firebase";
import { toast } from "react-toastify";

function SingleCategoryViewer({ sectionTtile, products }) {
  const Productes = [
    // Mobiles
    {
      brand: "Samsung",
      rating: 4.5,
      orders: 1200,
      seller: "Samsung Store",
      warranty: "1 year",
      category: "Mobiles",
      tags: ["smartphone", "android", "galaxy"],
      id: "2sdcsd",
      name: "Samsung Galaxy S20",
      price: 1000,
      discountPrice: 800,
      imgUrl:
        "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1715785282/Croma%20Assets/Communication/Mobiles/Images/268867_0_sstd64.png?tr=w-600",
    },
    {
      brand: "Apple",
      rating: 4.8,
      orders: 950,
      seller: "Apple Store",
      warranty: "1 year",
      category: "Mobiles",
      tags: ["smartphone", "ios", "iphone"],
      id: "3fhj45",
      name: "iPhone 13 Pro",
      price: 1200,
      discountPrice: 1100,
      imgUrl:
        "https://rukminim2.flixcart.com/image/850/1000/ktketu80/mobile/8/z/w/iphone-13-mlph3hn-a-apple-original-imag6vzzhrxgazsg.jpeg?q=90&crop=false",
    },
    {
      brand: "Google",
      rating: 4.4,
      orders: 800,
      seller: "Google Store",
      warranty: "1 year",
      category: "Mobiles",
      tags: ["smartphone", "android", "pixel"],
      id: "4ghj67",
      name: "Google Pixel 6",
      price: 900,
      discountPrice: 850,
      imgUrl:
        "https://5.imimg.com/data5/ECOM/Default/2023/1/MC/AK/WI/47699750/ggu1894wmnh3muuoxoftqjmec3ld9od7twonj3mf-500x500.jpg",
    },

    // TV
    {
      brand: "Sony",
      rating: 4.3,
      orders: 800,
      seller: "Sony Store",
      warranty: "2 years",
      category: "TV",
      tags: ["television", "smart tv", "4k"],
      id: "9dfg67",
      name: "Sony Bravia 55 inch",
      price: 1500,
      discountPrice: 1300,
      imgUrl:
        "https://m.media-amazon.com/images/I/915+sXcUY+L._AC_UF1000,1000_QL80_.jpg",
    },
    {
      brand: "Samsung",
      rating: 4.6,
      orders: 600,
      seller: "Samsung Store",
      warranty: "2 years",
      category: "TV",
      tags: ["television", "smart tv", "4k"],
      id: "5sdfe8",
      name: "Samsung QLED 65 inch",
      price: 2000,
      discountPrice: 1800,
      imgUrl: "https://m.media-amazon.com/images/I/71RxCmvnrbL.jpg",
    },
    {
      brand: "LG",
      rating: 4.2,
      orders: 500,
      seller: "LG Store",
      warranty: "2 years",
      category: "TV",
      tags: ["television", "smart tv", "oled"],
      id: "7hjd56",
      name: "LG OLED 55 inch",
      price: 1800,
      discountPrice: 1600,
      imgUrl:
        "https://www.lg.com/content/dam/channel/wcms/in/images/tvs/43ur8020psb_atr_eail_in_c/gallery/43UR8020PSB%20-D-01.jpg",
    },

    // Computers
    {
      brand: "HP",
      rating: 4.4,
      orders: 500,
      seller: "HP Store",
      warranty: "1 year",
      category: "Computers",
      tags: ["laptop", "tech"],
      id: "4ghj89",
      name: "HP Pavilion 15",
      price: 800,
      discountPrice: 750,
      imgUrl: "https://5.imimg.com/data5/NW/KV/MY-32712236/hp-laptop.jpg",
    },
    {
      brand: "Dell",
      rating: 4.3,
      orders: 700,
      seller: "Dell Store",
      warranty: "1 year",
      category: "Computers",
      tags: ["laptop", "tech"],
      id: "3cgj56",
      name: "Dell XPS 13",
      price: 1000,
      discountPrice: 950,
      imgUrl:
        "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/14-9440/media-gallery/notebook-xps-14-9440t-sl-gallery-9.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=639&qlt=100,1&resMode=sharp2&size=639,402&chrss=full",
    },
    {
      brand: "Lenovo",
      rating: 4.2,
      orders: 600,
      seller: "Lenovo Store",
      warranty: "1 year",
      category: "Computers",
      tags: ["laptop", "tech"],
      id: "8lkd78",
      name: "Lenovo ThinkPad X1",
      price: 1200,
      discountPrice: 1100,
      imgUrl:
        "https://p2-ofp.static.pub/fes/cms/2022/12/12/9kjt5cs3u09kcwmuddq4ftf6ovsegz091810.png",
    },

    // Printers
    {
      brand: "HP",
      rating: 4.5,
      orders: 300,
      seller: "HP Store",
      warranty: "1 year",
      category: "Printer",
      tags: ["printer", "tech"],
      id: "6fgj78",
      name: "HP LaserJet Pro",
      price: 200,
      discountPrice: 180,
      imgUrl:
        "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/z/cz175a_front.png",
    },
    {
      brand: "Canon",
      rating: 4.4,
      orders: 250,
      seller: "Canon Store",
      warranty: "1 year",
      category: "Printer",
      tags: ["printer", "tech"],
      id: "7hjk89",
      name: "Canon PIXMA",
      price: 150,
      discountPrice: 130,
      imgUrl:
        "https://rehancomputers.in/wp-content/uploads/2021/01/canon-printer-G3010-wifi.jpeg",
    },
    {
      brand: "Epson",
      rating: 4.3,
      orders: 200,
      seller: "Epson Store",
      warranty: "1 year",
      category: "Printer",
      tags: ["printer", "tech"],
      id: "8lkm90",
      name: "Epson EcoTank",
      price: 250,
      discountPrice: 230,
      imgUrl:
        "https://mediaserver.goepson.com/ImConvServlet/imconv/550240f88671c55fe1e1aca93b5832ffcacf5918/1200Wx1200H?use=banner&hybrisId=B2C&assetDescr=L360_550px_X_310px",
    },
  ];

  const CategoryList = [
    {
      name: "tech Accessories",
      image: "https://static.thenounproject.com/png/639882-200.png",
    },
    {
      name: "Camera",
      image:
        "https://static-00.iconduck.com/assets.00/camera-icon-512x417-vgmhgbfy.png",
    },
    {
      name: "Computers",
      image:
        "https://images.vexels.com/media/users/3/157345/isolated/lists/934008c8466ce089e15947cec0a7c61d-flat-laptop-icon-laptop.png",
    },
    {
      name: "Mobiles",
      image: "https://cdn-icons-png.flaticon.com/512/65/65756.png",
    },
    {
      name: "SmartWatches",
      image: "https://www.svgrepo.com/show/1756/smartwatch.svg",
    },
    {
      name: "TV",
      image:
        "https://icons.veryicon.com/png/o/internet--web/line-style-digital-correlation/tv-27.png",
    },
    {
      name: "Washing Machine",
      image: "https://cdn-icons-png.flaticon.com/512/125/125652.png",
    },
    {
      name: "Printer",
      image: "https://cdn-icons-png.flaticon.com/512/4020/4020167.png",
    },
  ];


  useEffect(()=>{
    uploadProducts()
    
  })

  const ids=new Set([]);
  const uploadProducts=async()=>{
    Productes.forEach(async(item)=>{
      if(!ids.has(item.id)){
        ids.add(item.id);
        console.log(item.id)
        // await setDoc(doc(db,"products",item.id),item).then(()=>{toast("Item added SuccessFully")})
      }
    })
  }

  return (
    <div>
      <div className="w-full flex justify-between pr-3 pb-2 border-b-2">
        <h3 className=" text-xl">{sectionTtile}</h3>
        <Link
          to={`/${sectionTtile}`}
          className=" flex items-center hover:text-blue-600 transition-colors  "
        >
          View All <MdArrowForwardIos className=" inline" />{" "}
        </Link>
      </div>
      <div className="products py-3">
        <div className="products flex gap-2 justify-evenly overflow-scroll no-scrollbar">
          {Productes.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default SingleCategoryViewer;

