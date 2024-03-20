import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import MapComponent from './components/MapComponent';
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
    const [isInAddMode, SetInAddMode] = useState(false);
    const [isInSetOfficeMode, SetInOfficeSetMode] = useState(false);
    const [CurrentlySelectedMapDirections, setCurrentlySelectedMapDirections] = useState(null);

    useEffect(() => {
        console.log(CurrentlySelectedMapDirections);
      }, [CurrentlySelectedMapDirections])
    useEffect(() => {
        console.log(transportList);
      }, [transportList])

    const AddToTransportList = (newItem) => {
        const list = [...transportList];
        list.push(newItem);
        setTransportList(list);
    }

    const SetAddMode = (addMode) => {
        console.log('InAddMode: ' + addMode);
        if(!addMode){
            setCurrentlySelectedMapDirections(null);
        }
        else if(addMode){
            SetInOfficeSetMode(false);
        }
        SetInAddMode(addMode);
    }

    return (
        <Layout style={layoutStyle}>
          <Sider width="368px" style={siderStyle}>
            <SidePanel TransportList={transportList} SetTransportList={setTransportList} AddToTransportList={AddToTransportList} setInAddMode={SetAddMode} setInOfficeSetMode={SetInOfficeSetMode} mapDirections={CurrentlySelectedMapDirections}/>
          </Sider>
          <Layout>
            <Header style={headerStyle}>Educational Tool</Header>
            <Content style={contentStyle}>
              <MapComponent TransportList={transportList} SetTransportList={setTransportList} isInAddMode={isInAddMode} isInSetOfficeMode={isInSetOfficeMode} setMapDirections={setCurrentlySelectedMapDirections}/>
            </Content>
            {/* <Footer style={footerStyle}>Footer</Footer> */}
          </Layout>
        </Layout>
)}




export default MainLayout;