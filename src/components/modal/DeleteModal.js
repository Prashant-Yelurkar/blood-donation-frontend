import React from "react";
import styles from "./deleteModal.module.css";

const DeleteConfirmModal = ({title, open, name, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Delete {title}</h3>
        <p>
          Are you sure you want to delete{" "}
          <br/>
          <strong>{name}</strong>?
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
