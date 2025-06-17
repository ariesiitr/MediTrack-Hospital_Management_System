import { useEffect, useState } from "react";
import GenericMasterTableView from "../components/MasterDataTable";
import { Container } from "@mui/material";
import API_BASE_URL from '../apiConfig';

function FacilityMaster(){
    const [data,setData] = useState([]);
    useEffect(() => {
        const fetchData = async() => {
            try{
                let res = await fetch(`${API_BASE_URL}/facility-master`);
                let data = await res.json();

                if(res.ok){
                    const dataWithIds = data.map((item,i) => ({
                        id: i+1,
                        ward_name : item.ward_name,
                        room_number : item.room_number,
                        bed_number : item.bed_number,
                        ward_charges : item.ward_charges,
                    }));
                    setData(dataWithIds);
                }else{
                    console.log("Res is not ok");
                }
            }catch(err){
                console.log("Error is ",err);
            }
        }
        fetchData();
    },[])

    const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'ward_name', headerName: 'Ward', width: 150 },
    { field: 'room_number', headerName: 'Room number', width: 150 },
    { field: 'bed_number', headerName: 'Bed number', width: 150 },
    { field: 'ward_charges', headerName: 'Ward Charges', width: 150 },

    ];

    return(
        <div>
            <Container maxWidth="lg">
                {<GenericMasterTableView columns={columns} rows={data} title={"Facility Master"}/>}
            </Container>
        </div>
    )
}

export default FacilityMaster;