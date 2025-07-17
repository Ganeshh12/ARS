import { Card, CardContent, Divider, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

function TopPerformingStudents({itemVariants, dashboardData}) {
    return( 
        <motion.div variants={itemVariants}>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                    Top Performing Students
                    </Typography>

                    <Divider sx={{ mb: 2 }} />
                    
                    {dashboardData.topStudents.map((student, index) => (
                    <Box key={student.id} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                            sx={{ 
                                width: 30, 
                                height: 30, 
                                borderRadius: '50%', 
                                bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#4568dc',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                mr: 1.5
                            }}
                            >
                            {index + 1}
                            </Box>

                            <Box>
                            <Typography variant="subtitle2">
                                {student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {student.regNo}
                            </Typography>
                            </Box>

                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4568dc' }}>
                            {student.cgpa}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                            CGPA
                            </Typography>
                        </Box>
                        
                        </Box>
                        {index < dashboardData.topStudents.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </Box>
                    ))}
                    
                    <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mt: 1 }}
                    href="/faculty/students"
                    >
                    View All Students
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default TopPerformingStudents;