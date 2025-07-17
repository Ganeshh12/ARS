import { Select, InputLabel, MenuItem, Box, FormControl } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';

function ReportFormat({reportFormat, setReportFormat}) {

    const handleReportFormatChange = (e)=>{
        setReportFormat(e.target.value);
    }

    return(
    <FormControl fullWidth margin="normal">
        <InputLabel>Report Format</InputLabel>
        <Select
            value={reportFormat}
            onChange={handleReportFormatChange}
            label="Report Format"
            defaultValue={'pdf'}
        >
            <MenuItem value="pdf">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PictureAsPdfIcon sx={{ mr: 1, color: 'error.main' }} />
                PDF Document
            </Box>
            </MenuItem>
            <MenuItem value="excel">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TableChartIcon sx={{ mr: 1, color: 'success.main' }} />
                Excel Spreadsheet
            </Box>
            </MenuItem>
        </Select>
    </FormControl>
    )
}

export default ReportFormat;