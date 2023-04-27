import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepperComponent } from '../../Components/StepperComponent';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { StepOne } from './ChildComponents/StepOne';
import { AppDispatch } from '../../store';
import { createUseStyles } from 'react-jss';
import { Theme } from '../../Styling/Theme';
import { useSelector } from 'react-redux';
import { StepTwo } from './ChildComponents/StepTwo';
import { getCreateTicket } from '../../Redux/Selectors';
import { StepThree } from './ChildComponents/StepThree';
import { RESET_CREATE_TICKET } from '../../Redux/Actions';

const useStyles = createUseStyles((theme: Theme) => {
	return {
		stepContent: {
			height: "calc(70% - 70px)",
			marginTop: "20px",
			width: 500,
			margin: "auto",
			overflowY: "auto",
		},
	};
});

export const EditTicket: React.FC<{dispatch: AppDispatch}> = ({ dispatch }) => {
	const [currentStep, setCurrentStep] = useState(0);
	const createTicket = useSelector(getCreateTicket);

	const classes = useStyles();

	const getCurrentStep = () => {
		switch(currentStep) {
			case 0:
				return <StepOne dispatch={dispatch} />
			case 1:
				return <StepTwo dispatch={dispatch} />
			case 2:
				return <StepThree dispatch={dispatch} />
		}
	}

	const getCondition = () => {
		switch(currentStep) {
			case 0:
				return createTicket.name && createTicket.priority && createTicket.assignee && createTicket.project;
			case 1:
				return createTicket.description;
			case 2:
				return true;
		}
	}

	useEffect(() => {
		return () => {
			dispatch({ type: RESET_CREATE_TICKET });
		}
	}, [dispatch])

  return (
		<Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: "10px", overflowX: "hidden", height: "100%" }}>
			<Box sx={{ width: '700px' }}>
				<Typography variant="h2" textAlign={"center"}>
					Edit Ticket - {createTicket.name}
				</Typography>
				<Stepper activeStep={currentStep} alternativeLabel sx={{ marginTop: "35px" }}>
					{[1,2,3].map((label) => (
						<Step key={label}>
							<StepLabel StepIconComponent={StepperComponent} />
						</Step>
					))}
				</Stepper>
				<div className={classes.stepContent}>
					{getCurrentStep()}
				</div>
				<div>
					<Button
						sx={{ float: "left", color: "white" }}
						variant='contained'
						disabled={!currentStep}
						onClick={() => {
							setCurrentStep(currentStep-1)
						}}
					>
						<FontAwesomeIcon icon={faArrowLeft} />
						&nbsp;Previous
					</Button>
					<Button
						sx={{ float: "right", color: "white" }}
						variant='contained'
						onClick={() => {
							setCurrentStep(currentStep+1)
						}}
						disabled={!getCondition()}
					>
						{currentStep === 2 ? "Create" : "Next"}&nbsp;
						<FontAwesomeIcon icon={faArrowRight} />
					</Button>
				</div>
			</Box>
		</Box>
  );
}