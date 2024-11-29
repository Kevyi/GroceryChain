import React, { useState, useEffect, useContext } from 'react';
import styles from "../styles/RegisterLogin.module.css"; // Import the CSS module
import { Link, useNavigate } from 'react-router-dom';
import {LoginContext} from "../App.jsx"

export default function RegisterLoginPage() {
    const [Modal, setModal] = useState(false); // Manage modal visibility state
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    
    //Gets the LoggedIn State from App.jsx, imported
    const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext);

    // useEffect to handle adding/removing the body class for scroll locking
    useEffect(() => {
        if (Modal) {
            document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
            document.body.style.overflow = 'auto'; // Unlock scroll
        }

        // Cleanup function to reset overflow when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [Modal]);

    const login = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:8080/register-login/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            })
            const data = await response.json();

            localStorage.setItem('token', data.token);
            
            if(!data.token){
                alert("Invalid Login")
            }else{
                setIsLoggedIn(true);
                alert(data.token)
                navigate("/grocery-page");
            }


        }
        catch(error){
            console.error('Error during login:', error);
        }
    
    };


    const handleChangeLogin = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    

    // Toggle the modal visibility
    const handleOpenModal = () => {
        setModal(!Modal);
    };
    

    return (
        <div id="main" className={styles.main}>
            <div className={styles.loginBox}>
                <h1>Log In</h1>

                <form className = {styles["register-login-form"]} onSubmit = {login}>
                    <label htmlFor="email"><h2>Email:</h2></label>

                    <input type="email" 
                        value={formData.email} 
                        onChange={handleChangeLogin} 
                        name="email" 
                        placeholder="Enter your email"
                        required />
                    <label htmlFor="password"><h2>Password:</h2></label>

                    <input type="password" 
                        value={formData.password} 
                        onChange={handleChangeLogin} 
                        name="password" 
                        required
                        placeholder="Enter your password"/>
                    <div>
                        Don't have an account?{' '}
                        <a href="#" className={styles.inlineTextContainer} onClick={handleOpenModal}>Sign up</a>
                    </div>
                    <div className={styles.spacingBetweenSubmitBox}></div>
                    <input type="submit" value="Login" className={styles.greenButton}/>
                </form>
            </div>

            {Modal && <RegistrationModal onClose={handleOpenModal} />}
        </div>
    );
}

function RegistrationModal({ onClose }) {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({ 
        email: '', 
        password: '', 
        confirmPassword : '', 
        name : '', 
        isAdmin : false,
        address : '',
        creditCard : ''
    });

    const register = async (e) => {
        e.preventDefault();
    
        if (registerData.password !== registerData.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }

        //isAdmin returns on? Instead of true.
        // console.log(registerData)
    
        try {
          const response = await fetch('http://localhost:8080/register-login/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: registerData.email,
              password: registerData.password,
              name: registerData.name,
              isAdmin : registerData.isAdmin,
              address : registerData.address,
              creditCard : registerData.creditCard,
              
                //Passes a json object but string form
              transactions : JSON.stringify([])
            }),
          });
    
          const data = await response.json();
          if (response.ok) {
            alert('Registration successful!');
            console.log('Server response:', data);
            onClose(); //maybe just close register page.
            navigate('/login-page'); // Redirect to login page on success
          } else {
            alert('Registration failed!');
            console.error('Server error:', data);
          }
        } catch (error) {
          console.error('Network error:', error);
          alert('There was a problem submitting the form.');
        }
      };

    const handleChangeRegister = (e) =>{
        const { name, value, type, checked } = e.target;
        setRegisterData({ ...registerData, [name]: type === 'checkbox' ? checked : value, });
      };


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.registrationBox}>
                <form className = {styles["register-login-form"]} onSubmit = {register}>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                    <h1>Create An Account</h1>

                        <input type="email" 
                            name="email"
                            value = {registerData.email}  
                            onChange={handleChangeRegister}   
                            className={styles.inputBox} 
                            placeholder='Email Address'
                            required> 
                        </input>
                        
                    <div className={styles.textBoxSpacing}></div>

                        <input type="text" 
                            name="name"
                            value = {registerData.name}
                            onChange={handleChangeRegister}   
                            className={styles.inputBox} 
                            placeholder='Name'
                            required>
                        </input>

                    <div className={styles.textBoxSpacing}></div>

                        <input type="password" 
                            name="password" 
                            value = {registerData.password}
                            onChange={handleChangeRegister}   
                            className={styles.inputBox} 
                            minlength = "8"
                            placeholder='Password'
                            required>
                        </input>

                    <div className={styles.textBoxSpacing}></div>

                        <input type="password" 
                            name="confirmPassword"  
                            value = {registerData.confirmPassword}
                            onChange={handleChangeRegister}   
                            className={styles.inputBox} 
                            minlength = "8"
                            placeholder='Confirm Password'
                            required>
                        </input>

                    <div className={styles.textBoxSpacing}></div>
                    <h2>Credit Card</h2>
                    <div className={styles.textBoxSpacing2}></div>

                        <input type="number" 
                            name="creditCard"  
                            value = {registerData.creditCard}
                            onChange={handleChangeRegister}     
                            className={styles.inputBox} 
                            placeholder='Credit Card Details'
                            minlength = "15"
                            required>
                        </input>

                   

                    <div className={styles.textBoxSpacing}></div>

                    <h2>Residential Address</h2>
                    <div className={styles.textBoxSpacing2}></div>

                        <input type="text" 
                            name="address"  
                            value = {registerData.address}
                            onChange={handleChangeRegister}     
                            className={styles.inputBox} 
                            placeholder='Address'
                            required>
                        </input>
                    <div className={styles.textBoxSpacing}></div>

                    <div className={styles.inLineFlex}>
                            <h4>Admin Registration: </h4> 

                            {/* Checkmark can't be unchecked */}
                            <input 
                                name="isAdmin"
                                type="checkbox" 
                                checked = {registerData.isAdmin}
                                onChange={handleChangeRegister}   
                             />
                    </div>
                    <div className={styles.textBoxSpacing}></div>
                        <input 
                            type="submit" 
                            value="Register the Account" 
                            className={styles.registrationButton}>
                        </input>
                </form>

            </div>
        </div>
    );
}
