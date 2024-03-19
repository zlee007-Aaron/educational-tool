import React, { useEffect, useState } from 'react';
import { Dropdown, Button, Card, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Flex, Input, Divider, Tooltip, List, Typography } from 'antd';


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

const Days = [
    'mon',
    'tue',
    'wed',
    'thur',
    'fri',
    'sat',
    'sun',
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
    const [perTonGoods, SetPerTonGoods] = useState(false);
    const [TonesOfGoods, SetTonesOfGoods] = useState(null);
    const [perPerson, SetPerPerson] = useState(false);
    const [People, SetPeople] = useState(null);
    const [TotalEmissionsPerTrip, SetTotalEmissionsPerTrip] = useState(null);

    const [WarningMessage, SetWarningMessage] = useState(null);

    const SetTransportType = (e) => {
        let TransportItem = NewTransportItem;
        let TT = VehicleTypesSelectable.find((value) => value.key == e.key);
        SetEmissionValue(TT.emission);
        TransportItem.TransportType =  TT.label;

        if(TT.perTonneGoods){
            SetPerTonGoods(true)
        }
        else{
            SetTonesOfGoods(null);
            SetPerTonGoods(false);
        }
        if(TT.PerPerson){
            SetPerPerson(true);
        }
        else{
            SetPeople(null);
            SetPerPerson(false);
        }

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
        if(NewTransportItem && NewTransportItem.TransportType && NewTransportItem.Distance && NewTransportItem.EmissionsPerTrip)
            props.AddToTransportList(NewTransportItem);
    }

    //Sets the total emissions when any of the values used to calculate it change
    useEffect(() => {
        let Totalemissions = ((JourneyDistance/1000)*EmissionValue).toPrecision(5);
        if(perTonGoods){
            Totalemissions = ((JourneyDistance/1000)*EmissionValue*TonesOfGoods).toPrecision(5);
        }
        else if(perPerson){
            Totalemissions = ((JourneyDistance/1000)*EmissionValue*People).toPrecision(5);
        }

        SetTotalEmissionsPerTrip(Totalemissions);

        if(Totalemissions == 0){
            SetWarningMessage("Enter all values first and set a distance on the map");
        }
        else{
            SetWarningMessage(null);
        }

        let TransportItem = NewTransportItem;
        TransportItem.EmissionsPerTrip = Totalemissions;
        setNewTransportItem(TransportItem);
    },[EmissionValue, TonesOfGoods, People, JourneyDistance] )


    //Updates the local transport list when the main one updates
    useEffect(() => {
        console.log(props.TransportList);
        if(Array.isArray(props.TransportList))
            setTransportList(props.TransportList);
      }, [props.TransportList]);


    useEffect(() => {
        console.log(NewTransportItem);
      }, [NewTransportItem]);

    //Updates the journey distances when the map values change
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

    //resets values and informs the main layout that we are now in adding mode
    useEffect(() => {
        props.setInAddMode(AddNewTransportItemScreen);
        if(AddNewTransportItemScreen){
            setNewTransportItem({});
            SetselectedVehicleType(null);
            SetselectedJourneyType(null);
            SetJourneyDistance(null);
            SetJourneyDuration(null);
            SetEmissionValue(null);
            SetPerTonGoods(false);
            SetTonesOfGoods(null);
            SetPerPerson(false);
            SetPeople(null);
            SetTotalEmissionsPerTrip(null);
        }
      }, [AddNewTransportItemScreen]);

      //Informs main layout that we are in office setting mode
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

                    <List style={{margin:'10px', backgroundColor:'white', borderRadius:'10px', textAlign: 'left', paddingLeft: '10px', paddingRight: '10px'}} >
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

                        {perTonGoods &&
                        <List.Item>
                            Tones of goods
                            <Input placeholder="Ton's of goods" onChange={(e) => SetTonesOfGoods(Number(e.target.value))} />
                        </List.Item>
                        }
                        {perPerson &&
                        <List.Item>
                            Passengers
                            <Input placeholder="People" onChange={(e) => SetPeople(Number(e.target.value))}/>
                        </List.Item>
                        }

                        <List.Item>
                            Emissions per KM: {EmissionValue? EmissionValue + (perTonGoods ? 'g per ton goods' : perPerson? 'g per person' : 'g') : ''} 
                        </List.Item>
                        <List.Item>
                            Journey Distance: {JourneyDistance? JourneyDistance + 'm' : ''}
                        </List.Item>
                        {/* <List.Item>
                            Journey Duration: {JourneyDuration? }
                        </List.Item> */}
                        <List.Item>
                            Journey emissions: {TotalEmissionsPerTrip? TotalEmissionsPerTrip + 'g' : ''}
                        </List.Item>
                    </List>

                </Flex>


                {WarningMessage &&
                <Tooltip placement="top" title={WarningMessage} >
                    <Button  disabled={WarningMessage} >
                        Add
                    </Button>
                </Tooltip>}
                {!WarningMessage &&
                    <Button onClick={() =>{AddCurrentTransportItemToList(); SetNewTransportItemScreen(false) }}>
                        Add
                    </Button>
                }

                <Button onClick={() =>{ SetNewTransportItemScreen(false) }}>
                    Cancel
                </Button>
            </div>
        }
        </>
)}




export default SidePanel;