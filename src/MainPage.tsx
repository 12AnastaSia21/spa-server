import DataTable from "./DataTable";
import Footer from "./Footer";
import Logout from "./Logout";
import "./MainPage.css";

export default function MainPage() {
  return (
    <div className="main-page">
      <Logout />
      <DataTable />
      <Footer />
    </div>
  );
}