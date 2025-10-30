import Navbar from "@/components/site/Navbar";

export default function MarketingLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
