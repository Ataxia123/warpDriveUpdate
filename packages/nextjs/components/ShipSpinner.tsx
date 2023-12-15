import Image from "next/image";
import styles from "../styles/spinner.module.css";

// Correct path to your CSS module

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <Image
        src="/spinner.png"
        alt="Loading..."
        layout="fixed"
        width={50} // Set your desired width
        height={50} // Set your desired height
      />
    </div>
  );
};

export default Spinner;
