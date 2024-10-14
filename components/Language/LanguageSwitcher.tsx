import { useLanguage } from '@/hooks/useLanguage';
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { GlobalOutlined } from '@ant-design/icons';

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const items: MenuProps['items'] = [
    {
      label: <span onClick={() => changeLanguage('en')}> English </span>,
      key: 'en'
    },
    {
      label: <span onClick={() => changeLanguage('zh')} > 中文 </span>,
      key: 'zh'
    }
  ];
  return (
    <div>
      <Dropdown menu={{ items }} trigger={['click']}>
        <Button shape="circle" size="large" icon={<GlobalOutlined />} />
      </Dropdown>
    </div>
  );
}