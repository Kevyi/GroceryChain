import styles from "../styles/RegisterLogin.module.css"; // Import the CSS module

export default function RegisterLoginPage() {
    return (
        <div id="main" className={styles.main}>
            <div className={styles["login-box"]}>
                <h1>Log in</h1>
                <label htmlFor="username"><h2>Username: </h2></label>
                <input type="text" name="username"></input>
                <label htmlFor="password"><h2>Password: </h2></label>
                <input type="password" name="Password"></input>
                <div className={styles.buttonSpacing}>
                <input type="submit" value="Login"></input>
                </div>
            </div>
        </div>
    );
}
