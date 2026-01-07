import { useLanguage } from '@/hooks/useLanguage';
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { GlobalOutlined } from '@ant-design/icons';

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  const change = (e) => {
    changeLanguage(e);
    localStorage.setItem('language', e);
  };

  const items: MenuProps['items'] = [
    {
      label: <span onClick={() => change('en')}> English </span>,
      key: 'en'
    },
    {
      label: <span onClick={() => change('zh')} > 中文(简) </span>,
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