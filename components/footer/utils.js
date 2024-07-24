
import React from 'react';
import { Button } from 'antd';
import { GithubOutlined, XOutlined, DiscordOutlined, MailOutlined } from '@ant-design/icons';
import { Icons } from "@/components/icons";

export const isImg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/;
export const getChildrenToRender = (item, i) => {
  let tag = item.name.indexOf('title') === 0 ? 'h1' : 'div';
  tag = item.href ? 'a' : tag;
  let children = typeof item.children === 'string' && item.children.match(isImg)
    ? React.createElement('img', { src: item.children, alt: 'img' })
    : item.children;
  if (item.name.indexOf('button') === 0 && typeof item.children === 'object') {
    children = React.createElement(Button, {
      ...item.children
    });
  }
  if (item.name === 'GithubOutlined') {
    children = React.createElement(GithubOutlined);
  }
  if (item.name === 'XOutlined') {
    children = React.createElement(XOutlined);
  }
  if (item.name === 'DiscordOutlined') {
    children = React.createElement(DiscordOutlined);
  }
  if (item.name === 'MailOutlined') {
    children = React.createElement(MailOutlined);
  }
  if (item.name === 'TG') {
    children = <Icons.Telegram className="h-5 w-5" />;//React.createElement(Icons.Telegram);
  }
  // console.log(item.type)
  return React.createElement(tag, { key: i.toString(), ...item }, children);
};
