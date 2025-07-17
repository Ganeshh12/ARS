import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
function PdfTemplateStyle({pdfTemplateStyle, setPdfTemplateStyle}) {
    const handlePdfTemplateStyleChange = (e)=>{
        setPdfTemplateStyle(e.target.value);
    }
    return(
    <FormControl fullWidth margin="normal">
        <InputLabel>Template Style</InputLabel>
        <Select
            value={pdfTemplateStyle}
            onChange={handlePdfTemplateStyleChange}
            label="Template Style"
        >
            <MenuItem value="classic">Classic</MenuItem>
            <MenuItem value="modern">Modern</MenuItem>
            <MenuItem value="minimal">Minimal</MenuItem>
        </Select>
    </FormControl>
    )
}

export default PdfTemplateStyle;