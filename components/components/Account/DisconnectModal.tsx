import { PoweroffOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { Button } from "antd";
import { useTranslation } from 'react-i18next';

import Address from "./Address";

interface ConnectModalProps {
  disconnect: () => Promise<void>;
}

const DisconnectModal: React.FC<ConnectModalProps> = ({ disconnect }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-4">
      <Address avatar="left" size={6} copyable style={{ fontSize: "16px" }} />
      <Button
        icon={<PoweroffOutlined />}
        onClick={() => disconnect()}
      />
    </div>
  );
};

export default DisconnectModal;
