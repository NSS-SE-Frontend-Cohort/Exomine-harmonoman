export const GovernorsDropdown = async () => {
    const governors = await fetch("http://localhost:8088/governors").then(res => res.json());
    console.log("governors: ", governors)

    const activeGovernors = governors.filter(gov => gov.status);



}