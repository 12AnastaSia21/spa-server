import DataTable from "./DataTable";
import Logout from "./Logout";
import "./MainPage.css"

export default function MainPage() {
  return (
    <div className="main-page">
      <Logout />
      <DataTable />
    </div>
  );
}
