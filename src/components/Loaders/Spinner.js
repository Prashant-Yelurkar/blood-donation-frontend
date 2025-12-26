import styles from "./spinner.module.css";

const Spinner = ({ size = 24 }) => {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
