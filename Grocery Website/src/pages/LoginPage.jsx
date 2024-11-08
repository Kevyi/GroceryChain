import React, { useState, useEffect } from 'react';
import styles from "../styles/RegisterLogin.module.css"; // Import the CSS module

export default function RegisterLoginPage() {
    const [Modal, setModal] = useState(false); // Manage modal visibility state

    // Toggle the modal visibility
    const handleOpenModal = () => {
        setModal(!Modal);
    };

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

    return (
        <div id="main" className={styles.main}>
            <div className={styles.loginBox}>
                <h1>Log In</h1>
                <label htmlFor="username"><h2>Username:</h2></label>
                <input type="text" name="username" />
                <label htmlFor="password"><h2>Password:</h2></label>
                <input type="password" name="password" />
                <div>
                    Don't have an account?{' '}
                    <a href="#" className={styles.inlineTextContainer} onClick={handleOpenModal}>Sign up</a>
                </div>
                <div className={styles.spacingBetweenSubmitBox}></div>
                <input type="submit" value="Login" className={styles.greenButton} />
            </div>
            {Modal && <RegistrationModal onClose={handleOpenModal} />}
        </div>
    );
}

function RegistrationModal({ onClose }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.registrationBox}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h1>Create An Account</h1>
                <input type="text" name="Email Address"  className={styles.inputBox} placeholder='Email Address'></input>
                <div className={styles.textBoxSpacing}></div>
                <input type="text" name="usernameRegistration"  className={styles.inputBox} placeholder='Username'></input>
                <div className={styles.textBoxSpacing}></div>
                <input type="password" name="password"  className={styles.inputBox} placeholder='Password'></input>
                <div className={styles.textBoxSpacing}></div>
                <input type="password" name="confirmedPassword"  className={styles.inputBox} placeholder='Confirmed Password'></input>
                <div className={styles.textBoxSpacing}></div>
                <h2> Date of Birth</h2>
                <div className={styles.textBoxSpacing2}></div>
                <input type="date" name="dateOfBirth"  className={styles.inputBox} placeholder='Date of Birth'></input>
                <div className={styles.textBoxSpacing}></div>
                <input type="text" name="Country"  className={styles.inputBox} placeholder='Country'></input>
                <div className={styles.textBoxSpacing}></div>
                <div className={styles.inLineFlex}>
                        <h4>Are you an admin?</h4> 
                        <input type="checkbox" name="isAdmin" />
                </div>
                <div className={styles.textBoxSpacing}></div>
                <input type="submit" value="Register the Account" className={styles.registrationButton}></input>
            </div>
        </div>
    );
}
