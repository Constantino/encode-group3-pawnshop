import { Menu } from "antd";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/wallet">
        <NavLink to="/wallet">Wallet</NavLink>
      </Menu.Item>
      <Menu.Item key="/nftBalance">
        <NavLink to="/nftBalance">NFTs</NavLink>
      </Menu.Item>
      <Menu.Item key="/lend">
        <NavLink to="/lend">Lend</NavLink>
      </Menu.Item>
      <Menu.Item key="/contract">
        <NavLink to="/contract">Contract</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
