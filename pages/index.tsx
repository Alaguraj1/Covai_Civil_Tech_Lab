import React, {useState, useEffect} from "react"

const Index = () => {

    // useEffect(() => {
    //     const userName = localStorage.getItem("username")
    //     console.log("userName", userName)
    // })
    if (typeof window !== 'undefined') {
        console.log(window.innerWidth);
        console.log(window.innerHeight);
      }

    return (
        <>
            <div>
                <h1>starter page</h1>
            </div>
        </>
    );
};

export default Index;
