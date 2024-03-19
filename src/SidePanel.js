import React, { useEffect, useState } from 'react';
import { Button, Card, Space } from 'antd';


const TransportItemDisplay = (props) => (
        <p key={props.i}> {props.name}</p>
)


function SidePanel(props) {

    const [AddNewTransportItem, SetNewTransportItem] = useState(false);


    const [transportList, setTransportList] = useState([]);

    useEffect(() => {
        console.log(props.TransportList);
        if(Array.isArray(props.TransportList))
            setTransportList(props.TransportList);
      }, [props.TransportList]);

    return (
        <>
        {!AddNewTransportItem && 
            <>
                {transportList.map((TransportItem, i) => TransportItemDisplay(TransportItem, i))}
                <Button onClick={() =>{ SetNewTransportItem(true) }}>
                    Add New transport type
                </Button>
            </>
        }
        {AddNewTransportItem && 
            <div>
                <Button onClick={() =>{ props.AddToTransportList({name:'asdasd'}); SetNewTransportItem(false) }}>
                    Add
                </Button>
                <Button onClick={() =>{ SetNewTransportItem(false) }}>
                    Cancel
                </Button>
            </div>
        }
        </>
)}




export default SidePanel;