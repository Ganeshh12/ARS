import { Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, Radio, Button, FormControlLabel } from '@mui/material';

function DownloadPdfOptions({isIndividual, setIsIndividual, showReportOptions, setShowReportOptions, handleOptionConfirm})
{
  return(
     <Dialog
        open={showReportOptions}
        onClose={() => setShowReportOptions(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Choose PDF Report Option</DialogTitle>
        <DialogContent>
          <RadioGroup
            value={isIndividual ? 'individual' : 'combined'}
            onChange={(e) => setIsIndividual(e.target.value === 'individual')}
          >
          <FormControlLabel
            value="individual"
            control={<Radio />}
            label="Generate separate PDF files for each student"
          />
          <FormControlLabel
            value="combined"
            control={<Radio />}
            label="Generate one combined PDF with all students"
          />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportOptions(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleOptionConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
};

export default DownloadPdfOptions;