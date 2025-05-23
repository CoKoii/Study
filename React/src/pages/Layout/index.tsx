import { Outlet } from "react-router-dom";
import { Button } from "antd-mobile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getBillList } from "@/store/modules/billStore";
const Layout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBillList());
  }, [dispatch]);
  return (
    <div>
      <Outlet />
      我是layout
      <Button color="primary">click</Button>
      <div className="purple">
        <Button color="primary">click</Button>
      </div>
    </div>
  );
};
export default Layout;
