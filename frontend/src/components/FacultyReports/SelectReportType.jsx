import {
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';


function SelectReportType({reportType, setReportType}) {

    const handleReportTypeChange = (e)=>{
        setReportType(e.target.value);
    }

    return(
    <FormControl fullWidth margin="normal">
        <InputLabel>Report Type</InputLabel>
            <Select
                value={reportType}
                onChange={handleReportTypeChange}
                label="Report Type"
            >
                <MenuItem value="semester">Semester Performance</MenuItem>
                <MenuItem value="cumulative">Cumulative Performance</MenuItem>
                <MenuItem value="achievements">Achievements</MenuItem>
                <MenuItem value="certifications">Certifications</MenuItem>
                <MenuItem value="attendance">Attendance</MenuItem>
            </Select>
    </FormControl>
    );
}

export default SelectReportType;