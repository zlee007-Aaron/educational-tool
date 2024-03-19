import React, { useEffect, useState } from 'react';
import { Dropdown, Button, Card, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Flex, Divider, List, Typography } from 'antd';


const VehicleTypesSelectable = [
    {
      key: '1',
      label: 'Electric vehicle',
    },
    {
      key: '2',
      label: 'Bus',
    },
    {
      key: '3',
      label: 'Van / light truck',
    },
    {
      key: '4',
      label: 'Petrol Car',
    },
    {
      key: '5',
      label: 'Diesel car',
    },
    {
      key: '6',
      label: 'Motorbike',
    },
    {
      key: '7',
      label: 'HGV',
    },
  ];

function SidePanel(props) {

    const [AddNewTransportItemScreen, SetNewTransportItemScreen] = useState(false);

    const [transportList, setTransportList] = useState([]);

    const [NewTransportItem, setNewTransportItem] = useState({});

    const [selectedVehicleType, SetselectedVehicleType] = useState(null);

    const SetTransportType = (e) => {
        let TransportItem = NewTransportItem;
        TransportItem.TransportType =  VehicleTypesSelectable.find((value) => value.key == e.key).label;
        setNewTransportItem(TransportItem);
        SetselectedVehicleType(NewTransportItem.TransportType);
        console.log(NewTransportItem);
      };

    const AddCurrentTransportItemToList = () => {
        if(NewTransportItem && NewTransportItem.TransportType)
            props.AddToTransportList(NewTransportItem);
    }


    useEffect(() => {
        console.log(props.TransportList);
        if(Array.isArray(props.TransportList))
            setTransportList(props.TransportList);
      }, [props.TransportList]);

    useEffect(() => {
        props.setInAddMode(AddNewTransportItemScreen);
      }, [AddNewTransportItemScreen]);

      
    return (
        <>
        {!AddNewTransportItemScreen && 
            <>
                <p>
                    TransportMethods
                </p>
                <List 
                style={{margin:'10px'}}
                bordered 
                dataSource={transportList} 
                renderItem={(item) => (
                    <List.Item>
                        <Typography.Text mark>[ITEM]</Typography.Text> {item.TransportType}
                    </List.Item>
                    )}
                />

                <Button onClick={() =>{ SetNewTransportItemScreen(true) }}>
                    Add New transport
                </Button>
            </>
        }
        {AddNewTransportItemScreen && 
            <div>
                <Flex vertical style={{margin:'10px'}}>
                    <p>
                        New transport method
                    </p>
                    <Dropdown
                        menu={{
                        items: VehicleTypesSelectable,
                        selectable: true,
                        defaultSelectedKeys: ['1'],
                        onClick: SetTransportType
                        }}
                    >
                        <Button>
                            <Space>
                            {selectedVehicleType? selectedVehicleType : 'Select and item'}
                            <DownOutlined />
                            </Space>
                        </Button>

                    </Dropdown>
                </Flex>


                
                <Button onClick={() =>{AddCurrentTransportItemToList(); SetNewTransportItemScreen(false) }}>
                    Add
                </Button>
                <Button onClick={() =>{ SetNewTransportItemScreen(false) }}>
                    Cancel
                </Button>
            </div>
        }
        </>
)}




export default SidePanel;