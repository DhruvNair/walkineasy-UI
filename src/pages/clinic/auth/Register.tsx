import { Container, Link, styled, Typography } from "@mui/material";
import { db } from "../../../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import ClinicRegisterForm from "../../../forms/ClinicRegisterForm";
import useToast from "../../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { NavLink as RouterLink } from "react-router-dom";
import { faker } from "@faker-js/faker";

const StyledContent = styled("div")(({ theme }) => ({
	maxWidth: 480,
	margin: "auto",
	minHeight: "100vh",
	display: "flex",
	justifyContent: "center",
	flexDirection: "column",
	padding: theme.spacing(12, 0),
}));

const ClinicRegister = () => {
	const { showToast, Toast } = useToast();
	const navigate = useNavigate();
	const auth = getAuth();
	const onRegister = async ({
		name,
		email,
		phone,
		street,
		city,
		province,
		password,
		standardEquipment,
		diagnosticEquipment,
		laboratoryEquipment,
	}: {
		name: string;
		email: string;
		phone: string;
		street: string;
		city: string;
		province: string;
		password: string;
		standardEquipment: string[];
		diagnosticEquipment: string[];
		laboratoryEquipment: string[];
	}) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const ref = doc(db, "Clinic Record", email);
			const docSnap = await getDoc(ref);
			if (docSnap.exists()) {
				showToast("Account Already Exists!");
			} else {
				await setDoc(ref, {
					name,
					email,
					phone,
					street,
					city,
					province,
					standardEquipment,
					diagnosticEquipment,
					laboratoryEquipment,
					id: faker.datatype.uuid(),
					doctors: [],
				})
					.then(() => {
						console.log("data added successfully");
						showToast("Registration Successful", "success");
						navigate("/clinic/");
					})
					.catch((error: Error) => {
						console.log(
							"Unsuccessful data operation, error:" + error
						);
						showToast("Something went wrong", "error");
					});
			}
		} catch (error) {
			if (error instanceof Error) {
				showToast(error.message, "error");
			} else {
				console.log("Unknown error: ", error);
			}
		}
	};
	return (
		<Container maxWidth="sm">
			<StyledContent>
				<Typography variant="h4" gutterBottom>
					Register as a Clinic
				</Typography>

				<Typography variant="body2" sx={{ mb: 5 }}>
					Not a clinic?{" "}
					<Link
						component={RouterLink}
						to="/client/auth/register"
						variant="subtitle2"
					>
						Register as a client
					</Link>
				</Typography>
				<ClinicRegisterForm
					loginPath="/clinic/auth/login"
					onRegister={onRegister}
				/>
			</StyledContent>
			{Toast}
		</Container>
	);
};

export default ClinicRegister;
