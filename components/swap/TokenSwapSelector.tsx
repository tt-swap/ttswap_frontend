import usePrices from "@/hooks/usePrices";
import useTokens from "@/hooks/useTokens";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { Price } from "@/shared/types/price";
import { TokenPayload, SwapTokenValue } from "@/shared/types/token";
import { ReactNode, useEffect, useMemo, useState } from "react";
// @ts-ignore
import Modal from "react-modal";
import TokenSwapModal from "./TokenSwapModal";
import ImgCache from "./components/common/ImgCache";
import ChainSelector from "@/components/ChainSelector";

import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { Input, Select, Button, Tree,Avatar } from 'antd';
import type { TreeProps, TreeDataNode } from 'antd';

import { prettifyCurrencys } from '@/graphql/util';
import { GoodsDatas } from '@/graphql/swap/index';

const { Option } = Select;


const sel = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'Yiminghe', label: 'yiminghe' },
  { value: 'disabled', label: 'Disabled', disabled: true },
];
// type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

interface Props {
  value: TokenPayload;
  onChange: (value:SwapTokenValue) => void;
}

type LocalCurrency = Partial<SwapTokenValue>;
const TokenSwapSelector = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [availableTokens, setTokensValue] = useState<Array<LocalCurrency>>([]);
  const [treeData, setTokens] = useState<TreeDataNode[]>();
  const { prices } = usePrices();
  const { tokenMap } = useTokens();

  useMemo(() => {
    // setTokens(None);
    (async () => {
      let a: any = await GoodsDatas({ id: 0 });
      let rest: Array<LocalCurrency> = a.tokenValue;
      // console.log(rest,33332)
      setTokensValue(rest);
      a.tokens.map((el: any, index: number) => {
        a.tokens[index].key = el.id;
        a.tokens[index].title = (
          <>
            <img src="/token.png" alt="folder" className="treeImg" />
            <span>
              <span>{el.name}</span><br />
              <span className="text-xs">{el.symbol}</span>
            </span>
          </>);
        el.children.map((el1: any, index1: number) => {
          a.tokens[index].children[index1].key = el1.id;
          a.tokens[index].children[index1].nodePd = true;
          a.tokens[index].children[index1].title = (
            <>
              <img src="/token.png" alt="folder" className="treeImg" />
              <span>
                <span>{el1.name}</span><br />
                <span className="text-xs">{el1.symbol}</span>
              </span>
              <span className="magL">
                <span>stock:{prettifyCurrencys(el1.currentQuantity)}</span>
                <span>buyFee:{el1.buyFee*100}%</span>
                <span>sellFee:{el1.sellFee*100}%</span>
              </span>
            </>);

        })
      })
      setTokens(a.tokens);
    })()
  }, [keyword]);
  // console.log(availableTokens,222)
  const isDefault = value.symbol === DEFAULT_TOKEN;

  const showModal = (el:SwapTokenValue) => {
    // console.log(222)
    setOpen(false);
    onChange(el)
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
    };
    
  useEffect(() => {
    Modal.setAppElement("body");
    const input: HTMLInputElement | null = document.querySelector('input');
    if (input) {
      input.focus();
    }
  }, []);

  const onSelect: TreeProps['onSelect'] = (keys: any, info: any) => {
    // console.log('Trigger Select', info);
    if (info.node.nodePd) {
      setOpen(false);
      onChange(info.node);
      console.log('Trigger Select', keys, info);
    }
  };
  const handleClose = (a: boolean, b: string) => {
    setOpen(a);
    document.body.style.overflow = b;
  };
  return (
    <>
      <TokenSwapModal open={open} setOpen={setOpen} title={"Select a token"}>
        <div className="select-head " >
          <div className="sel-token">
            <Input
              autoFocus
              placeholder="Search name or paste address"
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={(e: any) => setKeyword(e.target.value)}
              value={keyword}
            />
            <ChainSelector/>
            {/* <Select
              defaultValue={sel[0].value}
              popupMatchSelectWidth={false}
              onChange={onSearch}
            >
              {sel.map(item => (
                <Option key={item.value} value={item.value}>
                  <div>
                    <Avatar size="small" src={<img src="/token.png" alt="avatar" />} >
                      {item.value[0]}
                    </Avatar>{" "}
                    {item.label}
                  </div>
                </Option>
              ))}
            </Select> */}
          </div>
          <div className="flex sel-token flexWap">
            {availableTokens.map((el: any) => (
              <div
                onClick={() => showModal(el)}
                key={el.id}
                className="flex row cursor-pointer butSty but-hov"
              >
                <ImgCache alt="icon"
                 className="w-6"
                  src={"/token.png"}
                  // src={value.logo_url}
                 />
                <span className="text-lg block">{el.symbol}</span>
              </div>
            ))}
          </div>
        </div >
        <div className="divider" />
        <div style={{ paddingTop: "10px" }}>
          <DirectoryTree
            showIcon={false}
            switcherIcon={<DownOutlined />}
            height={492}
            onSelect={onSelect}
            treeData={treeData}
          />
        </div>
      </TokenSwapModal>

      <div
        className=""
      >
        <Button
          className="butSty cursor-pointer but-hov"
          onClick={() => handleClose(true, "hidden")}
          icon={<DownOutlined />}
          iconPosition={"end"}
        >
          <span className="text-lg block">{value.symbol}</span>
          {!isDefault && (
            <ImgCache
              alt="icon"
              className="w-6"
              src={"/token.png"}
              // src={value.logo_url}
            />
          )}
        </Button>
      </div>
    </>
  );
};

export default TokenSwapSelector;
