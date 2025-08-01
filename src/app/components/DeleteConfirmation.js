// src/app/components/DeleteConfirmation.js
'use client';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';
import styles from './DeleteConfirmation.module.css';

export default function DeleteConfirmation({ 
  open, 
  onClose, 
  onConfirm,
  title = "Delete Product",
  message = "Are you sure you want to delete this product? This action cannot be undone."
}) {
  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog}>
      <div className={styles.container}>
        <DialogTitle className={styles.title}>{title}</DialogTitle>
        
        <DialogContent>
          <div className={styles.message}>{message}</div>
        </DialogContent>
        
        <DialogActions className={styles.actions}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="contained" 
            className={styles.confirmButton}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}