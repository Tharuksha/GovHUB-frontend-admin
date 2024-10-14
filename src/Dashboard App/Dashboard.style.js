
import { makeStyles } from '@mui/styles';

const DashboardStyle = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '96%',
        height: '100%',
        padding: '20px 0 0 20px ',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        height: '100%',
        padding: '20px 0 0 20px ',
    },
    leftSection: {
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
    },
    rightSection: {
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
    },
    performanceCard: {
        width: '97%',
        height: '40px',
        backgroundColor: '#F0F0F0',
        boxShadow: '1px 1px 1px 0px rgba(0,0,0,0.25)',
        borderRadius: '5px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        '&:hover': {
            boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.5)',
            cursor: 'pointer',
        }
    }
}));

export default DashboardStyle;