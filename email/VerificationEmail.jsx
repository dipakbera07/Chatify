import * as React from 'react';
import {
    Html,
    Head,
    Preview,
    Heading,
    Row,
    Section,
    Text
} from "@react-email/components"


export function EmailTemplate({ name,verifyCode }) {
    return (
        <Html>
            <Head>
                <title>Verification Code</title>
            </Head>
            <Preview>Heres your verification code: {verifyCode}</Preview>
            <Section>
                <Row>
                    <Heading as='h2'>Hello {name}</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering plaease use the verification code
                    </Text>
                    <Row>
                        <Heading as="h1">{verifyCode}</Heading>  {/* ✅ show OTP clearly */}
                    </Row>
                </Row>
            </Section>
        </Html>
    );
}