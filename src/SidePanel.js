import React, { useEffect, useState } from 'react';
import { Dropdown, Button, Card, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Flex, Input, DatePicker, Divider, Select, Collapse, Tooltip, List, Typography } from 'antd';
const { RangePicker } = DatePicker;

//Emissions are in grams
const VehicleTypesSelectable = [
    {
      key: '1',
      label: 'Electric Vehicle',
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
      label: 'Van / Light Truck',
      emission: 300,
    },
    {
      key: '4',
      label: 'Petrol Car',
      emission: 141.8,
    },
    {
      key: '5',
      label: 'Diesel Car',
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
    {
        label: 'mon',
        value: 'mon',
    },
    {
        label: 'tue',
        value: 'tue',
    },
    {
        label: 'wed',
        value: 'wed',
    },
    {
        label: 'thur',
        value: 'thur',
    },
    {
        label: 'fri',
        value: 'fri',
    },
    {
        label: 'sat',
        value: 'sat',
    },
    {
        label: 'sun',
        value: 'sun',
    },
];

function SidePanel(props) {

    const [AddNewTransportItemScreen, SetNewTransportItemScreen] = useState(false);
    const [OfficeLocationMode, SetOfficeLocationMode] = useState(false);

    const [transportList, setTransportList] = useState([]);



    //variables for adding new value
    const [Descriptor, SetDescriptor] = useState(null);
    const [NewTransportItem, setNewTransportItem] = useState({});
    const [selectedVehicleType, SetselectedVehicleType] = useState(null);
    const [selectedJourneyType, SetselectedJourneyType] = useState(null);
    const [JourneyDistance, SetJourneyDistance] = useState(null);
    const [JourneyDuration, SetJourneyDuration] = useState(null);
    const [JourneyDestination, SetJourneyDestination] = useState(null);
    const [EmissionValue, SetEmissionValue] = useState(null);
    const [perTonGoods, SetPerTonGoods] = useState(false);
    const [TonnesOfGoods, SetTonnesOfGoods] = useState(null);
    const [perPerson, SetPerPerson] = useState(false);
    const [People, SetPeople] = useState(null);
    const [TotalEmissionsPerTrip, SetTotalEmissionsPerTrip] = useState(null);

    const [OneOffTripDate, SetOneOffTripDate] = useState(null);
    const [CommuteDaysOfWeek, SetCommuteDaysOfWeek] = useState([]);
    const [DaysBetweenDelivery, SetDaysBetweenDelivery] = useState(null);

    const [WarningMessage, SetWarningMessage] = useState(null);
    //end of variables for adding new value

    const [SelectedStartDate, SetSelectedStartDate] = useState(null);
    const [SelectedEndDate, SetSelectedEndDate] = useState(null);

    const [TotalCo2Emissions, SetTotalCo2Emissions] = useState(null);
    const [GroupedCo2Emissions, SetGroupedCo2Emissions] = useState([]);


    const getDaysIncludingDates = () => {

        const date1Ms = new Date(SelectedStartDate).getTime();
        const date2Ms = new Date(SelectedEndDate).getTime();

        const differenceMs = Math.abs(date2Ms - date1Ms);
      
        // Convert the difference to days
        const daysDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
      
        return daysDifference + 1;
    }


    const days = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];
    const getDayOfWeek = (date) => {
        let dayIndex = date.getDay();
        return days[dayIndex];
    }
    const GetDayFromNumber = (day) => {
        return days[day];
    }
    const GetNumberFromDay = (day) => {
        return days.findIndex(day);
    }

    const CalculateEmissions = () => {
        console.log(SelectedStartDate);
        if(!SelectedStartDate || !SelectedEndDate){
            return;
        }
        let PerVehicleTypes = {};
        const Days = getDaysIncludingDates();
        let Co2Amount = 0;
        transportList.forEach(element => {
            if(!PerVehicleTypes[element.TransportType]) PerVehicleTypes[element.TransportType] = 0;
            switch (element.JourneyType) {
                case 'One of trip':
                    let OneOfDateMs = new Date(element.oneOfTripDate).getTime();
                    if(OneOfDateMs >= new Date(SelectedStartDate).getTime() && OneOfDateMs <= new Date(SelectedEndDate).getTime()){
                        Co2Amount += element.EmissionsPerTrip*2; //presume back and fourth trip
                        PerVehicleTypes[element.TransportType] += element.EmissionsPerTrip*2;
                    }
                break;
                case 'Goods delivery':
                    Co2Amount += Math.floor(Days/element.daysBetweenDelivery) * element.EmissionsPerTrip*2;
                    PerVehicleTypes[element.TransportType] += Math.floor(Days/element.daysBetweenDelivery) * element.EmissionsPerTrip*2
                break;
                case 'Daily Commute':
                    //let StartDay = SelectedStartDate.getDay();

                    //let EndDay = SelectedStartDate.getDay();

                    if(Days < 7){
                        //Get start day, then check each other day index
                        for (let i = new Date(SelectedStartDate).getDay(); i < Days; i++) {
                            if(element.commuteDaysOfWeek.includes(GetDayFromNumber(i%7))){
                                Co2Amount += element.EmissionsPerTrip*2;
                                PerVehicleTypes[element.TransportType] += element.EmissionsPerTrip*2;
                            }
                        }
                    }
                    else{
                        //Calculate days for first and last week
                        for (let i = new Date(SelectedStartDate).getDay(); i < 7; i++) {
                            if(element.commuteDaysOfWeek.includes(GetDayFromNumber(i))){
                                Co2Amount += element.EmissionsPerTrip*2;
                                PerVehicleTypes[element.TransportType] += element.EmissionsPerTrip*2;
                            }
                        }
                        for (let i = new Date(SelectedEndDate).getDay(); i > 0; i--) {
                            if(element.commuteDaysOfWeek.includes(GetDayFromNumber(i))){
                                Co2Amount += element.EmissionsPerTrip*2;
                                PerVehicleTypes[element.TransportType] += element.EmissionsPerTrip*2;
                            }
                        }
                        console.log('days: ' + Days);
                        let removeFromFront = 7 - new Date(SelectedStartDate).getDay();
                        console.log('removeFromFront: ' + removeFromFront);
                        let removeFromEnd = new Date(SelectedEndDate).getDay() + 1;
                        console.log('removeFromEnd: ' + removeFromEnd);
                        let RemainingDays = Days - removeFromFront - removeFromEnd;
                        //RemainingDays should now be a multiple of 7, and also contain the length of whole weeks, so
                        console.log('RemainingDays: ' + RemainingDays);
                        let WeeksWorked = RemainingDays/7;
                        Co2Amount += WeeksWorked*element.commuteDaysOfWeek.length*element.EmissionsPerTrip*2;
                        PerVehicleTypes[element.TransportType] += WeeksWorked*element.commuteDaysOfWeek.length*element.EmissionsPerTrip*2;
                    }
                break;
            }
        });
        let PerVehicleTypesArray = [];
        for (const [key, value] of Object.entries(PerVehicleTypes)) {
            //console.log(`${key}: ${value}`);
            PerVehicleTypesArray.push({vehicle: key, Co2: value})
          }
        console.log(Co2Amount);
        SetGroupedCo2Emissions(PerVehicleTypesArray);
        console.log(GroupedCo2Emissions);
        SetTotalCo2Emissions(Co2Amount.toPrecision(4));
    }


    const SetTransportType = (e) => {
        let TransportItem = NewTransportItem;
        let TT = VehicleTypesSelectable.find((value) => value.key == e.key);
        SetEmissionValue(TT.emission);
        TransportItem.TransportType =  TT.label;

        if(TT.perTonneGoods){
            SetPerTonGoods(true)
        }
        else{
            SetTonnesOfGoods(null);
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
        if(NewTransportItem && NewTransportItem.TransportType && NewTransportItem.Distance && NewTransportItem.EmissionsPerTrip && Descriptor){
            let newTransportItem = NewTransportItem;
            if(selectedJourneyType === 'Daily Commute' && CommuteDaysOfWeek.length > 0){
                newTransportItem.commuteDaysOfWeek = CommuteDaysOfWeek;
            }
            else if(selectedJourneyType === 'One of trip' && OneOffTripDate){
                newTransportItem.oneOfTripDate = OneOffTripDate;
            }
            else if(selectedJourneyType === 'Goods delivery' && DaysBetweenDelivery){
                newTransportItem.daysBetweenDelivery = DaysBetweenDelivery;
            }
            else{
                return;
            }
            newTransportItem.Descriptor = Descriptor;
            console.log(newTransportItem);
            props.AddToTransportList(newTransportItem);
        }
    }

    //Sets the total emissions when any of the values used to calculate it change
    useEffect(() => {
        let Totalemissions = ((JourneyDistance/1000)*EmissionValue).toPrecision(5);
        if(perTonGoods){
            Totalemissions = ((JourneyDistance/1000)*EmissionValue*TonnesOfGoods).toPrecision(5);
        }
        else if(perPerson){
            Totalemissions = ((JourneyDistance/1000)*EmissionValue*People).toPrecision(5);
        }

        SetTotalEmissionsPerTrip(Totalemissions);

        if(Totalemissions == 0 || isNaN(Totalemissions)){
            SetWarningMessage("Enter all values first and click to set a distance on the map");
        }
        else if(selectedJourneyType){
            console.log(DaysBetweenDelivery);
            if(selectedJourneyType === 'Daily Commute' && CommuteDaysOfWeek.length < 1){
                SetWarningMessage("Select days of week");
            }
            else if(selectedJourneyType === 'One of trip' && !!!OneOffTripDate){
                SetWarningMessage("Select a date");
            }
            else if(selectedJourneyType === 'Goods delivery' && DaysBetweenDelivery < 1){
                SetWarningMessage("Select days between delivery");
            }
            else{
                SetWarningMessage(null);
            }
           
        }
        else if(!selectedJourneyType){
            SetWarningMessage("Select a journey type");
        }
        else if(!Descriptor){
            SetWarningMessage("Enter a Descriptor/Name");
        }
        else{
            SetWarningMessage(null);
        }

        let TransportItem = NewTransportItem;
        TransportItem.EmissionsPerTrip = Totalemissions;
        setNewTransportItem(TransportItem);
    },[EmissionValue, TonnesOfGoods, People, JourneyDistance, selectedJourneyType, CommuteDaysOfWeek, OneOffTripDate, DaysBetweenDelivery, Descriptor])


    //Updates the local transport list when the main one updates
    useEffect(() => {
        console.log("TransportListUpdated")
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
            SetJourneyDestination(props.mapDirections.MapMarkerLocation)
    
            let TransportItem = NewTransportItem;
            TransportItem.Duration = props.mapDirections.Duration;
            TransportItem.Distance = props.mapDirections.Distance;
            TransportItem.Destination = props.mapDirections.MapMarkerLocation;
            setNewTransportItem(TransportItem);

            console.log(NewTransportItem);
        }
      }, [props.mapDirections]);

    //resets values and informs the main layout that we are now in adding mode
    useEffect(() => {
        props.setInAddMode(AddNewTransportItemScreen);
        if(AddNewTransportItemScreen){
            //Resets values for adding new
            SetDescriptor(null);
            setNewTransportItem({});
            SetselectedVehicleType(null);
            SetselectedJourneyType(null);
            SetJourneyDistance(null);
            SetJourneyDuration(null);
            SetEmissionValue(null);
            SetPerTonGoods(false);
            SetTonnesOfGoods(null);
            SetPerPerson(false);
            SetPeople(null);
            SetTotalEmissionsPerTrip(null);
            SetOneOffTripDate(null);
            SetCommuteDaysOfWeek([]);
            SetDaysBetweenDelivery(null);
            SetWarningMessage(null);
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
            <Flex vertical>
                <p style={{lineHeight:'10px'}}>
                    Transport Methods
                </p>
                <div
                    id="scrollableDiv"
                    style={{
                        maxHeight: 400,
                        overflow: 'auto',
                        padding: '0 16px',
                        border: '1px solid rgba(140, 140, 140, 0.35)',
                    }}
                    >
                    <Collapse style={{margin:'10px', backgroundColor:'white'}} items={transportList.map( (item, i) =>{return {
                        key:i,
                        label:item.Descriptor,
                        children: 
                        <Flex vertical>
                            <p style={{lineHeight:'12px', margin:'4px'}}>Journey Distance: {item.Distance? item.Distance + 'm' : ''}</p>
                            <p style={{lineHeight:'12px', margin:'4px'}}>Co2 Emissions Per Journey: {item.EmissionsPerTrip? item.EmissionsPerTrip + 'g' : ''} </p>
                            <p style={{lineHeight:'12px', margin:'4px'}}>Vehicle Type: {item.TransportType? item.TransportType : ''}</p>
                            {item.JourneyType === 'One of trip' && <Flex justify='center' align='center'>One of date: <DatePicker style={{marginLeft:'10px'}} disabled defaultValue={item.oneOfTripDate}/></Flex>}
                            {item.JourneyType === 'Goods delivery' && <p style={{lineHeight:'12px', margin:'4px'}}>Delivery every: {item.daysBetweenDelivery? item.daysBetweenDelivery + ' days' : ''}</p>}
                            {item.JourneyType === 'Daily Commute' && <Flex justify='center' align='center'>Commute days: 
                                <Select
                                    mode="multiple"
                                    disabled
                                    style={{
                                    width: '100%',
                                    }}
                                    defaultValue={item.commuteDaysOfWeek}
                                    options={Days}
                                /></Flex>}
                            <Button style={{marginTop:'10px'}} onClick={() => props.SetTransportList(transportList.filter( (transportItem) => {return transportItem !== item} ))}> Remove </Button>

                        </Flex>
                        }} )}
                        />
                </div>
                <Flex style={{ width:'100%', alignContent:'center', justifyContent:'center', marginTop:'10px'}}>
                    {!OfficeLocationMode && 
                    <Button onClick={() =>{ SetNewTransportItemScreen(true) }} style={{marginRight:'5px'}}>
                        Add New Transport
                    </Button>}
                    
                    <Button onClick={() =>{ SetOfficeLocationMode(!OfficeLocationMode) }} style={{marginLeft:'5px'}}>
                        {OfficeLocationMode? 'Finish Setting Office Location' : 'Edit Office Location'}
                    </Button>
                </Flex>
                <Divider/>
                <Flex vertical style={{margin:'16px'}}>
                    <p style={{lineHeight:'10px'}}>
                        Co2 Emission Calculator
                    </p>
                    <RangePicker onChange={ (dates) => {SetSelectedStartDate(new Date(dates[0])); SetSelectedEndDate(new Date(dates[1])); } }/>
                    <Button style={{marginTop:'10px'}} onClick={CalculateEmissions}>
                            Calculate
                    </Button>
                    {TotalCo2Emissions && 
                    <>
                        <p style={{lineHeight:'10px'}}>
                            Total Co2 Emissions: {(TotalCo2Emissions/1000).toPrecision(4)} Kg Co2
                        </p>
                        <List dataSource={GroupedCo2Emissions} renderItem={ (item) => {
                            <List.Item>
                                {item.vehicle} | {item.Co2} 
                            </List.Item>
                        }}/>
                        <List
                            //header={<div>Header</div>}
                            //footer={<div>Footer</div>}
                            style={{backgroundColor:'white'}}
                            bordered
                            dataSource={GroupedCo2Emissions}
                            renderItem={(item) => (
                                <List.Item >
                                    {item.vehicle} | {(item.Co2/1000).toPrecision(4)}Kg Co2
                                </List.Item>
                            )}
                        />
                    </>

                    }

                </Flex>
            </Flex>

            </>
        }


        {/* Below is adding new items html */}

        {AddNewTransportItemScreen && 
            <div>
                <Flex vertical style={{margin:'10px'}}>
                    <p>
                        New transport method
                    </p>

                    <List style={{margin:'10px', backgroundColor:'white', borderRadius:'10px', textAlign: 'left', paddingLeft: '10px', paddingRight: '10px'}} >
                        <List.Item>
                            Descriptor/Name
                            <Input placeholder="Employee{1}_Commute" onChange={(e) => SetDescriptor(e.target.value)}/>
                        </List.Item>
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
                            Tonnes of goods
                            <Input placeholder="Ton's of goods" onChange={(e) => SetTonnesOfGoods(Number(e.target.value))} />
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

                        {selectedJourneyType === 'Daily Commute' &&
                        <List.Item>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{
                                width: '100%',
                                }}
                                placeholder="Please select"
                                defaultValue={['mon']}
                                onChange={ (value) => {console.log(value); SetCommuteDaysOfWeek(value);}}
                                options={Days}
                            />
                        </List.Item>
                        }

                        {selectedJourneyType === 'One of trip' &&
                        <List.Item>
                            Pick a date
                            <DatePicker style={{marginLeft:'10px'}} onChange={ (date) => {console.log(date); SetOneOffTripDate(date);}} />
                        </List.Item>
                        }

                        {selectedJourneyType === 'Goods delivery' &&
                        <List.Item>
                            Days between each delivery
                            <Input placeholder="Days between each delivery" onChange={(e) => SetDaysBetweenDelivery(Number(e.target.value))}/>
                        </List.Item>
                        }


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