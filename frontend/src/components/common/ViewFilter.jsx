import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useStudentFilter } from "../../contexts/StudentFilterContext";

const ViewFilter = () => {
  const { studentFilter, setStudentFilter } = useStudentFilter();

  const handleChange = (event) => {
    setStudentFilter(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>View</InputLabel>
      <Select value={studentFilter} onChange={handleChange} label="View">
        <MenuItem value="proctoring">My Students</MenuItem>
        <MenuItem value="all">All Students</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ViewFilter;


