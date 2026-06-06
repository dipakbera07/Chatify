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


export function welcomeEmailTemplate({ name }) {
    return (
        <Html>
            <Head>
                <title>Welcome to Chatify</title>
            </Head>
            <Preview>Welcome to Chatify — your account is created successfully.</Preview>
            <Section>
                <Row>
                    <Heading as='h2'>Hello {name}</Heading>
                </Row>
                <Row>
                    <Text>
                        Your account has been successfully created. Welcome to Chatify!
                    </Text>
                    <Text>
                        We’re excited to have you join our community and start connecting with others on Chatify.                    </Text>
                    <Text>
                        Best regards,
                        Team Chatify
                    </Text>
                </Row>
            </Section>
        </Html>
    );
}