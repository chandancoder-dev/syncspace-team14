import { useState } from "react";
import { useNavigate, Link, useSearchParams, Navigate } from "react-router-dom";
import axios from "axios";
function ForgetPassword(){

    const [newPassword , setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const [showNewPassword , setShowNewPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();
    const handleOnSubmit = async(e) =>{
        e.preventDefault();

        
        if(!newPassword || !confirmPassword){
            alert("Please fill in both password fields.");
            return;
        }
        if(newPassword !== confirmPassword){
            alert("password don't match.");
            return;
        }

        if(newPassword.length < 6){
            alert("Password must be atleast 6 charecters");
            return;
        }
        try{
               const res = await axios.post(
              `${import.meta.env.VITE_SERVER_URL || "http://localhost:8000"}/api/auth/reset-password`,
              {
                 email : email,
                 password : newPassword,
              },
             );

             navigate("/login");
        }
        catch(e){
          console.log(e);
             alert(e.response?.data?.message || "password reset failed");
        }
    }
    const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    fontFamily: "Poppins, sans-serif",
  },

  card: {
    width: "420px",
    backgroundColor: "#FFFFFF",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    color: "#1E293B",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginBottom: "25px",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    gap: "8px",
    color: "#475569",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },

  register: {
    textAlign: "center",
    marginTop: "20px",
    color: "#475569",
    fontSize: "14px",
  },
};
    return (
        <div style = {styles.container}>
            
        <form onSubmit={handleOnSubmit} style = {styles.card}>
        <h2 style={styles.title}>Reset Password</h2>

        <p style={styles.subtitle}>
             Enter your email and choose a new password.
        </p>
               <input type="email"
               value = {email}
               placeholder="email"
               onChange={(e)=> setEmail(e.target.value)}
               required
               style={styles.input}
                />
               <input type= {showNewPassword ? "text" : "password"}
               placeholder="new password"
               id="showNewPassword"
               value = {newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               required
               style={styles.input}
               />
            <div style = {styles.checkboxContainer}>
               <input
            type="checkbox"
            id="showNewPassword"
            checked={showNewPassword}
            onChange={() => setShowNewPassword(!showNewPassword)}
          />

          <label htmlFor="showNewPassword">Show New Password</label>
            </div>
               
               <input type= {showConfirmPassword ? "text" : "password"}
               placeholder="confirm password"
               id = "showConfirmPassword"
               value = {confirmPassword}
               onChange={ (e) => setConfirmPassword(e.target.value)}
               required
               style={styles.input}
               />

            <div style = {styles.checkboxContainer}>
               <input
            type="checkbox"
            id="showConfirmPassword"
            checked={showConfirmPassword}
            onChange={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <label htmlFor="showConfirmPassword">Show Confirm Password</label>
            </div>

               <button type="submit" style = {styles.button}>Submit</button>
        </form>
        </div>
        
    );
}

export default ForgetPassword;