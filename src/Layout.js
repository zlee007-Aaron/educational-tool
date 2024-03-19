import React, { useState } from 'react';
import { Layout, Card, Space } from 'antd';
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



function TransportItemDisplay(props){
    return (<Card
        title={props.name}
        //extra={<a href="#">More</a>}
        style={{
          width: 260,
        }}
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>)
}


function MainLayout(props) {

    const [TransportList, SetTransportList] = useState([]);


    return (
        <Layout style={layoutStyle}>
          <Sider width="25%" style={siderStyle}>
            Sider
            <Space direction="vertical" size={12}>
                {TransportList.length > 0 && 
                    TransportList.map((TransportItem) => TransportItemDisplay(TransportItem))
                }
            </Space>
          </Sider>
          <Layout>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>Content</Content>
            {/* <Footer style={footerStyle}>Footer</Footer> */}
          </Layout>
        </Layout>
)}




export default MainLayout;