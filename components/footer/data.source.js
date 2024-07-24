import React from 'react';

export const Footer10DataSource = {
  wrapper: { className: 'home-page-wrapper footer1-wrapper' },
  OverPack: { className: 'footer1', playScale: 0.2 },
  block: {
    className: 'home-page',
    gutter: 0,
    children: [
      // {
      //   name: 'block0',
      //   xs: 24,
      //   md: 6,
      //   className: 'block',
      //   title: {
      //     className: 'logo',
      //     children:
      //       'https://zos.alipayobjects.com/rmsportal/qqaimmXZVSwAhpL.svg',
      //   },
      //   childWrapper: {
      //     className: 'slogan',
      //     children: [
      //       {
      //         name: 'content0',
      //         children: 'Animation specification and components of Ant Design.',
      //       },
      //     ],
      //   },
      // },
      {
        name: 'icon-info',
        xs: 24,
        md: 12,
        className: 'block',
        title: { children: 'Contact Us' },
        childWrapper: {
          children: [
            { href: 'https://twitter.com/ttswap_exchange', name: 'XOutlined', children: 'Twitter', target: '_bank' },
            { href: 'https://t.me/ttswap01', name: 'TG', children: 'Telegram', target: '_bank' },
            { href: 'https://discord.com/invite/GZyEPZmk', name: 'DiscordOutlined', children: 'Discord', target: '_bank' },
            { href: 'mailto:ttswap.exchange@gmail.com', name: 'MailOutlined', children: 'Email', target: '_bank' },
            { href: 'https://github.com/ttswap', name: 'GithubOutlined', children: 'GutHub', target: '_bank' },
          ],
        },
      },
      {
        name: 'docs',
        xs: 24,
        md: 12,
        className: 'block',
        title: { children: 'Docs' },
        childWrapper: {
          children: [
            // { name: 'link0', href: '#', children: '产品更新记录' },
            // { name: 'link1', href: '#', children: 'API文档' },
            // { name: 'link2', href: '#', children: '快速入门' },
            // { name: 'link3', href: '#', children: '参考指南' },
          ],
        },
      },
      // {
      //   name: 'block3',
      //   xs: 24,
      //   md: 6,
      //   className: 'block',
      //   title: { children: '资源' },
      //   childWrapper: {
      //     children: [
      //       { href: '#', name: 'link0', children: 'Ant Design' },
      //       { href: '#', name: 'link1', children: 'Ant Motion' },
      //     ],
      //   },
      // },
    ],
  },
  // copyrightWrapper: { className: 'copyright-wrapper' },
  // copyrightPage: { className: 'home-page' },
  // copyright: {
  //   className: 'copyright',
  //   children: (
  //     <span>
  //       ©2018 by <a href="https://motion.ant.design">Ant Motion</a> All Rights
  //       Reserved
  //     </span>
  //   ),
  // },
};
