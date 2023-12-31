import { Theme } from '../../../Styling/Theme';
import { createUseStyles } from 'react-jss';
import { Typography, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { getCreateTicketDescription } from '../../../Redux/Selectors';
import { SET_CREATE_TICKET_DESCRIPTION } from '../../../Redux/Actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import { CreateTicketRequest } from '../../../Models/RequestModels/CreateTicketRequest';

const useStyles = createUseStyles((theme: Theme) => {
	return {
		root: {
			height: 'calc(100% - 80px)',
			'& > :not(style)': { marginBottom: "10px" },
		},
		downloadBox: {
			borderColor: theme.backgroundSecondary,
			border: '1px solid',
			borderStyle: 'dashed',
			borderRadius: '5px',
			height: '50%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
	};
});

export const StepTwo: React.FC<{ dispatch: AppDispatch, createTicketRequest: CreateTicketRequest, setCreateTicketRequest: (val: CreateTicketRequest) => void }> = ({ dispatch, createTicketRequest, setCreateTicketRequest }) => {
	const classes = useStyles();

	return (
		<>
			<div className={classes.root}>
				<Typography variant="h5" textAlign={"center"} sx={{ paddingBottom: 2 }}>
					Project Information
				</Typography>
				<TextField
					id="company-description-input"
					label="Ticket Description"
					multiline
					rows={4}
					value={createTicketRequest.description}
					onChange={(e) => setCreateTicketRequest({ ...createTicketRequest, description: e.target.value })}
					sx={{ width: "100%" }}
				/>
				<div className={classes.downloadBox}>
					<FontAwesomeIcon icon={faCloudArrowDown} size='4x' color={"#75BC5B"} />
					<Typography variant="body1" textAlign={"center"} sx={{ paddingLeft: 2 }}>
						Drag and Drop, or browse your files
					</Typography>
				</div>
			</div>
		</>
	);
}