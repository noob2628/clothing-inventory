// src/app/components/DeleteConfirmation.js
'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, CircularProgress } from '@mui/material';
import styles from './DeleteConfirmation.module.css';

export default function DeleteConfirmation({ 
  open, 
  onClose, 
  onConfirm,
  title = "Delete Product",
  message = "Are you sure you want to delete this product? This action cannot be undone.",
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? null : onClose} className={styles.dialog}>
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained" 
            className={styles.confirmButton}
            disabled={loading}
            autoFocus
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
