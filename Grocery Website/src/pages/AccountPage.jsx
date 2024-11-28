import React, { useState, useEffect } from 'react';
import styles from "../styles/account.module.css"

export default function AccountPage(){
    const [userInfo, setUserInfo] = useState({ 
        email: '', 
        password: '', 
        confirmPassword : '', 
        name : '', 
        address : '',
        isAdmin: false,
        creditCard : ''
    });

    //replace data.
    // const register = async (e) => {
    //     e.preventDefault();
    
    //     if (registerData.password !== registerData.confirmPassword) {
    //       alert('Passwords do not match!');
    //       return;
    //     }

    //     //isAdmin returns on? Instead of true.
    //     console.log(registerData)
    
    //     try {
    //       const response = await fetch('http://localhost:8080/register-login/register', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           email: registerData.email,
    //           password: registerData.password,
    //           name: registerData.name,
    //           isAdmin : registerData.isAdmin,
    //           address : registerData.address
    //         }),
    //       });
    
    //       const data = await response.json();
    //       if (response.ok) {
    //         alert('Registration successful!');
    //         console.log('Server response:', data);
    //         onClose(); //maybe just close register page.
    //         navigate('/login-page'); // Redirect to login page on success
    //       } else {
    //         alert('Registration failed!');
    //         console.error('Server error:', data);
    //       }
    //     } catch (error) {
    //       console.error('Network error:', error);
    //       alert('There was a problem submitting the form.');
    //     }
    //   };

    
    function getUserInformation() {

        const getToken = async () => {
          const token = localStorage.getItem('token');
    
          //Means the user is logged out.
          if(token == "No token")return;
    
          try{
            //This post is in the server.js
            const response = await fetch('http://localhost:8080/verifying-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({token: token}),
            })
            
            const data = await response.json();

            //data contains: name : user.name, email: user.email, password : user.password, isAdmin : user.isAdmin, address, creditCard}
            //Do everything except the confirm password.
                //For some reason it can only be called once.
                //Pre-populates the information of the user.
            setUserInfo({ ...userInfo, email: data['email'], name: data['name'], address: data['address'], isAdmin : data["isAdmin"],
                creditCard : data["creditCard"]
            });
            // for (const key in Object.keys(data)) {
 
            //     let value = data[key]
            //     setUserInfo({ ...userInfo, key: value, });
            //     console.log(data[key])

            // }

          }
          catch(error){
            console.log(error)
          }
            
        };
      
        getToken();
        
      }

    const handleInformationChange = (e) =>{
        const { name, value, type, checked } = e.target;
        setUserInfo({ ...userInfo, [name]: type === 'checkbox' ? checked : value, });
      };


    const verifyData = (e) => {
        if (userInfo.password !== userInfo.confirmPassword) {
            alert('Passwords do not match!');
            return;
          }
        else if(userInfo.address === '' || userInfo.name === ''){
            alert('Enter all information!');
            return;
        }

    }

    useEffect(() => {
        getUserInformation();
      }, []); //One time render

    return(<>
    
        <div className = {styles["main"]}>
            
            <div className = {styles["form-div"]}>
                
                <form className = {styles["change-form"]}>
                        <h1>Account Details</h1>
                        <input type="email" 
                            name="email"
                            value = {userInfo.email}  
                            onChange={handleInformationChange}   
                            className={styles.inputBox} 
                            placeholder='Email Address'
                            required
                            > 
                        </input>

                        <input type="text" 
                            name="name"
                            value = {userInfo.name}
                            onChange={handleInformationChange}   
                            className={styles.inputBox} 
                            placeholder='Name'
                            required
                            >
                        </input>

                        <input type="password" 
                            name="password" 
                            value = {userInfo.password}
                            onChange={handleInformationChange}   
                            className={styles.inputBox} 
                            minlength = "8"
                            placeholder='Password'
                            required
                            >
                        </input>

                        <input type="password" 
                            name="confirmPassword"  
                            value = {userInfo.confirmPassword}
                            onChange={handleInformationChange}   
                            className={styles.inputBox} 
                            minlength = "8"
                            placeholder='Confirm Password'
                            required
                            >
                        </input>

                     <h2> Credit Card</h2>

                        <input type="number" 
                            name="creditCard"  
                            value = {userInfo.creditCard}
                            onChange={handleInformationChange}     
                            className={styles.inputBox} 
                            placeholder='Credit Card'
                            minlength = "15"
                            required
                            >
                        </input>

                    <h2> Address</h2>

                        <input type="text" 
                            name="address"  
                            value = {userInfo.address}
                            onChange={handleInformationChange}     
                            className={styles.inputBox} 
                            placeholder='Address'
                            required
                            >
                        </input>

                        <button type="submit" className={styles["change-button"]}>
                            Change Details
                        </button>
                </form>
            </div>
            
            <div className = {styles["display-transactions"]}>
                <h1>Transactions</h1>
                {/* Put the transaction table here populated with the transactions. Maybe sort by date */}
            </div>

        </div>
    </>)
}