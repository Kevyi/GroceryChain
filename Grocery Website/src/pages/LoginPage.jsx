import React, { useState } from 'react';
import styles from "../styles/RegisterLogin.module.css"; // Import the CSS module

export default function RegisterLoginPage() {
    const [showModal, setShowModal] = useState(false); // Manage modal visibility state

    // Function to open the modal
    const handleOpenModal = () => {
        setShowModal(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

      return (
        <div id="main" className={styles.main}>
            <div className={styles["login-box"]}>
                <div className='loginTitle'>
                    <h1>Log in</h1>
                </div>
                <label htmlFor="username"><h2>Username: </h2></label>
                <input type="text" name="username"></input>
                <div className={styles.spacing}></div>
                <label htmlFor="password"><h2>Password: </h2></label>
                <input type="password" name="Password"></input>
                <div>
                    Don't have an account? <a href="#" className={styles.inLineText} onClick={handleOpenModal}>Sign up</a>
                </div>
                <div className={styles.buttonSpacing}>
                    <input type="submit" value="Login" className={styles.submitButton}></input>
                </div>
            </div>

            {showModal && <RegistrationModal onClose={handleCloseModal} />}
        </div>
    );
}

function RegistrationModal({ onClose }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h1 className={styles.centerRegistration}>Create An Account</h1>
                <input type="text" name="Email Address"  className={styles.inputBox} placeholder='Email Address'></input>
                <div className={styles.spacingForTextBlocks}></div>
                <input type="text" name="usernameRegistration"  className={styles.inputBox} placeholder='Username'></input>
                <div className={styles.spacingForTextBlocks}></div>
                <input type="password" name="password"  className={styles.inputBox} placeholder='Password'></input>
                <div className={styles.spacingForTextBlocks}></div>
                <input type="password" name="confirmedPassword"  className={styles.inputBox} placeholder='Confirmed Password'></input>
                <center><h4>Date of Birth</h4></center>
                <input type="date" name="dateOfBirth"  className={styles.inputBox} placeholder='Date of Birth'></input>
                <div className={styles.spacingForTextBlocks}></div>
                <input type="text" name="Country"  className={styles.inputBox} placeholder='Country'></input>
                <div className={styles.spacingForTextBlocks}></div>
                <input type="submit" value="Register the Account" className={styles.registrationButton}></input>
                

            </div>
        </div>
    );
}
