import React from 'react';
// import { LoadingOutlined } from '@ant-design/icons';
// import { Flex, Spin } from 'antd';
import './Loading.module.css';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useGlobalLoading } from '@/stores/globalLoading';

export const Loading: React.FC = () => {
    return (
        <div className="loadingContainer">
            <div className="spinner">
                {/* <p>加载中...</p> */}
            </div>
        </div>
    );
};


export function GlobalLoading() {
    const { isLoading, message } = useGlobalLoading();
    console.log('isLoading', isLoading, message);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-50">
            <div className="flex flex-col items-center gap-2">
                <Spin
                    fullscreen
                    indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                    size="large"
                />
                {message && (
                    <div className="text-white text-lg font-medium mt-2">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalLoading;