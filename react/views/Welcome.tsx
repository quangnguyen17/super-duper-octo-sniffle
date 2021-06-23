import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import firebase from "../firebase";
// components
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import CopyrightLabel from "../components/CopyrightLabel";
import Logo from "../components/Logo";
import Page from "../components/Page";
// views
import Loading from "../views/Loading";

// json
import metadata from "../metadata.json";

const UI_CONFIG = {
	signInFlow: "popup",
	signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.GithubAuthProvider.PROVIDER_ID],
	callbacks: {
		// Avoid redirects after sign-in.
		signInSuccessWithAuthResult: () => false,
	},
};

export default function Welcome() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const unsub = firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				setLoading(true);
				const idToken = await user.getIdToken(true);
				await axios.post(`/api/login?idToken=${idToken}`);
				cookie.set("idToken", idToken);
				router.reload();
			}
		});

		return () => unsub();
	}, []);

	if (loading) return <Loading />;

	return (
		<Page>
			<Container className="m-0 p-0" fluid>
				<Row className="h-full m-0 p-0">
					{loading ? (
						<Col className="col-centered" sm={12} md={12} lg={12}>
							<Spinner animation="border" />
						</Col>
					) : (
						<>
							<Col className="col-centered" sm={12} md={12} lg={6}>
								<div>
									<Logo />
									<p className="text-light w-75 mt-5 mx-auto">"{metadata.desc}"</p>
								</div>
							</Col>
							<Col className="col-centered" sm={12} md={12} lg={6}>
								<div>
									<h1 className="text-light">Getting started!</h1>
									<p className="text-secondary">• Select a sign in method</p>
									<StyledFirebaseAuth uiConfig={UI_CONFIG} firebaseAuth={firebase.auth()} />
								</div>
							</Col>
						</>
					)}
					<CopyrightLabel />
				</Row>
			</Container>
		</Page>
	);
}