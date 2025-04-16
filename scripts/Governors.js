export const GovernorsDropdown = async () => {
    const governors = await fetch("http://localhost:8088/governors").then(res => res.json());
    console.log("governors: ", governors)

    // Filter active governors from inactive
    const activeGovernors = governors.filter(gov => gov.status);
    console.log("activeGovernors: ", activeGovernors)



}