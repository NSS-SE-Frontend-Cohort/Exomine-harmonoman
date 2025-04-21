export const DisplayFacilities = async () => {
    const facilities = await fetch("http://localhost:8088/facilities").then(res => res.json());
    console.log("facilities: ", facilities);
    
}