import React, { useEffect, useState } from 'react';
import { Button, Layout, Card, Space } from 'antd';
import SidePanel from './SidePanel'

const { Header, Footer, Sider, Content } = Layout;



const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
  };
  const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
  };
  const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#1677ff',
  };
  const layoutStyle = {
    overflow: 'hidden',
    width: '100%',
  };





function MainLayout(props) {

    const [transportList, setTransportList] = useState([]);

    const AddToTransportList = (newItem) => {
        console.log("odasufbjaiokjufbasdfbj");
        const list = [...transportList];
        list.push(newItem);
        setTransportList(list);
    }

    return (
        <Layout style={layoutStyle}>
          <Sider width="25%" style={siderStyle}>
            <SidePanel TransportList={transportList} AddToTransportList={AddToTransportList}/>
          </Sider>
          <Layout>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>Content</Content>
            {/* <Footer style={footerStyle}>Footer</Footer> */}
          </Layout>
        </Layout>
)}




export default MainLayout;