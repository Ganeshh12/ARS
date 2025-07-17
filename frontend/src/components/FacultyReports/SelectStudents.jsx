import {
  Autocomplete,
  FormControl,
  TextField,
  CircularProgress,
  Chip,
} from '@mui/material';

function SelectStudents({ students, selectedStudents, setSelectedStudents, loading }) {
  return (
    <FormControl fullWidth margin="normal">
      <Autocomplete
        multiple
        options={students || []}
        getOptionLabel={(student) =>
          `${student.name} (${student.registration_number})`
        }
        value={selectedStudents}
        onChange={(_event, newValue) => setSelectedStudents(newValue)}
        renderTags={(selected, getTagProps) =>
          selected.map((student, idx) => {
            const { key, ...chipProps } = getTagProps({ index: idx });
            return (
              <Chip
                key={student.registration_number}
                label={`${student.name} (${student.registration_number})`}
                {...chipProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Students"
            placeholder="Students"
          />
        )}
        slotProps={{
          listbox: {
            sx: {
              maxHeight: 5 * 48,
              overflow: 'auto',
            },
          },
          input: {
            // ✅ Add loading spinner via adornment here
            endAdornment: loading ? (
              <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} />
            ) : null,
          },
        }}
        sx={{ width: 730 }}
      />
    </FormControl>
  );
}

export default SelectStudents;
