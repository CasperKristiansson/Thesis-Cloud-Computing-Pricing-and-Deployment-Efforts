import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { createUseStyles } from 'react-jss';
import { Theme } from '../../Styling/Theme';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import Logo from '../../Assets/Logo.png';
import { useSelector } from 'react-redux';
import { getOperationInProgress, getToken, getUser } from '../../Redux/Selectors';

const useStyles = createUseStyles((theme: Theme) => {
	return {
		navbar: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '5px 1rem',
			width: "calc(100vw - 2rem)",
			backgroundColor: theme.navbar,
			height: "60px",
		},
		logo: {
			display: 'flex',
			alignItems: 'center',
			color: '#333',
			textDecoration: 'none',
			width: "500px",
			'&:hover': {
				color: '#000',
			},
			'& span': {
				color: theme.textWhite,
				fontSize: '2.5rem',
				marginTop: 6,
				marginLeft: 15,
				fontFamily: "'Poppins', sans-serif",
				"@media (max-width: 1150px)": {
					fontSize: '2rem',
					marginLeft: 10,
				},
			},
		},
		logoIcon: {
			marginRight: '0.5rem',
			fontSize: '1.5rem',
		},
		navLinks: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			gap: '1.2rem',
		},
		navLink: {
			color: theme.textWhite,
			textDecoration: 'none',
			'&:hover': {
				color: theme.textGreen,
			},
			'&.active': {
				color: theme.textGreen,
			},
		},
		profileButton: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 0,
			minWidth: 'auto',
			backgroundColor: 'transparent',
			border: 'none',
			cursor: 'pointer',
		},
		profileAvatar: {
			width: '2rem',
			height: '2rem',
			marginRight: '0.5rem',
		},
		logoImage: {
			height: 35,
			"@media (max-width: 1150px)": {
				height: 25,
			},
		}
	}
});

export const Navigation: React.FC<{}> = (): JSX.Element => {
	const classes = useStyles();
	const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
	const [adminPanelMenuAnchorEl, setAdminPanelMenuAnchorEl] = useState(null);

	const user = useSelector(getUser);
	const token = useSelector(getToken);
	const operationInProgress = useSelector(getOperationInProgress);

	const navigate = useNavigate();

	const handleProfileMenuClick = (event: any) => {
		setProfileMenuAnchorEl(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setProfileMenuAnchorEl(null);
	};

	const handleAdminPanelClick = (event: any) => {
		setAdminPanelMenuAnchorEl(event.currentTarget);
	};

	const handleAdminPanelClose = () => {
		setAdminPanelMenuAnchorEl(null);
	};

	const handleLogoutClick = () => {
		localStorage.removeItem("ats-token");
		navigate("/");
		window.location.reload();
	};

	const checkIfAdminAction = () => {
		switch (window.location.pathname) {
			case "/admin/manage-users":
				return true;
			case "/admin/manage-companies":
				return true;
			default:
				return false;
		}
	};

	const [imageURL, setImageURL] = React.useState("/profile.jpg");

	// Fetch profile picture
	React.useEffect(() => {
		async function getImage() {
			if (token !== '') {
				try {
					const response = await fetch("https://graph.microsoft.com/v1.0/me/photos/64x64/$value", {
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});

					const imageBlob = await response.blob();
					const url = URL.createObjectURL(imageBlob);
					setImageURL(url);
				} catch (error) {
					setImageURL("/profile.jpg");
				}
			}

		}
		getImage();
	}, [token]);

	return (
		<div className={classes.navbar}>
			<NavLink to="/" className={classes.logo}>
				<img src={Logo} alt="Logo" className={classes.logoImage} />
				<span>Ticket System</span>
			</NavLink>
			<div className={classes.navLinks}>

				{!operationInProgress &&
					<NavLink to="/" className={classes.navLink}>
						Home
					</NavLink>
				}

				{user.role && <>
					<NavLink to="/tickets" className={classes.navLink}>
						Tickets
					</NavLink>
					<NavLink to="/ticket/create" className={classes.navLink}>
						Create Ticket
					</NavLink>
					<NavLink to="/projects" className={classes.navLink}>
						Projects
					</NavLink>
					<NavLink to="/project/create" className={classes.navLink}>
						Create Project
					</NavLink>
				</>}

				{user.role === "ADMIN" &&
					<div onClick={handleAdminPanelClick} style={{ color: checkIfAdminAction() ? "#75BC5B" : "white", cursor: "pointer" }}>
						Admin Panel
					</div>
				}

				{user.role === "ADMIN" &&
					<Menu
						anchorEl={adminPanelMenuAnchorEl}
						open={Boolean(adminPanelMenuAnchorEl)}
						onClose={handleAdminPanelClose}
					>
						<MenuItem component={NavLink} to="/admin/manage-users" onClick={handleAdminPanelClose}>
							Manage Users
						</MenuItem>
						<MenuItem component={NavLink} to="/admin/manage-companies" onClick={handleAdminPanelClose}>
							Manage Companies
						</MenuItem>
					</Menu>
				}

				{user?.role &&
					<>
						<Button className={classes.profileButton} onClick={handleProfileMenuClick}>
							<Avatar alt="Profile picture" src={imageURL} className={classes.profileAvatar} />
						</Button>

						<Menu anchorEl={profileMenuAnchorEl} open={Boolean(profileMenuAnchorEl)} onClose={handleProfileMenuClose}>
							<MenuItem onClick={handleLogoutClick}>
								<FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '0.5rem' }} /> Logout
							</MenuItem>
						</Menu>
					</>
				}

				{!token &&
					<Button
						variant="contained"
						//className={classes.loginButton}
						sx={{ ml: 2 }}
						component={Link}
						to="/login"
					>
						Login
					</Button>
				}
			</div>
		</div>
	);
}