import React, { useEffect, useState } from 'react';
import { Dropdown, Button, Card, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Flex, Divider, List, Typography } from 'antd';


//Emissions are in grams
const VehicleTypesSelectable = [
    {
      key: '1',
      label: 'Electric vehicle',
      emission: 6,
    },
    {
      key: '2',
      label: 'Bus',
      emission: 62.75,
      PerPerson: true,
    },
    {
      key: '3',
      label: 'Van / light truck',
      emission: 300,
    },
    {
      key: '4',
      label: 'Petrol Car',
      emission: 141.8,
    },
    {
      key: '5',
      label: 'Diesel car',
      emission: 157.5,
    },
    {
      key: '6',
      label: 'Motorbike',
      emission: 37.5,
    },
    {
      key: '7',
      label: 'HGV',
      emission: 56.5,
      perTonneGoods: true,
    },
  ];

const TypeOfJourney = [
    {
      key: '1',
      label: 'Daily Commute',
    },
    {
      key: '2',
      label: 'One of trip',
    },
    {
      key: '3',
      label: 'Goods delivery',
    },
  ];

function SidePanel(props) {

    const [AddNewTransportItemScreen, SetNewTransportItemScreen] = useState(false);
    const [OfficeLocationMode, SetOfficeLocationMode] = useState(false);

    const [transportList, setTransportList] = useState([]);

    const [NewTransportItem, setNewTransportItem] = useState({});

    const [selectedVehicleType, SetselectedVehicleType] = useState(null);
    const [selectedJourneyType, SetselectedJourneyType] = useState(null);

    const [JourneyDistance, SetJourneyDistance] = useState(null);

    const [JourneyDuration, SetJourneyDuration] = useState(null);

    const [EmissionValue, SetEmissionValue] = useState(null);

    const SetTransportType = (e) => {
        let TransportItem = NewTransportItem;
        let TT = VehicleTypesSelectable.find((value) => value.key == e.key);
        SetEmissionValue(TT.emission);
        TransportItem.TransportType =  TT.label;
        setNewTransportItem(TransportItem);
        SetselectedVehicleType(TT.label);
        console.log(NewTransportItem);
      };

    const SetJourneyType = (e) => {
        let TransportItem = NewTransportItem;
        let JT = TypeOfJourney.find((value) => value.key == e.key).label;
        TransportItem.JourneyType = JT;
        setNewTransportItem(TransportItem);
        SetselectedJourneyType(JT);
    }

    const AddCurrentTransportItemToList = () => {
        if(NewTransportItem && NewTransportItem.TransportType && NewTransportItem.Distance && NewTransportItem.Duration)
            props.AddToTransportList(NewTransportItem);
    }


    useEffect(() => {
        console.log(props.TransportList);
        if(Array.isArray(props.TransportList))
            setTransportList(props.TransportList);
      }, [props.TransportList]);

    useEffect(() => {
        if(props.mapDirections){
            SetJourneyDistance(props.mapDirections.Distance);
            SetJourneyDuration(props.mapDirections.Duration);
    
            let TransportItem = NewTransportItem;
            TransportItem.Duration = props.mapDirections.Duration;
            TransportItem.Distance = props.mapDirections.Distance;
            setNewTransportItem(TransportItem);

            console.log(NewTransportItem);
        }
      }, [props.mapDirections]);

    useEffect(() => {
        props.setInAddMode(AddNewTransportItemScreen);
        if(AddNewTransportItemScreen){
            setNewTransportItem({});
            SetselectedVehicleType(null);
            SetselectedJourneyType(null);
            SetJourneyDistance(null);
            SetJourneyDuration(null);
            SetEmissionValue(null);
        }
      }, [AddNewTransportItemScreen]);

    useEffect(() => {
        props.setInOfficeSetMode(OfficeLocationMode);
      }, [OfficeLocationMode]);


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

                {!OfficeLocationMode && 
                <Button onClick={() =>{ SetNewTransportItemScreen(true) }}>
                    Add New transport
                </Button>}

                <Button onClick={() =>{ SetOfficeLocationMode(!OfficeLocationMode) }}>
                    {OfficeLocationMode? 'Finish setting office location' : 'Edit office location'}
                </Button>
            </>
        }
        {AddNewTransportItemScreen && 
            <div>
                <Flex vertical style={{margin:'10px'}}>
                    <p>
                        New transport method
                    </p>

                    <List style={{margin:'10px', backgroundColor:'white', borderRadius:'10px', textAlign: 'left', paddingLeft: '10px'}} >
                        <List.Item>
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
                                    {selectedVehicleType? selectedVehicleType : 'Select a vehicle'}
                                    <DownOutlined />
                                    </Space>
                                </Button>

                            </Dropdown>                                
                        </List.Item>
                        <List.Item>
                            <Dropdown
                                menu={{
                                items: TypeOfJourney,
                                selectable: true,
                                defaultSelectedKeys: ['1'],
                                onClick: SetJourneyType,
                                }}
                            >
                                <Button>
                                    <Space>
                                    {selectedJourneyType? selectedJourneyType : 'Select a journey type'}
                                    <DownOutlined />
                                    </Space>
                                </Button>

                            </Dropdown>    
                        </List.Item>
                        <List.Item>
                            Emissions per KM: {EmissionValue? EmissionValue + 'g' : ''}
                        </List.Item>
                        <List.Item>
                            Journey Distance: {JourneyDistance}
                        </List.Item>
                        <List.Item>
                            Journey Duration: {JourneyDuration}
                        </List.Item>
                        <List.Item>
                            Journey emissions: {EmissionValue? ((JourneyDistance/1000)*EmissionValue) + 'g' : ''}
                        </List.Item>
                    </List>

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