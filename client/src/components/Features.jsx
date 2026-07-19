import "../styles/Features.css";
function Features(){

     return(
        <>
            <section className="features">
            <h2 className = "section-title">Features</h2>
            <div className = "feature-grid">
                <div className = "feature-card">
                  <h3>🔒 Secure Rooms</h3>
                  <p>Private and secure</p> 
               
             </div>

             <div className = "feature-card">
               <h3>⚡Fast Performance</h3>
               <p>Instant updates</p>
             </div>

             <div className = "feature-card">
                  <h3>💬Live Chat</h3>
                  <p>Chat with members</p>
             </div>

             
             <div className = "feature-card">
                  <h3>📂 File Sharing </h3>
                  <p>Share documents</p>
               
             </div>
             
             
             <div className = "feature-card">
               
                  <h3>👥 Team Collaboration </h3>
                  <p>Work together</p> 
               
             </div>

             <div className = "feature-card">
               <h3>☁ Cloud Sync</h3>
               <p>Access anywhere</p>
             </div>
             
            </div>
             
          </section>
        </>
     );

}

export default Features;
