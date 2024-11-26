import React, { useState, useEffect } from 'react';
import styles from "../styles/RegisterLogin.module.css"; // Import the CSS module

export default function RegisterLoginPage() {
    const [Modal, setModal] = useState(false); // Manage modal visibility state
    const [formData, setFormData] = useState({ email: '', password: '' });
    


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
            alert(data.token)
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
    const [registerData, setRegisterData] = useState({ 
        email: '', 
        password: '', 
        confirmPassword : '', 
        name : '', 
        isAdmin : false});

    const register = async (e) => {
        e.preventDefault();
    
        if (registerData.password !== registerData.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }

        //isAdmin returns on? Instead of true.
        console.log(registerData)
    
        try {
          const response = await fetch('http://localhost:8080/register-login/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: registerData.email,
              password: registerData.password,
              name: registerData.name,
              isAdmin : registerData.isAdmin
            }),
          });
    
          const data = await response.json();
          if (response.ok) {
            alert('Registration successful!');
            console.log('Server response:', data);
            onClose(); //maybe just close register page.
            navigate('/login'); // Redirect to login page on success
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
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
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
                            placeholder='Email Address'> 
                        </input>
                        
                    <div className={styles.textBoxSpacing}></div>

                        <input type="text" 
                            name="name"
                            value = {registerData.name}
                            onChange={handleChangeRegister}   
                            className={styles.inputBox} 
                            placeholder='Name'>
                        </input>

                    <div className={styles.textBoxSpacing}></div>

                        <input type="password" 
                            name="password" 
                            value = {registerData.password}
                            onChange={handleChangeRegister}   
                            className={styles.inputBox} 
                            minlength = "8"
                            placeholder='Password'>
                        </input>

                    <div className={styles.textBoxSpacing}></div>

                        <input type="password" 
                            name="confirmPassword"  
                            value = {registerData.confirmPassword}
                            onChange={handleChangeRegister}   
                            className={styles.inputBox} 
                            minlength = "8"
                            placeholder='Confirm Password'>
                        </input>

                    <div className={styles.textBoxSpacing}></div>

                    <h2> Date of Birth</h2>
                    <div className={styles.textBoxSpacing2}></div>

                        <input type="date" 
                            name="dateOfBirth"  
                            className={styles.inputBox} 
                            placeholder='Date of Birth'>
                        </input>

                    <div className={styles.textBoxSpacing}></div>

                        <input type="text" 
                            name="Country"  
                            className={styles.inputBox} 
                            placeholder='Country'>
                        </input>

                    <div className={styles.textBoxSpacing}></div>
                    <div className={styles.inLineFlex}>
                            <h4>Are you an admin?</h4> 
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
