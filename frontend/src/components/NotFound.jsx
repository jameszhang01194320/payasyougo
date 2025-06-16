import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';

function NotFound() {
    const navigate = useNavigate();
    const [countDown, setCountDown] = useState(10);

    useEffect(() => {
        const count = setInterval(() => {
            setCountDown(prevCount => prevCount - 1);
            if (countDown <= 1) {
                clearInterval(count);
                navigate("/");
            }
        }, 1000);

        return () => clearInterval(count);  // clean timer
    }, [countDown, navigate]);

    return (
        <Container className="text-center mt-5">
            <Alert variant="danger">
                <h2>404 - Not Found</h2>
                <p>Sorry, the world cannot be saved today ):</p>
            </Alert>
            <p>You will be redirected to the home page in <strong>{countDown}</strong> seconds or you can...</p>
            <Button variant="primary" as={Link} to="/">
                Go Home!
            </Button>
        </Container>
    );
}

export default NotFound;
