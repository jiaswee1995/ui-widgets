import React, { useState, useEffect } from "react";
import { Button, Card, Typography, message, Space, Avatar, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { TronLinkAdapter } from "@tronweb3/tronwallet-adapter-tronlink";
import {
    WalletReadyState,
    WalletNotFoundError,
} from "@tronweb3/tronwallet-abstract-adapter";

const { Title, Text } = Typography;

// ✅ 保证全局只有一个 Adapter 实例
const adapter = new TronLinkAdapter();

// ✅ 防止重复调用 connect
let isConnecting = false;

interface Props {
    onSuccess?: (account: string) => void;
    onError?: (error: any) => void;
}

const TronLinkConnect: React.FC<Props> = ({ onSuccess, onError }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        const onReadyStateChanged = (state: WalletReadyState) => {
            console.log("ReadyState changed:", state);
            setIsReady(state === WalletReadyState.Found);
        };

        const onAccountsChanged = (newAddress: string | string[]) => {
            if (!newAddress || (Array.isArray(newAddress) && newAddress.length === 0)) {
                console.log("用户已退出 TronLink");
                setAccount(null);
                message.info("钱包已退出，请重新登录");
                return;
            }
            const addr = Array.isArray(newAddress) ? newAddress[0] : newAddress;
            console.log("Account changed:", addr);
            setAccount(addr);
            onSuccess?.(addr);
            message.success("账户已切换");
        };

        const onDisconnect = () => {
            console.log("Disconnected from wallet.");
            setAccount(null);
            message.info("钱包已断开连接");
        };

        adapter.on("readyStateChanged", onReadyStateChanged);
        adapter.on("accountsChanged", onAccountsChanged);
        adapter.on("disconnect", onDisconnect);

        // 初始化时只检查是否存在 TronLink，不做自动连接
        setIsReady(adapter.readyState === WalletReadyState.Found);

        return () => {
            adapter.off("readyStateChanged", onReadyStateChanged);
            adapter.off("accountsChanged", onAccountsChanged);
            adapter.off("disconnect", onDisconnect);
        };
    }, []);

    const connectWallet = async () => {
        if (isConnecting) {
            console.log("正在连接中，忽略重复请求");
            return;
        }
        isConnecting = true;
        setLoading(true);

        try {
            if (!isReady) {
                message.error("未检测到 TronLink，请先安装");
                window.open("https://www.tronlink.org/", "_blank");
                return;
            }

            await adapter.connect();

            if (adapter.address) {
                setAccount(adapter.address);
                message.success("TronLink 登录成功");
                onSuccess?.(adapter.address);
            }
        } catch (error: any) {
            console.error("TronLink 连接失败:", error);
            if (error instanceof WalletNotFoundError) {
                message.error("未检测到 TronLink 钱包");
            } else if (error.message?.includes("too frequent")) {
                message.warning("请求过于频繁，请稍后再试");
            } else {
                message.error("连接失败，请检查您的钱包状态");
            }
            onError?.(error);
        } finally {
            isConnecting = false;
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (account) {
            navigator.clipboard.writeText(account).then(() => {
                message.success("地址已复制到剪贴板");
            });
        }
    };

    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
            <Card
                style={{
                    width: 380,
                    textAlign: "center",
                    borderRadius: 20,
                    padding: "32px 24px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    backgroundColor: "#fff",
                }}
            >
                <Title level={4} style={{ marginBottom: 24, fontWeight: 500 }}>
                    连接 TronLink
                </Title>

                {account ? (
                    <Card
                        style={{
                            backgroundColor: "#f0f2f5",
                            borderRadius: 12,
                            padding: "16px",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <Avatar src={"./assets/tronlink.jpeg"} size={40} />
                        <div style={{ flex: 1 }}>
                            <Text strong>已连接账户</Text>
                            <br />
                            <Space align="center" style={{ marginTop: 4 }}>
                                <Text code copyable={false} style={{ color: "rgba(0,0,0,0.65)" }}>
                                    {formatAddress(account)}
                                </Text>
                                <Tooltip title="复制地址">
                                    <Button
                                        icon={<CopyOutlined />}
                                        size="small"
                                        type="text"
                                        onClick={copyToClipboard}
                                        style={{ color: "rgba(0,0,0,0.45)" }}
                                    />
                                </Tooltip>
                            </Space>
                        </div>
                    </Card>
                ) : (
                    <Button
                        type="primary"
                        size="large"
                        shape="round"
                        loading={loading}
                        style={{
                            width: "100%",
                            height: 50,
                            fontSize: 16,
                            fontWeight: 600,
                            background: "linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)",
                            borderColor: "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            boxShadow: "0 4px 15px rgba(255,152,0,0.3)",
                            transition: "all 0.3s ease",
                        }}
                        onClick={connectWallet}
                        icon={<Avatar src={"./assets/tronlink.jpeg"} size={28} />}
                    >
                        {account ? "重新连接 TronLink" : "使用 TronLink 登录"}
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default TronLinkConnect;
