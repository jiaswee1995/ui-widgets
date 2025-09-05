import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import MetaMaskLogin from "./components/MetaMaskLogin";
import TronLinkLogin from "./components/TronLinkLogin";

const App = () => {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <MetaMaskLogin
                    onSuccess={(account) => console.log("登录成功:", account)}
                    onError={(err) => console.error("登录失败:", err)}
                />
                <TronLinkLogin
                    onSuccess={(account) => console.log("登录成功:", account)}
                    onError={(err) => console.error("登录失败:", err)}
                />
            </div>
        </ConfigProvider>
    );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
