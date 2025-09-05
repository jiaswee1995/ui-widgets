import React, { useState } from "react";
import { Button, Card, Typography, message, Space, Avatar, Tooltip } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { MetaMaskSDK } from "@metamask/sdk";

const { Title, Text } = Typography;

interface Props {
    onSuccess?: (account: string) => void;
    onError?: (error: any) => void;
}

const MetaMaskConnect: React.FC<Props> = ({ onSuccess, onError }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    // Initialize MetaMask SDK
    const MMSDK = new MetaMaskSDK({
        dappMetadata: {
            name: "My DApp",
            url: window.location.href,
        },
    });

    const connectMetaMask = async () => {
        setIsConnecting(true);
        const ethereum = MMSDK.getProvider();

        try {
            if (!ethereum) {
                // MetaMask not detected, prompt user to install it
                message.error("未检测到 MetaMask，请先安装");
                window.open("https://metamask.io/download/", "_blank");
                setIsConnecting(false);
                return;
            }

            // Correctly request accounts and expect a string array
            const accounts: string = await ethereum.request({
                method: "eth_requestAccounts",
            });

            if (accounts.length > 0) {
                // Set the state with the first account from the array
                setAccount(accounts[0]);
                message.success("MetaMask 登录成功");
                onSuccess?.(accounts[0]);
            }
        } catch (error: any) {
            console.error("MetaMask 登录失败:", error);
            if (error.code === 4001) {
                // User rejected the connection
                message.error("用户已取消连接");
            } else {
                // Other general errors
                message.error("MetaMask 登录失败，请检查您的钱包");
            }
            onError?.(error);
        } finally {
            setIsConnecting(false);
        }
    };

    const copyToClipboard = () => {
        if (account) {
            navigator.clipboard.writeText(account).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
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
                    borderRadius: 20, // 更柔和的圆角
                    padding: "32px 24px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)", // 更现代的阴影
                    backgroundColor: "#fff",
                }}
            >
                <Title level={4} style={{ marginBottom: 24, fontWeight: 500 }}>
                    连接 MetaMask
                </Title>

                {account? (
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
                        <Avatar
                            src="./assets/metamask.svg"
                            size={40}
                        />
                        <div style={{ flex: 1 }}>
                            <Text strong>已连接账户</Text>
                            <br />
                            <Space align="center" style={{ marginTop: 4 }}>
                                <Text code copyable={false} style={{ color: "rgba(0,0,0,0.65)" }}>
                                    {formatAddress(account)}
                                </Text>
                                <Tooltip title={isCopied? "已复制！" : "复制地址"}>
                                    <Button
                                        icon={isCopied? <CheckOutlined /> : <CopyOutlined />}
                                        size="small"
                                        type="text"
                                        onClick={copyToClipboard}
                                        style={{ color: isCopied? "#52c41a" : "rgba(0,0,0,0.45)" }}
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
                        loading={isConnecting}
                        style={{
                            width: "100%",
                            height: 50,
                            fontSize: 16,
                            fontWeight: 600,
                            background: "linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)", // 橙色渐变
                            borderColor: "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            boxShadow: "0 4px 15px rgba(255,152,0,0.3)", // 渐变色阴影
                            transition: "all 0.3s ease",
                        }}
                        onClick={connectMetaMask}
                        icon={
                            <Avatar
                                src="https://images.ctfassets.net/clixtyxoaeas/4rnpEzy1ATWRKVBOLxZ1Fm/a74dc1eed36d23d7ea6030383a4d5163/MetaMask-icon-fox.svg"
                                size={28} // 稍微大一点的图标
                            />
                        }
                    >
                        使用 MetaMask 登录
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default MetaMaskConnect;