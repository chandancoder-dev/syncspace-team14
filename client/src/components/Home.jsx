import { useState } from "react";
import Features from "./Features";

import "../styles/hero.css"
function Home(){

     return(
        <>
          
          <section className="hero">
              <h1>🚀 Work Together in Real-Time</h1>
              <p>Create secure rooms and collaborate with your teammates
               from anywhere in the world instantly.
          </p>

          <div className="hero-buttons">

                    <button className="primary-btn">
                        Create Room
                    </button>

                    <button className="secondary-btn">
                        Join Room
                    </button>

                </div>

          </section>
           
     
        <Features/>
         
        </>
     )
}

export default Home;