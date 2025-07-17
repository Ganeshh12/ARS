import { Card, CardContent, Box, Typography, Button, Divider, Chip } from '@mui/material';
import { motion } from 'framer-motion';


function RecentActivities({itemVariants, dashboardData}){
    return(  
        <motion.div variants={itemVariants}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                    Recent Activities
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {dashboardData.recentActivities.length > 0 ? (
                    dashboardData.recentActivities.map((activity, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Chip 
                                label={activity.type === 'achievement' ? 'Achievement' : 'Certification'} 
                                size="small" 
                                sx={{ 
                                    bgcolor: activity.type === 'achievement' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(176, 106, 179, 0.1)',
                                    color: activity.type === 'achievement' ? '#ff9800' : '#b06ab3',
                                    mr: 1
                                }} 
                                />
                                <Typography variant="caption" color="text.secondary">
                                {activity.date}
                                </Typography>
                            </Box>
                            <Typography variant="subtitle2">
                                {activity.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                by {activity.student}
                            </Typography>
                            </Box>
                        </Box>
                        {index < dashboardData.recentActivities.length - 1 && <Divider sx={{ my: 1.5 }} />}
                        </Box>
                    ))
                    ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        No recent activities found
                    </Typography>
                    )}
                    
                    <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mt: 1 }}
                    href="/faculty/achievements"
                    >
                    View All Activities
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}


export default RecentActivities;