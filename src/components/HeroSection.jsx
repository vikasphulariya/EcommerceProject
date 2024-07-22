import Carousal from "./Carousal";

function HeroSection() {
  return (
    <div>
      <Carousal autoSlide={true}>
        <img
          className="object-contain"
          src="https://www.liqo.in/wp-content/uploads/2024/01/LIQO-Clearance-sale-banner.jpg"
          alt="d"
        />
        <img
          src="https://www.reliancedigital.in/medias/Midnight-Sale-Banner-New.jpg?context=bWFzdGVyfGltYWdlc3wxMjQ2MDV8aW1hZ2UvanBlZ3xpbWFnZXMvaDBmL2hmNi8xMDExMDU5MDc0NjY1NC5qcGd8NzY5ZGIzNjVlZDdiMWIxYWE2NmE1YjQ2YzUyZDQ5NWRjNDA5YmUzNzA2ZTNmYzcxNmE4ZjZkZGE4YmNjMTJkZQ"
          alt="d"
        />
        <img
          src="https://cdn.shopclues.com/images/banners/2024/Apr/18/RefurbSmartphones_Web_18Apr24.jpg"
          alt="d"
        />
        <img
          src="https://cdn.shopclues.com/images/banners/2024/Apr/25/HB_Superdeal_Web_26Apr24.jpg"
          alt="d"
        />
      </Carousal>
    </div>
  );
}

export default HeroSection;

