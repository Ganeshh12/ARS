import {motion} from 'framer-motion';
import {Card,CardContent,Typography,Box} from '@mui/material';
import { Bar } from 'react-chartjs-2';



function BranchDistribution({itemVariants,dashboardData}) {

    const branchChartData = {
      labels: dashboardData.branchDistribution.map(item => item.branch),
      datasets: [
        {
          label: 'Students',
          data: dashboardData.branchDistribution.map(item => item.count),
          backgroundColor: [
            'rgba(69, 104, 220, 0.8)',
            'rgba(176, 106, 179, 0.8)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(255, 152, 0, 0.8)',
            'rgba(33, 150, 243, 0.8)'
          ],
          borderColor: [
            'rgba(69, 104, 220, 1)',
            'rgba(176, 106, 179, 1)',
            'rgba(76, 175, 80, 1)',
            'rgba(255, 152, 0, 1)',
            'rgba(33, 150, 243, 1)'
          ],
          borderWidth: 1
        }
      ]
    };

    return(
        <motion.div variants={itemVariants}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                    Branch Distribution
                    </Typography>
                    <Box sx={{ height: 380 }}>
                    <Bar 
                        data={branchChartData} 
                        options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                            display: false
                            }
                        }
                        }} 
                    />
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default BranchDistribution;