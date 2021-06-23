import { Container, Row, Col, Spinner } from "react-bootstrap";
import CopyrightLabel from "../components/CopyrightLabel";

export const Spinners = () => (
	<div className="d-flex justify-content-center">
		<Spinner animation="border" variant="danger" />
		<Spinner animation="border" variant="success" className="mx-1" />
		<Spinner animation="border" variant="primary" />
	</div>
);

export default function Loading() {
	return (
		<Container className="m-0 p-0" fluid>
			<Row className="h-full m-0 p-0">
				<Col className="col-centered">
					<Spinners />
				</Col>
				<CopyrightLabel />
			</Row>
		</Container>
	);
}